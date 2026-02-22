import { Metadata } from 'next';
import Link from 'next/link';
import { TrackPageView } from '@/components/analytics/track-page-view';
import CareGuide from '@/components/care-guide';
import { PriceBar } from '@/components/ui';
import { getAllCategorySlugs, getCategoryBySlug, FEE_CATEGORIES } from '@/lib/fee-categories';
import { findCostSeedMatches } from '@/lib/cost-search-seed';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: '카테고리 없음' };
  return {
    title: `${category.title} 비용 비교 | PetHealth+`,
    description: category.metaDescription,
    openGraph: {
      title: `강아지·고양이 ${category.title} 비용, 얼마가 적정일까?`,
      description: category.metaDescription,
      images: [
        `/api/og?title=${encodeURIComponent(`${category.title} 비용 비교`)}&category=${category.slug}`,
      ],
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
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="text-lg font-bold text-[#191F28]">카테고리를 찾을 수 없어요</h1>
        <Link
          href="/cost-search"
          className="mt-4 inline-block text-sm font-semibold text-[#191F28] underline"
        >
          진료비 검색으로 돌아가기
        </Link>
      </section>
    );
  }

  const seedItems = getCategorySeedItems(category.seedKeywords);

  return (
    <section className="w-full bg-white pb-10 pt-24 md:pt-28">
      <TrackPageView eventName="category_view" params={{ category_slug: category.slug }} />

      <div className="mx-auto w-full max-w-lg px-5">
        {/* 헤더 */}
        <header className="border-b-8 border-[#F2F4F6] pb-6">
          <Link
            href="/cost-search"
            className="mb-4 inline-flex text-sm text-[#8B95A1] transition hover:text-[#191F28]"
          >
            ← 진료비 검색
          </Link>
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#191F28]">
            {category.title}
          </h1>
          <p className="mt-1 text-sm text-[#8B95A1]">{category.description}</p>
        </header>

        {/* 카테고리 네비게이션 */}
        <nav className="border-b-8 border-[#F2F4F6] py-4">
          <div className="flex flex-wrap gap-2">
            {FEE_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={'/cost-search/' + c.slug}
                className={
                  'rounded-full px-4 py-2 text-xs font-semibold transition ' +
                  (c.slug === category.slug
                    ? 'bg-[#191F28] text-white'
                    : 'border-[1.5px] border-[#E5E8EB] text-[#4E5968] hover:border-[#CBD5E1]')
                }
              >
                {c.title}
              </Link>
            ))}
          </div>
        </nav>

        {/* 가격 데이터 */}
        {seedItems.length > 0 ? (
          <div className="divide-y divide-[#F2F4F6]">
            {seedItems.map((item) => (
              <article key={item.name} className="py-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#191F28]">{item.name}</h3>
                </div>
                <PriceBar min={item.min} avg={item.avg} max={item.max} />
                <div className="mt-2 flex justify-between text-xs text-[#8B95A1]">
                  <span>{Math.round(item.min).toLocaleString('ko-KR')}원</span>
                  <span className="font-semibold text-[#191F28]">
                    평균 {Math.round(item.avg).toLocaleString('ko-KR')}원
                  </span>
                  <span>{Math.round(item.max).toLocaleString('ko-KR')}원</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[15px] font-bold text-[#191F28]">현재 데이터를 수집하고 있어요</p>
            <p className="mt-1 text-sm text-[#8B95A1]">
              전국 동물병원의 실제 진료비를 모으고 있습니다
            </p>
            <Link
              href="/ai-care"
              className="mt-4 inline-flex rounded-[14px] bg-[#191F28] px-5 py-[17px] text-[15px] font-bold text-white transition hover:bg-[#333D4B]"
            >
              AI로 예상 진료비 보기
            </Link>
          </div>
        )}

        {/* 케어 가이드 */}
        <CareGuide
          keyword={category.title}
          categorySlug={category.slug}
          matchedTags={category.relatedCareTags}
        />

        {/* 하단 CTA */}
        <div className="border-t-8 border-[#F2F4F6] pt-6">
          <p className="mb-3 text-[15px] font-bold text-[#191F28]">다음 단계</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/ai-care"
              className="flex items-center justify-center rounded-[14px] bg-[#191F28] px-5 py-[17px] text-[15px] font-bold text-white transition hover:bg-[#333D4B]"
            >
              AI 견적서 분석 →
            </Link>
            <Link
              href="/cost-search"
              className="flex items-center justify-center rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white px-5 py-[17px] text-[15px] font-bold text-[#191F28] transition hover:border-[#CBD5E1]"
            >
              진료비 검색 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
