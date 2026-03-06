'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';
import { apiClient } from '@/lib/api-client';
import { PetCard } from '@/components/mypage/pet-card';
import type { PetData } from '@/components/mypage/pet-card';
import { SummaryStats } from '@/components/mypage/summary-stats';
import type { SummaryData } from '@/components/mypage/summary-stats';

type PetsApiResponse = {
  pets?: PetData[];
};

type ApiRecordItem = {
  item_name?: string;
  name?: string;
};

type ApiRecord = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  items?: ApiRecordItem[];
};

type RecordTimelineItem = {
  id: string;
  visitDate: string;
  hospitalName: string;
  itemName: string;
  totalAmount: number;
};

const currencyFormatter = new Intl.NumberFormat('ko-KR');

function formatVisitDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '날짜 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsedDate);
}

function normalizeRecordTimeline(records: ApiRecord[]): RecordTimelineItem[] {
  return records
    .map((record, index) => ({
      id: record.id ?? `record-${index}`,
      visitDate: record.visit_date ?? '',
      hospitalName: record.hospital_name ?? '병원 정보 없음',
      itemName: record.items?.[0]?.item_name ?? record.items?.[0]?.name ?? '진료 항목 정보 없음',
      totalAmount: record.total_amount ?? 0
    }))
    .sort((left, right) => new Date(right.visitDate).getTime() - new Date(left.visitDate).getTime())
    .slice(0, 5);
}

export default function MyPageClient() {
  const { user, loading, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [pets, setPets] = useState<PetData[]>([]);
  const [records, setRecords] = useState<RecordTimelineItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      setPets([]);
      setRecords([]);
      return;
    }

    let isMounted = true;

    async function fetchMyPageData() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const [summaryResponse, petsResponse, recordsResponse] = await Promise.all([
          apiClient.getMeSummary() as Promise<SummaryData>,
          apiClient.listPets() as Promise<PetsApiResponse | PetData[]>,
          apiClient.listRecords(undefined, true) as Promise<ApiRecord[]>
        ]);

        if (!isMounted) {
          return;
        }

        const petList = Array.isArray(petsResponse) ? petsResponse : (petsResponse.pets ?? []);
        const recordList = Array.isArray(recordsResponse) ? recordsResponse : [];

        setSummary(summaryResponse);
        setPets(petList);
        setRecords(normalizeRecordTimeline(recordList));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('마이페이지 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchMyPageData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isPremium = useMemo(() => summary?.effective_tier === 'premium', [summary]);

  if (loading) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-20 md:px-6">
        <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-black/[0.04]">
          <p className="text-sm text-[#697182]">로그인 상태를 확인하고 있어요...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <>
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-20 md:px-6">
          <div className="flex flex-col items-center rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f5_40%,#fff0ea_100%)] px-6 py-14 text-center shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ff7a45]/10 blur-3xl" />
            <svg className="h-12 w-12 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 19a7.5 7.5 0 0 1 15 0" />
            </svg>
            <h1 className="mt-5 text-2xl font-bold text-[#17191f]">로그인하면 앱 데이터를 웹에서도 볼 수 있어요</h1>
            <p className="mt-2 text-sm text-[#697182]">진료 기록, 반려동물 정보를 한 눈에 확인하세요</p>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="mt-8 rounded-2xl bg-[#ff7a45] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e86d3c] active:scale-[0.98]"
            >
              로그인
            </button>
          </div>
        </section>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-20 md:px-6">
        {/* 프로필 헤더 */}
        <header className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f5_40%,#fff0ea_100%)] px-6 py-9 shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ff7a45]/10 blur-3xl" />
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a45] text-2xl font-bold text-white">
              {user.displayName?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#17191f] md:text-3xl">
                {user.displayName ?? '보호자'}님
              </h1>
              <p className="text-sm text-[#697182]">{user.email}</p>
              {isPremium ? (
                <span className="mt-1 inline-flex rounded-full bg-[#ff7a45] px-3 py-1 text-xs font-bold text-white">
                  프리미엄
                </span>
              ) : (
                <Link
                  href="/premium"
                  className="mt-1 inline-flex rounded-full bg-[#fff0ea] px-3 py-1 text-xs font-bold text-[#ff7a45] ring-1 ring-[#ff7a45]/10 transition hover:bg-[#ffe8dd]"
                >
                  프리미엄으로 업그레이드
                </Link>
              )}
            </div>
          </div>
        </header>

        {isFetching ? (
          <div className="rounded-[2rem] bg-white p-6 text-center ring-1 ring-black/[0.04]">
            <p className="text-sm text-[#697182]">데이터를 불러오는 중이에요...</p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-[2rem] bg-rose-50 p-5 text-sm font-medium text-rose-600 ring-1 ring-rose-200/50">
            {errorMessage}
          </div>
        ) : null}

        {/* 데이터 요약 */}
        {summary && !isFetching ? <SummaryStats summary={summary} /> : null}

        {/* 우리 아이들 */}
        <section className="rounded-[2rem] bg-white p-6 ring-1 ring-black/[0.04] sm:p-7">
          <h2 className="text-lg font-bold text-[#17191f]">우리 아이들</h2>
          {pets.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-[#fff8f5] p-6 text-center">
              <p className="text-sm text-[#697182]">등록된 반려동물이 없어요.</p>
              <p className="mt-1 text-xs text-[#697182]">앱에서 반려동물을 등록하면 여기에 표시돼요.</p>
            </div>
          )}
        </section>

        {/* 진료 기록 타임라인 */}
        <section className="rounded-[2rem] bg-white p-6 ring-1 ring-black/[0.04] sm:p-7">
          <h2 className="text-lg font-bold text-[#17191f]">최근 진료 기록</h2>
          {records.length > 0 ? (
            <div className="relative mt-5 space-y-4 pl-6 before:absolute before:bottom-2 before:left-[0.45rem] before:top-2 before:w-0.5 before:rounded-full before:bg-[#ff7a45]/15 before:content-['']">
              {records.map((record) => (
                <article
                  key={record.id}
                  className="relative rounded-2xl bg-[#fff8f5] p-5 ring-1 ring-black/[0.04]"
                >
                  <span className="absolute -left-[1.05rem] top-5 h-3 w-3 rounded-full border-2 border-white bg-[#ff7a45] shadow-sm" />
                  <p className="text-xs font-medium text-[#697182]">{formatVisitDate(record.visitDate)}</p>
                  <p className="mt-1 font-bold text-[#17191f]">{record.hospitalName}</p>
                  <p className="text-sm text-[#697182]">{record.itemName}</p>
                  <p className="mt-2 text-xl font-bold text-[#ff7a45]">
                    {currencyFormatter.format(record.totalAmount)}원
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-[#fff8f5] p-6 text-center">
              <p className="text-sm text-[#697182]">최근 진료 기록이 없어요.</p>
            </div>
          )}
        </section>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={() => {
            void signOut();
          }}
          className="self-start rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#697182] ring-1 ring-black/[0.04] transition hover:bg-[#fff8f5] hover:text-[#17191f]"
        >
          로그아웃
        </button>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
