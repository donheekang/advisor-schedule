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
      <div className="mx-auto max-w-2xl space-y-4 pt-4">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-black/5" />
        <div className="h-32 animate-pulse rounded-3xl bg-black/5" />
        <div className="h-32 animate-pulse rounded-3xl bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
        <div className="mx-auto w-fit"><svg className="h-12 w-12 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
        <h1 className="mt-3 text-xl font-bold text-[#17191f]">로그인이 필요해요</h1>
        <p className="mt-2 text-sm text-[#697182]">진료 기록은 로그인 후 확인할 수 있어요.</p>
        <button
          type="button"
          onClick={() => {
            void signIn();
          }}
          className="mt-5 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,122,69,0.25)] transition hover:brightness-95 active:scale-[0.98]"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section
      className="mx-auto flex w-full max-w-2xl flex-col gap-4"
      aria-label="진료 기록 목록"
    >
      <header>
        <Link href="/mypage" className="inline-flex items-center gap-1 text-sm font-medium text-[#697182] transition hover:text-[#ff7a45]">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4L6 8l4 4" /></svg>
          마이페이지
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#17191f]">{heading}</h1>
        <p className="mt-1 text-sm text-[#697182]">앱에 등록한 진료 영수증을 최신순으로 보여드려요.</p>
      </header>

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">{errorMessage}</p>
      ) : null}

      {isFetching ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-3xl bg-black/5" />
          <div className="h-32 animate-pulse rounded-3xl bg-black/5" />
        </div>
      ) : null}

      {!isFetching && records.length === 0 ? (
        <article className="rounded-3xl bg-[linear-gradient(180deg,#fff_0%,#fffaf7_100%)] p-10 text-center ring-1 ring-black/5">
          <div className="mx-auto w-fit"><svg className="h-12 w-12 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></div>
          <h2 className="mt-3 text-lg font-bold text-[#17191f]">아직 진료 기록이 없어요</h2>
          <p className="mt-2 text-sm text-[#697182]">앱에서 영수증을 등록하면 여기서도 볼 수 있어요</p>
        </article>
      ) : null}

      {records.map((record) => (
        <RecordCard
          key={record.id}
          id={record.id}
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
