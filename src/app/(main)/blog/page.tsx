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
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 pt-24 pb-10 md:px-8 md:pb-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-3 text-center">
          <p className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-[#7C4A2D] shadow-sm">
            📖 보호자를 위한 가이드
          </p>
          <h1 className="text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">
            반려동물 건강 가이드
          </h1>
          <p className="text-sm text-[#7C4A2D]">보호자가 알아야 할 건강 정보를 모았어요</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-[#F8C79F]/20 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="space-y-3 p-7">
                <p className="text-xs font-semibold text-[#A36241]">{post.date}</p>
                <h2 className="text-xl font-extrabold text-[#4F2A1D] group-hover:text-[#F97316]">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#7C4A2D]">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex text-sm font-bold text-[#F97316] group-hover:underline"
                >
                  읽어보기 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-[#F8C79F]/20">
            <p className="text-5xl">📝</p>
            <p className="mt-4 text-lg font-bold text-[#4F2A1D]">아직 작성된 글이 없어요</p>
            <p className="mt-2 text-sm text-[#7C4A2D]">곧 유용한 가이드가 올라올 예정이에요!</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
