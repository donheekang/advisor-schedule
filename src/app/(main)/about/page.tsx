import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개 | PetHealth+ by (주)플러스랩코리아',
  description: 'PetHealth+는 (주)플러스랩코리아가 운영하는 반려동물 보호자를 위한 AI 건강 관리 플랫폼입니다.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '(주)플러스랩코리아',
  alternateName: 'PlusLab Korea',
  url: 'https://pethealthplus.kr',
  logo: 'https://pethealthplus.kr/logo.png',
  description: '반려동물 보호자를 위한 AI 건강 관리 플랫폼 PetHealth+를 운영합니다.',
  foundingDate: '2025',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@pluslabkorea.com',
    contactType: 'customer service',
    availableLanguage: 'Korean',
  },
  owns: {
    '@type': 'WebApplication',
    name: 'PetHealth+',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
  },
};

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '진료비 투명성',
    desc: '전국 동물병원의 실제 진료비 데이터를 수집·분석하여 적정 가격을 비교할 수 있도록 돕습니다.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.607A1.125 1.125 0 0120.107 22H3.893a1.125 1.125 0 01-1.096-1.393L4.2 15.3" />
      </svg>
    ),
    title: 'AI 기반 분석',
    desc: '증상을 입력하면 AI가 예상 질환과 진료비 범위를 분석합니다.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: '보호자 중심 설계',
    desc: '복잡한 의료 용어 대신 쉬운 말로 이해할 수 있는 정보를 제공합니다.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: '건강 기록 관리',
    desc: '영수증 업로드만으로 진료 내역이 자동 정리되고 반려동물별로 히스토리를 관리합니다.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff4f4_100%)] px-6 py-14 shadow-[0_24px_70px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#ff7a45] opacity-[0.06] blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#C084FC] opacity-[0.05] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-[1100px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff7a45]/10 bg-[#ff7a45]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a45]" />
            <span className="text-xs font-medium tracking-wide text-[#697182]">반려동물 AI 건강 관리 플랫폼</span>
          </div>
          <h1 className="mb-3 text-[2.5rem] font-extrabold tracking-tight text-[#17191f] md:text-5xl">
            PetHealth<span className="text-[#ff7a45]">+</span>
          </h1>
          <p className="mb-6 text-lg font-medium text-[#697182]">펫헬스플러스</p>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-[#697182]">
            우리 아이 진료비가 적정한지 궁금했던 적 있으신가요?
            <br />
            그 고민에서 시작된 반려동물 AI 건강 관리 플랫폼입니다.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1100px] px-4 py-20 md:py-28">
        <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-[#191F28] md:text-3xl">
          우리가 하는 일
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-6 shadow-[0_10px_28px_rgba(17,24,39,0.07)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4f0] text-[#ff7a45]">
                {f.icon}
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-[#17191f]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#697182]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company Info */}
      <section className="border-t border-[#F2F4F6] bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-16 md:py-20">
          <h2 className="mb-8 text-xl font-extrabold tracking-tight text-[#191F28]">회사 정보</h2>
          <div className="overflow-hidden rounded-2xl border border-[#F3F4F6]">
            <div className="divide-y divide-[#F3F4F6]">
              {[
                { label: '상호', value: '(주)플러스랩코리아' },
                { label: '서비스명', value: 'PetHealth+' },
                { label: '이메일', value: 'support@pluslabkorea.com' },
              ].map((row) => (
                <div key={row.label} className="flex px-6 py-4">
                  <span className="w-28 shrink-0 text-sm font-medium text-[#8B95A1]">{row.label}</span>
                  <span className="text-sm text-[#191F28]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/cost-search"
              className="inline-flex items-center gap-2 rounded-[14px] bg-[#191F28] px-7 py-4 text-[15px] font-bold text-white transition hover:bg-[#333D4B]"
            >
              진료비 비교해보기
            </Link>
            <div className="text-sm text-[#8B95A1]">
              문의 — <span className="font-medium text-[#191F28]">support@pluslabkorea.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
