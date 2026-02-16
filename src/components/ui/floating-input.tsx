'use client';

import { InputHTMLAttributes } from 'react';

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function FloatingInput({ id, label, className, ...props }: FloatingInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        className={`peer w-full rounded-xl border border-[#E8D5C0] bg-white px-4 pb-2 pt-6 text-sm text-[#4F2A1D] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 ${className ?? ''}`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-xs text-[#8B6B4E] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
      >
        {label}
      </label>
    </div>
  );
}
