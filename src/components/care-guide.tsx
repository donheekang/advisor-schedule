'use client';

import { useMemo } from 'react';
import {
  createCoupangSearchUrl,
  findCareProductsByCategory,
  findCareProductsByKeyword,
  findCareTagsByKeyword,
  type CareProduct,
} from '@/lib/care-product-map';
import { CATEGORY_DEFAULT_TIPS, CARE_TIPS } from '@/lib/care-tips';
import { getCategoryBySlug } from '@/lib/fee-categories';

type CareGuideProps = {
  keyword: string;
  categorySlug?: string;
  matchedTags?: string[];
};

function uniqProducts(products: CareProduct[]): CareProduct[] {
  const map = new Map<string, CareProduct>();
  products.forEach((product) => map.set(product.name, product));
  return [...map.values()];
}

export default function CareGuide({ keyword, categorySlug, matchedTags }: CareGuideProps) {
  const resolvedTags = useMemo(() => {
    if (matchedTags && matchedTags.length > 0) return matchedTags;
    return findCareTagsByKeyword(keyword);
  }, [keyword, matchedTags]);

  const tip = useMemo(() => {
    if (resolvedTags.length > 0) {
      const matchedTip = resolvedTags.find((tag) => Boolean(CARE_TIPS[tag]));
      if (matchedTip) return CARE_TIPS[matchedTip];
    }
    if (!categorySlug) return null;
    return CATEGORY_DEFAULT_TIPS[categorySlug] ?? null;
  }, [categorySlug, resolvedTags]);

  const products = useMemo(() => {
    const fromKeyword = findCareProductsByKeyword(keyword);
    const fromTags = resolvedTags.length > 0 ? findCareProductsByCategory(resolvedTags) : [];
    const fallbackCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
    const fromCategory = fallbackCategory
      ? findCareProductsByCategory(fallbackCategory.relatedCareTags)
      : [];
    return uniqProducts([...fromKeyword, ...fromTags, ...fromCategory]).slice(0, 4);
  }, [categorySlug, keyword, resolvedTags]);

  if (!tip) return null;

  return (
    <div className="mt-2 space-y-0">
      <section className="border-b-8 border-[#F2F4F6] py-6">
        <h3 className="mb-4 text-[15px] font-bold text-[#191F28]">{keyword} 맞춤 케어 팁</h3>
        <ul className="space-y-3">
          {tip.tips.map((tipItem, i) => (
            <li key={tipItem + '-' + i} className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#191F28]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.543a1 1 0 011.415 0z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm leading-relaxed text-[#4E5968]">{tipItem}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-b-8 border-[#F2F4F6] py-6">
        <h3 className="mb-4 text-[15px] font-bold text-[#191F28]">
          추천 케어 제품
          <span className="ml-1 text-xs font-normal text-[#8B95A1]">(광고/제휴)</span>
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {products.map((product) => (
            <a
              key={product.name}
              href={createCoupangSearchUrl(product.coupangKeyword)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white p-4 transition hover:border-[#CBD5E1]"
            >
              <p className="text-sm font-semibold text-[#191F28]">{product.name}</p>
              <p className="mt-1 text-xs text-[#8B95A1]">{product.reason}</p>
            </a>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[#AEB5BC]">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </section>
    </div>
  );
}
