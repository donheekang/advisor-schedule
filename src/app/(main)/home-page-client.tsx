'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

type HomePageClientProps = {
  faqItems: readonly FaqItem[];
};

/* ───────── animation hooks ───────── */

function useFadeInSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function useStaggerCards() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current as HTMLElement | null;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function Section({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useFadeInSection();

  return (
    <section
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`fade-section ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

function CountUpNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const startTime = performance.now();

    const frame = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [started, target]);

  return (
    <p ref={ref} className="mt-2 text-4xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,122,69,0.3)] md:text-5xl">
      {count.toLocaleString('ko-KR')}{suffix}
    </p>
  );
}

/* ───────── SVG icons ───────── */

function IconReceipt({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Z" />
      <path d="M8 10h8M8 14h4" />
    </svg>
  );
}

function IconScale({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M3 7l4 6h10l4-6" />
      <circle cx="7" cy="13" r="3" />
      <circle cx="17" cy="13" r="3" />
    </svg>
  );
}

function IconCalendar({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconChat({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
      <path d="M9 9h6M9 12h3" />
    </svg>
  );
}

function IconSearch({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
      <path d="M8 11h6M11 8v6" />
    </svg>
  );
}

function IconSparkle({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m5 17 .8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8L5 17Z" />
    </svg>
  );
}

function IconCamera({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}


function IconLink({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ───────── data ───────── */

const painPoints = [
  {
    icon: IconReceipt,
    title: '서랍 속 영수증',
    description: '병원 다녀온 뒤 비용은 기억 안 나고, 영수증만 쌓여가요.'
  },
  {
    icon: IconScale,
    title: '이게 적정가인가?',
    description: '같은 항목인데 병원마다 다른 가격, 기준을 몰라 불안해요.'
  },
  {
    icon: IconCalendar,
    title: '접종일 또 잊었다',
    description: '매번 챙겨주고 싶은데, 바쁜 하루에 자꾸 놓치게 돼요.'
  }
] as const;

const features = [
  {
    icon: IconSparkle,
    title: '진료비',
    description: '우리 아이 상태에 맞는 예상 비용, 미리 알면 마음이 놓여요.',
    href: '/ai-care',
    cta: '진료비 확인하기'
  },
  {
    icon: IconSearch,
    title: '진료비 비교',
    description: '전국 데이터로 확인하면, 병원 앞에서의 불안이 줄어들어요.',
    href: '/cost-search',
    cta: '진료비 비교하기'
  },
  {
    icon: IconChat,
    title: '펫토커',
    description: '오늘 우리 아이 표정, 어떤 마음일까요? 사진 한 장이면 알 수 있어요.',
    href: '/pet-talker',
    cta: '펫토커 해보기'
  }
] as const;

const steps = [
  { step: '01', title: '비용부터 확인', description: '진료 항목을 검색하면 전국 평균 가격을 바로 보여드려요.', icon: IconSearch },
  { step: '02', title: 'AI가 분석', description: '품종·나이·증상을 입력하면 예상 비용과 케어 포인트를 정리해줘요.', icon: IconSparkle },
  { step: '03', title: '기록은 앱으로', description: '영수증만 찍으면 자동 정리. 다음 진료 때 비교 데이터가 돼요.', icon: IconCamera }
] as const;

const appFeatures = [
  { icon: IconReceipt, title: '영수증 OCR', description: '촬영만 하면 항목별 비용이 자동 정리' },
  { icon: IconCalendar, title: '접종 스케줄', description: '예방접종·건강검진 일정 알림' },
  { icon: IconScale, title: '체중 기록', description: '성장 추이를 그래프로 한눈에' },
  { icon: IconLink, title: '기록함', description: '검사결과·증명서를 한 곳에 보관' }
] as const;

const reviews = [
  {
    author: '강아지 보호자 김○○',
    breed: '포메라니안 · 3살',
    review: '병원에서 받은 비용이 평균보다 높은지 바로 확인할 수 있어서 안심됐어요. 다음 병원 갈 때도 꼭 쓸 거예요.'
  },
  {
    author: '고양이 보호자 이○○',
    breed: '러시안블루 · 5살',
    review: '영수증 업로드 후 항목별로 정리돼서 다음 진료 계획 세우기가 쉬워졌어요. 정말 유용합니다.'
  },
  {
    author: '강아지 보호자 박○○',
    breed: '말티즈 · 2살',
    review: '펫토커로 사진 올리는 게 재미있어서 자주 쓰게 되고, 진료비 비교는 이제 필수예요!'
  }
] as const;

/* ───────── component ───────── */

export default function HomePageClient({ faqItems }: HomePageClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const painStagger = useStaggerCards();
  const featureStagger = useStaggerCards();
  const stepStagger = useStaggerCards();
  const reviewStagger = useStaggerCards();

  return (
    <div className="space-y-20 md:space-y-24">
      {/* Hero */}
      <Section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f5_40%,#fff0ea_100%)] px-6 py-16 shadow-[0_24px_70px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-12 md:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ff7a45]/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-[#f3caa8]/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="inline-block rounded-full bg-[#ff7a45]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#ff7a45]">PetHealth+</p>
          <h1 className="mt-6 text-[2.2rem] font-bold leading-[1.25] tracking-tight text-[#17191f] md:text-[3.4rem]">
            우리 아이가 아플 때,
            <br />
            <span className="bg-[linear-gradient(135deg,#ff7a45,#e85d26)] bg-clip-text text-transparent">가장 먼저 드는 생각</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-[#4f5868] md:text-lg">
            비용 걱정은 줄이고, 건강엔 더 집중할 수 있도록
            <br className="hidden md:block" />
            도와드릴게요.
          </p>
          <div className="mt-9 flex flex-col gap-3">
            <Link
              href="/ai-care"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(255,122,69,0.3)] transition hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(255,122,69,0.35)] hover:brightness-[1.03] active:scale-[0.98]"
            >
              진료비 확인하기
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </Link>
            <div className="flex gap-3">
              <Link
                href="/cost-search"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#17191f] transition hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]"
              >
                진료비 비교
              </Link>
              <Link
                href="/pet-talker"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#17191f] transition hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]"
              >
                펫토커
              </Link>
            </div>
          </div>
          <p className="mt-5 text-xs font-medium text-[#8a92a3]">* 의료 진단이 아닌 진료비 비교 및 정보 제공 목적의 서비스입니다</p>
        </div>
      </Section>

      {/* Pain Points — 보호자의 마음 */}
      <Section delay={60}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">보호자라면 누구나</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">한 번쯤 이런 마음이었을 거예요</h2>
        </div>
        <div ref={painStagger.ref} className="mt-10 grid gap-4 md:grid-cols-3">
          {painPoints.map((item, idx) => (
            <article
              key={item.title}
              style={{ animationDelay: painStagger.isVisible ? `${idx * 120}ms` : '0ms' }}
              className={`rounded-3xl border border-black/[0.04] bg-gradient-to-br from-white to-[#fff9f5] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${painStagger.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff7a45]/10 text-[#ff7a45]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-lg font-bold text-[#17191f]">{item.title}</p>
              <p className="mt-2 text-sm leading-[1.8] text-[#697182]">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm leading-relaxed text-[#4f5868]">펫헬스플러스는 이런 마음을 알기에,<br className="md:hidden" /> <span className="font-bold text-[#ff7a45]">데이터로 도와드려요</span></p>
        </div>
      </Section>

      {/* Features */}
      <Section aria-labelledby="feature-heading" delay={80}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">함께하는 방법</p>
          <h2 id="feature-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            우리가 도울 수 있는 것들
          </h2>
        </div>
        <div ref={featureStagger.ref} className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group"
              style={{ animationDelay: featureStagger.isVisible ? `${idx * 120}ms` : '0ms' }}
            >
              <article className={`flex h-full flex-col rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(17,24,39,0.05)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(255,122,69,0.12)] ${featureStagger.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] text-white shadow-[0_4px_12px_rgba(255,122,69,0.25)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-lg font-bold text-[#17191f]">{feature.title}</p>
                <p className="mt-2 flex-1 text-sm leading-[1.8] text-[#697182]">{feature.description}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-bold text-[#ff7a45]">
                  <span className="transition-transform group-hover:translate-x-0.5">{feature.cta}</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Section>

      {/* Trust Data */}
      <Section aria-labelledby="data-heading" delay={100}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">함께하는 보호자들</p>
          <h2 id="data-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            많은 보호자들이 함께하고 있어요
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl bg-[linear-gradient(150deg,#2a1c16_0%,#3f2a20_62%,#4b3125_100%)] p-8 text-white">
            <p className="text-xs font-medium text-white/70">누적 진료 기록</p>
            <CountUpNumber target={128540} suffix="+" />
            <p className="mt-3 text-xs leading-relaxed text-white/50">보호자들이 함께 쌓아온 진료 기록</p>
          </article>
          <article className="rounded-3xl bg-[linear-gradient(150deg,#2a1c16_0%,#3f2a20_62%,#4b3125_100%)] p-8 text-white">
            <p className="text-xs font-medium text-white/70">평균 업데이트 주기</p>
            <p className="mt-2 text-4xl font-semibold drop-shadow-[0_0_20px_rgba(255,122,69,0.3)] md:text-5xl">주 1회</p>
            <p className="mt-3 text-xs leading-relaxed text-white/50">항상 최신 가격 데이터 유지</p>
          </article>
          <article className="rounded-3xl bg-[linear-gradient(150deg,#2a1c16_0%,#3f2a20_62%,#4b3125_100%)] p-8 text-white">
            <p className="text-xs font-medium text-white/70">비교 가능 카테고리</p>
            <p className="mt-2 text-xl font-semibold leading-relaxed">증상 · 검사 · 수술 · 약 · 보험</p>
            <p className="mt-3 text-xs leading-relaxed text-white/50">5가지 카테고리 완벽 지원</p>
          </article>
        </div>
      </Section>

      {/* Steps / Funnel */}
      <Section aria-labelledby="funnel-heading" delay={120}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">간단한 시작</p>
          <h2 id="funnel-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            시작은 아주 간단해요
          </h2>
        </div>
        <ol ref={stepStagger.ref} className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((item, idx) => (
            <li
              key={item.step}
              style={{ animationDelay: stepStagger.isVisible ? `${idx * 120}ms` : '0ms' }}
              className={`relative rounded-3xl bg-gradient-to-br from-[#fff9f5] to-[#fff0ea] p-8 ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${stepStagger.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7a45]/[0.08] text-[#ff7a45]">
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-xs font-bold tracking-[0.15em] text-[#ff7a45]">STEP {item.step}</span>
              </div>
              <p className="mt-4 text-xl font-bold text-[#17191f]">{item.title}</p>
              <p className="mt-2 text-sm leading-[1.8] text-[#697182]">{item.description}</p>
              {idx < steps.length - 1 ? (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#ff7a45]/30 md:block">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3l7 7-7 7" /></svg>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      {/* Reviews */}
      <Section aria-labelledby="review-heading" delay={140}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">함께하는 이야기</p>
          <h2 id="review-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            보호자들의 이야기
          </h2>
        </div>
        <div ref={reviewStagger.ref} className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((item, idx) => (
            <blockquote
              key={item.author}
              style={{ animationDelay: reviewStagger.isVisible ? `${idx * 120}ms` : '0ms' }}
              className={`rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(17,24,39,0.05)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-0.5 ${reviewStagger.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <div className="flex gap-0.5 text-[#ff7a45]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-1 text-3xl leading-none text-[#ff7a45]/15">&ldquo;</p>
              <p className="mt-1 text-sm leading-[1.8] text-[#4f5868]">{item.review}</p>
              <footer className="mt-5 border-t border-black/5 pt-3">
                <p className="text-sm font-bold text-[#17191f]">{item.author}</p>
                <p className="text-xs text-[#8a92a3]">{item.breed}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section aria-labelledby="faq-heading" delay={160}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">궁금한 점</p>
          <h2 id="faq-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            자주 묻는 질문
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <article key={item.question} className={`rounded-2xl p-5 ring-1 ring-black/[0.04] transition hover:shadow-sm ${isOpen ? 'bg-[#fff9f5]' : 'bg-white'}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setOpenFaqIndex((prev) => (prev === index ? null : index))}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-[#17191f]">{item.question}</span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300 ${isOpen ? 'rotate-45 bg-[#ff7a45] text-white' : 'bg-black/[0.04] text-[#697182]'}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-[1.8] text-[#697182]">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* App Features — 앱으로 기록하세요 */}
      <Section delay={170}>
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#1a1a2e_0%,#2d2b55_60%,#352f5b_100%)] px-6 py-14 md:px-10 md:py-18">
          <div className="text-center">
            <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">PetHealth+ App</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
              웹에서 비교하고,
              <br />
              <span className="bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] bg-clip-text text-transparent">앱으로 기록</span>하세요
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.8] text-white/60">
              우리 아이 건강 기록 사진 한 장이면 끝
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {appFeatures.map((feat) => (
              <article key={feat.title} className="flex items-start gap-4 rounded-2xl bg-white/[0.06] p-5 backdrop-blur-sm transition hover:bg-white/[0.1]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff7a45]/20 text-[#ff9b5e]">
                  <feat.icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{feat.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{feat.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="https://apps.apple.com"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#1a1a2e] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:bg-[#fff8f5] active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
              App Store
            </Link>
            <Link
              href="https://play.google.com/store"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" /></svg>
              Google Play
            </Link>
          </div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ff7a45_0%,#e85d26_50%,#d14b1a_100%)] px-6 py-16 text-center text-white md:px-10 md:py-20" delay={190}>
        <p className="text-sm font-semibold text-white/70">우리 아이를 위한 작은 시작</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">진료비 걱정 대신,<br className="md:hidden" /> 건강에 집중하는 하루</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.8] text-white/80">
          전국 데이터 기반 비교부터 AI 맞춤 진료비 분석까지, 진료비 고민 여기서 끝.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/ai-care"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#ff7a45] shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:scale-[1.02] hover:bg-[#fff8f5] active:scale-[0.98]"
          >
            진료비 확인하기
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
          <Link
            href="/cost-search"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
          >
            진료비 비교하기
          </Link>
        </div>
      </Section>
    </div>
  );
}
