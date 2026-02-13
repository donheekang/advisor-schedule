import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pethealthplus.kr'),
  title: {
    default: '펫헬스플러스 | 반려동물 진료비 데이터 플랫폼',
    template: '%s | 펫헬스플러스'
  },
  description:
    '반려동물 진료비 데이터를 검색하고 비교해 합리적인 의료비 결정을 돕는 데이터 플랫폼입니다.',
  keywords: ['반려동물', '진료비', '동물병원', '가격비교', '펫헬스플러스'],
  openGraph: {
    title: '펫헬스플러스 | 반려동물 진료비 데이터 플랫폼',
    description:
      '앱에서 기록한 반려동물 진료 데이터를 기반으로 진료비 정보를 검색하고 비교할 수 있습니다.',
    locale: 'ko_KR',
    type: 'website'
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
