'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api-client';

const APPSTORE_URL = 'https://apps.apple.com/app/id6504879567';
const currencyFormatter = new Intl.NumberFormat('ko-KR');

// ── 타입 ──
type PetProfile = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  allergy_tags?: string[];
  gender?: string;
  neutered?: string;
};
type PetsApiResponse = { pets?: PetProfile[] };
type RecordItem = { item_name?: string; name?: string; price?: number };
type MedicalRecord = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  items?: RecordItem[];
  tags?: string[];
};
type InsightResponse = {
  summary?: string;
  tags?: Array<string | { tag: string; label: string; count: number }>;
  condition_tags?: string[];
};
type MeSummary = {
  uid?: string;
  membership_tier?: string;
  effective_tier?: string;
  pet_count?: number;
  record_count?: number;
  doc_count?: number;
  ai_usage_count?: number;
  ai_usage_limit?: number | null;
  used_bytes?: number;
  quota_bytes?: number;
};

// ── 헬퍼 ──
function speciesLabel(s: string): string {
  const lower = s.toLowerCase();
  if (lower === 'dog' || lower.includes('강아지')) return '강아지';
  if (lower === 'cat' || lower.includes('고양이')) return '고양이';
  return '기타';
}

function speciesEmoji(s: string): string {
  const lower = s.toLowerCase();
  if (lower === 'dog' || lower.includes('강아지')) return '🐶';
  if (lower === 'cat' || lower.includes('고양이')) return '🐱';
  return '🐾';
}

function genderLabel(g?: string): string {
  if (!g) return '';
  if (g === 'M') return '♂ 남아';
  if (g === 'F') return '♀ 여아';
  return '';
}

function neuteredLabel(n?: string): string {
  if (n === 'Y') return '중성화 완료';
  if (n === 'N') return '중성화 안 함';
  return '';
}

function getAgeLabel(birthDate: string | null): string {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const md = now.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < birth.getDate())) years -= 1;
  return years >= 0 ? years + '살' : '';
}

function formatVisitDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

// 태그 코드 → 한글 라벨 변환
const TAG_LABELS: Record<string, string> = {
  surgery_general: '일반 수술',
  exam_blood_cbc: '혈액검사(CBC)',
  dental_extraction: '발치',
  medicine_oral: '내복약',
  dental_scaling: '스케일링',
  exam_xray: 'X-ray',
  exam_hormone: '호르몬 검사',
  vaccine_rabies: '광견병 예방접종',
  vaccine_dhppl: '종합백신',
  checkup_general: '건강검진',
  prevent_heartworm: '심장사상충',
  prevent_flea: '벼룩/진드기',
  surgery_neuter: '중성화 수술',
  exam_ultrasound: '초음파',
  medicine_injection: '주사',
  hospitalization: '입원',
};

function tagLabel(code: string): string {
  return TAG_LABELS[code] || code.replace(/_/g, ' ');
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return (mb * 1024).toFixed(0) + ' KB';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return mb.toFixed(1) + ' MB';
}

