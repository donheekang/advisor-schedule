'use client';

import { useEffect, useState } from 'react';

import Paywall from '@/components/paywall';
import { useAuth } from '@/components/auth-provider';
import { isPremium } from '@/lib/subscription';

type FeatureRow = {
  feature: string;
  free: string;
  premium: string;
};

const FEATURE_ROWS: FeatureRow[] = [
  { feature: '펫토커', free: '일 2회', premium: '무제한' },
  { feature: '진료비 검색', free: '월 3회', premium: '무제한' },
  { feature: 'AI 비용 분석', free: '월 3회', premium: '무제한' },
  { feature: '항목별 가격 분석', free: '❌', premium: '✅' },
  { feature: '지역/품종별 비교', free: '❌', premium: '✅' },
  { feature: '연간 진료비 리포트', free: '❌', premium: '✅' }
];

export default function PremiumClient() {
  const { user, loading } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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

      const premiumStatus = await isPremium(user.uid);

      if (isMounted) {
        setIsPremiumUser(premiumStatus);
        setIsChecking(false);
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

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-3">
        <p className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          프리미엄 월 4,900원
        </p>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">우리 아이 건강 데이터, 더 깊게 분석하세요</h1>
        <p className="text-sm text-slate-600 md:text-base">
          무료 플랜으로 가볍게 시작하고, 프리미엄에서 상세 분석과 리포트를 무제한으로 확인해 보세요.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-orange-50 text-slate-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">기능</th>
              <th className="px-4 py-3 text-left font-semibold">무료</th>
              <th className="px-4 py-3 text-left font-semibold">프리미엄 (월 4,900원)</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row) => (
              <tr key={row.feature} className="border-t border-orange-100">
                <td className="px-4 py-3 font-medium text-slate-900">{row.feature}</td>
                <td className="px-4 py-3 text-slate-600">{row.free}</td>
                <td className="px-4 py-3 font-semibold text-orange-700">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isChecking || loading ? (
        <section className="rounded-3xl border border-orange-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
          구독 상태를 확인하고 있어요...
        </section>
      ) : isPremiumUser ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-800">프리미엄 구독 이용 중</h2>
          <p className="mt-2 text-sm text-emerald-700">모든 분석 기능을 제한 없이 사용할 수 있어요.</p>
        </section>
      ) : (
        <Paywall
          title="이 기능은 프리미엄에서 사용할 수 있어요"
          description="항목별 가격 분석, 지역/품종 비교, 연간 리포트는 프리미엄 전용 기능입니다."
          featureName="고급 진료비 분석"
        />
      )}
    </section>
  );
}
