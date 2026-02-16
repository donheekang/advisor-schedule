'use client';

import { ChevronDown } from '@/components/ui/lucide-icons';
import { useId, useState, type ReactNode } from 'react';

type AccordionProps = {
  title: string;
  children: ReactNode;
};

export function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-[#F8C79F]/20 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#4F2A1D]"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-[#F97316] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={contentId}
        className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-sm leading-relaxed text-[#6B4226]">{children}</div>
        </div>
import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#F8C79F]/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left text-[#4F2A1D] font-medium hover:text-[#F97316] transition-colors duration-200"
      >
        <span className="pr-4">{title}</span>
        <svg
          className={`w-5 h-5 text-[#8B6B4E] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-[#6B4226] text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
