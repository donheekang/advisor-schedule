import Footer from '@/components/footer';
import Header from '@/components/header';
import MobileNav from '@/components/mobile-nav';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#1B3A4B] [font-family:Pretendard,system-ui,sans-serif]">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 md:pb-8">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
