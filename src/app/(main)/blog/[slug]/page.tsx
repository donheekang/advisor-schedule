import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

const baseUrl = 'https://pethealthplus.kr';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: '블로그 | PetHealth+'
    };
  }

  return {
    title: `${post.title} | PetHealth+ 블로그`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${baseUrl}/blog/${post.slug}`
    }
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'PetHealth+'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PetHealth+'
    },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`
  };

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="border-b border-slate-100 pb-6">
        <p className="text-sm text-slate-500">{post.date}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-brand-primary">{post.title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <section className="prose prose-slate mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.html }} />

      <aside className="mt-12 rounded-2xl bg-[#FFF3E6] p-6 text-center">
        <h2 className="text-xl font-bold text-brand-primary">우리 아이 진료비, 지금 바로 비교해보세요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">실제 진료 데이터 기반으로 평균 진료비를 빠르게 확인할 수 있어요.</p>
        <Link
          href="/cost-search"
          className="mt-4 inline-flex rounded-full bg-brand-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-ctaHover"
        >
          진료비 검색해보기
        </Link>
      </aside>
    </article>
  );
}
