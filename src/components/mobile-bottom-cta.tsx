'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomCTA() {
  const pathname = usePathname();

  const hideOnPaths = ['/ai-care', '/login', '/mypage'];
  if (hideOnPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <div className="safe-area-pb fixed bottom-0 left-0 right-0 z-30 border-t border-[#F8C79F]/20 bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="flex gap-2">
        <Link
          href="/ai-care"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F97316] py-3 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.97]"
        >
          <span aria-hidden="true">✨</span>
          AI 케어 체험
        </Link>
        <Link
          href="/cost-search"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-[#F97316] bg-white py-3 text-sm font-semibold text-[#F97316] transition-all duration-200 active:scale-[0.97]"
        >
          <span aria-hidden="true">🔍</span>
          진료비 검색
        </Link>
      </div>
    </div>
  );
}
