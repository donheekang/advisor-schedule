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
import { AnimateOnScroll, IconBadge } from '@/components/ui';

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
    <div className="mt-6 space-y-4">
      <AnimateOnScroll animation="fade-up" delay={100}>
        <section className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <IconBadge icon={<span className="text-sm">💛</span>} color="orange" size="sm" />
            <h3 className="text-lg font-bold text-[#4F2A1D]">{keyword} 맞춤 케어 팁</h3>
          </div>

          <ul className="space-y-2.5">
            {tip.tips.map((tipItem, i) => (
              <li key={tipItem + '-' + i} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.543a1 1 0 011.415 0z" clipRule="evenodd" />
                </svg>
                <p className="text-sm leading-relaxed text-[#6B4226]">{tipItem}</p>
              </li>
            ))}
          </ul>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={200}>
        <section className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <IconBadge icon={<span className="text-sm">🛍️</span>} color="orange" size="sm" />
            <h3 className="text-lg font-bold text-[#4F2A1D]">추천 케어 제품</h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {products.map((product) => (
              <a
                key={product.name}
                href={createCoupangSearchUrl(product.coupangKeyword)}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-xl border border-[#F8C79F]/20 bg-[#FFFAF5] p-4 transition-colors duration-200 hover:bg-[#FFF3E6]"
              >
                <p className="text-sm font-semibold text-[#4F2A1D]">{product.name}</p>
                <p className="mt-1 text-xs text-[#8B6B4E]">{product.reason}</p>
              </a>
            ))}
          </div>
        </section>
      </AnimateOnScroll>
    </div>
  );
}
