import type { Metadata } from 'next';
import '@/app/globals.css';
import { AuthProvider } from '@/components/auth-provider';

const siteName = 'PetHealth+';
const siteDescription = '우리 아이 진료비가 적정한지 궁금하셨나요? 전국 실제 데이터로 비교하고, 앱으로 건강 기록까지 한 번에 관리하세요.';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: 'https://pethealthplus.kr',
  logo: 'https://pethealthplus.kr/og/logo.png',
  sameAs: ['https://www.instagram.com', 'https://blog.naver.com']
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pethealthplus.kr'),
  title: {
    default: '펫헬스플러스 | 우리 아이 진료비 비교 & 건강 관리',
    template: '%s | 펫헬스플러스'
  },
  description: siteDescription,
  keywords: ['반려동물', '진료비', '동물병원', '진료비비교', '펫헬스플러스', '강아지 진료비', '고양이 진료비', '동물병원 비용', 'AI 펫토커', '반려동물 건강관리', '동물병원 영수증', '반려동물 보험'],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: '펫헬스플러스 | 우리 아이 진료비 비교 & 건강 관리',
    description: '우리 아이 진료비가 적정한지 궁금하셨나요? 전국 실제 데이터로 비교하고, 앱으로 건강 기록까지 한 번에 관리하세요.',
    url: 'https://pethealthplus.kr',
    siteName,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: '펫헬스플러스 반려동물 진료비 데이터 플랫폼'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '펫헬스플러스 | 우리 아이 진료비 비교 & 건강 관리',
    description: siteDescription,
    images: ['/og/default.png']
  },
  verification: {
    google: 'GOOGLE_SITE_VERIFICATION_CODE'
  },
  other: {
    'naver-site-verification': 'NAVER_SITE_VERIFICATION_CODE'
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#F97316" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-transparent text-[#17191f] antialiased">
        <AuthProvider>{children}</AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
