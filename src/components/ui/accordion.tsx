'use client';

import { useState, type ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const svgClass = "w-5 h-5 text-[#ff9b5e] flex-shrink-0 transition-transform duration-300" + (isOpen ? " rotate-180" : "");

  const contentClass = "overflow-hidden transition-all duration-300 ease-out" + (isOpen ? " max-h-96 opacity-100 pb-5" : " max-h-0 opacity-0");

  return (
    <div className="border-b border-[#fff0ea]/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left text-[#17191f] font-medium hover:text-[#ff7a45] transition-colors duration-200"
      >
        <span className="pr-4">{title}</span>
        <svg
          className={svgClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={contentClass}>
        <div className="text-[#17191f] text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

