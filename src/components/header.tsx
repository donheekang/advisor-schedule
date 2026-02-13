'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

type NavigationItem = {
  href: string;
  label: string;
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false;

  const navigationItems = useMemo<NavigationItem[]>(() => {
    const items: NavigationItem[] = [
      { href: '/pettalker', label: '펫토커' },
      { href: '/search', label: '진료비 검색' }
    ];

    if (isLoggedIn) {
      items.push({ href: '/mypage', label: '마이페이지' });
    }

    return items;
  }, [isLoggedIn]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1B3A4B]/10 bg-[#F8FAFB]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[#1B3A4B] transition hover:text-[#162F3C]"
        >
          PetHealthPlus
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#1B3A4B] text-white'
                    : 'text-slate-700 hover:bg-[#F8FAFB] hover:text-[#1B3A4B]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="rounded-full bg-[#2A9D8F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#23867A]"
            >
              프로필
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#2A9D8F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#23867A]"
            >
              로그인
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1B3A4B]/20 text-[#1B3A4B] md:hidden"
          aria-label="모바일 메뉴 열기"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="text-2xl leading-none">☰</span>
        </button>
      </div>

      {isMenuOpen ? (
        <div id="mobile-menu" className="border-t border-[#1B3A4B]/10 bg-[#F8FAFB] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-[#E8EEF1] text-[#1B3A4B]' : 'text-slate-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={isLoggedIn ? '/mypage' : '/login'}
              className="mt-1 rounded-lg bg-[#2A9D8F] px-3 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {isLoggedIn ? '프로필' : '로그인'}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
