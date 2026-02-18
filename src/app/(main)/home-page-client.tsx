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

const features = [
  {
    emoji: '🗣',
    title: '펫토커',
    description: '사진 한 장으로 우리 아이의 마음을 들어보세요',
    href: '/pet-talker',
    cta: '해보기 →'
  },
  {
    emoji: '💰',
    title: '진료비 검색',
    description: '전국 평균과 비교해서 적정 가격을 확인하세요',
    href: '/cost-search',
    cta: '해보기 →'
  },
  {
    emoji: '📊',
    title: 'AI 분석',
    description: '영수증을 올리면 항목별로 자동 분석해줘요',
    href: '/cost-search',
    cta: '해보기 →'
  }
] as const;

const steps = [
  {
    title: '우리 아이 정보를 선택해요',
    description: '반려동물 종류와 진료 항목을 선택하면 맞춤 데이터를 준비해요.'
  },
  {
    title: '진료비를 비교하고 확인해요',
    description: '전국 평균과 현재 비용을 비교해 합리적인 가격인지 확인해요.'
  },
  {
    title: '펫토커와 AI 분석으로 관리해요',
    description: '감성 대화와 영수증 분석까지 한 번에 연결해 꾸준히 기록해요.'
  }
] as const;

const reviews = [
  {
    author: '강아지 보호자 김○○',
    review: '펫토커로 우리 아이 상태를 더 자주 확인하게 됐고, 진료비도 객관적으로 볼 수 있어요.'
  },
  {
    author: '고양이 보호자 이○○',
    review: '영수증만 올리면 항목별 분석이 돼서 다음 진료 계획을 세우기 훨씬 쉬워졌어요.'
  }
] as const;

function useFadeInSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useFadeInSection();

  return (
    <section
      ref={ref}
      className={`translate-y-4 opacity-0 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

function CountUpNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

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
    if (!started) {
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const frame = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [started, target]);

  return (
    <p ref={ref} className="mt-2 text-5xl font-extrabold tracking-tight text-[#48B8D0] md:text-6xl">
      {count.toLocaleString('ko-KR')}건
    </p>
  );
}

export default function HomePageClient({ faqItems }: HomePageClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [totalItems, setTotalItems] = useState(128540);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const response = await fetch('/api/cost-search/stats', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { totalItems?: number };
        if (isMounted && typeof data.totalItems === 'number' && data.totalItems > 0) {
          setTotalItems(data.totalItems);
        }
      } catch {
        // keep default badge number
      }
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 md:p-8">
      <Section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFE9D2] via-[#FFD5AE] to-[#FFC38A] px-6 py-16 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FDBA74]/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-12 h-56 w-56 rounded-full bg-[#FB923C]/30 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-white/75 px-4 py-1 text-sm font-semibold text-[#9A3412]">
            🐾 반려동물 보호자를 위한 AI 플랫폼
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#7C2D12] md:text-5xl">우리 아이 진료비, 적정한 걸까?</h1>
          <p className="mt-5 text-lg text-[#7C2D12]/80 md:text-xl">진료비 비교부터 AI 펫토커까지, 우리 아이를 위한 모든 것</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ai-care"
              className="rounded-xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-6 py-3 text-base font-extrabold text-white shadow-lg shadow-[#48B8D0]/30 transition hover:brightness-105"
            >
              ✨ 무료 AI 견적서 →
            </Link>
            <Link
              href="/pet-talker"
              className="rounded-xl bg-[#48B8D0] px-6 py-3 text-base font-bold text-white transition hover:bg-[#48B8D0]"
            >
              🗣 펫토커 해보기
            </Link>
            <Link
              href="/cost-search"
              className="rounded-xl border-2 border-[#48B8D0] bg-white px-6 py-3 text-base font-bold text-[#C2410C] transition hover:bg-[#FFF7ED]"
            >
              💰 진료비 검색
            </Link>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold text-[#7C2D12] md:text-3xl">
          이런 걸 할 수 있어요
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-4xl">{feature.emoji}</p>
              <h3 className="mt-4 text-xl font-bold text-[#7C2D12]">{feature.title}</h3>
              <p className="mt-3 text-[#7C2D12]/75">{feature.description}</p>
              <Link href={feature.href} className="mt-5 inline-flex text-sm font-semibold text-[#48B8D0]">
                {feature.cta}
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-2xl font-bold text-[#7C2D12] md:text-3xl">
          3단계로 시작하세요
        </h2>
        <ol className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl bg-[#FFF6EA] p-6 shadow-sm">
              <div className="md:flex md:items-start md:gap-5">
                <p className="text-5xl font-extrabold text-[#48B8D0]/20">{index + 1}</p>
                <div className="mt-2 md:mt-1">
                  <p className="text-lg font-bold text-[#7C2D12]">{step.title}</p>
                  <p className="mt-2 text-[#7C2D12]/70">{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-2xl font-bold text-[#7C2D12] md:text-3xl">
          신뢰 데이터 & 보호자 후기
        </h2>
        <div className="mt-6 rounded-3xl bg-brand-navyDark px-6 py-8 text-white">
          <p className="text-sm text-slate-200">누적 진료비 데이터</p>
          <CountUpNumber target={totalItems} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {reviews.map((item) => (
            <blockquote key={item.author} className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-[#F59E0B]">⭐⭐⭐⭐⭐</p>
              <p className="mt-3 text-brand-textSecondary">“{item.review}”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-500">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </Section>

      <Section className="rounded-3xl bg-gradient-to-r from-[#48B8D0] via-[#FB923C] to-[#FDBA74] px-6 py-12 text-center text-white md:px-10">
        <h2 className="text-2xl font-bold md:text-3xl">우리 아이 건강 관리, 지금 시작하세요 🐾</h2>
        <p className="mt-3 text-[#FFF3E6]">앱에서 진료 기록을 쌓을수록 우리 아이 맞춤 비교가 정교해집니다.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="https://apps.apple.com" className="rounded-xl bg-white px-5 py-3 font-bold text-[#C2410C] transition hover:bg-[#FFF7ED]">
            App Store 다운로드
          </Link>
          <Link
            href="https://play.google.com/store"
            className="rounded-xl border border-white/60 px-5 py-3 font-bold text-white transition hover:bg-[#48B8D0]"
          >
            Google Play 다운로드
          </Link>
        </div>
      </Section>

      <Section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-[#7C2D12] md:text-3xl">
          자주 묻는 질문
        </h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <article key={item.question} className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setOpenFaqIndex((prev) => (prev === index ? null : index))}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[#7C2D12]">{item.question}</span>
                  <span className="text-[#48B8D0]">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="mt-3 text-sm text-[#7C2D12]/75">{item.answer}</p>}
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
