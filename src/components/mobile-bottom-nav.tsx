'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: '홈',
    iconPath:
      'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
  },
  {
    href: '/cost-search',
    label: '진료비',
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
  },
  {
    href: '/ai-care',
    label: 'AI 견적',
    iconPath:
      'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
  },
  {
    href: '/login',
    label: '마이',
    iconPath:
      'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
  }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const linkClass =
            'relative flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 transition-all duration-200 ' +
            (active ? 'text-[#F97316]' : 'text-[#94A3B8]');
          const iconClass = 'h-6 w-6 ' + (active ? 'scale-110' : '');
          const labelClass = 'text-[10px] font-medium ' + (active ? 'text-[#F97316]' : 'text-[#94A3B8]');

          return (
            <Link key={item.href} href={item.href} className={linkClass}>
              {active && <span className="absolute -top-1.5 h-0.5 w-6 rounded-full bg-[#F97316]" />}
              <svg
                className={iconClass}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 2 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
              </svg>
              <span className={labelClass}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
