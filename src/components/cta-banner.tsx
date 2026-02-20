import Link from 'next/link';

type CTABannerProps = {
  variant: 'ai-care' | 'app-download' | 'cost-search';
  context?: string;
};

const bannerConfig: Record<CTABannerProps['variant'], {
  title: string;
  href?: string;
  className: string;
}> = {
  'ai-care': {
    title: '✨ 우리 아이 맞춤 AI 견적서 분석 →',
    href: '/ai-care',
    className: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white'
  },
  'app-download': {
    title: '📱 앱 출시 예정',
    className: 'cursor-not-allowed select-none bg-[#0B3041]/5 text-[#0B3041]/40'
  },
  'cost-search': {
    title: '💰 진료비도 확인해보세요',
    href: '/cost-search',
    className: 'bg-[#FFF1E4] text-[#4F2A1D] ring-1 ring-[#F8C79F]/40'
  }
};

export function CTABanner({ variant, context }: CTABannerProps) {
  const config = bannerConfig[variant];

  if (!config.href) {
    return (
      <div
        data-context={context}
        className={'inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-bold shadow-md ' + config.className}
      >
        {config.title}
      </div>
    );
  }

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
