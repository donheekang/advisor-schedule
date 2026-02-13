import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#1B3A4B]/10 bg-[#F8FAFB]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
          <Link href="/about" className="transition hover:text-[#1B3A4B]">
            서비스 소개
          </Link>
          <Link href="/app-download" className="transition hover:text-[#1B3A4B]">
            앱 다운로드
          </Link>
          <Link href="/privacy" className="transition hover:text-[#1B3A4B]">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="transition hover:text-[#1B3A4B]">
            이용약관
          </Link>
        </div>

        <div className="space-y-1 text-sm text-slate-600">
          <p>PetHealthPlus는 의료 서비스가 아닙니다</p>
          <p>© 2026 PetHealthPlus</p>
        </div>
      </div>
    </footer>
  );
}
