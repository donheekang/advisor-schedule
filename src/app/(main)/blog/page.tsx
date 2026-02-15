import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: '블로그 | PetHealth+',
  description: '반려동물 진료비 비교와 보험, 검사 항목에 대한 실전 가이드를 확인하세요.'
};

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">📖 반려동물 건강 가이드</h1>
          <p className="text-base text-[#7A5642]">보호자가 알아야 할 건강 정보를 모았어요</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 w-full">
                {post.thumbnail ? (
                  <Image src={post.thumbnail} alt={`${post.title} 썸네일`} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE6D0] via-[#FFD7C2] to-[#FFD1E8]">
                    <span className="text-lg font-semibold text-[#8A5A44]">PetHealth+ Blog</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-6">
                <p className="text-sm text-[#8A6A58]">{post.date}</p>
                <h2 className="text-xl font-bold text-[#4F2A1D]">{post.title}</h2>
                <p className="text-sm leading-6 text-[#6E4C3B]">{post.description}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex font-semibold text-[#B1643A] hover:text-[#8C4725]">
                  읽어보기 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
