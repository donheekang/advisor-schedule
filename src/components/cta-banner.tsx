import Link from 'next/link';

import { StoreComingSoonButtons } from '@/components/store-coming-soon-buttons';

type CTABannerProps = {
  variant: 'ai-care' | 'app-download' | 'cost-search';
  context?: string;
};

const bannerConfig: Record<'ai-care' | 'cost-search', {
  title: string;
  href: string;
  className: string;
}> = {
  'ai-care': {
    title: '✨ 우리 아이 맞춤 AI 견적서 분석 →',
    href: '/ai-care',
    className: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white'
  },
  'cost-search': {
    title: '💰 진료비도 확인해보세요',
    href: '/cost-search',
    className: 'bg-[#FFF1E4] text-[#4F2A1D] ring-1 ring-[#F8C79F]/40'
  }
};

export function CTABanner({ variant, context }: CTABannerProps) {
  if (variant === 'app-download') {
    return (
      <div data-context={context} className="w-full rounded-2xl bg-[#FFF1E4] px-5 py-4 ring-1 ring-[#F8C79F]/40">
        <p className="mb-3 text-center text-sm font-bold text-[#7C4A2D]">앱 출시 예정</p>
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
      className={'inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-bold shadow-md transition hover:shadow-lg ' + config.className}
    >
      {config.title}
    </Link>
  );
}

export type { CTABannerProps };