// ── 메인 컴포넌트 ──
export default function MyPage() {
  const { user, loading, token, signOut } = useAuth();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [summary, setSummary] = useState<MeSummary | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (!user) {
      setPets([]); setSelectedPetId(''); setRecords([]); setInsight(null); setSummary(null);
      return;
    }
    let mounted = true;
    async function fetchData() {
      setIsFetching(true);
      setErrorMessage(null);
      try {
        const [petsRes, recordsRes, summaryRes] = await Promise.all([
          apiClient.listPets() as Promise<PetsApiResponse | PetProfile[]>,
          apiClient.listRecords(undefined, true) as Promise<MedicalRecord[]>,
          apiClient.getMeSummary().catch(() => null) as Promise<MeSummary | null>,
        ]);
        if (!mounted) return;
        const nextPets = Array.isArray(petsRes) ? petsRes : (petsRes.pets ?? []);
        const nextRecords = (Array.isArray(recordsRes) ? recordsRes : [])
          .sort((a, b) => new Date(b.visit_date ?? '').getTime() - new Date(a.visit_date ?? '').getTime())
          .slice(0, 5);
        setPets(nextPets);
        setSelectedPetId((prev) => prev || nextPets[0]?.id || '');
        setRecords(nextRecords);
        setSummary(summaryRes);
      } catch {
        if (mounted) setErrorMessage('데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        if (mounted) setIsFetching(false);
      }
    }
    void fetchData();
    return () => { mounted = false; };
  }, [user]);

  // AI 인사이트 로드
  useEffect(() => {
    if (!token || !selectedPetId) { setInsight(null); return; }
    let mounted = true;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';
    async function fetchInsight() {
      try {
        const res = await fetch(API_BASE + '/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ pet_id: selectedPetId }),
        });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (mounted) setInsight(data);
      } catch {
        if (mounted) setInsight(null);
      }
    }
    void fetchInsight();
    return () => { mounted = false; };
  }, [selectedPetId, token]);

  const selectedPet = useMemo(() => pets.find((p) => p.id === selectedPetId) ?? null, [pets, selectedPetId]);

  // ── 로딩 ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#6B7280]">로그인 상태를 확인하고 있어요...</p>
      </div>
    );
  }

  // ── 비로그인 ──
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5E5FC]">
          <span className="text-4xl">🐾</span>
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#1F2937]">
          로그인하면 우리 아이 진료 기록을<br />관리할 수 있어요
        </h2>
        <p className="mb-8 text-sm text-[#6B7280]">앱에서 기록한 데이터가 웹에서도 연동됩니다</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-[#48B8D0] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3CA8BF]"
        >
          로그인
        </Link>
        <p className="mt-4">
          <Link href="/ai-care" className="text-sm font-medium text-[#48B8D0] hover:underline">
            또는 무료 AI 견적서부터 시작해보세요
          </Link>
        </p>
      </div>
    );
  }

  // ── 로그인 상태 ──
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">마이페이지</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {user.displayName || user.email || '보호자'}님의 건강 관리 현황
          </p>
        </div>
        <button
          type="button"
          onClick={() => { void signOut(); }}
          className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#6B7280] transition hover:bg-[#F8FAFC]"
        >
          로그아웃
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>
      )}

      {/* 요약 카드 */}
      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: '반려동물', value: String(summary.pet_count ?? pets.length), unit: '마리' },
            { label: '진료 기록', value: String(summary.record_count ?? records.length), unit: '건' },
            { label: 'AI 분석', value: (summary.ai_usage_count ?? 0) + '/' + (summary.ai_usage_limit ?? '∞'), unit: '회' },
            { label: '저장 용량', value: formatBytes(summary.used_bytes), unit: '' },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
              <p className="text-xs text-[#6B7280]">{card.label}</p>
              <p className="mt-1 text-xl font-bold text-[#1F2937]">
                {card.value}<span className="text-sm font-normal text-[#6B7280]"> {card.unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 펫 프로필 */}
      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="text-lg font-bold text-[#1F2937]">우리 아이들</h2>
        {pets.length === 0 ? (
          <div className="mt-4 rounded-xl bg-[#F5E5FC]/30 p-5 text-center">
            <p className="text-sm text-[#6B7280]">앱에서 반려동물을 등록해보세요</p>
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-lg bg-[#48B8D0] px-4 py-2 text-sm font-semibold text-white"
            >
              앱 다운로드
            </a>
          </div>
        ) : (
          <>
            {pets.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={
                      'rounded-full px-4 py-2 text-xs font-medium transition ' +
                      (pet.id === selectedPetId
                        ? 'bg-[#48B8D0] text-white'
                        : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E2E8F0] hover:border-[#48B8D0]')
                    }
                  >
                    {speciesEmoji(pet.species)} {pet.name}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={
                    'rounded-xl border p-4 transition cursor-pointer ' +
                    (pet.id === selectedPetId
                      ? 'border-[#48B8D0] bg-[#F5E5FC]/20'
                      : 'border-[#E2E8F0] bg-white hover:border-[#48B8D0]/50')
                  }
                  onClick={() => setSelectedPetId(pet.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{speciesEmoji(pet.species)}</span>
                    <div>
                      <h3 className="font-bold text-[#1F2937]">{pet.name}</h3>
                      <p className="text-xs text-[#6B7280]">
                        {speciesLabel(pet.species)}
                        {pet.breed ? ' · ' + pet.breed : ''}
                        {getAgeLabel(pet.birth_date) ? ' · ' + getAgeLabel(pet.birth_date) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                    {pet.weight_kg != null && (
                      <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5">{pet.weight_kg}kg</span>
                    )}
                    {genderLabel(pet.gender) && (
                      <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5">{genderLabel(pet.gender)}</span>
                    )}
                    {neuteredLabel(pet.neutered) && (
                      <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5">{neuteredLabel(pet.neutered)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* AI 인사이트 */}
      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="text-lg font-bold text-[#1F2937]">AI 건강 인사이트</h2>
        {!selectedPet ? (
          <p className="mt-3 text-sm text-[#6B7280]">분석할 반려동물을 선택해주세요</p>
        ) : insight ? (
          <div className="mt-4">
            {insight.summary && (
              <div className="rounded-xl bg-[#F5E5FC]/30 p-4 text-sm text-[#1F2937] leading-relaxed">
                {insight.summary}
              </div>
            )}
            {(insight.tags && insight.tags.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {insight.tags.map((t) => (
                  <span
                    key={typeof t === 'string' ? t : t.tag}
                    className="rounded-full bg-[#48B8D0]/10 px-3 py-1 text-xs font-medium text-[#48B8D0]"
                  >
                    {typeof t === 'string' ? tagLabel(t) : (t.label || tagLabel(t.tag))}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#6B7280]">
            {isFetching ? 'AI 인사이트를 불러오는 중...' : '아직 분석 데이터가 없어요. 앱에서 진료 기록을 등록해보세요.'}
          </p>
        )}
      </section>

      {/* 최근 진료 기록 */}
      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2937]">최근 진료 기록</h2>
        </div>
        <div className="mt-4 space-y-3">
          {records.length === 0 ? (
            <p className="text-sm text-[#6B7280]">최근 진료 기록이 없어요</p>
          ) : (
            records.map((record, index) => (
              <div
                key={record.id ?? 'record-' + String(index)}
                className="rounded-xl border border-[#E2E8F0] p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {record.hospital_name || '병원 정보 없음'}
                    </p>
                    <p className="text-xs text-[#6B7280]">{formatVisitDate(record.visit_date)}</p>
                  </div>
                  <p className="text-base font-bold text-[#48B8D0]">
                    {currencyFormatter.format(record.total_amount ?? 0)}원
                  </p>
                </div>
                {(record.items ?? []).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {(record.items ?? []).map((item, i) => (
                      <div key={String(i)} className="flex items-center justify-between text-xs text-[#6B7280]">
                        <span>{item.item_name ?? item.name ?? '항목'}</span>
                        {typeof item.price === 'number' && (
                          <span>{currencyFormatter.format(item.price)}원</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {(record.tags ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(record.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-[#F5E5FC]/50 px-2 py-0.5 text-[11px] text-[#48B8D0]">
                        {tagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* 앱 다운로드 CTA */}
      <section className="rounded-2xl bg-[#0B3041] p-6 text-white">
        <h2 className="text-lg font-bold">📱 앱에서 더 많은 기능을 사용하세요</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80">
          <p>📸 영수증 촬영 → 자동 분류</p>
          <p>🔔 예방접종 일정 알림</p>
          <p>📋 검사결과 PDF 보관</p>
          <p>🏥 근처 동물병원 찾기</p>
        </div>
        <a
          href={APPSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0B3041] transition hover:bg-white/90"
        >
           App Store에서 다운로드
        </a>
      </section>
    </main>
  );
}
