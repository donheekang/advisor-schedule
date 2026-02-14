import type { Metadata } from 'next';

import CostSearchClient from '@/app/(main)/cost-search/cost-search-client';

const pageTitle = '진료비 검색 | 반려동물 진료 항목별 가격 비교';
const pageDescription =
  '강아지·고양이 진료 항목별 가격 범위와 지역 평균을 확인하고 AI 비용 분석으로 우리 아이 진료비를 합리적으로 비교해보세요.';

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
    images: [
      {
        url: 'https://pethealthplus.kr/og/cost-search.png',
        width: 1200,
        height: 630,
        alt: '반려동물 진료비 검색 및 비교 서비스'
      }
    ]
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
