'use client';

interface CheckboxCardProps {
  label: string;
  icon?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxCard({ label, icon, checked, onChange }: CheckboxCardProps) {
  const wrapperClass = "flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 " +
    (checked ? "bg-[#FFF3E6] border-[#48B8D0]" : "bg-white border-[#E8D5C0] hover:bg-[#FFFAF5] hover:border-[#F8C79F]");

  const boxClass = "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 " +
    (checked ? "bg-[#48B8D0] border-[#48B8D0]" : "border-[#D4B896]");

  const textClass = "text-sm font-medium " + (checked ? "text-[#4F2A1D]" : "text-[#6B4226]");

  return (
    <label className={wrapperClass}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={boxClass}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {icon && <span className="text-base">{icon}</span>}
      <span className={textClass}>{label}</span>
    </label>
  );
}

