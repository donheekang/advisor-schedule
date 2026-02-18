'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';

type NavigationItem = {
  href: string;
  label: string;
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isLoggedIn = Boolean(user);

  const navigationItems = useMemo<NavigationItem[]>(() => {
    const items: NavigationItem[] = [
      { href: '/pet-talker', label: '펫토커' },
      { href: '/cost-search', label: '진료비 검색' },
      { href: '/blog', label: '블로그' }
    ];

    if (isLoggedIn) {
      items.push({ href: '/mypage', label: '마이페이지' });
    }

    return items;
  }, [isLoggedIn]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="transition hover:opacity-90">
            <span className="text-xl font-extrabold tracking-tight text-[#1F2937]">
              Pet<span className="text-[#48B8D0]">Health</span>+
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const linkClassName =
                'px-1 py-2 text-sm transition ' +
                (isActive ? 'text-[#48B8D0] font-medium' : 'text-[#6B7280] hover:text-[#48B8D0]');

              return (
                <Link key={item.href} href={item.href} className={linkClassName}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-[#6B7280]">{user?.displayName ?? '사용자'}님</span>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                  }}
                  className="rounded-lg bg-[#48B8D0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3CA8BF]"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="rounded-lg bg-[#48B8D0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3CA8BF]"
              >
                로그인
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6B7280] md:hidden"
            aria-label="모바일 메뉴 열기"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-2xl leading-none">☰</span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={
            'overflow-hidden border-t border-gray-200 bg-white transition-all duration-300 ease-out md:hidden ' +
            (isMenuOpen ? 'max-h-96 py-3 opacity-100' : 'max-h-0 py-0 opacity-0')
          }
        >
          <nav className="flex flex-col gap-2 px-4">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const linkClassName =
                'rounded-lg px-3 py-2 text-sm ' +
                (isActive ? 'text-[#48B8D0] font-medium' : 'text-[#6B7280] hover:text-[#48B8D0]');

              return (
                <Link key={item.href} href={item.href} className={linkClassName} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <button
                type="button"
                className="mt-1 rounded-lg bg-[#48B8D0] px-3 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  void signOut();
                  setIsMenuOpen(false);
                }}
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                className="mt-1 rounded-lg bg-[#48B8D0] px-3 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                로그인
              </button>
            )}
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
