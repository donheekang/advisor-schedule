'use client';

import { useMemo, useState } from 'react';
import {
  createCoupangSearchUrl,
  findCareProductsByCategory,
  findCareProductsByKeyword,
  findCareTagsByKeyword,
  type CareProduct,
} from '@/lib/care-product-map';
import { CATEGORY_DEFAULT_TIPS, CARE_TIPS } from '@/lib/care-tips';
import { BREED_RISK_TAGS, TAG_LABELS } from '@/lib/condition-tag-map';
import { getCategoryBySlug } from '@/lib/fee-categories';

type CareGuideProps = {
  keyword: string;
  categorySlug?: string;
  matchedTags?: string[];
};

function uniqProducts(products: CareProduct[]): CareProduct[] {
  const map = new Map<string, CareProduct>();
  products.forEach((product) => {
    map.set(product.name, product);
  });
  return [...map.values()];
}

export default function CareGuide({ keyword, categorySlug, matchedTags }: CareGuideProps) {
  const [selectedBreed, setSelectedBreed] = useState('');

  const resolvedTags = useMemo(() => {
    if (matchedTags && matchedTags.length > 0) {
      return matchedTags;
    }
    return findCareTagsByKeyword(keyword);
  }, [keyword, matchedTags]);

  const tip = useMemo(() => {
    if (resolvedTags.length > 0) {
      const matchedTip = resolvedTags.find((tag) => Boolean(CARE_TIPS[tag]));
      if (matchedTip) {
        return CARE_TIPS[matchedTip];
      }
    }
    if (!categorySlug) {
      return null;
    }
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

  if (!tip) {
    return null;
  }

  const breedList = Object.keys(BREED_RISK_TAGS);
  const selectedBreedRiskTags = selectedBreed ? BREED_RISK_TAGS[selectedBreed] ?? [] : [];

  const breedMessage =
    selectedBreed && tip.breedTip?.[selectedBreed]
      ? tip.breedTip[selectedBreed]
      : selectedBreed
        ? `${selectedBreed}의 주의 관리: ${selectedBreedRiskTags.map((tag) => TAG_LABELS[tag] ?? tag).join(', ') || '기본 건강검진 루틴을 먼저 확인하세요.'}`
        : null;

  return (
    <article className="rounded-2xl border border-[#F8C79F]/30 bg-white p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#4F2A1D]">🩺 {keyword} 받았다면 이것만 챙기세요</h2>

        <section className="space-y-3">
          <h3 className="text-lg font-bold text-[#4F2A1D]">📋 {tip.title}</h3>
          <ul className="space-y-2 text-sm text-[#6B4226]">
            {tip.tips.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#F97316]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <label className="block text-sm font-bold text-[#4F2A1D]" htmlFor="breed-select">
            🐕 내 품종은?
          </label>
          <select
            id="breed-select"
            value={selectedBreed}
            onChange={(event) => setSelectedBreed(event.target.value)}
            className="w-full rounded-xl border border-[#F8C79F] px-3 py-2 text-sm text-[#4F2A1D] outline-none"
          >
            <option value="">품종 선택하기</option>
            {breedList.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          {breedMessage ? (
            <p className="rounded-xl bg-[#FFF8F0] p-3 text-sm text-[#7C4A2D]">{breedMessage}</p>
          ) : null}
        </section>

        {products.length > 0 ? (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-[#4F2A1D]">🛒 도움이 되는 케어 상품</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="rounded-xl bg-[#FFFAF5] p-4 transition hover:shadow-md"
                >
                  <p className="text-sm font-bold text-[#4F2A1D]">{product.name}</p>
                  <p className="mt-1 text-xs text-[#7C4A2D]">{product.reason}</p>
                  <a
                    href={createCoupangSearchUrl(product.coupangKeyword)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-lg border border-[#F97316] px-3 py-1.5 text-sm font-semibold text-[#F97316]"
                  >
                    쿠팡에서 보기
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="my-6 h-px bg-[#F8C79F]/40" />

      <div className="rounded-2xl bg-[#3D2518] p-6 text-white">
        <p className="text-sm font-bold">📱 이 케어를 자동으로 관리하고 싶다면?</p>
        <p className="mt-1 text-sm text-white/80">
          앱에서 영수증 찍으면 자동 추적 + AI 맞춤 분석으로 루틴을 챙길 수 있어요.
        </p>
        <a
          href="https://apps.apple.com/app/id6504879567"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold"
        >
          앱 다운로드 →
        </a>
      </div>
    </article>
  );
}
