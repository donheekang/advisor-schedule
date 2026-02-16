'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { createCoupangSearchUrl } from '@/lib/care-product-map';
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
  source?: 'ai' | 'local';
  remaining?: number;
};

type ScenarioItem = {
  id: string;
  label: string;
  icon: string;
  tags: string[];
};

const CONDITION_OPTIONS = [
  { value: 'skin', label: '피부/알러지', icon: '😣' },
  { value: 'dental', label: '구강/치아', icon: '🦷' },
  { value: 'patella', label: '슬개골', icon: '🐾' },
  { value: 'joint', label: '관절', icon: '🦴' },
  { value: 'gi', label: '소화기', icon: '🤢' },
  { value: 'eye', label: '눈', icon: '👁' },
  { value: 'ear', label: '귀', icon: '👂' },
  { value: 'vaccine', label: '예방접종', icon: '💉' },
  { value: 'neutering', label: '중성화', icon: '🏥' },
  { value: 'heart', label: '심장', icon: '❤️' },
  { value: 'kidney', label: '신장', icon: '🧪' },
  { value: 'obesity', label: '비만/체중관리', icon: '⚖️' }
] as const;

const SCENARIOS: ScenarioItem[] = [
  { id: 'scaling', label: '스케일링 받았어요', icon: '🦷', tags: ['dental'] },
  { id: 'patella', label: '슬개골 진단 받았어요', icon: '🐾', tags: ['patella'] },
  { id: 'skin', label: '피부가 가려워해요', icon: '😣', tags: ['skin'] },
  { id: 'checkup', label: '건강검진 했어요', icon: '💉', tags: ['vaccine'] },
  { id: 'digestion', label: '소화가 안 좋아요', icon: '🤢', tags: ['gi'] },
  { id: 'eye', label: '눈물이 많아요', icon: '👁', tags: ['eye'] }
];

const BREED_OPTIONS = [...Object.keys(BREED_RISK_TAGS).sort((a, b) => a.localeCompare(b, 'ko')), '기타 (직접 입력)'];

const statusClassMap = {
  '주의 필요': 'text-[#E85D2A] bg-[#FFF0E6]',
  '관리 필요': 'text-[#F59E0B] bg-[#FFFBEB]',
  양호: 'text-[#16A34A] bg-[#F0FFF4]'
} as const;

