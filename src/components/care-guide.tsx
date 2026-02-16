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
import { IconBadge } from '@/components/ui';

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
    <div className="mt-6 rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <IconBadge icon={<span className="text-sm">💛</span>} color="orange" size="sm" />
        <h3 className="text-lg font-bold text-[#4F2A1D]">{keyword} 받았다면 이것만 챙기세요</h3>
      </div>

      <div className="mb-6 space-y-2.5">
        {tip.tips.map((tipItem, i) => (
          <div key={`${tipItem}-${i}`} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF3E6] text-xs text-[#F97316]">✓</span>
            <p className="text-sm leading-relaxed text-[#6B4226]">{tipItem}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((product) => (
          <a
            key={product.name}
            href={createCoupangSearchUrl(product.coupangKeyword)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-xl bg-[#FFFAF5] p-4 transition-all duration-200 hover:bg-[#FFF3E6] hover:shadow-sm"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white">
              <span className="text-[#F97316]">🛍️</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#4F2A1D] transition-colors group-hover:text-[#F97316]">{product.name}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-[#8B6B4E]">{product.reason}</p>
            </div>
            <span className="mt-1 text-xs text-[#B8A08A] transition-colors group-hover:text-[#F97316]">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
