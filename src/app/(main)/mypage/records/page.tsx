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
    return <p className="mx-auto w-full max-w-3xl text-sm text-slate-500">로그인 상태를 확인 중이에요...</p>;
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">로그인이 필요해요</h1>
        <p className="mt-2 text-sm text-slate-600">진료 기록은 로그인 후 확인할 수 있어요.</p>
        <button
          type="button"
          onClick={() => {
            void signIn();
          }}
          className="mt-5 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4" aria-label="진료 기록 목록">
      <header>
        <h1 className="text-xl font-bold text-slate-900">{heading}</h1>
        <p className="mt-1 text-sm text-slate-500">앱에 등록한 진료 영수증을 최신순으로 보여드려요.</p>
      </header>

      {errorMessage ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{errorMessage}</p> : null}

      {isFetching ? <p className="text-sm text-slate-500">진료 기록을 불러오는 중이에요...</p> : null}

      {!isFetching && records.length === 0 ? (
        <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">아직 진료 기록이 없어요</h2>
          <p className="mt-2 text-sm text-slate-600">앱에서 영수증을 등록하면 여기서도 볼 수 있어요</p>
          <Link
            href="/app-download"
            className="mt-5 inline-flex rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
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
