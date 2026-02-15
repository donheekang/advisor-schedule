import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#1B3A4B] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-200">
          <Link href="/pet-talker" className="transition hover:text-brand-secondary">
            펫토커
          </Link>
          <Link href="/cost-search" className="transition hover:text-brand-secondary">
            진료비 검색
          </Link>
          <Link href="/mypage" className="transition hover:text-brand-secondary">
            마이페이지
          </Link>
          <Link href="/premium" className="transition hover:text-brand-secondary">
            프리미엄
          </Link>
        </div>

        <div className="space-y-1 text-sm text-slate-300">
          <p>PetHealth+는 의료 서비스가 아닙니다</p>
          <p>© 2026 PetHealth+</p>
        </div>
      </div>
    </footer>
  );
}
