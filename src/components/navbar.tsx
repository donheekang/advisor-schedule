'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/ai-care', label: 'AI 견적서' },
  { href: '/cost-search', label: '진료비 검색' },
  { href: '/pet-talker', label: '펫토커' },
  { href: '/blog', label: '블로그' }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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

  const navClassName = 'fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm';

  const desktopLinkClassName = (active: boolean) =>
    'relative py-1 px-3 text-sm transition-all duration-300 ' +
    (active ? 'text-[#48B8D0] font-medium' : 'text-[#6B7280] hover:text-[#48B8D0]');

  const mobilePanelClassName =
    'fixed inset-0 z-[60] bg-white transition-all duration-300 md:hidden ' +
    (mobileOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-3');

  const mobileItemClassName = (active: boolean) =>
    'block border-b border-gray-100 py-3 text-lg font-medium transition-all duration-300 ' +
    (active ? 'text-[#48B8D0]' : 'text-[#6B7280] hover:text-[#48B8D0]');

  const logoClassName = 'text-lg font-bold text-[#1F2937]';

  const menuButtonClassName = 'rounded-lg p-2 text-[#1F2937] transition-all duration-300 hover:bg-[#F5E5FC] md:hidden';

  return (
    <>
      <nav className={navClassName}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className={logoClassName + ' flex items-center gap-2'}>
            <Image src="/logo.png" alt="PetHealth+" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-extrabold tracking-tight text-[#0B3041]">PetHealth+</span>
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
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#48B8D0]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link
              href="/login"
              className="rounded-lg bg-[#48B8D0] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#3CA8BF]"
            >
              로그인
            </Link>
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
            <Link href="/" className="text-lg font-bold text-[#1F2937]">
              🐾 PetHealth+
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-[#1F2937] transition-all duration-300 hover:bg-[#F5E5FC]"
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
            className="mt-8 rounded-lg bg-[#48B8D0] px-4 py-2 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-[#3CA8BF]"
          >
            로그인
          </Link>
        </div>
      </div>
    </>
  );
}
