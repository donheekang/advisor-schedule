import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides, guideCategoryLabels } from '@/lib/guides';

export const metadata: Metadata = {
  title: '반려동물 진료비 가이드 모음 | PetHealth+',
  description:
    '진찰료, 예방접종, 수술, 투약까지 카테고리별 반려동물 진료비 가이드를 한 번에 확인하세요.',
  openGraph: {
    title: '반려동물 진료비 가이드 모음',
    description: '카테고리별 진료비 가이드를 한 페이지에서 확인하세요.',
    images: [
      '/api/og?title=%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC%20%EC%A7%84%EB%A3%8C%EB%B9%84%20%EA%B0%80%EC%9D%B4%EB%93%9C&category=guides',
    ],
  },
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
    <section className="w-full bg-white pb-10 pt-24 md:pt-28">
      <div className="mx-auto w-full max-w-lg px-5">
        <header className="border-b-8 border-[#F2F4F6] pb-6">
          <h1 className="mb-1 text-[22px] font-extrabold tracking-tight text-[#191F28]">
            진료비 가이드
          </h1>
          <p className="text-sm text-[#8B95A1]">
            카테고리별 최신 가이드를 보고 진료비를 미리 계획해보세요
          </p>
        </header>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="border-b-8 border-[#F2F4F6] py-6">
            <h2 className="mb-4 text-[17px] font-bold text-[#191F28]">
              {guideCategoryLabels[category as keyof typeof guideCategoryLabels]}
            </h2>
            <div className="space-y-3">
              {items.map((guide) => (
                <Link
                  key={guide.slug}
                  href={'/guides/' + guide.slug}
                  className="block rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white p-4 transition hover:border-[#CBD5E1]"
                >
                  <h3 className="text-[15px] font-bold text-[#191F28]">{guide.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#8B95A1]">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
