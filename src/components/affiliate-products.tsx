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
    <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
      <h2 className="text-lg font-extrabold text-[#4F2A1D]">🛒 관련 제품 추천</h2>
      <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#D4B8C0] to-[#FFEDD5] p-5 ring-1 ring-[#F8C79F]/30">
        <p className="text-sm font-bold text-[#4F2A1D]">{matchedProduct.productName}</p>
        <a
          href={createCoupangLink(matchedProduct.productName)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-2xl bg-gradient-to-r from-[#48B8D0] to-[#FB923C] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
        >
          쿠팡에서 보기
        </a>
      </div>
      <p className="mt-3 text-xs text-[#A36241]">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </article>
  );
}
