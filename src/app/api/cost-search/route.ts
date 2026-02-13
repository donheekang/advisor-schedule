import { Database } from '@/types/database';
import { findCostSeedMatches } from '@/lib/cost-search-seed';
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
  matchedItem: string;
  species: Species;
  region: string | null;
  priceStats: PriceStats;
  nationalAvg: number;
  regionalAvg: number;
  relatedItems: string[];
  sources: string[];
};

type CachedEntry = {
  expiresAt: number;
  payload: CostSearchResponse;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const responseCache = new Map<string, CachedEntry>();

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
}

function getCacheKey(query: string, species: Species, region: string | null): string {
  return `${query.toLowerCase()}::${species}::${region?.toLowerCase() ?? 'all'}`;
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

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

function mergePriceStats(seedPrices: number[], userPrices: number[]): PriceStats {
  const allPrices = [...seedPrices, ...userPrices].filter((price) => Number.isFinite(price));
  const source: PriceStats['source'] = userPrices.length > 0 ? 'mixed' : 'seed_data';

  return {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices),
    avg: Number(average(allPrices).toFixed(2)),
    median: Number(median(allPrices).toFixed(2)),
    sampleSize: allPrices.length,
    source
  };
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

  const cacheKey = getCacheKey(query, species, region);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload);
  }

  const seedMatches = findCostSeedMatches(query, species);

  if (seedMatches.length === 0) {
    return NextResponse.json({ error: '검색어와 일치하는 시드 데이터가 없습니다.' }, { status: 404 });
  }

  const seedPrices = seedMatches.flatMap((item) => [item.min, item.avg, item.max]);
  const seedStats = {
    min: Math.min(...seedMatches.map((item) => item.min)),
    max: Math.max(...seedMatches.map((item) => item.max)),
    avg: Number(average(seedMatches.map((item) => item.avg)).toFixed(2))
  };

  let userPrices: number[] = [];
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const healthItemsResult = await supabase
      .from('health_items')
      .select('item_name, category_tag, price, health_records!inner(hospitals(region), pets!inner(species))')
      .or(`item_name.ilike.%${query}%,category_tag.ilike.%${query}%`)
      .eq('health_records.pets.species', species)
      .limit(500);

    if (!healthItemsResult.error) {
      type HealthItemRow = {
        item_name: string;
        category_tag: string | null;
        price: number;
        health_records: { hospitals: { region: string | null } | null };
      };

      const rows = (healthItemsResult.data ?? []) as unknown as HealthItemRow[];
      userPrices = rows
        .filter((row) => {
          if (!region) {
            return true;
          }

          const rowRegion = row.health_records.hospitals?.region;
          return rowRegion ? rowRegion.includes(region) : false;
        })
        .map((row) => row.price)
        .filter((price) => Number.isFinite(price));
    }
  }

  const stats = mergePriceStats(seedPrices, userPrices);
  const response: CostSearchResponse = {
    query,
    matchedItem: seedMatches[0].item,
    species,
    region,
    priceStats: stats,
    nationalAvg: userPrices.length > 0 ? Number(average(userPrices).toFixed(2)) : seedStats.avg,
    regionalAvg: userPrices.length > 0 ? Number(average(userPrices).toFixed(2)) : seedStats.avg,
    relatedItems: seedMatches.map((item) => item.item).slice(0, 8),
    sources: ['공공데이터 기준 참고 범위', ...(userPrices.length > 0 ? ['health_records + health_items 집계'] : [])]
  };

  responseCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload: response
  });

  return NextResponse.json(response);
}
