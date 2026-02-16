import { Accordion, AnimateOnScroll, CountUp, IconBadge } from '@/components/ui';
import { ArrowRight, PawPrint, Search, Sparkles, Stethoscope } from '@/components/ui/lucide-icons';
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
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF3E6] via-[#FFF8F0] to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#F8C79F]/30 bg-white/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#F97316] shadow-sm backdrop-blur">
              <Stethoscope className="h-3.5 w-3.5" />
              반려동물 보호자를 위한 AI 플랫폼
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={150}>
            <h1 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-[#4F2A1D] md:mb-6 md:text-5xl lg:text-6xl">
              우리 아이 진료비,<br />적정한 걸까?
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-[#6B4226] md:mb-10 md:text-lg">
              진료비 비교부터 AI 펫토커까지,<br className="md:hidden" /> 우리 아이를 위한 모든 것
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={450}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pet-talker"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F97316]/25 active:scale-[0.98]"
              >
                <PawPrint className="h-4 w-4" />
                펫토커 해보기
              </Link>
              <Link
                href="/cost-search"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#F97316] bg-white px-6 py-3.5 text-sm font-semibold text-[#F97316] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFF7ED] active:translate-y-0 active:scale-[0.98]"
              >
                <Search className="h-4 w-4" />
                진료비 검색
              </Link>
              <Link
                href="/ai-care"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8D5C0] bg-white px-6 py-3.5 text-sm font-semibold text-[#4F2A1D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F8C79F] hover:bg-[#FFFAF5] active:translate-y-0 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 text-[#F97316]" />
                AI 케어 체험
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[1]}>
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-3 text-2xl font-bold text-[#4F2A1D] md:text-3xl">이런 걸 할 수 있어요</h2>
          <p className="mb-10 text-[#8B6B4E] md:mb-14">PetHealth+와 함께 우리 아이 건강을 관리하세요</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
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
              title: 'AI 케어',
              desc: '우리 아이 맞춤 케어 리포트를 받아보세요',
              href: '/ai-care'
            }
          ].map((item, i) => (
            <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 150}>
              <Link
                href={item.href}
                className="group block rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F8C79F]/30 hover:shadow-xl hover:shadow-[#4F2A1D]/5 md:p-8"
              >
                <IconBadge icon={item.icon} color={item.color} size="lg" />
                <h3 className="mb-2 mt-5 text-lg font-bold text-[#4F2A1D] transition-colors group-hover:text-[#F97316]">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#6B4226]">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#F97316] transition-all group-hover:gap-2">
                  해보기 <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[2]}>
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-3 text-2xl font-bold text-[#4F2A1D] md:text-3xl">3단계로 시작하세요</h2>
            <p className="mb-10 text-[#8B6B4E] md:mb-14">간단한 3단계로 우리 아이 건강 관리를 시작할 수 있어요</p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              { num: '1', title: '사진 올리기 or 검색', desc: '우리 아이 사진을 올리거나 진료 항목을 검색하세요' },
              { num: '2', title: 'AI가 분석', desc: 'AI가 사진을 읽고 대사를 만들거나 진료비를 비교해요' },
              { num: '3', title: '공유 & 기록', desc: 'SNS에 공유하고, 앱에서 기록하면 더 정확해져요' }
            ].map((step, i) => (
              <AnimateOnScroll key={step.num} animation="fade-up" delay={i * 150}>
                <div className="relative rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E6] p-6 md:p-8">
                  <span className="text-5xl font-black text-[#F97316]/10 md:text-6xl">{step.num}</span>
                  <h3 className="mb-2 mt-2 text-lg font-bold text-[#4F2A1D]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#6B4226]">{step.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[0]}>
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-10 text-2xl font-bold text-[#4F2A1D] md:mb-14 md:text-3xl">보호자들이 신뢰하는 데이터</h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="scale-up">
          <div className="rounded-3xl bg-gradient-to-r from-[#3D2518] to-[#5A3825] p-8 text-center text-white md:p-12">
            <p className="mb-2 text-sm text-white/70">전국 진료비 데이터</p>
            <p className="text-4xl font-black tracking-tight md:text-6xl">
              <CountUp target={128540} suffix="건" />
            </p>
            <p className="mt-2 text-sm text-white/70">분석 완료</p>
          </div>
        </AnimateOnScroll>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              text: '병원에서 받은 비용이 평균보다 높은지 바로 확인할 수 있어서 안심됐어요.',
              name: '강아지 보호자 김OO'
            },
            {
              text: '영수증 업로드 후 항목별로 정리돼서 다음 진료 계획 세우기가 쉬워졌어요.',
              name: '고양이 보호자 이OO'
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
                <p className="mb-4 text-sm leading-relaxed text-[#4F2A1D]">&ldquo;{review.text}&rdquo;</p>
                <p className="text-xs text-[#8B6B4E]">{review.name}</p>
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
            <h2 className="mb-10 text-2xl font-bold text-[#4F2A1D] md:text-3xl">자주 묻는 질문</h2>
          </AnimateOnScroll>

          {FAQ_ITEMS.map((faq, index) => (
            <AnimateOnScroll
              key={faq.question}
              animation="fade-up"
              delay={sectionDelays[index % sectionDelays.length]}
            >
              <Accordion title={faq.question}>{faq.answer}</Accordion>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={sectionDelays[2]}>
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <AnimateOnScroll animation="scale-up">
          <div className="rounded-3xl bg-gradient-to-r from-[#3D2518] via-[#4F2A1D] to-[#6B3A27] p-8 text-center text-white md:p-12">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">우리 아이 건강 관리, 지금 시작하세요 🐾</h2>
            <p className="mb-8 text-sm text-white/80 md:text-base">
              앱에서 진료 기록을 쌓을수록 우리 아이 맞춤 비교가 정교해집니다.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://apps.apple.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                App Store 다운로드
              </a>
              <a
                href="https://play.google.com/store"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Google Play 다운로드
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
      </AnimateOnScroll>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
