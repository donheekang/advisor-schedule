const productMappings = [
  { keyword: '혈액검사', productName: '강아지 건강 영양제' },
  { keyword: '스케일링', productName: '반려동물 치석 제거제' },
  { keyword: '예방접종', productName: '강아지 면역력 영양제' },
  { keyword: '수술', productName: '반려동물 보험' }
] as const;

type AffiliateProductsProps = {
  itemName: string;
};

function createCoupangLink(productName: string): string {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(productName)}&channel=user`;

  if (!partnerId) {
    return searchUrl;
  }

  return `${searchUrl}&subid=${encodeURIComponent(partnerId)}`;
}

export default function AffiliateProducts({ itemName }: AffiliateProductsProps) {
  const matchedProduct = productMappings.find(({ keyword }) => itemName.includes(keyword));

  if (!matchedProduct) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-[#1B3A4B]">관련 제품 추천</h2>
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">{matchedProduct.productName}</p>
        <a
          href={createCoupangLink(matchedProduct.productName)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-lg bg-[#1B3A4B] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#24536b]"
        >
          쿠팡에서 보기
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-500">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
    </article>
  );
}
