import Link from 'next/link';

type CTABannerProps = {
  variant: 'ai-care' | 'app-download' | 'cost-search';
  context?: string;
};

const APPSTORE_URL = 'https://apps.apple.com/app/id6504879567';

const bannerConfig: Record<CTABannerProps['variant'], {
  title: string;
  href: string;
  external?: boolean;
  className: string;
}> = {
  'ai-care': {
    title: '✨ 우리 아이 맞춤 AI 케어 분석 →',
    href: '/ai-care',
    className: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white'
  },
  'app-download': {
    title: '📱 앱에서 더 자세히',
    href: APPSTORE_URL,
    external: true,
    className: 'bg-[#3D2518] text-white'
  },
  'cost-search': {
    title: '💰 진료비도 확인해보세요',
    href: '/cost-search',
    className: 'bg-[#FFF1E4] text-[#4F2A1D] ring-1 ring-[#F8C79F]/40'
  }
};

export function CTABanner({ variant, context }: CTABannerProps) {
  const config = bannerConfig[variant];

  if (config.external) {
    return (
      <a
        href={config.href}
        target="_blank"
        rel="noopener noreferrer"
        data-context={context}
        className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-bold shadow-md transition hover:shadow-lg ${config.className}`}
      >
        {config.title}
      </a>
    );
  }

  return (
    <Link
      href={config.href}
      data-context={context}
      className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-bold shadow-md transition hover:shadow-lg ${config.className}`}
    >
      {config.title}
    </Link>
  );
}

export type { CTABannerProps };
