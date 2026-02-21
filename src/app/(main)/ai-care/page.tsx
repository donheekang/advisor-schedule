'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

interface CostItem {
  name: string;
  minPrice: number;
  maxPrice: number;
}

interface Condition {
  name: string;
  probability: string;
  description: string;
  items: CostItem[];
  totalMin: number;
  totalMax: number;
}

interface AnalysisResult {
  conditions: Condition[];
  recommendation: string;
}

type AppPet = {
  id: string;
  name?: string;
  species?: string;
  breed?: string;
  weight_kg?: number;
  birthday?: string;
  allergy_tags?: string[];
};

type AppRecord = {
  visit_date?: string;
  hospital_name?: string;
  items?: Array<Record<string, unknown>>;
  total_amount?: number;
  tags?: string[];
};

const SYMPTOM_CHIPS = [
  { emoji: '🦴', label: '다리를 절어요' },
  { emoji: '🤮', label: '구토를 해요' },
  { emoji: '😿', label: '밥을 안 먹어요' },
  { emoji: '🩸', label: '피가 나요' },
  { emoji: '👁️', label: '눈이 충혈됐어요' },
  { emoji: '🦷', label: '입냄새가 심해요' },
  { emoji: '🐾', label: '발을 계속 핥아요' },
  { emoji: '😰', label: '기침을 해요' },
  { emoji: '💧', label: '물을 많이 마셔요' },
  { emoji: '🔄', label: '빙글빙글 돌아요' },
  { emoji: '😫', label: '힘이 없어요' },
  { emoji: '🩹', label: '피부가 빨개요' },
];

const DOG_BREEDS = ['말티즈', '푸들', '포메라니안', '치와와', '시츄', '골든리트리버', '진돗개', '비숑', '코카스파니엘', '닥스훈트', '믹스', '기타'];
const CAT_BREEDS = ['코리안숏헤어', '러시안블루', '페르시안', '브리티시숏헤어', '스코티시폴드', '랙돌', '샴', '먼치킨', '노르웨이숲', '벵갈', '믹스', '기타'];

