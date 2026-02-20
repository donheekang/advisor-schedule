import { existsSync } from 'fs';

import { Accordion, AnimateOnScroll } from '@/components/ui';
import type { Metadata } from 'next';
import Image from 'next/image';

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
  const hasToriImage = existsSync(process.cwd() + '/public/tori-hero.jpeg');

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0F1A] px-4 pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[30%] top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#48B8D0]/[0.06] blur-[120px]" />
          <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[500px] rounded-full bg-[#B28B84]/[0.05] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-16">
          <div>
            <AnimateOnScroll animation="fade-up">
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.2] tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                영수증은 쌓이고,
                <br />
                <span className="bg-gradient-to-r from-[#48B8D0] to-[#C084FC] bg-clip-text text-transparent">기록은 없고.</span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={100}>
              <p className="mb-10 max-w-[440px] text-lg leading-relaxed text-white/50 md:text-xl">
                찍기만 하면 자동 기록.
                <br />
                AI가 분석하고, 전국 데이터와 비교해드려요.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={200}>
              <div className="flex flex-col gap-4">
                <a
                  href="/ai-care"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#48B8D0] px-8 py-4 text-base font-bold text-[#0A0F1A] shadow-[0_0_30px_rgba(72,184,208,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(72,184,208,0.5)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                  무료로 진료비 확인
                </a>
                <div className="flex gap-3">
                  <a
                    href="https://apps.apple.com/app/id6504879567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.5-105.8-207.6-105.8-327.6 0-192.8 125.3-295.2 248.6-295.2 65.5 0 120.1 43 161.2 43s99.8-45.6 177.6-45.6c28.7 0 131.5 2.6 199.4 99.8zm-234-184.5c31.4-37.1 53.6-88.7 53.6-140.3 0-7.1-.6-14.3-1.9-20.1-51.1 1.9-111.9 34-148.4 76.5-27.5 31.4-55.2 83-55.2 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.9 0 103.7-30.7 140.4-71.1z" />
                    </svg>
                    App Store
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FFD900" />
                      <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4CAF50" />
                      <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFD900" />
                      <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3333" />
                    </svg>
                    Google Play
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                {['완전 무료', '30초 AI 분석', '전국 비교'].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] text-white/40">
                    ✦ {t}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-[#48B8D0] opacity-15" />
                <div className="absolute -left-4 bottom-2 h-8 w-8 rounded-full bg-[#B28B84] opacity-20" />
                <div className="absolute right-[-24px] top-1/2 h-5 w-5 rounded-full bg-[#C084FC] opacity-12" />
                <div className="h-[320px] w-[320px] overflow-hidden rounded-full border-4 border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4),0_0_80px_rgba(72,184,208,0.08)] md:h-[400px] md:w-[400px]">
                  {hasToriImage ? (
                    <Image
                      src="/tori-hero.jpeg"
                      alt="토리"
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: 'center center' }}
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#111827] text-sm font-semibold text-white/60">
                      토리 이미지 준비중
                    </div>
                  )}
                </div>
                <div className="absolute -left-10 top-8 flex animate-bounce items-center gap-2 rounded-2xl border border-white/10 bg-[#111827]/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl" style={{ animationDuration: '3s' }}>
                  <span className="h-2 w-2 rounded-full bg-[#48B8D0]" />
                  <span className="text-[13px] font-semibold text-white">AI 자동 기록 중</span>
                </div>
                <div className="absolute -right-8 bottom-10 flex animate-bounce items-center gap-2 rounded-2xl border border-white/10 bg-[#111827]/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[13px] font-semibold text-white">토리 · 7.8kg 건강</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="bg-[#0A0F1A] px-4 py-28 md:py-36">
        <div className="mx-auto max-w-[1100px]">
          <AnimateOnScroll animation="fade-up">
            <p className="mb-5 text-center text-sm font-semibold uppercase tracking-widest text-[#48B8D0]">Problem</p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-16 text-center text-3xl font-extrabold leading-snug tracking-tight text-white md:text-[2.75rem]">
              혹시 이런 경험,
              <br />
              <span className="text-white/40">한 번쯤 있지 않으셨나요?</span>
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                grad: 'from-[#48B8D0] to-[#3A9BB0]',
                icon: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
                t: '서랍 속 영수증',
                d: '어디 갔는지도 모르는 진료 기록들. 나중에 찾으려면 이미 늦었어요.'
              },
              {
                grad: 'from-[#B28B84] to-[#9A756E]',
                icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
                t: '이게 적정가인가?',
                d: '비교할 데이터도 없이 결제. 비싼 건지 싼 건지 알 수가 없어요.'
              },
              {
                grad: 'from-[#C084FC] to-[#A855F7]',
                icon: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
                t: '접종일, 또 잊었다',
                d: '기억에만 의존하는 건강 관리. 다음 접종일이 언제였더라…'
              }
            ].map((c, i) => (
              <AnimateOnScroll key={c.t} animation="fade-up" delay={i * 100}>
                <div className="rounded-3xl border border-white/[0.06] bg-[#111827] p-10 transition-all hover:-translate-y-2 hover:border-[#48B8D0]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className={'mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br ' + c.grad}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: c.icon }} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{c.t}</h3>
                  <p className="text-[15px] leading-relaxed text-white/50">{c.d}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-28 md:py-36">
        <div className="mx-auto max-w-[1100px]">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-[#0A0F1A] md:text-[2.75rem]">지금 바로 해볼 수 있어요</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <p className="mb-14 text-center text-base text-[#6B7280]">로그인 없이, 무료로.</p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                href: '/ai-care',
                grad: 'from-[#48B8D0] to-[#3A9BB0]',
                icon: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
                t: 'AI 진료비 견적',
                d: '증상만 입력하면 30초만에 예상 진료비를 알려드려요',
                l: '바로 해보기 →'
              },
              {
                href: '/cost-search',
                grad: 'from-[#B28B84] to-[#9A756E]',
                icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
                t: '진료비 비교',
                d: '우리 아이 진료비, 비싼 건지 전국 평균과 바로 비교',
                l: '검색하기 →'
              },
              {
                href: '/pet-talker',
                grad: 'from-[#C084FC] to-[#A855F7]',
                icon: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
                t: '펫토커',
                d: '사진 한 장이면 우리 아이 마음이 보여요',
                l: '해보기 →'
              }
            ].map((c, i) => (
              <AnimateOnScroll key={c.t} animation="fade-up" delay={i * 100}>
                <a href={c.href} className="flex flex-col rounded-3xl border border-[#F3F4F6] bg-[#F9FAFB] p-9 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                  <div className={'mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br ' + c.grad}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: c.icon }} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#0A0F1A]">{c.t}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-[#6B7280]">{c.d}</p>
                  <span className="mt-5 text-sm font-bold text-[#48B8D0]">{c.l}</span>
                </a>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0F1A] px-4 py-28 md:py-36">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <AnimateOnScroll animation="fade-up">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#48B8D0]">App</p>
                <h2 className="mb-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-white md:text-[2.75rem]">
                  기록이 쌓일수록
                  <br />AI가 더 똑똑해져요
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={100}>
                <p className="mb-10 text-[17px] leading-relaxed text-white/50">
                  웹은 맛보기. 앱은 풀기능.
                  <br />
                  진료 기록이 쌓일수록 AI가 더 정확하게 분석해요.
                </p>
              </AnimateOnScroll>
              <div className="mb-10 flex flex-col gap-6">
                {[
                  {
                    icon: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
                    t: '영수증 촬영 → 자동 분류',
                    d: 'AI가 항목별로 나눠서 기록'
                  },
                  {
                    icon: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
                    t: '접종일 푸시 알림',
                    d: '다시는 까먹지 않아요'
                  },
                  {
                    icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
                    t: '누적 데이터 → 맞춤 분석',
                    d: '기록이 쌓일수록 AI가 정확해짐'
                  }
                ].map((item, i) => (
                  <AnimateOnScroll key={item.t} animation="fade-up" delay={100 + i * 100}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#48B8D0]/15 bg-[#48B8D0]/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#48B8D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{item.t}</h4>
                        <p className="text-sm text-white/40">{item.d}</p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
              <AnimateOnScroll animation="fade-up" delay={400}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://apps.apple.com/app/id6504879567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.5-105.8-207.6-105.8-327.6 0-192.8 125.3-295.2 248.6-295.2 65.5 0 120.1 43 161.2 43s99.8-45.6 177.6-45.6c28.7 0 131.5 2.6 199.4 99.8zm-234-184.5c31.4-37.1 53.6-88.7 53.6-140.3 0-7.1-.6-14.3-1.9-20.1-51.1 1.9-111.9 34-148.4 76.5-27.5 31.4-55.2 83-55.2 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.9 0 103.7-30.7 140.4-71.1z" />
                    </svg>
                    App Store
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FFD900" />
                      <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4CAF50" />
                      <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFD900" />
                      <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3333" />
                    </svg>
                    Google Play
                  </a>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll animation="fade-up" delay={200}>
              <div className="flex justify-center">
                <div className="relative w-[280px] overflow-hidden rounded-[44px] border-4 border-white/10 bg-black shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(72,184,208,0.1)]">
                  <div className="absolute left-1/2 top-0 z-10 h-[30px] w-[110px] -translate-x-1/2 rounded-b-[18px] bg-black" />
                  {hasToriImage ? (
                    <Image src="/app-screenshot.jpeg" alt="PetHealth+ 앱 화면" width={280} height={600} className="w-full rounded-[40px]" />
                  ) : (
                    <div className="flex h-[600px] w-full items-center justify-center rounded-[40px] bg-[#111827] text-sm font-semibold text-white/60">
                      앱 화면 이미지 준비중
                    </div>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0F1A] px-4 py-28 md:py-36">
        <div className="mx-auto max-w-[1100px]">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-14 text-center text-3xl font-extrabold tracking-tight text-white md:text-[2.75rem]">숫자로 보는 PetHealth+</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              { n: '200+', l: '진료 항목 데이터' },
              { n: 'AI', l: '자동 영수증 분석' },
              { n: 'iOS+AOS', l: 'App Store · Play 출시' },
              { n: 'E2E', l: '암호화 보호' }
            ].map((t, i) => (
              <AnimateOnScroll key={t.l} animation="fade-up" delay={i * 100}>
                <div className="rounded-3xl border border-white/[0.06] bg-[#111827] p-9 text-center">
                  <p className="mb-2 bg-gradient-to-r from-[#48B8D0] to-[#C084FC] bg-clip-text text-[40px] font-extrabold text-transparent">{t.n}</p>
                  <p className="text-sm text-white/40">{t.l}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-28 md:py-36">
        <div className="mx-auto max-w-[680px]">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-[#0A0F1A]">자주 묻는 질문</h2>
          </AnimateOnScroll>
          {FAQ_ITEMS.map((faq, i) => (
            <AnimateOnScroll key={faq.question} animation="fade-up" delay={i * 80}>
              <Accordion title={faq.question}>{faq.answer}</Accordion>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <section className="relative bg-[#0A0F1A] px-4 py-28 text-center md:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#48B8D0]/[0.08] blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1100px]">
          <AnimateOnScroll animation="fade-up">
            <h2 className="mb-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-white md:text-[3rem]">
              우리 아이 건강,
              <br />오늘부터 기록하세요
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <p className="mb-10 text-lg text-white/50">영수증 한 장이면 시작할 수 있어요.</p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://apps.apple.com/app/id6504879567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
              >
                <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.5-105.8-207.6-105.8-327.6 0-192.8 125.3-295.2 248.6-295.2 65.5 0 120.1 43 161.2 43s99.8-45.6 177.6-45.6c28.7 0 131.5 2.6 199.4 99.8zm-234-184.5c31.4-37.1 53.6-88.7 53.6-140.3 0-7.1-.6-14.3-1.9-20.1-51.1 1.9-111.9 34-148.4 76.5-27.5 31.4-55.2 83-55.2 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.9 0 103.7-30.7 140.4-71.1z" />
                </svg>
                App Store
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-black/80 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
              >
                <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FFD900" />
                  <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4CAF50" />
                  <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFD900" />
                  <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3333" />
                </svg>
                Google Play
              </a>
              <a href="/ai-care" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                웹에서 먼저 체험
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
