'use client';

interface CheckboxCardProps {
  label: string;
  icon?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxCard({ label, icon, checked, onChange }: CheckboxCardProps) {
  const wrapperClass = "flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 " +
    (checked ? "bg-[#fff0ea] border-[#ff7a45]" : "bg-white border-[#fff0ea] hover:bg-[#fff0ea] hover:border-[#fff0ea]");

  const boxClass = "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 " +
    (checked ? "bg-[#ff7a45] border-[#ff7a45]" : "border-[#ff9b5e]");

  const textClass = "text-sm font-medium " + (checked ? "text-[#17191f]" : "text-[#17191f]");

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

