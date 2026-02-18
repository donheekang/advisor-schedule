'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import CareGuide from '@/components/care-guide';
import { useAuth } from '@/components/auth-provider';
import { CTABanner } from '@/components/cta-banner';
import { apiClient } from '@/lib/api-client';

const APPSTORE_URL = 'https://apps.apple.com/app/id6504879567';
const currencyFormatter = new Intl.NumberFormat('ko-KR');

type RecordItem = {
  item_name?: string;
  name?: string;
  price?: number;
  amount?: number;
  category_tag?: string;
};

type RecordDetail = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  tags?: string[];
  items?: RecordItem[];
};

type RecordDetailPageProps = {
  params: {
    id: string;
  };
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

export default function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { user, loading, signIn } = useAuth();
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let mounted = true;

    async function fetchRecord() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const response = (await apiClient.getRecord(params.id)) as RecordDetail;
        if (mounted) {
          setRecord(response);
        }
      } catch {
        if (mounted) {
          setErrorMessage('기록 상세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
      } finally {
        if (mounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchRecord();

    return () => {
      mounted = false;
    };
  }, [loading, params.id, user]);

  const careGuideKeyword = useMemo(() => {
    const firstItem = record?.items?.[0];
    return firstItem?.item_name ?? firstItem?.name ?? '';
  }, [record]);

  if (loading) {
    return <p className="mx-auto w-full max-w-4xl text-sm text-[#A36241]">로그인 상태를 확인하고 있어요...</p>;
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
        <p className="text-4xl">🔒</p>
        <h1 className="mt-3 text-xl font-extrabold text-[#4F2A1D]">로그인이 필요해요</h1>
        <button
          type="button"
          onClick={() => {
            void signIn();
          }}
          className="mt-5 rounded-2xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-6 py-3 text-sm font-bold text-white"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-[2rem] bg-gradient-to-b from-[#D4B8C0] to-[#FFF0E6] p-5 sm:p-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[#4F2A1D]">진료 기록 상세</h1>
        <Link href="/mypage/records" className="text-sm font-bold text-[#A36241] underline underline-offset-4">
          ← 목록으로
        </Link>
      </header>

      {errorMessage ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">{errorMessage}</p> : null}
      {isFetching ? <p className="text-sm text-[#A36241]">상세 정보를 불러오는 중이에요...</p> : null}

      {record ? (
        <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#4F2A1D]">{formatDate(record.visit_date)}</p>
              <p className="text-sm text-[#7C4A2D]">{record.hospital_name ?? '병원 정보 없음'}</p>
            </div>
            <p className="text-xl font-extrabold text-[#48B8D0]">{currencyFormatter.format(record.total_amount ?? 0)}원</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-[#F8C79F]/30">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#D4B8C0] text-left text-xs font-bold text-[#7C4A2D]">
                <tr>
                  <th className="px-3 py-2">item_name</th>
                  <th className="px-3 py-2">price</th>
                  <th className="px-3 py-2">category_tag</th>
                </tr>
              </thead>
              <tbody>
                {(record.items ?? []).map((item, index) => (
                  <tr key={`${item.item_name ?? item.name ?? 'item'}-${index}`} className="border-t border-[#F8C79F]/20">
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
              <span key={tag} className="rounded-full bg-[#D4B8C0] px-2.5 py-1 text-xs font-semibold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30">
                #{tag}
              </span>
            ))}
          </div>

          <a
            href={APPSTORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-bold text-[#48B8D0] underline underline-offset-4"
          >
            앱에서 영수증 사진도 보기
          </a>
        </article>
      ) : null}

      {careGuideKeyword ? <CareGuide keyword={careGuideKeyword} /> : null}

      <CTABanner variant="app-download" context="mypage-record-detail-bottom" />
    </section>
  );
}
