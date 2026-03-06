export type CostSeedSpecies = 'dog' | 'cat' | 'etc';

export type CostSeedItem = {
  item: string;
  category: string;
  species: CostSeedSpecies;
  min: number;
  max: number;
  avg: number;
  source: 'public_data';
};

export const COST_SEARCH_SEED_DATA: CostSeedItem[] = [
  { item: '혈액검사', category: '검사', species: 'dog', min: 30000, max: 150000, avg: 70000, source: 'public_data' },
  { item: '혈액검사', category: '검사', species: 'cat', min: 30000, max: 130000, avg: 65000, source: 'public_data' },
  { item: '스케일링', category: '치과', species: 'dog', min: 150000, max: 450000, avg: 280000, source: 'public_data' },
  { item: '스케일링', category: '치과', species: 'cat', min: 130000, max: 380000, avg: 240000, source: 'public_data' },
  { item: '슬개골수술 1기', category: '수술', species: 'dog', min: 900000, max: 1600000, avg: 1200000, source: 'public_data' },
  { item: '슬개골수술 2기', category: '수술', species: 'dog', min: 1200000, max: 2200000, avg: 1650000, source: 'public_data' },
  { item: '슬개골수술 3기', category: '수술', species: 'dog', min: 1700000, max: 3000000, avg: 2200000, source: 'public_data' },
  { item: '슬개골수술 4기', category: '수술', species: 'dog', min: 2200000, max: 4000000, avg: 3000000, source: 'public_data' },
  { item: '중성화 수컷', category: '수술', species: 'dog', min: 120000, max: 350000, avg: 220000, source: 'public_data' },
  { item: '중성화 암컷', category: '수술', species: 'dog', min: 200000, max: 550000, avg: 330000, source: 'public_data' },
  { item: '중성화 수컷', category: '수술', species: 'cat', min: 90000, max: 250000, avg: 160000, source: 'public_data' },
  { item: '중성화 암컷', category: '수술', species: 'cat', min: 150000, max: 380000, avg: 240000, source: 'public_data' },
  { item: '예방접종', category: '예방', species: 'dog', min: 20000, max: 80000, avg: 45000, source: 'public_data' },
  { item: '예방접종', category: '예방', species: 'cat', min: 25000, max: 90000, avg: 50000, source: 'public_data' },
  { item: '방사선', category: '영상', species: 'dog', min: 50000, max: 180000, avg: 95000, source: 'public_data' },
  { item: '초음파', category: '영상', species: 'dog', min: 80000, max: 250000, avg: 140000, source: 'public_data' },
  { item: '초음파', category: '영상', species: 'cat', min: 70000, max: 220000, avg: 125000, source: 'public_data' },
  { item: '발치', category: '치과', species: 'dog', min: 50000, max: 250000, avg: 120000, source: 'public_data' },
  { item: 'MRI', category: '영상', species: 'dog', min: 650000, max: 1800000, avg: 1050000, source: 'public_data' },
  { item: 'CT', category: '영상', species: 'dog', min: 450000, max: 1300000, avg: 780000, source: 'public_data' },
  { item: '피부검사', category: '검사', species: 'dog', min: 50000, max: 200000, avg: 110000, source: 'public_data' },
  { item: '피부검사', category: '검사', species: 'cat', min: 45000, max: 180000, avg: 100000, source: 'public_data' },
  { item: '소변검사', category: '검사', species: 'dog', min: 20000, max: 80000, avg: 45000, source: 'public_data' },
  { item: '소변검사', category: '검사', species: 'cat', min: 20000, max: 75000, avg: 43000, source: 'public_data' },
  { item: '심장사상충검사', category: '검사', species: 'dog', min: 25000, max: 90000, avg: 50000, source: 'public_data' },
  { item: '건강검진', category: '검사', species: 'dog', min: 100000, max: 400000, avg: 210000, source: 'public_data' },
  { item: '건강검진', category: '검사', species: 'cat', min: 90000, max: 350000, avg: 190000, source: 'public_data' }
];

const normalize = (text: string) => text.trim().replace(/\s+/g, '').toLowerCase();

export function findCostSeedMatches(query: string, species: CostSeedSpecies): CostSeedItem[] {
  const normalizedQuery = normalize(query);
  const scoped = COST_SEARCH_SEED_DATA.filter((item) => item.species === species || item.species === 'etc');

  const exact = scoped.filter((item) => normalize(item.item) === normalizedQuery || normalize(item.category) === normalizedQuery);
  if (exact.length > 0) {
    return exact;
  }

  const partial = scoped.filter(
    (item) => normalize(item.item).includes(normalizedQuery) || normalize(item.category).includes(normalizedQuery)
  );

  return partial;
}
