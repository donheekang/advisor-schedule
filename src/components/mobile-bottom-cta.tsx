'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomCTA() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isCostSearch = pathname.startsWith('/cost-search');
  const isAiCare = pathname.startsWith('/ai-care');
  const isMyPage = pathname.startsWith('/mypage');

  const baseItemClass =
    'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[#8B6B4E] transition-all duration-200';

  const homeClass = baseItemClass + (isHome ? ' text-[#F97316]' : '');
  const costSearchClass = baseItemClass + (isCostSearch ? ' text-[#F97316]' : '');
  const aiCareClass = baseItemClass + (isAiCare ? ' text-[#F97316]' : '');
  const myPageClass = baseItemClass + (isMyPage ? ' text-[#F97316]' : '');

  return (
    <div className="safe-area-pb fixed bottom-0 left-0 right-0 z-50 border-t border-[#F8C79F]/20 bg-white/80 px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around">
        <Link href="/" className={homeClass} aria-label="홈">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            className={isHome ? 'scale-105' : ''}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="mt-0.5 text-[10px] font-medium">홈</span>
        </Link>

        <Link href="/cost-search" className={costSearchClass} aria-label="진료비">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            className={isCostSearch ? 'scale-105' : ''}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className="mt-0.5 text-[10px] font-medium">진료비</span>
        </Link>

        <Link href="/ai-care" className={aiCareClass} aria-label="AI 케어">
          <div className="relative">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              className={isAiCare ? 'scale-110' : 'scale-105'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#F97316]" />
          </div>
          <span className="mt-0.5 text-[10px] font-medium">AI 케어</span>
        </Link>

        <Link href="/mypage" className={myPageClass} aria-label="마이">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            className={isMyPage ? 'scale-105' : ''}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="mt-0.5 text-[10px] font-medium">마이</span>
        </Link>
      </div>
    </div>
  );
}
