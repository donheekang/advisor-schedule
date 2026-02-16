export function ResultSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse rounded-2xl border border-[#F8C79F]/20 bg-white p-5">
          <div className="mb-3 h-4 w-1/3 rounded bg-[#F8C79F]/50" />
          <div className="h-3 w-full rounded bg-[#F8C79F]/40" />
        </div>
      ))}
    </div>
  );
}
