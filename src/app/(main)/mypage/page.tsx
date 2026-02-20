'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { StoreComingSoonButtons } from '@/components/store-coming-soon-buttons';
import { apiClient } from '@/lib/api-client';
import {
  PawPrint, Stethoscope, FileText,
  Smartphone, BrainCircuit, HardDrive,
  LogOut, Sparkles, Activity,
  Dog, Cat, Camera, Bell, MapPin,
} from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('ko-KR');

type PetProfile = { id: string; name: string; species: string; breed: string | null; birth_date: string | null; weight_kg: number | null; allergy_tags?: string[]; gender?: string; neutered?: string };
type PetsApiResponse = { pets?: PetProfile[] };
type RecordItem = { item_name?: string; name?: string; price?: number };
type MedicalRecord = { id?: string; visit_date?: string; hospital_name?: string; total_amount?: number; items?: RecordItem[]; tags?: string[] };
type InsightResponse = { summary?: string; tags?: Array<{ tag: string; label: string; count: number } | string>; condition_tags?: string[] };
type MeSummary = { uid?: string; membership_tier?: string; effective_tier?: string; pet_count?: number; record_count?: number; doc_count?: number; ai_usage_count?: number; ai_usage_limit?: number | null; used_bytes?: number; quota_bytes?: number };

function speciesLabel(s: string): string {
  const l = s.toLowerCase();
  if (l === 'dog' || l.includes('강아지')) return '강아지';
  if (l === 'cat' || l.includes('고양이')) return '고양이';
  return '기타';
}

function SpeciesIcon({ species, size = 20 }: { species: string; size?: number }) {
  const l = species.toLowerCase();
  const boxSize = size >= 20 ? 'h-11 w-11' : 'h-7 w-7';
  const radius = size >= 20 ? 'rounded-xl' : 'rounded-lg';
  const iconSize = size >= 20 ? 22 : 14;

  if (l === 'dog' || l.includes('강아지')) {
    return (
      <div className={'flex items-center justify-center bg-gradient-to-br from-[#48B8D0] to-[#3A9BB0] ' + boxSize + ' ' + radius}>
        <Dog size={iconSize} className="text-white" />
      </div>
    );
  }

  if (l === 'cat' || l.includes('고양이')) {
    return (
      <div className={'flex items-center justify-center bg-gradient-to-br from-[#C084FC] to-[#A855F7] ' + boxSize + ' ' + radius}>
        <Cat size={iconSize} className="text-white" />
      </div>
    );
  }

  return (
    <div className={'flex items-center justify-center bg-gradient-to-br from-[#5CC4D8] to-[#48B8D0] ' + boxSize + ' ' + radius}>
      <PawPrint size={iconSize} className="text-white" />
    </div>
  );
}

function genderLabel(g?: string): string { if (g === 'M') return '남아'; if (g === 'F') return '여아'; return ''; }
function neuteredLabel(n?: string): string { if (n === 'Y') return '중성화 O'; if (n === 'N') return '중성화 X'; return ''; }

function getAgeLabel(bd: string | null): string {
  if (!bd) return '';
  const b = new Date(bd);
  if (Number.isNaN(b.getTime())) return '';
  const n = new Date();
  let y = n.getFullYear() - b.getFullYear();
  const md = n.getMonth() - b.getMonth();
  if (md < 0 || (md === 0 && n.getDate() < b.getDate())) y -= 1;
  return y >= 0 ? y + '살' : '';
}

function formatVisitDate(v?: string): string {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

const TAG_LABELS: Record<string, string> = {
  surgery_general: '일반 수술', exam_blood_cbc: '혈액검사', dental_extraction: '발치',
  medicine_oral: '내복약', dental_scaling: '스케일링', exam_xray: 'X-ray',
  exam_hormone: '호르몬 검사', vaccine_rabies: '광견병 백신', vaccine_dhppl: '종합백신',
  checkup_general: '건강검진', prevent_heartworm: '심장사상충', prevent_flea: '벼룩·진드기',
  surgery_neuter: '중성화', exam_ultrasound: '초음파', medicine_injection: '주사',
  hospitalization: '입원', exam_blood_chemistry: '혈액화학검사', exam_urine: '소변검사',
  exam_fecal: '분변검사', dental_general: '치과 진료', surgery_orthopedic: '정형외과',
  medicine_topical: '외용약', grooming_bath: '목욕', grooming_full: '미용',
};
function tagLabel(code: string): string { return TAG_LABELS[code] || code.replace(/_/g, ' '); }

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return (mb * 1024).toFixed(0) + ' KB';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return mb.toFixed(1) + ' MB';
}

function SummaryCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center gap-1.5 text-[#6B7280]">{icon}<p className="text-xs">{label}</p></div>
      <p className="mt-1.5 text-xl font-bold text-[#1F2937]">{value}{unit && <span className="text-sm font-normal text-[#6B7280]">{' '}{unit}</span>}</p>
    </div>
  );
}

function InfoChip({ label }: { label: string }) {
  return <span className="rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 text-xs text-[#6B7280]">{label}</span>;
}

function AppFeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-white/80">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">{icon}</span>
      {text}
    </div>
  );
}

export default function MyPage() {
  const { user, loading, token, signOut } = useAuth();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [summary, setSummary] = useState<MeSummary | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setPets([]); setSelectedPetId(''); setRecords([]); setInsight(null); setSummary(null); return; }
    let mounted = true;
    async function fetchData() {
      setIsFetching(true); setErrorMessage(null);
      try {
        const [petsRes, recordsRes, summaryRes] = await Promise.all([
          apiClient.listPets() as Promise<PetsApiResponse | PetProfile[]>,
          apiClient.listRecords(undefined, true) as Promise<MedicalRecord[]>,
          apiClient.getMeSummary().catch(() => null) as Promise<MeSummary | null>,
        ]);
        if (!mounted) return;
        const nextPets = Array.isArray(petsRes) ? petsRes : (petsRes.pets ?? []);
        const nextRecords = (Array.isArray(recordsRes) ? recordsRes : [])
          .sort((a, b) => new Date(b.visit_date ?? '').getTime() - new Date(a.visit_date ?? '').getTime()).slice(0, 5);
        setPets(nextPets); setSelectedPetId((prev) => prev || nextPets[0]?.id || '');
        setRecords(nextRecords); setSummary(summaryRes);
      } catch { if (mounted) setErrorMessage('데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.'); }
      finally { if (mounted) setIsFetching(false); }
    }
    void fetchData();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    if (!token || !selectedPetId) { setInsight(null); return; }
    let mounted = true;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';
    async function fetchInsight() {
      try {
        const res = await fetch(API_BASE + '/api/ai/analyze', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ pet_id: selectedPetId }),
        });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (mounted) setInsight(data);
      } catch { if (mounted) setInsight(null); }
    }
    void fetchInsight();
    return () => { mounted = false; };
  }, [selectedPetId, token]);

  const selectedPet = useMemo(() => pets.find((p) => p.id === selectedPetId) ?? null, [pets, selectedPetId]);

  if (loading) {
    return (<div className="flex min-h-[60vh] items-center justify-center"><div className="flex items-center gap-2 text-sm text-[#6B7280]"><Activity size={16} className="animate-pulse" />로그인 상태를 확인하고 있어요...</div></div>);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5E5FC]">
          <PawPrint size={36} className="text-[#48B8D0]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#1F2937]">로그인하면 우리 아이 진료 기록을<br />관리할 수 있어요</h2>
        <p className="mb-8 text-sm text-[#6B7280]">앱에서 기록한 데이터가 웹에서도 연동됩니다</p>
        <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#48B8D0] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3CA8BF]">로그인</Link>
        <p className="mt-4"><Link href="/ai-care" className="text-sm font-medium text-[#48B8D0] hover:underline">또는 무료 AI 견적서부터 시작해보세요</Link></p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 md:pt-28">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">마이페이지</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{user.displayName || user.email || '보호자'}님의 건강 관리 현황</p>
        </div>
        <button type="button" onClick={() => { void signOut(); }} className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#6B7280] transition hover:bg-[#F8FAFC]"><LogOut size={14} />로그아웃</button>
      </div>

      {errorMessage && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>}

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard icon={<PawPrint size={18} />} label="반려동물" value={String(summary.pet_count ?? pets.length)} unit="마리" />
          <SummaryCard icon={<Stethoscope size={18} />} label="진료 기록" value={String(summary.record_count ?? records.length)} unit="건" />
          <SummaryCard icon={<BrainCircuit size={18} />} label="AI 분석" value={(summary.ai_usage_count ?? 0) + '/' + (summary.ai_usage_limit ?? '∞')} unit="회" />
          <SummaryCard icon={<HardDrive size={18} />} label="저장 용량" value={formatBytes(summary.used_bytes)} unit="" />
        </div>
      )}

      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center gap-2"><PawPrint size={20} className="text-[#48B8D0]" /><h2 className="text-lg font-bold text-[#1F2937]">우리 아이들</h2></div>
        {pets.length === 0 ? (
          <div className="mt-4 rounded-xl bg-[#F8FAFC] p-6 text-center">
            <PawPrint size={32} className="mx-auto mb-3 text-[#CBD5E1]" />
            <p className="text-sm text-[#6B7280]">앱에서 반려동물을 등록해보세요</p>
            <div className="mt-3 flex justify-center"><StoreComingSoonButtons tone="light" /></div>
          </div>
        ) : (
          <>
            {pets.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pets.map((pet) => (
                  <button key={pet.id} type="button" onClick={() => setSelectedPetId(pet.id)}
                    className={'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ' + (pet.id === selectedPetId ? 'bg-[#48B8D0] text-white' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E2E8F0] hover:border-[#48B8D0]')}>
                    <SpeciesIcon species={pet.species} size={14} />{pet.name}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <div key={pet.id} className={'rounded-xl border p-4 transition cursor-pointer ' + (pet.id === selectedPetId ? 'border-[#48B8D0] bg-[#48B8D0]/5' : 'border-[#E2E8F0] bg-white hover:border-[#48B8D0]/50')} onClick={() => setSelectedPetId(pet.id)}>
                  <div className="flex items-center gap-3">
                    <SpeciesIcon species={pet.species} size={22} />
                    <div>
                      <h3 className="font-bold text-[#1F2937]">{pet.name}</h3>
                      <p className="text-xs text-[#6B7280]">{speciesLabel(pet.species)}{pet.breed ? ' · ' + pet.breed : ''}{getAgeLabel(pet.birth_date) ? ' · ' + getAgeLabel(pet.birth_date) : ''}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pet.weight_kg != null && <InfoChip label={pet.weight_kg + 'kg'} />}
                    {genderLabel(pet.gender) && <InfoChip label={genderLabel(pet.gender)} />}
                    {neuteredLabel(pet.neutered) && <InfoChip label={neuteredLabel(pet.neutered)} />}
                    {(pet.allergy_tags ?? []).length > 0 && <InfoChip label={'알러지 ' + (pet.allergy_tags ?? []).length + '개'} />}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center gap-2"><Sparkles size={20} className="text-[#48B8D0]" /><h2 className="text-lg font-bold text-[#1F2937]">AI 건강 인사이트</h2></div>
        {!selectedPet ? (<p className="mt-3 text-sm text-[#6B7280]">분석할 반려동물을 선택해주세요</p>
        ) : insight && insight.summary ? (
          <div className="mt-4">
            <div className="rounded-xl bg-[#F5E5FC]/30 p-4 text-sm leading-relaxed text-[#1F2937]">{insight.summary}</div>
            {insight.tags && insight.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {insight.tags.map((t, i) => {
                  const lbl = typeof t === 'string' ? tagLabel(t) : (t.label || tagLabel(t.tag));
                  const k = typeof t === 'string' ? t : t.tag;
                  return <span key={k + '-' + String(i)} className="rounded-full bg-[#48B8D0]/10 px-3 py-1 text-xs font-medium text-[#48B8D0]">{lbl}</span>;
                })}
              </div>
            )}
          </div>
        ) : (<p className="mt-3 text-sm text-[#6B7280]">{isFetching ? 'AI 인사이트를 불러오는 중...' : '아직 분석 데이터가 없어요. 앱에서 진료 기록을 등록해보세요.'}</p>)}
      </section>

      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center gap-2"><Stethoscope size={20} className="text-[#48B8D0]" /><h2 className="text-lg font-bold text-[#1F2937]">최근 진료 기록</h2></div>
        <div className="mt-4 space-y-3">
          {records.length === 0 ? (
            <div className="rounded-xl bg-[#F8FAFC] p-6 text-center"><FileText size={28} className="mx-auto mb-2 text-[#CBD5E1]" /><p className="text-sm text-[#6B7280]">최근 진료 기록이 없어요</p></div>
          ) : records.map((record, index) => (
            <div key={record.id ?? 'record-' + String(index)} className="rounded-xl border border-[#E2E8F0] p-4 transition hover:border-[#48B8D0]/30">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-semibold text-[#1F2937]">{record.hospital_name || '병원 정보 없음'}</p><p className="text-xs text-[#6B7280]">{formatVisitDate(record.visit_date)}</p></div>
                <p className="text-base font-bold text-[#48B8D0]">{currencyFormatter.format(record.total_amount ?? 0)}원</p>
              </div>
              {(record.items ?? []).length > 0 && (
                <div className="mt-2 space-y-1 border-t border-[#F1F5F9] pt-2">
                  {(record.items ?? []).map((item, i) => (
                    <div key={String(i)} className="flex items-center justify-between text-xs text-[#6B7280]">
                      <span>{item.item_name ?? item.name ?? '항목'}</span>
                      {typeof item.price === 'number' && <span>{currencyFormatter.format(item.price)}원</span>}
                    </div>
                  ))}
                </div>
              )}
              {(record.tags ?? []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(record.tags ?? []).map((tag) => (<span key={tag} className="rounded-full bg-[#F5E5FC]/50 px-2 py-0.5 text-[11px] text-[#48B8D0]">{tagLabel(tag)}</span>))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-[#0B3041] p-6 text-white">
        <div className="flex items-center gap-2"><Smartphone size={20} /><h2 className="text-lg font-bold">앱에서 더 많은 기능을 사용하세요</h2></div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AppFeatureRow icon={<Camera size={16} />} text="영수증 촬영하면 자동 분류" />
          <AppFeatureRow icon={<Bell size={16} />} text="예방접종 일정 푸시 알림" />
          <AppFeatureRow icon={<FileText size={16} />} text="검사결과 PDF 클라우드 보관" />
          <AppFeatureRow icon={<MapPin size={16} />} text="내 근처 동물병원 찾기" />
        </div>
        <div className="mt-5 flex justify-center sm:justify-start"><StoreComingSoonButtons tone="dark" /></div>
      </section>
    </main>
  );
}
