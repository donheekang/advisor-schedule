import type { Metadata } from 'next';

import PetTalkerClient from '@/app/(main)/pet-talker/pet-talker-client';

const pageTitle = '펫토커 | 우리 아이가 말을 한다면, AI 한마디 생성';
const pageDescription =
  '반려동물 사진 한 장으로 우리 아이의 1인칭 대사를 생성해보세요. 공유 가능한 카드로 쉽고 재미있게 펫토커를 즐길 수 있어요.';

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PetHealth+',
  url: 'https://pethealthplus.kr',
  inLanguage: 'ko-KR'
};

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
        url: 'https://pethealthplus.kr/og/pet-talker.png',
        width: 1200,
        height: 630,
        alt: '펫토커 - 반려동물 AI 한마디 생성 서비스'
      }
    ]
  }
};

export default function PetTalkerPage() {
  return (
    <>
      <PetTalkerClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    </>
  );
}
