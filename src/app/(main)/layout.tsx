import Script from 'next/script';
import { Footer } from '@/components/footer';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Navbar } from '@/components/navbar';
import { AuthProvider } from '@/lib/auth-context';

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
      <div className="flex min-h-screen flex-col bg-[#FFF8F0]">
        <AuthProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
        </AuthProvider>
      </div>
    </>
  );
}
