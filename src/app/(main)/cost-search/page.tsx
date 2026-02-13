import type { Metadata } from 'next';

import CostSearchClient from '@/app/(main)/cost-search/cost-search-client';

export const metadata: Metadata = {
  title: '진료비 검색 | PetHealth+',
  description:
    '반려동물 진료 항목별 가격 범위와 지역 평균을 확인하고 AI 비용 분석으로 상세 항목을 비교해보세요.',
};

export default function CostSearchPage() {
  return <CostSearchClient />;
}
