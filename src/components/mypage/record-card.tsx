import Link from 'next/link';
import type { ReactNode } from 'react';

type RecordItem = {
  name: string;
  amount: number;
};

type RecordCardProps = {
  id?: string;
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

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsedDate);
}

function renderItems(items: RecordItem[]): ReactNode {
  if (items.length === 0) {
    return <p className="text-sm text-[#8a92a3]">상세 항목 정보가 없어요</p>;
  }

  const displayItems = items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <ul className="space-y-2">
      {displayItems.map((item, index) => (
        <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-[#4f5868]">{item.name}</span>
          <span className="shrink-0 font-semibold text-[#17191f]">{formatAmount(item.amount)}</span>
        </li>
      ))}
      {hasMore ? (
        <li className="text-xs text-[#8a92a3]">외 {items.length - 3}건 더보기</li>
      ) : null}
    </ul>
  );
}

export default function RecordCard({ id, visitDate, hospitalName, totalAmount, items, tags }: RecordCardProps) {
  const content = (
    <article className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#8a92a3]">{formatVisitDate(visitDate)}</p>
          <h2 className="mt-1 text-base font-bold text-[#17191f]">{hospitalName}</h2>
        </div>
        <p className="rounded-full bg-[#ff7a45]/10 px-3 py-1 text-sm font-bold text-[#ff7a45]">{formatAmount(totalAmount)}</p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-[#f7f3ee] px-2.5 py-0.5 text-[11px] font-medium text-[#697182]"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 border-t border-black/5 pt-4">{renderItems(items)}</div>

      {id ? (
        <div className="mt-3 text-right">
          <span className="text-xs font-semibold text-[#ff7a45]">상세 보기 →</span>
        </div>
      ) : null}
    </article>
  );

  if (id) {
    return (
      <Link href={`/mypage/records/${id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
