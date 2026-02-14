import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: '블로그 | PetHealth+',
  description: '반려동물 진료비 비교와 보험, 검사 항목에 대한 실전 가이드를 확인하세요.'
};

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-brand-primary">PetHealth+ 블로그</p>
        <h1 className="text-3xl font-bold text-brand-primary">진료비 가이드 & 인사이트</h1>
        <p className="text-base text-slate-600">항목별 진료비 기준과 비용 절약 팁을 확인해보세요.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{post.date}</p>
            <h2 className="mt-2 text-xl font-bold text-brand-primary">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
