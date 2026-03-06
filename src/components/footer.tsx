import Link from 'next/link';

const serviceLinks = [
  { href: '/pet-talker', label: '펫토커' },
  { href: '/cost-search', label: '진료비 비교' },
  { href: '/ai-care', label: 'AI 진료비' },
  { href: '/guides', label: '가이드' },
  { href: '/blog', label: '블로그' }
];

const infoLinks = [
  { href: '/about', label: '서비스 소개' },
  { href: '/terms', label: '이용약관' },
  { href: '/privacy', label: '개인정보처리방침' }
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white pb-20 md:pb-0">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 md:px-6">
        {/* 상단: 로고 + 간단 소개 */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-lg font-bold text-[#17191f] transition hover:text-[#ff7a45]">
              PetHealth+
            </Link>
            <p className="mt-0.5 text-[0.7rem] font-medium text-[#8a92a3]">펫헬스플러스</p>
            <p className="mt-1 text-sm text-[#697182]">반려동물 진료비 데이터 플랫폼</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/ai-care"
              className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(255,122,69,0.2)] transition hover:brightness-95"
            >
              AI 진료비 확인하기 →
            </Link>
            <Link
              href="/cost-search"
              className="rounded-full border border-black/10 bg-white px-5 py-2 text-xs font-semibold text-[#17191f] transition hover:bg-black/5"
            >
              진료비 비교
            </Link>
          </div>
        </div>

        {/* 중단: 링크 */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold tracking-wider text-[#8a92a3]">서비스</p>
            <div className="flex flex-col gap-2 text-sm text-[#697182]">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="w-fit transition hover:text-[#ff7a45]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-wider text-[#8a92a3]">정보</p>
            <div className="flex flex-col gap-2 text-sm text-[#697182]">
              {infoLinks.map((link) => (
                <Link key={link.href} href={link.href} className="w-fit transition hover:text-[#ff7a45]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-wider text-[#8a92a3]">문의</p>
            <div className="flex flex-col gap-2 text-sm text-[#697182]">
              <a href="mailto:support@pluslabkorea.com" className="w-fit transition hover:text-[#ff7a45]">
                support@pluslabkorea.com
              </a>
            </div>
          </div>
        </div>

        {/* 하단: 카피라이트 */}
        <div className="border-t border-black/5 pt-5">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#8a92a3]">
              © 2026 (주)플러스랩코리아 · PetHealth+ (펫헬스플러스)
            </p>
            <p className="text-xs text-[#8a92a3]">
              의료 판단이 아닌 가격 정보 제공 서비스입니다
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
