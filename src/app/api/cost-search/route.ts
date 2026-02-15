import { findCostSeedMatches } from '@/lib/cost-search-seed';
import { NextRequest, NextResponse } from 'next/server';

/* ─────────────────────────────────────────────────
 * 타입
 * ───────────────────────────────────────────────── */

type Species = 'dog' | 'cat' | 'etc';

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
  dataInfo: {
    totalRecords: number;
    latestDate: string | null;
  };
};

type CachedEntry = {
  expiresAt: number;
  payload: CostSearchResponse;
};

/* ─────────────────────────────────────────────────
 * 캐시
 * ───────────────────────────────────────────────── */
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4시간
const responseCache = new Map<string, CachedEntry>();

/* ─────────────────────────────────────────────────
 * 유틸
 * ───────────────────────────────────────────────── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';

function getCacheKey(query: string, species: Species, region: string | null): string {
  return `${query.toLowerCase()}::${species}::${region?.toLowerCase() ?? 'all'}`;
}

function parseSpecies(raw: string | null): Species | null {
  if (raw === 'dog' || raw === 'cat' || raw === 'etc') return raw;
  return null;
}

function parseRegion(raw: string | null): string | null {
  if (!raw || raw.trim() === '' || raw === '전국') return null;
  return raw.trim();
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/* ─────────────────────────────────────────────────
 * FastAPI에서 실데이터 가져오기
 * ───────────────────────────────────────────────── */
type FastApiResult = {
  priceStats: PriceStats | null;
  nationalAvg: number;
  regionalAvg: number;
  relatedItems: string[];
  matchedItem: string;
  totalRecords: number;
  latestDate: string | null;
};

async function fetchFromFastAPI(
  query: string,
  species: Species,
  region: string | null,
): Promise<FastApiResult | null> {
  try {
    const params = new URLSearchParams({ query, species });
    if (region) params.set('region', region);

    const res = await fetch(`${API_BASE}/api/cost/search?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000), // 8초 타임아웃
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.priceStats || data.priceStats.sampleSize === 0) return null;

    return {
      priceStats: data.priceStats,
      nationalAvg: data.nationalAvg,
      regionalAvg: data.regionalAvg,
      relatedItems: data.relatedItems ?? [],
      matchedItem: data.matchedItem ?? query,
      totalRecords: data.dataInfo?.totalRecords ?? 0,
      latestDate: data.dataInfo?.latestDate ?? null,
    };
  } catch {
    // FastAPI 호출 실패 시 null 반환 → 시드 폴백
    return null;
  }
}

/* ─────────────────────────────────────────────────
 * GET 핸들러
 * ───────────────────────────────────────────────── */
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

  // 캐시 확인
  const cacheKey = getCacheKey(query, species, region);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload);
  }

  // 1. FastAPI 실데이터 시도
  const fastApiResult = await fetchFromFastAPI(query, species, region);

  // 2. 시드 데이터 (폴백)
  const seedMatches = findCostSeedMatches(query, species);
  const seedPrices = seedMatches.flatMap((item) => [item.min, item.avg, item.max]);

  const hasRealData = fastApiResult !== null && (fastApiResult.priceStats?.sampleSize ?? 0) >= 3;
  const hasSeedData = seedMatches.length > 0;

  if (!hasRealData && !hasSeedData) {
    return NextResponse.json(
      { error: '해당 항목의 데이터가 아직 충분하지 않아요.' },
      { status: 404 },
    );
  }

  // 3. 응답 구성
  let response: CostSearchResponse;

  if (hasRealData && fastApiResult) {
    // 실데이터 우선
    const stats = fastApiResult.priceStats!;
    if (hasSeedData) {
      stats.source = 'mixed';
    }

    response = {
      query,
      matchedItem: fastApiResult.matchedItem,
      species,
      region,
      priceStats: stats,
      nationalAvg: fastApiResult.nationalAvg,
      regionalAvg: fastApiResult.regionalAvg,
      relatedItems: fastApiResult.relatedItems,
      sources: [
        `실제 진료 기록 ${fastApiResult.totalRecords}건 기반`,
        ...(hasSeedData ? ['공공데이터 참고 범위 포함'] : []),
      ],
      dataInfo: {
        totalRecords: fastApiResult.totalRecords,
        latestDate: fastApiResult.latestDate,
      },
    };
  } else {
    // 시드만
    response = {
      query,
      matchedItem: seedMatches[0].item,
      species,
      region,
      priceStats: {
        min: Math.min(...seedPrices),
        max: Math.max(...seedPrices),
        avg: Number(average(seedMatches.map((s) => s.avg)).toFixed(0)),
        median: Number(median(seedMatches.map((s) => s.avg)).toFixed(0)),
        sampleSize: seedPrices.length,
        source: 'seed_data',
      },
      nationalAvg: Number(average(seedMatches.map((s) => s.avg)).toFixed(0)),
      regionalAvg: Number(average(seedMatches.map((s) => s.avg)).toFixed(0)),
      relatedItems: seedMatches.map((s) => s.item).slice(0, 8),
      sources: ['공공데이터 기준 참고 범위'],
      dataInfo: { totalRecords: 0, latestDate: null },
    };
  }

  // 캐시 저장
  responseCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload: response });

  return NextResponse.json(response);
}
