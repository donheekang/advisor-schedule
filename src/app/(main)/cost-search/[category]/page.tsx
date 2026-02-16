import { Metadata } from 'next';
import { getCategoryBySlug, getAllCategorySlugs, FEE_CATEGORIES } from '@/lib/fee-categories';
import { findCostSeedMatches } from '@/lib/cost-search-seed';
import Link from 'next/link';
import { TrackPageView } from '@/components/analytics/track-page-view';
import { CTABanner } from '@/components/cta-banner';
import CareGuide from '@/components/care-guide';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category);
  if (!cat) return { title: '카테고리 없음' };

  return {
    title: `${cat.title} 비용 비교 | PetHealth+`,
    description: cat.metaDescription,
    openGraph: {
      title: `강아지·고양이 ${cat.title} 비용, 얼마가 적정일까?`,
      description: cat.metaDescription,
      images: [`/api/og?title=${encodeURIComponent(`${cat.title} 비용 비교`)}&category=${cat.slug}`],
    },
  };
}

type PriceItem = {
  name: string;
  avg: number;
  min: number;
  max: number;
};

function getCategorySeedItems(seedKeywords: string[]): PriceItem[] {
  const items: PriceItem[] = [];
  const seen = new Set<string>();

  for (const keyword of seedKeywords) {
    const matches = findCostSeedMatches(keyword, 'dog');
    for (const m of matches) {
      if (!seen.has(m.item)) {
        seen.add(m.item);
        items.push({ name: m.item, avg: m.avg, min: m.min, max: m.max });
      }
    }
  }

  return items.sort((a, b) => a.avg - b.avg);
}

function toWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = getCategoryBySlug(params.category);
  if (!cat) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="mt-4 text-2xl font-bold text-[#4F2A1D]">카테고리를 찾을 수 없어요</h1>
        <Link href="/cost-search" className="mt-4 inline-block text-[#F97316] underline">
          진료비 검색으로 돌아가기
        </Link>
      </section>
    );
  }

  const seedItems = getCategorySeedItems(cat.seedKeywords);

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <TrackPageView eventName="category_view" params={{ category_slug: cat.slug }} />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-3">
          <Link
            href="/cost-search"
            className="inline-flex items-center gap-1 text-sm text-[#A36241] transition hover:text-[#F97316]"
          >
            ← 진료비 검색
          </Link>
          <div className="space-y-1">
            <p className="text-4xl">{cat.icon}</p>
            <h1 className="text-3xl font-extrabold text-[#4F2A1D]">{cat.title} 비용 비교</h1>
            <p className="text-sm text-[#7C4A2D]">{cat.description}</p>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2">
          {FEE_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cost-search/${c.slug}`}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                c.slug === cat.slug
                  ? 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white shadow-md'
                  : 'border border-[#F8C79F] bg-white text-[#7C4A2D] hover:bg-[#FFF8F0]'
              }`}
            >
              {c.icon} {c.title}
            </Link>
          ))}
        </nav>

        {seedItems.length > 0 ? (
          <article className="space-y-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
            <h2 className="text-lg font-extrabold text-[#4F2A1D]">📊 {cat.title} 항목별 평균 비용</h2>
            <div className="space-y-3">
              {seedItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-4 ring-1 ring-[#F8C79F]/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#4F2A1D]">{item.name}</p>
                    <p className="text-lg font-extrabold text-[#F97316]">{toWon(item.avg)}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[#A36241]">
                    <span>최소 {toWon(item.min)}</span>
                    <span>~</span>
                    <span>최대 {toWon(item.max)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[#FFE7CF]">
                    <div
                      className="h-2 rounded-full bg-[#F97316]"
                      style={{
                        width: `${Math.max(10, ((item.avg - item.min) / (item.max - item.min)) * 100)}%`,
                        marginLeft: `${Math.max(0, (item.min / item.max) * 100 * 0.3)}%`,
                      }}
                    />
                  </div>
                  <Link
                    href={`/cost-search?q=${encodeURIComponent(item.name)}`}
                    className="mt-2 inline-block text-xs font-semibold text-[#F97316] underline"
                  >
                    상세 비교하기 →
                  </Link>
                </div>
              ))}
            </div>
          </article>
        ) : (
          <article className="rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
            <p className="text-5xl">📋</p>
            <p className="mt-4 text-lg font-bold text-[#4F2A1D]">데이터 준비 중이에요</p>
            <p className="mt-2 text-sm text-[#A36241]">
              이 카테고리의 실데이터가 충분히 모이면 통계를 보여드릴게요.
            </p>
          </article>
        )}

        <CareGuide keyword={cat.title} categorySlug={cat.slug} matchedTags={cat.relatedCareTags} />

        <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
          <p className="text-sm font-semibold text-[#7C4A2D]">카테고리 분석 다음 단계</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CTABanner variant="ai-care" context="cost-category-bottom" />
            <CTABanner variant="app-download" context="cost-category-bottom" />
          </div>
        </article>
      </div>
    </section>
  );
}
