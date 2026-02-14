import type { Metadata } from 'next';
import Link from 'next/link';

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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF3E6] via-[#FDE3C4] to-[#F7CFA0] px-6 py-16 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-secondary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-12 h-56 w-56 rounded-full bg-[#F2B372]/40 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-brand-primary">
            반려동물 진료비 데이터 플랫폼
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            우리 아이 진료비, 적정한 걸까?
          </h1>
          <p className="mt-5 text-lg text-[#754D27] md:text-xl">
            반려동물 진료비를 비교하고, AI로 분석받으세요
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cost-search"
              className="rounded-xl bg-brand-secondary px-6 py-3 text-base font-bold text-white transition hover:bg-brand-ctaHover"
            >
              진료비 검색하기
            </Link>
            <Link
              href="/pet-talker"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-800 transition hover:bg-brand-background"
            >
              펫토커 해보기
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold text-brand-primary md:text-3xl">
          핵심 기능
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: '🗣 펫토커',
              description: '우리 아이가 말을 한다면?'
            },
            {
              title: '💰 진료비 검색',
              description: '전국 평균과 비교해보세요'
            },
            {
              title: '📊 AI 분석',
              description: '영수증을 올리면 자동 분석'
            }
          ].map((feature) => (
            <article key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-bold text-brand-primary">{feature.title}</h3>
              <p className="mt-3 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-2xl font-bold text-brand-primary md:text-3xl">
          사용 방법
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {['진료비를 검색하세요', 'AI가 분석해드려요', '앱에서 기록하면 더 정확해져요'].map((step, index) => (
            <li key={step} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-bold text-brand-primary">Step {index + 1}</p>
              <p className="mt-2 font-semibold text-slate-800">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-2xl font-bold text-brand-primary md:text-3xl">
          신뢰 데이터 & 보호자 후기
        </h2>
        <div className="mt-6 rounded-2xl bg-slate-900 px-6 py-8 text-white">
          <p className="text-sm text-slate-200">진료비 데이터</p>
          <p className="mt-2 text-3xl font-extrabold md:text-4xl">128,540건 분석 완료</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            {
              author: '강아지 보호자 김○○',
              review: '병원에서 받은 비용이 평균보다 높은지 바로 확인할 수 있어서 안심됐어요.'
            },
            {
              author: '고양이 보호자 이○○',
              review: '영수증 업로드 후 항목별로 정리돼서 다음 진료 계획 세우기가 쉬워졌어요.'
            }
          ].map((item) => (
            <blockquote key={item.author} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-brand-textSecondary">“{item.review}”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-500">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-brand-secondary px-6 py-10 text-center text-white md:px-10">
        <h2 className="text-2xl font-bold md:text-3xl">앱과 함께 더 정확한 진료비 관리를 시작하세요</h2>
        <p className="mt-3 text-[#FFF3E6]">앱에서 진료 기록을 쌓을수록 우리 아이 맞춤 비교가 정교해집니다.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="https://apps.apple.com"
            className="rounded-xl bg-white px-5 py-3 font-bold text-brand-primary transition hover:bg-[#F8FAFB]"
          >
            App Store 다운로드
          </Link>
          <Link
            href="https://play.google.com/store"
            className="rounded-xl border border-white/60 px-5 py-3 font-bold text-white transition hover:bg-brand-ctaHover"
          >
            Google Play 다운로드
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
