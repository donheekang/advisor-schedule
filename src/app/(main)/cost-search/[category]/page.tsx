import { Metadata } from 'next';
import { getCategoryBySlug, getAllCategorySlugs, FEE_CATEGORIES } from '@/lib/fee-categories';
import { findCareProductsByCategory, createCoupangSearchUrl, CARE_CATEGORY_LABELS } from '@/lib/care-product-map';
import { findCostSeedMatches } from '@/lib/cost-search-seed';
import Link from 'next/link';

/* ─────────────────────────────────────────────────
 * 정적 경로 생성 (SSG)
 * ───────────────────────────────────────────────── */

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

/* ─────────────────────────────────────────────────
 * 메타데이터 (SEO)
 * ───────────────────────────────────────────────── */

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
    },
  };
}

/* ─────────────────────────────────────────────────
 * 시드 데이터에서 카테고리 항목 가져오기
 * ───────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────
 * 페이지 컴포넌트
 * ───────────────────────────────────────────────── */

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
  const careProducts = findCareProductsByCategory(cat.relatedCareTags);

  // 카테고리별 그룹핑
  const groupedCare = careProducts.reduce<Record<string, typeof careProducts>>(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {},
  );

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* 헤더 */}
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

        {/* 카테고리 네비게이션 */}
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

        {/* 가격 항목 카드 */}
        {seedItems.length > 0 ? (
          <article className="space-y-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
            <h2 className="text-lg font-extrabold text-[#4F2A1D]">
              📊 {cat.title} 항목별 평균 비용
            </h2>
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
                  {/* 바 차트 */}
                  <div className="mt-2 h-2 w-full rounded-full bg-[#FFE7CF]">
                    <div
                      className="h-2 rounded-full bg-[#F97316]"
                      style={{
                        width: `${Math.max(10, ((item.avg - item.min) / (item.max - item.min)) * 100)}%`,
                        marginLeft: `${Math.max(0, ((item.min) / item.max) * 100 * 0.3)}%`,
                      }}
                    />
                  </div>
                  {/* 검색 링크 */}
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

        {/* 케어 가이드 섹션 */}
        {careProducts.length > 0 ? (
          <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#4F2A1D]">
                🩺 {cat.title} 후, 이런 케어가 도움이 돼요
              </h2>
              <p className="text-sm text-[#A36241]">
                진료 기록과 AI 분석을 참고해서 정리한 케어 포인트예요.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              {Object.entries(groupedCare).map(([categoryKey, products]) => (
                <div key={categoryKey} className="space-y-3">
                  <h3 className="text-sm font-bold text-[#7C4A2D]">
                    {CARE_CATEGORY_LABELS[categoryKey as keyof typeof CARE_CATEGORY_LABELS] ??
                      categoryKey}
                  </h3>
                  {products.map((product) => (
                    <div
                      key={product.name}
                      className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-4 ring-1 ring-[#F8C79F]/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-[#4F2A1D]">{product.name}</p>
                          <p className="text-xs text-[#A36241]">{product.description}</p>
                          <p className="text-xs text-[#7C4A2D] italic">
                            &quot;{product.reason}&quot;
                          </p>
                        </div>
                        <a
                          href={createCoupangSearchUrl(product.coupangKeyword)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
                        >
                          쿠팡에서 보기
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-[#C4956E]">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </article>
        ) : null}

        {/* AI 체험 CTA */}
        <article className="rounded-3xl bg-gradient-to-r from-[#4F2A1D] to-[#7C4A2D] p-6 text-center shadow-lg">
          <p className="text-2xl">✨</p>
          <h2 className="mt-3 text-lg font-extrabold text-white">
            우리 아이 맞춤 케어, 30초면 알 수 있어요
          </h2>
          <p className="mt-2 text-sm text-[#F8C79F]">
            알러지, 체중, 진료 이력을 입력하면 AI가 맞춤 케어를 분석해줘요.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/ai-care"
              className="rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              무료 AI 케어 체험 →
            </Link>
            <a
              href="https://apps.apple.com/app/id6504879567"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#F8C79F]/50 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              📱 앱 다운로드
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
