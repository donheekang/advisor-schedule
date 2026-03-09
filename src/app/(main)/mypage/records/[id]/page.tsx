'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api-client';

type RecordItem = {
  name: string;
  amount: number;
};

type RecordDetail = {
  id: string;
  visitDate: string;
  hospitalName: string;
  totalAmount: number;
  items: RecordItem[];
  tags: string[];
};

const currencyFormatter = new Intl.NumberFormat('ko-KR');

function formatAmount(amount: number) {
  return `${currencyFormatter.format(amount)}원`;
}

function formatVisitDate(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsedDate);
}

export default function RecordDetailPage() {
  const params = useParams();
  const recordId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user || !recordId) return;

    let mounted = true;

    async function fetchRecord() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.getRecord(recordId);
        if (!mounted) return;

        const raw = res as Record<string, unknown>;
        const items = Array.isArray(raw.items)
          ? (raw.items as Array<Record<string, unknown>>).map((item, idx) => ({
              name: (item.item_name ?? item.name ?? `항목 ${idx + 1}`) as string,
              amount: (item.amount ?? item.price ?? 0) as number
            }))
          : [];

        setRecord({
          id: (raw.id as string) ?? recordId,
          visitDate: (raw.visit_date as string) ?? '',
          hospitalName: (raw.hospital_name as string) ?? '병원 정보 없음',
          totalAmount: (raw.total_amount as number) ?? 0,
          items,
          tags: (raw.tags as string[]) ?? []
        });
      } catch {
        if (mounted) setError('기록을 불러오지 못했어요.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchRecord();
    return () => { mounted = false; };
  }, [authLoading, user, recordId]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pt-4">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-black/5" />
        <div className="h-48 animate-pulse rounded-3xl bg-black/5" />
        <div className="h-32 animate-pulse rounded-3xl bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a45]/[0.08]">
          <svg className="h-7 w-7 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </div>
        <p className="mt-3 text-lg font-bold text-[#17191f]">로그인이 필요해요</p>
        <p className="mt-1 text-sm text-[#697182]">진료 기록은 로그인 후 확인할 수 있어요.</p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a45]/[0.08]">
          <svg className="h-7 w-7 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
        </div>
        <p className="mt-3 text-lg font-bold text-[#17191f]">{error ?? '기록을 찾을 수 없어요'}</p>
        <Link href="/mypage/records" className="mt-4 inline-block text-sm font-semibold text-[#ff7a45]">
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* 뒤로가기 */}
      <Link href="/mypage/records" className="inline-flex items-center gap-1 text-sm font-medium text-[#697182] transition hover:text-[#ff7a45]">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4L6 8l4 4" /></svg>
        진료 기록 목록
      </Link>

      {/* 기본 정보 */}
      <article className="rounded-3xl bg-white p-7 shadow-[0_4px_24px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#8a92a3]">{formatVisitDate(record.visitDate)}</p>
            <h1 className="mt-1 text-xl font-bold text-[#17191f]">{record.hospitalName}</h1>
          </div>
          <p className="rounded-full bg-[#ff7a45]/10 px-4 py-1.5 text-lg font-bold text-[#ff7a45]">
            {formatAmount(record.totalAmount)}
          </p>
        </div>

        {record.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {record.tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="rounded-full bg-[#f7f3ee] px-3 py-1 text-xs font-medium text-[#697182]">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>

      {/* 항목별 비용 */}
      <article className="rounded-3xl bg-white p-7 shadow-[0_4px_24px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <h2 className="text-sm font-bold text-[#17191f]">항목별 비용</h2>

        {record.items.length === 0 ? (
          <p className="mt-4 text-sm text-[#8a92a3]">상세 항목 정보가 없어요</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {record.items.map((item, idx) => {
              const ratio = record.totalAmount > 0 ? (item.amount / record.totalAmount) * 100 : 0;

              return (
                <li key={`${item.name}-${idx}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#4f5868]">{item.name}</span>
                    <span className="font-bold text-[#17191f]">{formatAmount(item.amount)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f7f3ee]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] transition-all duration-500"
                      style={{ width: `${Math.max(ratio, 2)}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-right text-[10px] text-[#8a92a3]">{ratio.toFixed(1)}%</p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f7f3ee] px-4 py-3">
          <span className="text-sm font-bold text-[#17191f]">총 진료비</span>
          <span className="text-lg font-bold text-[#ff7a45]">{formatAmount(record.totalAmount)}</span>
        </div>
      </article>

      {/* 진료비 비교 CTA */}
      <article className="rounded-3xl bg-[linear-gradient(135deg,#fff8f5_0%,#fff0ea_100%)] p-7 ring-1 ring-[#ff7a45]/10">
        <p className="text-sm font-bold text-[#17191f]">이 진료비가 적정한지 궁금하세요?</p>
        <p className="mt-1 text-xs text-[#697182]">진료비 비교에서 전국 평균과 비교해보세요.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/cost-search?query=${encodeURIComponent(record.items[0]?.name ?? '')}`}
            className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(255,122,69,0.2)] transition hover:brightness-95"
          >
            진료비 비교하기 →
          </Link>
          <Link
            href="/pet-talker"
            className="rounded-full border border-[#ff7a45]/20 bg-white px-5 py-2.5 text-xs font-semibold text-[#ff7a45] transition hover:bg-[#fff8f5]"
          >
            펫토커 체험하기
          </Link>
        </div>
      </article>
    </div>
  );
}
