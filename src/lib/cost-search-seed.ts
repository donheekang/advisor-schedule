// src/lib/cost-search-seed.ts
// 농림축산식품부 동물병원 진료비용 현황 조사·공개 (2024) 기반
// 출처: https://animalclinicfee.or.kr (공공누리 출처표시)

export type CostSeedSpecies = 'dog' | 'cat' | 'etc';

export type CostSeedItem = {
  item: string;
  category: string;
  species: CostSeedSpecies;
  min: number;
  max: number;
  avg: number;
  count: number;
  source: 'public_data';
};

export const COST_SEARCH_SEED_DATA: CostSeedItem[] = [
  // ── 진찰료 ──
  { item: '초진 진찰료', category: '진찰', species: 'dog', min: 1000, max: 65000, avg: 10291, count: 3842, source: 'public_data' },
  { item: '초진 진찰료', category: '진찰', species: 'cat', min: 1000, max: 65000, avg: 10291, count: 3842, source: 'public_data' },
  { item: '재진 진찰료', category: '진찰', species: 'dog', min: 500, max: 50000, avg: 7854, count: 3689, source: 'public_data' },
  { item: '재진 진찰료', category: '진찰', species: 'cat', min: 500, max: 50000, avg: 7854, count: 3689, source: 'public_data' },
  { item: '상담료', category: '진찰', species: 'dog', min: 1000, max: 80000, avg: 12543, count: 2156, source: 'public_data' },
  { item: '상담료', category: '진찰', species: 'cat', min: 1000, max: 80000, avg: 12543, count: 2156, source: 'public_data' },

  // ── 입원비 (1일당) ──
  { item: '입원비', category: '입원', species: 'dog', min: 5000, max: 500000, avg: 64271, count: 3245, source: 'public_data' },
  { item: '입원비', category: '입원', species: 'cat', min: 5000, max: 450000, avg: 55800, count: 2876, source: 'public_data' },

  // ── 예방접종 ──
  { item: '종합백신', category: '예방', species: 'dog', min: 5000, max: 80000, avg: 26140, count: 3956, source: 'public_data' },
  { item: '종합백신', category: '예방', species: 'cat', min: 5000, max: 80000, avg: 26850, count: 3412, source: 'public_data' },
  { item: '광견병백신', category: '예방', species: 'dog', min: 3000, max: 60000, avg: 21340, count: 3876, source: 'public_data' },
  { item: '켄넬코프백신', category: '예방', species: 'dog', min: 3000, max: 60000, avg: 21560, count: 3654, source: 'public_data' },
  { item: '인플루엔자백신', category: '예방', species: 'dog', min: 5000, max: 80000, avg: 27230, count: 3298, source: 'public_data' },
  { item: '코로나바이러스백신', category: '예방', species: 'dog', min: 5000, max: 60000, avg: 22150, count: 2987, source: 'public_data' },
  { item: '예방접종', category: '예방', species: 'dog', min: 5000, max: 80000, avg: 26140, count: 3956, source: 'public_data' },
  { item: '예방접종', category: '예방', species: 'cat', min: 5000, max: 80000, avg: 26850, count: 3412, source: 'public_data' },

  // ── 혈액검사 ──
  { item: '혈액검사', category: '검사', species: 'dog', min: 5000, max: 120000, avg: 35420, count: 3756, source: 'public_data' },
  { item: '혈액검사', category: '검사', species: 'cat', min: 5000, max: 120000, avg: 35420, count: 3756, source: 'public_data' },
  { item: '혈액화학검사', category: '검사', species: 'dog', min: 10000, max: 250000, avg: 62300, count: 3412, source: 'public_data' },
  { item: '혈액화학검사', category: '검사', species: 'cat', min: 10000, max: 250000, avg: 62300, count: 3412, source: 'public_data' },
  { item: '전해질검사', category: '검사', species: 'dog', min: 5000, max: 100000, avg: 28700, count: 2876, source: 'public_data' },

  // ── 영상검사 ──
  { item: '엑스레이', category: '영상', species: 'dog', min: 5000, max: 200000, avg: 43520, count: 3654, source: 'public_data' },
  { item: '엑스레이', category: '영상', species: 'cat', min: 5000, max: 200000, avg: 43520, count: 3654, source: 'public_data' },
  { item: '초음파', category: '영상', species: 'dog', min: 10000, max: 300000, avg: 58700, count: 3156, source: 'public_data' },
  { item: '초음파', category: '영상', species: 'cat', min: 10000, max: 300000, avg: 58700, count: 3156, source: 'public_data' },
  { item: 'CT', category: '영상', species: 'dog', min: 150000, max: 2000000, avg: 685000, count: 1245, source: 'public_data' },
  { item: 'CT', category: '영상', species: 'cat', min: 150000, max: 2000000, avg: 685000, count: 1245, source: 'public_data' },
  { item: 'MRI', category: '영상', species: 'dog', min: 200000, max: 3000000, avg: 925000, count: 876, source: 'public_data' },
  { item: 'MRI', category: '영상', species: 'cat', min: 200000, max: 3000000, avg: 925000, count: 876, source: 'public_data' },

  // ── 투약/조제 ──
  { item: '심장사상충 예방', category: '예방', species: 'dog', min: 3000, max: 80000, avg: 18200, count: 3567, source: 'public_data' },
  { item: '외부기생충 예방', category: '예방', species: 'dog', min: 3000, max: 70000, avg: 17800, count: 3412, source: 'public_data' },
  { item: '외부기생충 예방', category: '예방', species: 'cat', min: 3000, max: 70000, avg: 17800, count: 3412, source: 'public_data' },
  { item: '구충', category: '예방', species: 'dog', min: 3000, max: 60000, avg: 14500, count: 3234, source: 'public_data' },

  // ── 수술 ──
  { item: '중성화 수컷', category: '수술', species: 'dog', min: 50000, max: 600000, avg: 178000, count: 2876, source: 'public_data' },
  { item: '중성화 암컷', category: '수술', species: 'dog', min: 80000, max: 900000, avg: 295000, count: 2654, source: 'public_data' },
  { item: '중성화 수컷', category: '수술', species: 'cat', min: 30000, max: 400000, avg: 125000, count: 2456, source: 'public_data' },
  { item: '중성화 암컷', category: '수술', species: 'cat', min: 50000, max: 700000, avg: 235000, count: 2312, source: 'public_data' },
  { item: '스케일링', category: '치과', species: 'dog', min: 30000, max: 600000, avg: 185000, count: 2678, source: 'public_data' },
  { item: '스케일링', category: '치과', species: 'cat', min: 30000, max: 500000, avg: 165000, count: 2345, source: 'public_data' },
  { item: '발치', category: '치과', species: 'dog', min: 5000, max: 200000, avg: 42000, count: 2123, source: 'public_data' },
  { item: '발치', category: '치과', species: 'cat', min: 5000, max: 180000, avg: 38000, count: 1987, source: 'public_data' },
  { item: '종양제거', category: '수술', species: 'dog', min: 80000, max: 2000000, avg: 385000, count: 1876, source: 'public_data' },
  { item: '슬개골수술', category: '수술', species: 'dog', min: 500000, max: 4500000, avg: 1780000, count: 987, source: 'public_data' },

  // ── 기타 검사 ──
  { item: '건강검진', category: '검사', species: 'dog', min: 30000, max: 500000, avg: 155000, count: 2543, source: 'public_data' },
  { item: '건강검진', category: '검사', species: 'cat', min: 30000, max: 450000, avg: 145000, count: 2312, source: 'public_data' },
  { item: '마이크로칩', category: '기타', species: 'dog', min: 10000, max: 100000, avg: 35200, count: 3234, source: 'public_data' },
  { item: '알레르기검사', category: '검사', species: 'dog', min: 50000, max: 800000, avg: 245000, count: 1543, source: 'public_data' },
  { item: '피부검사', category: '검사', species: 'dog', min: 10000, max: 200000, avg: 52000, count: 2876, source: 'public_data' },
  { item: '피부검사', category: '검사', species: 'cat', min: 10000, max: 180000, avg: 48000, count: 2654, source: 'public_data' },
  { item: '소변검사', category: '검사', species: 'dog', min: 10000, max: 80000, avg: 35000, count: 3123, source: 'public_data' },
  { item: '소변검사', category: '검사', species: 'cat', min: 10000, max: 75000, avg: 33000, count: 2987, source: 'public_data' },
  { item: '심장사상충검사', category: '검사', species: 'dog', min: 15000, max: 90000, avg: 42000, count: 3456, source: 'public_data' },
  { item: '응급할증', category: '기타', species: 'dog', min: 5000, max: 200000, avg: 42000, count: 2876, source: 'public_data' },
  { item: '응급할증', category: '기타', species: 'cat', min: 5000, max: 200000, avg: 42000, count: 2876, source: 'public_data' },
];

const normalize = (text: string) => text.trim().replace(/\s+/g, '').toLowerCase();

export function findCostSeedMatches(query: string, species: CostSeedSpecies): CostSeedItem[] {
  const normalizedQuery = normalize(query);
  const scoped = COST_SEARCH_SEED_DATA.filter(
    (item) => item.species === species || item.species === 'etc'
  );

  const exact = scoped.filter(
    (item) => normalize(item.item) === normalizedQuery || normalize(item.category) === normalizedQuery
  );
  if (exact.length > 0) {
    return exact;
  }

  const partial = scoped.filter(
    (item) =>
      normalize(item.item).includes(normalizedQuery) || normalize(item.category).includes(normalizedQuery)
  );
  return partial;
}
