'use client';

import Link from 'next/link';

import { trackEvent } from '@/lib/analytics';

type GuideCtaButtonsProps = {
  sourcePage: string;
};

export function GuideCtaButtons({ sourcePage }: GuideCtaButtonsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Link
        href="/cost-search"
        onClick={() => trackEvent('app_cta_click', { source_page: sourcePage, cta_type: 'cost_search' })}
        className="rounded-2xl bg-[#FFF8F0] px-4 py-3 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30"
      >
        실시간 진료비 검색
      </Link>
      <Link
        href="/ai-care"
        onClick={() => trackEvent('app_cta_click', { source_page: sourcePage, cta_type: 'ai_care' })}
        className="rounded-2xl bg-[#FFF8F0] px-4 py-3 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30"
      >
        AI 견적서
      </Link>
      <Link
        href="/premium"
        onClick={() => trackEvent('app_cta_click', { source_page: sourcePage, cta_type: 'app_download' })}
        className="rounded-2xl bg-[#FFF8F0] px-4 py-3 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30"
      >
        앱 다운로드 안내
      </Link>
    </div>
  );
}
