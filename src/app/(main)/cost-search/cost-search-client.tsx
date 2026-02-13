'use client';

import { useEffect, useMemo, useState } from 'react';

import Paywall from '@/components/paywall';
import { useAuth } from '@/components/auth-provider';
import { isPremium } from '@/lib/subscription';

type ProcedureData = {
  label: string;
  nationalAverage: number;
  seoulAverage: number;
  min: number;
  max: number;
  average: number;
  hasEnoughData: boolean;
};

const procedures: ProcedureData[] = [
  {
    label: '혈액검사',
    nationalAverage: 9,
    seoulAverage: 11,
    min: 6,
    max: 18,
    average: 9,
    hasEnoughData: true,
  },
  {
    label: '스케일링',
    nationalAverage: 24,
    seoulAverage: 28,
    min: 17,
    max: 43,
    average: 24,
    hasEnoughData: true,
  },
  {
    label: '슬개골수술',
    nationalAverage: 180,
    seoulAverage: 205,
    min: 140,
    max: 320,
    average: 180,
    hasEnoughData: false,
  },
  {
    label: '중성화수술',
    nationalAverage: 29,
    seoulAverage: 33,
    min: 20,
    max: 55,
    average: 29,
    hasEnoughData: true,
  },
  {
    label: '예방접종',
    nationalAverage: 5,
    seoulAverage: 7,
    min: 3,
    max: 10,
    average: 5,
    hasEnoughData: true,
  },
];

const popularTags = ['혈액검사', '스케일링', '슬개골수술', '중성화수술', '예방접종'];
const animalTypes = ['강아지', '고양이'] as const;
const regions = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원'];

const toManwon = (value: number) => `${value.toLocaleString('ko-KR')}만원`;

export default function CostSearchClient() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState('');
  const [animalType, setAnimalType] = useState<(typeof animalTypes)[number]>('강아지');
  const [region, setRegion] = useState('서울');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

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

  const selectedProcedure = useMemo(() => {
    const normalized = query.trim().replace(/\s+/g, '');

    return (
      procedures.find((procedure) => procedure.label.replace(/\s+/g, '').includes(normalized)) ??
      procedures[0]
    );
  }, [query]);

  const chartRange = selectedProcedure.max - selectedProcedure.min;
  const averagePosition =
    chartRange === 0 ? 0 : ((selectedProcedure.average - selectedProcedure.min) / chartRange) * 100;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5" aria-label="진료비 검색">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-slate-900">진료비 검색</h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            이번 달 0/3회 검색
          </span>
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition focus:ring"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              동물 종류
              <select
                value={animalType}
                onChange={(event) => setAnimalType(event.target.value as (typeof animalTypes)[number])}
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition focus:ring"
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
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition focus:ring"
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
        <h2 className="text-base font-bold text-slate-900">가격 범위</h2>
        <p className="mt-1 text-sm text-slate-500">{selectedProcedure.label} 기준 예측 범위</p>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <div className="relative h-6">
            <div className="absolute left-0 top-2 h-2 w-full rounded-full bg-slate-200" />
            <div
              className="absolute top-2 h-2 rounded-full bg-blue-200"
              style={{ width: '100%' }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 h-6 w-1 -translate-x-1/2 rounded-full bg-blue-600"
              style={{ left: `${averagePosition}%` }}
              aria-label="평균 가격 위치"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
            <span>최소 {toManwon(selectedProcedure.min)}</span>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
              평균 {toManwon(selectedProcedure.average)}
            </span>
            <span>최대 {toManwon(selectedProcedure.max)}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">전국 평균</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{toManwon(selectedProcedure.nationalAverage)}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{region} 평균</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{toManwon(selectedProcedure.seoulAverage)}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">데이터 출처: 공공데이터 + 사용자 제공 데이터</p>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">AI 비용 분석</h2>
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
              {selectedProcedure.label}의 평균 비용은 {toManwon(selectedProcedure.average)}이며, 검사/마취/입원 여부에
              따라 차이가 큽니다.
            </div>
            <div className="rounded-xl bg-blue-600 p-3 text-sm text-white">
              항목별로 비용이 어떻게 달라지는지 알려줘.
            </div>
            <p className="text-xs text-slate-500">
              의료적 판단은 제공하지 않으며, 가격 비교 및 항목 설명 중심으로 안내해요.
            </p>
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

      {!loading && !isPremiumUser ? (
        <article className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <h2 className="text-base font-bold text-orange-900">프리미엄 전용 분석</h2>
          <ul className="mt-2 space-y-1 text-sm text-orange-800">
            <li>• 항목별 가격 분석</li>
            <li>• 지역/품종별 비교</li>
            <li>• 연간 진료비 리포트</li>
          </ul>
        </article>
      ) : null}

      {!selectedProcedure.hasEnoughData ? (
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-base font-bold text-amber-900">데이터가 아직 충분하지 않아요</h2>
          <p className="mt-2 text-sm text-amber-900">
            일반적으로 {toManwon(selectedProcedure.min)}~{toManwon(selectedProcedure.max)} 범위입니다 (공공데이터 기준).
          </p>
          <p className="mt-2 text-sm text-amber-800">
            영수증을 등록해주시면 더 정확한 비교가 가능해져요!
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            영수증 등록하기
          </button>
        </article>
      ) : null}

      <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-800">앱에서 영수증을 등록하면 자동 비교 분석돼요</p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          앱 연동하고 영수증 등록하기
        </button>
      </article>
    </section>
  );
}
