import Script from 'next/script';
import Footer from '@/components/footer';
import Header from '@/components/header';
import MobileNav from '@/components/mobile-nav';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-transparent text-[#17191f]">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 pb-24 md:px-6 md:py-10 md:pb-10">{children}</main>
        <Footer />
        <MobileNav />
      </div>
    </>
  );
}
