'use client';

import { useAuth } from '@/components/auth-provider';
import { LoginModal } from '@/components/login-modal';
import { ShareCard } from '@/components/share-card';
import { apiClient, ApiError } from '@/lib/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
type ErrorType = 'missing_api_key' | 'network' | 'usage_exceeded' | 'invalid_format' | 'file_too_large' | 'unknown';
type EmotionCode = 'happy' | 'peaceful' | 'curious' | 'grumpy' | 'proud' | 'love' | 'sleepy' | 'hungry';

type EmotionMeta = {
  label: string;
  chipClassName: string;
  imageClassName: string;
};

type PetInfo = {
  id: string;
  name: string;
  breed: string | null;
  birth_date: string | null;
};

type PetsApiResponse = {
  pets?: PetInfo[];
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EMOTION_META: Record<EmotionCode, EmotionMeta> = {
  happy: { label: '신남', chipClassName: 'bg-rose-50 text-rose-700 ring-rose-100', imageClassName: 'saturate-110' },
  peaceful: { label: '평화', chipClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100', imageClassName: 'brightness-105' },
  curious: { label: '호기심', chipClassName: 'bg-sky-50 text-sky-700 ring-sky-100', imageClassName: 'contrast-110' },
  grumpy: { label: '투정', chipClassName: 'bg-rose-50 text-rose-700 ring-rose-100', imageClassName: 'contrast-105' },
  proud: { label: '도도', chipClassName: 'bg-violet-50 text-violet-700 ring-violet-100', imageClassName: 'saturate-125' },
  love: { label: '사랑', chipClassName: 'bg-pink-50 text-pink-700 ring-pink-100', imageClassName: 'saturate-110' },
  sleepy: { label: '나른', chipClassName: 'bg-indigo-50 text-indigo-700 ring-indigo-100', imageClassName: 'brightness-95' },
  hungry: { label: '배고픔', chipClassName: 'bg-amber-50 text-amber-700 ring-amber-100', imageClassName: 'contrast-105' }
};

const ERROR_MESSAGE_BY_TYPE: Record<ErrorType, string> = {
  missing_api_key: '서비스 준비 중입니다. 잠시 후 다시 시도해 주세요.',
  network: '인터넷 연결을 확인해 주세요.',
  usage_exceeded: '오늘 사용 횟수를 모두 사용했어요.',
  invalid_format: 'jpg, png, webp 형식만 업로드할 수 있어요.',
  file_too_large: '파일 크기는 5MB 이하만 가능해요.',
  unknown: '대사를 만드는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'
};

const QUICK_MESSAGES = [
  '오늘 컨디션 어때?',
  '산책 가고 싶어?',
  '배고프지 않아?',
  '어디가 불편한지 알려줘',
  '오늘도 잘해줘서 고마워',
  '지금 기분이 궁금해'
];

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('failed_to_read'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('failed_to_read'));
    reader.readAsDataURL(file);
  });
}

function getPetAge(birthDate: string | null): number | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }

  return years >= 0 ? years : null;
}

