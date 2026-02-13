import type { Metadata } from 'next';

import PremiumClient from '@/app/(main)/premium/premium-client';

export const metadata: Metadata = {
  title: '프리미엄 구독 | PetHealthPlus',
  description: '프리미엄 구독으로 진료비 분석 기능을 무제한으로 사용해 보세요.'
};

export default function PremiumPage() {
  return <PremiumClient />;
}
