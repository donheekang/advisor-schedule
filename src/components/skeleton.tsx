export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-4">
      <div className="mb-2 h-4 w-3/4 rounded bg-[#F8C79F]/20" />
      <div className="mb-2 h-4 w-1/2 rounded bg-[#F8C79F]/20" />
      <div className="h-4 w-1/4 rounded bg-[#F8C79F]/20" />
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={`result-skeleton-${index}`} className="animate-pulse rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 h-5 w-1/2 rounded bg-[#F8C79F]/20" />
          <div className="h-4 w-1/3 rounded bg-[#F8C79F]/20" />
        </div>
      ))}
    </div>
  );
}
