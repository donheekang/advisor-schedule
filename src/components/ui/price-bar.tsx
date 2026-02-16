type PriceBarProps = {
  min: number;
  avg: number;
  max: number;
};

function toWon(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

export function PriceBar({ min, avg, max }: PriceBarProps) {
  const range = Math.max(max - min, 1);
  const avgPosition = ((avg - min) / range) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-2.5 w-full rounded-full bg-[#FFE7CF]">
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#F97316] shadow"
          style={{ left: `calc(${Math.min(100, Math.max(0, avgPosition))}% - 8px)` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[#8B6B4E]">
        <span>최소 {toWon(min)}</span>
        <span className="font-semibold text-[#F97316]">평균 {toWon(avg)}</span>
        <span>최대 {toWon(max)}</span>
      </div>
    </div>
  );
}
