import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#1F2937]">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo.png" alt="PetHealth+" width={28} height={28} className="rounded-lg" />
              <span className="text-lg font-bold text-white">PetHealth+</span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/50">
              반려동물 보호자를 위한
              <br />
              AI 건강 관리 플랫폼
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/40 transition-all duration-200 hover:bg-white/10 hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/40 transition-all duration-200 hover:bg-white/10 hover:text-white"
                aria-label="Blog"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">서비스</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pet-talker" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  펫토커
                </Link>
              </li>
              <li>
                <Link href="/cost-search" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  진료비 검색
                </Link>
              </li>
              <li>
                <Link href="/ai-care" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  AI 견적서
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  블로그
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">가이드</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/guide" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  치과 진료비
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  예방접종 비용
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  수술 비용
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  혈액검사 비용
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">회사</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-white/50 transition-colors duration-200 hover:text-[#48B8D0]">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/30">&copy; 2026 PetHealth+. All rights reserved.</p>
          <p className="text-xs text-white/20">본 서비스는 의료 진단을 대체하지 않습니다</p>
        </div>
      </div>
    </footer>
  );
}
