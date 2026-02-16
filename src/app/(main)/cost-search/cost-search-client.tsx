'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import CareGuide from '@/components/care-guide';
import CostChat from '@/components/cost-chat';
import Paywall from '@/components/paywall';
import {
  AnimateOnScroll,
  IconBadge,
  PriceBar,
  ResultSkeleton,
} from '@/components/ui';
import { isPremium } from '@/lib/subscription';
import { FEE_CATEGORIES } from '@/lib/fee-categories';
import { findCareTagsByKeyword } from '@/lib/care-product-map';

type CostSearchListItem = {
  item: string;
  category: string;
  species: 'dog' | 'cat' | 'etc';
  region: string;
  avg: number;
  min: number;
  max: number;
  count: number;
  updatedAt: string | null;
};

type CostSearchListResponse = {
  results: CostSearchListItem[];
  total: number;
  source: 'live' | 'seed' | 'error';
  error?: string;
};

const popularTags = ['중성화', '슬개골', '스케일링', '혈액검사', '예방접종', '초음파', '피부', 'MRI'];
const animalTypes = ['강아지', '고양이'] as const;
const regions = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원'];

export default function CostSearchClient() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState('혈액검사');
  const [animalType, setAnimalType] = useState<(typeof animalTypes)[number]>('강아지');
  const [region, setRegion] = useState('전국');
  const [results, setResults] = useState<CostSearchListItem[]>([]);
  const [source, setSource] = useState<'live' | 'seed' | 'error'>('seed');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkPremium() {
      if (!user?.uid) {
        if (isMounted) setIsPremiumUser(false);
        return;
      }
      const premiumStatus = await isPremium(user.uid);
      if (isMounted) setIsPremiumUser(premiumStatus);
    }
    if (!loading) {
      void checkPremium();
    }
    return () => {
      isMounted = false;
    };
  }, [loading, user?.uid]);

  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchError('검색어를 입력해 주세요.');
      setResults([]);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const species = animalType === '강아지' ? 'dog' : 'cat';
      const params = new URLSearchParams({ q: trimmed, species, region });
      const response = await fetch(`/api/cost-search?${params.toString()}`);
      const data = (await response.json()) as CostSearchListResponse;

      if (!response.ok || !Array.isArray(data.results)) {
        throw new Error(data.error || '검색 결과를 가져오지 못했습니다.');
      }

      setResults(data.results);
      setSource(data.source);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
      setResults([]);
      setSource('error');
    } finally {
      setSearching(false);
    }
  }

  const topResult = results[0];
  const matchedCategory = useMemo(() => {
    if (!topResult) return undefined;
    return FEE_CATEGORIES.find((category) =>
      category.searchTags.some((tag) => topResult.item.includes(tag) || tag.includes(topResult.item)),
    );
  }, [topResult]);

  const matchedTags = useMemo(() => {
    if (!topResult) return [];
    return findCareTagsByKeyword(topResult.item);
  }, [topResult]);

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12" aria-label="진료비 검색">
      <div className="mx-auto w-full max-w-4xl">
        <section className="py-12 text-center md:py-16">
          <AnimateOnScroll animation="fade-up">
            <span className="text-sm font-semibold text-[#F97316]">전국 평균 데이터와 비교</span>
            <h1 className="mt-2 mb-3 text-2xl font-bold tracking-tight text-[#4F2A1D] md:text-4xl">우리 아이 진료비, 비싼 걸까?</h1>
            <p className="text-sm text-[#8B6B4E]">전국 평균 데이터와 비교해보세요</p>
          </AnimateOnScroll>
        </section>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm md:p-8">
            <form
              role="search"
              aria-label="진료비 검색 폼"
              onSubmit={(event) => {
                event.preventDefault();
                void runSearch(query);
              }}
            >
              <div className="relative mb-5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B6B4E]">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M21 21L15.8 15.8M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="진료 항목을 검색해보세요 (예: 중성화, 슬개골)"
                  className="w-full rounded-xl border border-[#E8D5C0] bg-[#FFFAF5] py-3 pl-10 pr-4 text-sm text-[#4F2A1D] placeholder:text-[#B8A08A] outline-none transition-all duration-300 focus:border-[#F97316] focus:bg-white focus:ring-2 focus:ring-[#F97316]/20"
                />
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <select
                  value={animalType}
                  onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                  className="rounded-xl border border-[#E8D5C0] bg-white px-4 py-3 text-sm text-[#4F2A1D] outline-none transition-all duration-300 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                >
                  {animalTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="rounded-xl border border-[#E8D5C0] bg-white px-4 py-3 text-sm text-[#4F2A1D] outline-none transition-all duration-300 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                >
                  {regions.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      void runSearch(tag);
                    }}
                    className="cursor-pointer rounded-full bg-[#FFF3E6] px-3 py-1.5 text-xs font-medium text-[#C2410C] transition-all duration-200 hover:bg-[#F97316] hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
                {FEE_CATEGORIES.slice(0, 7).map((cat) => (
                  <Link key={cat.slug} href={'/cost-search/' + cat.slug} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <IconBadge icon={<span className="text-sm">{cat.icon}</span>} color="orange" size="md" />
                    <span className="text-center text-xs font-medium text-[#6B4226]">{cat.title}</span>
                  </Link>
                ))}
              </div>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F97316]/25 active:translate-y-0 active:scale-[0.99]"
              >
                🔍 진료비 검색하기
              </button>
            </form>
          </div>
        </AnimateOnScroll>

        {searchError ? <p className="mt-4 text-sm font-medium text-rose-500">{searchError}</p> : null}
        {searching && <ResultSkeleton />}

        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[#8B6B4E]">검색 결과 {results.length}건</span>
              {source === 'live' && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">✅ 실시간 데이터</span>}
            </div>
            {results.map((item, i) => (
              <AnimateOnScroll key={item.item} animation="fade-up" delay={i * 50}>
                <div className="rounded-2xl border border-[#F8C79F]/10 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#F8C79F]/30 hover:shadow-md md:p-6">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#4F2A1D]">{item.item}</h3>
                      <p className="mt-0.5 text-xs text-[#8B6B4E]">{item.category}</p>
                    </div>
                    <p className="text-xl font-bold tracking-tight text-[#F97316] md:text-2xl">
                      {item.avg.toLocaleString('ko-KR')}<span className="text-sm font-normal">원</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <PriceBar min={item.min} avg={item.avg} max={item.max} />
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {!searching && results.length === 0 && hasSearched && query && (
          <AnimateOnScroll animation="fade-in">
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E6]">
                <span className="text-3xl text-[#F97316]/50">🔎</span>
              </div>
              <p className="mb-1 font-medium text-[#4F2A1D]">검색 결과가 없어요</p>
              <p className="text-sm text-[#8B6B4E]">다른 키워드로 검색해보세요</p>
            </div>
          </AnimateOnScroll>
        )}

        {topResult ? (
          <div className="mt-6 space-y-6">
            <CareGuide keyword={topResult.item} categorySlug={matchedCategory?.slug} matchedTags={matchedTags} />
            <article className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#4F2A1D]"><span>🩺</span>AI 비용 분석</h2>
                {isPremiumUser ? (
                  <button type="button" onClick={() => setIsChatOpen((prev) => !prev)} className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2 text-sm font-semibold text-white">
                    이 가격이 궁금하세요?
                  </button>
                ) : null}
              </div>
              {loading ? (
                <p className="mt-3 text-sm text-[#8B6B4E]">구독 상태를 확인 중입니다...</p>
              ) : isPremiumUser && isChatOpen ? (
                <p className="mt-3 rounded-xl bg-[#FFF8F0] p-4 text-sm text-[#6B4226]">의료적 판단 없이 가격 비교와 항목 설명 중심으로 AI 분석을 제공합니다.</p>
              ) : !isPremiumUser ? (
                <div className="mt-4">
                  <Paywall title="AI 비용 분석은 프리미엄 전용 기능입니다" description="무료 플랜에서는 월 3회까지 검색만 가능하며, AI 분석은 프리미엄에서 무제한 제공돼요." featureName="AI 비용 분석" />
                </div>
              ) : null}
            </article>

            <CostChat
              itemName={topResult.item}
              region={region}
              stats={{
                average: topResult.avg,
                min: topResult.min,
                max: topResult.max,
                sampleSize: topResult.count,
                source: source,
              }}
              seedRange={{ min: topResult.min, max: topResult.max, source: '공공데이터 기준 참고 범위' }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
