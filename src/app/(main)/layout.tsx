import Footer from '@/components/footer';
import Header from '@/components/header';
import MobileNav from '@/components/mobile-nav';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFF8EE] text-slate-900 [font-family:Pretendard,system-ui,sans-serif]">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 md:pb-8">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
