import type { Metadata } from 'next';
import '@/app/globals.css';
import { AuthProvider } from '@/components/auth-provider';

const siteName = 'PetHealth+';
const siteDescription = '반려동물 진료비 데이터를 검색하고 비교해 합리적인 의료비 결정을 돕는 데이터 플랫폼입니다.';

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
    default: '펫헬스플러스 | 반려동물 진료비 데이터 플랫폼',
    template: '%s | 펫헬스플러스'
  },
  description: siteDescription,
  keywords: ['반려동물', '진료비', '동물병원', '진료비비교', '펫헬스플러스', '강아지 진료비', '고양이 진료비', '동물병원 비용', 'AI 펫토커'],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: '펫헬스플러스 | 반려동물 진료비 데이터 플랫폼',
    description: '앱에서 기록한 반려동물 진료 데이터를 기반으로 진료비 정보를 검색하고 비교할 수 있습니다.',
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
    title: '펫헬스플러스 | 반려동물 진료비 데이터 플랫폼',
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-transparent text-[#17191f] antialiased">
        <AuthProvider>{children}</AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
