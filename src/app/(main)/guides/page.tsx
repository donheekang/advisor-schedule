import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllGuides, guideCategoryLabels } from '@/lib/guides';

export const metadata: Metadata = {
  title: '반려동물 진료비 가이드 모음 | PetHealth+',
  description: '진찰료, 예방접종, 수술, 투약까지 카테고리별 반려동물 진료비 가이드를 한 번에 확인하세요.',
  openGraph: {
    title: '반려동물 진료비 가이드 모음',
    description: '카테고리별 진료비 가이드를 한 페이지에서 확인하세요.',
    images: ['/api/og?title=%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC%20%EC%A7%84%EB%A3%8C%EB%B9%84%20%EA%B0%80%EC%9D%B4%EB%93%9C&category=guides']
  }
};

export default async function GuidesIndexPage() {
  const guides = await getAllGuides();

  const grouped = guides.reduce<Record<string, typeof guides>>((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {});

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">반려동물 진료비 가이드 모음</h1>
          <p className="text-sm text-[#7C4A2D] md:text-base">카테고리별 최신 가이드를 보고 우리 아이 진료비를 미리 계획해보세요.</p>
        </header>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#4F2A1D]">{guideCategoryLabels[category as keyof typeof guideCategoryLabels]}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-[#F8C79F]/30 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="inline-flex rounded-full bg-[#FFF0E6] px-3 py-1 text-xs font-bold text-[#7C4A2D]">
                    {guideCategoryLabels[guide.category]}
                  </span>
                  <h3 className="mt-3 text-lg font-extrabold text-[#4F2A1D]">{guide.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[#A36241]">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
