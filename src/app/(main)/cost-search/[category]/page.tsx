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
  const categoryNavClass = 'rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ';

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
              <Link
                key={c.slug}
                href={'/cost-search/' + c.slug}
                className={
                  categoryNavClass +
                  (c.slug === category.slug ? 'bg-[#F97316] text-white' : 'border border-[#E8D5C0] bg-white text-[#6B4226] hover:border-[#F97316]/40 hover:text-[#F97316]')
                }
              >
                {c.title}
              </Link>
            ))}
          </nav>

          {seedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {seedItems.map((item, i) => (
                <AnimateOnScroll key={item.name} animation="fade-up" delay={i * 100}>
                  <article className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#1F2937]">{item.name}</h3>
                      <span className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-xs font-medium text-[#16A34A]">실데이터</span>
                    </div>
                    <PriceBar min={item.min} avg={item.avg} max={item.max} />
                    <div className="mt-3 flex justify-between text-xs text-[#94A3B8]">
                      <span>최저 {Math.round(item.min).toLocaleString('ko-KR')}원</span>
                      <span className="font-semibold text-[#F97316]">평균 {Math.round(item.avg).toLocaleString('ko-KR')}원</span>
                      <span>최고 {Math.round(item.max).toLocaleString('ko-KR')}원</span>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <AnimateOnScroll animation="fade-in">
              <article className="rounded-2xl border border-[#F8C79F]/10 bg-white px-8 py-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#48B8D0]/10">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#48B8D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-bold text-[#0B3041]">현재 데이터를 수집하고 있어요</p>
                <p className="mb-1 text-sm text-[#6B7280]">전국 동물병원의 실제 진료비를 모으고 있습니다.</p>
                <p className="mb-6 text-sm text-[#6B7280]">곧 정확한 비교 데이터를 제공해드릴게요!</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/ai-care" className="rounded-full bg-[#48B8D0] px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5">
                    AI로 예상 진료비 보기
                  </Link>
                </div>
              </article>
            </AnimateOnScroll>
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
