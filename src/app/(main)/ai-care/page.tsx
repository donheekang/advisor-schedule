import type { Metadata } from 'next';
import AiCareClient from '@/app/(main)/ai-care/ai-care-client';
import { AnimateOnScroll } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AI 맞춤 케어 리포트 | 펫헬스플러스',
  description: '우리 아이 정보를 입력하면 맞춤 건강 리포트를 받아보세요.',
  keywords: ['반려동물', '강아지', '고양이', 'AI 케어', '건강관리', '진료비'],
  openGraph: {
    title: '무료 AI 케어 체험',
    description: '우리 아이 맞춤 케어 분석을 무료로 받아보세요.',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function AiCarePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0FF] via-[#FFF8F0] to-[#FFF8F0] pb-6 pt-24 md:pb-10 md:pt-32">
        <div className="absolute left-[10%] top-20 h-48 w-48 rounded-full bg-[#8B5CF6]/5 blur-3xl" />
        <div className="absolute right-[15%] top-10 h-64 w-64 rounded-full bg-[#F97316]/5 blur-3xl" />

        <AnimateOnScroll animation="fade-up">
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8B5CF6]/10 px-4 py-2 text-sm font-medium text-[#8B5CF6]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              30초 무료 AI 분석
            </span>
            <h1 className="mb-3 text-2xl font-extrabold text-[#1B2A4A] md:text-4xl">AI 맞춤 케어 리포트</h1>
            <p className="text-sm text-[#64748B] md:text-base">우리 아이 정보를 입력하면 맞춤 건강 리포트를 받아보세요</p>
          </div>
        </AnimateOnScroll>
      </section>

      <div
        className="mx-auto -mt-4 max-w-3xl px-4 pb-20 [&_main]:rounded-none [&_main]:bg-transparent [&_main]:px-0 [&_main]:py-0 [&_main>div]:max-w-none [&_main>div>section:first-child]:hidden [&_form]:space-y-0 [&_form>div:first-child>div]:rounded-2xl [&_form>div:first-child>div]:bg-white [&_form>div:first-child>div]:p-6 [&_form>div:first-child>div]:shadow-xl [&_form>div:first-child>div]:shadow-[#1B2A4A]/5 md:[&_form>div:first-child>div]:p-8 [&_form>div:first-child_h2]:mb-6 [&_form>div:first-child_h2]:flex [&_form>div:first-child_h2]:items-center [&_form>div:first-child_h2]:gap-3 [&_form>div:first-child_h2]:text-base [&_form>div:first-child_h2]:font-bold [&_form>div:first-child_h2]:text-[#1B2A4A] [&_form>div:first-child_h2]:before:flex [&_form>div:first-child_h2]:before:h-7 [&_form>div:first-child_h2]:before:w-7 [&_form>div:first-child_h2]:before:items-center [&_form>div:first-child_h2]:before:justify-center [&_form>div:first-child_h2]:before:rounded-full [&_form>div:first-child_h2]:before:bg-[#F97316] [&_form>div:first-child_h2]:before:text-xs [&_form>div:first-child_h2]:before:font-bold [&_form>div:first-child_h2]:before:text-white [&_form>div:first-child_h2]:before:content-['1'] [&_form_label]:text-xs [&_form_label]:font-medium [&_form_label]:text-[#64748B] [&_form_select]:rounded-xl [&_form_select]:border [&_form_select]:border-[#E2E8F0] [&_form_select]:bg-[#F8FAFC] [&_form_select]:px-4 [&_form_select]:py-3 [&_form_select]:text-sm [&_form_select]:text-[#1B2A4A] [&_form_select]:transition-all [&_form_select]:duration-200 [&_form_select]:focus:border-[#F97316] [&_form_select]:focus:bg-white [&_form_select]:focus:outline-none [&_form_select]:focus:ring-4 [&_form_select]:focus:ring-[#F97316]/10 [&_form_input]:rounded-xl [&_form_input]:border [&_form_input]:border-[#E2E8F0] [&_form_input]:bg-[#F8FAFC] [&_form_input]:px-4 [&_form_input]:py-3 [&_form_input]:text-sm [&_form_input]:text-[#1B2A4A] [&_form_input]:placeholder-[#CBD5E1] [&_form_input]:transition-all [&_form_input]:duration-200 [&_form_input]:focus:border-[#F97316] [&_form_input]:focus:bg-white [&_form_input]:focus:outline-none [&_form_input]:focus:ring-4 [&_form_input]:focus:ring-[#F97316]/10 [&_form_button[type='submit']]:mt-8 [&_form_button[type='submit']]:w-full [&_form_button[type='submit']]:rounded-xl [&_form_button[type='submit']]:bg-gradient-to-r [&_form_button[type='submit']]:from-[#F97316] [&_form_button[type='submit']]:to-[#FB923C] [&_form_button[type='submit']]:py-4 [&_form_button[type='submit']]:text-sm [&_form_button[type='submit']]:font-bold [&_form_button[type='submit']]:text-white [&_form_button[type='submit']]:shadow-lg [&_form_button[type='submit']]:shadow-[#F97316]/25 [&_form_button[type='submit']]:transition-all [&_form_button[type='submit']]:duration-300 [&_form_button[type='submit']]:hover:-translate-y-0.5 [&_form_button[type='submit']]:hover:shadow-xl [&_form_button[type='submit']]:active:scale-[0.98] [&_form>div:last-child_section]:mt-8 [&_form>div:last-child_section]:rounded-2xl [&_form>div:last-child_section]:border-0 [&_form>div:last-child_section]:bg-white [&_form>div:last-child_section]:p-6 [&_form>div:last-child_section]:shadow-xl [&_form>div:last-child_section]:shadow-[#1B2A4A]/5 md:[&_form>div:last-child_section]:p-8 [&_form>div:last-child_section_h2]:mb-2 [&_form>div:last-child_section_h2]:flex [&_form>div:last-child_section_h2]:items-center [&_form>div:last-child_section_h2]:gap-3 [&_form>div:last-child_section_h2]:text-base [&_form>div:last-child_section_h2]:font-bold [&_form>div:last-child_section_h2]:text-[#1B2A4A] [&_form>div:last-child_section_h2]:before:flex [&_form>div:last-child_section_h2]:before:h-7 [&_form>div:last-child_section_h2]:before:w-7 [&_form>div:last-child_section_h2]:before:items-center [&_form>div:last-child_section_h2]:before:justify-center [&_form>div:last-child_section_h2]:before:rounded-full [&_form>div:last-child_section_h2]:before:bg-[#8B5CF6] [&_form>div:last-child_section_h2]:before:text-xs [&_form>div:last-child_section_h2]:before:font-bold [&_form>div:last-child_section_h2]:before:text-white [&_form>div:last-child_section_h2]:before:content-['2'] [&_form>div:last-child_section_.rounded-full]:bg-[#F8FAFC] [&_form>div:last-child_section_.rounded-full_span]:text-[#CBD5E1] [&_form>div:last-child_section_p]:text-sm [&_form>div:last-child_section_p]:text-[#94A3B8] [&_[data-checked='true']]:border-[#F97316] [&_[data-checked='true']]:bg-[#FFF7ED] [&_[data-checked='true']]:text-[#F97316] [&_[data-checked='false']]:border-[#E2E8F0] [&_[data-checked='false']]:bg-white [&_[data-checked='false']]:text-[#64748B] [&_[data-checked='false']]:hover:border-[#CBD5E1] [&_[data-checked='false']]:hover:bg-[#F8FAFC]"
      >
        <AiCareClient />
      </div>
    </>
  );
}
