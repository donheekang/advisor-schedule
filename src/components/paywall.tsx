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
  featureName,
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
    <section className="rounded-[14px] bg-[#F8FAFB] p-6">
      <div className="space-y-2">
        <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#191F28] shadow-sm">
          프리미엄 전용
        </p>
        <h2 className="text-lg font-extrabold text-[#191F28]">{title}</h2>
        <p className="text-sm text-[#4E5968]">{description}</p>
        {featureName ? (
          <p className="text-sm font-bold text-[#8B95A1]">잠긴 기능: {featureName}</p>
        ) : null}
      </div>

      <div className="mt-5 rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white p-5">
        <p className="text-sm font-bold text-[#191F28]">결제 시스템 준비 중입니다</p>
        <p className="mt-1 text-sm text-[#8B95A1]">출시되면 알려드릴게요.</p>

        {isSubmitted ? (
          <p className="mt-3 rounded-[14px] bg-[#E8F7EF] px-4 py-3 text-sm font-bold text-[#06B56C]">
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
              className="w-full rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white px-4 py-2.5 text-sm text-[#191F28] placeholder-[#8B95A1] outline-none transition focus:border-[#191F28]"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-[14px] bg-[#191F28] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#333D4B]"
            >
              출시 알림 신청
            </button>
          </form>
        )}
      </div>

      <Link
        href="/premium"
        className="mt-4 inline-flex text-sm font-bold text-[#191F28] hover:underline"
      >
        프리미엄 요금제 자세히 보기 →
      </Link>
    </section>
  );
}
