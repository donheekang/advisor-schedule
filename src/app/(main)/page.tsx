import type { Metadata } from 'next';

import HomePageClient from './home-page-client';

const FAQ_ITEMS = [
  {
    question: '진료비 비교는 어떤 기준으로 제공되나요?',
    answer: '지역, 항목, 반려동물 종류를 기준으로 최저·중앙·최고 비용과 평균 범위를 제공합니다. 전국 동물병원의 실제 진료 데이터를 기반으로 합니다.'
  },
  {
    question: 'AI 진료비 분석은 의료 판단인가요?',
    answer: '아니요. 의료 진단이 아닌 품종별 건강 분석과 예상 비용 견적을 위한 참고 데이터만 제공합니다. 정확한 진단은 반드시 수의사와 상담하세요.'
  },
  {
    question: '펫토커는 어떤 기능인가요?',
    answer: '반려동물 사진을 업로드하면 AI가 표정과 상태를 분석해 재미있는 대화형 반응을 보여줍니다. 하루 2회까지 무료로 사용 가능합니다.'
  },
  {
    question: '앱 연동은 어떤 효과가 있나요?',
    answer: '내 기록 기반 비교가 가능해져서 일반 평균이 아닌 우리 아이 기준의 비용 분석과 건강 관리 리포트를 받을 수 있습니다.'
  },
  {
    question: '데이터는 얼마나 자주 업데이트되나요?',
    answer: '진료비 데이터는 주 1회 이상 업데이트됩니다. 12만 건 이상의 실제 진료 기록을 바탕으로 가격 정보의 정확도를 높이고 있습니다.'
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
