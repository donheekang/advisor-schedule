import { CONDITION_LABELS, TAG_LABELS, getBreedRiskTags, mapConditionsToTags } from '@/lib/condition-tag-map';
import { Product, getRecommendedProducts } from '@/lib/product-recommender';

export type HealthStatus = '주의 필요' | '관리 필요' | '양호';

export type HealthPoint = {
  key: string;
  icon: string;
  label: string;
  status: HealthStatus;
};

export type CareRecommendation = {
  tag: string;
  icon: string;
  title: string;
  message: string;
  action: string;
  productKeyword: string;
  priority: number;
  source: 'condition' | 'breed';
};

export type CareReport = {
  title: string;
  summary: string;
  conditionTags: string[];
  breedRiskTags: string[];
  healthPoints: HealthPoint[];
  recommendations: CareRecommendation[];
  products: Product[];
};

const HEALTH_POINT_GROUPS = [
  { key: 'oral', icon: '🦷', label: '구강', tags: ['dental_scaling', 'dental_extraction'] },
  { key: 'joint', icon: '🦴', label: '관절', tags: ['ortho_patella', 'ortho_arthritis'] },
  { key: 'eye', icon: '👁', label: '눈', tags: ['medicine_eye'] }
] as const;

const TAG_RECOMMENDATION_MAP: Record<string, Omit<CareRecommendation, 'source'>> = {
  dental_scaling: {
    tag: 'dental_scaling',
    icon: '🦷',
    title: '치과 관리',
    message: '치석이 빠르게 쌓일 수 있어요. 양치/덴탈 루틴을 매일 유지해주세요.',
    action: '덴탈껌 매일 1개 + 3개월마다 치석 체크',
    productKeyword: '강아지 덴탈껌 데일리',
    priority: 100
  },
  dental_extraction: {
    tag: 'dental_extraction',
    icon: '🪥',
    title: '치아 회복 관리',
    message: '구강 민감도가 높은 시기라 부드러운 구강 케어가 중요해요.',
    action: '구강겔로 시작 후 핑거칫솔로 천천히 양치 적응',
    productKeyword: '반려동물 구강겔',
    priority: 95
  },
  ortho_patella: {
    tag: 'ortho_patella',
    icon: '🐾',
    title: '슬개골 관리',
    message: '소형견에서 자주 보이는 관절 포인트예요. 미끄럼 환경을 줄여주세요.',
    action: '미끄럼방지 매트 + 계단 대신 슬로프',
    productKeyword: '강아지 미끄럼방지 매트',
    priority: 93
  },
  ortho_arthritis: {
    tag: 'ortho_arthritis',
    icon: '🦴',
    title: '관절 부담 완화',
    message: '체중과 바닥 환경 관리가 관절 부담 완화에 도움이 돼요.',
    action: '관절 영양제 + 실내 미끄럼 최소화',
    productKeyword: '강아지 글루코사민',
    priority: 90
  },
  medicine_skin: {
    tag: 'medicine_skin',
    icon: '😣',
    title: '피부 진정 루틴',
    message: '피부 컨디션은 목욕 주기와 보습 루틴이 핵심이에요.',
    action: '저자극 샴푸 + 보습 스프레이 루틴 유지',
    productKeyword: '반려동물 저자극 샴푸',
    priority: 88
  },
  medicine_allergy: {
    tag: 'medicine_allergy',
    icon: '🌿',
    title: '알러지 관리',
    message: '원인 식단과 피부 장벽 케어를 함께 점검하면 좋아요.',
    action: '저알러지 간식/사료 + 오메가3 병행',
    productKeyword: '강아지 저알러지 간식',
    priority: 86
  },
  medicine_gi: {
    tag: 'medicine_gi',
    icon: '🤢',
    title: '소화기 케어',
    message: '장 컨디션은 식단 안정성과 유산균 루틴이 중요해요.',
    action: '프로바이오틱스 + 급여 시간 규칙화',
    productKeyword: '강아지 유산균 프로바이오틱스',
    priority: 85
  },
  medicine_eye: {
    tag: 'medicine_eye',
    icon: '👁',
    title: '눈물 관리',
    message: '눈물량이 많다면 세정 루틴을 일정하게 유지해주세요.',
    action: '하루 2회 눈물 세정 + 눈 주변 위생관리',
    productKeyword: '반려동물 눈물 귀 세정',
    priority: 84
  },
  medicine_ear: {
    tag: 'medicine_ear',
    icon: '👂',
    title: '귀 위생 관리',
    message: '귀는 통풍과 정기 세정 루틴으로 예방 관리가 가능해요.',
    action: '주 1~2회 귀 세정 + 습도 관리',
    productKeyword: '강아지 귀세정제',
    priority: 80
  },
  vaccine_comprehensive: {
    tag: 'vaccine_comprehensive',
    icon: '💉',
    title: '예방 루틴 유지',
    message: '정기 예방 스케줄을 유지하면 큰 위험을 줄일 수 있어요.',
    action: '예방접종/예방약 일정 캘린더 등록',
    productKeyword: '강아지 심장사상충 예방약',
    priority: 78
  }
};

