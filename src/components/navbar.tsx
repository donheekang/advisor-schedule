'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/ai-care', label: 'AI 진료비' },
  { href: '/cost-search', label: '진료비 검색' },
  { href: '/pet-talker', label: '펫토커' },
  { href: '/blog', label: '블로그' }
];

export function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(href + '/');
  };

  const navClassName =
    'fixed top-0 z-50 w-full transition-all duration-300 ' +
    (scrolled ? 'bg-white shadow-[0_1px_0_0_#F2F4F6]' : 'bg-white border-b border-[#F2F4F6]');

  const desktopLinkClassName = (active: boolean) =>
    'px-3 py-1 text-sm font-medium transition-colors duration-300 ' +
    (active ? 'text-[#191F28] font-semibold' : 'text-[#8B95A1] hover:text-[#191F28]');

  const mobilePanelClassName =
    'fixed inset-0 z-[60] bg-white transition-all duration-300 md:hidden ' +
    (mobileOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-3');

  const mobileItemClassName = (active: boolean) =>
    'block border-b border-gray-100 py-3 text-lg font-medium transition-all duration-300 ' +
    (active ? 'text-[#191F28] font-bold' : 'text-[#8B95A1] hover:text-[#191F28]');

  const logoClassName = 'text-xl font-extrabold tracking-tight text-[#191F28]';

  const menuButtonClassName = 'rounded-lg p-2 text-[#191F28] transition-colors duration-300 hover:bg-[#F2F4F6] md:hidden';

  return (
    <>
      <nav className={navClassName}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className={logoClassName + ' flex items-center gap-2'}>
            <Image
              src="/logo.png"
              alt="PetHealth+"
              width={32}
              height={32}
              className="rounded-lg transition-all duration-300"
            />
            <span className={logoClassName}>PetHealth+</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <div key={item.href} className="relative">
                  <Link href={item.href} className={desktopLinkClassName(active)}>
                    {item.label}
                  </Link>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#191F28]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:block">
            {user ? (
              <Link href="/mypage" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#191F28] text-xs font-bold text-white transition hover:bg-[#333D4B]">
                  {user.displayName?.[0] || user.email?.[0] || '?'}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-[#191F28] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333D4B]"
              >
                로그인
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={menuButtonClassName}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={mobilePanelClassName}>
        <div className="flex h-full flex-col px-6 pb-8 pt-5">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#191F28]">
              PetHealth+
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-[#191F28] transition-all duration-300 hover:bg-[#F2F4F6]"
              aria-label="메뉴 닫기"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href} className={mobileItemClassName(active)}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user ? (
            <Link
              href="/mypage"
              className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-[#E5E8EB] bg-[#F8FAFB] px-4 py-2 text-sm font-semibold text-[#191F28] transition hover:bg-[#F2F4F6]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#191F28] text-xs font-bold text-white">
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </span>
              마이페이지
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-8 rounded-lg bg-[#191F28] px-4 py-2 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-[#333D4B]"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
