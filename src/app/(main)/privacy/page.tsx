import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | PetHealth+',
  description: '(주)플러스랩코리아가 운영하는 PetHealth+ 개인정보처리방침',
};

const SECTIONS = [
  {
    id: 'sec1',
    title: '1. 수집하는 개인정보 항목',
    content: (
      <>
        <p>서비스는 기능 제공을 위해 아래 정보를 수집·이용합니다.</p>

        <h4>(1) 계정 정보</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li><b>서비스 이용 식별자</b>: 서비스 이용을 위한 고유 식별값</li>
          <li><b>로그인 정보</b>: Apple·Google·Kakao 로그인 시 제공되는 이메일 및 이름/닉네임</li>
          <li><b>구독 정보</b>: 구독 상태(Free/Pro) 및 구독 기간</li>
        </ul>

        <h4>(2) 기기 및 이용 정보</h4>
        <p>접속 IP, 브라우저 종류, 앱 버전, OS 정보, 서비스 이용 기록, 접속 일시 등 서비스 품질 개선을 위한 최소 로그</p>

        <h4>(3) 반려동물 및 건강 기록</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li><b>반려동물 프로필</b>: 이름, 종, 품종, 생일, 체중, 성별, 중성화 여부, 알러지 등</li>
          <li><b>진료 기록</b>: 병원명, 방문일자, 결제금액, 진료 항목명 및 금액, 진료 분류 등</li>
          <li><b>예방 일정</b>: 일정 제목, 종류, 날짜, 알림 설정, 메모 등</li>
        </ul>
        <div className="mt-2 rounded-xl bg-[#F8FAFB] px-4 py-3 text-xs text-[#8B95A1]">
          ※ 반려동물 정보 자체는 원칙적으로 개인정보가 아니나, 계정 정보와 결합되어 개인을 식별할 수 있는 경우 개인정보에 준하여 보호합니다.
        </div>

        <h4>(4) 업로드 파일</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li><b>영수증 이미지</b>: 이용자가 촬영한 영수증 원본 이미지는 진료 기록 확인 및 보험청구 등의 목적으로 보안 클라우드 저장소에 저장됩니다. 영수증에 포함된 개인정보(성명, 전화번호, 주소 등)는 자동으로 가려진(마스킹) 사본이 별도로 생성되며, 원본 이미지는 이용자 본인만 접근 가능한 저장소에 보관됩니다.</li>
          <li><b>진단서 이미지</b>: 이용자가 업로드한 진단서 원본 이미지는 기록 보관 및 보험청구 패키지 생성 목적으로 보안 클라우드 저장소에 저장됩니다.</li>
          <li><b>서류(PDF/이미지)</b>: 검사결과지, 접종증명서 등 이용자가 직접 업로드한 문서는 원본 그대로 보안 클라우드 저장소에 저장됩니다.</li>
        </ul>
        <div className="mt-2 rounded-xl bg-[#F8FAFB] px-4 py-3 text-xs text-[#8B95A1]">
          ※ 모든 업로드 파일은 이용자 본인만 접근 가능하며, 삭제 요청 시 복구 불가능한 방법으로 완전히 삭제됩니다.
        </div>

        <h4>(5) 보험청구 관련 정보</h4>
        <p>청구일자, 청구 기간, 청구 총액, 첨부 서류 목록 등</p>

        <h4>(6) 위치 정보</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li><b>현재 위치(위도·경도)</b>: 이용자의 현재 위치를 기반으로 가까운 동물병원을 검색하기 위해 수집합니다.</li>
          <li>위치 정보는 검색 시점에만 일시적으로 사용되며, 서버에 별도로 저장하지 않습니다.</li>
          <li>위치 정보 수집은 이용자가 브라우저 또는 기기의 위치 권한을 허용한 경우에만 이루어지며, 설정에서 언제든지 권한을 해제할 수 있습니다.</li>
        </ul>
        <div className="mt-2 rounded-xl bg-[#F8FAFB] px-4 py-3 text-xs text-[#8B95A1]">
          ※ 위치 권한을 허용하지 않아도 서비스의 다른 기능(진료 기록 관리, AI 분석 등)은 정상적으로 이용할 수 있습니다.
        </div>
      </>
    ),
  },
  {
    id: 'sec2',
    title: '2. 개인정보의 이용 목적',
    content: (
      <>
        <ul className="ml-4 list-disc space-y-1">
          <li>반려동물 건강 기록의 저장 및 관리</li>
          <li>영수증에서 진료 항목·금액 추출을 통한 기록 자동화</li>
          <li>AI 건강 분석 및 건강 가이드 제공</li>
          <li>예방접종·건강검진 일정 관리 및 알림</li>
          <li>진료비 비교 데이터 제공</li>
          <li>보험청구 자료 생성 및 관리</li>
          <li>데이터 백업·복구 및 계정 전환 처리</li>
          <li>구독 상태 관리 및 기능 제공</li>
          <li>서비스 장애 분석 및 개선</li>
          <li>이용자 위치 기반 주변 동물병원 검색</li>
        </ul>
        <h4>마케팅 관련</h4>
        <p>회사는 이용자의 개인정보를 별도 동의 없이 마케팅 목적으로 이용하지 않습니다. 향후 필요한 경우 관련 법령에 따라 사전 동의를 받습니다.</p>
      </>
    ),
  },
  {
    id: 'sec3',
    title: '3. 개인정보의 보관 및 보호',
    content: (
      <>
        <h4>(1) 최소 수집 원칙</h4>
        <p>서비스 제공에 필요한 최소한의 정보만 수집하며, 주민등록번호 등 민감한 식별정보는 수집하지 않습니다.</p>

        <h4>(2) 영수증 개인정보 보호</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li>영수증에 포함된 개인정보(성명, 전화번호, 주소 등)는 자동으로 가려지거나 저장하지 않습니다.</li>
          <li>진료 항목·금액 등 서비스에 필요한 정보만 추출합니다.</li>
          <li>영수증 원본 이미지는 이용자의 기록 확인 및 보험청구 목적으로 보관되며, 이용자 본인만 접근할 수 있습니다.</li>
        </ul>

        <h4>(3) 저장 및 접근 보호</h4>
        <ul className="ml-4 list-disc space-y-1">
          <li>파일과 데이터는 보안이 적용된 클라우드 환경에 저장되며, 인증된 이용자 본인만 접근할 수 있습니다.</li>
          <li>접근 권한 관리, 전송 구간 보호 등 합리적인 보안 조치를 적용합니다.</li>
          <li>삭제된 데이터는 일정 기간 후 완전히 삭제됩니다.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sec4',
    title: '4. 통계 활용',
    content: (
      <p>서비스 개선을 위해 이용 통계(기능 사용량, 오류 빈도 등)를 분석할 수 있으며, 통계는 개인을 식별할 수 없는 형태로 활용합니다.</p>
    ),
  },
  {
    id: 'sec5',
    title: '5. 개인정보 처리의 위탁 및 국외 이전',
    content: (
      <>
        <p>서비스 제공을 위해 일부 업무를 외부 업체에 위탁하거나, 국외 클라우드 인프라를 이용합니다. 이 과정에서 개인정보가 국외로 이전될 수 있습니다.</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#F3F4F6]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFB] text-xs font-semibold text-[#191F28]">
              <tr>
                <th className="px-4 py-3">수탁자</th>
                <th className="px-4 py-3">업무 내용</th>
                <th className="hidden px-4 py-3 md:table-cell">이전 항목</th>
                <th className="hidden px-4 py-3 md:table-cell">이전 국가</th>
                <th className="hidden px-4 py-3 lg:table-cell">보유 기간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[#4E5968]">
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Firebase (Google)</td>
                <td className="px-4 py-3">사용자 인증, 파일 저장</td>
                <td className="hidden px-4 py-3 md:table-cell">식별자, 로그인 정보, 업로드 파일</td>
                <td className="hidden px-4 py-3 md:table-cell">미국 등</td>
                <td className="hidden px-4 py-3 lg:table-cell">이용 기간 또는 삭제 요청 시까지</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Render</td>
                <td className="px-4 py-3">서버 호스팅 및 데이터베이스 운영</td>
                <td className="hidden px-4 py-3 md:table-cell">서비스 이용 데이터 전반</td>
                <td className="hidden px-4 py-3 md:table-cell">미국 등</td>
                <td className="hidden px-4 py-3 lg:table-cell">이용 기간 또는 삭제 요청 시까지</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Vercel</td>
                <td className="px-4 py-3">웹 호스팅 및 서비스 인프라</td>
                <td className="hidden px-4 py-3 md:table-cell">접속 로그, 이용 기록</td>
                <td className="hidden px-4 py-3 md:table-cell">미국 등</td>
                <td className="hidden px-4 py-3 lg:table-cell">이용 기간 또는 삭제 요청 시까지</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Anthropic (Claude AI)</td>
                <td className="px-4 py-3">반려동물 건강 AI 분석 (웹)</td>
                <td className="hidden px-4 py-3 md:table-cell">반려동물 프로필, 진료 이력 요약</td>
                <td className="hidden px-4 py-3 md:table-cell">미국 등</td>
                <td className="hidden px-4 py-3 lg:table-cell">분석 완료 즉시 (별도 저장 없음)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Google (Gemini AI)</td>
                <td className="px-4 py-3">반려동물 건강 AI 분석 (앱)</td>
                <td className="hidden px-4 py-3 md:table-cell">반려동물 프로필, 진료 이력 요약</td>
                <td className="hidden px-4 py-3 md:table-cell">미국 등</td>
                <td className="hidden px-4 py-3 lg:table-cell">분석 완료 즉시 (별도 저장 없음)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#191F28]">Kakao</td>
                <td className="px-4 py-3">카카오 로그인 인증</td>
                <td className="hidden px-4 py-3 md:table-cell">식별자, 이메일, 닉네임</td>
                <td className="hidden px-4 py-3 md:table-cell">대한민국</td>
                <td className="hidden px-4 py-3 lg:table-cell">이용 기간 또는 삭제 요청 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-[#F8FAFB] px-4 py-3 text-xs text-[#8B95A1]">
          ※ 이용자는 개인정보의 국외 이전에 동의하지 않을 권리가 있습니다. 다만, 동의 거부 시 파일 저장, 영수증 분석, AI 건강 분석 등 일부 기능 이용이 제한될 수 있습니다.
        </div>
      </>
    ),
  },
  {
    id: 'sec6',
    title: '6. 보유 및 이용 기간',
    content: (
      <ul className="ml-4 list-disc space-y-1">
        <li>개인정보는 수집·이용 목적 달성 시까지 보유합니다.</li>
        <li>이용자가 삭제하거나 탈퇴를 요청하면 법령상 보관 의무가 없는 한 지체 없이 삭제합니다.</li>
        <li>관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 분리 보관 후 삭제합니다.</li>
        <li>서비스 이용 기록은 3년(통신비밀보호법), 접속 로그는 3개월간 보관 후 삭제합니다.</li>
      </ul>
    ),
  },
  {
    id: 'sec7',
    title: '7. 이용자의 권리 및 삭제',
    content: (
      <ul className="ml-4 list-disc space-y-1">
        <li>이용자는 서비스 내에서 본인의 데이터를 조회·수정·삭제할 수 있으며 탈퇴를 요청할 수 있습니다.</li>
        <li>삭제 요청 시 관련 기록 및 파일은 복구 불가능한 방법으로 삭제됩니다.</li>
        <li>다른 로그인 수단으로 전환하는 경우 데이터 유실 방지를 위한 계정 이전 절차가 진행될 수 있습니다.</li>
      </ul>
    ),
  },
  {
    id: 'sec8',
    title: '8. 개인정보 보호책임자 및 문의처',
    content: (
      <div className="overflow-hidden rounded-2xl border border-[#F3F4F6]">
        <div className="divide-y divide-[#F3F4F6]">
          <div className="flex px-5 py-3.5">
            <span className="w-28 shrink-0 text-sm font-medium text-[#8B95A1]">보호책임자</span>
            <span className="text-sm text-[#191F28]">강돈희</span>
          </div>
          <div className="flex px-5 py-3.5">
            <span className="w-28 shrink-0 text-sm font-medium text-[#8B95A1]">소속</span>
            <span className="text-sm text-[#191F28]">(주)플러스랩코리아</span>
          </div>
          <div className="flex px-5 py-3.5">
            <span className="w-28 shrink-0 text-sm font-medium text-[#8B95A1]">이메일</span>
            <span className="text-sm text-[#191F28]">support@pluslabkorea.com</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sec9',
    title: '9. 아동의 개인정보 보호',
    content: (
      <ul className="ml-4 list-disc space-y-1">
        <li>서비스는 만 14세 미만 아동의 개인정보를 수집하지 않습니다.</li>
        <li>만 14세 미만 아동이 서비스를 이용하려면 법정대리인(부모 등)의 동의가 필요합니다.</li>
        <li>만 14세 미만 아동의 개인정보가 법정대리인의 동의 없이 수집된 것으로 확인되는 경우, 지체 없이 삭제합니다.</li>
        <li>법정대리인은 아동의 개인정보에 대한 열람, 수정, 삭제를 요청할 수 있으며, 회사는 이를 지체 없이 처리합니다.</li>
      </ul>
    ),
  },
  {
    id: 'sec10',
    title: '10. 개인정보처리방침의 변경',
    content: (
      <ul className="ml-4 list-disc space-y-1">
        <li>본 방침은 관련 법령 및 서비스 정책의 변경에 따라 수정될 수 있습니다.</li>
        <li>변경 시 시행일 최소 7일 전에 서비스 내 공지사항 또는 본 페이지를 통해 안내합니다.</li>
        <li>이용자의 권리에 중대한 변경이 있는 경우에는 30일 전에 안내합니다.</li>
      </ul>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff4f4_100%)] px-6 py-14 shadow-[0_24px_70px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[#ff7a45]">PRIVACY POLICY</p>
          <h1 className="text-[2rem] font-extrabold tracking-tight text-[#17191f] md:text-4xl">개인정보처리방침</h1>
          <p className="mt-3 text-sm text-[#697182]">최종 수정일: 2026년 3월 6일 · (주)플러스랩코리아</p>
        </div>
      </section>

      {/* Notice */}
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="-mt-8 rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-6 shadow-[0_10px_28px_rgba(17,24,39,0.07)] ring-1 ring-black/5 md:p-8">
          <p className="mb-2 text-sm font-bold text-[#17191f]">중요 고지</p>
          <div className="space-y-1 text-sm leading-relaxed text-[#697182]">
            <p>1) 서비스는 업로드된 영수증에서 진료 항목 및 금액을 추출하며, 개인정보(성명, 전화번호, 주소 등)는 자동 마스킹 처리됩니다.</p>
            <p>2) 영수증·진단서 등의 원본 이미지는 이용자 본인만 접근 가능한 보안 클라우드 저장소에 보관됩니다.</p>
            <p>3) AI 건강 분석 기능 제공 시 외부 AI 서비스(웹: Anthropic Claude, 앱: Google Gemini)에 데이터가 전송될 수 있습니다.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
        <div className="space-y-0 overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] shadow-[0_10px_28px_rgba(17,24,39,0.07)] ring-1 ring-black/5">
          {SECTIONS.map((sec, i) => (
            <section
              key={sec.id}
              id={sec.id}
              className={`px-6 py-8 md:px-10 md:py-10 ${i < SECTIONS.length - 1 ? 'border-b border-black/5' : ''}`}
            >
              <h2 className="mb-4 text-[17px] font-bold text-[#17191f]">{sec.title}</h2>
              <div className="prose-sm text-sm leading-relaxed text-[#697182] [&_h4]:mb-1 [&_h4]:mt-4 [&_h4]:text-[14px] [&_h4]:font-semibold [&_h4]:text-[#17191f] [&_p]:mb-2">
                {sec.content}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#697182]">
          본 개인정보처리방침은 2026년 3월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
