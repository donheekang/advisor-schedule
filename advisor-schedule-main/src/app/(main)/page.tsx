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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5E5FC]/40 to-white px-6 py-16 md:px-12 md:py-24">
        <div className="relative max-w-2xl">
          <p className="mb-4 inline-flex rounded-full bg-[#48B8D0]/10 px-4 py-1.5 text-sm font-bold text-[#48B8D0] shadow-sm">
            🐾 반려동물 보호자를 위한 AI 플랫폼
          </p>
          <h1 className="text-3xl font-extrabold leading-[1.3] text-[#1F2937] md:text-5xl">증상만 입력하면</h1>
          <p className="mt-4 text-3xl font-extrabold leading-[1.3] md:text-5xl">
            <span className="bg-gradient-to-r from-[#48B8D0] to-[#B28B84] bg-clip-text text-transparent">예상 진료비를 알려드려요</span>
          </p>
          <p className="mt-5 text-lg text-[#6B7280] md:text-xl">진료비 비교부터 AI 펫토커까지, 우리 아이를 위한 모든 것</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pet-talker"
              className="rounded-2xl bg-[#48B8D0] px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-[#48B8D0]/20 transition hover:bg-[#3CA8BF] active:scale-[0.98]"
            >
              🗣 펫토커 해보기
            </Link>
            <Link
              href="/cost-search"
              className="rounded-2xl border-2 border-gray-200 bg-white px-7 py-3.5 text-base font-bold text-[#1F2937] transition hover:border-[#48B8D0]"
            >
              💰 진료비 검색
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-[#6B7280]">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#48B8D0]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#B28B84]" />
            <span>실제 보호자 기반 데이터</span>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold text-[#1F2937] md:text-3xl">
          이런 걸 할 수 있어요
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              emoji: '📊',
              title: 'AI 견적서',
              description: '영수증을 올리면 항목별로 자동 분석해줘요',
              href: '/cost-search',
              topBar: 'bg-[#48B8D0]',
              iconBg: 'bg-[#48B8D0]/10'
            },
            {
              emoji: '💰',
              title: '진료비 검색',
              description: '전국 평균과 비교해서 적정 가격을 확인하세요',
              href: '/cost-search',
              topBar: 'bg-[#B28B84]',
              iconBg: 'bg-[#B28B84]/10'
            },
            {
              emoji: '🗣',
              title: '펫토커',
              description: '사진 한 장으로 우리 아이의 마음을 들어보세요',
              href: '/pet-talker',
              topBar: 'bg-[#F5E5FC]',
              iconBg: 'bg-[#F5E5FC]'
            }
          ].map((feature) => (
            <Link key={feature.title} href={feature.href} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-md ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-xl">
                <div className={'mb-4 h-1 w-full rounded-full ' + feature.topBar} />
                <p className={'inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ' + feature.iconBg}>{feature.emoji}</p>
                <h3 className="mt-4 text-xl font-bold text-[#1F2937]">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm text-[#6B7280]">{feature.description}</p>
                <p className="mt-4 text-sm font-bold text-[#48B8D0] group-hover:underline">해보기 →</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-2xl font-bold text-[#1F2937] md:text-3xl">
          3단계로 시작하세요
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { step: '1', title: '사진 올리기 or 검색', desc: '우리 아이 사진을 올리거나 진료 항목을 검색하세요' },
            { step: '2', title: 'AI가 분석', desc: 'AI가 사진을 읽고 대사를 만들거나 진료비를 비교해요' },
            { step: '3', title: '공유 & 기록', desc: 'SNS에 공유하고, 앱에서 기록하면 더 정확해져요' }
          ].map((item) => (
            <li key={item.step} className="rounded-3xl bg-[#F5E5FC]/50 p-7 shadow-md ring-1 ring-gray-200">
              <p className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#48B8D0] text-base font-bold text-white">{item.step}</p>
              <p className="mt-3 text-lg font-bold text-[#1F2937]">{item.title}</p>
              <p className="mt-2 text-sm text-[#6B7280]">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-2xl font-bold text-[#1F2937] md:text-3xl">
          이런 점이 다릅니다
        </h2>
        <div className="mt-6 rounded-3xl bg-[#1F2937] px-6 py-10 text-center text-white">
          <p className="text-lg font-semibold text-[#48B8D0]">AI 진료비 분석</p>
          <p className="mt-2 text-4xl">📊</p>
          <p className="mt-2 text-white/70">의료 판단이 아닌 가격 비교와 정보 제공 중심으로 안내해요.</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            {
              title: '데이터 기반 비교',
              review: '전국 평균 데이터를 기준으로 현재 비용의 위치를 직관적으로 확인할 수 있어요.',
              emoji: '📈'
            },
            {
              title: '앱 기록 연동',
              review: '누적 기록을 바탕으로 우리 아이에게 더 맞는 비용 패턴을 빠르게 파악해요.',
              emoji: '📱'
            }
          ].map((item) => (
            <blockquote key={item.title} className="rounded-3xl bg-[#1F2937] p-6 shadow-md ring-1 ring-white/10">
              <p className="text-2xl">{item.emoji}</p>
              <p className="mt-3 font-bold text-[#48B8D0]">{item.title}</p>
              <p className="mt-2 leading-relaxed text-white/70">{item.review}</p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-[#F5E5FC]/30 px-6 py-10 text-center" aria-label="브릿지 메시지">
        <h2 className="text-2xl font-bold text-[#1F2937] md:text-3xl">우리 아이 건강, 지금 바로 확인해보세요</h2>
        <p className="mt-3 text-[#6B7280]">진료비 비교와 기록 관리를 한 번에 시작할 수 있어요.</p>
      </section>

      <section className="mt-14" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-[#1F2937] md:text-3xl">
          자주 묻는 질문
        </h2>
        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-200">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-[#1F2937]">
                {item.question}
                <span className="text-[#B28B84] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-[#1F2937] px-6 py-12 text-center text-white md:px-10">
        <h2 className="text-2xl font-bold md:text-3xl">우리 아이 건강 관리, 지금 시작하세요 🐾</h2>
        <p className="mt-3 text-white/70">앱에서 진료 기록을 쌓을수록 우리 아이 맞춤 비교가 정교해집니다.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="https://apps.apple.com" className="rounded-2xl bg-[#48B8D0] px-6 py-3.5 font-bold text-white transition hover:bg-[#3CA8BF]">
            App Store 다운로드
          </Link>
          <Link
            href="https://play.google.com/store"
            className="rounded-2xl border-2 border-white/30 px-6 py-3.5 font-bold text-white transition hover:border-[#48B8D0]"
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
