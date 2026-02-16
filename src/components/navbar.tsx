'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/pet-talker', label: '펫토커' },
  { href: '/cost-search', label: '진료비 검색' },
  { href: '/guides', label: '가이드' },
  { href: '/ai-care', label: 'AI 케어' },
  { href: '/blog', label: '블로그' }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#F8C79F]/10 bg-white/90 shadow-sm backdrop-blur-xl'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between md:h-16">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-lg text-[#F97316] transition-transform duration-300 group-hover:rotate-12">🐾</span>
              <span className="text-base font-bold text-[#4F2A1D] md:text-lg">PetHealth+</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FFF3E6] text-[#F97316]'
                        : 'text-[#6B4226] hover:bg-[#FFF8F0] hover:text-[#4F2A1D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:block">
              <Link
                href="/login"
                className="rounded-xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#F97316]/25 active:translate-y-0 active:scale-[0.97]"
              >
                로그인
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="-mr-2 rounded-lg p-2 transition-colors hover:bg-[#FFF8F0] md:hidden"
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isOpen}
            >
              <span className="text-xl leading-none text-[#4F2A1D]">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed bottom-0 right-0 top-14 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-1 p-5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive ? 'bg-[#FFF3E6] text-[#F97316]' : 'text-[#4F2A1D] hover:bg-[#FFF8F0]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 border-t border-[#F8C79F]/20 pt-3">
            <Link
              href="/login"
              className="block w-full rounded-xl bg-[#F97316] px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-200 active:scale-[0.97]"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
