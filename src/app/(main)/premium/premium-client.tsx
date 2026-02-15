'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api-client';

type SummaryData = {
  effective_tier: string;
};

const FREE_FEATURES = ['펫토커 일 2회', '진료비 검색 무제한'];
const PREMIUM_FEATURES = ['펫토커 무제한', '고품질 대사'];

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
    <section className="w-full bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:py-16">
        <header className="text-center">
          <p className="text-sm font-semibold tracking-wide text-[#F08A24]">💎 프리미엄으로 더 특별하게</p>
          <h1 className="mt-3 text-3xl font-bold text-[#4D2B1F] md:text-4xl">우리 아이를 위한 따뜻한 프리미엄 케어</h1>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-[#EEDFD0] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#5C3B2E]">무료</h2>
              <span className="rounded-full bg-[#F6F1ED] px-3 py-1 text-xs font-semibold text-[#7D5642]">기본 플랜</span>
            </div>
            <ul className="mt-6 space-y-3 text-[#6A4A3A]">
              {FREE_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm md:text-base">
                  <span className="text-[#D97706]">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 rounded-xl bg-[#FFF6EE] px-4 py-3 text-sm font-semibold text-[#A25C33]">
              {isChecking || loading ? '현재 플랜 확인 중...' : isPremiumUser ? '현재 플랜: 프리미엄 이용 중' : '현재 플랜: 무료'}
            </p>
          </article>

          <article className="relative rounded-3xl border-2 border-[#F08A24] bg-white p-7 shadow-md">
            <span className="absolute right-5 top-5 rounded-full bg-[#F08A24] px-3 py-1 text-xs font-semibold text-white">추천</span>
            <h2 className="text-2xl font-bold text-[#5C3B2E]">프리미엄</h2>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-[#D97706] md:text-5xl">월 9,900원</p>
            <ul className="mt-6 space-y-3 text-[#6A4A3A]">
              {PREMIUM_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm md:text-base">
                  <span className="text-[#F08A24]">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowWaitlistForm(true)}
              className="mt-7 w-full rounded-2xl bg-[#F08A24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#db7c1e]"
            >
              프리미엄 시작하기
            </button>
            {isPremiumUser ? <p className="mt-3 text-sm font-semibold text-emerald-700">현재 플랜: 프리미엄 이용 중 🎉</p> : null}
          </article>
        </section>

        {showWaitlistForm ? (
          <section className="rounded-3xl border border-[#F1DFCF] bg-white/90 p-5 shadow-sm md:p-6">
            <p className="text-base font-semibold text-[#5C3B2E]">프리미엄 오픈 알림 신청</p>
            <p className="mt-1 text-sm text-[#7A5241]">이메일을 남겨주시면 오픈 시 가장 먼저 알려드릴게요.</p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일 주소를 입력해 주세요"
                className="w-full rounded-xl border border-[#E8D5C5] bg-white px-4 py-2.5 text-sm text-[#5C3B2E] outline-none transition focus:border-[#F08A24]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#5C3B2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d2f24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '등록 중...' : '오픈 알림 받기'}
              </button>
            </form>
            {waitlistMessage ? <p className="mt-3 text-sm text-emerald-700">{waitlistMessage}</p> : null}
            {waitlistError ? <p className="mt-3 text-sm text-rose-600">{waitlistError}</p> : null}
          </section>
        ) : null}
      </div>
    </section>
  );
}