function getSpeciesIcon(species: string): string {
  return species.includes('고양이') ? '🐈' : '🐕';
}

function resolveHealthStatus(tags: readonly string[], breedRiskTags: string[], conditionTags: string[]): HealthStatus {
  const hasCondition = tags.some((tag) => conditionTags.includes(tag));
  if (hasCondition) {
    return '주의 필요';
  }

  const hasBreedRisk = tags.some((tag) => breedRiskTags.includes(tag));
  if (hasBreedRisk) {
    return '관리 필요';
  }

  return '양호';
}

export function generateLocalCareReport(
  species: string,
  breed: string,
  age: number,
  conditions: string[],
  allergies: string[] = []
): CareReport {
  const normalizedBreed = breed.trim() || '우리 아이';
  const conditionTags = mapConditionsToTags(conditions);
  const breedRiskTags = getBreedRiskTags(normalizedBreed);
  const mergedTags = [...new Set([...conditionTags, ...breedRiskTags])];
  const products = getRecommendedProducts(mergedTags, allergies);

  const recommendations = mergedTags
    .map((tag) => {
      const base = TAG_RECOMMENDATION_MAP[tag];
      if (!base) {
        return null;
      }

      const matchedProduct = products.find((product) => product.relatedTags.includes(tag));
      return {
        ...base,
        productKeyword: matchedProduct?.coupangKeyword ?? base.productKeyword,
        source: conditionTags.includes(tag) ? 'condition' : 'breed'
      };
    })
    .filter((item): item is CareRecommendation => Boolean(item))
    .sort((a, b) => {
      if (a.source !== b.source) {
        return a.source === 'condition' ? -1 : 1;
      }
      return b.priority - a.priority;
    })
    .slice(0, 5);

  const healthPoints = HEALTH_POINT_GROUPS.map((point) => ({
    key: point.key,
    icon: point.icon,
    label: point.label,
    status: resolveHealthStatus(point.tags, breedRiskTags, conditionTags)
  }));

  const primaryLabels = conditionTags
    .slice(0, 2)
    .map((tag) => TAG_LABELS[tag] ?? tag)
    .join(', ');

  return {
    title: `${getSpeciesIcon(species)} ${normalizedBreed} · ${age > 0 ? `${age}살` : '나이 미입력'}의 맞춤 케어 리포트`,
    summary: primaryLabels
      ? `최근 입력 기준 핵심 포인트는 ${primaryLabels}예요. 아래 루틴부터 가볍게 시작해보세요.`
      : '입력하신 품종/나이 기준으로 자주 필요한 케어 루틴을 정리했어요.',
    conditionTags,
    breedRiskTags,
    healthPoints,
    recommendations,
    products
  };
}

export function buildShareText(report: CareReport, breed: string, conditionLabels: string[]): string {
  const topRecommendations = report.recommendations
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${item.title} - ${item.action}`)
    .join('\n');

  return [
    `${breed || '우리 아이'} AI 케어 리포트`,
    `주요 이력: ${conditionLabels.join(', ') || '선택 없음'}`,
    '',
    topRecommendations,
    '',
    '자세히 보기: https://advisor-schedule-fawn.vercel.app/ai-care'
  ].join('\n');
}

export function getConditionLabels(conditions: string[]): string[] {
  return conditions.map((condition) => CONDITION_LABELS[condition] ?? condition);
}
