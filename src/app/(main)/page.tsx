import { Accordion, AnimateOnScroll, CountUp, IconBadge } from '@/components/ui';
import { ArrowRight, PawPrint, Search, Sparkles } from '@/components/ui/lucide-icons';
import type { Metadata } from 'next';
import Link from 'next/link';

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
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF3E6] via-[#FFF8F0] to-transparent" />
        <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-[#F97316]/5 blur-3xl" />
        <div className="absolute left-[5%] top-40 h-48 w-48 rounded-full bg-[#3B82F6]/5 blur-3xl" />
        <div className="absolute bottom-10 right-[20%] h-36 w-36 rounded-full bg-[#8B5CF6]/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1B2A4A]/5 px-4 py-2 text-sm font-medium text-[#1B2A4A]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F97316]" />
              </span>
              반려동물 보호자를 위한 AI 플랫폼
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={150}>
            <h1 className="mb-6 text-2xl font-extrabold leading-[1.3] tracking-tight text-[#1B2A4A] md:text-4xl md:leading-[1.3] lg:text-[3.5rem] lg:leading-[1.3]">
              우리 아이 진료비,
              <br />
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">적정한 걸까?</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <p className="mb-10 max-w-lg text-base leading-relaxed text-[#64748B] md:text-lg">
              진료비 비교부터 AI 펫토커까지, 우리 아이를 위한 모든 것
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={450}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pet-talker"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F97316]/25 active:scale-[0.98]"
              >
                <PawPrint className="h-4 w-4" />
                펫토커 해보기
              </Link>
              <Link
                href="/cost-search"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#F97316] bg-white px-6 py-3.5 text-sm font-semibold text-[#F97316] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#FFF7ED] active:translate-y-0 active:scale-[0.98]"
              >
                <Search className="h-4 w-4" />
                진료비 검색
              </Link>
              <Link
                href="/ai-care"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8D5C0] bg-white px-6 py-3.5 text-sm font-semibold text-[#1B2A4A] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#F8C79F] hover:bg-[#FFFAF5] active:translate-y-0 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 text-[#F97316]" />
                AI 견적서
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-2 text-sm text-[#94A3B8] sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>128,000+ 데이터</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>무료 이용 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>30초 AI 분석</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[1]}>
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-3 text-2xl font-bold text-[#1B2A4A] md:text-3xl">이런 걸 할 수 있어요</h2>
          <p className="mb-10 text-[#64748B] md:mb-14">PetHealth+와 함께 우리 아이 건강을 관리하세요</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {[
            {
              icon: <PawPrint className="h-6 w-6" />,
              color: 'orange' as const,
              title: '펫토커',
              desc: '사진 한 장으로 우리 아이의 마음을 들어보세요',
              href: '/pet-talker'
            },
            {
              icon: <Search className="h-6 w-6" />,
              color: 'blue' as const,
              title: '진료비 검색',
              desc: '전국 평균과 비교해서 적정 가격을 확인하세요',
              href: '/cost-search'
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              color: 'purple' as const,
              title: 'AI 견적서',
              desc: '증상을 입력하면 예상 진료비를 알려드려요',
              href: '/ai-care'
            }
          ].map((item, i) => (
            <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 150}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-2xl border border-[#F8C79F]/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1B2A4A]/5"
              >
                <div
                  className={
                    'h-1 w-full bg-gradient-to-r ' +
                    (item.color === 'orange'
                      ? 'from-[#F97316] to-[#FB923C]'
                      : item.color === 'blue'
                        ? 'from-[#3B82F6] to-[#60A5FA]'
                        : 'from-[#8B5CF6] to-[#A78BFA]')
                  }
                />
                <div className="p-6 md:p-8">
                  <IconBadge icon={item.icon} color={item.color} size="lg" />
                  <h3 className="mb-2 mt-5 text-lg font-semibold text-[#1B2A4A] transition-all duration-300 group-hover:text-[#F97316]">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-[#64748B]">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] transition-all duration-300 group-hover:gap-2 group-hover:text-[#EA580C]">
                    해보기 <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-2xl font-bold text-[#1B2A4A] md:text-3xl">3단계로 시작하세요</h2>
          <p className="mb-10 text-[#64748B] md:mb-14">간단한 3단계로 우리 아이 건강 관리를 시작할 수 있어요</p>

          <div className="relative">
            <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-12 hidden h-0.5 bg-gradient-to-r from-[#F97316]/20 via-[#F97316]/40 to-[#F97316]/20 md:block" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
              {[
                { num: '1', title: '사진 올리기 or 검색', desc: '우리 아이 사진을 올리거나 진료 항목을 검색하세요' },
                { num: '2', title: 'AI가 분석', desc: 'AI가 사진을 읽고 대사를 만들거나 진료비를 비교해요' },
                { num: '3', title: '공유 & 기록', desc: 'SNS에 공유하고, 앱에서 기록하면 더 정확해져요' }
              ].map((step) => (
                <div key={step.num} className="relative rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E6] p-6 md:p-8">
                  <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316] text-lg font-bold text-white shadow-lg shadow-[#F97316]/25">
                    {step.num}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#1B2A4A]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#64748B]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[0]}>
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-10 text-2xl font-bold text-[#1B2A4A] md:mb-14 md:text-3xl">보호자들이 신뢰하는 데이터</h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="scale-up">
          <div className="rounded-3xl bg-gradient-to-br from-[#1B2A4A] via-[#243656] to-[#1B2A4A] p-8 text-center text-white md:p-14">
            <p className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">보호자들이 신뢰하는 데이터</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
              <div>
                <p className="text-4xl font-black tracking-tight md:text-5xl">
                  <CountUp target={128540} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-white/60">전국 진료비 데이터</p>
              </div>
              <div>
                <p className="text-4xl font-black tracking-tight md:text-5xl">
                  <CountUp target={2847} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-white/60">등록 동물병원</p>
              </div>
              <div>
                <p className="text-4xl font-black tracking-tight md:text-5xl">
                  <CountUp target={15} suffix="개" />
                </p>
                <p className="mt-1 text-sm text-white/60">진료 카테고리</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {[
            {
              text: '병원에서 받은 비용이 평균보다 높은지 바로 확인할 수 있어서 안심됐어요.',
              name: '강아지 보호자 김OO'
            },
            {
              text: '영수증 업로드 후 항목별로 정리돼서 다음 진료 계획 세우기가 쉬워졌어요.',
              name: '고양이 보호자 이OO'
            },
            {
              text: '다른 병원 가격이 궁금했는데 한눈에 비교할 수 있어서 정말 편리해요.',
              name: '강아지 보호자 박OO'
            }
          ].map((review, i) => (
            <AnimateOnScroll key={review.name} animation="fade-up" delay={i * 150}>
              <div className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm">
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#F97316]">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#4A5568]">&ldquo;{review.text}&rdquo;</p>
                <p className="text-xs text-[#94A3B8]">{review.name}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[1]}>
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-10 text-2xl font-bold text-[#1B2A4A] md:text-3xl">자주 묻는 질문</h2>
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
      <section className="bg-gradient-to-r from-[#1B2A4A] to-[#2D4A6F] px-4 py-16 text-center text-white md:py-20">
        <h2 className="mb-3 text-xl font-extrabold md:text-2xl">우리 아이 진료비, 지금 바로 확인해보세요</h2>
        <p className="mb-8 text-sm text-white/70 md:text-base">전국 평균 데이터로 비교하고, AI로 예상 비용까지</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/cost-search"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#F97316]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            🔍 진료비 검색하기
          </a>
          <a
            href="/ai-care"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
          >
            ✨ AI 견적서 받기
          </a>
        </div>
      </section>
      </AnimateOnScroll>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
