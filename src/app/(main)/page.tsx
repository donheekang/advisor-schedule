import { Accordion, AnimateOnScroll } from '@/components/ui';
import type { Metadata } from 'next';

const FAQ_ITEMS = [
  {
    question: '진료비 검색은 어떤 방식으로 비교되나요?',
    answer:
      '전국 동물병원의 실제 진료비 데이터를 수집·분석하여 항목별 평균, 최소, 최대 가격을 보여드려요. 지역별 비교도 가능해요.'
  },
  {
    question: 'AI 분석은 의료 진단을 제공하나요?',
    answer:
      '아니요. AI 분석은 진료비 비교와 홈케어 가이드를 제공하며, 의료 진단을 대체하지 않아요. 정확한 진단은 반드시 수의사와 상담하세요.'
  },
  {
    question: '앱 기록을 연동하면 어떤 점이 좋아지나요?',
    answer:
      '앱에서 영수증을 찍으면 진료 항목이 자동 분류되고, 누적 데이터를 기반으로 더 정확한 맞춤 케어 추천을 받을 수 있어요.'
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
  const sectionDelays = [0, 150, 300] as const;

  return (
    <>
      <AnimateOnScroll animation="fade-up" delay={sectionDelays[0]}>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5E5FC] to-white pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#48B8D0]/10 to-[#C084FC]/10 px-4 py-2 text-sm font-medium text-[#48B8D0] border border-[#48B8D0]/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                AI 진료비 분석 서비스
              </div>
              <h1 className="mb-6 text-3xl font-extrabold leading-[1.3] text-[#1F2937] md:text-4xl md:leading-[1.3] lg:text-[3.5rem] lg:leading-[1.3]">
                증상만 입력하면
                <br />
                <span className="bg-gradient-to-r from-[#48B8D0] to-[#B28B84] bg-clip-text text-transparent">
                  예상 진료비를 알려드려요
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-lg text-base text-[#6B7280] md:text-lg">
                AI가 증상을 분석하고, 예상 질환과 진료비 범위를 알려드려요.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="/ai-care"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#48B8D0] px-8 py-4 text-base font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-[#3CA8BF] sm:w-auto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                  AI 견적서 받기
                </a>
                <a
                  href="/cost-search"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E2E8F0] bg-white px-8 py-4 text-base font-bold text-[#1F2937] transition hover:border-[#48B8D0] hover:text-[#48B8D0] sm:w-auto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  진료비 검색
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>무료 이용
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#B28B84]"></span>30초 AI 분석
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#48B8D0]"></span>전국 진료비 비교
                </span>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[1]}>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-3 text-center text-2xl font-extrabold text-[#1F2937] md:text-3xl">이런 걸 할 수 있어요</h2>
            <p className="mb-10 text-center text-sm text-[#6B7280]">PetHealth+와 함께 우리 아이 건강을 관리하세요</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <a href="/ai-care" className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 h-1 w-16 rounded-full bg-[#48B8D0]"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#48B8D0] to-[#3A9BB0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#1F2937]">AI 견적서</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#6B7280]">
                  증상을 입력하면 AI가 예상 질환과 진료비 범위를 분석해드려요
                </p>
                <span className="mt-auto text-sm font-semibold text-[#48B8D0]">받아보기 →</span>
              </a>
              <a
                href="/cost-search"
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 h-1 w-16 rounded-full bg-[#B28B84]"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#5CC4D8] to-[#48B8D0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#1F2937]">진료비 검색</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#6B7280]">
                  전국 평균과 비교해서 적정 가격을 확인하세요
                </p>
                <span className="mt-auto text-sm font-semibold text-[#48B8D0]">검색하기 →</span>
              </a>
              <a
                href="/pet-talker"
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 h-1 w-16 rounded-full bg-[#F5E5FC]"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C084FC] to-[#A855F7]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#1F2937]">펫토커</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#6B7280]">
                  사진 한 장으로 우리 아이의 마음을 들어보세요
                </p>
                <span className="mt-auto text-sm font-semibold text-[#48B8D0]">해보기 →</span>
              </a>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-2xl font-bold text-[#1F2937] md:text-3xl">3단계로 시작하세요</h2>
          <p className="mb-10 text-[#6B7280] md:mb-14">간단한 3단계로 우리 아이 건강 관리를 시작할 수 있어요</p>

          <div className="relative">
            <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-12 hidden h-0.5 bg-gradient-to-r from-[#48B8D0]/20 via-[#48B8D0]/40 to-[#48B8D0]/20 md:block" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
              {[
                { num: '1', title: '사진 올리기 or 검색', desc: '우리 아이 사진을 올리거나 진료 항목을 검색하세요' },
                { num: '2', title: 'AI가 분석', desc: 'AI가 사진을 읽고 대사를 만들거나 진료비를 비교해요' },
                { num: '3', title: '공유 & 기록', desc: 'SNS에 공유하고, 앱에서 기록하면 더 정확해져요' }
              ].map((step) => (
                <div key={step.num} className="relative rounded-2xl bg-gradient-to-br from-[#F5E5FC] to-[#F5E5FC] p-6 md:p-8">
                  <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#48B8D0] text-lg font-bold text-white shadow-lg shadow-[#48B8D0]/25">
                    {step.num}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#1F2937]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#6B7280]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[0]}>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-4 text-center text-2xl font-extrabold text-[#1F2937] md:text-3xl">이런 점이 다릅니다</h2>
            <p className="mb-10 text-center text-sm text-[#6B7280]">PetHealth+만의 차별점</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-[#1F2937] p-8 text-center text-white">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#48B8D0] to-[#3A9BB0]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </div>
                <div className="mb-2 text-xl font-bold text-[#48B8D0]">AI 진료비 분석</div>
                <p className="text-sm text-white/70">AI가 증상을 분석하고 예상 진료비를 알려드려요</p>
              </div>
              <div className="rounded-2xl bg-[#1F2937] p-8 text-center text-white">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5CC4D8] to-[#48B8D0]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <div className="mb-2 text-xl font-bold text-[#48B8D0]">전국 평균 비교</div>
                <p className="text-sm text-white/70">지역별 진료비 평균 데이터로 적정 가격을 확인하세요</p>
              </div>
              <div className="rounded-2xl bg-[#1F2937] p-8 text-center text-white">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C084FC] to-[#A855F7]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                </div>
                <div className="mb-2 text-xl font-bold text-[#48B8D0]">완전 무료</div>
                <p className="text-sm text-white/70">진료비 검색부터 AI 견적까지 모든 기능이 무료예요</p>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-lg font-semibold text-[#1F2937]">우리 아이 건강, 지금 바로 확인해보세요</p>
          <p className="mt-2 text-sm text-[#6B7280]">진료비가 걱정되셨다면 PetHealth+가 도와드릴게요</p>
        </div>
      </section>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[1]}>
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4">
            <AnimateOnScroll animation="fade-up">
              <h2 className="mb-10 text-2xl font-bold text-[#1F2937] md:text-3xl">자주 묻는 질문</h2>
            </AnimateOnScroll>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, index) => (
                <AnimateOnScroll key={faq.question} animation="fade-up" delay={index * 100}>
                  <Accordion title={faq.question}>{faq.answer}</Accordion>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[2]}>
        <section className="bg-[#1F2937] px-4 py-16 text-center text-white md:py-20">
          <h2 className="mb-3 text-xl font-extrabold md:text-2xl">우리 아이 진료비, 지금 바로 확인해보세요</h2>
          <p className="mb-8 text-sm text-white/70 md:text-base">전국 평균 데이터로 비교하고, AI로 예상 비용까지</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/ai-care"
              className="inline-flex items-center gap-2 rounded-xl bg-[#48B8D0] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#48B8D0]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              AI 견적서 받기
            </a>
            <a
              href="/cost-search"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              진료비 검색하기
            </a>
          </div>
        </section>
      </AnimateOnScroll>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#48B8D0] to-[#3A9BB0]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
          </div>
          <h2 className="mb-2 text-2xl font-extrabold text-[#0B3041]">우리 아이 건강 기록, 앱으로 관리하세요</h2>
          <p className="mb-8 text-sm text-[#6B7280]">진료 기록부터 건강 관리까지, PetHealth+ 앱이 곧 출시돼요</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#0B3041] px-6 py-3.5 text-sm font-bold text-white opacity-80"
            >
              App Store 출시 예정
            </button>
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#0B3041] px-6 py-3.5 text-sm font-bold text-white opacity-80"
            >
              ▶ Google Play 출시 예정
            </button>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
