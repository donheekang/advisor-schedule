export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  category: string;
  tags: string[];
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'gangaji-jinryobi-checklist',
    title: '강아지 진료비 확인 체크리스트: 진료 전 꼭 확인할 5가지',
    description:
      '강아지 진료 전 비용을 합리적으로 점검하는 방법을 소개합니다. 지역 평균, 진료 항목, 재진 비용까지 한 번에 확인하세요.',
    publishedAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-01-10T09:00:00.000Z',
    authorName: 'PetHealth+ 콘텐츠팀',
    category: '진료비 가이드',
    tags: ['강아지 진료비', '동물병원 비용', '반려견 건강관리'],
    content: [
      '강아지 진료비는 병원 위치, 진료 항목, 검사 유무에 따라 차이가 큽니다. 진료 전에 예상 범위를 확인하면 보호자의 불안을 줄일 수 있습니다.',
      '초진과 재진 비용은 분리해서 확인하는 것이 좋습니다. 같은 항목이라도 재진 시 검사 항목이 달라질 수 있기 때문입니다.',
      '예방접종, 피부질환, 소화기 질환처럼 자주 발생하는 항목은 평균 데이터를 참고해 비교하는 습관이 중요합니다.'
    ]
  },
  {
    slug: 'goyangi-jinryobi-hospital-compare',
    title: '고양이 진료비 병원 비교 방법: 항목별 평균 데이터 보는 법',
    description:
      '고양이 진료비를 비교할 때 꼭 봐야 하는 항목별 평균 데이터와 비용 편차 확인 방법을 안내합니다.',
    publishedAt: '2026-01-24T09:00:00.000Z',
    updatedAt: '2026-01-24T09:00:00.000Z',
    authorName: 'PetHealth+ 데이터랩',
    category: '데이터 분석',
    tags: ['고양이 진료비', '진료비 비교', '반려묘 병원비'],
    content: [
      '고양이는 스트레스 요인으로 내원 빈도가 달라질 수 있어, 단순 평균만으로 판단하기 어렵습니다. 항목별 분포를 함께 확인해야 합니다.',
      '동일 항목이라도 지역별 가격 차이가 존재합니다. 생활권 기준으로 평균과 상위 구간을 함께 보는 것이 현실적입니다.',
      '진료 기록을 누적하면 우리 아이에게 자주 발생하는 항목을 파악할 수 있어 장기적인 의료비 관리에 도움이 됩니다.'
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
