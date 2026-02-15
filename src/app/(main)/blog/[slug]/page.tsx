import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-10 md:px-0">
      <header className="space-y-3 border-b border-[#E9D3C2] pb-6">
        <h1 className="text-3xl font-extrabold text-[#4F2A1D]">{post.title}</h1>
        <p className="text-sm text-[#8A6A58]">{new Date(post.date).toLocaleDateString('ko-KR')}</p>
      </header>

      <section
        className="prose prose-lg max-w-none text-[#2D2D2D] leading-relaxed prose-headings:text-[#4F2A1D] prose-p:text-[#2D2D2D] prose-li:text-[#2D2D2D]"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <footer className="border-t border-[#E9D3C2] pt-5">
        <Link href="/blog" className="font-semibold text-[#B1643A] hover:text-[#8C4725]">
          다른 글 보기
        </Link>
      </footer>
    </article>
  );
}
