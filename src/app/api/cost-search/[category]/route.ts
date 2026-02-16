import { NextRequest, NextResponse } from 'next/server';
import { COST_SEARCH_SEED_DATA } from '@/lib/cost-search-seed';
import { getCategoryBySlug } from '@/lib/fee-categories';

const RENDER_API_BASE = process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://pethealthplus.onrender.com';
const RENDER_TIMEOUT = 5000;

type Species = 'dog' | 'cat' | 'etc';

type CostSearchItem = {
  item: string;
  category: string;
  species: Species;
  region: string;
  avg: number;
  min: number;
  max: number;
  count: number;
  updatedAt: string | null;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } },
) {
  const { searchParams } = new URL(request.url);
  const species = (searchParams.get('species') || 'dog') as Species;
  const region = searchParams.get('region') || '전국';
  const slug = params.category;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RENDER_TIMEOUT);

    const res = await fetch(
      `${RENDER_API_BASE}/api/cost/category/${slug}?species=${species}&region=${encodeURIComponent(region)}`,
      { signal: controller.signal, cache: 'no-store' },
    );

    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as { results?: CostSearchItem[]; total?: number };
      if (Array.isArray(data.results) && data.results.length > 0) {
        return NextResponse.json({ ...data, source: 'live' });
      }
    }
  } catch {
    // Render failed -> seed fallback
  }

  const category = getCategoryBySlug(slug);
  if (!category) {
    return NextResponse.json({ results: [], total: 0, source: 'seed' });
  }

  const filtered = COST_SEARCH_SEED_DATA.filter((item) => {
    const speciesMatch = item.species === species;
    const keywordMatch =
      category.seedKeywords.some((kw) => item.item.includes(kw) || item.category.includes(kw)) ||
      category.searchTags.some((tag) => item.item.includes(tag) || item.category.includes(tag));
    return speciesMatch && keywordMatch;
  });

  const seedResults: CostSearchItem[] = filtered.slice(0, 50).map((item) => ({
    item: item.item,
    category: item.category,
    species: item.species,
    region: '전국',
    avg: item.avg,
    min: item.min,
    max: item.max,
    count: 1,
    updatedAt: null,
  }));

  return NextResponse.json({
    results: seedResults,
    total: filtered.length,
    source: 'seed',
  });
}
