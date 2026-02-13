import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brand-primary/20 bg-brand-navyDark text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-200">
          <Link href="/about" className="transition hover:text-brand-secondary">
            서비스 소개
          </Link>
          <Link href="/app-download" className="transition hover:text-brand-secondary">
            앱 다운로드
          </Link>
          <Link href="/privacy" className="transition hover:text-brand-secondary">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="transition hover:text-brand-secondary">
            이용약관
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
