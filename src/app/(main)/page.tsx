import type { Metadata } from 'next';
import HomePageClient from '@/app/(main)/home-page-client';

const FAQ_ITEMS = [
  {
    question: '진료비 검색은 어떤 방식으로 비교되나요?',
    answer: '지역, 진료 항목, 반려동물 종류를 기반으로 전국 평균 진료비와 비교 정보를 제공합니다.'
  },
  {
    question: 'AI 분석은 의료 진단을 제공하나요?',
    answer:
      '아니요. AI 분석은 영수증 기반 비용 분류 및 가격 정보 제공만 수행하며 의료 판단이나 진단은 제공하지 않습니다.'
  },
  {
    question: '앱 기록을 연동하면 어떤 점이 좋아지나요?',
    answer: '누적된 진료 기록을 바탕으로 우리 아이의 진료비 추이를 더 정교하게 분석할 수 있습니다.'
  }
] as const;

const pageTitle = 'PetHealth+ - 반려동물 진료비 비교 | 강아지 고양이 진료비 적정가 검색';
const pageDescription =
  '강아지·고양이 진료비를 전국 평균 데이터와 비교하고, 영수증 기반 AI 분석으로 우리 아이 진료비의 적정가를 확인해보세요.';

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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://pethealthplus.kr',
    siteName: 'PetHealth+',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://pethealthplus.kr/og/home.png',
        width: 1200,
        height: 630,
        alt: 'PetHealth+ 반려동물 진료비 데이터 플랫폼'
      }
    ]
  }
};

export default function HomePage() {
  return (
    <>
      <HomePageClient faqItems={FAQ_ITEMS} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
