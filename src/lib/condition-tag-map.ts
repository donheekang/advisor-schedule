import { COST_SEARCH_SEED_DATA } from '@/lib/cost-search-seed';
import { FEE_CATEGORIES } from '@/lib/fee-categories';

export type BreedRiskItem = {
  condition: string;
  category: 'exam' | 'vaccine' | 'lab' | 'imaging' | 'dental' | 'surgery' | 'medication';
  careGuide: string;
};

export type BreedProfile = {
  breed: string;
  species: 'dog' | 'cat';
  intro: string;
  riskTags: BreedRiskItem[];
};

export const BREED_PROFILES: BreedProfile[] = [
  {
    breed: '말티즈',
    species: 'dog',
    intro: '눈물, 치아, 슬개골 관리가 중요한 소형견이에요.',
    riskTags: [
      { condition: '치과 스케일링', category: 'dental', careGuide: '정기 스케일링 전후 양치 루틴을 꾸준히 유지하세요.' },
      { condition: '슬개골 검진', category: 'surgery', careGuide: '미끄럼 방지 환경과 체중 관리를 함께 진행하세요.' },
      { condition: '정기 혈액검사', category: 'lab', careGuide: '연 1회 기본 패널을 유지해 변화 추이를 확인하세요.' },
      { condition: '피부약 처방', category: 'medication', careGuide: '샴푸 주기와 처방약 복용 일정을 기록해두세요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '접종 일정표를 만들어 누락 없이 관리하세요.' },
    ],
  },
  {
    breed: '푸들',
    species: 'dog',
    intro: '귀·피부와 치아 관리 수요가 많은 품종이에요.',
    riskTags: [
      { condition: '외이염 투약', category: 'medication', careGuide: '귀 세정 루틴과 재진 일정을 함께 잡아주세요.' },
      { condition: '치과 스케일링', category: 'dental', careGuide: '간식 후 구강 케어를 습관화하면 재발을 줄일 수 있어요.' },
      { condition: '피부검사', category: 'lab', careGuide: '알레르기 유발 요인을 생활 환경에서 함께 점검하세요.' },
      { condition: '초음파 검사', category: 'imaging', careGuide: '반복 증상이 있으면 동일 병원에서 추적 검사를 권장해요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '접종 후 반응 체크를 위해 당일 안정을 유지하세요.' },
    ],
  },
  {
    breed: '포메라니안',
    species: 'dog',
    intro: '기관·심장·치과 관련 관리가 자주 언급되는 품종이에요.',
    riskTags: [
      { condition: '심장 초음파', category: 'imaging', careGuide: '호흡 변화가 보이면 추적 검사 간격을 줄이세요.' },
      { condition: '치과 스케일링', category: 'dental', careGuide: '작은 턱 구조를 고려해 저자극 칫솔을 사용하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '시니어 전환기에는 혈액검사 주기를 짧게 가져가세요.' },
      { condition: '기관지약 처방', category: 'medication', careGuide: '운동량 조절과 체중 관리를 함께 진행하세요.' },
      { condition: '진찰료', category: 'exam', careGuide: '기침 증상은 영상검사 필요 여부를 진찰 시 함께 상담하세요.' },
    ],
  },
  {
    breed: '치와와',
    species: 'dog',
    intro: '치과·관절·저체온 관리가 중요한 초소형견이에요.',
    riskTags: [
      { condition: '치과 진료', category: 'dental', careGuide: '정기 치석 관리와 식단 점검을 병행하세요.' },
      { condition: '슬개골 진료', category: 'surgery', careGuide: '점프 습관을 줄이고 계단 사용을 제한하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '식욕 저하 시 빠르게 기초 검사를 진행하세요.' },
      { condition: '진찰료', category: 'exam', careGuide: '체온 저하가 의심되면 바로 내원해 진찰을 받으세요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '접종 후 체온/활력 체크를 특히 꼼꼼히 하세요.' },
    ],
  },
  {
    breed: '비숑프리제',
    species: 'dog',
    intro: '피부·눈·치과 관리 수요가 꾸준한 품종이에요.',
    riskTags: [
      { condition: '피부 투약', category: 'medication', careGuide: '약욕/샴푸 루틴을 기록해 변화 추이를 확인하세요.' },
      { condition: '치과 스케일링', category: 'dental', careGuide: '간식 선택을 저당·저착색 위주로 조정하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '정기 검진으로 만성 질환 신호를 조기 확인하세요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '구토·설사 반복 시 영상검사를 고려해보세요.' },
      { condition: '진찰료', category: 'exam', careGuide: '피부 증상은 계절 패턴을 기록해 진찰에 활용하세요.' },
    ],
  },
  {
    breed: '골든리트리버',
    species: 'dog',
    intro: '대형견 특성상 관절·종양·소화기 검진이 중요해요.',
    riskTags: [
      { condition: '관절 진찰', category: 'exam', careGuide: '체중 증가 시 관절 부담이 커져 조기 관리가 필요해요.' },
      { condition: '십자인대 수술', category: 'surgery', careGuide: '재활 계획과 미끄럼 방지 환경을 함께 준비하세요.' },
      { condition: '혈액검사 패널', category: 'lab', careGuide: '시니어 단계에서는 반기 검진을 권장해요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '식욕 변화가 지속되면 영상검사를 검토하세요.' },
      { condition: '소염제 처방', category: 'medication', careGuide: '장기 복용 시 재검 주기를 반드시 확인하세요.' },
    ],
  },
  {
    breed: '래브라도리트리버',
    species: 'dog',
    intro: '비만·관절·피부 질환 관리가 중요한 대형견이에요.',
    riskTags: [
      { condition: '관절 진료', category: 'exam', careGuide: '체중 조절과 운동 루틴을 함께 관리하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '연 1회 이상 대사성 질환 스크리닝을 권장해요.' },
      { condition: '피부약 처방', category: 'medication', careGuide: '알레르기 원인 노출 환경을 함께 줄여주세요.' },
      { condition: '초음파 검사', category: 'imaging', careGuide: '비만 동반 시 내과 검진 빈도를 높여보세요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '야외활동 빈도에 맞춘 접종 상담을 권장해요.' },
    ],
  },
  {
    breed: '웰시코기',
    species: 'dog',
    intro: '허리·관절·체중 관리가 핵심인 품종이에요.',
    riskTags: [
      { condition: '정형외과 진찰', category: 'exam', careGuide: '점프·계단을 줄이고 코어 근육 운동을 병행하세요.' },
      { condition: 'X-ray 촬영', category: 'imaging', careGuide: '보행 이상이 보이면 영상검사를 빠르게 진행하세요.' },
      { condition: '슬개골/십자인대 수술', category: 'surgery', careGuide: '수술 후 재활 일정을 주 단위로 계획하세요.' },
      { condition: '소염제 처방', category: 'medication', careGuide: '복용 시 위장 반응을 관찰해 수의사와 공유하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '장기 약 복용 중이라면 정기 혈액검사를 권장해요.' },
    ],
  },
  {
    breed: '시바이누',
    species: 'dog',
    intro: '피부·알레르기·소화기 체크가 자주 필요한 견종이에요.',
    riskTags: [
      { condition: '피부 진찰', category: 'exam', careGuide: '가려움 유발 시즌을 기록해 상담 시 활용하세요.' },
      { condition: '피부검사', category: 'lab', careGuide: '약물 반응을 기록하면 처방 최적화에 도움이 돼요.' },
      { condition: '피부약 처방', category: 'medication', careGuide: '목욕 주기와 약 복용을 함께 맞추세요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '소화기 증상 재발 시 영상검사를 고려하세요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '야외 활동 후 기생충 예방 일정을 체크하세요.' },
    ],
  },
  {
    breed: '프렌치불도그',
    species: 'dog',
    intro: '호흡기·피부·척추 관련 진료가 많은 견종이에요.',
    riskTags: [
      { condition: '호흡기 진찰', category: 'exam', careGuide: '더운 날씨에는 활동 시간을 짧게 조절하세요.' },
      { condition: 'X-ray/CT', category: 'imaging', careGuide: '호흡 소음 증가 시 영상검사를 고려하세요.' },
      { condition: '피부약 처방', category: 'medication', careGuide: '피부 주름 부위 청결을 매일 관리하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '마취가 필요한 검사 전 혈액검사를 확인하세요.' },
      { condition: '수술 진료', category: 'surgery', careGuide: '수술 전후 호흡 모니터링 계획을 꼭 세우세요.' },
    ],
  },
  {
    breed: '요크셔테리어',
    species: 'dog',
    intro: '치아·기관·간 기능 관련 관리가 자주 필요해요.',
    riskTags: [
      { condition: '치과 진료', category: 'dental', careGuide: '작은 치열 특성상 정기 치아 검진이 중요해요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '간 수치 추적을 위해 검진 주기를 유지하세요.' },
      { condition: '기관지 진찰', category: 'exam', careGuide: '목줄 대신 하네스를 사용해 자극을 줄이세요.' },
      { condition: '초음파 검사', category: 'imaging', careGuide: '간·담도 상태 확인을 위한 영상검사를 고려하세요.' },
      { condition: '기침약 처방', category: 'medication', careGuide: '기침 빈도를 기록해 재진 시 공유하세요.' },
    ],
  },
  {
    breed: '닥스훈트',
    species: 'dog',
    intro: '디스크·관절 관리가 특히 중요한 견종이에요.',
    riskTags: [
      { condition: '정형외과 진찰', category: 'exam', careGuide: '높은 곳 점프를 제한해 허리 부담을 줄이세요.' },
      { condition: 'X-ray 촬영', category: 'imaging', careGuide: '통증 신호가 보이면 영상검사를 우선 고려하세요.' },
      { condition: '척추 수술 상담', category: 'surgery', careGuide: '재활 기간과 비용 범위를 미리 확인하세요.' },
      { condition: '소염제 처방', category: 'medication', careGuide: '약 복용 시 식욕·활력 변화를 기록하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '장기 약 복용 시 간/신장 수치를 추적하세요.' },
    ],
  },
  {
    breed: '코리안숏헤어',
    species: 'cat',
    intro: '소화기·치과·비뇨기 체크가 자주 필요한 고양이예요.',
    riskTags: [
      { condition: '진찰료', category: 'exam', careGuide: '식욕/음수량 변화를 메모해 내원 시 전달하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '정기검진으로 신장·간 수치를 체크하세요.' },
      { condition: '스케일링', category: 'dental', careGuide: '간식 후 구강 케어 습관을 들이세요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '구토 반복 시 영상검사를 고려해보세요.' },
      { condition: '소화기 투약', category: 'medication', careGuide: '약 복용 시간과 반응을 일지로 관리하세요.' },
    ],
  },
  {
    breed: '브리티시숏헤어',
    species: 'cat',
    intro: '비만·치과·심장 검진을 꾸준히 보는 편이에요.',
    riskTags: [
      { condition: '정기 진찰', category: 'exam', careGuide: '체중 증가 추세를 월 단위로 기록하세요.' },
      { condition: '혈액검사 패널', category: 'lab', careGuide: '대사 질환 스크리닝을 정기적으로 받으세요.' },
      { condition: '심장 초음파', category: 'imaging', careGuide: '호흡 변화가 보이면 심장 검사를 우선하세요.' },
      { condition: '스케일링', category: 'dental', careGuide: '치석이 빠르게 쌓이는지 주기적으로 확인하세요.' },
      { condition: '체중 관리 처방', category: 'medication', careGuide: '사료량 조절과 활동량 증가를 병행하세요.' },
    ],
  },
  {
    breed: '러시안블루',
    species: 'cat',
    intro: '스트레스성 질환과 구강 관리에 신경 쓰는 품종이에요.',
    riskTags: [
      { condition: '진찰료', category: 'exam', careGuide: '환경 변화 후 식욕·배변 변화를 체크하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '정기검진으로 내과 질환을 조기 확인하세요.' },
      { condition: '구강 진료', category: 'dental', careGuide: '치석 관리와 구내염 초기 징후를 확인하세요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '스트레스성 식욕저하가 길어지면 검사하세요.' },
      { condition: '위장약 처방', category: 'medication', careGuide: '복용 후 기호성 변화를 관찰하세요.' },
    ],
  },
  {
    breed: '스코티시폴드',
    species: 'cat',
    intro: '관절·연골 관련 통증 관리가 중요한 품종이에요.',
    riskTags: [
      { condition: '정형외과 진찰', category: 'exam', careGuide: '점프 동작 감소 여부를 꾸준히 확인하세요.' },
      { condition: 'X-ray 촬영', category: 'imaging', careGuide: '절뚝임이 보이면 영상검사를 진행하세요.' },
      { condition: '통증 관리 처방', category: 'medication', careGuide: '장기 복용 시 정기 재검을 지키세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '약 복용 중 간·신장 수치를 추적하세요.' },
      { condition: '치과 진료', category: 'dental', careGuide: '식욕 저하와 구강 통증 신호를 함께 체크하세요.' },
    ],
  },
  {
    breed: '노르웨이숲',
    species: 'cat',
    intro: '피모·심장·체중 관리가 핵심인 장모종이에요.',
    riskTags: [
      { condition: '정기 진찰', category: 'exam', careGuide: '모질 변화와 활력 변화를 함께 기록하세요.' },
      { condition: '심장 초음파', category: 'imaging', careGuide: '호흡수 증가 시 심장 검사를 고려하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '연령대에 맞는 검진 주기를 유지하세요.' },
      { condition: '치과 스케일링', category: 'dental', careGuide: '장모종은 미용 관리와 구강 관리를 함께 하세요.' },
      { condition: '영양 처방', category: 'medication', careGuide: '피모 건강 보조제를 수의사와 상의해 선택하세요.' },
    ],
  },
  {
    breed: '메인쿤',
    species: 'cat',
    intro: '심장·관절·체중 관련 모니터링이 중요한 대형묘예요.',
    riskTags: [
      { condition: '심장 진찰', category: 'exam', careGuide: '활동량 저하가 보이면 빠르게 상담하세요.' },
      { condition: '심장 초음파', category: 'imaging', careGuide: '정기 추적 검사 일정을 미리 잡아두세요.' },
      { condition: '혈액검사 패널', category: 'lab', careGuide: '시니어 단계 전환 시 검진 빈도를 높이세요.' },
      { condition: '관절 관리 처방', category: 'medication', careGuide: '체중 조절과 함께 보조제를 활용하세요.' },
      { condition: '치과 진료', category: 'dental', careGuide: '대형묘도 구강 관리를 정기적으로 진행하세요.' },
    ],
  },
  {
    breed: '샴',
    species: 'cat',
    intro: '호흡기·치과·소화기 관리가 자주 언급되는 품종이에요.',
    riskTags: [
      { condition: '진찰료', category: 'exam', careGuide: '재채기/콧물 지속 시 진찰 주기를 단축하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '만성 증상 여부를 수치로 추적하세요.' },
      { condition: '치과 진료', category: 'dental', careGuide: '구강 통증 징후를 식사 속도로 확인하세요.' },
      { condition: '흉부 X-ray', category: 'imaging', careGuide: '호흡 증상 반복 시 흉부 촬영을 검토하세요.' },
      { condition: '호흡기 투약', category: 'medication', careGuide: '투약 반응을 영상으로 기록하면 진료에 도움돼요.' },
    ],
  },
  {
    breed: '페르시안',
    species: 'cat',
    intro: '안과·호흡기·피부 관련 관리 수요가 높은 품종이에요.',
    riskTags: [
      { condition: '안과 진찰', category: 'exam', careGuide: '눈물량 변화와 충혈 여부를 매일 확인하세요.' },
      { condition: '안구/부비동 영상검사', category: 'imaging', careGuide: '만성 코막힘이 있으면 영상검사를 고려하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '정기 내과 검진으로 전신 상태를 확인하세요.' },
      { condition: '피부약 처방', category: 'medication', careGuide: '피모 관리 주기와 처방약 사용을 함께 기록하세요.' },
      { condition: '치과 스케일링', category: 'dental', careGuide: '코 짧은 품종은 마취 전 검사 상담이 중요해요.' },
    ],
  },
  {
    breed: '벵갈',
    species: 'cat',
    intro: '활동량이 높아 근골격·소화기 관리가 중요한 품종이에요.',
    riskTags: [
      { condition: '정기 진찰', category: 'exam', careGuide: '활동량 대비 체중 변화를 확인하세요.' },
      { condition: '혈액검사', category: 'lab', careGuide: '고단백 식단 변화 시 혈액 수치를 함께 보세요.' },
      { condition: '복부 초음파', category: 'imaging', careGuide: '설사/구토 반복 시 영상검사를 고려하세요.' },
      { condition: '소화기 투약', category: 'medication', careGuide: '식단 일지와 함께 약 반응을 관리하세요.' },
      { condition: '예방접종', category: 'vaccine', careGuide: '외부 활동이 있다면 접종 일정을 강화하세요.' },
    ],
  },
];

/* ─────────────────────────────────────────────────
 * 카테고리별 평균 비용 (시드 기반)
 * ───────────────────────────────────────────────── */

const DEFAULT_AVG_COST_BY_CATEGORY: Record<BreedRiskItem['category'], number> = {
  exam: 35000,
  vaccine: 45000,
  lab: 80000,
  imaging: 130000,
  dental: 240000,
  surgery: 900000,
  medication: 50000,
};

export function getPopularBreeds() {
  return BREED_PROFILES.map((item) => item.breed);
}

export function getBreedProfile(breed: string) {
  return BREED_PROFILES.find((item) => item.breed === breed);
}

export function getCategoryAverageCost(
  categorySlug: BreedRiskItem['category'],
  species: 'dog' | 'cat',
) {
  const categoryLabel = FEE_CATEGORIES.find((item) => item.slug === categorySlug)?.title;
  const matched = COST_SEARCH_SEED_DATA.filter((item) => {
    const speciesMatched = item.species === species;
    if (!speciesMatched || !categoryLabel) return false;
    if (categorySlug === 'dental')
      return (
        item.category.includes('치과') ||
        item.item.includes('스케일링') ||
        item.item.includes('발치')
      );
    if (categorySlug === 'surgery')
      return (
        item.category.includes('수술') ||
        item.item.includes('수술') ||
        item.item.includes('중성화')
      );
    if (categorySlug === 'vaccine')
      return item.category.includes('예방') || item.item.includes('예방접종');
    if (categorySlug === 'lab')
      return (
        item.category.includes('검사') ||
        item.item.includes('검사') ||
        item.item.includes('건강검진')
      );
    if (categorySlug === 'imaging')
      return (
        item.category.includes('영상') ||
        item.item.includes('초음파') ||
        item.item.includes('MRI') ||
        item.item.includes('CT')
      );
    if (categorySlug === 'medication')
      return item.item.includes('약') || item.item.includes('소염');
    return item.category.includes('진찰') || item.item.includes('진찰');
  });

  if (matched.length === 0) {
    return DEFAULT_AVG_COST_BY_CATEGORY[categorySlug];
  }

  return Math.round(matched.reduce((acc, item) => acc + item.avg, 0) / matched.length);
}

/* ─────────────────────────────────────────────────
 * 컨디션 → 태그 매핑 (AI 케어 체험용)
 * ───────────────────────────────────────────────── */

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
  obesity: ['exam_blood_general'],
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
  obesity: '비만/체중관리',
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
  exam_blood_general: '기본 혈액검사 체크',
};

/* ─────────────────────────────────────────────────
 * 품종별 리스크 태그 (간단 버전 — AI 케어 체험용)
 * ───────────────────────────────────────────────── */

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
  브리티시숏헤어: ['exam_blood_general', 'medicine_ear'],
};

/* ─────────────────────────────────────────────────
 * 유틸 함수
 * ───────────────────────────────────────────────── */

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
  const fuzzyMatched = Object.entries(BREED_RISK_TAGS).find(
    ([breedName]) =>
      normalizedBreed.includes(breedName) || breedName.includes(normalizedBreed),
  );
  return fuzzyMatched?.[1] ?? [];
}

