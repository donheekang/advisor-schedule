'use client';

import { useMemo } from 'react';
import {
  createCoupangSearchUrl,
  SEARCH_KEYWORD_TO_CARE_TAGS,
} from '@/lib/care-product-map';
import {
  getRecommendedProducts,
  groupProductsByCategory,
  type Product,
  type ProductCategory,
} from '@/lib/product-recommender';

type CareGuideProps = {
  /** 진료비 검색 결과의 matchedItem (예: "혈액검사") */
  keyword: string;
  categorySlug?: string;
  matchedTags?: string[];
};

const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  구강케어: '🦷',
  '피부/알러지': '🧴',
  관절: '🦴',
  소화: '🥣',
  '영양/면역': '💊',
  예방: '🛡️',
};

function resolveTagsFromKeyword(keyword: string): string[] {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, '').toLowerCase();
  const tags = new Set<string>();

  for (const [key, keyTags] of Object.entries(SEARCH_KEYWORD_TO_CARE_TAGS)) {
    const normalizedKey = key.replace(/\s+/g, '').toLowerCase();
    if (normalizedKeyword.includes(normalizedKey) || normalizedKey.includes(normalizedKeyword)) {
      keyTags.forEach((tag) => tags.add(tag));
    }
  }

  return [...tags];
}

export default function CareGuide({ keyword, matchedTags }: CareGuideProps) {
  const tags = useMemo(() => {
    if (matchedTags && matchedTags.length > 0) return matchedTags;
    return resolveTagsFromKeyword(keyword);
  }, [keyword, matchedTags]);

  const products = useMemo(() => getRecommendedProducts(tags), [tags]);
  const grouped = useMemo(() => groupProductsByCategory(products), [products]);

  if (products.length === 0) return null;

  const nonEmptyCategories = (Object.entries(grouped) as [ProductCategory, Product[]][]).filter(
    ([, items]) => items.length > 0,
  );

  return (
    <article className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="space-y-2">
        <h2 className="text-lg font-extrabold text-[#17191f]">
          {keyword} 후, 이런 케어가 도움이 돼요
        </h2>
        <p className="text-sm text-[#697182]">
          진료 기록을 참고해서 정리한 추천 케어 제품이에요.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {nonEmptyCategories.map(([category, categoryProducts]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-bold text-[#ff7a45]">
              {CATEGORY_EMOJI[category]} {category}
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {categoryProducts.slice(0, 4).map((product) => (
                <a
                  key={product.name}
                  href={createCoupangSearchUrl(product.coupangKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4 transition hover:border-[#ff7a45]/40 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-[#17191f]">{product.name}</p>
                  <p className="mt-1 text-xs text-[#697182]">{product.reason}</p>
                  {product.caution && (
                    <p className="mt-1 text-[11px] font-medium text-rose-500">{product.caution}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-[#aeb5bc]">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </article>
  );
}
