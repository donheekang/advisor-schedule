interface Props {
  min: number;
  avg: number;
  max: number;
}

export function PriceBar({ min, avg, max }: Props) {
  const range = max - min || 1;
  const avgPos = Math.min(Math.max(((avg - min) / range) * 100, 5), 95);

  return (
    <div className="space-y-2">
      <div className="relative h-2 bg-[#F8C79F]/20 rounded-full overflow-visible">
        <div
          className="absolute h-full bg-gradient-to-r from-[#FB923C] to-[#F97316] rounded-full transition-all duration-500"
          style={{ width: `${avgPos}%` }}
        />
        <div
          className="absolute w-4 h-4 -top-1 bg-[#F97316] rounded-full border-2 border-white shadow-md transition-all duration-500"
          style={{ left: `${avgPos}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#8B6B4E]">
        <span>{min.toLocaleString()}원</span>
        <span className="font-semibold text-[#F97316]">평균 {avg.toLocaleString()}원</span>
        <span>{max.toLocaleString()}원</span>
      </div>
    </div>
  );
}
