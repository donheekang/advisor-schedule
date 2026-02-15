'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api-client';

type FeatureRow = {
  feature: string;
  free: string;
  premium: string;
};

type SummaryData = {
  effective_tier: string;
};

const FEATURE_ROWS: FeatureRow[] = [
  { feature: '펫토커', free: '일 2회', premium: '무제한' },
  { feature: '진료비 검색', free: '월 10회', premium: '무제한' },
  { feature: 'AI 분석', free: '월 3회', premium: '무제한' },
  { feature: '스토리지', free: '50MB', premium: '2GB' },
  { feature: '가격', free: '무료', premium: '월 4,900원' }
];

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
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-3">
        <p className="inline-flex rounded-full bg-[#E8EEF1] px-3 py-1 text-xs font-semibold text-[#1B3A4B]">
          프리미엄 월 4,900원
        </p>
        <h1 className="text-3xl font-bold text-[#1B3A4B] md:text-4xl">우리 아이 건강 데이터, 더 깊게 분석하세요</h1>
        <p className="text-sm text-slate-600 md:text-base">
          무료 플랜으로 가볍게 시작하고, 프리미엄에서 상세 분석과 리포트를 무제한으로 확인해 보세요.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-[#1B3A4B]/10 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#F8FAFB] text-slate-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">기능</th>
              <th className="px-4 py-3 text-left font-semibold">Free</th>
              <th className="px-4 py-3 text-left font-semibold">Premium</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row) => (
              <tr key={row.feature} className="border-t border-[#1B3A4B]/10">
                <td className="px-4 py-3 font-medium text-[#1B3A4B]">{row.feature}</td>
                <td className="px-4 py-3 text-slate-600">{row.free}</td>
                <td className="px-4 py-3 font-semibold text-[#1B3A4B]">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isChecking || loading ? (
        <section className="rounded-3xl border border-[#1B3A4B]/10 bg-white p-6 text-sm text-slate-600 shadow-sm">
          구독 상태를 확인하고 있어요...
        </section>
      ) : isPremiumUser ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-800">프리미엄 회원이에요! 🎉</h2>
          <p className="mt-2 text-sm text-emerald-700">모든 분석 기능을 제한 없이 사용할 수 있어요.</p>
        </section>
      ) : (
        <section className="rounded-3xl border border-[#1B3A4B]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1B3A4B]">프리미엄을 가장 먼저 만나보세요</h2>
          <p className="mt-2 text-sm text-slate-600">준비 중인 결제 시스템 오픈 알림을 이메일로 보내드려요.</p>

          <button
            type="button"
            onClick={() => setShowWaitlistForm(true)}
            className="mt-4 rounded-xl bg-[#1B3A4B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163242]"
          >
            구독하기
          </button>

          {showWaitlistForm ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-[#1B3A4B]">결제 시스템을 준비하고 있어요!</p>
              <p className="mt-1 text-sm text-slate-600">이메일을 남겨주시면 오픈 시 알려드릴게요</p>

              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleWaitlistSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="이메일 주소를 입력해 주세요"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1B3A4B]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#2A9D8F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#238478] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? '등록 중...' : '오픈 알림 받기'}
                </button>
              </form>

              {waitlistMessage ? <p className="mt-3 text-sm text-emerald-700">{waitlistMessage}</p> : null}
              {waitlistError ? <p className="mt-3 text-sm text-rose-600">{waitlistError}</p> : null}
            </div>
          ) : null}
        </section>
      )}
    </section>
  );
}
