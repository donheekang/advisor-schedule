'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';
import { apiClient } from '@/lib/api-client';
import type { PetData } from '@/components/mypage/pet-card';
import type { SummaryData } from '@/components/mypage/summary-stats';

type PetsApiResponse = {
  pets?: PetData[];
};

type ApiRecordItem = {
  item_name?: string;
  name?: string;
};

type ApiRecord = {
  id?: string;
  visit_date?: string;
  hospital_name?: string;
  total_amount?: number;
  items?: ApiRecordItem[];
};

type RecordTimelineItem = {
  id: string;
  visitDate: string;
  hospitalName: string;
  itemName: string;
  totalAmount: number;
};

type ApiClaim = {
  id?: string;
  claim_type?: string;
  status?: string;
  created_at?: string;
};

type DocumentItem = {
  id: string;
  title: string;
  subtitle: string;
};

const currencyFormatter = new Intl.NumberFormat('ko-KR');

function getAgeLabel(birthDate: string | null): string {
  if (!birthDate) {
    return '나이 정보 없음';
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return '나이 정보 없음';
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }

  return years >= 0 ? `${years}살` : '나이 정보 없음';
}

function formatVisitDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '날짜 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsedDate);
}

function getPetIcon(species: string): string {
  const normalized = species.toLowerCase();

  if (normalized.includes('cat') || normalized.includes('고양')) {
    return '🐈';
  }

  return '🐕';
}

function normalizeRecordTimeline(records: ApiRecord[]): RecordTimelineItem[] {
  return records
    .map((record, index) => ({
      id: record.id ?? `record-${index}`,
      visitDate: record.visit_date ?? '',
      hospitalName: record.hospital_name ?? '병원 정보 없음',
      itemName: record.items?.[0]?.item_name ?? record.items?.[0]?.name ?? '진료 항목 정보 없음',
      totalAmount: record.total_amount ?? 0
    }))
    .sort((left, right) => new Date(right.visitDate).getTime() - new Date(left.visitDate).getTime())
    .slice(0, 5);
}

function normalizeDocuments(claims: ApiClaim[], docCount: number): DocumentItem[] {
  if (claims.length > 0) {
    return claims.slice(0, 4).map((claim, index) => ({
      id: claim.id ?? `claim-${index}`,
      title: claim.claim_type ? `${claim.claim_type} 문서` : '보험 청구 문서',
      subtitle: `${claim.status ?? '상태 확인 중'} · ${formatVisitDate(claim.created_at ?? '')}`
    }));
  }

  return Array.from({ length: Math.min(docCount, 3) }, (_, index) => ({
    id: `doc-${index}`,
    title: `업로드 문서 ${index + 1}`,
    subtitle: '앱에서 확인 가능'
  }));
}

