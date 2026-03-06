type SummaryData = {
  effective_tier: 'free' | 'premium' | string;
  pet_count: number;
  record_count: number;
  doc_count: number;
  used_bytes: number;
  quota_bytes: number;
  ai_usage_count: number;
  ai_usage_limit: number;
};

type SummaryStatsProps = {
  summary: SummaryData;
};

function toMegabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function StatIcon({ type }: { type: 'pet' | 'record' | 'doc' | 'ai' }) {
  const cls = 'h-5 w-5 text-[#ff7a45]';

  switch (type) {
    case 'pet':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" stroke="none">
          <path d="M8.35 3C6.97 3 5.85 4.35 5.85 6s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3Zm7.3 0c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3ZM4.5 10c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3Zm15 0c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3ZM12 13.5c-2.33 0-4.3 1.45-5.08 3.5C6.26 18.8 7.73 21 10 21h4c2.27 0 3.74-2.2 3.08-4-.78-2.05-2.75-3.5-5.08-3.5Z" />
        </svg>
      );
    case 'record':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );
    case 'doc':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="m12 3 1.6 3.4L17 8l-3.4 1.6L12 13l-1.6-3.4L7 8l3.4-1.6L12 3Z" />
          <path d="M5 14 6 16 8 17 6 18 5 20 4 18 2 17l2-1 1-2Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const storagePercent = summary.quota_bytes > 0
    ? Math.min(100, Math.round((summary.used_bytes / summary.quota_bytes) * 100))
    : 0;

  return (
    <section className="rounded-[2rem] bg-white p-6 ring-1 ring-black/[0.04] sm:p-7">
      <h2 className="text-lg font-bold text-[#17191f]">내 데이터 요약</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <article className="rounded-2xl bg-[#fff8f5] p-4">
          <StatIcon type="pet" />
          <p className="mt-2 text-xs font-medium text-[#697182]">반려동물</p>
          <p className="mt-0.5 text-xl font-bold text-[#17191f]">{summary.pet_count}<span className="text-sm font-medium text-[#697182]">마리</span></p>
        </article>
        <article className="rounded-2xl bg-[#fff8f5] p-4">
          <StatIcon type="record" />
          <p className="mt-2 text-xs font-medium text-[#697182]">진료 기록</p>
          <p className="mt-0.5 text-xl font-bold text-[#17191f]">{summary.record_count}<span className="text-sm font-medium text-[#697182]">건</span></p>
        </article>
        <article className="rounded-2xl bg-[#fff8f5] p-4">
          <StatIcon type="doc" />
          <p className="mt-2 text-xs font-medium text-[#697182]">문서</p>
          <p className="mt-0.5 text-xl font-bold text-[#17191f]">{summary.doc_count}<span className="text-sm font-medium text-[#697182]">건</span></p>
        </article>
        <article className="rounded-2xl bg-[#fff8f5] p-4">
          <StatIcon type="ai" />
          <p className="mt-2 text-xs font-medium text-[#697182]">AI 사용량</p>
          <p className="mt-0.5 text-xl font-bold text-[#17191f]">
            {summary.ai_usage_count}<span className="text-sm font-medium text-[#697182]">/{summary.ai_usage_limit}</span>
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-2xl bg-[#fff8f5] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-[#697182]">스토리지</span>
          <span className="font-bold text-[#17191f]">{toMegabytes(summary.used_bytes)} / {toMegabytes(summary.quota_bytes)} MB</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ff7a45,#ff9b5e)] transition-all duration-500"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export type { SummaryData };
