import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | PetHealth+',
  description: '(주)플러스랩코리아가 운영하는 PetHealth+ 서비스 이용약관',
};

const ARTICLES = [
  {
    title: '제1조 (목적)',
    content:
      '본 약관은 (주)플러스랩코리아(이하 "회사")가 제공하는 반려동물 건강 관리 서비스 "PetHealth+"의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (용어의 정의)',
    content: (
      <>
        <p>본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.</p>
        <p className="mt-2"><span className="font-semibold">&quot;서비스&quot;</span>: 회사가 PetHealth+ 브랜드로 제공하는 웹 서비스 및 모바일 애플리케이션 일체</p>
        <p><span className="font-semibold">&quot;이용자&quot;</span>: 본 약관에 동의하고 서비스를 이용하는 자</p>
        <p><span className="font-semibold">&quot;계정&quot;</span>: 서비스 이용을 위해 이용자에게 부여되는 고유 식별 수단(Apple, Google, Kakao 로그인 등)</p>
        <p><span className="font-semibold">&quot;유료 서비스&quot;</span>: 서비스 내에서 별도의 결제를 통해 이용할 수 있는 구독 상품 및 부가 기능</p>
        <p><span className="font-semibold">&quot;콘텐츠&quot;</span>: 이용자가 서비스에 업로드하거나 입력한 텍스트, 이미지, 파일 등 일체의 정보</p>
      </>
    ),
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    content:
      '본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다. 회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일 7일 전부터 서비스 내 공지합니다. 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.',
  },
  {
    title: '제4조 (서비스의 제공)',
    content: (
      <>
        <p>회사는 다음과 같은 서비스를 제공합니다.</p>
        <p className="mt-2">
          전국 동물병원 진료비 데이터 비교 · AI 기반 예상 진료비 견적서 · 반려동물 건강 기록 관리 · 영수증 업로드를 통한 진료 기록 자동 추출 및 저장 · 반려동물 건강 관련 콘텐츠(가이드, 블로그) · 펫토커(반려동물 사진 기반 AI 대사 생성) · 내 근처 동물병원 찾기 · 예방접종·건강검진 일정 관리 및 알림 · 기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스
        </p>
      </>
    ),
  },
  {
    title: '제5조 (이용 계정)',
    content:
      '서비스 이용을 위해서는 Apple, Google, Kakao 등 소셜 로그인을 통한 계정 생성이 필요합니다. 이용자는 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 제3자에게 계정을 양도하거나 공유할 수 없습니다. 계정 관련 문제가 발생한 경우 즉시 회사에 통보하여야 합니다.',
  },
  {
    title: '제6조 (유료 서비스 및 구독)',
    content: (
      <>
        <p>회사는 서비스의 일부 기능을 유료 구독(Pro) 형태로 제공할 수 있으며, 유료 구독의 종류, 가격, 이용 기간 등은 서비스 내 구독 화면에 별도로 안내됩니다.</p>
        <p className="mt-2">구독은 자동 갱신되며, 현재 구독 기간이 만료되기 최소 24시간 전에 자동 갱신을 해제하지 않으면 동일한 가격과 기간으로 자동 결제됩니다. 회사가 무료 체험 기간을 제공하는 경우 체험 기간 종료 후 자동으로 유료 구독으로 전환됩니다. 구독 환불은 각 결제 플랫폼의 환불 정책에 따릅니다.</p>
        <div className="mt-3 rounded-xl bg-[#F8FAFB] px-4 py-3 text-xs text-[#8B95A1]">
          ※ 구독 해지 후에도 이미 결제된 기간까지는 서비스를 이용할 수 있습니다.
        </div>
      </>
    ),
  },
  {
    title: '제7조 (이용자의 의무)',
    content:
      '이용자는 타인의 개인정보를 도용하거나 허위 정보를 등록하는 행위, 서비스를 이용하여 법령 또는 공공질서에 반하는 행위, 서비스의 운영을 방해하거나 비정상적인 방법으로 서비스를 이용하는 행위, 서비스를 통해 얻은 정보를 회사의 사전 승인 없이 상업적으로 이용하는 행위, 서비스의 보안 시스템을 우회하거나 침해하는 행위, 자동화된 수단(봇, 크롤러 등)을 이용하여 서비스에 접근하는 행위를 하여서는 안 됩니다.',
  },
  {
    title: '제8조 (회사의 의무)',
    content:
      '회사는 관련 법령과 본 약관을 준수하며 지속적이고 안정적인 서비스를 제공하기 위해 노력합니다. 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수하며, 서비스 이용과 관련하여 이용자로부터 제기되는 의견이나 불만을 성실히 처리합니다.',
  },
  {
    title: '제9조 (지식재산권)',
    content:
      '서비스에 포함된 소프트웨어, 디자인, 로고, 상표, 텍스트, 이미지 등 일체의 지식재산권은 회사에 귀속됩니다. 이용자가 업로드한 콘텐츠(영수증, 진료 기록, 사진 등)에 대한 권리는 이용자에게 귀속되며, 회사는 서비스 제공 목적 범위 내에서만 이용합니다.',
  },
  {
    title: '제10조 (서비스 중단 및 변경)',
    content:
      '회사는 시스템 점검, 설비 보수, 천재지변, 기타 불가항력적 사유로 서비스 제공을 일시적으로 중단할 수 있으며 사전에 공지합니다. 서비스의 전부 또는 일부를 변경하거나 종료할 수 있으며, 이 경우 30일 전에 서비스 내 공지합니다. 서비스 종료 시 이용자는 본인의 데이터를 백업할 수 있는 기간을 제공받습니다.',
  },
  {
    title: '제11조 (면책 및 책임 제한)',
    content:
      '회사는 이용자가 입력·저장한 정보의 정확성이나 완전성을 보증하지 않습니다. AI 분석, 건강 정보, 진료비 데이터 등은 참고용 정보이며, 수의학적 진단이나 처방을 대체하지 않습니다. 진료비 데이터는 전국 평균 기준이며, 실제 진료비는 병원, 지역, 반려동물의 상태에 따라 달라질 수 있습니다. 천재지변 등 불가항력적 사유로 인한 서비스 장애에 대해 책임을 지지 않으며, 무료 서비스에 대해서는 법령에 특별한 규정이 없는 한 책임을 부담하지 않습니다.',
  },
  {
    title: '제12조 (이용 제한 및 해지)',
    content:
      '회사는 약관을 위반하거나 서비스 운영을 방해하는 경우 사전 통보 후 이용을 제한하거나 계정을 해지할 수 있습니다. 이용자는 언제든지 서비스 내 설정을 통해 탈퇴(계정 삭제)를 요청할 수 있으며, 탈퇴 시 데이터는 복구 불가능한 방법으로 파기됩니다.',
  },
  {
    title: '제13조 (개인정보 보호)',
    content:
      '회사는 「개인정보 보호법」 등 관련 법령을 준수하며 별도의 개인정보처리방침에 따라 개인정보를 처리합니다. 세부 내용은 개인정보처리방침을 참고하시기 바랍니다.',
  },
  {
    title: '제14조 (분쟁 해결)',
    content:
      '본 약관의 해석 및 서비스 이용과 관련한 분쟁은 대한민국 법령을 준거법으로 하며, 회사의 본점 소재지를 관할하는 법원을 전속적 합의관할 법원으로 합니다. 불만이나 분쟁에 대해 support@pluslabkorea.com으로 문의할 수 있습니다.',
  },
  {
    title: '제15조 (기타)',
    content:
      '본 약관에서 정하지 아니한 사항은 관련 법령 또는 상관례에 따릅니다. 일부 조항이 무효 또는 집행 불가능한 것으로 판명되더라도 나머지 조항의 유효성에는 영향을 미치지 않습니다.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff4f4_100%)] px-6 py-14 shadow-[0_24px_70px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[#ff7a45]">TERMS OF SERVICE</p>
          <h1 className="text-[2rem] font-extrabold tracking-tight text-[#17191f] md:text-4xl">이용약관</h1>
          <p className="mt-3 text-sm text-[#697182]">최종 수정일: 2026년 3월 6일 · (주)플러스랩코리아</p>
        </div>
      </section>

      {/* Intro */}
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="-mt-8 rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-6 shadow-[0_10px_28px_rgba(17,24,39,0.07)] ring-1 ring-black/5 md:p-8">
          <p className="text-sm leading-relaxed text-[#697182]">
            본 약관은 (주)플러스랩코리아(이하 &quot;회사&quot;)가 운영하는 PetHealth+(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임 사항을 규정합니다.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
        <div className="space-y-0 overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] shadow-[0_10px_28px_rgba(17,24,39,0.07)] ring-1 ring-black/5">
          {ARTICLES.map((art, i) => (
            <section
              key={art.title}
              className={`px-6 py-8 md:px-10 md:py-10 ${i < ARTICLES.length - 1 ? 'border-b border-black/5' : ''}`}
            >
              <h2 className="mb-3 text-[17px] font-bold text-[#17191f]">{art.title}</h2>
              <div className="text-sm leading-relaxed text-[#697182] [&_p]:mb-1.5">
                {typeof art.content === 'string' ? <p>{art.content}</p> : art.content}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#697182]">
          본 약관은 2026년 3월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