export default function MyPage() {
  const { user, loading, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [pets, setPets] = useState<PetData[]>([]);
  const [records, setRecords] = useState<RecordTimelineItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      setPets([]);
      setRecords([]);
      setDocuments([]);
      return;
    }

    let isMounted = true;

    async function fetchMyPageData() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const [summaryResponse, petsResponse, recordsResponse, claimsResponse] = await Promise.all([
          apiClient.getMeSummary() as Promise<SummaryData>,
          apiClient.listPets() as Promise<PetsApiResponse | PetData[]>,
          apiClient.listRecords(undefined, true) as Promise<ApiRecord[]>,
          apiClient.listClaims() as Promise<ApiClaim[]>
        ]);

        if (!isMounted) {
          return;
        }

        const petList = Array.isArray(petsResponse) ? petsResponse : (petsResponse.pets ?? []);
        const recordList = Array.isArray(recordsResponse) ? recordsResponse : [];
        const claimList = Array.isArray(claimsResponse) ? claimsResponse : [];

        setSummary(summaryResponse);
        setPets(petList);
        setRecords(normalizeRecordTimeline(recordList));
        setDocuments(normalizeDocuments(claimList, summaryResponse.doc_count));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('마이페이지 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchMyPageData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isPremium = useMemo(() => summary?.effective_tier === 'premium', [summary]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-600">로그인 상태를 확인하고 있어요...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl bg-gradient-to-br from-[#1B3A4B] to-[#163242] px-6 py-12 text-center text-white shadow-xl">
          <p className="text-lg font-semibold">로그인하면 앱 데이터를 웹에서도 볼 수 있어요</p>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-6 rounded-xl bg-[#E67E22] px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-ctaHover"
          >
            로그인
          </button>
        </section>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 sm:p-7">
        <header className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#F97316]/70 bg-[#FFF7ED] text-3xl">
              {user.displayName?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#7C2D12]">{user.displayName ?? '보호자님'}</h1>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              {!isPremium ? (
                <span className="mt-3 inline-flex rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-bold text-[#C2410C]">
                  프리미엄으로 업그레이드
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {isFetching ? <p className="text-sm text-slate-600">데이터를 불러오는 중이에요...</p> : null}
        {errorMessage ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{errorMessage}</p> : null}

        <section className="rounded-3xl bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#7C2D12]">🐾 우리 아이들</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {pets.map((pet) => {
              const isExpanded = expandedPetId === pet.id;

              return (
                <article key={pet.id} className="rounded-2xl border border-[#FED7AA] bg-white p-4">
                  <button
                    type="button"
                    onClick={() => setExpandedPetId(isExpanded ? null : pet.id)}
                    className="flex w-full items-start justify-between text-left"
                  >
                    <div>
                      <p className="text-xl">{getPetIcon(pet.species)}</p>
                      <h3 className="mt-1 text-base font-bold text-[#9A3412]">{pet.name}</h3>
                      <p className="text-sm text-slate-600">
                        {pet.breed ?? pet.species} · {getAgeLabel(pet.birth_date)}
                      </p>
                    </div>
                    <span className="text-sm text-[#C2410C]">{isExpanded ? '접기' : '자세히 보기'}</span>
                  </button>

                  {isExpanded ? (
                    <dl className="mt-3 space-y-1 rounded-xl bg-[#FFF7ED] p-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <dt>품종</dt>
                        <dd>{pet.breed ?? '정보 없음'}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>체중</dt>
                        <dd>{pet.weight_kg ? `${pet.weight_kg}kg` : '정보 없음'}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>기록 보기</dt>
                        <dd>
                          <Link className="font-semibold text-[#EA580C]" href={`/mypage/records?petId=${encodeURIComponent(pet.id)}`}>
                            이동
                          </Link>
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                </article>
              );
            })}
          </div>
          {pets.length === 0 ? <p className="mt-4 text-sm text-slate-500">등록된 반려동물이 없어요.</p> : null}
        </section>

        <section className="rounded-3xl bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#7C2D12]">📋 진료 기록</h2>
          <div className="mt-4 space-y-4">
            {records.map((record) => (
              <article key={record.id} className="relative rounded-2xl border border-[#FED7AA] bg-white p-4 pl-8">
                <span className="absolute left-3 top-5 h-2.5 w-2.5 rounded-full bg-[#FB923C]" />
                <p className="text-xs text-slate-500">{formatVisitDate(record.visitDate)}</p>
                <p className="mt-1 font-semibold text-slate-800">{record.hospitalName}</p>
                <p className="text-sm text-slate-600">{record.itemName}</p>
                <p className="mt-2 text-lg font-bold text-[#F97316]">{currencyFormatter.format(record.totalAmount)}원</p>
              </article>
            ))}
          </div>
          {records.length === 0 ? <p className="mt-4 text-sm text-slate-500">최근 진료 기록이 없어요.</p> : null}
        </section>

        <section className="rounded-3xl bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#7C2D12]">📄 문서 보관함</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {documents.map((document) => (
              <article key={document.id} className="rounded-2xl border border-[#FFEDD5] bg-white p-4">
                <p className="font-semibold text-slate-800">{document.title}</p>
                <p className="mt-1 text-sm text-slate-500">{document.subtitle}</p>
              </article>
            ))}
          </div>
          {documents.length === 0 ? <p className="mt-4 text-sm text-slate-500">보관된 문서가 없어요.</p> : null}
        </section>

        <button
          type="button"
          onClick={() => {
            void signOut();
          }}
          className="mt-2 rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          로그아웃
        </button>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
