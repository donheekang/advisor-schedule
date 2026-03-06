'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithApple, signInWithKakao } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSignIn = async (provider: 'google' | 'apple' | 'kakao') => {
    setErrorMessage(null);
    setLoading(provider);

    try {
      const signInFn =
        provider === 'google'
          ? signInWithGoogle
          : provider === 'apple'
            ? signInWithApple
            : signInWithKakao;

      const result = await signInFn();
      const idToken = await result.user.getIdToken();
      apiClient.setToken(idToken);

      try {
        await apiClient.upsertUser();
      } catch {}

      onClose();
      router.push('/');
    } catch {
      setErrorMessage('로그인에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
        isVisible ? 'bg-black/35 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-[380px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 transition-all duration-300 ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="px-7 pt-8 pb-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a45] to-[#ff9a6c] shadow-[0_4px_20px_rgba(255,122,69,0.3)]">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0B3041]">로그인</h2>
          <p className="mt-1.5 text-sm text-[#8B95A1]">우리 아이 건강 관리를 시작하세요</p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mx-7 mt-3 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2.5 px-7 pt-5 pb-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSignIn('google')}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#0B3041]/10 bg-white px-5 py-3.5 text-sm font-semibold text-[#0B3041] transition-all hover:bg-[#f8f9fa] hover:border-[#0B3041]/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'google' ? (
              <Spinner />
            ) : (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
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

          {/* Kakao */}
          <button
            type="button"
            onClick={() => handleSignIn('kakao')}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FEE500] px-5 py-3.5 text-sm font-bold text-[#191919] transition-all hover:bg-[#f5dc00] active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'kakao' ? (
              <Spinner color="#191919" />
            ) : (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.69 1.794 5.055 4.508 6.398l-1.15 4.268a.5.5 0 00.77.528l5.022-3.348c.28.02.56.032.85.032 5.523 0 10-3.463 10-7.878S17.523 3 12 3z" />
              </svg>
            )}
            카카오로 계속하기
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSignIn('apple')}
            disabled={loading !== ''}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0B3041] px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#0d3a4f] active:scale-[0.98] disabled:opacity-50"
          >
            {loading === 'apple' ? (
              <Spinner color="white" />
            ) : (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            )}
            Apple로 계속하기
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-7 py-2">
          <div className="h-px flex-1 bg-[#E5E8EB]" />
          <span className="text-xs text-[#8B95A1]">또는</span>
          <div className="h-px flex-1 bg-[#E5E8EB]" />
        </div>

        {/* Close / Browse */}
        <div className="px-7 pb-7 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-[#E5E8EB] bg-white py-3 text-center text-sm font-semibold text-[#8B95A1] transition-all hover:bg-[#F8FAFB] hover:text-[#191F28] active:scale-[0.98]"
          >
            로그인 없이 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner({ color = '#6B7280' }: { color?: string }) {
  return (
    <svg className="h-[18px] w-[18px] animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4" />
      <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
