import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blogPosts, getBlogPostBySlug } from '@/lib/blog-posts';

type BlogPageProps = {
  params: {
    slug: string;
  };
};

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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
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
