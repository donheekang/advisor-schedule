'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { createCoupangSearchUrl } from '@/lib/care-product-map';
import { TAG_LABELS } from '@/lib/condition-tag-map';
import { Product, groupProductsByCategory } from '@/lib/product-recommender';

type Ingredient = {
  name: string;
  points: number;
  reason: string;
};

type AnalyzeResponse = {
  summary: string;
  conditionTags: string[];
  ingredients: Ingredient[];
  products: Product[];
  remaining: number;
};

type FormState = {
  species: string;
  breed: string;
  age: string;
  weight: string;
  allergies: string;
  conditions: string[];
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
  { value: 'obesity', label: '비만/체중관리' }
] as const;

export default function AiCareClient() {
  const [form, setForm] = useState<FormState>({
    species: '강아지',
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    conditions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);

  const allergyList = useMemo(
    () => form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
    [form.allergies]
  );

  const groupedProducts = useMemo(
    () => (result ? groupProductsByCategory(result.products) : null),
    [result]
  );

  const handleConditionToggle = (value: string) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(value)
        ? prev.conditions.filter((item) => item !== value)
        : [...prev.conditions, value]
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

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
          conditions: form.conditions
        })
      });

      if (!response.ok) {
        const failed = (await response.json()) as { message?: string };
        throw new Error(failed.message ?? 'AI 분석 요청 중 오류가 발생했어요.');
      }

      const payload = (await response.json()) as AnalyzeResponse;
      setResult(payload);

      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'AI 분석 중 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen rounded-[2rem] bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] p-5 md:p-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <p className="inline-flex rounded-full bg-[#FFF8F0] px-3 py-1 text-sm font-semibold text-[#C2410C]">✨ 30초 무료 AI 케어 체험</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">우리 아이 맞춤 케어, 지금 바로 확인해요</h1>
          <p className="mt-3 text-[#7C2D12]/80">로그인 없이 간단한 정보만 입력하면 맞춤 관리 포인트와 케어 추천을 보여드려요.</p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <h2 className="text-xl font-bold text-[#4F2A1D]">STEP 1. 아이 정보를 입력해요</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
              종류
              <select
                value={form.species}
                onChange={(event) => setForm((prev) => ({ ...prev, species: event.target.value }))}
                className="w-full rounded-2xl border border-[#F8C79F] bg-white px-4 py-3 text-sm"
              >
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
              품종
              <input
                value={form.breed}
                onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
                placeholder="예: 말티즈"
                className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3 text-sm"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
              나이(살)
              <input
                type="number"
                min={0}
                value={form.age}
                onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                placeholder="예: 4"
                className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3 text-sm"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
              체중(kg)
              <input
                type="number"
                min={0}
                step="0.1"
                value={form.weight}
                onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
                placeholder="예: 5.2"
                className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3 text-sm"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2 text-sm font-semibold text-[#4F2A1D]">
            알러지 정보 (쉼표로 구분)
            <input
              value={form.allergies}
              onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))}
              placeholder="예: 연어, 닭고기"
              className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3 text-sm"
            />
          </label>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-[#4F2A1D]">최근 진료 이력</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {CONDITION_OPTIONS.map((item) => (
                <label key={item.value} className="flex items-center gap-2 rounded-xl bg-[#FFF8F0] px-3 py-2 text-sm text-[#4F2A1D]">
                  <input
                    type="checkbox"
                    checked={form.conditions.includes(item.value)}
                    onChange={() => handleConditionToggle(item.value)}
                    className="h-4 w-4 accent-[#F97316]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" disabled={isLoading} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-5 py-3 font-bold text-white disabled:opacity-70">
            {isLoading ? 'AI 분석 중...' : 'AI 분석 시작하기 →'}
          </button>
          {error && <p className="mt-3 text-sm font-semibold text-rose-500">{error}</p>}
        </form>

        <section ref={resultRef} className="space-y-5 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <h2 className="text-xl font-bold text-[#4F2A1D]">STEP 2. 맞춤 분석 결과</h2>
          {isLoading && (
            <div className="space-y-3 rounded-2xl bg-[#FFF8F0] p-5">
              <div className="h-4 w-40 animate-pulse rounded-full bg-[#F8C79F]" />
              <div className="h-4 w-full animate-pulse rounded-full bg-[#F8C79F]/70" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#F8C79F]/50" />
              <p className="text-sm text-[#7C2D12]">AI 분석 중... 잠시만 기다려주세요.</p>
            </div>
          )}

          {!isLoading && !result && <p className="rounded-2xl bg-[#FFF8F0] p-4 text-sm text-[#7C2D12]">입력을 완료하고 분석 버튼을 누르면 결과가 여기에 표시돼요.</p>}

          {!isLoading && result && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#7C2D12]">예상 주요 컨디션 태그</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.conditionTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#F8C79F] bg-[#FFF8F0] px-3 py-1 text-xs font-semibold text-[#9A3412]">
                      #{TAG_LABELS[tag as keyof typeof TAG_LABELS] ?? tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF8F0] p-4">
                <p className="text-sm font-semibold text-[#7C2D12]">맞춤 케어 포인트</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#4F2A1D]">{result.summary}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#7C2D12]">추천 케어 성분 (포인트순)</p>
                <ul className="mt-2 space-y-2">
                  {result.ingredients.map((item) => (
                    <li key={item.name} className="rounded-2xl border border-[#F8C79F]/40 bg-white px-4 py-3">
                      <p className="font-semibold text-[#4F2A1D]">{item.name} · {item.points}점</p>
                      <p className="text-sm text-[#7C2D12]/80">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#7C2D12]">맞춤 케어 상품</p>
                <div className="mt-3 space-y-4">
                  {groupedProducts &&
                    Object.entries(groupedProducts).map(([category, products]) =>
                      products.length > 0 ? (
                        <div key={category} className="rounded-2xl bg-[#FFF8F0] p-4">
                          <p className="font-bold text-[#4F2A1D]">{category}</p>
                          <ul className="mt-2 space-y-2">
                            {products.map((product) => (
                              <li key={product.name} className="rounded-xl bg-white p-3 text-sm">
                                <p className="font-semibold text-[#4F2A1D]">{product.name}</p>
                                <p className="mt-1 text-[#7C2D12]/80">{product.reason}</p>
                                {product.caution && <p className="mt-1 font-semibold text-rose-500">{product.caution}</p>}
                                <a
                                  href={createCoupangSearchUrl(product.coupangKeyword)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-flex text-xs font-semibold text-[#EA580C]"
                                >
                                  쿠팡에서 보기 →
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null
                    )}
                </div>
              </div>

              <div className="rounded-3xl bg-[#3D2518] p-6 text-white">
                <p className="text-lg font-bold">앱에서는 이게 자동으로 됩니다</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#FFE9D2]">
                  <li>진료 기록 기반으로 케어 루틴 자동 업데이트</li>
                  <li>품종/나이별 위험 신호 알림</li>
                  <li>영양제/예방 일정 리마인드</li>
                </ul>
                <a href="https://apps.apple.com" className="mt-4 inline-flex rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-5 py-3 text-sm font-bold text-white">
                  앱 다운로드하고 자동 케어 받기 →
                </a>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
