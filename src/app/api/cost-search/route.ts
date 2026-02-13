import { verifyBearerToken } from '@/lib/auth-server';
import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type Species = Database['public']['Enums']['pet_species'];

type PriceStats = {
  min: number;
  max: number;
  avg: number;
  median: number;
  sampleSize: number;
  source: 'user_data' | 'seed_data' | 'mixed';
};

type CostSearchResponse = {
  query: string;
  species: Species;
  region: string | null;
  priceStats: PriceStats;
  nationalAvg: number | null;
  regionalAvg: number | null;
  relatedItems: string[];
};

type CachedEntry = {
  expiresAt: number;
  payload: CostSearchResponse;
};

type SeedRangeRow = {
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  medianPrice: number | null;
  sampleSize: number | null;
  nationalAvg: number | null;
  regionalAvg: number | null;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MINIMUM_SAMPLE_SIZE = 10;

const responseCache = new Map<string, CachedEntry>();
const usageStore = new Map<string, number>();

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

function getCacheKey(query: string, species: Species, region: string | null): string {
  return `${query.toLowerCase()}::${species}::${region?.toLowerCase() ?? 'all'}`;
}

function getMonthlyUsageKey(identifier: string): string {
  const monthKey = new Date().toISOString().slice(0, 7);
  return `${monthKey}:${identifier}`;
}

function enforceMonthlyLimit(identifier: string, limit: number): void {
  if (!Number.isFinite(limit)) {
    return;
  }

  const key = getMonthlyUsageKey(identifier);
  const currentUsage = usageStore.get(key) ?? 0;

  if (currentUsage >= limit) {
    throw new Error('MONTHLY_LIMIT_EXCEEDED');
  }

  usageStore.set(key, currentUsage + 1);
}

function parseSpecies(rawSpecies: string | null): Species | null {
  if (rawSpecies === 'dog' || rawSpecies === 'cat' || rawSpecies === 'etc') {
    return rawSpecies;
  }

  return null;
}

function parseRegion(rawRegion: string | null): string | null {
  if (!rawRegion || rawRegion.trim() === '' || rawRegion === '전국') {
    return null;
  }

  return rawRegion.trim();
}

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

function computePriceStats(prices: number[]): Omit<PriceStats, 'source'> | null {
  if (prices.length === 0) {
    return null;
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Number((average(prices) ?? 0).toFixed(2)),
    median: Number((median(prices) ?? 0).toFixed(2)),
    sampleSize: prices.length
  };
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeSeedRangeRow(row: Record<string, unknown> | null): SeedRangeRow | null {
  if (!row) {
    return null;
  }

  return {
    minPrice: coerceNumber(row.min_price ?? row.minPrice),
    maxPrice: coerceNumber(row.max_price ?? row.maxPrice),
    avgPrice: coerceNumber(row.avg_price ?? row.avgPrice),
    medianPrice: coerceNumber(row.median_price ?? row.medianPrice),
    sampleSize: coerceNumber(row.sample_size ?? row.sampleSize),
    nationalAvg: coerceNumber(row.national_avg ?? row.nationalAverage ?? row.avg_price),
    regionalAvg: coerceNumber(row.regional_avg ?? row.regionalAverage ?? row.avg_price)
  };
}

function buildRelatedItems(itemNames: string[], categoryTags: Array<string | null>): string[] {
  const freq = new Map<string, number>();

  for (const token of [...itemNames, ...categoryTags.filter((tag): tag is string => Boolean(tag))]) {
    const normalized = token.trim();
    if (!normalized) {
      continue;
    }

    freq.set(normalized, (freq.get(normalized) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([text]) => text);
}

async function getUserMembership(firebaseUid: string): Promise<{ appUserId: string | null; isPremium: boolean }> {
  const supabase = getSupabaseServerClient();
  const userResult = await supabase.from('users').select('id, is_premium').eq('firebase_uid', firebaseUid).maybeSingle();

  if (userResult.error || !userResult.data) {
    return { appUserId: null, isPremium: false };
  }

  const typedUser = userResult.data as unknown as { id: string; is_premium?: boolean };
  return { appUserId: typedUser.id, isPremium: Boolean(typedUser.is_premium) };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim() ?? '';
  const species = parseSpecies(request.nextUrl.searchParams.get('species'));
  const region = parseRegion(request.nextUrl.searchParams.get('region'));

  if (!query) {
    return NextResponse.json({ error: 'query parameter is required' }, { status: 400 });
  }

  if (!species) {
    return NextResponse.json({ error: 'species must be one of dog, cat, etc' }, { status: 400 });
  }

  try {
    const authorizationHeader = request.headers.get('authorization') ?? undefined;
    let userIdForLimit: string;
    let limit = 3;

    if (authorizationHeader) {
      const decoded = await verifyBearerToken(authorizationHeader);
      const membership = await getUserMembership(decoded.uid);

      userIdForLimit = `member:${membership.appUserId ?? decoded.uid}`;
      limit = membership.isPremium ? Number.POSITIVE_INFINITY : 10;
    } else {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
      userIdForLimit = `guest:${ip}`;
    }

    enforceMonthlyLimit(userIdForLimit, limit);

    const cacheKey = getCacheKey(query, species, region);
    const cached = responseCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.payload, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Cache': 'HIT'
        }
      });
    }

    const supabase = getSupabaseServerClient();

    const healthItemsResult = await supabase
      .from('health_items')
      .select(
        'item_name, category_tag, price, health_records!inner(hospital_id, pets!inner(species), hospitals(region))'
      )
      .or(`category_tag.ilike.%${query}%,item_name.ilike.%${query}%`)
      .eq('health_records.pets.species', species)
      .limit(1000);

    if (healthItemsResult.error) {
      throw healthItemsResult.error;
    }

    type HealthItemRow = {
      item_name: string;
      category_tag: string | null;
      price: number;
      health_records: {
        hospitals: {
          region: string | null;
        } | null;
      };
    };

    const rows = (healthItemsResult.data ?? []) as unknown as HealthItemRow[];

    const filteredRows = rows.filter((row) => {
      if (!region) {
        return true;
      }

      const rowRegion = row.health_records.hospitals?.region;
      return rowRegion ? rowRegion.includes(region) : false;
    });

    const regionalPrices = filteredRows.map((row) => row.price).filter((price) => Number.isFinite(price));
    const nationalPrices = rows.map((row) => row.price).filter((price) => Number.isFinite(price));
    const regionalAvg = average(regionalPrices);
    const nationalAvg = average(nationalPrices);

    const relatedItems = buildRelatedItems(
      rows.map((row) => row.item_name),
      rows.map((row) => row.category_tag)
    );

    const regionalStats = computePriceStats(regionalPrices);

    let response: CostSearchResponse;

    if (regionalStats && regionalStats.sampleSize >= MINIMUM_SAMPLE_SIZE) {
      response = {
        query,
        species,
        region,
        priceStats: {
          ...regionalStats,
          source: 'user_data'
        },
        nationalAvg: nationalAvg ? Number(nationalAvg.toFixed(2)) : null,
        regionalAvg: regionalAvg ? Number(regionalAvg.toFixed(2)) : null,
        relatedItems
      };
    } else {
      const seedResult = await supabase
        .from('seed_price_ranges' as never)
        .select('*')
        .or(`category_tag.ilike.%${query}%,item_name.ilike.%${query}%`)
        .eq('species', species)
        .or(region ? `region.eq.${region},region.is.null` : 'region.is.null')
        .order('region', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (seedResult.error) {
        throw seedResult.error;
      }

      const seedData = normalizeSeedRangeRow((seedResult.data as Record<string, unknown> | null) ?? null);

      if (!seedData || seedData.minPrice === null || seedData.maxPrice === null) {
        return NextResponse.json({ error: 'Not enough data for this query yet' }, { status: 404 });
      }

      const hasSomeUserData = Boolean(regionalStats && regionalStats.sampleSize > 0);
      const userSample = regionalStats?.sampleSize ?? 0;
      const seedSample = seedData.sampleSize ?? MINIMUM_SAMPLE_SIZE;

      const combinedAverage = hasSomeUserData
        ? ((regionalStats?.avg ?? 0) * userSample + (seedData.avgPrice ?? 0) * seedSample) / (userSample + seedSample)
        : seedData.avgPrice ?? 0;

      response = {
        query,
        species,
        region,
        priceStats: {
          min: hasSomeUserData ? Math.min(regionalStats?.min ?? seedData.minPrice, seedData.minPrice) : seedData.minPrice,
          max: hasSomeUserData ? Math.max(regionalStats?.max ?? seedData.maxPrice, seedData.maxPrice) : seedData.maxPrice,
          avg: Number(combinedAverage.toFixed(2)),
          median: Number((seedData.medianPrice ?? seedData.avgPrice ?? combinedAverage).toFixed(2)),
          sampleSize: hasSomeUserData ? userSample + seedSample : seedSample,
          source: hasSomeUserData ? 'mixed' : 'seed_data'
        },
        nationalAvg: seedData.nationalAvg ?? (nationalAvg ? Number(nationalAvg.toFixed(2)) : null),
        regionalAvg: seedData.regionalAvg ?? (regionalAvg ? Number(regionalAvg.toFixed(2)) : null),
        relatedItems
      };
    }

    responseCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload: response
    });

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (message === 'MONTHLY_LIMIT_EXCEEDED') {
      return NextResponse.json({ error: '월간 검색 한도를 초과했습니다.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Failed to search cost data' }, { status: 500 });
  }
}
