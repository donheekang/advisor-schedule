import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TrackPageView } from '@/components/analytics/track-page-view';
import { GuideCtaButtons } from '@/components/analytics/guide-cta-buttons';
import { getAllGuides, getGuideBySlug, getGuidesByCategory, guideCategoryLabels } from '@/lib/guides';

type GuidePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: '가이드를 찾을 수 없어요 | PetHealth+',
      description: '요청하신 가이드를 찾을 수 없어요.'
    };
  }

  const ogTitle = encodeURIComponent(guide.title);

  return {
    title: `${guide.title} | 반려동물 진료비 가이드`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `/guides/${guide.slug}`
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://pethealthplus.kr/guides/${guide.slug}`,
      locale: 'ko_KR',
      type: 'article',
      images: [`/api/og?title=${ogTitle}&category=${guide.category}`]
    }
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = await getGuidesByCategory(guide.category, guide.slug);

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#D4B8C0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <TrackPageView eventName="guide_view" params={{ guide_slug: guide.slug }} />
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_280px]">
        <article className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-[#F8C79F]/30 md:p-8">
          <header className="space-y-4 border-b border-[#F8C79F]/30 pb-6">
            <Link href="/guides" className="inline-flex text-sm font-medium text-[#A36241] hover:text-[#48B8D0]">
              ← 가이드 목록으로
            </Link>
            <span className="inline-flex rounded-full bg-[#FFF0E6] px-3 py-1 text-xs font-bold text-[#7C4A2D]">
              {guideCategoryLabels[guide.category]}
            </span>
            <h1 className="text-3xl font-extrabold text-[#4F2A1D]">{guide.title}</h1>
            <p className="text-sm text-[#7C4A2D]">{guide.description}</p>
          </header>

          <section
            className="prose prose-lg mt-8 max-w-none prose-headings:text-[#4F2A1D] prose-p:text-[#2D2D2D] prose-li:text-[#2D2D2D]"
            dangerouslySetInnerHTML={{ __html: guide.html }}
          />

          <footer className="mt-10 space-y-3 border-t border-[#F8C79F]/30 pt-6">
            <h2 className="text-lg font-extrabold text-[#4F2A1D]">다음 단계로 바로 이어가세요</h2>
<GuideCtaButtons sourcePage={`guide_${guide.slug}`} />
          </footer>
        </article>

        <aside className="space-y-4 rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-[#F8C79F]/30">
          <h2 className="text-sm font-extrabold text-[#4F2A1D]">같은 카테고리의 다른 가이드</h2>
          <div className="space-y-3">
            {relatedGuides.slice(0, 8).map((item) => (
              <Link key={item.slug} href={`/guides/${item.slug}`} className="block rounded-2xl bg-[#D4B8C0] p-3 text-sm text-[#7C4A2D] hover:bg-[#FFF0E6]">
                <p className="font-semibold text-[#4F2A1D]">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[#A36241]">{item.description}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