export default function PetTalkerClient() {
  const { user, token, loading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [speech, setSpeech] = useState('');
  const [emotion, setEmotion] = useState<EmotionCode>('happy');
  const [emotionScore, setEmotionScore] = useState(80);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [typingDots, setTypingDots] = useState(1);
  const [userMessage, setUserMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [callingName, setCallingName] = useState('보호자');
  const [showCallingPrompt, setShowCallingPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (status !== 'loading') {
      return;
    }

    const timer = window.setInterval(() => {
      setTypingDots((prev) => (prev % 3) + 1);
    }, 320);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedCallingName = window.localStorage.getItem('petTalkerCallingName')?.trim();
    if (savedCallingName) {
      setCallingName(savedCallingName);
      setShowCallingPrompt(false);
      return;
    }

    setShowCallingPrompt(true);
  }, []);

  useEffect(() => {
    if (!user || isAuthLoading) {
      setPets([]);
      setSelectedPetId('');
      return;
    }

    let isMounted = true;

    async function fetchPets() {
      try {
        const response = (await apiClient.listPets()) as PetsApiResponse | PetInfo[];

        if (!isMounted) {
          return;
        }

        const nextPets = Array.isArray(response) ? response : (response.pets ?? []);
        setPets(nextPets);
        if (nextPets.length > 0) {
          setSelectedPetId((prev) => prev || nextPets[0].id);
        }
      } catch {
        if (isMounted) {
          setPets([]);
          setSelectedPetId('');
        }
      }
    }

    void fetchPets();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  const setError = (type: ErrorType) => {
    setStatus('error');
    setErrorType(type);
    setErrorMessage(ERROR_MESSAGE_BY_TYPE[type]);
  };

  const handleFileValidation = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('invalid_format');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('file_too_large');
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    setErrorType(null);
    setErrorMessage('');

    if (!handleFileValidation(file)) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setShowMessageInput(true);
    setStatus('idle');
    setSpeech('');
    setUserMessage('');
  };

  const generateSpeech = async () => {
    if (!previewUrl) {
      return;
    }

    setStatus('loading');
    setShowMessageInput(false);

    try {
      const blob = await fetch(previewUrl).then((response) => response.blob());
      const file = new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' });
      const image = await toDataUrl(file);
      const response = await fetch('/api/pet-talker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          image,
          petInfo: selectedPet
            ? {
                name: selectedPet.name,
                breed: selectedPet.breed ?? undefined,
                age: getPetAge(selectedPet.birth_date) ?? undefined
              }
            : undefined,
          userMessage: userMessage.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

        if (response.status === 503) {
          setError('missing_api_key');
          return;
        }

        if (response.status === 429 || errorData?.error === 'limit_exceeded') {
          setError('usage_exceeded');
          return;
        }

        if (response.status === 400) {
          setError('invalid_format');
          return;
        }

        throw new Error(errorData?.message ?? 'request_failed');
      }

      const data = (await response.json()) as { speech?: string; emotion?: EmotionCode; emotionScore?: number };
      const validEmotionCodes: EmotionCode[] = ['happy', 'peaceful', 'curious', 'grumpy', 'proud', 'love', 'sleepy', 'hungry'];

      let finalSpeech = data.speech ?? '';
      if (finalSpeech.includes('"speech"') || finalSpeech.includes('```')) {
        try {
          const cleaned = finalSpeech.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as { speech?: string };
            if (parsed.speech) {
              finalSpeech = parsed.speech;
            }
          }
        } catch {
          // Keep original string when parsing fails.
        }
      }

      finalSpeech = finalSpeech.replace(/^["']|["']$/g, '').trim();
      if (!finalSpeech) {
        finalSpeech = `${callingName}, 지금 내 기분을 잘 알아줘서 고마워.`;
      }

      setSpeech(finalSpeech.replace(/엄마|아빠|보호자/g, callingName));
      setEmotion(validEmotionCodes.includes(data.emotion as EmotionCode) ? (data.emotion as EmotionCode) : 'happy');
      setEmotionScore(
        typeof data.emotionScore === 'number' && Number.isInteger(data.emotionScore)
          ? Math.min(99, Math.max(50, data.emotionScore))
          : 85
      );
      setStatus('success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setError('usage_exceeded');
        return;
      }

      if (error instanceof TypeError) {
        setError('network');
        return;
      }

      setError('unknown');
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await processFile(file);
    event.target.value = '';
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await processFile(file);
  };

  const handleReset = () => {
    setStatus('idle');
    setSpeech('');
    setErrorMessage('');
    setErrorType(null);
    setShowMessageInput(false);
    setUserMessage('');
  };

  const handleCallingSelect = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    setCallingName(trimmedValue);
    setShowCallingPrompt(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('petTalkerCallingName', trimmedValue);
    }
  };

  const emotionMeta = EMOTION_META[emotion];

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff6f6_100%)] px-6 py-9 text-center shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-10">
          <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ff7a45]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-[#f3caa8]/10 blur-3xl" />
          <p className="inline-flex rounded-full bg-[#fff0e5] px-4 py-1.5 text-xs font-semibold text-[#ff7a45]">무료</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#17191f] md:text-4xl">펫토커</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4f5868] md:text-base">
            사진 한 장과 짧은 메시지로 우리 아이의 반응을 생성합니다. 결과는 공유 카드로 저장할 수 있어요.
          </p>
        </header>

        {!isAuthLoading && !user ? (
          <div className="space-y-5 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a45] to-[#ff9a6c] shadow-[0_4px_20px_rgba(255,122,69,0.3)]">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#17191f]">로그인하고 무료로 이용하세요</h2>
            <p className="text-sm text-[#697182]">회원가입 후 펫토커를 무제한 무료로 사용할 수 있어요.</p>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="mx-auto rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-10 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,122,69,0.24)] transition hover:brightness-95"
            >
              로그인 / 회원가입
            </button>
          </div>
        ) : null}

        {user && pets.length > 0 ? (
          <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <label htmlFor="pet-selector" className="mb-2 block text-sm font-semibold text-[#17191f]">
              어떤 아이의 사진인가요?
            </label>
            <select
              id="pet-selector"
              value={selectedPetId}
              onChange={(event) => setSelectedPetId(event.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[#fffaf5] px-3 py-2.5 text-sm text-[#17191f] outline-none focus:border-[#ff7a45]"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.breed ? ` · ${pet.breed}` : ''}
                </option>
              ))}
            </select>
          </section>
        ) : null}

        {!user ? null : showCallingPrompt ? (
          <div className="space-y-4 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-[#17191f]">우리 아이가 나를 뭐라고 부를까요?</h2>
            <p className="text-sm text-[#697182]">선택한 호칭은 이후 자동으로 기억됩니다.</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => handleCallingSelect('엄마')}
                className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.25)] transition hover:brightness-95"
              >
                엄마
              </button>
              <button
                type="button"
                onClick={() => handleCallingSelect('아빠')}
                className="rounded-full border border-black/10 bg-white px-8 py-3 text-sm font-semibold text-[#17191f] transition hover:bg-black/5"
              >
                아빠
              </button>
            </div>
            <input
              type="text"
              placeholder="직접 입력 (예: 언니, 오빠)"
              maxLength={10}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                  const value = (event.target as HTMLInputElement).value.trim();
                  if (value) {
                    handleCallingSelect(value);
                  }
                }
              }}
              className="w-full rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 text-center text-sm text-[#17191f] placeholder-[#8a92a3] outline-none focus:border-[#ff7a45]"
            />
          </div>
        ) : (
          <>
            {status !== 'success' && !showMessageInput ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-3xl border bg-white p-6 shadow-sm transition ${
                  isDragging ? 'border-[#ff7a45]' : 'border-black/10'
                }`}
                aria-label="사진 업로드"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f3f5f9]">
                      <Image src={previewUrl} alt="업로드한 반려동물 사진 미리보기" fill className="object-cover" unoptimized />
                    </div>
                    <p className="text-center text-xs text-[#697182]">이미지를 누르면 다른 사진으로 변경할 수 있습니다.</p>
                  </div>
                ) : (
                  <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl bg-[#fffaf5] text-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-black/10">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#4f5868]" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5Z" />
                        <path d="M8.5 15.5 11 13l2 2 2.5-3 2 3.5" />
                        <circle cx="9" cy="9" r="1.2" />
                      </svg>
                    </span>
                    <p className="text-base font-semibold text-[#17191f]">사진 업로드</p>
                    <p className="text-xs text-[#8a92a3]">최대 5MB · jpg/png/webp</p>
                  </div>
                )}
              </div>
            ) : null}

            {showMessageInput && status === 'idle' && previewUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                  <Image src={previewUrl} alt="업로드한 사진" fill className="object-cover" unoptimized />
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-base font-semibold text-[#17191f]">우리 아이에게 한마디</p>
                  <p className="mt-1 text-xs text-[#697182]">입력하면 더 구체적인 반응이 생성됩니다.</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUICK_MESSAGES.map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setUserMessage(quick)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          userMessage === quick
                            ? 'bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] text-white'
                            : 'bg-[#f3f5f9] text-[#4f5868] hover:bg-[#e9eef6]'
                        }`}
                      >
                        {quick}
                      </button>
                    ))}
                  </div>

                  <div className="relative mt-3">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(event) => setUserMessage(event.target.value.slice(0, 50))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          void generateSpeech();
                        }
                      }}
                      placeholder="직접 입력 (최대 50자)"
                      maxLength={50}
                      className="w-full rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 pr-12 text-sm text-[#17191f] placeholder-[#8a92a3] outline-none focus:border-[#ff7a45] focus:ring-2 focus:ring-[#ff7a45]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a92a3]">{userMessage.length}/50</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void generateSpeech()}
                  className="w-full rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,122,69,0.24)] transition hover:brightness-95"
                >
                  우리 아이 반응 보기
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserMessage('');
                    void generateSpeech();
                  }}
                  className="w-full text-center text-sm font-medium text-[#697182]"
                >
                  메시지 없이 진행
                </button>
              </div>
            ) : null}
          </>
        )}

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          {status === 'loading' ? (
            <div className="space-y-4 rounded-3xl bg-[#fffaf5] p-4">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-3xl bg-[#f1f1f3]">
                {previewUrl ? <Image src={previewUrl} alt="분석 중인 반려동물 사진" fill className="object-cover opacity-75" unoptimized /> : null}
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-medium text-[#17191f]">우리 아이 반응을 생성하고 있어요</p>
                <div className="mt-2 inline-flex items-center gap-1">
                  {[1, 2, 3].map((dot) => (
                    <span key={dot} className={`h-2 w-2 rounded-full bg-[#ff9b5e] ${typingDots >= dot ? 'opacity-100' : 'opacity-30'}`} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {status === 'success' && previewUrl ? (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5">
                <div className="relative aspect-square w-full">
                  <Image src={previewUrl} alt="반려동물 결과 사진" fill unoptimized className={`object-cover ${emotionMeta.imageClassName}`} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                </div>
              </div>

              {userMessage ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-2.5 text-sm font-medium text-white shadow-sm">
                    {userMessage}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${emotionMeta.chipClassName}`}>
                  <span>{emotionMeta.label}</span>
                  <span>{emotionScore}점</span>
                </span>
              </div>

              <div className="relative rounded-3xl bg-[#fffaf5] p-6 text-base font-medium leading-relaxed text-[#17191f] ring-1 ring-black/5">
                <span className="absolute -top-2 left-9 h-5 w-5 rotate-45 bg-[#fffaf5] ring-1 ring-black/5" aria-hidden />
                <p>{speech}</p>
                <p className="mt-4 text-sm text-[#697182]">— {selectedPet?.name ?? '우리 아이'}</p>
              </div>

              <ShareCard
                petImageUrl={previewUrl}
                dialogue={speech}
                petName={selectedPet?.name ?? ''}
                emotion={emotion}
                emotionScore={emotionScore}
                kakaoJavaScriptKey={process.env.NEXT_PUBLIC_KAKAO_JS_KEY}
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#17191f] transition hover:bg-black/5"
                >
                  다시 해보기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareTitle = `${selectedPet?.name ?? '우리 아이'}의 펫토커 결과`;
                    const shareText = speech;

                    if (navigator.share) {
                      void navigator.share({ title: shareTitle, text: shareText, url: window.location.href });
                      return;
                    }

                    void navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${window.location.href}`);
                    setErrorMessage('공유 링크를 복사했어요. 원하는 앱에 붙여넣어 공유해 보세요.');
                  }}
                  className="rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.24)] transition hover:brightness-95"
                >
                  공유하기
                </button>
              </div>
            </div>
          ) : null}

          {status === 'idle' || status === 'error' ? (
            <div className="rounded-2xl border border-black/10 bg-[#fffaf5] p-4 text-center text-sm text-[#4f5868]">
              {status === 'error' ? (
                <div className="space-y-3">
                  <p>{errorMessage}</p>
                  {errorType === 'usage_exceeded' ? (
                    <Link
                      href="https://apps.apple.com/"
                      className="inline-flex rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-4 py-2 text-xs font-semibold text-white"
                    >
                      앱 다운로드
                    </Link>
                  ) : null}
                </div>
              ) : (
                '사진을 업로드하면 여기에 우리 아이의 대사가 표시됩니다.'
              )}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl bg-[linear-gradient(135deg,#2a1c16_0%,#3a261d_55%,#4b3125_120%)] p-6 text-center text-white">
          <p className="text-sm font-medium text-white/85">앱 기록과 연결하면 더 정확한 개인화 경험을 제공할 수 있어요.</p>
          <button
            type="button"
            className="mt-3 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#17191f] transition hover:bg-[#f2f2f2]"
          >
            앱 다운로드
          </button>
        </section>

        {errorMessage && status !== 'error' ? (
          <p className="text-center text-xs font-medium text-[#697182]">{errorMessage}</p>
        ) : null}
      </section>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </main>
  );
}




