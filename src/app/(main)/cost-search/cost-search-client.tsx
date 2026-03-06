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
  const [query, setQuery] = useState('혈액검사');
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
              펫토커 열기
            </Link>
            <Link
              href="/ai-care"
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#17191f] transition hover:bg-black/5"
            >
              예상 진료비
            </Link>
            <Link
              href="/mypage"
              className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.24)] transition hover:brightness-95"
            >
              앱 기록 연동
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
          <p className="text-lg font-semibold text-[#17191f]">진료 항목을 검색해보세요</p>
          <p className="mt-2 text-sm text-[#697182]">최저/중앙/최고 비용, 지역, 최근 업데이트 일자를 제공합니다.</p>
        </article>
      ) : null}

      {searchError && !costResult ? (
        <article className="rounded-3xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-lg font-semibold text-[#17191f]">해당 항목의 데이터가 아직 충분하지 않아요</p>
          <p className="mt-2 text-sm text-[#697182]">{searchError}</p>
        </article>
      ) : null}

      {costResult ? (
        <article className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#17191f]">{costResult.matchedItem}</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#f3f5f9] px-3 py-1 font-medium text-[#4f5868]">지역: {regionLabel}</span>
                <span className="rounded-full bg-[#f3f5f9] px-3 py-1 font-medium text-[#4f5868]">
                  최근 업데이트: {latestUpdatedLabel}
                </span>
                <span className="rounded-full bg-[#f3f5f9] px-3 py-1 font-medium text-[#4f5868]">
                  표본: {costResult.priceStats.sampleSize.toLocaleString('ko-KR')}건
                </span>
              </div>
            </div>
            {priceBadge ? <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${priceBadge.className}`}>{priceBadge.label}</span> : null}
          </div>

          {costResult.dataInfo && costResult.dataInfo.totalRecords > 0 ? (
            <div className="rounded-2xl bg-[#fff0e5] px-4 py-3 text-xs text-[#a85a35] ring-1 ring-[#ffd6bf]">
              실제 진료 기록 {costResult.dataInfo.totalRecords.toLocaleString('ko-KR')}건 기반 데이터입니다.
            </div>
          ) : (
            <div className="rounded-2xl bg-[#faf6f1] px-4 py-3 text-xs text-[#697182] ring-1 ring-black/10">
              공공데이터 기준 참고 범위로 제공됩니다.
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4">
              <p className="text-xs font-medium text-[#697182]">최저</p>
              <p className="mt-1 text-2xl font-semibold text-[#17191f]">{toWon(costResult.priceStats.min)}</p>
            </div>
            <div className="rounded-2xl border border-[#ff7a45]/20 bg-[#fff0e5] p-4">
              <p className="text-xs font-medium text-[#d87b49]">중앙값</p>
              <p className="mt-1 text-2xl font-semibold text-[#ff7a45]">{toWon(costResult.priceStats.median)}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4">
              <p className="text-xs font-medium text-[#697182]">최고</p>
              <p className="mt-1 text-2xl font-semibold text-[#17191f]">{toWon(costResult.priceStats.max)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4">
              <p className="text-xs font-medium text-[#697182]">전국 평균</p>
              <p className="mt-1 text-lg font-semibold text-[#17191f]">{toWon(costResult.nationalAvg)}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4">
              <p className="text-xs font-medium text-[#697182]">{regionLabel} 평균</p>
              <p className="mt-1 text-lg font-semibold text-[#17191f]">{toWon(costResult.regionalAvg)}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-[#faf6f1] p-5 ring-1 ring-black/5">
            <h3 className="text-sm font-semibold text-[#17191f]">비용 분포</h3>
            {[
              { label: '최저', value: costResult.priceStats.min, color: 'bg-[#9ca3af]' },
              { label: '중앙값', value: costResult.priceStats.median, color: 'bg-[#ff7a45]' },
              { label: '최고', value: costResult.priceStats.max, color: 'bg-[#374151]' }
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-[#4f5868]">
                  <span>{item.label}</span>
                  <span className="font-semibold">{toWon(item.value)}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#e5e7eb]">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: getChartWidth(item.value) }} />
                </div>
              </div>
            ))}
          </div>

          {costResult.relatedItems.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#697182]">연관 항목</p>
              <div className="flex flex-wrap gap-2">
                {costResult.relatedItems.slice(0, 8).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      void runSearch(item);
                    }}
                    className="rounded-full border border-black/10 bg-[#fffaf5] px-3 py-1.5 text-xs font-medium text-[#4f5868] transition hover:border-[#ff7a45]/40 hover:text-[#ff7a45]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {costResult.sources.map((source) => (
              <span key={source} className="rounded-full bg-[#f3f5f9] px-3 py-1.5 text-xs font-medium text-[#697182]">
                {source}
              </span>
            ))}
          </div>
        </article>
      ) : null}

      {user && myComparison ? (
        <article className="rounded-3xl border border-[#cfe2ff] bg-[#fff0e5] p-5">
          <p className="text-sm font-semibold text-[#a85a35]">내 기록 비교 결과</p>
          <p className="mt-2 text-sm text-[#a85a35]">
            내 평균은 <span className="font-semibold">{toWon(myComparison.average)}</span>이며, 전체 평균보다{' '}
            <span className="font-semibold">{Math.abs(myComparison.diffPercent).toFixed(1)}%</span>{' '}
            {myComparison.isHigher ? '높아요.' : '낮아요.'}
          </p>
          <p className="mt-1 text-xs text-[#d87b49]">내 기록 표본 {myComparison.sampleSize}건 기준</p>
        </article>
      ) : user && costResult ? (
        <article className="rounded-3xl border border-black/10 bg-white p-4 text-xs text-[#697182]">
          앱 기록과 비교하려면 위의 고정 CTA에서 &apos;지금 내 기록과 비교&apos;를 눌러주세요.
        </article>
      ) : null}

      {costResult ? <CareGuide keyword={costResult.matchedItem} /> : null}

    </section>
  );
}




