import type { Metadata } from 'next';

import PetTalkerClient from '@/app/(main)/pet-talker/pet-talker-client';

const pageTitle = '펫토커 | 우리 아이 마음을 읽어주는 AI';
const pageDescription =
  '사진 한 장이면 우리 아이의 감정을 알 수 있어요. AI가 표정을 분석하고, 우리 아이의 마음을 1인칭 대사로 전해드려요.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/pet-talker'
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://pethealthplus.kr/pet-talker',
    siteName: 'PetHealth+',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: '펫헬스플러스 - 우리 아이 건강 기록, 사진 한 장이면 끝.' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/og/default.png']
  }
};

export default function PetTalkerPage() {
  return <PetTalkerClient />;
}
