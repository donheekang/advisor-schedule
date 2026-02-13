'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';
import { apiClient } from '@/lib/api-client';
import { PetCard, type PetData } from '@/components/mypage/pet-card';
import { SummaryStats, type SummaryData } from '@/components/mypage/summary-stats';

type PetsApiResponse = {
  pets?: PetData[];
};

export default function MyPage() {
  const { user, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [pets, setPets] = useState<PetData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      setPets([]);
      return;
    }

    let isMounted = true;

    async function fetchMyPageData() {
      setIsFetching(true);
      setErrorMessage(null);

      try {
        const [summaryResponse, petsResponse] = await Promise.all([
          apiClient.getMeSummary() as Promise<SummaryData>,
          apiClient.listPets() as Promise<PetsApiResponse | PetData[]>
        ]);

        if (!isMounted) {
          return;
        }

        const petList = Array.isArray(petsResponse) ? petsResponse : (petsResponse.pets ?? []);

        setSummary(summaryResponse);
        setPets(petList);
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
            className="mt-6 rounded-xl bg-[#2A9D8F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#238478]"
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
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#1B3A4B]">마이페이지</h1>
          <p className="mt-1 text-sm text-slate-600">앱에서 기록한 반려동물 데이터를 한눈에 확인해 보세요.</p>
        </header>

        {isFetching ? <p className="text-sm text-slate-600">데이터를 불러오는 중이에요...</p> : null}
        {errorMessage ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{errorMessage}</p> : null}

        {summary ? <SummaryStats summary={summary} /> : null}

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#1B3A4B]">내 반려동물</h2>
          <p className="mt-1 text-sm text-slate-500">카드를 눌러 해당 반려동물의 진료 기록을 확인해 보세요.</p>

          {pets.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">등록된 반려동물이 없어요.</p>
          )}
        </section>

        <section className="rounded-2xl bg-[#1B3A4B] p-6 text-white shadow-lg shadow-[#1B3A4B]/25">
          <h2 className="text-lg font-bold">앱에서 더 많은 기능을 사용해보세요</h2>
          <p className="mt-2 text-sm text-slate-100">진료비 영수증 분석, AI 케어 리포트, 알림 관리 기능을 앱에서 이용할 수 있어요.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="https://apps.apple.com/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1B3A4B] transition hover:bg-slate-100"
            >
              App Store 다운로드
            </Link>
            <Link
              href="https://play.google.com/store"
              className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Google Play 다운로드
            </Link>
          </div>
        </section>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
