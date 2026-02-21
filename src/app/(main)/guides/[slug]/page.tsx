import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideCtaButtons } from '@/components/analytics/guide-cta-buttons';
import { TrackPageView } from '@/components/analytics/track-page-view';
import {
  getAllGuides,
  getGuideBySlug,
  getGuidesByCategory,
  guideCategoryLabels,
} from '@/lib/guides';

type GuidePageProps = {
  params: { slug: string };
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
      description: '요청하신 가이드를 찾을 수 없어요.',
    };
  }
  const ogTitle = encodeURIComponent(guide.title);
  return {
    title: `${guide.title} | 반려동물 진료비 가이드`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://pethealthplus.kr/guides/${guide.slug}`,
      locale: 'ko_KR',
      type: 'article',
      images: [`/api/og?title=${ogTitle}&category=${guide.category}`],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideBySlug(params.slug);
  if (!guide) {
    notFound();
  }

  const relatedGuides = await getGuidesByCategory(guide.category, guide.slug);

  return (
    <section className="w-full bg-white px-5 pb-10 pt-24 md:pt-28">
      <TrackPageView eventName="guide_view" params={{ guide_slug: guide.slug }} />

      <div className="mx-auto w-full max-w-lg">
        <article>
          <header className="border-b-8 border-[#F2F4F6] pb-6">
            <div className="flex items-center gap-2">
              <Link
                href="/guides"
                className="text-sm font-medium text-[#8B95A1] transition hover:text-[#191F28]"
              >
                ← 가이드 목록으로
              </Link>
              <span className="rounded-full bg-[#F2F4F6] px-2.5 py-0.5 text-xs font-semibold text-[#4E5968]">
                {guideCategoryLabels[guide.category]}
              </span>
            </div>
            <h1 className="mt-3 text-[22px] font-extrabold tracking-tight text-[#191F28]">
              {guide.title}
            </h1>
            <p className="mt-1 text-sm text-[#8B95A1]">{guide.description}</p>
          </header>

          <section
            className="prose prose-lg max-w-none py-6 leading-relaxed text-[#4E5968] prose-headings:text-[#191F28] prose-p:text-[#4E5968] prose-li:text-[#4E5968] prose-a:text-[#191F28] prose-a:underline hover:prose-a:text-[#4E5968] prose-strong:text-[#191F28]"
            dangerouslySetInnerHTML={{ __html: guide.html }}
          />

          <footer className="space-y-4 border-t-8 border-[#F2F4F6] pt-6">
            <h2 className="text-[15px] font-bold text-[#191F28]">다음 단계로 바로 이어가세요</h2>
            <GuideCtaButtons sourcePage={'guide_' + guide.slug} />
          </footer>
        </article>

        {relatedGuides.length > 0 && (
          <div className="mt-8 border-t-8 border-[#F2F4F6] pt-6">
            <h2 className="mb-4 text-[15px] font-bold text-[#191F28]">같은 카테고리의 다른 가이드</h2>
            <div className="space-y-3">
              {relatedGuides.slice(0, 5).map((item) => (
                <Link
                  key={item.slug}
                  href={'/guides/' + item.slug}
                  className="block rounded-[14px] border-[1.5px] border-[#E5E8EB] p-4 transition hover:border-[#CBD5E1]"
                >
                  <p className="text-sm font-bold text-[#191F28]">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[#8B95A1]">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
