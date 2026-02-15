'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import RecordCard from '@/components/mypage/record-card';
import { apiClient } from '@/lib/api-client';

type ApiRecordItem = {
  item_name?: string;
  name?: string;
  amount?: number;
  price?: number;
};

type ApiRecord = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  items?: ApiRecordItem[];
  tags?: string[];
};

type RecordData = {
  id: string;
  visitDate: string;
  hospitalName: string;
  totalAmount: number;
  items: Array<{ name: string; amount: number }>;
  tags: string[];
};

function normalizeRecord(record: ApiRecord, index: number): RecordData {
  return {
    id: record.id ?? `record-${index}`,
    visitDate: record.visit_date ?? '',
    hospitalName: record.hospital_name ?? '병원 정보 없음',
    totalAmount: record.total_amount ?? 0,
    items: (record.items ?? []).map((item, itemIndex) => ({
      name: item.item_name ?? item.name ?? `항목 ${itemIndex + 1}`,
      amount: item.amount ?? item.price ?? 0
    })),
    tags: record.tags ?? []
  };
}

function sortByVisitDateDesc(records: RecordData[]) {
  return [...records].sort((left, right) => {
    const leftTime = new Date(left.visitDate).getTime();
    const rightTime = new Date(right.visitDate).getTime();

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return 0;
    }

    if (Number.isNaN(leftTime)) {
      return 1;
    }

    if (Number.isNaN(rightTime)) {
      return -1;
    }

    return rightTime - leftTime;
  });
}

export default function MyPageRecordsPage() {
  const { user, loading, signIn } = useAuth();

  const [petId, setPetId] = useState('');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setPetId(params.get('petId')?.trim() ?? '');
  }, []);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let isMounted = true;

    async function fetchRecords() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const response = await apiClient.listRecords(petId || undefined, true);
        const rawRecords = Array.isArray(response) ? response : [];

        if (!isMounted) {
          return;
        }

        const normalizedRecords = rawRecords.map((record, index) => normalizeRecord(record as ApiRecord, index));
        setRecords(sortByVisitDateDesc(normalizedRecords));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('진료 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchRecords();

    return () => {
      isMounted = false;
    };
  }, [loading, petId, user]);

  const heading = useMemo(() => (petId ? '선택한 펫의 진료 기록' : '전체 진료 기록'), [petId]);

  if (loading) {
    return (
      <p className="mx-auto w-full max-w-3xl text-sm text-[#A36241]">로그인 상태를 확인 중이에요...</p>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-3 text-xl font-extrabold text-[#4F2A1D]">로그인이 필요해요</h1>
        <p className="mt-2 text-sm text-[#7C4A2D]">진료 기록은 로그인 후 확인할 수 있어요.</p>
        <button
          type="button"
          onClick={() => {
            void signIn();
          }}
          className="mt-5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 sm:p-8"
      aria-label="진료 기록 목록"
    >
      <header>
        <h1 className="text-xl font-extrabold text-[#4F2A1D]">{heading}</h1>
        <p className="mt-1 text-sm text-[#7C4A2D]">앱에 등록한 진료 영수증을 최신순으로 보여드려요.</p>
      </header>

      {errorMessage ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{errorMessage}</p>
      ) : null}

      {isFetching ? <p className="text-sm text-[#A36241]">진료 기록을 불러오는 중이에요...</p> : null}

      {!isFetching && records.length === 0 ? (
        <article className="rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
          <p className="text-5xl">📋</p>
          <h2 className="mt-3 text-lg font-extrabold text-[#4F2A1D]">아직 진료 기록이 없어요</h2>
          <p className="mt-2 text-sm text-[#7C4A2D]">앱에서 영수증을 등록하면 여기서도 볼 수 있어요</p>
          <Link
            href="/app-download"
            className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            앱 다운로드
          </Link>
        </article>
      ) : null}

      {records.map((record) => (
        <RecordCard
          key={record.id}
          visitDate={record.visitDate}
          hospitalName={record.hospitalName}
          totalAmount={record.totalAmount}
          items={record.items}
          tags={record.tags}
        />
      ))}
    </section>
  );
}
