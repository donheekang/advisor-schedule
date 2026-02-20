'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { CTABanner } from '@/components/cta-banner';
import { apiClient } from '@/lib/api-client';

const PAGE_SIZE = 10;
const currencyFormatter = new Intl.NumberFormat('ko-KR');

type ApiRecordItem = {
  item_name?: string;
  name?: string;
  price?: number;
  amount?: number;
  category_tag?: string;
};

type ApiRecord = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  tags?: string[];
  items?: ApiRecordItem[];
};

function formatDate(value?: string) {
  if (!value) {
    return '날짜 정보 없음';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '날짜 정보 없음';
  }

  return parsed.toLocaleDateString('ko-KR');
}

export default function MyPageRecordsPage() {
  const { user, loading, signIn } = useAuth();
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let mounted = true;

    async function fetchRecords() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const response = await apiClient.listRecords(undefined, true);
        const list = (Array.isArray(response) ? response : []) as ApiRecord[];

        if (!mounted) {
          return;
        }

        setRecords(
          list.sort(
            (left, right) =>
              new Date(right.visit_date ?? '').getTime() - new Date(left.visit_date ?? '').getTime()
          )
        );
      } catch {
        if (mounted) {
          setErrorMessage('진료 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
      } finally {
        if (mounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchRecords();

    return () => {
      mounted = false;
    };
  }, [loading, user]);

  const visibleRecords = useMemo(() => records.slice(0, visibleCount), [records, visibleCount]);

  if (loading) {
    return <p className="mx-auto w-full max-w-4xl text-sm text-[#A36241]">로그인 상태를 확인하고 있어요...</p>;
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-3 text-xl font-extrabold text-[#4F2A1D]">로그인이 필요해요</h1>
        <p className="mt-2 text-sm text-[#7C4A2D]">진료 기록 상세는 로그인 후 확인할 수 있어요.</p>
        <button
          type="button"
          onClick={() => {
            void signIn();
          }}
          className="mt-5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3 text-sm font-bold text-white"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 sm:p-8">
      <header>
        <h1 className="text-2xl font-extrabold text-[#4F2A1D]">진료 기록 상세 목록</h1>
        <p className="mt-1 text-sm text-[#7C4A2D]">최신 진료 순으로 항목과 태그를 확인해보세요.</p>
      </header>

      {errorMessage ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">{errorMessage}</p> : null}
      {isFetching ? <p className="text-sm text-[#A36241]">기록을 불러오는 중이에요...</p> : null}

      {!isFetching && records.length === 0 ? (
        <article className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
          <p className="text-4xl">📋</p>
          <p className="mt-2 text-sm text-[#7C4A2D]">앱에서 진료 영수증을 등록하면 여기에서 상세 목록을 볼 수 있어요.</p>
          <p className="mt-4 text-sm font-bold text-[#F97316]">앱 출시 예정</p>
        </article>
      ) : null}

      {visibleRecords.map((record, index) => (
        <article key={record.id ?? `record-${index}`} className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-[#F8C79F]/20">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#4F2A1D]">{formatDate(record.visit_date)}</p>
              <p className="text-sm text-[#7C4A2D]">{record.hospital_name ?? '병원 정보 없음'}</p>
            </div>
            <p className="text-lg font-extrabold text-[#F97316]">{currencyFormatter.format(record.total_amount ?? 0)}원</p>
          </header>

          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-[#F8C79F]/30">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#FFF8F0] text-left text-xs font-bold text-[#7C4A2D]">
                <tr>
                  <th className="px-3 py-2">item_name</th>
                  <th className="px-3 py-2">price</th>
                  <th className="px-3 py-2">category_tag</th>
                </tr>
              </thead>
              <tbody>
                {(record.items ?? []).map((item, itemIndex) => (
                  <tr key={`${item.item_name ?? item.name ?? 'item'}-${itemIndex}`} className="border-t border-[#F8C79F]/20">
                    <td className="px-3 py-2 text-[#4F2A1D]">{item.item_name ?? item.name ?? '-'}</td>
                    <td className="px-3 py-2 text-[#4F2A1D]">{currencyFormatter.format(item.price ?? item.amount ?? 0)}원</td>
                    <td className="px-3 py-2 text-[#A36241]">{item.category_tag ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(record.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full bg-[#FFF8F0] px-2.5 py-1 text-xs font-semibold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {record.id ? (
              <Link href={`/mypage/records/${record.id}`} className="text-sm font-bold text-[#F97316] underline underline-offset-4">
                기록 상세 보기 →
              </Link>
            ) : null}
            <span className="text-sm font-bold text-[#A36241]">앱 출시 예정</span>
          </div>
        </article>
      ))}

      {visibleCount < records.length ? (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30"
        >
          더 보기
        </button>
      ) : null}

      <CTABanner variant="app-download" context="mypage-records-bottom" />
    </section>
  );
}
