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
const defaultPopularItems = ['진찰료', '예방접종', '중성화수술', '스케일링', '혈액검사', '엑스레이', '초음파', '슬개골탈구'];
const emptyResultPopularItems = ['진찰료', '예방접종', '중성화수술', '스케일링', '혈액검사'];
const animalTypes = ['강아지', '고양이'] as const;
const regions = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원'];

export default function CostSearchClient() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState('');
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
  const trimmedQuery = query.trim();
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
    <section className="w-full bg-[#F8FAFB] pb-10" aria-label="진료비 검색">
      <div className="relative overflow-hidden bg-[#F8FAFB] pb-8 pt-24 md:pb-12 md:pt-32">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#48B8D0]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#48B8D0]/10 px-3 py-1 text-xs font-semibold text-[#48B8D0]">
              전국 평균 데이터와 비교
            </span>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#0B3041] md:text-4xl">우리 아이 진료비, 비싼 걸까?</h1>
            <p className="text-sm text-[#6B7280] md:text-base">전국 평균 데이터와 비교해보세요</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto -mt-6 max-w-3xl px-4">
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="rounded-3xl border border-[#0B3041]/[0.06] bg-white p-6 shadow-sm md:p-8">
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
                  className="w-full rounded-2xl border border-[#0B3041]/10 bg-white py-3.5 pl-12 pr-4 text-sm text-[#0B3041] placeholder-[#6B7280] transition-all duration-200 focus:border-[#48B8D0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#48B8D0]/20"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <select
                  value={animalType}
                  onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                  className="flex-1 rounded-2xl border border-[#0B3041]/10 bg-white px-4 py-3 text-sm text-[#0B3041] transition-all duration-200 focus:border-[#48B8D0] focus:outline-none focus:ring-2 focus:ring-[#48B8D0]/20"
                >
                  {animalTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="flex-1 rounded-2xl border border-[#0B3041]/10 bg-white px-4 py-3 text-sm text-[#0B3041] transition-all duration-200 focus:border-[#48B8D0] focus:outline-none focus:ring-2 focus:ring-[#48B8D0]/20"
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
                    className="rounded-full bg-[#48B8D0]/10 px-3 py-1.5 text-sm font-medium text-[#48B8D0] transition-all duration-200 hover:bg-[#48B8D0]/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 border-t border-[#F1F5F9] pt-6 md:grid-cols-7">
                {FEE_CATEGORIES.slice(0, 7).map((cat) => (
                  <Link key={cat.slug} href={'/cost-search/' + cat.slug} className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:bg-[#F5E5FC]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-lg">
                      {cat.icon}
                    </div>
                    <span className="text-center text-xs font-medium text-[#6B7280]">{cat.title}</span>
                  </Link>
                ))}
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-2xl bg-[#48B8D0] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(72,184,208,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(72,184,208,0.4)]"
              >
                🔍 진료비 검색하기
              </button>

              <div className="mt-6 rounded-xl bg-[#F5E5FC]/50 p-4 text-center">
                <p className="text-sm font-medium text-[#0B3041]">📱 앱에서 진료 기록을 관리하면 비용 비교가 더 쉬워져요</p>
                <p className="mt-1 text-xs text-[#6B7280]">PetHealth+ 앱 출시 예정</p>
              </div>
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
                <div className="rounded-3xl border border-[#0B3041]/[0.06] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(11,48,65,0.08)] md:p-6">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#0B3041]">{item.item}</h3>
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

        {!searching && trimmedQuery.length === 0 && (
          <div className="mt-6 rounded-3xl border border-[#0B3041]/[0.06] bg-white p-6 md:p-8">
            <h3 className="mb-4 text-lg font-bold text-[#0B3041]">🔥 많이 검색하는 진료 항목</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {defaultPopularItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    void runSearch(item);
                  }}
                  className="rounded-2xl border border-[#0B3041]/[0.06] bg-white px-4 py-3 text-sm font-medium text-[#0B3041] transition-all hover:border-[#48B8D0] hover:bg-[#48B8D0]/5"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {!searching && results.length === 0 && hasSearched && trimmedQuery.length > 0 && (
          <AnimateOnScroll animation="fade-in">
            <div className="py-12 text-center">
              <p className="mb-2 text-lg font-bold text-[#0B3041]">&quot;{trimmedQuery}&quot;에 대한 결과를 찾지 못했어요</p>
              <p className="mb-6 text-sm text-[#6B7280]">다른 키워드로 검색하거나, 아래 인기 항목을 확인해보세요</p>
              <div className="flex flex-wrap justify-center gap-2">
                {emptyResultPopularItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      void runSearch(item);
                    }}
                    className="rounded-full bg-[#48B8D0]/10 px-4 py-2 text-sm font-medium text-[#48B8D0] transition-all hover:bg-[#48B8D0]/20"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {topResult ? (
          <div className="mt-6 space-y-6">
            <CareGuide keyword={topResult.item} categorySlug={matchedCategory?.slug} matchedTags={matchedTags} />
            <article className="rounded-3xl border border-[#0B3041]/[0.06] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#1F2937]"><span>🩺</span>AI 비용 분석</h2>
                {isPremiumUser ? (
                  <button type="button" onClick={() => setIsChatOpen((prev) => !prev)} className="rounded-2xl bg-[#48B8D0] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(72,184,208,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(72,184,208,0.4)]">
                    이 가격이 궁금하세요?
                  </button>
                ) : null}
              </div>
              {loading ? (
                <p className="mt-3 text-sm text-[#6B7280]">구독 상태를 확인 중입니다...</p>
              ) : isPremiumUser && isChatOpen ? (
                <p className="mt-3 rounded-xl bg-[#F5E5FC] p-4 text-sm text-[#1F2937]">의료적 판단 없이 가격 비교와 항목 설명 중심으로 AI 분석을 제공합니다.</p>
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
