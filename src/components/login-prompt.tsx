'use client';

import Link from 'next/link';

interface LoginPromptProps {
  title?: string;
  description?: string;
}

export function LoginPrompt({
  title = '로그인이 필요한 기능이에요',
  description = '로그인하면 모든 기능을 이용할 수 있어요',
}: LoginPromptProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F6]">
          <svg className="h-8 w-8 text-[#8B95A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-bold text-[#191F28]">{title}</h2>
        <p className="mb-6 text-sm text-[#8B95A1]">{description}</p>
        <Link
          href="/login"
          className="inline-block w-full rounded-2xl bg-[#191F28] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333D4B]"
        >
          로그인하기
        </Link>
        <Link
          href="/"
          className="mt-3 inline-block text-sm text-[#8B95A1] transition-colors hover:text-[#191F28]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
