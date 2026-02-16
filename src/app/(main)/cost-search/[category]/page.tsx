import { Metadata } from 'next';
import Link from 'next/link';
import { TrackPageView } from '@/components/analytics/track-page-view';
import CareGuide from '@/components/care-guide';
import { CTABanner } from '@/components/cta-banner';
import { AnimateOnScroll, IconBadge, PriceBar } from '@/components/ui';
import { getAllCategorySlugs, getCategoryBySlug, FEE_CATEGORIES } from '@/lib/fee-categories';
import { findCostSeedMatches } from '@/lib/cost-search-seed';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: '카테고리 없음' };

  return {
    title: `${category.title} 비용 비교 | PetHealth+`,
    description: category.metaDescription,
    openGraph: {
      title: `강아지·고양이 ${category.title} 비용, 얼마가 적정일까?`,
      description: category.metaDescription,
      images: [`/api/og?title=${encodeURIComponent(`${category.title} 비용 비교`)}&category=${category.slug}`],
    },
  };
}

type PriceItem = { name: string; avg: number; min: number; max: number };

function getCategorySeedItems(seedKeywords: string[]): PriceItem[] {
  const items: PriceItem[] = [];
  const seen = new Set<string>();

  seedKeywords.forEach((keyword) => {
    findCostSeedMatches(keyword, 'dog').forEach((match) => {
      if (!seen.has(match.item)) {
        seen.add(match.item);
        items.push({ name: match.item, avg: match.avg, min: match.min, max: match.max });
      }
    });
  });

  return items.sort((a, b) => a.avg - b.avg);
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
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

  const seedItems = getCategorySeedItems(category.seedKeywords);

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <TrackPageView eventName="category_view" params={{ category_slug: category.slug }} />
      <div className="mx-auto w-full max-w-4xl">
        <section className="py-12 md:py-16">
          <AnimateOnScroll animation="fade-up">
            <Link href="/cost-search" className="mb-6 inline-flex text-sm text-[#8B6B4E] hover:text-[#F97316]">
              ← 진료비 검색
            </Link>
            <div className="mb-8 flex items-center gap-4">
              <IconBadge icon={<span className="text-xl">{category.icon}</span>} color="orange" size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">{category.title}</h1>
                <p className="mt-1 text-sm text-[#8B6B4E]">{category.description}</p>
              </div>
            </div>
          </AnimateOnScroll>

          <nav className="mb-6 flex flex-wrap gap-2">
            {FEE_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/cost-search/${c.slug}`} className={`rounded-full px-4 py-2 text-xs font-semibold ${c.slug === category.slug ? 'bg-[#F97316] text-white' : 'border border-[#E8D5C0] bg-white text-[#6B4226]'}`}>
                {c.title}
              </Link>
            ))}
          </nav>

          {seedItems.length > 0 ? (
            <div className="space-y-3">
              {seedItems.map((item, i) => (
                <AnimateOnScroll key={item.name} animation="fade-up" delay={i * 50}>
                  <article className="rounded-2xl border border-[#F8C79F]/10 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#4F2A1D]">{item.name}</h3>
                        <p className="text-xs text-[#8B6B4E]">{category.title}</p>
                      </div>
                      <p className="text-xl font-bold text-[#F97316] md:text-2xl">{Math.round(item.avg).toLocaleString('ko-KR')}원</p>
                    </div>
                    <div className="mt-4">
                      <PriceBar min={item.min} avg={item.avg} max={item.max} />
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <article className="rounded-2xl border border-[#F8C79F]/10 bg-white p-8 text-center">
              <p className="text-lg font-semibold text-[#4F2A1D]">데이터 준비 중이에요</p>
            </article>
          )}
        </section>

        <CareGuide keyword={category.title} categorySlug={category.slug} matchedTags={category.relatedCareTags} />

        <article className="mt-6 rounded-2xl border border-[#F8C79F]/10 bg-white p-6">
          <p className="text-sm font-semibold text-[#8B6B4E]">카테고리 분석 다음 단계</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CTABanner variant="ai-care" context="cost-category-bottom" />
            <CTABanner variant="app-download" context="cost-category-bottom" />
          </div>
        </article>
      </div>
    </section>
  );
}
