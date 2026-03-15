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
  },
  {
    icon: IconReceipt,
    title: '블로그',
    description: '진료비 절약 팁부터 건강 관리까지, 보호자를 위한 이야기를 모았어요.',
    href: '/blog',
    cta: '블로그 보기'
  }
] as const;

const steps = [
  { step: '01', title: '영수증 찍기', description: '앱에서 영수증을 촬영하면 항목별 비용이 자동으로 정리돼요.', icon: IconCamera },
  { step: '02', title: '데이터가 쌓임', description: '보호자들이 등록할수록 전국 진료비 데이터가 더 정확해져요.', icon: IconReceipt },
  { step: '03', title: '진료비 비교', description: '쌓인 실제 데이터로 우리 아이 진료비가 적정한지 바로 확인!', icon: IconSearch }
] as const;

const appFeatures = [
  { icon: IconReceipt, title: '영수증 OCR', description: '촬영만 하면 항목별 비용이 자동 정리' },
  { icon: IconSparkle, title: 'AI 케어 분석', description: '진료 기록 기반 맞춤 건강 편지' },
  { icon: IconCalendar, title: '접종 스케줄', description: '예방접종·건강검진 일정 알림' },
  { icon: IconLink, title: '보험 청구 패키지', description: '영수증+진단서 → PDF 한 번에' }
] as const;

const AppFeatureIcon = ({ type }: { type: string }) => {
  const cls = "h-10 w-10 rounded-2xl flex items-center justify-center";
  switch (type) {
    case 'receipt':
      return (<div className={`${cls} bg-[#fff3ec]`}><svg className="h-5 w-5 text-[#ff7a45]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg></div>);
    case 'care':
      return (<div className={`${cls} bg-[#eef4ff]`}><svg className="h-5 w-5 text-[#5b8def]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg></div>);
    case 'map':
      return (<div className={`${cls} bg-[#ecfaf0]`}><svg className="h-5 w-5 text-[#34b563]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></div>);
    case 'insurance':
      return (<div className={`${cls} bg-[#f3f0ff]`}><svg className="h-5 w-5 text-[#7c5cfc]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg></div>);
    case 'weight':
      return (<div className={`${cls} bg-[#fff8ec]`}><svg className="h-5 w-5 text-[#e5a030]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg></div>);
    case 'archive':
      return (<div className={`${cls} bg-[#fef2f2]`}><svg className="h-5 w-5 text-[#e55b5b]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg></div>);
    default:
      return null;
  }
};

const appFeaturesExtended = [
  { iconType: 'receipt', title: '영수증 촬영', description: '병원 영수증을 촬영하면 AI가 항목별로 자동 분류해요.' },
  { iconType: 'care', title: 'AI 케어 분석', description: '우리 아이 진료 기록을 바탕으로 건강 상태를 분석하고 케어 방향을 제안해요.' },
  { iconType: 'map', title: '내 근처 동물병원', description: '가까운 동물병원을 지도에서 바로 찾고 길안내까지 받을 수 있어요.' },
  { iconType: 'insurance', title: '보험 청구 패키지', description: '진료 영수증과 진단서를 선택하면 보험 청구용 PDF를 자동으로 만들어줘요.' },
  { iconType: 'weight', title: '체중 기록', description: '우리 아이 체중 변화를 기록하고 성장 그래프로 한눈에 확인해요.' },
  { iconType: 'archive', title: '기록함', description: '검사결과, 접종증명서, 진단서를 사진으로 찍어 한 곳에 보관해요.' },
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
  const appFeatureStagger = useStaggerCards();

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
            비용 걱정은 줄이고, 건강엔 더 집중할 수 있도록.
            <br className="hidden md:block" />
            보호자들이 함께 만들어가는 진료비 데이터로 도와드릴게요.
          </p>
          <div className="mt-9 flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cost-search"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(255,122,69,0.3)] transition hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(255,122,69,0.35)] hover:brightness-[1.03] active:scale-[0.98]"
              >
                진료비 비교하기
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </Link>
              <Link
                href="/pet-talker"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#17191f] transition hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]"
              >
                펫토커
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com/kr/app/pethealth-%ED%8E%AB%ED%97%AC%EC%8A%A4%ED%94%8C%EB%9F%AC%EC%8A%A4/id6758932727"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#17191f] transition hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]"
              >
                <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.5-105.8-207.6-105.8-327.6 0-192.8 125.3-295.2 248.6-295.2 65.5 0 120.1 43 161.2 43s99.8-45.6 177.6-45.6c28.7 0 131.5 2.6 199.4 99.8zm-234-184.5c31.4-37.1 53.6-88.7 53.6-140.3 0-7.1-.6-14.3-1.9-20.1-51.1 1.9-111.9 34-148.4 76.5-27.5 31.4-55.2 83-55.2 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.9 0 103.7-30.7 140.4-71.1z" /></svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.pluslabkorea.pethealth"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#17191f] transition hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]"
              >
                <svg width="14" height="14" viewBox="0 0 512 512" fill="none"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FFD900" /><path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4CAF50" /><path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFD900" /><path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3333" /></svg>
                Google Play
              </a>
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

      {/* App Features — 앱에서 할 수 있는 모든 것 */}
      <Section delay={165}>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#ff7a45]">앱에서 더 많은 것을</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17191f] md:text-4xl">
            건강 기록부터 보험 청구까지,<br className="md:hidden" /> 한 앱에서
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-[1.8] text-[#697182]">
            웹에서 비교하고, 앱에서 기록하세요. 우리 아이 건강의 모든 것을 한 곳에서 관리할 수 있어요.
          </p>
        </div>
        <div ref={appFeatureStagger.ref} className="mt-10 grid gap-4 md:grid-cols-3">
          {appFeaturesExtended.map((feat, idx) => (
            <article
              key={feat.title}
              style={{ animationDelay: appFeatureStagger.isVisible ? `${idx * 100}ms` : '0ms' }}
              className={`rounded-3xl border border-black/[0.04] bg-gradient-to-br from-white to-[#fff9f5] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${appFeatureStagger.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <AppFeatureIcon type={feat.iconType} />
              <p className="mt-3 text-base font-bold text-[#17191f]">{feat.title}</p>
              <p className="mt-1.5 text-sm leading-[1.7] text-[#697182]">{feat.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* App Download CTA */}
      <Section delay={175}>
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#1a1a2e_0%,#2d2b55_60%,#352f5b_100%)] px-6 py-14 md:px-10 md:py-18">
          <div className="text-center">
            <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">PetHealth+ App</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
              사진 한 장이면,
              <br />
              <span className="bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] bg-clip-text text-transparent">기록이 시작</span>돼요
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-[1.8] text-white/60">
              영수증 촬영 한 번이면 항목별 비용이 자동 정리되고,
              <br className="hidden md:block" />
              전국 보호자들의 데이터와 비교할 수 있어요.
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
              href="https://apps.apple.com/app/id6744428830"
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
          영수증 한 장이 모두의 데이터가 됩니다. 앱에서 등록하면 자동으로 정리되고, 전국 비교가 시작돼요.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cost-search"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#ff7a45] shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:scale-[1.02] hover:bg-[#fff8f5] active:scale-[0.98]"
          >
            진료비 비교하기
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
        </div>
      </Section>
    </div>
  );
}
