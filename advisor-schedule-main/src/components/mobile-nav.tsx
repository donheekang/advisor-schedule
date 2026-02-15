'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabItem = {
  href: string;
  label: string;
  icon: string;
};

const tabs: TabItem[] = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/pet-talker', label: '펫토커', icon: '💬' },
  { href: '/cost-search', label: '진료비 검색', icon: '🔎' },
  { href: '/blog', label: '블로그', icon: '📝' },
  { href: '/mypage', label: '마이페이지', icon: '👤' }
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#7C4A2D]/10 bg-white/95 shadow-[0_-8px_24px_rgba(124,74,45,0.14)] backdrop-blur md:hidden">
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-5">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition ${
                  isActive ? 'font-bold text-[#F97316]' : 'text-[#7C4A2D]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
