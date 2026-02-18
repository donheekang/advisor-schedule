import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '소개 | PetHealth+',
  description: 'PetHealth+는 반려동물 보호자를 위한 AI 건강 관리 플랫폼입니다.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1F2937]/5 px-4 py-2 text-sm font-medium text-[#1F2937]">
          🐾 About PetHealth+
        </span>
        <h1 className="mb-4 text-2xl font-extrabold text-[#1F2937] md:text-4xl">
          반려동물 보호자를 위한<br />AI 건강 관리 플랫폼
        </h1>
        <p className="text-base leading-relaxed text-[#6B7280]">
          우리 아이 진료비가 적정한지 궁금했던 적 있으신가요?<br />
          PetHealth+는 그 고민에서 시작했습니다.
        </p>
      </div>

      {/* Mission cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 text-2xl">📊</div>
          <h2 className="mb-2 text-lg font-bold text-[#1F2937]">진료비 투명성</h2>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            전국 동물병원의 진료비 데이터를 수집하고 분석하여, 보호자가 적정한 가격인지 비교할 수 있도록 돕습니다.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 text-2xl">🤖</div>
          <h2 className="mb-2 text-lg font-bold text-[#1F2937]">AI 기반 분석</h2>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            증상을 입력하면 AI가 예상 질환과 진료비 범위를 분석해드립니다. 병원 방문 전 미리 준비할 수 있어요.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 text-2xl">❤️</div>
          <h2 className="mb-2 text-lg font-bold text-[#1F2937]">보호자 중심</h2>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            복잡한 의료 용어 대신 쉬운 말로, 보호자가 이해할 수 있는 정보를 제공합니다. 모든 기능은 보호자의 관점에서 설계되었습니다.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/cost-search"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#48B8D0]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
        >
          진료비 검색해보기
        </Link>
      </div>

      {/* Contact */}
      <div className="mt-12 rounded-2xl bg-[#F8FAFC] p-6 text-center">
        <p className="text-sm text-[#6B7280]">문의사항이 있으신가요?</p>
        <p className="mt-1 text-sm font-medium text-[#1F2937]">support@pethealthplus.kr</p>
      </div>
    </div>
  );
}
