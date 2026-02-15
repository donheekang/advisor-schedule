import Link from 'next/link';

const footerLinks = [
  { href: '/pet-talker', label: '펫토커' },
  { href: '/cost-search', label: '진료비 검색' },
  { href: '/blog', label: '블로그' },
  { href: '/mypage', label: '마이페이지' }
];

export default function Footer() {
  return (
    <footer className="border-t border-[#7C4A2D]/10 bg-[#FFF0E6]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 text-[#7C4A2D]">
        <Link href="/" className="w-fit text-lg font-extrabold tracking-tight text-[#4F2A1D] transition hover:text-[#7C4A2D]">
          PetHealth+
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#F97316]">
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-sm text-[#7C4A2D]/80">© 2026 PetHealth+</p>
      </div>
    </footer>
  );
}
