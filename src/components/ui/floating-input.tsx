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
        className={`peer w-full pt-5 pb-2 px-4 rounded-xl border border-[#fff0ea]
          bg-white text-[#17191f] text-sm
          focus:ring-2 focus:ring-[#ff7a45]/20 focus:border-[#ff7a45]
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
              ? 'top-1.5 text-xs text-[#ff7a45] font-medium'
              : 'top-3.5 text-sm text-[#ff9b5e]'
          }
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#ff7a45] peer-focus:font-medium
          peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#ff7a45]`}
      >
        {label}
      </label>
    </div>
  );
}
