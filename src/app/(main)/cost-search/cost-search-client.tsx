'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import CareGuide from '@/components/care-guide';

type ApiCostSearchResult = {
  query: string;
  matchedItem: string;
  species: 'dog' | 'cat' | 'etc';
  region: string | null;
  priceStats: {
    min: number;
    max: number;
    avg: number;
    median: number;
    sampleSize: number;
    source: 'user_data' | 'seed_data' | 'mixed';
  };
  nationalAvg: number;
  regionalAvg: number;
  relatedItems: string[];
  sources: string[];
  dataInfo?: {
    totalRecords: number;
    latestDate: string | null;
  };
};

type MyPriceComparison = {
  item: string;
  average: number;
  diffPercent: number;
  isHigher: boolean;
  sampleSize: number;
};

const popularTags = ['혈액검사', '스케일링', '슬개골수술', '중성화 암컷', '예방접종', '초음파', 'MRI'];
const animalTypes = ['강아지', '고양이'] as const;
const regions = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원'];
const funnelCategories = [
  {
    key: 'consult',
    label: '진찰·입원',
    description: '진찰료·상담료·입원비',
    query: '진찰',
    hint: '초진, 재진, 입원비'
  },
  {
    key: 'exam',
    label: '검사',
    description: '혈액·영상 검사 비용',
    query: '혈액검사',
    hint: '혈액검사, X-ray, 초음파'
  },
  {
    key: 'surgery',
    label: '수술',
    description: '중성화·슬개골 수술',
    query: '슬개골수술',
    hint: '중성화, 슬개골수술'
  },
] as const;

