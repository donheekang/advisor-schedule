import Link from 'next/link';
import { StoreComingSoonButtons } from '@/components/store-coming-soon-buttons';

type CTABannerProps = {
  variant: 'ai-care' | 'app-download' | 'cost-search';
  context?: string;
};

const bannerConfig: Record<
  'ai-care' | 'cost-search',
  { title: string; href: string; className: string }
> = {
  'ai-care': {
    title: 'AI 견적서 분석 →',
    href: '/ai-care',
    className: 'bg-[#191F28] text-white hover:bg-[#333D4B]',
  },
  'cost-search': {
    title: '진료비 검색 →',
    href: '/cost-search',
    className: 'border-[1.5px] border-[#E5E8EB] bg-white text-[#191F28] hover:border-[#CBD5E1]',
  },
};

export function CTABanner({ variant, context }: CTABannerProps) {
  if (variant === 'app-download') {
    return (
      <div data-context={context} className="w-full rounded-[14px] bg-[#F8FAFB] px-5 py-4">
        <p className="mb-3 text-center text-sm font-bold text-[#191F28]">앱 출시 예정</p>
        <div className="flex justify-center">
          <StoreComingSoonButtons tone="light" />
        </div>
      </div>
    );
  }

  const config = bannerConfig[variant];

  return (
    <Link
      href={config.href}
      data-context={context}
      className={
        'inline-flex w-full items-center justify-center rounded-[14px] px-5 py-[17px] text-[15px] font-bold transition ' +
        config.className
      }
    >
      {config.title}
    </Link>
  );
}

export type { CTABannerProps };
