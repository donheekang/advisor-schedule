import type { Metadata } from 'next';
import AiCareClient from '@/app/(main)/ai-care/ai-care-client';

export const metadata: Metadata = {
  title: '무료 AI 케어 체험 | 펫헬스플러스',
  description: '로그인 없이 10초 시작으로 반려동물 맞춤 케어 리포트를 바로 확인해보세요.',
  keywords: ['반려동물', '강아지', '고양이', 'AI 케어', '건강관리', '진료비'],
  openGraph: {
    title: '무료 AI 케어 체험',
    description: '우리 아이 맞춤 케어 분석을 무료로 받아보세요.',
    locale: 'ko_KR',
    type: 'website'
  }
};

export default function AiCarePage() {
  return <AiCareClient />;
}
