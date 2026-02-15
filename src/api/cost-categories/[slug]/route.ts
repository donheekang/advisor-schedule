import { getCategoryBySlug } from '@/lib/fee-categories';
import { findCostSeedMatches } from '@/lib/cost-search-seed';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';

type CategoryItem = {
  name: string;
  avg: number;
  min: number;
  max: number;
  median: number;
  sampleSize: number;
  source: 'user_data' | 'seed_data' | 'mixed';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const items: CategoryItem[] = [];
  let totalSampleSize = 0;

  // 1. FastAPI에서 실데이터 가져오기
  if (category.searchTags.length > 0) {
    try {
      const tagsParam = category.searchTags.join(',');
      const res = await fetch(
        `${API_BASE}/api/cost/category-stats?tags=${encodeURIComponent(tagsParam)}`,
        { signal: AbortSignal.timeout(8000) },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          for (const item of data.items) {
            items.push({
              name: item.name,
              avg: item.avg,
              min: item.min,
              max: item.max,
              median: item.median,
              sampleSize: item.sampleSize,
              source: 'user_data',
            });
            totalSampleSize += item.sampleSize;
          }
        }
      }
    } catch {
      // FastAPI 실패 시 시드로 폴백
    }
  }

  // 2. 시드 데이터로 보완
  for (const keyword of category.seedKeywords) {
    const seedMatches = findCostSeedMatches(keyword, 'dog');
    for (const seed of seedMatches) {
      const alreadyExists = items.some(
        (i) => i.name.replace(/\s/g, '').toLowerCase() === seed.item.replace(/\s/g, '').toLowerCase(),
      );
      if (!alreadyExists) {
        items.push({
          name: seed.item,
          avg: seed.avg,
          min: seed.min,
          max: seed.max,
          median: seed.avg,
          sampleSize: 1,
          source: 'seed_data',
        });
        totalSampleSize += 1;
      }
    }
  }

  items.sort((a, b) => a.avg - b.avg);

  return NextResponse.json(
    {
      slug: category.slug,
      title: category.title,
      icon: category.icon,
      description: category.description,
      items,
      totalSampleSize,
      latestDate: null,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
