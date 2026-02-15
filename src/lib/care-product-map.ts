/**
 * 케어 상품 매핑
 * 앱의 CareShopModels.swift > conditionToReceiptTags + ProductRecommender.allProducts 이식
 *
 * 진료비 검색 결과 하단에 "이 진료를 받았다면, 이런 케어가 도움이 돼요" 섹션 표시
 */

export type CareProduct = {
  name: string;
  category: CareCategory;
  description: string;
  /** 쿠팡 검색 키워드 */
  coupangKeyword: string;
  /** 어떤 진료 태그와 연결되는지 */
  relatedTags: string[];
  /** 왜 추천하는지 한 줄 */
  reason: string;
};

export type CareCategory = 'food_snack' | 'supplement' | 'skin_allergy' | 'oral_care' | 'joint';

export const CARE_CATEGORY_LABELS: Record<CareCategory, string> = {
  food_snack: '사료·간식',
  supplement: '영양제',
  skin_allergy: '피부·알러지',
  oral_care: '구강 케어',
  joint: '관절 케어',
};

/**
 * 진료 키워드 → 관련 케어 태그 매핑
 * cost-search 결과의 matchedItem 기반으로 케어 상품을 연결
 */
export const SEARCH_KEYWORD_TO_CARE_TAGS: Record<string, string[]> = {
  // 치과
  스케일링: ['dental_scaling'],
  발치: ['dental_extraction'],
  치석: ['dental_scaling'],
  치과: ['dental_scaling', 'dental_extraction'],

  // 피부
  피부검사: ['medicine_skin', 'medicine_allergy'],
  피부: ['medicine_skin', 'medicine_allergy'],
  알러지: ['medicine_allergy'],
  가려움: ['medicine_skin', 'medicine_allergy'],
  귀: ['medicine_ear'],

  // 관절
  슬개골: ['ortho_patella'],
  관절: ['ortho_arthritis', 'ortho_patella'],

  // 소화기
  위장: ['medicine_gi'],
  소화: ['medicine_gi'],
  구토: ['medicine_gi'],
  설사: ['medicine_gi'],

  // 예방
  예방접종: ['vaccine_comprehensive'],
  건강검진: ['exam_lab_panel', 'exam_blood_general'],
  혈액검사: ['exam_blood_cbc', 'exam_blood_chem'],
  심장사상충: ['prevent_heartworm'],

  // 수술 일반
  중성화: ['surgery_general'],
  수술: ['surgery_general'],
};

/**
 * 케어 상품 목록
 * 앱의 ProductRecommender.allProducts 핵심 추출
 */
