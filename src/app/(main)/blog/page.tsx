import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: '블로그 | PetHealth+',
  description: '반려동물 진료비 비교와 보험, 검사 항목에 대한 실전 가이드를 확인하세요.',
};

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="w-full bg-white pb-10 pt-24 md:pt-28">
      <div className="mx-auto w-full max-w-lg px-5">
        <header className="border-b-8 border-[#F2F4F6] pb-6">
          <h1 className="mb-1 text-[22px] font-extrabold tracking-tight text-[#191F28]">
            블로그
          </h1>
          <p className="text-sm text-[#8B95A1]">
            보호자가 알아야 할 건강 정보를 모았어요
          </p>
        </header>

        <div className="divide-y-0">
          {posts.map((post) => (
            <article key={post.slug} className="border-b-8 border-[#F2F4F6] py-6">
              <p className="text-xs font-medium text-[#8B95A1]">{post.date}</p>
              <h2 className="mt-1 text-[17px] font-bold text-[#191F28]">
                <Link href={'/blog/' + post.slug} className="transition hover:text-[#4E5968]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4E5968]">
                {post.description}
              </p>
              <Link
                href={'/blog/' + post.slug}
                className="mt-3 inline-flex text-sm font-semibold text-[#191F28] transition hover:text-[#4E5968]"
              >
                읽어보기 →
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[16px] font-bold text-[#191F28]">아직 작성된 글이 없어요</p>
            <p className="mt-2 text-sm text-[#8B95A1]">곧 유용한 가이드가 올라올 예정이에요</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
