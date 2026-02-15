/**
 * 진료비 카테고리 데이터
 * 앱의 FeeCategory (7개) + ReceiptTag 세부 항목 기반
 * SEO 카테고리 페이지용
 */

export type FeeCategory = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  /** Supabase health_items.category_tag 검색용 키워드 */
  searchTags: string[];
  /** 시드 데이터에서 매칭할 키워드 */
  seedKeywords: string[];
  /** 관련 케어 태그 (care-product-map에서 사용) */
  relatedCareTags: string[];
  /** SEO 메타 설명 */
  metaDescription: string;
};

export const FEE_CATEGORIES: FeeCategory[] = [
  {
    slug: 'exam',
    title: '진찰료',
    description: '초진, 재진, 야간/휴일 진찰비를 확인하세요.',
    icon: '🩺',
    searchTags: ['진찰', '초진', '재진', '야간', '휴일'],
    seedKeywords: [],
    relatedCareTags: [],
    metaDescription:
      '강아지·고양이 진찰료 평균 비용을 전국 실데이터로 비교해보세요. 초진, 재진, 야간/휴일 진찰비 안내.',
  },
  {
    slug: 'vaccine',
    title: '예방접종',
    description: '종합백신, 광견병, 코로나, 켄넬코프 접종 비용.',
    icon: '💉',
    searchTags: ['예방접종', '백신', '종합백신', '광견병', '코로나', '켄넬코프'],
    seedKeywords: ['예방접종'],
    relatedCareTags: ['vaccine_comprehensive', 'vaccine_rabies', 'vaccine_corona', 'vaccine_kennel'],
    metaDescription:
      '강아지·고양이 예방접종 비용 비교. 종합백신, 광견병, 코로나, 켄넬코프 전국 평균 가격 안내.',
  },
  {
    slug: 'lab',
    title: '혈액검사',
    description: 'CBC, 생화학, 종합패널 등 혈액검사 비용.',
    icon: '🧪',
    searchTags: ['혈액검사', 'CBC', '생화학', '종합검사', '종합패널'],
    seedKeywords: ['혈액검사', '건강검진'],
    relatedCareTags: ['exam_blood_cbc', 'exam_blood_chem', 'exam_blood_general', 'exam_lab_panel'],
    metaDescription:
      '강아지·고양이 혈액검사 비용 비교. CBC, 생화학, 종합패널 전국 평균 가격 안내.',
  },
  {
    slug: 'imaging',
    title: '영상검사',
    description: 'X-ray, 초음파, 심장초음파, MRI, CT 비용.',
    icon: '📡',
    searchTags: ['방사선', 'X-ray', '초음파', '심장초음파', 'MRI', 'CT', '엑스레이'],
    seedKeywords: ['방사선', '초음파', 'MRI', 'CT'],
    relatedCareTags: ['exam_xray', 'exam_us_abdomen', 'exam_us_general', 'exam_echo'],
    metaDescription:
      '강아지·고양이 영상검사 비용 비교. X-ray, 초음파, MRI, CT 전국 평균 가격 안내.',
  },
  {
    slug: 'dental',
    title: '치과',
    description: '스케일링, 발치 등 치과 진료 비용.',
    icon: '🦷',
    searchTags: ['스케일링', '발치', '치과', '치석'],
    seedKeywords: ['스케일링', '발치'],
    relatedCareTags: ['dental_scaling', 'dental_extraction'],
    metaDescription:
      '강아지·고양이 스케일링·발치 비용 비교. 전국 치과 진료 평균 가격 안내.',
  },
  {
    slug: 'surgery',
    title: '수술',
    description: '중성화, 슬개골, 기타 수술 비용.',
    icon: '🔪',
    searchTags: ['수술', '중성화', '슬개골', '슬개골수술'],
    seedKeywords: ['중성화 수컷', '중성화 암컷', '슬개골수술'],
    relatedCareTags: ['ortho_patella', 'ortho_arthritis', 'surgery_general'],
    metaDescription:
      '강아지·고양이 수술 비용 비교. 중성화, 슬개골수술 전국 평균 가격 안내.',
  },
  {
    slug: 'medication',
    title: '투약/조제',
    description: '항생제, 소염제, 피부약, 위장약 등 처방 비용.',
    icon: '💊',
    searchTags: ['투약', '조제', '항생제', '소염제', '피부약', '위장약', '알러지약'],
    seedKeywords: [],
    relatedCareTags: [
      'medicine_antibiotic',
      'medicine_anti_inflammatory',
      'medicine_skin',
      'medicine_gi',
      'medicine_allergy',
      'medicine_ear',
      'medicine_eye',
      'medicine_painkiller',
    ],
    metaDescription:
      '강아지·고양이 투약·조제 비용 비교. 항생제, 소염제, 피부약, 위장약 전국 평균 가격 안내.',
  },
];

export function getCategoryBySlug(slug: string): FeeCategory | undefined {
  return FEE_CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return FEE_CATEGORIES.map((c) => c.slug);
}
