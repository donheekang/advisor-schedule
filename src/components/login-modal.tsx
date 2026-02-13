'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSigningIn(true);

    try {
      await signIn({ provider: 'google' });
      onClose();
    } catch {
      setErrorMessage('로그인 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#1B3A4B]">로그인</h2>
        <p className="mt-2 text-sm text-slate-600">로그인하면 더 많은 기능을 사용할 수 있어요</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#1B3A4B] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            구글로 로그인
          </button>
          <button
            type="button"
            disabled
            className="w-full rounded-lg bg-yellow-300 px-4 py-3 text-sm font-medium text-[#1B3A4B] opacity-70"
          >
            카카오로 로그인 (준비 중)
          </button>
        </div>

        {errorMessage ? <p className="mt-3 text-sm text-rose-600">{errorMessage}</p> : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg px-4 py-3 text-sm text-slate-500 hover:bg-slate-100"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
