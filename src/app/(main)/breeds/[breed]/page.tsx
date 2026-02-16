import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TrackPageView } from '@/components/analytics/track-page-view';
import { getBreedProfile, getCategoryAverageCost, getPopularBreeds } from '@/lib/condition-tag-map';
import { guideCategoryLabels } from '@/lib/guides';

const toWon = (value: number) => `${value.toLocaleString('ko-KR')}원`;

type BreedPageProps = {
  params: {
    breed: string;
  };
};

export async function generateStaticParams() {
  return getPopularBreeds().map((breed) => ({ breed }));
}

export async function generateMetadata({ params }: BreedPageProps): Promise<Metadata> {
  const breed = decodeURIComponent(params.breed);
  const profile = getBreedProfile(breed);

  if (!profile) {
    return {
      title: '품종 정보를 찾을 수 없어요 | PetHealth+'
    };
  }

  return {
    title: `${profile.breed} 자주 받는 진료 TOP 5 | PetHealth+`,
    description: `${profile.breed} 보호자를 위한 주의 진료 TOP 5와 카테고리 평균 비용 가이드`,
    alternates: {
      canonical: `/breeds/${encodeURIComponent(profile.breed)}`
    },
    openGraph: {
      title: `${profile.breed} 진료 TOP 5`,
      description: `${profile.breed} 품종 맞춤 진료비 가이드`,
      images: [`/api/og?title=${encodeURIComponent(`${profile.breed} 진료 TOP 5`)}&category=breed`]
    }
  };
}

export default function BreedPage({ params }: BreedPageProps) {
  const breed = decodeURIComponent(params.breed);
  const profile = getBreedProfile(breed);

  if (!profile) {
    notFound();
  }

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <TrackPageView eventName="category_view" params={{ category_slug: `breed_${profile.species}` }} />
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/30">
          <Link href="/cost-search" className="text-sm text-[#A36241] hover:text-[#F97316]">
            ← 진료비 검색으로 이동
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-[#4F2A1D]">{profile.breed} 자주 받는 진료 TOP 5</h1>
          <p className="mt-2 text-sm text-[#7C4A2D]">{profile.intro}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {profile.riskTags.map((risk, index) => {
            const averageCost = getCategoryAverageCost(risk.category, profile.species);

            return (
              <article key={risk.condition} className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-[#F8C79F]/30">
                <p className="text-xs font-bold text-[#A36241]">TOP {index + 1}</p>
                <h2 className="mt-2 text-xl font-extrabold text-[#4F2A1D]">{risk.condition}</h2>
                <p className="mt-2 text-sm text-[#7C4A2D]">카테고리: {guideCategoryLabels[risk.category]}</p>
                <p className="mt-1 text-lg font-bold text-[#F97316]">평균 비용 {toWon(averageCost)}</p>
                <p className="mt-3 rounded-2xl bg-[#FFF8F0] p-3 text-sm text-[#7C4A2D]">{risk.careGuide}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl bg-[#4F2A1D] p-6 text-white">
          <h2 className="text-xl font-extrabold">맞춤 케어와 비용 비교를 한 번에 시작해보세요</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/cost-search" className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#4F2A1D]">진료비 검색</Link>
            <Link href="/guides" className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-bold text-white">카테고리 가이드 보기</Link>
            <Link href="/ai-care" className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-bold text-white">AI 견적서</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
