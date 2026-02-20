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
    <section className="w-full rounded-[2rem] bg-[#F8FAFB] px-5 py-10 md:px-8 md:py-12">
      <article className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-3 border-b border-[#0B3041]/10 pb-6">
          <Link
            href="/blog"
            className="inline-flex rounded-full border border-[#0B3041]/20 px-3 py-1 text-xs font-semibold text-[#0B3041] transition-all hover:bg-[#0B3041]/5"
          >
            ← 블로그 목록
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B3041]">{post.title}</h1>
          <p className="text-sm text-[#9CA3AF]">
            {new Date(post.date).toLocaleDateString('ko-KR')}
          </p>
        </header>

        <section
          className="prose prose-lg max-w-none leading-relaxed text-[#2D2D2D] prose-headings:text-[#0B3041] prose-p:text-[#0B3041] prose-li:text-[#0B3041] prose-a:text-[#48B8D0] prose-a:no-underline hover:prose-a:text-[#3A9BB0] prose-strong:text-[#0B3041]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="space-y-4 border-t border-[#0B3041]/10 pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CTABanner variant="ai-care" context="blog-post-bottom" />
            <CTABanner variant="cost-search" context="blog-post-bottom" />
          </div>
          <Link
            href="/blog"
            className="inline-flex rounded-2xl bg-[#48B8D0] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(72,184,208,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(72,184,208,0.4)]"
          >
            ← 다른 글 보기
          </Link>
        </footer>
      </article>
    </section>
  );
}
