import type { Metadata } from 'next';

import PetTalkerClient from '@/app/(main)/pet-talker/pet-talker-client';

const pageTitle = '펫토커 - AI가 읽어주는 우리 아이 마음';
const pageDescription =
  '반려동물 사진 한 장으로 AI가 우리 아이의 감정을 분석하고, 1인칭 대사로 마음을 전해드려요. 강아지, 고양이 모두 가능!';

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
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: '펫토커 - AI 반려동물 감정 분석 서비스'
      }
    ]
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
