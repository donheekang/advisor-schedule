'use client';

import {
  findCareProductsByKeyword,
  createCoupangSearchUrl,
  CARE_CATEGORY_LABELS,
  type CareProduct,
  type CareCategory,
} from '@/lib/care-product-map';

type CareGuideProps = {
  /** 진료비 검색 결과의 matchedItem */
  itemName: string;
};

export default function CareGuide({ itemName }: CareGuideProps) {
  const products = findCareProductsByKeyword(itemName);

  if (products.length === 0) return null;

  // 카테고리별 그룹핑
  const grouped = products.reduce<Record<CareCategory, CareProduct[]>>(
    (acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<CareCategory, CareProduct[]>,
  );

  return (
    <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
      {/* 헤더 */}
      <div className="space-y-2">
        <h2 className="text-lg font-extrabold text-[#4F2A1D]">
          🩺 {itemName} 후, 이런 케어가 도움이 돼요
        </h2>
        <p className="text-sm text-[#A36241]">
          진료 기록과 AI 분석을 참고해서 정리한 케어 포인트예요.
        </p>
      </div>

      {/* 카테고리별 상품 */}
      <div className="mt-5 space-y-5">
        {(Object.entries(grouped) as [CareCategory, CareProduct[]][]).map(
          ([category, categoryProducts]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-bold text-[#7C4A2D]">
                {CARE_CATEGORY_LABELS[category]}
              </h3>

              <div className="space-y-3">
                {categoryProducts.map((product) => (
                  <div
                    key={product.name}
                    className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-4 ring-1 ring-[#F8C79F]/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-[#4F2A1D]">{product.name}</p>
                        <p className="text-xs text-[#A36241]">{product.description}</p>
                        <p className="text-xs text-[#7C4A2D] italic">&quot;{product.reason}&quot;</p>
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
            </div>
          ),
        )}
      </div>

      {/* AI 체험 CTA */}
      <div className="mt-6 rounded-2xl bg-[#FFF8F0] p-5 text-center ring-1 ring-[#F8C79F]/20">
        <p className="text-sm font-bold text-[#4F2A1D]">
          ✨ 우리 아이 맞춤으로 더 정확하게 알고 싶다면?
        </p>
        <p className="mt-1 text-xs text-[#A36241]">
          알러지, 체중, 진료 이력을 입력하면 AI가 맞춤 케어를 분석해줘요.
        </p>
        <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <a
            href="/ai-care"
            className="rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
          >
            무료 AI 케어 체험 →
          </a>
          <a
            href="https://apps.apple.com/app/id6504879567"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#F8C79F] bg-white px-6 py-2.5 text-sm font-bold text-[#4F2A1D] transition hover:bg-[#FFF8F0]"
          >
            📱 앱 다운로드
          </a>
        </div>
      </div>

      {/* 쿠팡 파트너스 고지 */}
      <p className="mt-4 text-center text-xs text-[#C4956E]">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </article>
  );
}
