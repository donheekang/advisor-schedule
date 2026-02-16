'use client';

import Link from 'next/link';

export function MobileBottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#F8C79F]/30 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(124,74,45,0.14)] backdrop-blur md:hidden">
      <div className="mx-auto flex w-full max-w-7xl gap-2">
        <Link
          href="/ai-care"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#F97316] px-2 text-center text-sm font-medium text-white"
          aria-label="무료 AI 케어 체험 이동"
        >
          🐾 무료 AI 케어 체험
        </Link>
        <Link
          href="/cost-search"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[#F97316] bg-white px-2 text-center text-sm font-medium text-[#C2410C]"
          aria-label="진료비 검색 이동"
        >
          💰 진료비 검색
        </Link>
      </div>
    </div>
  );
}
