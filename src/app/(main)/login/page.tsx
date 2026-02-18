'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInWithApple, signInWithGoogle } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading('google');
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch {
      setError('로그인에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading('');
    }
  };

  const handleApple = async () => {
    setLoading('apple');
    setError('');
    try {
      await signInWithApple();
      router.push('/');
    } catch {
      setError('로그인에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading('');
    }
  };

  const handleKakao = () => {
    setError('카카오 로그인은 준비 중이에요. 다른 방법으로 로그인해주세요.');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-block">
            <Image src="/logo.png" alt="PetHealth+" width={48} height={48} className="mx-auto rounded-xl" />
            <h1 className="mt-3 text-xl font-bold text-[#1F2937]">Pet<span className="text-[#48B8D0]">Health</span>+</h1>
          </Link>
          <h1 className="mb-2 text-xl font-bold text-[#1F2937]">로그인</h1>
          <p className="text-sm text-[#6B7280]">우리 아이 건강 관리를 시작하세요</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E2E8F0] bg-white py-3.5 text-sm font-semibold text-[#1F2937] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'google' ? (
              <svg className="h-5 w-5 animate-spin text-[#6B7280]" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google로 계속하기
          </button>

          <button
            onClick={handleKakao}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] py-3.5 text-sm font-semibold text-[#191919] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.69 1.794 5.055 4.508 6.398l-1.15 4.268a.5.5 0 00.77.528l5.022-3.348c.28.02.56.032.85.032 5.523 0 10-3.463 10-7.878S17.523 3 12 3z" />
            </svg>
            카카오로 계속하기
          </button>

          <button
            onClick={handleApple}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#000000] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'apple' ? (
              <svg className="h-5 w-5 animate-spin text-white/50" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            )}
            Apple로 계속하기
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E2E8F0]" />
          <span className="text-xs text-[#6B7280]">또는</span>
          <div className="h-px flex-1 bg-[#E2E8F0]" />
        </div>

        <Link
          href="/"
          className="block w-full rounded-xl border border-[#E2E8F0] bg-white py-3 text-center text-sm font-medium text-[#6B7280] transition-all duration-200 hover:bg-[#F8FAFC]"
        >
          로그인 없이 둘러보기
        </Link>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          로그인 시 <Link href="/terms" className="text-[#6B7280] underline">이용약관</Link> 및{' '}
          <Link href="/privacy" className="text-[#6B7280] underline">
            개인정보처리방침
          </Link>
          에 동의합니다.
        </p>
      </div>
    </div>
  );
}