export default function AiCareClient() {
  const [form, setForm] = useState<FormState>({
    species: '강아지',
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    conditions: []
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [scenarioIds, setScenarioIds] = useState<string[]>([]);
  const [breedSelect, setBreedSelect] = useState('');

  const resultRef = useRef<HTMLElement | null>(null);
  const breedInputRef = useRef<HTMLDivElement | null>(null);

  const allergyList = useMemo(
    () => form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
    [form.allergies]
  );

  const report = useMemo(
    () =>
      generateLocalCareReport(
        form.species,
        form.breed,
        Number(form.age) || 0,
        form.conditions,
        allergyList
      ),
    [allergyList, form.age, form.breed, form.conditions, form.species]
  );

  const hasResult = Boolean(form.breed.trim()) && Boolean(form.age);

  const toggleCondition = (value: string) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(value)
        ? prev.conditions.filter((item) => item !== value)
        : [...prev.conditions, value]
    }));
  };

  const handleScenarioClick = (scenario: ScenarioItem) => {
    const active = scenarioIds.includes(scenario.id);

    setScenarioIds((prev) =>
      active ? prev.filter((item) => item !== scenario.id) : [...prev, scenario.id]
    );

    setForm((prev) => {
      const nextConditions = new Set(prev.conditions);
      scenario.tags.forEach((tag) => {
        if (active) {
          nextConditions.delete(tag);
        } else {
          nextConditions.add(tag);
        }
      });

      return { ...prev, conditions: [...nextConditions] };
    });

    requestAnimationFrame(() => {
      breedInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
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
          conditions: form.conditions
        })
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

  const handleKakaoShare = async () => {
    const shareText = buildShareText(report, form.breed, getConditionLabels(form.conditions));
    const kakao = (window as Window & { Kakao?: { Link?: { sendDefault: (payload: unknown) => void } } }).Kakao;

    if (kakao?.Link) {
      kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: `${form.breed || '우리 아이'} 맞춤 케어 리포트`,
          description: shareText,
          imageUrl: 'https://advisor-schedule-fawn.vercel.app/og.png',
          link: {
            mobileWebUrl: 'https://advisor-schedule-fawn.vercel.app/ai-care',
            webUrl: 'https://advisor-schedule-fawn.vercel.app/ai-care'
          }
        }
      });
      return;
    }

    await navigator.clipboard.writeText('https://advisor-schedule-fawn.vercel.app/ai-care');
  };

  return (
    <main className="min-h-screen bg-[#FFF8F0] p-5 md:p-8">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <p className="inline-flex rounded-full bg-[#FFF8F0] px-3 py-1 text-sm font-semibold text-[#C2410C]">✨ 10초 시작 AI 케어</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#4F2A1D] md:text-4xl">우리 아이 정보 3개만 입력하고 바로 확인해요</h1>
          <p className="mt-3 text-[#7C2D12]/80">먼저 빠르게 시작하고, 추가 정보로 분석 정확도를 높일 수 있어요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <div>
            <p className="text-sm font-semibold text-[#9A3412]">우리 아이가 최근에...</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {SCENARIOS.map((scenario) => {
                const selected = scenarioIds.includes(scenario.id);
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleScenarioClick(scenario)}
                    className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? 'border-[#F97316] bg-[#FFF3E6] text-[#9A3412]'
                        : 'border-[#F8C79F] bg-white text-[#4F2A1D]'
                    }`}
                  >
                    <span className="mr-2">{scenario.icon}</span>
                    {scenario.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-[#FFFAF5] p-4" ref={breedInputRef}>
            <h2 className="text-xl font-bold text-[#4F2A1D]">🐕 우리 아이 정보</h2>
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1.4fr_1fr_1fr] lg:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#4F2A1D]">종류</p>
                <div className="flex rounded-2xl border border-[#F8C79F] bg-white p-1">
                  {(['강아지', '고양이'] as const).map((species) => (
                    <button
                      key={species}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, species }))}
                      className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                        form.species === species ? 'bg-[#F97316] text-white' : 'text-[#7C2D12]'
                      }`}
                    >
                      {species}
                    </button>
                  ))}
                </div>
              </div>

              <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
                품종
                <select
                  value={breedSelect}
                  onChange={(event) => {
                    const value = event.target.value;
                    setBreedSelect(value);
                    if (value !== '기타 (직접 입력)') {
                      setForm((prev) => ({ ...prev, breed: value }));
                    } else {
                      setForm((prev) => ({ ...prev, breed: '' }));
                    }
                  }}
                  className="w-full rounded-2xl border border-[#F8C79F] bg-white px-4 py-3"
                >
                  <option value="">품종 선택</option>
                  {BREED_OPTIONS.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </label>

              {breedSelect === '기타 (직접 입력)' && (
                <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
                  직접 입력
                  <input
                    value={form.breed}
                    onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
                    placeholder="예: 믹스"
                    className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3"
                  />
                </label>
              )}

              <label className="space-y-2 text-sm font-semibold text-[#4F2A1D]">
                나이
                <input
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                  placeholder="3"
                  className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3"
                />
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="h-[50px] rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-5 font-bold text-white disabled:opacity-70"
              >
                {isLoading ? '분석 중...' : '바로 분석하기 →'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F8C79F] bg-white">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-[#7C2D12]"
            >
              <span>{isExpanded ? '▼' : '▶'} 더 정확한 분석을 원하시면 (선택)</span>
            </button>

            {isExpanded && (
              <div className="space-y-4 border-t border-[#F8C79F]/60 px-4 py-4">
                <label className="block space-y-2 text-sm font-semibold text-[#4F2A1D]">
                  체중
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.weight}
                    onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
                    placeholder="5.2"
                    className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3"
                  />
                </label>

                <label className="block space-y-2 text-sm font-semibold text-[#4F2A1D]">
                  알러지
                  <input
                    value={form.allergies}
                    onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))}
                    placeholder="연어, 닭고기"
                    className="w-full rounded-2xl border border-[#F8C79F] px-4 py-3"
                  />
                </label>

                <fieldset>
                  <legend className="text-sm font-semibold text-[#4F2A1D]">최근 진료</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CONDITION_OPTIONS.map((item) => (
                      <label key={item.value} className="flex items-center gap-2 rounded-xl bg-[#FFF8F0] px-3 py-3 text-sm text-[#4F2A1D]">
                        <input
                          type="checkbox"
                          checked={form.conditions.includes(item.value)}
                          onChange={() => toggleCondition(item.value)}
                          className="h-4 w-4 accent-[#F97316]"
                        />
                        <span>{item.icon}</span>
                        {item.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
          {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}
        </form>

        <section ref={resultRef} className="space-y-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-[#F8C79F]/20 md:p-8">
          <h2 className="border-y border-[#F8C79F]/60 py-3 text-2xl font-extrabold text-[#4F2A1D]">{report.title}</h2>

          {!hasResult && (
            <p className="rounded-2xl bg-[#FFF8F0] p-4 text-sm text-[#7C2D12]">품종과 나이를 입력하고 분석하면 개인화 리포트가 표시돼요.</p>
          )}

          {hasResult && (
            <>
              <div>
                <p className="text-lg font-bold text-[#4F2A1D]">📊 우리 아이 건강 포인트</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {report.healthPoints.map((point) => (
                    <article key={point.key} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#F8C79F]/30">
                      <p className="text-2xl">{point.icon}</p>
                      <p className="mt-2 text-lg font-bold text-[#4F2A1D]">{point.label}</p>
                      <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClassMap[point.status]}`}>{point.status}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-lg font-bold text-[#4F2A1D]">💡 지금 가장 중요한 케어 {Math.min(3, report.recommendations.length)}가지</p>
                <div className="mt-3 space-y-3">
                  {report.recommendations.slice(0, 5).map((recommendation, index) => (
                    <article key={recommendation.tag} className="rounded-2xl bg-[#FFFAF5] p-5">
                      <p className="text-lg font-bold text-[#4F2A1D]">
                        {index + 1}. {recommendation.icon} {recommendation.title}
                      </p>
                      <p className="mt-2 text-sm text-[#7C2D12]">{recommendation.message}</p>
                      <p className="mt-1 text-sm font-semibold text-[#9A3412]">→ {recommendation.action}</p>
                      <a
                        href={createCoupangSearchUrl(recommendation.productKeyword)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#EA580C] ring-1 ring-[#F8C79F]"
                      >
                        🛒 관련 상품 보러가기
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF8F0] p-4">
                <p className="text-sm font-semibold text-[#7C2D12]">요약</p>
                <p className="mt-2 text-sm text-[#4F2A1D]">{report.summary}</p>
                {aiInsight && (
                  <>
                    <p className="mt-4 text-sm font-semibold text-[#7C2D12]">AI 추가 인사이트</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-[#4F2A1D]">{aiInsight}</p>
                  </>
                )}
                {remaining !== null && <p className="mt-3 text-xs text-[#9A3412]">오늘 남은 AI 인사이트: {remaining}회</p>}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleCopy} className="rounded-2xl border border-[#F8C79F] bg-white px-4 py-3 text-sm font-semibold text-[#4F2A1D]">
                  📋 결과 복사하기
                </button>
                <button type="button" onClick={handleKakaoShare} className="rounded-2xl border border-[#F8C79F] bg-white px-4 py-3 text-sm font-semibold text-[#4F2A1D]">
                  📱 카카오톡 공유
                </button>
              </div>

              <div className="rounded-2xl bg-[#3D2518] p-6 text-white">
                <p className="text-lg font-bold">📱 이 케어 루틴을 앱에서 자동 관리하세요</p>
                <p className="mt-2 text-sm text-[#FFE9D2]">영수증 찍으면 → 자동 분류 → 맞춤 케어 알림</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="https://apps.apple.com" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#3D2518]">App Store 다운로드</a>
                  <a href="https://play.google.com/store" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#3D2518]">Google Play 다운로드</a>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
