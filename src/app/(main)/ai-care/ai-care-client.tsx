'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { CheckboxCard, FloatingInput, FormSkeleton, AnimateOnScroll } from '@/components/ui';
import { BREED_RISK_TAGS } from '@/lib/condition-tag-map';
import { buildShareText, generateLocalCareReport, getConditionLabels } from '@/lib/care-report';

type FormState = {
  species: '강아지' | '고양이';
  breed: string;
  age: string;
  weight: string;
  allergies: string;
  conditions: string[];
};

type InsightResponse = {
  insight?: string;
  remaining?: number;
};

const CONDITION_OPTIONS = [
  { value: 'skin', label: '피부/알러지' },
  { value: 'dental', label: '구강/치아' },
  { value: 'patella', label: '슬개골' },
  { value: 'joint', label: '관절' },
  { value: 'gi', label: '소화기' },
  { value: 'eye', label: '눈' },
  { value: 'ear', label: '귀' },
  { value: 'vaccine', label: '예방접종' },
  { value: 'neutering', label: '중성화' },
  { value: 'heart', label: '심장' },
  { value: 'kidney', label: '신장' },
  { value: 'obesity', label: '비만/체중관리' },
] as const;

const BREED_OPTIONS = [...Object.keys(BREED_RISK_TAGS).sort((a, b) => a.localeCompare(b, 'ko')), '기타'];

