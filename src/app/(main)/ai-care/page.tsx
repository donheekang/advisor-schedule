'use client';

import { useRef, useState } from 'react';

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
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const breedOptions = petType === 'dog' ? DOG_BREEDS : CAT_BREEDS;

  const isChipSelected = (label: string) => symptoms.includes(label);

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

  const probabilityClassName = (probability: string) => {
    if (probability === '높음') {
      return 'border border-[#B28B84] bg-[#D4B8C0]/50 text-[#1F2937]';
    }

    if (probability === '보통') {
      return 'border border-[#48B8D0] bg-[#D4B8C0]/30 text-[#1F2937]';
    }

    return 'border border-gray-200 bg-white text-[#6B7280]';
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/ai-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petType, breed, age, weight, symptoms }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'AI 분석 실패');
      }

      const data = await res.json();
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'AI 분석 중 오류가 발생했습니다');
      } else {
        setError('AI 분석 중 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-24 md:pt-28">
      <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#48B8D0] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#48B8D0]" />
          </span>
          <h1 className="text-2xl font-extrabold text-[#1F2937] md:text-3xl">AI 진료비 견적서</h1>
        </div>
        <p className="text-sm text-[#6B7280] md:text-base">증상을 입력하면 Claude AI가 예상 질환과 진료비 범위를 분석해드려요.</p>
      </section>

      <section className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-5 text-lg font-bold text-[#1F2937]">1단계. 반려동물 정보</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="mb-2 text-xs font-semibold text-[#6B7280]">반려동물 종류</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPetType('dog')}
                className={
                  'flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-semibold transition ' +
                  (petType === 'dog'
                    ? 'border-[#48B8D0] bg-[#48B8D0]/5 text-[#48B8D0]'
                    : 'border-gray-200 bg-white text-[#6B7280] hover:border-[#B28B84]')
                }
              >
                <span>🐶</span>
                강아지
              </button>
              <button
                type="button"
                onClick={() => setPetType('cat')}
                className={
                  'flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-semibold transition ' +
                  (petType === 'cat'
                    ? 'border-[#48B8D0] bg-[#48B8D0]/5 text-[#48B8D0]'
                    : 'border-gray-200 bg-white text-[#6B7280] hover:border-[#B28B84]')
                }
              >
                <span>🐱</span>
                고양이
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#6B7280]">품종</span>
            <select
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            >
              <option value="">품종을 선택해주세요</option>
              {breedOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#6B7280]">나이 (살)</span>
            <input
              type="number"
              min="0"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="예: 5"
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-xs font-semibold text-[#6B7280]">체중 (kg)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="예: 3.2"
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#48B8D0] focus:bg-white"
            />
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-5 text-lg font-bold text-[#1F2937]">2단계. 증상 입력</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {SYMPTOM_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChipToggle(chip.label)}
              className={
                'rounded-full border px-3 py-2 text-xs font-medium transition ' +
                (isChipSelected(chip.label)
                  ? 'bg-[#48B8D0] border-[#48B8D0] text-white'
                  : 'border-gray-200 bg-white text-[#6B7280] hover:border-[#B28B84]')
              }
            >
              <span className="mr-1">{chip.emoji}</span>
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

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !symptoms.trim()}
          className={
            'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition ' +
            (loading || !symptoms.trim()
              ? 'bg-[#CBD5E1] cursor-not-allowed'
              : 'bg-[#48B8D0] hover:opacity-95')
          }
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Claude AI가 분석 중이에요...
            </>
          ) : (
            'AI 진료비 견적서 생성하기'
          )}
        </button>
      </section>

      <section ref={resultRef} className="mt-6">
        {result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#B28B84]/40 bg-[#D4B8C0]/40 px-4 py-3 text-sm text-[#1F2937]">
              본 결과는 참고용 정보이며 의료적 진단이 아닙니다. 정확한 진단과 치료는 반드시 동물병원 수의사 상담이 필요합니다.
            </div>

            {result.conditions.map((condition, index) => (
              <article
                key={condition.name + '-' + index.toString()}
                className={
                  'rounded-2xl border p-5 ' +
                  (index === 0 ? 'border-[#48B8D0]/30 bg-[#D4B8C0]/40' : 'border-[#E2E8F0] bg-white')
                }
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[#1F2937]">{condition.name}</h3>
                  <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + probabilityClassName(condition.probability)}>
                    가능성 {condition.probability}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#6B7280]">{condition.description}</p>

                <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  {condition.items.map((item, itemIndex) => (
                    <div key={item.name + '-' + itemIndex.toString()} className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-[#1F2937]">{item.name}</span>
                      <span className="text-[#6B7280]">
                        {item.minPrice.toLocaleString()}원 ~ {item.maxPrice.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 border-t border-[#E2E8F0] pt-3 text-right text-base font-extrabold text-[#48B8D0] md:text-lg">
                    총 예상 {condition.totalMin.toLocaleString()}원 ~ {condition.totalMax.toLocaleString()}원
                  </div>
                </div>
              </article>
            ))}

            <article className="rounded-2xl bg-[#1F2937] p-5">
              <h3 className="mb-2 text-base font-bold text-white">수의사 상담 전 추천사항</h3>
              <p className="text-sm leading-relaxed text-slate-100">{result.recommendation}</p>
            </article>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center text-[#6B7280]">
            <div className="mb-3 text-4xl">📄</div>
            <p className="text-sm md:text-base">증상을 입력하면 AI가 예상 진료비 견적서를 작성해드려요</p>
          </div>
        )}
      </section>
    </main>
  );
}