export default function AiCarePage() {
  const { user } = useAuth();
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [appPets, setAppPets] = useState<AppPet[]>([]);
  const [selectedAppPet, setSelectedAppPet] = useState<AppPet | null>(null);
  const [appRecords, setAppRecords] = useState<AppRecord[]>([]);
  const [appDataLoaded, setAppDataLoaded] = useState(false);
  const [expandedConditionIndexes, setExpandedConditionIndexes] = useState<number[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const breedOptions = petType === 'dog' ? DOG_BREEDS : CAT_BREEDS;

  const isChipSelected = (label: string) => symptoms.includes(label);

  const applyPetToForm = (pet: AppPet) => {
    setPetType(pet.species === 'cat' ? 'cat' : 'dog');

    if (pet.breed) {
      setBreed(pet.breed);
    }

    if (pet.weight_kg) {
      setWeight(String(pet.weight_kg));
    }

    if (pet.birthday) {
      const birth = new Date(pet.birthday);
      const ageYears = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      setAge(String(ageYears));
    }
  };

  useEffect(() => {
    if (!user) {
      setAppPets([]);
      setSelectedAppPet(null);
      setAppRecords([]);
      setAppDataLoaded(false);
      return;
    }

    const loadAppData = async () => {
      try {
        const petsResult = await apiClient.listPets();
        const pets = (Array.isArray(petsResult)
          ? petsResult
          : ((petsResult as { items?: AppPet[] }).items ?? [])) as AppPet[];

        setAppPets(pets);

        if (pets.length > 0) {
          const firstPet = pets[0];
          setSelectedAppPet(firstPet);
          applyPetToForm(firstPet);

          const recordsResult = await apiClient.listRecords(firstPet.id, true);
          const records = (Array.isArray(recordsResult)
            ? recordsResult
            : ((recordsResult as { items?: AppRecord[] }).items ?? [])) as AppRecord[];

          setAppRecords(records);
        }

        setAppDataLoaded(true);
      } catch (loadError) {
        console.warn('앱 데이터 로드 실패:', loadError);
        setAppDataLoaded(true);
      }
    };

    void loadAppData();
  }, [user]);

  const handleAppPetChange = async (petId: string) => {
    const pet = appPets.find((item) => item.id === petId);

    if (!pet) {
      return;
    }

    setSelectedAppPet(pet);
    applyPetToForm(pet);

    try {
      const recordsResult = await apiClient.listRecords(pet.id, true);
      const records = (Array.isArray(recordsResult)
        ? recordsResult
        : ((recordsResult as { items?: AppRecord[] }).items ?? [])) as AppRecord[];

      setAppRecords(records);
    } catch (recordsError) {
      console.warn('진료기록 로드 실패:', recordsError);
    }
  };

  const handleChipToggle = (label: string) => {
    setSymptoms((prev) => {
      if (prev.includes(label)) {
        return prev
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && line !== label)
          .join('\n');
      }

      const trimmed = prev.trim();
      if (!trimmed) {
        return label;
      }

      return trimmed + '\n' + label;
    });
  };

  useEffect(() => {
    if (!result || result.conditions.length === 0) {
      setExpandedConditionIndexes([]);
      return;
    }

    setExpandedConditionIndexes([0]);
  }, [result]);

  const isConditionExpanded = (index: number) => expandedConditionIndexes.includes(index);

  const handleToggleCondition = (index: number) => {
    setExpandedConditionIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      return prev.concat(index);
    });
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (user && selectedAppPet) {
        const profile = {
          name: selectedAppPet.name || '우리 아이',
          species: selectedAppPet.species || (petType === 'cat' ? 'cat' : 'dog'),
          breed: selectedAppPet.breed || breed || '믹스',
          age_text: age ? age + '살' : '미입력',
          weight_current: selectedAppPet.weight_kg || weight || 0,
          allergies: selectedAppPet.allergy_tags || [],
          symptoms_text: symptoms,
        };

        const medicalHistory = appRecords.map((record) => ({
          visit_date: record.visit_date,
          clinic_name: record.hospital_name || '',
          item_count: record.items?.length || 0,
          total_amount: record.total_amount || 0,
          tags: record.tags || [],
        }));

        const analyzeResult = await apiClient.analyzeAiCare({
          profile,
          medicalHistory,
          forceRefresh: false,
        });

        const summary = (analyzeResult.summary as string | undefined) || '';

        if (Array.isArray(analyzeResult.conditions)) {
          setResult(analyzeResult as unknown as AnalysisResult);
        } else {
          const estimateRes = await fetch('/api/ai-estimate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petType, breed, age, weight, symptoms }),
          });

          if (!estimateRes.ok) {
            const estimateError = await estimateRes.json();
            throw new Error((estimateError as { error?: string }).error || 'AI 분석 실패');
          }

          const estimateData = (await estimateRes.json()) as AnalysisResult;

          if (summary) {
            estimateData.recommendation = summary + '\n\n' + (estimateData.recommendation || '');
          }

          if (appRecords.length > 0) {
            estimateData.recommendation += '\n\n앱 진료기록 ' + appRecords.length + '건이 분석에 반영되었습니다.';
          }

          setResult(estimateData);
        }
      } else {
        const res = await fetch('/api/ai-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ petType, breed, age, weight, symptoms }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error((data as { error?: string }).error || 'AI 분석 실패');
        }

        const data = await res.json();
        setResult(data as AnalysisResult);
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (analyzeError: unknown) {
      if (analyzeError instanceof Error) {
        setError(analyzeError.message || 'AI 분석 중 오류가 발생했습니다');
      } else {
        setError('AI 분석 중 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg bg-white px-5 pb-20 pt-24 md:pt-28">
      <div className="pb-6">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#48B8D0]" />
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#191F28]">AI 진료비 견적서</h1>
        </div>
        <p className="pl-[18px] text-sm text-[#8B95A1]">증상을 입력하면 AI가 예상 질환과 진료비를 분석해요</p>
      </div>

      <section className="border-b-8 border-[#F2F4F6] pb-7">
        {user && appPets.length > 0 && (
          <div className="mb-5 rounded-[14px] bg-[#F8FAFB] p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-bold text-[#1F2937]">앱 데이터 연동됨</span>
              <span className="text-xs text-[#6B7280]">— 진료기록 {appRecords.length}건 반영</span>
            </div>
            {appPets.length > 1 && (
              <select
                value={selectedAppPet?.id || ''}
                onChange={(event) => void handleAppPetChange(event.target.value)}
                className="mt-1 rounded-lg border border-[#48B8D0]/30 bg-white px-3 py-2 text-sm text-[#0B3041] outline-none"
              >
                {appPets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.species === 'cat' ? '고양이' : '강아지'} {pet.name}
                    {pet.breed ? ' (' + pet.breed + ')' : ''}
                  </option>
                ))}
              </select>
            )}
            {appPets.length === 1 && selectedAppPet && (
              <p className="text-sm font-medium text-[#48B8D0]">
                {selectedAppPet.species === 'cat' ? '고양이' : '강아지'} {selectedAppPet.name}
                {selectedAppPet.breed ? ' (' + selectedAppPet.breed + ')' : ''} 의 정보로 분석합니다
              </p>
            )}
          </div>
        )}

        {!user && (
          <div className="mb-5 rounded-[14px] bg-[#F8FAFB] p-4">
            <p className="text-sm text-[#1F2937]">
              <a href="/login" className="font-semibold text-[#48B8D0] transition-colors hover:text-[#3A9BB0]">로그인</a>하면 앱에 등록된 반려동물 정보와 진료기록이 자동으로 반영돼요
            </p>
          </div>
        )}

        <h2 className="mb-5 text-[17px] font-bold tracking-tight text-[#191F28]">반려동물 정보</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="mb-2 text-xs font-semibold text-[#6B7280]">반려동물 종류</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPetType('dog')}
                className={
                  'flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-base font-semibold transition ' +
                  (petType === 'dog'
                    ? 'border-[#191F28] bg-[#191F28] text-white'
                    : 'border-[#E5E8EB] bg-white text-[#8B95A1] hover:border-[#CBD5E1]')
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13 13 0 0 0-.493-3.309m-9.243-6.082A8.8 8.8 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>
                강아지
              </button>
              <button
                type="button"
                onClick={() => setPetType('cat')}
                className={
                  'flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-base font-semibold transition ' +
                  (petType === 'cat'
                    ? 'border-[#191F28] bg-[#191F28] text-white'
                    : 'border-[#E5E8EB] bg-white text-[#8B95A1] hover:border-[#CBD5E1]')
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.2 6.71-.56 2.09 2.04 1.95 5.4-.31 7.28l-.29.26c.52 1.39.8 2.88.8 4.42 0 3.28-2.73 5.34-6.5 5.34h-4.82C5.73 22 3 19.94 3 16.66c0-1.54.28-3.03.8-4.42l-.29-.26C1.23 10.1 1.09 6.74 3.18 4.7 4.86 3.06 8.11 3.26 9.89 5.26c.65-.17 1.34-.26 2.11-.26Z"/><path d="M10 14L8 18"/><path d="M14 14l2 4"/></svg>
                고양이
              </button>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#6B7280]">품종</span>
            <select
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            >
              <option value="">품종 선택</option>
              {breedOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#6B7280]">나이</span>
            <input
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="예: 5"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-[#6B7280]">몸무게 (kg)</span>
            <input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="예: 4.2"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            />
          </label>
        </div>
      </section>

      <section className="border-b-8 border-[#F2F4F6] pb-7 pt-7">
        <h2 className="mb-4 text-[17px] font-bold tracking-tight text-[#191F28]">증상 입력</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {SYMPTOM_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChipToggle(chip.label)}
              className={
                'rounded-full border px-3.5 py-2 text-[13px] font-medium transition ' +
                (isChipSelected(chip.label)
                  ? 'border-[#191F28] bg-[#191F28] text-white'
                  : 'border-[#E5E8EB] bg-white text-[#4E5968] hover:border-[#CBD5E1]')
              }
            >
              {chip.label}
            </button>
          ))}
        </div>

        <textarea
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
          placeholder="아이의 증상을 자세히 입력해주세요.\n예) 2일 전부터 밥을 잘 안 먹고 구토를 2번 했어요."
          rows={6}
          className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
        />

        {error ? <p className="mt-3 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#DC2626]">{error}</p> : null}

        {user && appPets.length > 0 ? (
          <div className="mt-5 rounded-[14px] bg-[#F8FAFB] p-4 text-center">
            <p className="text-sm font-medium text-[#191F28]"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#06B56C]" />{selectedAppPet?.name || '우리 아이'}의 진료기록 {appRecords.length}건이 AI 분석에 반영됩니다</p>
          </div>
        ) : user && appDataLoaded && appPets.length === 0 ? (
          <div className="mt-5 rounded-[14px] bg-[#F8FAFB] p-4 text-center">
            <p className="text-sm font-medium text-[#0B3041]">앱에서 반려동물을 등록하면 더 정확한 견적을 받을 수 있어요</p>
            <p className="mt-1 text-xs text-[#6B7280]">앱 출시 예정</p>
          </div>
        ) : (
          <div className="mt-5 rounded-[14px] bg-[#F8FAFB] p-4 text-center">
            <p className="text-sm font-medium text-[#0B3041]">
              <a href="/login" className="font-semibold text-[#48B8D0] transition-colors hover:text-[#3A9BB0]">로그인</a>하면 앱 진료기록 기반으로 더 정확한 AI 분석을 받을 수 있어요
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !symptoms.trim()}
          className={
            'mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-[17px] text-[15px] font-bold text-white transition ' +
            (loading || !symptoms.trim()
              ? 'cursor-not-allowed bg-[#E5E8EB] text-[#8B95A1]'
              : 'bg-[#191F28] hover:bg-[#333D4B]')
          }
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              AI가 분석 중이에요...
            </>
          ) : (
            'AI 진료비 견적서 생성하기'
          )}
        </button>
      </section>

      <section ref={resultRef} className="mt-6">
        {result ? (
          <div className="overflow-hidden rounded-[24px] bg-white">
            <div className="border-b border-[#F2F4F6] px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F04452]" />
                <p className="text-[13px] font-semibold text-[#F04452]">참고용 정보이며 의료적 진단이 아닙니다</p>
              </div>
            </div>

            <div className="border-b-8 border-[#F2F4F6] px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F2F4F6]">
                  <span className={'h-3 w-3 rounded-full ' + (petType === 'dog' ? 'bg-[#48B8D0]' : 'bg-[#A78BFA]')} />
                </div>
                <div>
                  <p className="text-[16px] font-bold tracking-tight text-[#191F28]">{breed || '품종 미입력'} · {age || '-'}살</p>
                  <p className="mt-0.5 text-[13px] text-[#8B95A1]">{weight || '-'}kg · &quot;{symptoms.split('\n')[0] || '증상 미입력'}&quot;</p>
                </div>
              </div>
            </div>

            {result.conditions.map((condition, index) => (
              <article key={condition.name + '-' + index.toString()} className="border-b-8 border-[#F2F4F6] px-6 py-6">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={
                      'h-1.5 w-1.5 rounded-full ' +
                      (condition.probability === '높음'
                        ? 'bg-[#F04452]'
                        : condition.probability === '보통'
                          ? 'bg-[#FF8A3D]'
                          : 'bg-[#06B56C]')
                    }
                  />
                  <span
                    className={
                      'text-xs font-bold ' +
                      (condition.probability === '높음'
                        ? 'text-[#F04452]'
                        : condition.probability === '보통'
                          ? 'text-[#FF8A3D]'
                          : 'text-[#06B56C]')
                    }
                  >
                    가능성 {condition.probability}
                  </span>
                </div>

                <h3 className="mb-1 text-[17px] font-bold tracking-tight text-[#191F28]">{condition.name}</h3>

                <div className="mb-3">
                  <span className="text-[28px] font-extrabold tracking-tight text-[#191F28]" style={{ fontFeatureSettings: "'tnum'" }}>
                    {condition.totalMin.toLocaleString()}
                  </span>
                  <span className="mx-1.5 text-base text-[#8B95A1]">~</span>
                  <span className="text-[28px] font-extrabold tracking-tight text-[#191F28]" style={{ fontFeatureSettings: "'tnum'" }}>
                    {condition.totalMax.toLocaleString()}
                  </span>
                  <span className="ml-0.5 text-base font-semibold text-[#8B95A1]">원</span>
                </div>

                <p className="text-sm leading-relaxed text-[#8B95A1]">{condition.description}</p>

                {isConditionExpanded(index) ? (
                  <div className="mt-5 space-y-0">
                    {condition.items.map((item, itemIndex) => (
                      <div
                        key={item.name + '-' + itemIndex.toString()}
                        className="flex items-center justify-between border-t border-[#F2F4F6] py-3.5"
                      >
                        <span className="text-sm font-medium text-[#4E5968]">{item.name}</span>
                        <span className="text-sm font-semibold text-[#191F28]" style={{ fontFeatureSettings: "'tnum'" }}>
                          {item.minPrice.toLocaleString()} ~ {item.maxPrice.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <button type="button" onClick={() => handleToggleCondition(index)} className="mt-4 flex w-full items-center justify-center gap-1">
                  <span className="text-[13px] font-medium text-[#B0B8C1]">{isConditionExpanded(index) ? '접기' : '상세 항목 보기'}</span>
                  <svg
                    className={'h-4 w-4 text-[#B0B8C1] transition-transform ' + (isConditionExpanded(index) ? 'rotate-180' : '')}
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </article>
            ))}

            <article className="border-b-8 border-[#F2F4F6] px-6 py-7">
              <h3 className="mb-3 text-[15px] font-bold text-[#191F28]">수의사 상담 전 추천</h3>
              <p className="text-sm leading-[1.75] text-[#6B7684]">{result.recommendation}</p>
            </article>

            <div className="flex flex-col gap-2.5 px-6 py-6">
              <button type="button" onClick={() => setResult(null)} className="w-full rounded-[14px] bg-[#191F28] py-[17px] text-[15px] font-bold text-white">
                다른 증상 분석하기
              </button>
              <a
                href="/cost-search"
                className="w-full rounded-[14px] bg-[#F2F4F6] py-[17px] text-center text-[15px] font-semibold text-[#4E5968]"
              >
                전국 평균 진료비 보기
              </a>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-[#B0B8C1]">증상을 입력하면 AI가 예상 진료비 견적서를 작성해드려요</p>
          </div>
        )}
      </section>
    </main>
  );
}