function formatLatestDate(value: string | null | undefined): string {
  if (!value) {
    return '업데이트 준비 중';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('ko-KR');
}

function toWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

export default function CostSearchClient() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [animalType, setAnimalType] = useState<(typeof animalTypes)[number]>('강아지');
  const [region, setRegion] = useState('전국');
  const [costResult, setCostResult] = useState<ApiCostSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [myComparison, setMyComparison] = useState<MyPriceComparison | null>(null);
  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchError('검색어를 입력해 주세요.');
      setCostResult(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setMyComparison(null);
    setHasSearched(true);

    try {
      const species = animalType === '강아지' ? 'dog' : 'cat';
      const params = new URLSearchParams({ query: trimmed, species, region });
      const response = await fetch(`/api/cost-search?${params.toString()}`);
      const data = (await response.json()) as ApiCostSearchResult | { error?: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : '검색 결과를 가져오지 못했습니다.');
      }
      setCostResult(data as ApiCostSearchResult);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
      setCostResult(null);
    } finally {
      setSearching(false);
    }
  }

  function getPriceBadge() {
    if (!costResult || costResult.nationalAvg <= 0) {
      return null;
    }

    const ratio = (costResult.priceStats.avg - costResult.nationalAvg) / costResult.nationalAvg;
    if (ratio <= -0.05) {
      return { label: '전국 평균보다 낮아요', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' };
    }
    if (ratio >= 0.05) {
      return { label: '전국 평균보다 높아요', className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100' };
    }

    return { label: '전국 평균과 유사해요', className: 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200' };
  }

  const priceBadge = getPriceBadge();
  const maxChartValue = costResult ? Math.max(costResult.priceStats.max, costResult.nationalAvg) : 0;
  const regionLabel = costResult?.region ?? region;
  const latestUpdatedLabel = formatLatestDate(costResult?.dataInfo?.latestDate);

  function getChartWidth(value: number) {
    if (!maxChartValue) {
      return '0%';
    }
    return `${Math.max(8, (value / maxChartValue) * 100)}%`;
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5" aria-label="진료비 비교">
      <header className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff6f6_100%)] px-6 py-9 shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ff7a45]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 bottom-0 h-48 w-48 rounded-full bg-[#f3caa8]/10 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#0B3041]">PRICE GUIDE</p>
          <p className="text-sm font-medium text-[#697182]">우리 동네는 얼마일까?</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#17191f] md:text-4xl">
            병원 가기 전,
            <br />
            진료비 미리 확인해요
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[#4f5868] md:text-base">
            전국 평균부터 우리 동네 가격까지, 검색 한 번이면 마음이 놓여요.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pet-talker"
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#17191f] transition hover:bg-black/5"
            >
              펫토커
            </Link>
            <Link
              href="/mypage"
              className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.24)] transition hover:brightness-95"
            >
              앱 연동
            </Link>
          </div>
        </div>
      </header>

      <article className="rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] ring-1 ring-black/5 md:p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void runSearch(query);
          }}
        >
          <label htmlFor="cost-search-input" className="block text-sm font-semibold text-[#17191f]">
            어떤 항목의 진료비를 비교할까요?
          </label>
          <input
            id="cost-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 혈액검사, 중성화, 슬개골수술"
            className="w-full rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 text-sm text-[#17191f] placeholder-[#8a92a3] outline-none transition focus:border-[#ff7a45] focus:ring-2 focus:ring-[#ff7a45]/20"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#17191f]">
              동물 종류
              <select
                value={animalType}
                onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                className="rounded-2xl border border-black/10 bg-[#fffaf5] px-3 py-3 text-sm text-[#17191f] outline-none transition focus:border-[#ff7a45]"
              >
                {animalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#17191f]">
              지역
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="rounded-2xl border border-black/10 bg-[#fffaf5] px-3 py-3 text-sm text-[#17191f] outline-none transition focus:border-[#ff7a45]"
              >
                {regions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#697182]">카테고리</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {funnelCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setQuery(category.query);
                    void runSearch(category.query);
                  }}
                  className="rounded-2xl border border-black/10 bg-[#fffaf5] px-3 py-2 text-left transition hover:border-[#ff7a45]/50 hover:bg-white"
                >
                  <p className="text-sm font-semibold text-[#17191f]">{category.label}</p>
                  <p className="text-[11px] text-[#697182]">{category.description}</p>
                  <p className="mt-1 text-[11px] text-[#ff7a45]">{category.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  void runSearch(tag);
                }}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#4f5868] transition hover:border-[#ff7a45]/40 hover:text-[#ff7a45]"
              >
                #{tag}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,122,69,0.23)] transition hover:brightness-95 disabled:opacity-60"
          >
            {searching ? '검색 중...' : '진료비 검색하기'}
          </button>
        </form>
      </article>

      {!hasSearched ? (
        <article className="rounded-3xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-lg font-semibold text-[#17191f]">어떤 진료비가 궁금하세요?</p>
          <p className="mt-2 text-sm text-[#697182]">항목을 검색하면 전국 비용 범위를 바로 확인할 수 있어요.</p>
        </article>
      ) : null}

      {searchError && !costResult ? (
        <article className="rounded-3xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-lg font-semibold text-[#17191f]">아직 데이터가 충분하지 않아요</p>
          <p className="mt-2 text-sm text-[#697182]">{searchError}</p>
          <p className="mt-1 text-xs text-[#8a92a3]">다른 항목으로 검색해보세요.</p>
        </article>
      ) : null}

      {costResult ? (
        <article className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
          {/* 헤더 — 항목명 + 배지 */}
          <div className="border-b border-black/5 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-[#17191f]">{costResult.matchedItem}</h2>
              {priceBadge ? <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${priceBadge.className}`}>{priceBadge.label}</span> : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8a92a3]">
              <span>{regionLabel}</span>
              <span className="text-black/20">·</span>
              <span>표본 {costResult.priceStats.sampleSize.toLocaleString('ko-KR')}건</span>
              {costResult.dataInfo?.latestDate ? (
                <>
                  <span className="text-black/20">·</span>
                  <span>{latestUpdatedLabel}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* 핵심 가격 — 중앙값 크게, 범위는 서브 */}
          <div className="px-6 py-6">
            <p className="text-xs font-medium text-[#697182]">대부분 이 정도 비용이에요</p>
            <p className="mt-1 text-[2.5rem] font-extrabold tracking-tight text-[#ff7a45]" style={{ fontFeatureSettings: "'tnum'" }}>
              {toWon(costResult.priceStats.median)}
            </p>

            {/* 범위 바 */}
            <div className="mt-5">
              <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-[#e5e7eb] via-[#ffd6bf] to-[#e5e7eb]">
                {/* 중앙값 마커 */}
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#ff7a45] shadow-[0_2px_8px_rgba(255,122,69,0.4)]"
                  style={{ left: getChartWidth(costResult.priceStats.median) }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#8a92a3]">
                <span>최저 {toWon(costResult.priceStats.min)}</span>
                <span>최고 {toWon(costResult.priceStats.max)}</span>
              </div>
            </div>

            {/* 평균 비교 — 전국 vs 지역 (지역이 전국과 다를 때만 둘 다 표시) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl bg-[#faf6f1] px-4 py-3">
                <span className="text-sm text-[#697182]">전국 평균</span>
                <span className="text-sm font-bold text-[#17191f]">{toWon(costResult.nationalAvg)}</span>
              </div>
              {regionLabel !== '전국' ? (
                <div className="flex items-center justify-between rounded-2xl bg-[#faf6f1] px-4 py-3">
                  <span className="text-sm text-[#697182]">{regionLabel} 평균</span>
                  <span className="text-sm font-bold text-[#17191f]">{toWon(costResult.regionalAvg)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* 데이터 출처 */}
          <div className="border-t border-black/5 px-6 py-4">
            {costResult.dataInfo && costResult.dataInfo.totalRecords > 0 ? (
              <p className="text-xs text-[#a85a35]">
                실제 진료 기록 {costResult.dataInfo.totalRecords.toLocaleString('ko-KR')}건 기반
              </p>
            ) : (
              <p className="text-xs text-[#8a92a3]">공공데이터 기준 참고 범위</p>
            )}
            {costResult.sources.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {costResult.sources.map((source) => (
                  <span key={source} className="rounded-full bg-[#f3f5f9] px-2.5 py-1 text-[11px] font-medium text-[#8a92a3]">
                    {source}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* 연관 항목 */}
          {costResult.relatedItems.filter((item) => item !== costResult.matchedItem).length > 0 ? (
            <div className="border-t border-black/5 px-6 py-4">
              <p className="text-xs font-semibold text-[#697182]">이것도 궁금하지 않으세요?</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {costResult.relatedItems.filter((item) => item !== costResult.matchedItem).slice(0, 8).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      void runSearch(item);
                    }}
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#4f5868] transition hover:border-[#ff7a45]/40 hover:text-[#ff7a45]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ) : null}

      {user && myComparison ? (
        <article className="rounded-3xl border border-[#ff7a45]/20 bg-[#fff9f5] p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#ff7a45]" />
            <p className="text-sm font-bold text-[#17191f]">내 진료비 비교</p>
          </div>
          <p className="mt-2 text-sm text-[#4f5868]">
            내 평균 <span className="font-bold text-[#17191f]">{toWon(myComparison.average)}</span> — 전체 평균보다{' '}
            <span className={`font-bold ${myComparison.isHigher ? 'text-[#F04452]' : 'text-[#06B56C]'}`}>
              {Math.abs(myComparison.diffPercent).toFixed(1)}% {myComparison.isHigher ? '높아요' : '낮아요'}
            </span>
          </p>
          <p className="mt-1 text-xs text-[#8a92a3]">내 기록 {myComparison.sampleSize}건 기준</p>
        </article>
      ) : null}

      {costResult ? <CareGuide keyword={costResult.matchedItem} /> : null}

    </section>
  );
}




