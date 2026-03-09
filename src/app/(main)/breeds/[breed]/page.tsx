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
    <section className="w-full rounded-3xl bg-gradient-to-b from-[#f8f4ef] to-[#f4ede2] px-5 py-10 md:px-8 md:py-12">
      <TrackPageView eventName="category_view" params={{ category_slug: `breed_${profile.species}` }} />
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5">
          <Link href="/cost-search" className="text-sm text-[#697182] hover:text-[#ff7a45]">
            ← 진료비 비교로 이동
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-[#17191f]">{profile.breed} 자주 받는 진료 TOP 5</h1>
          <p className="mt-2 text-sm text-[#4f5868]">{profile.intro}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {profile.riskTags.map((risk, index) => {
            const averageCost = getCategoryAverageCost(risk.category, profile.species);

            return (
              <article key={risk.condition} className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
                <p className="text-xs font-bold text-[#697182]">TOP {index + 1}</p>
                <h2 className="mt-2 text-xl font-extrabold text-[#17191f]">{risk.condition}</h2>
                <p className="mt-2 text-sm text-[#4f5868]">카테고리: {guideCategoryLabels[risk.category]}</p>
                <p className="mt-1 text-lg font-bold text-[#ff7a45]">평균 비용 {toWon(averageCost)}</p>
                <p className="mt-3 rounded-2xl bg-[#f8f4ef] p-3 text-sm text-[#4f5868]">{risk.careGuide}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl bg-[linear-gradient(130deg,#ff7a45_0%,#ce7a4e_58%,#17191f_120%)] p-6 text-white">
          <h2 className="text-xl font-extrabold">맞춤 케어와 비용 비교를 한 번에 시작해보세요</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/cost-search" className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#17191f]">진료비 비교</Link>
            <Link href="/guides" className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-bold text-white">카테고리 가이드 보기</Link>
            <Link href="/pet-talker" className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-bold text-white">펫토커</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
