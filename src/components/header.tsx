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
      { href: '/guides', label: '가이드' },
      { href: '/ai-care', label: 'AI 견적서' },
      { href: '/blog', label: '블로그' }
    ];

    if (isLoggedIn) {
      items.push({ href: '/mypage', label: '마이페이지' });
    }

    return items;
  }, [isLoggedIn]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#7C4A2D]/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-[#4F2A1D] transition hover:text-[#7C4A2D]">
            PetHealth+
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[#7C4A2D]/10 bg-white/70 p-1 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? 'font-bold text-[#F97316]'
                      : 'font-medium text-[#7C4A2D] hover:bg-[#FFF0E6] hover:text-[#4F2A1D]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-[#7C4A2D]">{user?.displayName ?? '사용자'}님</span>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                  }}
                  className="rounded-full bg-[#E67E22] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F97316]"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="rounded-full bg-[#E67E22] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F97316]"
              >
                로그인
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#7C4A2D]/25 bg-white/80 text-[#7C4A2D] md:hidden"
            aria-label="모바일 메뉴 열기"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-2xl leading-none">☰</span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-[#7C4A2D]/10 bg-white/95 shadow-[0_10px_20px_rgba(124,74,45,0.08)] transition-all duration-300 ease-out md:hidden ${
            isMenuOpen ? 'max-h-96 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2 px-4">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm ${
                    isActive ? 'font-bold text-[#F97316]' : 'font-medium text-[#7C4A2D]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <button
                type="button"
                className="mt-1 rounded-lg bg-[#E67E22] px-3 py-2 text-sm font-semibold text-white"
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
                className="mt-1 rounded-lg bg-[#E67E22] px-3 py-2 text-sm font-semibold text-white"
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
