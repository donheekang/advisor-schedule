'use client';

type CheckboxCardProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxCard({ label, checked, onChange }: CheckboxCardProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all ${
        checked
          ? 'border-[#F97316] bg-[#FFF3E6] text-[#C2410C] shadow-sm'
          : 'border-[#E8D5C0] bg-white text-[#6B4226] hover:bg-[#FFFAF5]'
      }`}
      aria-pressed={checked}
    >
      {label}
    </button>
  );
}
