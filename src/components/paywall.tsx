'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type PaywallProps = {
  title?: string;
  description?: string;
  featureName?: string;
};

export default function Paywall({
  title = '프리미엄 기능이에요',
  description = '프리미엄으로 업그레이드하면 분석 기능을 무제한으로 사용할 수 있어요.',
  featureName
}: PaywallProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="rounded-3xl bg-[#FFF8F0] p-6 ring-1 ring-[#F8C79F]/30">
      <div className="space-y-2">
        <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#F97316] shadow-sm">
          💎 프리미엄 전용
        </p>
        <h2 className="text-xl font-extrabold text-[#4F2A1D]">{title}</h2>
        <p className="text-sm text-[#7C4A2D]">{description}</p>
        {featureName ? (
          <p className="text-sm font-bold text-[#A36241]">잠긴 기능: {featureName}</p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F8C79F]/20">
        <p className="text-sm font-bold text-[#4F2A1D]">결제 시스템 준비 중입니다</p>
        <p className="mt-1 text-sm text-[#7C4A2D]">출시되면 알려드릴게요.</p>

        {isSubmitted ? (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            알림 신청이 완료됐어요. 출시 소식을 메일로 보내드릴게요!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="waitlist-email" className="sr-only">
              알림 받을 이메일
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일 주소를 입력해 주세요"
              className="w-full rounded-2xl border border-[#F8C79F] bg-[#FFF8F0] px-4 py-2.5 text-sm text-[#4F2A1D] placeholder-[#C4956E] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
            >
              출시 알림 신청
            </button>
          </form>
        )}
      </div>

      <Link
        href="/premium"
        className="mt-4 inline-flex text-sm font-bold text-[#F97316] hover:underline"
      >
        프리미엄 요금제 자세히 보기 →
      </Link>
    </section>
  );
}
