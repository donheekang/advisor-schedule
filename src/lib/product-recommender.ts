export type ProductCategory =
  | '구강케어'
  | '피부/알러지'
  | '관절'
  | '소화'
  | '영양/면역'
  | '예방';

export type Product = {
  name: string;
  category: ProductCategory;
  ingredients: string[];
  coupangKeyword: string;
  reason: string;
  priority: number;
  relatedTags: string[];
  caution?: string;
};

const PRODUCT_CATALOG: Product[] = [
  { name: '덴탈껌 데일리 타입', category: '구강케어', ingredients: ['해조분말'], coupangKeyword: '강아지 덴탈껌 데일리', reason: '매일 씹는 루틴으로 치태 관리에 도움이 돼요.', priority: 9, relatedTags: ['dental_scaling', 'dental_extraction'] },
  { name: '덴탈껌 하드 타입', category: '구강케어', ingredients: ['셀룰로오스'], coupangKeyword: '강아지 덴탈껌 하드', reason: '씹는 시간이 길어 구강 자극 유지에 좋아요.', priority: 8, relatedTags: ['dental_scaling'] },
  { name: '덴탈껌 소프트 타입', category: '구강케어', ingredients: ['저알러지 단백질'], coupangKeyword: '강아지 덴탈껌 소프트', reason: '치아가 약한 아이도 비교적 부담이 적어요.', priority: 8, relatedTags: ['dental_extraction'] },
  { name: '구강겔', category: '구강케어', ingredients: ['클로로필'], coupangKeyword: '반려동물 구강겔', reason: '칫솔질이 어려운 아이의 보조 케어로 좋아요.', priority: 8, relatedTags: ['dental_scaling', 'dental_extraction'] },
  { name: '핑거칫솔', category: '구강케어', ingredients: ['실리콘'], coupangKeyword: '강아지 핑거칫솔', reason: '입문 양치 루틴에 적응하기 쉬워요.', priority: 7, relatedTags: ['dental_scaling', 'dental_extraction'] },
  { name: '치태파우더', category: '구강케어', ingredients: ['효소복합체'], coupangKeyword: '강아지 치태 파우더', reason: '사료에 뿌려 구강 관리 습관을 만들기 좋아요.', priority: 7, relatedTags: ['dental_scaling'] },

  { name: '저자극샴푸', category: '피부/알러지', ingredients: ['세라마이드', '오트밀'], coupangKeyword: '반려동물 저자극 샴푸', reason: '피부 자극을 줄이는 기본 케어 제품이에요.', priority: 9, relatedTags: ['medicine_skin', 'medicine_allergy', 'medicine_ear'] },
  { name: '오메가3 영양제', category: '피부/알러지', ingredients: ['오메가3', '어유'], coupangKeyword: '강아지 오메가3 영양제', reason: '피부 장벽과 피모 관리에 보조적으로 좋아요.', priority: 9, relatedTags: ['medicine_skin', 'medicine_allergy', 'medicine_ear', 'medicine_eye'] },
  { name: '보습스프레이', category: '피부/알러지', ingredients: ['히알루론산', '판테놀'], coupangKeyword: '반려동물 피부 보습 스프레이', reason: '건조한 부위를 수시로 관리할 수 있어요.', priority: 8, relatedTags: ['medicine_skin', 'medicine_allergy'] },
  { name: '세라마이드크림', category: '피부/알러지', ingredients: ['세라마이드'], coupangKeyword: '반려동물 세라마이드 크림', reason: '피부 장벽 관리 루틴에 도움이 돼요.', priority: 8, relatedTags: ['medicine_skin', 'medicine_allergy'] },
  { name: '귀세정제', category: '피부/알러지', ingredients: ['알로에베라'], coupangKeyword: '강아지 귀세정제', reason: '귀 케어 주기를 일정하게 유지하는 데 유용해요.', priority: 7, relatedTags: ['medicine_ear'] },
  { name: '저알러지 간식', category: '피부/알러지', ingredients: ['단일단백질', '오리'], coupangKeyword: '강아지 저알러지 간식', reason: '피부 민감 아이의 간식 선택 폭을 넓혀줘요.', priority: 6, relatedTags: ['medicine_allergy'] },

  { name: '글루코사민 영양제', category: '관절', ingredients: ['글루코사민', '콘드로이틴'], coupangKeyword: '강아지 글루코사민', reason: '슬개골/관절 이력 아이의 기본 보조제로 많이 써요.', priority: 9, relatedTags: ['ortho_patella', 'ortho_arthritis'] },
  { name: 'MSM 관절케어', category: '관절', ingredients: ['MSM'], coupangKeyword: '강아지 MSM 관절', reason: '활동량이 많은 아이의 관절 케어에 보조적으로 좋아요.', priority: 7, relatedTags: ['ortho_arthritis'] },
  { name: '미끄럼방지매트', category: '관절', ingredients: ['논슬립'], coupangKeyword: '강아지 미끄럼방지 매트', reason: '실내 미끄럼을 줄여 관절 부담을 낮춰줘요.', priority: 9, relatedTags: ['ortho_patella', 'ortho_arthritis'] },
  { name: '관절보호 슬로프', category: '관절', ingredients: ['완충폼'], coupangKeyword: '강아지 침대 슬로프', reason: '점프를 줄여 관절 충격을 줄이는 데 도움 돼요.', priority: 8, relatedTags: ['ortho_patella', 'ortho_arthritis'] },
  { name: '반려동물 계단', category: '관절', ingredients: ['완충폼'], coupangKeyword: '반려동물 계단', reason: '소파/침대 오르내릴 때 관절 부담을 덜어줘요.', priority: 8, relatedTags: ['ortho_patella', 'ortho_arthritis'] },

  { name: '프로바이오틱스', category: '소화', ingredients: ['프로바이오틱스'], coupangKeyword: '강아지 유산균 프로바이오틱스', reason: '장 컨디션 관리의 기본 제품이에요.', priority: 9, relatedTags: ['medicine_gi'] },
  { name: '소화효소', category: '소화', ingredients: ['소화효소'], coupangKeyword: '반려동물 소화효소', reason: '식후 더부룩함이 잦은 아이에게 보조적으로 좋아요.', priority: 8, relatedTags: ['medicine_gi'] },
  { name: '저자극사료 연어', category: '소화', ingredients: ['연어', '저알러지곡물'], coupangKeyword: '강아지 저자극 사료 연어', reason: '장과 피부를 함께 고려한 식단으로 많이 선택해요.', priority: 8, relatedTags: ['medicine_gi', 'medicine_allergy'] },
  { name: '저자극사료 오리', category: '소화', ingredients: ['오리', '고구마'], coupangKeyword: '강아지 저자극 사료 오리', reason: '단일단백질 기반으로 소화 부담 완화에 도움돼요.', priority: 7, relatedTags: ['medicine_gi', 'medicine_allergy'] },
  { name: '장건강 트릿', category: '소화', ingredients: ['프리바이오틱스'], coupangKeyword: '강아지 장건강 간식', reason: '간식으로 장 케어 루틴을 유지하기 좋아요.', priority: 6, relatedTags: ['medicine_gi'] },

  { name: '종합영양제', category: '영양/면역', ingredients: ['종합비타민'], coupangKeyword: '강아지 종합영양제', reason: '기본 영양 밸런스 보완을 위해 많이 사용해요.', priority: 8, relatedTags: ['exam_blood_general', 'exam_blood_chem', 'vaccine_comprehensive'] },
  { name: '면역력영양제', category: '영양/면역', ingredients: ['베타글루칸'], coupangKeyword: '강아지 면역력 영양제', reason: '면역 컨디션 케어 시기에 보조적으로 좋아요.', priority: 8, relatedTags: ['vaccine_comprehensive', 'vaccine_rabies'] },
  { name: '비타민E', category: '영양/면역', ingredients: ['비타민E'], coupangKeyword: '반려동물 비타민E', reason: '항산화 기반의 일상 컨디션 관리에 활용돼요.', priority: 7, relatedTags: ['vaccine_comprehensive', 'exam_blood_general'] },
  { name: '코엔자임Q10', category: '영양/면역', ingredients: ['코엔자임Q10'], coupangKeyword: '강아지 코엔자임Q10', reason: '중장년 아이의 활동 컨디션 관리에 고려할 수 있어요.', priority: 7, relatedTags: ['exam_echo', 'exam_blood_chem'] },
  { name: '루테인', category: '영양/면역', ingredients: ['루테인'], coupangKeyword: '반려동물 루테인', reason: '눈 건강 케어 루틴에 자주 포함되는 성분이에요.', priority: 7, relatedTags: ['medicine_eye'] },

  { name: '심장사상충약', category: '예방', ingredients: ['예방성분'], coupangKeyword: '강아지 심장사상충 예방약', reason: '예방 루틴을 지키는 것이 가장 중요해요.', priority: 10, relatedTags: ['vaccine_comprehensive', 'exam_echo'] },
  { name: '외부기생충예방', category: '예방', ingredients: ['예방성분'], coupangKeyword: '강아지 외부기생충 예방', reason: '야외 활동이 있다면 정기 예방이 꼭 필요해요.', priority: 9, relatedTags: ['vaccine_comprehensive'] },
  { name: '귀/눈 클리너 세트', category: '예방', ingredients: ['세정성분'], coupangKeyword: '반려동물 눈물 귀 세정', reason: '정기적인 위생 관리로 문제를 미리 예방할 수 있어요.', priority: 6, relatedTags: ['medicine_eye', 'medicine_ear'] },
  { name: '체중관리 사료', category: '예방', ingredients: ['저지방'], coupangKeyword: '강아지 체중관리 사료', reason: '체중 증가 경향이 있으면 식단 관리가 가장 중요해요.', priority: 8, relatedTags: ['exam_blood_general'] },
  { name: '중성화 후 케어 사료', category: '예방', ingredients: ['저칼로리'], coupangKeyword: '중성화 후 사료', reason: '중성화 이후 체중/대사 관리에 맞춘 제품이에요.', priority: 7, relatedTags: ['surgery_neutering'] }
];

export function getRecommendedProducts(tags: string[], allergies: string[] = []): Product[] {
  const tagSet = new Set(tags);
  const normalizedAllergies = allergies.map((item) => item.trim().toLowerCase()).filter(Boolean);

  return PRODUCT_CATALOG
    .filter((product) => product.relatedTags.some((tag) => tagSet.has(tag)))
    .map((product) => {
      if (normalizedAllergies.length === 0) {
        return product;
      }

      const searchableText = `${product.name} ${product.ingredients.join(' ')} ${product.reason}`.toLowerCase();
      const hasAllergyConflict = normalizedAllergies.some((allergy) => searchableText.includes(allergy));

      if (!hasAllergyConflict) {
        return product;
      }

      return {
        ...product,
        caution: `알러지 주의: ${normalizedAllergies.join(', ')} 성분과 겹칠 수 있어요.`
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 15);
}

export function groupProductsByCategory(products: Product[]): Record<ProductCategory, Product[]> {
  return products.reduce(
    (acc, product) => {
      acc[product.category].push(product);
      return acc;
    },
    {
      구강케어: [],
      '피부/알러지': [],
      관절: [],
      소화: [],
      '영양/면역': [],
      예방: []
    } as Record<ProductCategory, Product[]>
  );
}
