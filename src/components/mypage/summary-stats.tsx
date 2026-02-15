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

export function SummaryStats({ summary }: SummaryStatsProps) {
  const tierLabel = summary.effective_tier === 'premium' ? '프리미엄' : '무료';

  return (
    <section className="rounded-2xl bg-[#1B3A4B] p-5 text-white shadow-lg shadow-[#1B3A4B]/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">내 데이터 요약</h2>
        <span className="rounded-full bg-[#2A9D8F] px-3 py-1 text-xs font-semibold">{tierLabel} 플랜</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-slate-200">반려동물</p>
          <p className="mt-1 text-xl font-extrabold">{summary.pet_count}마리</p>
        </article>
        <article className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-slate-200">진료 기록</p>
          <p className="mt-1 text-xl font-extrabold">{summary.record_count}건</p>
        </article>
        <article className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-slate-200">문서</p>
          <p className="mt-1 text-xl font-extrabold">{summary.doc_count}건</p>
        </article>
        <article className="rounded-xl bg-white/10 p-4">
          <p className="text-xs text-slate-200">AI 사용량</p>
          <p className="mt-1 text-xl font-extrabold">
            {summary.ai_usage_count}/{summary.ai_usage_limit}
          </p>
        </article>
      </div>

      <p className="mt-4 text-sm text-slate-100">
        스토리지 사용량: {toMegabytes(summary.used_bytes)} MB / {toMegabytes(summary.quota_bytes)} MB
      </p>
    </section>
  );
}

export type { SummaryData };
