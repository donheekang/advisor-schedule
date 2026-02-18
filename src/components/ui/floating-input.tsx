'use client';

import { type InputHTMLAttributes, useState } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function FloatingInput({ id, label, className = '', ...props }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  return (
    <div className="relative">
      <input
        id={id}
        className={`peer w-full pt-5 pb-2 px-4 rounded-xl border border-[#E8D5C0]
          bg-white text-[#4F2A1D] text-sm
          focus:ring-2 focus:ring-[#48B8D0]/20 focus:border-[#48B8D0]
          transition-all duration-200 outline-none
          ${className}`}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none
          ${
            isActive
              ? 'top-1.5 text-xs text-[#48B8D0] font-medium'
              : 'top-3.5 text-sm text-[#8B6B4E]'
          }
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#48B8D0] peer-focus:font-medium
          peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#48B8D0]`}
      >
        {label}
      </label>
    </div>
  );
}
