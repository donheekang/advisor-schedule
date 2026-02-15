'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import AffiliateProducts from '@/components/affiliate-products';
import CostChat from '@/components/cost-chat';
import Paywall from '@/components/paywall';
import { apiClient } from '@/lib/api-client';
import { isPremium } from '@/lib/subscription';

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

function toWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, '').toLowerCase();
}

function extractMyItemPrices(records: unknown, keyword: string): number[] {
  if (!Array.isArray(records)) {
    return [];
  }

  const normalizedKeyword = normalize(keyword);

  const prices = records.flatMap((record) => {
    if (!record || typeof record !== 'object') {
      return [];
    }

    const typedRecord = record as Record<string, unknown>;
    const candidates = [typedRecord.items, typedRecord.health_items, typedRecord.healthItems].find((value) =>
      Array.isArray(value)
    );

    if (!Array.isArray(candidates)) {
      return [];
    }

    return candidates
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const typedItem = item as Record<string, unknown>;
        const itemName =
          typeof typedItem.item_name === 'string'
            ? typedItem.item_name
            : typeof typedItem.itemName === 'string'
              ? typedItem.itemName
              : '';

        const rawPrice =
          typeof typedItem.price === 'number' || typeof typedItem.price === 'string'
            ? Number(typedItem.price)
            : typeof typedItem.amount === 'number' || typeof typedItem.amount === 'string'
              ? Number(typedItem.amount)
              : NaN;

        if (!itemName || !Number.isFinite(rawPrice)) {
          return null;
        }

        return normalize(itemName).includes(normalizedKeyword) ? rawPrice : null;
      })
      .filter((value): value is number => value !== null);
  });

  return prices;
}

