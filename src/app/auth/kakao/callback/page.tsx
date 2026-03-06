'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { signInWithKakaoCode } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';

function KakaoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('카카오 로그인이 취소되었어요.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    if (!code) {
      setError('인가 코드를 받지 못했어요.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    (async () => {
      try {
        const result = await signInWithKakaoCode(code);
        const idToken = await result.user.getIdToken();
        apiClient.setToken(idToken);

        try {
          await apiClient.upsertUser();
        } catch {}

        router.push('/');
      } catch (err) {
        console.error('카카오 로그인 실패:', err);
        setError('카카오 로그인에 실패했어요. 다시 시도해주세요.');
        setTimeout(() => router.push('/login'), 3000);
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <p className="mt-2 text-xs text-[#8B95A1]">로그인 페이지로 이동합니다...</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500]">
              <svg className="h-7 w-7 animate-spin text-[#191919]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#191F28]">카카오 로그인 중...</p>
            <p className="mt-2 text-xs text-[#8B95A1]">잠시만 기다려주세요</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-sm text-[#8B95A1]">로딩 중...</p>
        </div>
      }
    >
      <KakaoCallbackInner />
    </Suspense>
  );
}
