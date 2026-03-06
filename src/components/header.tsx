'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
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
      { href: '/ai-care', label: 'AI 진료비' },
      { href: '/cost-search', label: '진료비 비교' },
      { href: '/pet-talker', label: '펫토커' },
      { href: '/blog', label: '블로그' }
    ];

    if (isLoggedIn) {
      items.push({ href: '/mypage', label: '마이페이지' });
    }

    return items;
  }, [isLoggedIn]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-3.5 md:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2 transition">
            <Image src="/logo.jpeg" alt="PetHealth+" width={28} height={28} className="rounded-[6px] transition group-hover:scale-110" />
            <span className="flex flex-col leading-none">
              <span style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[1.15rem] font-extrabold tracking-tight text-[#0B3041] transition group-hover:text-[#0B3041]">
                PetHealth+
              </span>
              <span className="mt-[1px] text-[0.55rem] font-semibold tracking-[0.04em] text-[#8a92a3]">펫헬스플러스</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navigationItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3.5 py-2 text-[13px] transition ${
                    isActive
                      ? 'font-bold text-[#ff7a45]'
                      : 'font-medium text-[#4f5868] hover:bg-black/[0.04] hover:text-[#17191f]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            {isLoggedIn ? (
              <>
                <span className="text-[13px] font-medium text-[#4f5868]">{user?.displayName ?? '사용자'}님</span>
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                  }}
                  className="rounded-lg border border-black/10 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#17191f] transition hover:bg-black/[0.04]"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="rounded-lg bg-[#ff7a45] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#e86d3c] active:scale-[0.98]"
              >
                로그인
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-[#17191f] md:hidden"
            aria-label="모바일 메뉴 열기"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-3 w-4">
              <span className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
              <span className="absolute left-0 top-[5px] h-[1.5px] w-4 bg-current" />
              <span className="absolute left-0 top-[10px] h-[1.5px] w-4 bg-current" />
            </span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-black/10 bg-white/95 transition-all duration-300 ease-out md:hidden ${
            isMenuOpen ? 'max-h-96 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2 px-4">
            {navigationItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-[linear-gradient(135deg,rgba(255,122,69,0.16),rgba(255,196,150,0.12))] font-semibold text-[#e46333]'
                      : 'font-medium text-[#4f5868] hover:bg-black/5'
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
                className="mt-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#17191f]"
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
                className="mt-1 rounded-xl bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-3 py-2 text-sm font-semibold text-white"
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



