'use client';

import { useState, type ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const svgClass = "h-5 w-5 flex-shrink-0 text-[#B28B84] transition-transform duration-300" + (isOpen ? " rotate-180" : "");

  const contentClass = "overflow-hidden transition-all duration-300 ease-out" + (isOpen ? " max-h-96 opacity-100 pb-5" : " max-h-0 opacity-0");

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left font-medium text-[#1F2937] transition-colors duration-200 hover:text-[#1F2937]"
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
        <div className="text-sm leading-relaxed text-[#6B7280]">{children}</div>
      </div>
    </div>
  );
}
