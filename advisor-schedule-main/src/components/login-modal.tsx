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
      await signIn();
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Missing Firebase env:')) {
        setErrorMessage('로그인 설정이 올바르지 않아요. 관리자에게 문의해 주세요.');
      } else {
        setErrorMessage('로그인 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4F2A1D]/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-[#F8C79F]/30">
        <div className="text-center">
          <p className="text-4xl">🐾</p>
          <h2 className="mt-3 text-xl font-extrabold text-[#4F2A1D]">로그인</h2>
          <p className="mt-2 text-sm text-[#7C4A2D]">로그인하면 더 많은 기능을 사용할 수 있어요</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full rounded-2xl border border-[#F8C79F] bg-white px-4 py-3.5 text-sm font-bold text-[#4F2A1D] transition hover:bg-[#FFF8F0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            구글로 로그인
          </button>
          <button
            type="button"
            disabled
            className="w-full rounded-2xl bg-[#FEE500] px-4 py-3.5 text-sm font-bold text-[#3C1E1E] opacity-70"
          >
            카카오로 로그인 (준비 중)
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm font-medium text-rose-600">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl px-4 py-3 text-sm font-medium text-[#A36241] transition hover:bg-[#FFF8F0]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
