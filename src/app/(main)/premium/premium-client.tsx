'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api-client';

type SummaryData = {
  effective_tier: string;
};

const FREE_FEATURES = ['펫토커 일 2회', '진료비 검색 무제한'];
const PREMIUM_FEATURES = ['펫토커 무제한', '고품질 대사', 'AI 비용 분석 무제한', '광고 없음'];

export default function PremiumClient() {
  const { user, loading } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState<string | null>(null);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkPremium() {
      if (!user?.uid) {
        if (isMounted) {
          setIsPremiumUser(false);
          setIsChecking(false);
        }

        return;
      }

      try {
        const summary = (await apiClient.getMeSummary()) as SummaryData;

        if (isMounted) {
          setIsPremiumUser(summary.effective_tier === 'premium');
        }
      } catch {
        if (isMounted) {
          setIsPremiumUser(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    if (!loading) {
      setIsChecking(true);
      void checkPremium();
    }

    return () => {
      isMounted = false;
    };
  }, [loading, user?.uid]);

  async function handleWaitlistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setWaitlistMessage(null);
    setWaitlistError(null);

    try {
      const response = await fetch('/api/premium-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || '대기 목록 등록에 실패했어요.');
      }

      setWaitlistMessage(data.message || '대기 목록에 등록되었어요. 오픈 소식을 가장 먼저 알려드릴게요!');
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '대기 목록 등록 중 문제가 발생했어요.';
      setWaitlistError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#D4B8C0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="text-center">
          <p className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-[#48B8D0] shadow-sm">
            💎 프리미엄으로 더 특별하게
          </p>
          <h1 className="mt-4 text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">
            우리 아이를 위한 따뜻한 프리미엄 케어
          </h1>
          <p className="mt-3 text-sm text-[#7C4A2D]">더 많은 대화, 더 깊은 분석을 만나보세요</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-7 shadow-lg ring-1 ring-[#F8C79F]/30">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#4F2A1D]">무료</h2>
              <span className="rounded-full bg-[#D4B8C0] px-3 py-1 text-xs font-bold text-[#A36241] ring-1 ring-[#F8C79F]/30">
                기본 플랜
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#7C4A2D]">0원</p>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#4F2A1D]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4B8C0] text-xs text-[#48B8D0]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 rounded-2xl bg-[#D4B8C0] px-4 py-3 text-sm font-bold text-[#A36241] ring-1 ring-[#F8C79F]/20">
              {isChecking || loading
                ? '현재 플랜 확인 중...'
                : isPremiumUser
                  ? '현재 플랜: 프리미엄 이용 중'
                  : '현재 플랜: 무료'}
            </p>
          </article>

          <article className="relative rounded-3xl bg-white p-7 shadow-xl ring-2 ring-[#48B8D0]">
            <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-4 py-1.5 text-xs font-bold text-white shadow-md">
              추천
            </span>
            <h2 className="text-2xl font-extrabold text-[#4F2A1D]">프리미엄</h2>
            <p className="mt-3">
              <span className="text-4xl font-extrabold text-[#48B8D0] md:text-5xl">월 9,900원</span>
            </p>
            <ul className="mt-6 space-y-3">
              {PREMIUM_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-[#4F2A1D]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#48B8D0] text-xs text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowWaitlistForm(true)}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
            >
              프리미엄 시작하기
            </button>
            {isPremiumUser ? (
              <p className="mt-3 text-center text-sm font-bold text-emerald-600">현재 플랜: 프리미엄 이용 중 🎉</p>
            ) : null}
          </article>
        </section>

        {showWaitlistForm ? (
          <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
            <h3 className="text-lg font-extrabold text-[#4F2A1D]">📩 프리미엄 오픈 알림 신청</h3>
            <p className="mt-2 text-sm text-[#7C4A2D]">이메일을 남겨주시면 오픈 시 가장 먼저 알려드릴게요.</p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일 주소를 입력해 주세요"
                className="w-full rounded-2xl border border-[#F8C79F] bg-[#D4B8C0] px-4 py-3 text-sm text-[#4F2A1D] placeholder-[#C4956E] outline-none transition focus:border-[#48B8D0] focus:ring-2 focus:ring-[#48B8D0]/20"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-[#4F2A1D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3A1D12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '등록 중...' : '오픈 알림 받기'}
              </button>
            </form>
            {waitlistMessage ? <p className="mt-3 text-sm font-medium text-emerald-600">{waitlistMessage}</p> : null}
            {waitlistError ? <p className="mt-3 text-sm font-medium text-rose-600">{waitlistError}</p> : null}
          </section>
        ) : null}
      </div>
    </section>
  );
}
