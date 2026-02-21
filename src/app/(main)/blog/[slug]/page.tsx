import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

type BlogPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: '블로그 | PetHealth+',
      description: '반려동물 진료비 인사이트와 비용 관리 가이드를 확인해보세요.',
    };
  }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pethealthplus.kr/blog/${post.slug}`,
      siteName: 'PetHealth+',
      locale: 'ko_KR',
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <section className="w-full bg-white px-5 pb-10 pt-24 md:pt-28">
      <article className="mx-auto max-w-lg">
        <header className="border-b-8 border-[#F2F4F6] pb-6">
          <Link
            href="/blog"
            className="inline-flex rounded-full border-[1.5px] border-[#E5E8EB] px-3 py-1 text-xs font-semibold text-[#4E5968] transition hover:border-[#CBD5E1]"
          >
            ← 블로그 목록
          </Link>
          <h1 className="mt-4 text-[22px] font-extrabold tracking-tight text-[#191F28]">
            {post.title}
          </h1>
          <p className="mt-1 text-sm text-[#8B95A1]">
            {new Date(post.date).toLocaleDateString('ko-KR')}
          </p>
        </header>

        <section
          className="prose prose-lg max-w-none py-6 leading-relaxed text-[#4E5968] prose-headings:text-[#191F28] prose-p:text-[#4E5968] prose-li:text-[#4E5968] prose-a:text-[#191F28] prose-a:underline hover:prose-a:text-[#4E5968] prose-strong:text-[#191F28]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="space-y-3 border-t-8 border-[#F2F4F6] pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/ai-care"
              className="flex w-full items-center justify-center rounded-[14px] bg-[#191F28] px-5 py-[17px] text-[15px] font-bold text-white transition hover:bg-[#333D4B]"
            >
              AI 견적서 분석 →
            </Link>
            <Link
              href="/cost-search"
              className="flex w-full items-center justify-center rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white px-5 py-[17px] text-[15px] font-bold text-[#191F28] transition hover:border-[#CBD5E1]"
            >
              진료비 검색 →
            </Link>
          </div>
          <Link
            href="/blog"
            className="inline-flex text-sm font-semibold text-[#8B95A1] transition hover:text-[#191F28]"
          >
            ← 다른 글 보기
          </Link>
        </footer>
      </article>
    </section>
  );
}
