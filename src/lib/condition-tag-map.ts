export const CONDITION_TO_TAGS: Record<string, string[]> = {
  skin: ['medicine_skin', 'medicine_allergy'],
  dental: ['dental_scaling', 'dental_extraction'],
  patella: ['ortho_patella'],
  joint: ['ortho_arthritis'],
  gi: ['medicine_gi'],
  eye: ['medicine_eye'],
  ear: ['medicine_ear'],
  vaccine: ['vaccine_comprehensive', 'vaccine_rabies'],
  neutering: ['surgery_neutering'],
  heart: ['exam_echo'],
  kidney: ['exam_blood_chem'],
  obesity: ['exam_blood_general']
};

export const CONDITION_LABELS: Record<string, string> = {
  skin: '피부/알러지',
  dental: '구강/치아',
  patella: '슬개골',
  joint: '관절',
  gi: '소화기',
  eye: '눈',
  ear: '귀',
  vaccine: '예방접종',
  neutering: '중성화',
  heart: '심장',
  kidney: '신장',
  obesity: '비만/체중관리'
};

export const TAG_LABELS: Record<string, string> = {
  medicine_skin: '피부 관리',
  medicine_allergy: '알러지 관리',
  dental_scaling: '치석/구강 관리',
  dental_extraction: '치아 회복 관리',
  ortho_patella: '슬개골 관리',
  ortho_arthritis: '관절 관리',
  medicine_gi: '소화기 관리',
  medicine_eye: '눈 건강 관리',
  medicine_ear: '귀 건강 관리',
  vaccine_comprehensive: '종합 예방 관리',
  vaccine_rabies: '광견병 예방',
  surgery_neutering: '중성화 이후 관리',
  exam_echo: '심장 모니터링',
  exam_blood_chem: '혈액 화학검사 체크',
  exam_blood_general: '기본 혈액검사 체크'
};

export const BREED_RISK_TAGS: Record<string, string[]> = {
  말티즈: ['dental_scaling', 'ortho_patella', 'medicine_eye'],
  푸들: ['dental_scaling', 'medicine_skin', 'medicine_ear'],
  포메라니안: ['ortho_patella', 'dental_scaling'],
  치와와: ['dental_scaling', 'ortho_patella', 'medicine_eye'],
  시츄: ['medicine_eye', 'medicine_skin'],
  요크셔테리어: ['dental_scaling', 'ortho_patella', 'exam_blood_general'],
  비숑프리제: ['medicine_skin', 'medicine_ear', 'dental_scaling'],
  웰시코기: ['ortho_arthritis', 'exam_blood_general'],
  닥스훈트: ['ortho_arthritis', 'medicine_gi'],
  시바이누: ['medicine_skin', 'medicine_allergy'],
  골든리트리버: ['ortho_arthritis', 'medicine_skin', 'medicine_ear'],
  래브라도리트리버: ['ortho_arthritis', 'exam_blood_general'],
  프렌치불독: ['medicine_skin', 'medicine_allergy', 'medicine_gi'],
  퍼그: ['medicine_eye', 'medicine_skin', 'medicine_gi'],
  보더콜리: ['exam_echo', 'ortho_arthritis'],
  코리안숏헤어: ['medicine_gi', 'exam_blood_general'],
  러시안블루: ['medicine_eye', 'exam_blood_chem'],
  페르시안: ['medicine_eye', 'medicine_skin'],
  스코티시폴드: ['ortho_arthritis', 'exam_blood_chem'],
  브리티시숏헤어: ['exam_blood_general', 'medicine_ear']
};

export function mapConditionsToTags(conditions: string[]): string[] {
  const tagSet = new Set<string>();

  conditions.forEach((condition) => {
    const tags = CONDITION_TO_TAGS[condition] ?? [];
    tags.forEach((tag) => tagSet.add(tag));
  });

  return [...tagSet];
}

export function getBreedRiskTags(breed: string): string[] {
  const normalizedBreed = breed.trim();
  if (!normalizedBreed) {
    return [];
  }

  const direct = BREED_RISK_TAGS[normalizedBreed];
  if (direct) {
    return direct;
  }

  const fuzzyMatched = Object.entries(BREED_RISK_TAGS).find(([breedName]) =>
    normalizedBreed.includes(breedName) || breedName.includes(normalizedBreed)
  );

  return fuzzyMatched?.[1] ?? [];
}
