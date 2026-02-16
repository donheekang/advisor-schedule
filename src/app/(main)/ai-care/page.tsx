import type { Metadata } from 'next';
import AiCareClient from '@/app/(main)/ai-care/ai-care-client';
import { AnimateOnScroll } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AI 맞춤 케어 리포트 | 펫헬스플러스',
  description: '우리 아이 정보를 입력하면 맞춤 건강 리포트를 받아보세요.',
  keywords: ['반려동물', '강아지', '고양이', 'AI 케어', '건강관리', '진료비'],
  openGraph: {
    title: '무료 AI 케어 체험',
    description: '우리 아이 맞춤 케어 분석을 무료로 받아보세요.',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function AiCarePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-4xl px-5 pt-10 md:px-8 md:pt-12">
        <AnimateOnScroll animation="fade-up">
          <h1 className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">AI 맞춤 케어 리포트</h1>
          <p className="mt-2 text-sm text-[#8B6B4E]">우리 아이 정보를 입력하면 맞춤 건강 리포트를 받아보세요</p>
        </AnimateOnScroll>
      </section>
      <AiCareClient />
    </>
  );
}
