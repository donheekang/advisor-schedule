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
  keywords: ['반려동물', '진료비', '동물병원', '가격비교', '펫헬스플러스'],
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
        url: 'https://pethealthplus.kr/og/default.png',
        width: 1200,
        height: 630,
        alt: '펫헬스플러스 반려동물 진료비 데이터 플랫폼'
      }
    ]
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#F8FAFB] text-[#1B3A4B] antialiased">
        <AuthProvider>{children}</AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
