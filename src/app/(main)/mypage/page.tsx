import type { Metadata } from 'next';

import MyPageClient from '@/app/(main)/mypage/mypage-client';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '내 반려동물 정보와 진료 기록을 한눈에 확인하세요. 진료비 추이와 건강 관리 현황을 관리할 수 있습니다.',
  robots: {
    index: false,
    follow: false
  }
};

export default function MyPage() {
  return <MyPageClient />;
}
