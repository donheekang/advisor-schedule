'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import CareGuide from '@/components/care-guide';
import CostChat from '@/components/cost-chat';
import Paywall from '@/components/paywall';
import {
  AnimateOnScroll,
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
    <section className="w-full pb-10" aria-label="진료비 검색">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#D4B8C0]/40 via-[#D4B8C0]/20 to-white pb-8 pt-24 md:pb-12 md:pt-32">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#48B8D0]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#48B8D0]/10 px-3 py-1 text-xs font-semibold text-[#48B8D0]">
              전국 평균 데이터와 비교
            </span>
            <h1 className="mb-3 text-2xl font-extrabold text-[#1F2937] md:text-4xl">우리 아이 진료비, 비싼 걸까?</h1>
            <p className="text-sm text-[#6B7280] md:text-base">전국 평균 데이터와 비교해보세요</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto -mt-6 max-w-3xl px-4">
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-[#1F2937]/5 md:p-8">
            <form
              role="search"
              aria-label="진료비 검색 폼"
              onSubmit={(event) => {
                event.preventDefault();
                void runSearch(query);
              }}
            >
              <div className="relative">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="진료 항목을 검색해보세요 (예: 중성화, 슬개골)"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-12 pr-4 text-sm text-[#1F2937] placeholder-[#6B7280] transition-all duration-200 focus:border-[#48B8D0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#48B8D0]/10"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <select
                  value={animalType}
                  onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                  className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1F2937] transition-all duration-200 focus:border-[#48B8D0] focus:outline-none focus:ring-4 focus:ring-[#48B8D0]/10"
                >
                  {animalTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1F2937] transition-all duration-200 focus:border-[#48B8D0] focus:outline-none focus:ring-4 focus:ring-[#48B8D0]/10"
                >
                  {regions.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      void runSearch(tag);
                    }}
                    className={'rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ' +
                      (query === tag
                        ? 'border-[#48B8D0] bg-[#48B8D0]/5 text-[#48B8D0]'
                        : 'border-gray-200 bg-white text-[#6B7280] hover:border-[#48B8D0] hover:text-[#48B8D0]')}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 border-t border-[#F1F5F9] pt-6 md:grid-cols-7">
                {FEE_CATEGORIES.slice(0, 7).map((cat) => (
                  <Link key={cat.slug} href={'/cost-search/' + cat.slug} className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:bg-[#48B8D0]/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4B8C0] text-lg">
                      {cat.icon}
                    </div>
                    <span className="text-center text-xs font-medium text-[#6B7280]">{cat.title}</span>
                  </Link>
                ))}
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#48B8D0] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#48B8D0]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
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
              <span className="text-sm text-[#6B7280]">검색 결과 {results.length}건</span>
              {source === 'live' && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">✅ 실시간 데이터</span>}
            </div>
            {results.map((item, i) => (
              <AnimateOnScroll key={item.item} animation="fade-up" delay={i * 50}>
                <div className="rounded-2xl border border-[#B28B84]/10 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#B28B84]/30 hover:shadow-md md:p-6">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1F2937]">{item.item}</h3>
                      <p className="mt-0.5 text-xs text-[#6B7280]">{item.category}</p>
                    </div>
                    <p className="text-xl font-bold tracking-tight text-[#48B8D0] md:text-2xl">
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4B8C0]/40">
                <span className="text-3xl text-[#48B8D0]/50">🔎</span>
              </div>
              <p className="mb-1 font-medium text-[#1F2937]">검색 결과가 없어요</p>
              <p className="text-sm text-[#6B7280]">다른 키워드로 검색해보세요</p>
            </div>
          </AnimateOnScroll>
        )}

        {topResult ? (
          <div className="mt-6 space-y-6">
            <CareGuide keyword={topResult.item} categorySlug={matchedCategory?.slug} matchedTags={matchedTags} />
            <article className="rounded-2xl border border-[#B28B84]/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#1F2937]"><span>🩺</span>AI 비용 분석</h2>
                {isPremiumUser ? (
                  <button type="button" onClick={() => setIsChatOpen((prev) => !prev)} className="rounded-xl bg-gradient-to-r from-[#48B8D0] to-[#B28B84] px-4 py-2 text-sm font-semibold text-white">
                    이 가격이 궁금하세요?
                  </button>
                ) : null}
              </div>
              {loading ? (
                <p className="mt-3 text-sm text-[#6B7280]">구독 상태를 확인 중입니다...</p>
              ) : isPremiumUser && isChatOpen ? (
                <p className="mt-3 rounded-xl bg-[#D4B8C0]/40 p-4 text-sm text-[#1F2937]">의료적 판단 없이 가격 비교와 항목 설명 중심으로 AI 분석을 제공합니다.</p>
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
