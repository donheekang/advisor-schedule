import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1B2A4A] pb-24 text-white/80 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg text-[#FB923C]">🐾</span>
              <span className="text-lg font-bold text-white">PetHealth+</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              반려동물 보호자를 위한
              <br />
              AI 건강 관리 플랫폼
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">서비스</h4>
            <div className="space-y-2.5">
              <Link href="/pet-talker" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                펫토커
              </Link>
              <Link href="/cost-search" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                진료비 검색
              </Link>
              <Link href="/ai-care" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                AI 케어
              </Link>
              <Link href="/blog" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                블로그
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">가이드</h4>
            <div className="space-y-2.5">
              <Link href="/cost-search/dental" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                치과 진료비
              </Link>
              <Link href="/cost-search/vaccine" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                예방접종 비용
              </Link>
              <Link href="/cost-search/surgery" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                수술 비용
              </Link>
              <Link href="/cost-search/lab" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                혈액검사 비용
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">회사</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                소개
              </Link>
              <Link href="/privacy" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="block text-sm text-white/60 transition-all duration-300 hover:text-white">
                이용약관
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">© 2026 PetHealth+. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-white/50 transition-all duration-300 hover:text-white">
              Instagram
            </a>
            <a href="#" className="text-xs text-white/50 transition-all duration-300 hover:text-white">
              Blog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
