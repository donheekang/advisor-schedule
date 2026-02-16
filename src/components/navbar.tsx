'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/pet-talker', label: '펫토커' },
  { href: '/cost-search', label: '진료비 검색' },
  { href: '/guide', label: '가이드' },
  { href: '/ai-care', label: 'AI 케어' },
  { href: '/blog', label: '블로그' }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' +
    (scrolled
      ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#F8C79F]/10'
      : 'bg-transparent');

  const desktopLinkClassName = (active: boolean) =>
    'relative py-1 px-3 text-sm transition-colors duration-200 ' +
    (active
      ? 'text-[#F97316] font-semibold'
      : 'text-[#6B4226] hover:text-[#F97316] font-medium');

  const mobilePanelClassName =
    'fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ' +
    (mobileOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-3');

  const mobileItemClassName = (active: boolean) =>
    'block py-3 text-lg font-medium border-b border-[#F8C79F]/10 transition-colors duration-200 ' +
    (active ? 'text-[#F97316]' : 'text-[#4F2A1D] hover:text-[#F97316]');

  return (
    <>
      <nav className={navClassName}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-lg font-bold text-[#4F2A1D]">
            🐾 PetHealth+
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
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F97316]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link
              href="/login"
              className="rounded-xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#EA580C]"
            >
              로그인
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-[#4F2A1D] transition-colors hover:bg-[#FFF8F0] md:hidden"
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
            <Link href="/" className="text-lg font-bold text-[#4F2A1D]">
              🐾 PetHealth+
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-[#4F2A1D] transition-colors hover:bg-[#FFF8F0]"
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

          <Link
            href="/login"
            className="mt-8 rounded-xl bg-[#F97316] px-4 py-2 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-[#EA580C]"
          >
            로그인
          </Link>
        </div>
      </div>
    </>
  );
}
