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
    <section className="rounded-3xl bg-[#faf6f1] p-6 ring-1 ring-black/10">
      <div className="space-y-2">
        <p className="inline-flex rounded-full bg-[#ff7a45]/10 px-3 py-1 text-xs font-semibold text-[#ff7a45]">
          프리미엄 전용
        </p>
        <h2 className="text-xl font-semibold text-[#17191f]">{title}</h2>
        <p className="text-sm text-[#697182]">{description}</p>
        {featureName ? (
          <p className="text-sm font-semibold text-[#4f5868]">잠긴 기능: {featureName}</p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10">
        <p className="text-sm font-semibold text-[#17191f]">결제 시스템 준비 중입니다</p>
        <p className="mt-1 text-sm text-[#697182]">출시되면 알려드릴게요.</p>

        {isSubmitted ? (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
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
              className="w-full rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-2.5 text-sm text-[#17191f] placeholder-[#8a92a3] outline-none transition focus:border-[#ff7a45] focus:ring-2 focus:ring-[#ff7a45]/20"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#ff7a45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e46333]"
            >
              출시 알림 신청
            </button>
          </form>
        )}
      </div>

      <Link
        href="/premium"
        className="mt-4 inline-flex text-sm font-semibold text-[#ff7a45] hover:underline"
      >
        프리미엄 요금제 자세히 보기 →
      </Link>
    </section>
  );
}




