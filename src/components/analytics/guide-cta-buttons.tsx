'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

type GuideCtaButtonsProps = {
  sourcePage: string;
};

export function GuideCtaButtons({ sourcePage }: GuideCtaButtonsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/cost-search"
        onClick={() =>
          trackEvent('app_cta_click', { source_page: sourcePage, cta_type: 'cost_search' })
        }
        className="flex items-center justify-center rounded-[14px] bg-[#191F28] px-4 py-[17px] text-[15px] font-bold text-white transition hover:bg-[#333D4B]"
      >
        진료비 검색 →
      </Link>
      <Link
        href="/ai-care"
        onClick={() =>
          trackEvent('app_cta_click', { source_page: sourcePage, cta_type: 'ai_care' })
        }
        className="flex items-center justify-center rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white px-4 py-[17px] text-[15px] font-bold text-[#191F28] transition hover:border-[#CBD5E1]"
      >
        AI 견적서 →
      </Link>
    </div>
  );
}
