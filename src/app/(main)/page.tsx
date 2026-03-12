import type { Metadata } from 'next';

import HomePageClient from './home-page-client';

const FAQ_ITEMS = [
  {
    question: '진료비 비교는 어떤 기준으로 제공되나요?',
    answer: '지역, 항목, 반려동물 종류를 기준으로 최저·중앙·최고 비용과 평균 범위를 보여드려요. 전국 동물병원의 실제 진료 데이터를 바탕으로 해서 더 믿을 수 있어요.'
  },
  {
    question: '데이터는 어디에서 오나요?',
    answer: '보호자분들이 앱에서 영수증을 등록하면 자동으로 데이터가 쌓여요. 함께하는 보호자가 많을수록 더 정확한 비교가 가능해져요.'
  },
  {
    question: '펫토커는 뭔가요?',
    answer: '우리 아이 사진을 올리면 AI가 표정을 읽고, 아이의 마음을 1인칭 대사로 전해줘요. 하루 2회까지 무료로 즐길 수 있어요.'
  },
  {
    question: '앱에서는 어떤 걸 더 할 수 있나요?',
    answer: '영수증 촬영으로 자동 정리, AI 케어 분석, 접종 스케줄 관리, 보험 청구 패키지 생성, 근처 동물병원 찾기까지 한 번에 할 수 있어요.'
  },
  {
    question: '웹에서는 무엇을 할 수 있나요?',
    answer: '진료비 비교와 펫토커는 웹에서 바로 이용할 수 있어요. AI 케어 분석 등 더 많은 기능은 앱에서 만나보세요.'
  }
] as const;

const pageTitle = 'PetHealth+ | 우리 아이 진료비, 적정한 걸까요?';
const pageDescription =
  '강아지·고양이 진료비를 전국 실제 데이터로 비교하세요. 진료비 걱정은 줄이고, 건강엔 더 집중할 수 있도록 도와드릴게요.';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
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
