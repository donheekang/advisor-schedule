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
  {
    name: '치태 파우더',
    category: 'oral_care',
    description: '사료에 뿌려주기만 하면 되는 구강 관리 파우더.',
    coupangKeyword: '강아지 치태 파우더 치석',
    relatedTags: ['dental_scaling'],
    reason: '칫솔질이 어려운 아이에게 가장 쉬운 구강 관리법이에요.',
  },
  {
    name: '구강 물티슈',
    category: 'oral_care',
    description: '손가락에 감아 닦아주는 일회용 구강 티슈.',
    coupangKeyword: '강아지 구강 물티슈 치석',
    relatedTags: ['dental_scaling', 'dental_extraction'],
    reason: '외출 후나 간식 후 간편하게 닦아줄 수 있어요.',
  },
  {
    name: '구강 스프레이',
    category: 'oral_care',
    description: '입 냄새와 치면 세균 관리를 돕는 데일리 스프레이.',
    coupangKeyword: '강아지 구강 스프레이 치석',
    relatedTags: ['dental_scaling', 'dental_extraction'],
    reason: '양치가 어려운 날에 보조 루틴으로 사용하기 좋아요.',
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
  {
    name: '세라마이드 크림',
    category: 'skin_allergy',
    description: '피부 장벽을 강화하는 보습 크림.',
    coupangKeyword: '강아지 세라마이드 크림 피부',
    relatedTags: ['medicine_skin', 'medicine_allergy'],
    reason: '건조하고 갈라진 피부에 직접 발라주면 장벽 회복에 도움이 돼요.',
  },
  {
    name: '약용 샴푸',
    category: 'skin_allergy',
    description: '수의사 처방 기반의 약용 샴푸.',
    coupangKeyword: '강아지 약용 샴푸 피부병',
    relatedTags: ['medicine_skin'],
    reason: '피부 감염이 반복되면 일반 샴푸 대신 약용 샴푸를 사용하세요.',
  },
  {
    name: '항진균 스프레이',
    category: 'skin_allergy',
    description: '곰팡이성 피부염용 스프레이.',
    coupangKeyword: '강아지 항진균 스프레이 피부',
    relatedTags: ['medicine_skin'],
    reason: '곰팡이 피부염이 진단되면 국소 스프레이로 관리할 수 있어요.',
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
  {
    name: '반려동물 계단/슬로프',
    category: 'joint',
    description: '소파나 침대에 오르내리는 계단.',
    coupangKeyword: '강아지 계단 슬로프 슬개골',
    relatedTags: ['ortho_patella', 'ortho_arthritis'],
    reason: '높은 곳에서 뛰어내리는 대신 계단을 사용하면 관절 부담을 줄여요.',
  },
  {
    name: '관절 보온 밴드',
    category: 'joint',
    description: '겨울철 관절 보온용 밴드.',
    coupangKeyword: '강아지 관절 보호대 보온',
    relatedTags: ['ortho_arthritis'],
    reason: '추운 날 관절이 뻣뻣해지는 걸 방지해줘요.',
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
  {
    name: '소화효소 보조제',
    category: 'supplement',
    description: '소화를 돕는 효소 보조제.',
    coupangKeyword: '강아지 소화효소 보조제',
    relatedTags: ['medicine_gi'],
    reason: '소화가 약한 아이에게 사료와 함께 급여하면 도움이 돼요.',
  },
  {
    name: '비타민E 영양제',
    category: 'supplement',
    description: '피부·면역 건강에 도움되는 비타민E.',
    coupangKeyword: '강아지 비타민E 영양제',
    relatedTags: ['medicine_skin', 'vaccine_comprehensive'],
    reason: '피부 건강과 면역력 보조에 도움이 돼요.',
  },
  {
    name: '간건강 영양제',
    category: 'supplement',
    description: '밀크씨슬 기반 간 보호 영양제.',
    coupangKeyword: '강아지 간건강 영양제 밀크씨슬',
    relatedTags: ['exam_blood_chem', 'exam_blood_general', 'exam_lab_panel'],
    reason: '혈액검사에서 간 수치가 높았다면 간 보호 영양제를 고려하세요.',
  },
  {
    name: '심장사상충 예방약',
    category: 'supplement',
    description: '매월 1회 급여하는 심장사상충 예방약.',
    coupangKeyword: '강아지 심장사상충 예방약',
    relatedTags: ['prevent_heartworm', 'vaccine_comprehensive'],
    reason: '심장사상충은 예방이 최선이에요. 매월 같은 날 급여하세요.',
  },
  {
    name: '외부기생충 예방약',
    category: 'supplement',
    description: '진드기·벼룩 예방 약.',
    coupangKeyword: '강아지 진드기 예방약 외부기생충',
    relatedTags: ['vaccine_comprehensive', 'prevent_heartworm'],
    reason: '야외 활동이 많다면 외부기생충 예방을 꼭 챙기세요.',
  },
  {
    name: '내부구충제',
    category: 'supplement',
    description: '장내 기생충 예방·치료용.',
    coupangKeyword: '강아지 내부구충제',
    relatedTags: ['vaccine_comprehensive', 'medicine_gi'],
    reason: '3~6개월마다 내부구충을 해주는 게 좋아요.',
  },
  {
    name: '눈물 세정제',
    category: 'supplement',
    description: '눈물자국 제거 및 눈 주변 세정.',
    coupangKeyword: '강아지 눈물 세정제 눈물자국',
    relatedTags: ['medicine_eye'],
    reason: '매일 눈물을 닦아주면 눈물자국과 감염을 예방할 수 있어요.',
  },
  {
    name: '귀 세정제',
    category: 'supplement',
    description: '귀 안 세정 및 외이염 예방.',
    coupangKeyword: '강아지 귀 세정제 외이염',
    relatedTags: ['medicine_ear'],
    reason: '주 1~2회 귀 세정으로 외이염을 예방하세요.',
  },

  // ===== 식이 =====
  {
    name: '저자극 사료',
    category: 'food_snack',
    description: 'LID(제한 단백질) 저자극 사료.',
    coupangKeyword: '강아지 저자극 사료 LID',
    relatedTags: ['medicine_gi', 'medicine_allergy'],
    reason: '식이 알러지나 소화 문제가 있으면 저자극 사료로 전환을 고려하세요.',
  },
  {
    name: '유산균 간식',
    category: 'food_snack',
    description: '프로바이오틱스가 들어간 간식.',
    coupangKeyword: '강아지 유산균 간식 프로바이오틱스',
    relatedTags: ['medicine_gi'],
    reason: '간식으로 자연스럽게 장 건강을 챙길 수 있어요.',
  },
  {
    name: '회복 습식 파우치',
    category: 'food_snack',
    description: '발치·수술 후 먹이기 쉬운 부드러운 습식 사료.',
    coupangKeyword: '강아지 회복식 습식 사료',
    relatedTags: ['dental_extraction', 'surgery_general'],
    reason: '입 안 통증이 있거나 회복 중일 때 급여 부담을 줄여줘요.',
  },
];

export function findCareTagsByKeyword(keyword: string): string[] {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, '').toLowerCase();
  const matchedTags = new Set<string>();

  for (const [key, tags] of Object.entries(SEARCH_KEYWORD_TO_CARE_TAGS)) {
    const normalizedKey = key.replace(/\s+/g, '').toLowerCase();
    if (normalizedKeyword.includes(normalizedKey) || normalizedKey.includes(normalizedKeyword)) {
      tags.forEach((tag) => matchedTags.add(tag));
    }
  }

  return [...matchedTags];
}

/**
 * 진료비 검색 키워드로 관련 케어 상품을 찾는 함수
 */
export function findCareProductsByKeyword(keyword: string): CareProduct[] {
  const matchedTags = findCareTagsByKeyword(keyword);
  if (matchedTags.length === 0) return [];

  const tagSet = new Set(matchedTags);
  return CARE_PRODUCTS.filter((product) => product.relatedTags.some((tag) => tagSet.has(tag)));
}

/**
 * 카테고리 slug로 관련 케어 상품을 찾는 함수
 */
export function findCareProductsByCategory(categoryTags: string[]): CareProduct[] {
  const tagSet = new Set(categoryTags);
  return CARE_PRODUCTS.filter((product) => product.relatedTags.some((tag) => tagSet.has(tag)));
}

/**
 * 쿠팡 파트너스 검색 URL 생성
 */
export function createCoupangSearchUrl(_keyword: string): string {
  void _keyword;
  return 'https://link.coupang.com/a/dQ6w5N';
}