export default function AiCareClient() {
  const [form, setForm] = useState<FormState>({
    species: '강아지',
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    conditions: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);

  const allergyList = useMemo(
    () => form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
    [form.allergies],
  );

  const report = useMemo(
    () => generateLocalCareReport(form.species, form.breed, Number(form.age) || 0, form.conditions, allergyList),
    [allergyList, form.age, form.breed, form.conditions, form.species],
  );

  const hasResult = Boolean(form.breed.trim()) && Boolean(form.age);

  const toggleCondition = (value: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      conditions: checked
        ? [...prev.conditions, value]
        : prev.conditions.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setAiInsight('');

    if (!form.breed.trim() || !form.age) {
      setError('품종과 나이는 꼭 입력해주세요.');
      return;
    }

    setIsLoading(true);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const response = await fetch('/api/ai-care/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          species: form.species,
          breed: form.breed,
          age: Number(form.age) || 0,
          weight: Number(form.weight) || 0,
          allergies: allergyList,
          conditions: form.conditions,
        }),
      });

      if (!response.ok) {
        const failed = (await response.json()) as { message?: string };
        throw new Error(failed.message ?? '추가 인사이트를 불러오지 못했어요.');
      }

      const payload = (await response.json()) as InsightResponse;
      setAiInsight(payload.insight ?? '');
      setRemaining(payload.remaining ?? null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '분석 중 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = buildShareText(report, form.breed, getConditionLabels(form.conditions));
    await navigator.clipboard.writeText(text);
  };

  return (
    <main className="w-full rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <section className="py-12 md:py-16">
          <AnimateOnScroll animation="fade-up">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E6] px-3 py-1.5 text-xs font-semibold text-[#F97316]">✨ 30초 무료 AI 견적서</span>
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#4F2A1D] md:text-4xl">우리 아이 맞춤 케어,<br />지금 바로 확인하세요</h1>
            <p className="text-sm text-[#8B6B4E]">로그인 없이 간단한 정보만 입력하면 맞춤 관리 포인트와 케어 추천을 보여드려요.</p>
          </AnimateOnScroll>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-6 text-lg font-bold text-[#4F2A1D]">STEP 1. 아이 정보를 입력해요</h2>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#8B6B4E]">종류</label>
                  <select
                    value={form.species}
                    onChange={(event) => setForm((prev) => ({ ...prev, species: event.target.value as FormState['species'] }))}
                    className="w-full rounded-xl border border-[#E8D5C0] bg-white px-4 py-3 text-sm text-[#4F2A1D] outline-none transition-all duration-200 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                  >
                    <option>강아지</option>
                    <option>고양이</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#8B6B4E]">품종 선택</label>
                  <select
                    value={form.breed}
                    onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
                    className="w-full rounded-xl border border-[#E8D5C0] bg-white px-4 py-3 text-sm text-[#4F2A1D] outline-none transition-all duration-200 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                  >
                    <option value="">품종 선택</option>
                    {BREED_OPTIONS.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <FloatingInput id="age" label="나이(살)" type="number" value={form.age} onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))} />
                <FloatingInput id="weight" label="체중(kg)" type="number" step="0.1" value={form.weight} onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))} />
              </div>

              <div className="mb-6">
                <FloatingInput id="allergies" label="알러지 정보 (쉼표로 구분)" value={form.allergies} onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))} />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-[#4F2A1D]">최근 진료 이력</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {CONDITION_OPTIONS.map((item) => (
                    <CheckboxCard
                      key={item.value}
                      label={item.label}
                      checked={form.conditions.includes(item.value)}
                      onChange={(checked) => toggleCondition(item.value, checked)}
                    />
                  ))}
                </div>
              </div>

              <button disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] py-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F97316]/25 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
                {isLoading ? 'AI 분석 중...' : 'AI 분석 시작하기 →'}
              </button>
              {error ? <p className="mt-3 text-sm font-medium text-rose-500">{error}</p> : null}
            </div>
          </AnimateOnScroll>

          {!hasResult ? (
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative overflow-hidden rounded-3xl border border-[#0B3041]/[0.06] bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-[2px]">
                  <div className="rounded-2xl bg-[#0B3041] px-6 py-3 text-sm font-bold text-white shadow-lg">
                    ✦ 증상을 입력하면 이런 결과를 볼 수 있어요
                  </div>
                </div>

                <div className="opacity-80">
                  <p className="mb-1 text-xs font-semibold text-[#48B8D0]">AI 진료비 견적 · 예시</p>
                  <h4 className="mb-4 text-lg font-bold text-[#0B3041]">슬개골 탈구 2기 · 소형견</h4>

                  <div className="mb-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-[#F8FAFB] p-3 text-center">
                      <p className="text-xs text-[#6B7280]">최소</p>
                      <p className="text-lg font-extrabold text-[#0B3041]">80만</p>
                    </div>
                    <div className="rounded-2xl bg-[#48B8D0]/10 p-3 text-center">
                      <p className="text-xs text-[#48B8D0]">평균</p>
                      <p className="text-lg font-extrabold text-[#48B8D0]">150만</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFB] p-3 text-center">
                      <p className="text-xs text-[#6B7280]">최대</p>
                      <p className="text-lg font-extrabold text-[#0B3041]">250만</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-[#6B7280]">• 자주 동반되는 검사: 혈액검사, X-ray</p>
                    <p className="text-sm text-[#6B7280]">• 평균 입원 기간: 1~3일</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <AnimateOnScroll animation="fade-up">
            <section ref={resultRef} className="mt-6 rounded-2xl border border-[#F8C79F]/10 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-2 text-lg font-bold text-[#4F2A1D]">STEP 2. 맞춤 분석 결과</h2>

              {isLoading ? (
                <FormSkeleton />
              ) : !hasResult ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3E6]">
                    <span className="text-3xl text-[#F97316]/50">✨</span>
                  </div>
                  <p className="text-sm text-[#8B6B4E]">입력을 완료하고 분석 버튼을 누르면 결과가 여기에 표시돼요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[#6B4226]">{report.summary}</p>
                  {aiInsight ? <p className="whitespace-pre-line rounded-xl bg-[#FFF8F0] p-4 text-sm text-[#6B4226]">{aiInsight}</p> : null}
                  {remaining !== null ? <p className="text-xs text-[#8B6B4E]">오늘 남은 AI 인사이트: {remaining}회</p> : null}
                  <button type="button" onClick={() => void handleCopy()} className="rounded-xl border border-[#E8D5C0] px-4 py-2 text-sm font-medium text-[#6B4226]">결과 복사하기</button>
                </div>
              )}
            </section>
          </AnimateOnScroll>
        </form>
      </div>
    </main>
  );
}