export default function CostSearchClient() {
  const { user, loading, token } = useAuth();
  const [query, setQuery] = useState('혈액검사');
  const [animalType, setAnimalType] = useState<(typeof animalTypes)[number]>('강아지');
  const [region, setRegion] = useState('전국');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [costResult, setCostResult] = useState<ApiCostSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [myComparison, setMyComparison] = useState<MyPriceComparison | null>(null);
  const [comparingMine, setComparingMine] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkPremium() {
      if (!user?.uid) {
        if (isMounted) {
          setIsPremiumUser(false);
        }

        return;
      }

      const premiumStatus = await isPremium(user.uid);

      if (isMounted) {
        setIsPremiumUser(premiumStatus);
      }
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
    if (!costResult) {
      return null;
    }

    const ratio = (costResult.priceStats.avg - costResult.nationalAvg) / costResult.nationalAvg;

    if (ratio <= -0.05) {
      return {
        label: '평균보다 저렴해요 😊',
        className: 'bg-emerald-100 text-emerald-700'
      };
    }

    if (ratio >= 0.05) {
      return {
        label: '평균보다 높아요 😮',
        className: 'bg-rose-100 text-rose-700'
      };
    }

    return {
      label: '적정 가격이에요 👍',
      className: 'bg-amber-100 text-amber-700'
    };
  }

  const priceBadge = getPriceBadge();

  const maxChartValue = costResult ? Math.max(costResult.priceStats.max, costResult.nationalAvg, costResult.regionalAvg) : 0;

  function getChartWidth(value: number) {
    if (!maxChartValue) {
      return '0%';
    }

    return `${Math.max(8, (value / maxChartValue) * 100)}%`;
  }

  async function handleCompareMine() {
    if (!user || !costResult || !token) {
      return;
    }

    setComparingMine(true);
    try {
      apiClient.setToken(token);
      const records = await apiClient.listRecords(undefined, true);
      const prices = extractMyItemPrices(records, costResult.query);

      if (prices.length === 0) {
        setMyComparison(null);
        return;
      }

      const myAverage = prices.reduce((sum, value) => sum + value, 0) / prices.length;
      const diffPercent = ((myAverage - costResult.priceStats.avg) / costResult.priceStats.avg) * 100;

      setMyComparison({
        item: costResult.matchedItem,
        average: myAverage,
        diffPercent,
        isHigher: diffPercent >= 0,
        sampleSize: prices.length
      });
    } finally {
      setComparingMine(false);
    }
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-4 py-8" aria-label="진료비 검색">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-2 text-center text-[#4F2A1D]">
        <h1 className="text-3xl font-extrabold">💰 우리 아이 진료비, 비싼 걸까?</h1>
        <p className="text-sm font-medium">전국 평균 데이터와 비교해보세요</p>
        </header>

        <article className="rounded-3xl bg-white p-6 shadow-lg">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void runSearch(query);
          }}
        >
          <label htmlFor="cost-search-input" className="block text-sm font-semibold text-slate-700">
            어떤 진료를 받으셨나요?
          </label>
          <input
            id="cost-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 혈액검사, 스케일링, 슬개골 수술"
            className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3 text-sm text-[#4F2A1D] outline-none transition focus:border-[#F97316]"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              동물 종류
              <select
                value={animalType}
                onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                className="rounded-2xl border border-[#F8C79F] px-3 py-3 text-sm text-[#4F2A1D] outline-none transition focus:border-[#F97316]"
              >
                {animalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              지역
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="rounded-2xl border border-[#F8C79F] px-3 py-3 text-sm text-[#4F2A1D] outline-none transition focus:border-[#F97316]"
              >
                {regions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
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
                className="rounded-full border border-[#F8C79F] bg-[#FFF8F0] px-3 py-1.5 text-xs font-medium text-[#7A4A36] transition hover:bg-[#FFEEDC]"
              >
                #{tag}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={searching}
            className="w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
          >
            {searching ? '검색 중...' : '진료비 검색하기'}
          </button>
        </form>
        </article>

        {!hasSearched ? (
          <article className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 text-base font-semibold text-[#7A4A36]">진료 항목을 검색해보세요</p>
          </article>
        ) : null}

        {searchError && !costResult ? (
          <article className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-4xl">😢</p>
            <p className="mt-3 text-base font-semibold text-[#7A4A36]">해당 항목의 데이터가 아직 없어요</p>
            <p className="mt-2 text-xs text-slate-500">{searchError}</p>
          </article>
        ) : null}

        {costResult ? (
          <article className="space-y-4 rounded-2xl bg-white p-5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#4F2A1D]">{costResult.matchedItem}</h2>
            {priceBadge ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priceBadge.className}`}>{priceBadge.label}</span> : null}
          </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-md">
              <p className="text-xs text-[#7A4A36]">검색 결과 평균</p>
              <p className="mt-1 text-2xl font-bold text-[#F97316]">{toWon(costResult.priceStats.avg)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-md">
              <p className="text-xs text-[#7A4A36]">전국 평균</p>
              <p className="mt-1 text-2xl font-bold text-[#F97316]">{toWon(costResult.nationalAvg)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-md">
              <p className="text-xs text-[#7A4A36]">{region} 평균</p>
              <p className="mt-1 text-2xl font-bold text-[#F97316]">{toWon(costResult.regionalAvg)}</p>
              </div>
            </div>

          <div className="space-y-3 rounded-2xl bg-[#FFF8F0] p-4">
            <h3 className="text-sm font-semibold text-[#7A4A36]">평균 비교 차트</h3>
            {[
              { label: '최소', value: costResult.priceStats.min, color: 'bg-amber-300' },
              { label: '평균', value: costResult.priceStats.avg, color: 'bg-orange-400' },
              { label: '최대', value: costResult.priceStats.max, color: 'bg-orange-500' }
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#7A4A36]">
                  <span>{item.label}</span>
                  <span>{toWon(item.value)}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#FFE7CF]">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: getChartWidth(item.value) }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {costResult.sources.map((source) => (
              <span key={source} className="rounded-full bg-[#FFEEDC] px-2 py-1 text-xs text-[#7A4A36]">
                {source}
              </span>
            ))}
          </div>

          {user ? (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => void handleCompareMine()}
                disabled={comparingMine}
                className="rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {comparingMine ? '내 진료비 불러오는 중...' : '내 진료비 비교'}
              </button>
              {myComparison ? (
                <p className="mt-3 text-sm text-[#7A4A36]">
                  내 평균은 {toWon(myComparison.average)}이며, 전체 평균보다{' '}
                  <span className="font-semibold text-[#F97316]">{Math.abs(myComparison.diffPercent).toFixed(1)}%</span>{' '}
                  {myComparison.isHigher ? '높아요.' : '낮아요.'}
                </p>
              ) : (
                <p className="mt-3 text-xs text-[#9A6A52]">로그인 기록 기반으로 같은 항목을 비교합니다.</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#9A6A52]">로그인하면 내 기록과의 비교도 확인할 수 있어요.</p>
          )}
          </article>
        ) : null}

        {costResult ? <AffiliateProducts itemName={costResult.matchedItem} /> : null}

        {costResult ? (
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#1B3A4B]">AI 비용 분석</h2>
            {isPremiumUser ? (
              <button
                type="button"
                onClick={() => setIsChatOpen((prev) => !prev)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                이 가격이 궁금하세요?
              </button>
            ) : null}
          </div>

          {loading ? (
            <p className="mt-3 text-sm text-slate-500">구독 상태를 확인 중입니다...</p>
          ) : isPremiumUser && isChatOpen ? (
            <>
              <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-xl bg-white p-3 text-sm text-slate-700">
                  {costResult?.matchedItem ?? query}의 평균 비용은 {toWon(costResult?.priceStats.avg ?? 0)}이며, 검사/마취/입원 여부에
                  따라 차이가 큽니다.
                </div>
                <div className="rounded-xl bg-blue-600 p-3 text-sm text-white">항목별로 비용이 어떻게 달라지는지 알려줘.</div>
                <p className="text-xs text-slate-500">의료적 판단은 제공하지 않으며, 가격 비교 및 항목 설명 중심으로 안내해요.</p>
              </div>
            </>
          ) : !isPremiumUser ? (
            <div className="mt-4">
              <Paywall
                title="AI 비용 분석은 프리미엄 전용 기능입니다"
                description="무료 플랜에서는 월 3회까지 검색만 가능하며, AI 분석은 프리미엄에서 무제한으로 제공돼요."
                featureName="AI 비용 분석"
              />
            </div>
          ) : null}
          </article>
        ) : null}

        {costResult ? (
          <CostChat
          itemName={costResult.matchedItem}
          region={region}
          stats={{
            average: costResult.priceStats.avg,
            min: costResult.priceStats.min,
            max: costResult.priceStats.max,
            sampleSize: costResult.priceStats.sampleSize,
            source: costResult.sources.join(', ')
          }}
          seedRange={{
            min: costResult.priceStats.min,
            max: costResult.priceStats.max,
            source: '공공데이터 기준 참고 범위'
          }}
          />
        ) : null}
      </div>
    </section>
  );
}
