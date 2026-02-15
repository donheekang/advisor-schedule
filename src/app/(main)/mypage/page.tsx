'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';
import { apiClient } from '@/lib/api-client';
import type { PetData } from '@/components/mypage/pet-card';
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

function getAgeLabel(birthDate: string | null): string {
  if (!birthDate) {
    return '나이 정보 없음';
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return '나이 정보 없음';
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }

  return years >= 0 ? `${years}살` : '나이 정보 없음';
}

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

function getPetIcon(species: string): string {
  const normalized = species.toLowerCase();

  if (normalized.includes('cat') || normalized.includes('고양')) {
    return '🐈';
  }

  return '🐕';
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

export default function MyPage() {
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
      <section className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-10 text-center shadow-lg">
        <p className="text-sm text-[#A36241]">로그인 상태를 확인하고 있어요...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl bg-gradient-to-br from-[#4F2A1D] to-[#2D1B0E] px-6 py-14 text-center text-white shadow-xl">
          <p className="text-5xl">🐾</p>
          <p className="mt-5 text-xl font-extrabold">로그인하면 앱 데이터를 웹에서도 볼 수 있어요</p>
          <p className="mt-2 text-sm text-white/70">진료 기록, 반려동물 정보를 한 눈에 확인하세요</p>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-8 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            로그인
          </button>
        </section>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 sm:p-8">
        <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/30 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] text-3xl font-bold text-white shadow-lg">
              {user.displayName?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-[#4F2A1D] sm:text-3xl">
                {user.displayName ?? '보호자'}님
              </h1>
              <p className="text-sm text-[#A36241]">{user.email}</p>
              {isPremium ? (
                <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] px-3 py-1 text-xs font-bold text-white shadow-sm">
                  프리미엄
                </span>
              ) : (
                <span className="mt-2 inline-flex rounded-full bg-[#FFF8F0] px-3 py-1 text-xs font-bold text-[#F97316] ring-1 ring-[#F8C79F]">
                  프리미엄으로 업그레이드
                </span>
              )}
            </div>
          </div>
        </header>

        {isFetching ? <p className="text-sm text-[#A36241]">데이터를 불러오는 중이에요...</p> : null}
        {errorMessage ? (
          <p className="rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-600">{errorMessage}</p>
        ) : null}

        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 sm:p-7">
          <h2 className="text-xl font-extrabold text-[#4F2A1D]">🐾 우리 아이들</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-5 ring-1 ring-[#F8C79F]/30 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-2xl">{getPetIcon(pet.species)}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[#4F2A1D]">{pet.name}</h3>
                <p className="mt-1 text-sm text-[#7C4A2D]">품종: {pet.breed ?? pet.species}</p>
                <p className="text-sm text-[#7C4A2D]">나이: {getAgeLabel(pet.birth_date)}</p>
              </article>
            ))}
          </div>
          {pets.length === 0 ? (
            <p className="mt-5 text-sm text-[#A36241]">등록된 반려동물이 없어요.</p>
          ) : null}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 sm:p-7">
          <h2 className="text-xl font-extrabold text-[#4F2A1D]">📋 진료 기록</h2>
          <div className="relative mt-5 space-y-4 pl-6 before:absolute before:bottom-2 before:left-[0.45rem] before:top-2 before:w-0.5 before:bg-[#F97316]/20 before:content-['']">
            {records.map((record) => (
              <article
                key={record.id}
                className="relative rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-white p-5 ring-1 ring-[#F8C79F]/20 shadow-sm"
              >
                <span className="absolute -left-[1.05rem] top-5 h-3 w-3 rounded-full border-2 border-white bg-[#F97316] shadow-sm" />
                <p className="text-xs font-medium text-[#A36241]">{formatVisitDate(record.visitDate)}</p>
                <p className="mt-1 font-bold text-[#4F2A1D]">{record.hospitalName}</p>
                <p className="text-sm text-[#7C4A2D]">{record.itemName}</p>
                <p className="mt-2 text-xl font-extrabold text-[#F97316]">
                  {currencyFormatter.format(record.totalAmount)}원
                </p>
              </article>
            ))}
          </div>
          {records.length === 0 ? (
            <p className="mt-5 text-sm text-[#A36241]">최근 진료 기록이 없어요.</p>
          ) : null}
        </section>

        <button
          type="button"
          onClick={() => {
            void signOut();
          }}
          className="mt-2 rounded-2xl bg-[#FFF8F0] px-5 py-3.5 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30 transition hover:bg-[#FFEEDC]"
        >
          로그아웃
        </button>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
