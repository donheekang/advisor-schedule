import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CTABanner } from '@/components/cta-banner';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

type BlogPageProps = {
  params: {
    slug: string;
  };
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
      description: '반려동물 진료비 인사이트와 비용 관리 가이드를 확인해보세요.'
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pethealthplus.kr/blog/${post.slug}`,
      siteName: 'PetHealth+',
      locale: 'ko_KR',
      type: 'article'
    }
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#D4B8C0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <article className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-3 border-b border-[#F8C79F]/40 pb-6">
          <Link
            href="/blog"
            className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#A36241] shadow-sm transition hover:bg-white"
          >
            ← 블로그 목록
          </Link>
          <h1 className="text-3xl font-extrabold text-[#4F2A1D]">{post.title}</h1>
          <p className="text-sm font-medium text-[#A36241]">
            {new Date(post.date).toLocaleDateString('ko-KR')}
          </p>
        </header>

        <section
          className="prose prose-lg max-w-none leading-relaxed text-[#2D2D2D] prose-headings:text-[#4F2A1D] prose-p:text-[#2D2D2D] prose-li:text-[#2D2D2D] prose-a:text-[#48B8D0] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#4F2A1D]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="space-y-4 border-t border-[#F8C79F]/40 pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CTABanner variant="ai-care" context="blog-post-bottom" />
            <CTABanner variant="cost-search" context="blog-post-bottom" />
          </div>
          <Link
            href="/blog"
            className="inline-flex rounded-2xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
          >
            ← 다른 글 보기
          </Link>
        </footer>
      </article>
    </section>
  );
}
