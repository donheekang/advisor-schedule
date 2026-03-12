import type { Metadata } from 'next';

import CostSearchClient from '@/app/(main)/cost-search/cost-search-client';

const pageTitle = '진료비 비교 | 우리 아이 진료비, 적정한 걸까요?';
const pageDescription =
  '강아지·고양이 진료 항목별 전국 평균 비용을 확인하세요. 실제 보호자들의 데이터로 병원 비용이 적정한지 한눈에 비교할 수 있어요.';

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PetHealth+',
  url: 'https://pethealthplus.kr',
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://pethealthplus.kr/cost-search?query={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/cost-search'
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://pethealthplus.kr/cost-search',
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

export default function CostSearchPage() {
  return (
    <>
      <CostSearchClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    </>
  );
}