export const CARE_PRODUCTS: CareProduct[] = [
  // ===== 구강 케어 =====
  {
    name: '덴탈껌',
    category: 'oral_care',
    description: '매일 한 개씩 씹는 것만으로 치석 예방에 도움이 돼요.',
    coupangKeyword: '강아지 덴탈껌 치석제거',
    relatedTags: ['dental_scaling', 'dental_extraction'],
    reason: '스케일링 후 치석 재형성을 늦추는 데 가장 간편한 루틴이에요.',
  },
  {
    name: '구강 겔',
    category: 'oral_care',
    description: '칫솔질이 어려운 아이에게 잇몸에 발라주는 방식.',
    coupangKeyword: '강아지 구강겔 치석',
    relatedTags: ['dental_scaling', 'dental_extraction'],
    reason: '칫솔 적응이 안 되는 아이라면 겔로 시작하는 게 현실적이에요.',
  },
  {
    name: '핑거 칫솔',
    category: 'oral_care',
    description: '손가락에 끼워 사용하는 부드러운 칫솔.',
    coupangKeyword: '강아지 핑거칫솔',
    relatedTags: ['dental_scaling', 'dental_extraction'],
    reason: '일반 칫솔보다 거부감이 적어서 양치 입문용으로 좋아요.',
  },

  // ===== 피부·알러지 =====
  {
    name: '저자극 샴푸',
    category: 'skin_allergy',
    description: '피부가 예민한 아이를 위한 약산성 저자극 샴푸.',
    coupangKeyword: '강아지 저자극 샴푸 약산성',
    relatedTags: ['medicine_skin', 'medicine_allergy'],
    reason: '피부 가려움이 반복된다면 샴푸부터 저자극으로 바꿔보세요.',
  },
  {
    name: '오메가3 영양제',
    category: 'supplement',
    description: '피부 장벽 강화와 염증 완화에 도움.',
    coupangKeyword: '강아지 오메가3 피부 영양제',
    relatedTags: ['medicine_skin', 'medicine_allergy', 'medicine_ear'],
    reason: '피부·가려움 반복 시 오메가3가 장기적으로 도움이 돼요.',
  },
  {
    name: '피부 보습 스프레이',
    category: 'skin_allergy',
    description: '건조하거나 가려운 부위에 직접 뿌려주는 보습제.',
    coupangKeyword: '강아지 피부 보습 스프레이',
    relatedTags: ['medicine_skin', 'medicine_allergy'],
    reason: '목욕 사이사이 건조한 부위를 케어해줄 수 있어요.',
  },

  // ===== 관절 케어 =====
  {
    name: '관절 영양제',
    category: 'joint',
    description: '글루코사민 + 콘드로이틴 조합의 관절 보조제.',
    coupangKeyword: '강아지 관절 영양제 글루코사민',
    relatedTags: ['ortho_patella', 'ortho_arthritis'],
    reason: '슬개골·관절 이력이 있으면 관절 영양제를 꾸준히 챙기는 게 좋아요.',
  },
  {
    name: '미끄럼 방지 매트',
    category: 'joint',
    description: '미끄러운 바닥에서 관절 부담을 줄여주는 매트.',
    coupangKeyword: '강아지 미끄럼방지 매트',
    relatedTags: ['ortho_patella', 'ortho_arthritis'],
    reason: '바닥이 미끄러우면 슬개골에 부담이 커져요. 매트가 도움이 돼요.',
  },

  // ===== 영양제 (일반) =====
  {
    name: '종합 영양제',
    category: 'supplement',
    description: '매일 급여하는 기본 영양 보충제.',
    coupangKeyword: '강아지 종합 영양제 멀티비타민',
    relatedTags: ['exam_lab_panel', 'exam_blood_general', 'vaccine_comprehensive'],
    reason: '건강검진이나 혈액검사 후 기본 케어로 영양제를 챙겨보세요.',
  },
  {
    name: '프로바이오틱스',
    category: 'supplement',
    description: '장 건강과 소화를 도와주는 유산균.',
    coupangKeyword: '강아지 유산균 프로바이오틱스',
    relatedTags: ['medicine_gi'],
    reason: '소화기 진료 이력이 있다면 유산균으로 장 환경을 챙겨보세요.',
  },
  {
    name: '면역력 영양제',
    category: 'supplement',
    description: '접종 후 면역 체계를 보조하는 영양제.',
    coupangKeyword: '강아지 면역력 영양제',
    relatedTags: ['vaccine_comprehensive', 'prevent_heartworm'],
    reason: '예방접종 시기에 면역력 보조 영양제를 함께 챙기면 좋아요.',
  },
];

/**
 * 진료비 검색 키워드로 관련 케어 상품을 찾는 함수
 */
export function findCareProductsByKeyword(keyword: string): CareProduct[] {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, '').toLowerCase();

  // 키워드 → 태그 매핑
  const matchedTags = new Set<string>();
  for (const [key, tags] of Object.entries(SEARCH_KEYWORD_TO_CARE_TAGS)) {
    const normalizedKey = key.replace(/\s+/g, '').toLowerCase();
    if (normalizedKeyword.includes(normalizedKey) || normalizedKey.includes(normalizedKeyword)) {
      tags.forEach((tag) => matchedTags.add(tag));
    }
  }

  if (matchedTags.size === 0) return [];

  // 태그가 일치하는 상품 반환
  return CARE_PRODUCTS.filter((product) =>
    product.relatedTags.some((tag) => matchedTags.has(tag))
  );
}

/**
 * 카테고리 slug로 관련 케어 상품을 찾는 함수
 */
export function findCareProductsByCategory(categoryTags: string[]): CareProduct[] {
  const tagSet = new Set(categoryTags);
  return CARE_PRODUCTS.filter((product) =>
    product.relatedTags.some((tag) => tagSet.has(tag))
  );
}

/**
 * 쿠팡 파트너스 검색 URL 생성
 */
export function createCoupangSearchUrl(keyword: string): string {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}&channel=user`;
  if (!partnerId) return searchUrl;
  return `${searchUrl}&subid=${encodeURIComponent(partnerId)}`;
}
