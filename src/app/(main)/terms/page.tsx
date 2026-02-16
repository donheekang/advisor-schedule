import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | PetHealth+',
  description: 'PetHealth+ 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      <h1 className="mb-2 text-2xl font-extrabold text-[#1B2A4A] md:text-3xl">이용약관</h1>
      <p className="mb-8 text-sm text-[#94A3B8]">최종 수정일: 2026년 2월 17일</p>

      <div className="prose-sm space-y-8 text-[#4A5568]">

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제1조 (목적)</h2>
          <p className="leading-relaxed">본 약관은 PetHealth+(이하 &quot;서비스&quot;)가 제공하는 반려동물 진료비 비교 및 AI 분석 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제2조 (서비스의 내용)</h2>
          <p className="leading-relaxed">서비스는 다음을 제공합니다.</p>
          <p className="mt-2 leading-relaxed">1. 전국 동물병원 진료비 데이터 비교</p>
          <p className="leading-relaxed">2. AI 기반 예상 진료비 견적서</p>
          <p className="leading-relaxed">3. 반려동물 건강 관련 콘텐츠</p>
          <p className="leading-relaxed">4. 펫토커 (반려동물 사진 기반 AI 대사 생성)</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제3조 (의료 면책)</h2>
          <p className="leading-relaxed">본 서비스에서 제공하는 모든 정보(AI 진료비 견적서, 건강 가이드 등)는 참고용이며, 의료 진단이나 처방을 대체하지 않습니다. 반려동물의 건강 문제는 반드시 수의사와 상담하시기 바랍니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제4조 (진료비 데이터 면책)</h2>
          <p className="leading-relaxed">서비스에서 제공하는 진료비 데이터는 전국 평균 기준이며, 실제 진료비는 병원, 지역, 반려동물의 상태에 따라 달라질 수 있습니다. 서비스는 진료비 데이터의 정확성을 보증하지 않습니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제5조 (회원가입 및 탈퇴)</h2>
          <p className="leading-relaxed">1. 회원가입은 소셜 로그인(Google, Kakao, Apple)을 통해 이루어집니다.</p>
          <p className="mt-1 leading-relaxed">2. 회원은 언제든지 서비스 내에서 탈퇴를 요청할 수 있으며, 탈퇴 시 개인정보는 즉시 삭제됩니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제6조 (서비스 이용 제한)</h2>
          <p className="leading-relaxed">다음에 해당하는 경우 서비스 이용이 제한될 수 있습니다.</p>
          <p className="mt-2 leading-relaxed">1. 타인의 정보를 도용한 경우</p>
          <p className="leading-relaxed">2. 서비스 운영을 고의로 방해한 경우</p>
          <p className="leading-relaxed">3. 관련 법령을 위반한 경우</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제7조 (면책사항)</h2>
          <p className="leading-relaxed">서비스는 천재지변, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제8조 (준거법 및 관할)</h2>
          <p className="leading-relaxed">본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 서울중앙지방법원을 제1심 관할법원으로 합니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">제9조 (약관의 변경)</h2>
          <p className="leading-relaxed">본 약관이 변경되는 경우 시행일 7일 전부터 서비스 내 공지합니다.</p>
        </section>
      </div>
    </div>
  );
}
