import type { ReactNode } from 'react';

type RecordItem = {
  name: string;
  amount: number;
};

type RecordCardProps = {
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
    return <p className="text-sm text-slate-500">상세 항목 정보가 없어요</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm text-slate-700">
          <span className="truncate">{item.name}</span>
          <span className="shrink-0 font-medium text-slate-900">{formatAmount(item.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function RecordCard({ visitDate, hospitalName, totalAmount, items, tags }: RecordCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">진료일 {formatVisitDate(visitDate)}</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">{hospitalName}</h2>
        </div>
        <p className="text-base font-bold text-brand-primary">{formatAmount(totalAmount)}</p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-brand-background px-2.5 py-1 text-xs font-medium text-brand-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 border-t border-slate-100 pt-4">{renderItems(items)}</div>
    </article>
  );
}
