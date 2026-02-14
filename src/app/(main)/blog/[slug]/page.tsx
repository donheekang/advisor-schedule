import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

type BlogDetailPageProps = {
import { notFound } from 'next/navigation';

import { blogPosts, getBlogPostBySlug } from '@/lib/blog-posts';

type BlogPageProps = {
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
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: '블로그 | PetHealth+',
      description: '반려동물 진료비 인사이트와 비용 관리 가이드를 확인해보세요.'
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
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tags,
      images: [
        {
          url: `https://pethealthplus.kr/og/blog-${post.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${post.title} 대표 이미지`
        }
      ]
    }
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'PetHealth+'
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Organization',
      name: post.authorName
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
    mainEntityOfPage: `https://pethealthplus.kr/blog/${post.slug}`,
    image: [`https://pethealthplus.kr/og/blog-${post.slug}.png`]
  };

  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold text-brand-secondary">{post.category}</p>
        <h1 className="text-3xl font-extrabold leading-tight text-brand-primary">{post.title}</h1>
        <p className="text-sm text-slate-500">{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</p>
      </header>

      <section className="space-y-4 text-base leading-8 text-slate-700">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <footer className="border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-500">태그: {post.tags.join(', ')}</p>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </article>
  );
}
