import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | PetHealth+',
  description: 'PetHealth+ 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      <h1 className="mb-2 text-2xl font-extrabold text-[#1B2A4A] md:text-3xl">개인정보처리방침</h1>
      <p className="mb-8 text-sm text-[#94A3B8]">최종 수정일: 2026년 2월 17일</p>

      <div className="prose-sm space-y-8 text-[#4A5568]">
        
        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">1. 수집하는 개인정보</h2>
          <p className="leading-relaxed">PetHealth+(이하 &quot;서비스&quot;)는 서비스 제공을 위해 다음 정보를 수집합니다.</p>
          <p className="mt-2 leading-relaxed"><strong className="text-[#1B2A4A]">필수 수집 항목:</strong> 소셜 로그인 시 제공되는 이메일, 이름(닉네임), 프로필 사진</p>
          <p className="mt-1 leading-relaxed"><strong className="text-[#1B2A4A]">선택 수집 항목:</strong> 반려동물 정보(종류, 품종, 나이, 체중), 증상 입력 내용, 진료비 검색 기록</p>
          <p className="mt-1 leading-relaxed"><strong className="text-[#1B2A4A]">자동 수집 항목:</strong> 접속 IP, 브라우저 종류, 서비스 이용 기록, 접속 일시</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">2. 개인정보의 수집 및 이용 목적</h2>
          <p className="leading-relaxed">수집된 개인정보는 다음 목적으로 이용됩니다.</p>
          <p className="mt-2 leading-relaxed">- 회원 식별 및 서비스 제공</p>
          <p className="leading-relaxed">- AI 진료비 견적서 분석 결과 제공</p>
          <p className="leading-relaxed">- 진료비 데이터 비교 서비스 제공</p>
          <p className="leading-relaxed">- 서비스 개선 및 통계 분석</p>
          <p className="leading-relaxed">- 고객 문의 응대</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="leading-relaxed">회원 탈퇴 시 즉시 파기합니다. 단, 관계법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
          <p className="mt-2 leading-relaxed">- 서비스 이용 기록: 3년 (통신비밀보호법)</p>
          <p className="leading-relaxed">- 접속 로그: 3개월 (통신비밀보호법)</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">4. 개인정보의 제3자 제공</h2>
          <p className="leading-relaxed">PetHealth+는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의해 요구되는 경우는 예외로 합니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">5. 개인정보의 처리 위탁</h2>
          <p className="leading-relaxed">서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다.</p>
          <p className="mt-2 leading-relaxed">- Firebase (Google): 인증 및 데이터 저장</p>
          <p className="leading-relaxed">- Vercel: 웹 호스팅</p>
          <p className="leading-relaxed">- Anthropic (Claude AI): AI 분석 (증상 텍스트만 전달, 개인 식별 정보 미포함)</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">6. 이용자의 권리</h2>
          <p className="leading-relaxed">이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며, 회원 탈퇴를 통해 개인정보 처리 정지를 요청할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">7. 개인정보 보호책임자</h2>
          <p className="leading-relaxed">개인정보 보호에 관한 문의는 아래로 연락해주세요.</p>
          <p className="mt-2 leading-relaxed">이메일: support@pethealthplus.kr</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-[#1B2A4A]">8. 개인정보처리방침 변경</h2>
          <p className="leading-relaxed">본 방침이 변경되는 경우 시행일 7일 전부터 서비스 내 공지합니다.</p>
        </section>
      </div>
    </div>
  );
}
