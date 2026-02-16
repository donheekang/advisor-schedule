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
      {/* 히어로 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF3E6] via-[#FFE8CF] to-[#F7DFC2] px-6 py-16 md:px-12 md:py-24">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F97316]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-8 h-64 w-64 rounded-full bg-[#FFB347]/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-[#7C4A2D] shadow-sm">
            🐾 반려동물 보호자를 위한 AI 플랫폼
          </p>
          <h1 className="text-3xl font-extrabold leading-[1.3] text-[#4F2A1D] md:text-5xl">
            우리 아이 진료비,<br />적정한 걸까?
          </h1>
          <p className="mt-5 text-lg text-[#7C4A2D] md:text-xl">
            진료비 비교부터 AI 펫토커까지,<br className="md:hidden" /> 우리 아이를 위한 모든 것
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pet-talker"
              className="rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-7 py-3.5 text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
            >
              🗣 펫토커 해보기
            </Link>
            <Link
              href="/cost-search"
              className="rounded-2xl border-2 border-[#F97316] bg-white px-7 py-3.5 text-base font-bold text-[#EA580C] transition hover:bg-[#FFF8F0]"
            >
              💰 진료비 검색
            </Link>
          </div>
        </div>
      </section>

      {/* 핵심 기능 */}
      <section className="mt-14" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">
          이런 걸 할 수 있어요
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              emoji: '🗣',
              title: '펫토커',
              description: '사진 한 장으로 우리 아이의 마음을 들어보세요',
              href: '/pet-talker',
              bg: 'from-[#FFF8F0] to-[#FFEDD5]'
            },
            {
              emoji: '💰',
              title: '진료비 검색',
              description: '전국 평균과 비교해서 적정 가격을 확인하세요',
              href: '/cost-search',
              bg: 'from-[#FFF8F0] to-[#FEF3C7]'
            },
            {
              emoji: '📊',
              title: 'AI 분석',
              description: '영수증을 올리면 항목별로 자동 분석해줘요',
              href: '/cost-search',
              bg: 'from-[#FFF8F0] to-[#DBEAFE]'
            }
          ].map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <article
                className={`group rounded-3xl bg-gradient-to-b ${feature.bg} p-7 shadow-md ring-1 ring-[#F8C79F]/30 transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <p className="text-4xl">{feature.emoji}</p>
                <h3 className="mt-4 text-xl font-bold text-[#4F2A1D]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#7C4A2D]">{feature.description}</p>
                <p className="mt-4 text-sm font-bold text-[#F97316] group-hover:underline">해보기 →</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="mt-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">
          3단계로 시작하세요
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { step: '1', title: '사진 올리기 or 검색', desc: '우리 아이 사진을 올리거나 진료 항목을 검색하세요' },
            { step: '2', title: 'AI가 분석', desc: 'AI가 사진을 읽고 대사를 만들거나 진료비를 비교해요' },
            { step: '3', title: '공유 & 기록', desc: 'SNS에 공유하고, 앱에서 기록하면 더 정확해져요' }
          ].map((item) => (
            <li key={item.step} className="rounded-3xl bg-white p-7 shadow-md ring-1 ring-[#F8C79F]/20">
              <p className="text-5xl font-extrabold text-[#F97316]/20">{item.step}</p>
              <p className="mt-3 text-lg font-bold text-[#4F2A1D]">{item.title}</p>
              <p className="mt-2 text-sm text-[#7C4A2D]">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 신뢰 데이터 */}
      <section className="mt-14" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">
          보호자들이 신뢰하는 데이터
        </h2>
        <div className="mt-6 rounded-3xl bg-[#2D1B0E] px-6 py-10 text-center text-white">
          <p className="text-sm text-[#D4A574]">전국 진료비 데이터</p>
          <p className="mt-2 text-4xl font-extrabold text-[#FB923C] md:text-5xl">128,540건</p>
          <p className="mt-1 text-lg font-semibold text-white/80">분석 완료</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            {
              author: '강아지 보호자 김○○',
              review: '병원에서 받은 비용이 평균보다 높은지 바로 확인할 수 있어서 안심됐어요.',
              stars: '⭐⭐⭐⭐⭐'
            },
            {
              author: '고양이 보호자 이○○',
              review: '영수증 업로드 후 항목별로 정리돼서 다음 진료 계획 세우기가 쉬워졌어요.',
              stars: '⭐⭐⭐⭐⭐'
            }
          ].map((item) => (
            <blockquote key={item.author} className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-[#F8C79F]/20">
              <p className="text-sm text-[#D4A574]">{item.stars}</p>
              <p className="mt-2 leading-relaxed text-[#5A3325]">&ldquo;{item.review}&rdquo;</p>
              <footer className="mt-3 text-sm font-bold text-[#A36241]">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-[#4F2A1D] md:text-3xl">
          자주 묻는 질문
        </h2>
        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group rounded-2xl bg-white p-5 shadow-md ring-1 ring-[#F8C79F]/20">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-[#4F2A1D]">
                {item.question}
                <span className="text-[#F97316] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#7C4A2D]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="mt-14 rounded-3xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-12 text-center text-white md:px-10">
        <h2 className="text-2xl font-bold md:text-3xl">우리 아이 건강 관리, 지금 시작하세요 🐾</h2>
        <p className="mt-3 text-white/80">앱에서 진료 기록을 쌓을수록 우리 아이 맞춤 비교가 정교해집니다.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="https://apps.apple.com"
            className="rounded-2xl bg-white px-6 py-3.5 font-bold text-[#EA580C] shadow-lg transition hover:shadow-xl"
          >
            App Store 다운로드
          </Link>
          <Link
            href="https://play.google.com/store"
            className="rounded-2xl border-2 border-white/60 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
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
