'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabItem = {
  href: string;
  label: string;
  icon: 'home' | 'chat' | 'search' | 'sparkle' | 'user';
};

const tabs: TabItem[] = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/cost-search', label: '진료비비교', icon: 'search' },
  { href: '/pet-talker', label: '펫토커', icon: 'chat' },
  { href: '/blog', label: '블로그', icon: 'sparkle' },
  { href: '/mypage', label: '마이', icon: 'user' }
];

function TabIcon({ icon, isActive }: { icon: TabItem['icon']; isActive: boolean }) {
  const strokeWidth = isActive ? '2.2' : '1.7';

  switch (icon) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? '0' : strokeWidth}>
          {isActive ? (
            <path d="M12 3l9 8v10H3V11l9-8z" />
          ) : (
            <>
              <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10v9.5h14V10" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={isActive ? 'currentColor' : 'none'} stroke={isActive ? 'none' : 'currentColor'} strokeWidth={strokeWidth}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" strokeLinecap="round" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={isActive ? 'currentColor' : 'none'} stroke={isActive ? 'none' : 'currentColor'} strokeWidth={strokeWidth}>
          <path d="m12 3 1.6 3.4L17 8l-3.4 1.6L12 13l-1.6-3.4L7 8l3.4-1.6L12 3Z" strokeLinejoin="round" />
          <path d="M5 14 6 16 8 17 6 18 5 20 4 18 2 17l2-1 1-2Z" strokeLinejoin="round" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 19a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.06] bg-white/[0.97] pb-safe backdrop-blur-2xl md:hidden">
      <ul className="mx-auto grid w-full max-w-md grid-cols-5" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`relative flex flex-col items-center justify-center gap-[3px] py-2 text-[10px] transition-colors duration-200 ${
                  isActive ? 'font-bold text-[#ff7a45]' : 'font-medium text-[#9ca3af]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <span className="absolute -top-[1px] left-1/2 h-[2.5px] w-6 -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)]" />
                ) : null}
                <span className={`transition-transform duration-200 ${isActive ? 'scale-105' : ''}`} aria-hidden="true">
                  <TabIcon icon={tab.icon} isActive={isActive} />
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
