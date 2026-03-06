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
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-20 md:px-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f5_40%,#fff0ea_100%)] px-6 py-9 shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ff7a45]/10 blur-3xl" />
        <h1 className="text-2xl font-bold tracking-tight text-[#17191f] md:text-3xl">블로그</h1>
        <p className="mt-2 text-sm text-[#697182]">보호자가 알아야 할 건강 정보를 모았어요</p>
      </header>

      <div className="space-y-5">

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="rounded-[2rem] bg-white p-7 ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold text-[#ff7a45]">{post.date}</p>
                <h2 className="mt-2 text-lg font-bold text-[#17191f] group-hover:text-[#ff7a45]">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#697182]">{post.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#ff7a45]">
                  읽어보기
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
                </span>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-black/[0.04]">
            <p className="text-lg font-bold text-[#17191f]">아직 작성된 글이 없어요</p>
            <p className="mt-2 text-sm text-[#697182]">곧 유용한 가이드가 올라올 예정이에요!</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
