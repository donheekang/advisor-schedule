'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/components/auth-provider';
import { CTABanner } from '@/components/cta-banner';
import { LoginModal } from '@/components/login-modal';
import { apiClient } from '@/lib/api-client';
import { createCoupangSearchUrl, findCareProductsByCategory, type CareProduct } from '@/lib/care-product-map';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';
const APPSTORE_URL = 'https://apps.apple.com/app/id6504879567';
const currencyFormatter = new Intl.NumberFormat('ko-KR');

type PetProfile = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight_kg: number | null;
};

type PetsApiResponse = {
  pets?: PetProfile[];
};

type RecordItem = {
  item_name?: string;
  name?: string;
  price?: number;
};

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
  tags?: string[];
  condition_tags?: string[];
};

function formatVisitDate(value?: string) {
  if (!value) {
    return '날짜 정보 없음';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '날짜 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsed);
}

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

function getPetEmoji(species: string): string {
  const lowerSpecies = species.toLowerCase();
  if (lowerSpecies.includes('고양') || lowerSpecies.includes('cat')) {
    return '🐈';
  }

  return '🐕';
}

export default function MyPage() {
  const { user, loading, token, signOut } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setSelectedPetId('');
      setRecords([]);
      setInsight(null);
      return;
    }

    let mounted = true;

    async function fetchInitialData() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const [petsResponse, recordsResponse] = await Promise.all([
          apiClient.listPets() as Promise<PetsApiResponse | PetProfile[]>,
          apiClient.listRecords(undefined, true) as Promise<MedicalRecord[]>
        ]);

        if (!mounted) {
          return;
        }

        const nextPets = Array.isArray(petsResponse) ? petsResponse : (petsResponse.pets ?? []);
        const nextRecords = (Array.isArray(recordsResponse) ? recordsResponse : [])
          .sort(
            (left, right) =>
              new Date(right.visit_date ?? '').getTime() - new Date(left.visit_date ?? '').getTime()
          )
          .slice(0, 5);

        setPets(nextPets);
        setSelectedPetId((prev) => prev || nextPets[0]?.id || '');
        setRecords(nextRecords);
      } catch {
        if (!mounted) {
          return;
        }
        setErrorMessage('마이페이지 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (mounted) {
          setIsFetching(false);
        }
      }
    }

    void fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!token || !selectedPetId) {
      setInsight(null);
      return;
    }

    let mounted = true;

    async function fetchInsight() {
      try {
        const response = await fetch(`${API_BASE}/api/ai/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ pet_id: selectedPetId })
        });

        if (!response.ok) {
          throw new Error('insight fetch failed');
        }

        const data = (await response.json()) as InsightResponse;

        if (mounted) {
          setInsight(data);
        }
      } catch {
        if (mounted) {
          setInsight(null);
        }
      }
    }

    void fetchInsight();

    return () => {
      mounted = false;
    };
  }, [selectedPetId, token]);

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);
  const insightTags = useMemo(() => insight?.condition_tags ?? insight?.tags ?? [], [insight]);
  const recommendedProducts = useMemo<CareProduct[]>(() => findCareProductsByCategory(insightTags), [insightTags]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-10 text-center shadow-lg">
        <p className="text-sm text-[#A36241]">로그인 상태를 확인하고 있어요...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl bg-white px-5 py-10 text-center shadow-lg ring-1 ring-[#F8C79F]/30 md:px-6 md:py-14">
          <p className="text-4xl">🐾</p>
          <h1 className="mt-4 text-xl font-extrabold text-[#4F2A1D] md:text-2xl">로그인하면 우리 아이 진료 기록을 관리할 수 있어요</h1>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-7 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-7 py-3 text-sm font-bold text-white shadow-lg"
          >
            로그인
          </button>
          <Link href="/ai-care" className="mt-4 text-sm font-semibold text-[#A36241] underline underline-offset-4">
            또는 무료 AI 케어 체험부터 시작해보세요
          </Link>
        </section>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 sm:p-8">
      <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/30 sm:p-7">
        <h1 className="text-2xl font-extrabold text-[#4F2A1D]">마이페이지</h1>
        <p className="mt-2 text-sm text-[#7C4A2D]">앱 진료 기록과 AI 케어 인사이트를 한눈에 확인해보세요.</p>
      </header>

      {errorMessage ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">{errorMessage}</p> : null}
      {isFetching ? <p className="text-sm text-[#A36241]">데이터를 불러오는 중이에요...</p> : null}

      <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
        <h2 className="text-xl font-extrabold text-[#4F2A1D]">A. 펫 프로필</h2>
        {pets.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#FFF8F0] p-5 text-sm text-[#7C4A2D]">
            <p>앱에서 반려동물을 등록해보세요.</p>
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2.5 font-bold text-white"
            >
              앱 다운로드
            </a>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    pet.id === selectedPetId
                      ? 'bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white'
                      : 'bg-[#FFF8F0] text-[#7C4A2D] ring-1 ring-[#F8C79F]/30'
                  }`}
                >
                  {pet.name}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <article key={pet.id} className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-5 ring-1 ring-[#F8C79F]/30">
                  <p className="text-2xl">{getPetEmoji(pet.species)}</p>
                  <h3 className="mt-1 text-lg font-extrabold text-[#4F2A1D]">{pet.name}</h3>
                  <p className="text-sm text-[#7C4A2D]">종류: {pet.species}</p>
                  <p className="text-sm text-[#7C4A2D]">품종: {pet.breed ?? '정보 없음'}</p>
                  <p className="text-sm text-[#7C4A2D]">나이: {getAgeLabel(pet.birth_date)}</p>
                  <p className="text-sm text-[#7C4A2D]">
                    체중: {pet.weight_kg !== null ? `${pet.weight_kg.toLocaleString('ko-KR')}kg` : '정보 없음'}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
        <h2 className="text-xl font-extrabold text-[#4F2A1D]">B. AI 케어 인사이트 요약</h2>
        {!selectedPet ? (
          <p className="mt-4 text-sm text-[#A36241]">분석할 반려동물을 선택해 주세요.</p>
        ) : insight ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {insightTags.length > 0 ? (
                insightTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#FFF8F0] px-3 py-1 text-xs font-semibold text-[#7C4A2D] ring-1 ring-[#F8C79F]/30">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#A36241]">태그 정보가 아직 없어요.</span>
              )}
            </div>
            <p className="mt-4 rounded-2xl bg-[#FFF8F0] p-4 text-sm text-[#4F2A1D]">
              {insight.summary ?? 'AI 요약 결과가 아직 없어요. 앱에서 진료 데이터를 더 등록해보세요.'}
            </p>
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-bold text-[#F97316] underline underline-offset-4"
            >
              앱에서 상세 분석 보기 →
            </a>
          </>
        ) : (
          <p className="mt-4 text-sm text-[#A36241]">AI 인사이트를 불러오는 중이거나 아직 분석 데이터가 없어요.</p>
        )}
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold text-[#4F2A1D]">C. 최근 진료 기록</h2>
          <Link href="/mypage/records" className="text-sm font-bold text-[#F97316] underline underline-offset-4">
            전체 기록 보기 →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {records.length === 0 ? (
            <p className="text-sm text-[#A36241]">최근 진료 기록이 없어요.</p>
          ) : (
            records.map((record, index) => (
              <article key={record.id ?? `recent-record-${index}`} className="rounded-2xl bg-[#FFF8F0] p-4 ring-1 ring-[#F8C79F]/20">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#4F2A1D]">{formatVisitDate(record.visit_date)}</p>
                  <p className="text-sm font-extrabold text-[#F97316]">{currencyFormatter.format(record.total_amount ?? 0)}원</p>
                </div>
                <p className="mt-1 text-sm text-[#7C4A2D]">{record.hospital_name ?? '병원 정보 없음'}</p>
                <ul className="mt-3 space-y-1 text-xs text-[#7C4A2D]">
                  {(record.items ?? []).map((item, itemIndex) => (
                    <li key={`${item.item_name ?? item.name ?? 'item'}-${itemIndex}`}>
                      • {item.item_name ?? item.name ?? '항목 정보 없음'}
                      {typeof item.price === 'number' ? ` · ${currencyFormatter.format(item.price)}원` : ''}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(record.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#A36241] ring-1 ring-[#F8C79F]/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20">
        <h2 className="text-xl font-extrabold text-[#4F2A1D]">D. 맞춤 케어 추천</h2>
        <div className="mt-4 space-y-3">
          {recommendedProducts.length === 0 ? (
            <p className="text-sm text-[#A36241]">AI 태그를 바탕으로 추천할 케어 상품이 아직 없어요.</p>
          ) : (
            recommendedProducts.slice(0, 4).map((product) => (
              <div key={product.name} className="rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFEDD5] p-4 ring-1 ring-[#F8C79F]/30">
                <p className="text-sm font-bold text-[#4F2A1D]">{product.name}</p>
                <p className="mt-1 text-xs text-[#A36241]">{product.description}</p>
                <a
                  href={createCoupangSearchUrl(product.coupangKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-3 py-2 text-xs font-bold text-white"
                >
                  쿠팡 파트너스 보기
                </a>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="rounded-3xl bg-[#3D2518] p-6 text-white shadow-lg">
        <h2 className="text-xl font-extrabold">E. 앱 다운로드</h2>
        <p className="mt-2 text-sm text-[#FFE3CA]">앱에서는 영수증만 찍으면 이게 다 자동으로 됩니다.</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#FFE3CA]">
          <li>자동 분류</li>
          <li>AI 분석</li>
          <li>일정 알림</li>
          <li>보관함</li>
        </ul>
        <a
          href={APPSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#3D2518]"
        >
          앱스토어에서 다운로드
        </a>
      </article>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CTABanner variant="ai-care" context="mypage-bottom" />
        <CTABanner variant="cost-search" context="mypage-bottom" />
      </div>

      <button
        type="button"
        onClick={() => {
          void signOut();
        }}
        className="rounded-2xl bg-[#FFF8F0] px-5 py-3 text-sm font-bold text-[#7C4A2D] ring-1 ring-[#F8C79F]/40"
      >
        로그아웃
      </button>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </section>
  );
}
