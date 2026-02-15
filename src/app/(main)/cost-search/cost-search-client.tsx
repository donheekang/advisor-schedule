'use client';

import { useEffect, useMemo, useState } from 'react';

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

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      const trimmed = query.trim();
      if (!trimmed) {
        return;
      }

      setSearching(true);
      setSearchError(null);
      setMyComparison(null);

      try {
        const species = animalType === '강아지' ? 'dog' : 'cat';
        const params = new URLSearchParams({ query: trimmed, species, region });
        const response = await fetch(`/api/cost-search?${params.toString()}`);
        const data = (await response.json()) as ApiCostSearchResult | { error?: string };

        if (!response.ok || 'error' in data) {
          throw new Error('error' in data ? data.error : '검색 결과를 가져오지 못했습니다.');
        }

        if (!cancelled) {
          setCostResult(data as ApiCostSearchResult);
        }
      } catch (error) {
        if (!cancelled) {
          setSearchError(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
          setCostResult(null);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [animalType, query, region]);

  const averagePosition = useMemo(() => {
    if (!costResult) {
      return 0;
    }

    const range = costResult.priceStats.max - costResult.priceStats.min;
    if (range === 0) {
      return 0;
    }

    return ((costResult.priceStats.avg - costResult.priceStats.min) / range) * 100;
  }, [costResult]);

  const myPosition = useMemo(() => {
    if (!costResult || !myComparison) {
      return null;
    }

    const range = costResult.priceStats.max - costResult.priceStats.min;
    if (range <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, ((myComparison.average - costResult.priceStats.min) / range) * 100));
  }, [costResult, myComparison]);

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
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5" aria-label="진료비 검색">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-[#1B3A4B]">진료비 검색</h1>
        </div>

        <div className="space-y-3">
          <label htmlFor="cost-search-input" className="block text-sm font-semibold text-slate-700">
            어떤 진료를 받으셨나요?
          </label>
          <input
            id="cost-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 혈액검사, 스케일링, 슬개골 수술"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1B3A4B] outline-none ring-[#2A9D8F]/40 transition focus:ring"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              동물 종류
              <select
                value={animalType}
                onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#1B3A4B] outline-none ring-[#2A9D8F]/40 transition focus:ring"
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
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-[#1B3A4B] outline-none ring-[#2A9D8F]/40 transition focus:ring"
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
                onClick={() => setQuery(tag)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#1B3A4B]">가격 범위</h2>
        <p className="mt-1 text-sm text-slate-500">
          {costResult?.matchedItem ?? query} 기준 참고 범위 {searching ? '(검색 중...)' : ''}
        </p>

        {searchError ? <p className="mt-3 text-sm text-red-500">{searchError}</p> : null}

        {costResult ? (
          <>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="relative h-6">
                <div className="absolute left-0 top-2 h-2 w-full rounded-full bg-slate-200" />
                <div className="absolute top-2 h-2 w-full rounded-full bg-blue-200" aria-hidden="true" />
                <div
                  className="absolute top-0 h-6 w-1 -translate-x-1/2 rounded-full bg-blue-600"
                  style={{ left: `${averagePosition}%` }}
                  aria-label="평균 가격 위치"
                />
                {myPosition !== null ? (
                  <div
                    className="absolute top-0 h-6 w-1 -translate-x-1/2 rounded-full bg-violet-600"
                    style={{ left: `${myPosition}%` }}
                    aria-label="내 진료비 위치"
                  />
                ) : null}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>최소 {toWon(costResult.priceStats.min)}</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">평균 {toWon(costResult.priceStats.avg)}</span>
                <span>최대 {toWon(costResult.priceStats.max)}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">전국 평균</p>
                <p className="mt-1 text-xl font-bold text-[#1B3A4B]">{toWon(costResult.nationalAvg)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{region} 평균</p>
                <p className="mt-1 text-xl font-bold text-[#1B3A4B]">{toWon(costResult.regionalAvg)}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {costResult.sources.map((source) => (
                <span key={source} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {source}
                </span>
              ))}
            </div>

            {user ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => void handleCompareMine()}
                  disabled={comparingMine}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
                >
                  {comparingMine ? '내 진료비 불러오는 중...' : '내 진료비 비교'}
                </button>
                {myComparison ? (
                  <p className="mt-3 text-sm text-slate-700">
                    내 진료비 평균은 {toWon(myComparison.average)}이며, 전체 평균보다{' '}
                    <span className="font-semibold text-violet-700">{Math.abs(myComparison.diffPercent).toFixed(1)}%</span>{' '}
                    {myComparison.isHigher ? '높아요.' : '낮아요.'} (내 기록 {myComparison.sampleSize}건)
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">로그인 사용자의 진료 기록에서 항목을 찾아 비교합니다.</p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-500">로그인하면 내 진료 기록 기반 비교를 확인할 수 있어요.</p>
            )}
          </>
        ) : null}
      </article>

      {costResult ? <AffiliateProducts itemName={costResult.matchedItem} /> : null}

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
          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="rounded-xl bg-white p-3 text-sm text-slate-700">
              {costResult?.matchedItem ?? query}의 평균 비용은 {toWon(costResult?.priceStats.avg ?? 0)}이며, 검사/마취/입원 여부에
              따라 차이가 큽니다.
            </div>
            <div className="rounded-xl bg-blue-600 p-3 text-sm text-white">항목별로 비용이 어떻게 달라지는지 알려줘.</div>
            <p className="text-xs text-slate-500">의료적 판단은 제공하지 않으며, 가격 비교 및 항목 설명 중심으로 안내해요.</p>
          </div>
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
    </section>
  );
}
