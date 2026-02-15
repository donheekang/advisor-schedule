"use client";

import { useAuth } from "@/components/auth-provider";
import { ShareCard } from "@/components/share-card";
import { apiClient, ApiError } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type RequestStatus = "idle" | "loading" | "success" | "error";
type ErrorType = "missing_api_key" | "network" | "usage_exceeded" | "invalid_format" | "file_too_large" | "unknown";

type PetInfo = {
  id: string;
  name: string;
  breed: string | null;
  birth_date: string | null;
};

type TalkStyle = "funny" | "touching" | "tsundere";

type PetsApiResponse = {
  pets?: PetInfo[];
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ERROR_MESSAGE_BY_TYPE: Record<ErrorType, string> = {
  missing_api_key: "서비스 준비 중이에요. 곧 만나요! 🐶",
  network: "인터넷 연결을 확인해주세요",
  usage_exceeded: "오늘 사용 횟수를 다 썼어요!",
  invalid_format: "jpg, png, webp 형식만 올릴 수 있어요",
  file_too_large: "5MB 이하 사진만 올릴 수 있어요",
  unknown: "대사를 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요."
};

const STYLE_OPTIONS: Array<{ value: TalkStyle; label: string; emoji: string; description: string }> = [
  { value: "funny", label: "웃긴 버전", emoji: "😂", description: "드라마틱한 과장과 유머" },
  { value: "touching", label: "감동 버전", emoji: "🥺", description: "울컥하는 진심 한마디" },
  { value: "tsundere", label: "츤데레 버전", emoji: "😤", description: "도도한 척, 속은 따뜻" }
];

const STYLE_BADGE_LABEL: Record<TalkStyle, string> = {
  funny: "😂 웃긴 버전",
  touching: "🥺 감동 버전",
  tsundere: "😤 츤데레 버전"
};

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("failed_to_read"));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("failed_to_read"));
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

export default function PetTalkerPage() {
  const { user, token, loading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [speech, setSpeech] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [typingDots, setTypingDots] = useState(1);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [style, setStyle] = useState<TalkStyle>("funny");
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const targetSpeechRef = useRef("");
  const styleSectionRef = useRef<HTMLElement | null>(null);

  const usageText = useMemo(() => `오늘 ${usageCount}/2회 사용`, [usageCount]);
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (animationFrameRef.current) {
        window.clearInterval(animationFrameRef.current);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (status !== "loading") {
      return;
    }

    const timer = window.setInterval(() => {
      setTypingDots((prev) => (prev % 3) + 1);
    }, 350);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "success") {
      setIsResultVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setIsResultVisible(true), 20);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!user || isAuthLoading) {
      setPets([]);
      setSelectedPetId("");
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
          setSelectedPetId("");
        }
      }
    }

    void fetchPets();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  const setError = (type: ErrorType) => {
    setStatus("error");
    setErrorType(type);
    setErrorMessage(ERROR_MESSAGE_BY_TYPE[type]);
  };

  const handleFileValidation = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("invalid_format");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("file_too_large");
      return false;
    }

    return true;
  };

  const startStreamingText = (nextText: string) => {
    targetSpeechRef.current = nextText;
    setSpeech("");

    if (animationFrameRef.current) {
      window.clearInterval(animationFrameRef.current);
    }

    let currentLength = 0;
    animationFrameRef.current = window.setInterval(() => {
      const target = targetSpeechRef.current;
      currentLength += 1;
      setSpeech(target.slice(0, currentLength));

      if (currentLength >= target.length && animationFrameRef.current) {
        window.clearInterval(animationFrameRef.current);
      }
    }, 28);
  };

  const requestSpeech = async (image: string) => {
    const response = await fetch("/api/pet-talker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        image,
        style,
        petInfo: selectedPet
          ? {
              name: selectedPet.name,
              breed: selectedPet.breed ?? undefined,
              age: getPetAge(selectedPet.birth_date) ?? undefined
            }
          : undefined
      })
    });

    return response;
  };

  const processFile = async (file: File) => {
    setErrorType(null);
    setErrorMessage("");

    if (!handleFileValidation(file)) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setStatus("loading");
    setSpeech("");

    try {
      const image = await toDataUrl(file);
      setUploadedImageData(image);
      const response = await requestSpeech(image);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

        if (response.status === 503) {
          setError("missing_api_key");
          return;
        }

        if (response.status === 429 || errorData?.error === "limit_exceeded") {
          setError("usage_exceeded");
          return;
        }

        if (response.status === 400) {
          setError("invalid_format");
          return;
        }

        throw new Error(errorData?.message ?? "request_failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("stream_unavailable");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let finalSpeech = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data:")) {
            continue;
          }

          const json = chunk.slice(5).trim();
          if (!json) {
            continue;
          }

          const payload = JSON.parse(json) as { type?: string; text?: string; error?: string };

          if (payload.type === "text_delta" && payload.text) {
            finalSpeech += payload.text;
          }

          if (payload.type === "error") {
            throw new Error(payload.error ?? "stream_failed");
          }
        }
      }

      const fallbackSpeech = "오늘 산책 2번 가면 세상 제일 행복할 것 같아요!";
      startStreamingText(finalSpeech || fallbackSpeech);
      setStatus("success");
      setUsageCount((prev) => Math.min(prev + 1, 2));
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 429) {
          setError("usage_exceeded");
          return;
        }
      }

      if (error instanceof TypeError) {
        setError("network");
        return;
      }

      setError("unknown");
    }
  };

  const handleRegenerateWithStyle = async () => {
    if (!uploadedImageData) {
      setErrorMessage("먼저 사진을 올려주세요.");
      return;
    }

    setStatus("loading");
    setSpeech("");
    setErrorType(null);
    setErrorMessage("");

    try {
      const response = await requestSpeech(uploadedImageData);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

        if (response.status === 429 || errorData?.error === "limit_exceeded") {
          setError("usage_exceeded");
          return;
        }

        if (response.status === 503) {
          setError("missing_api_key");
          return;
        }

        throw new Error(errorData?.message ?? "request_failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("stream_unavailable");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let finalSpeech = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data:")) {
            continue;
          }

          const json = chunk.slice(5).trim();
          if (!json) {
            continue;
          }

          const payload = JSON.parse(json) as { type?: string; text?: string; error?: string };
          if (payload.type === "text_delta" && payload.text) {
            finalSpeech += payload.text;
          }
        }
      }

      startStreamingText(finalSpeech || "오늘 산책 2번 가면 세상 제일 행복할 것 같아요!");
      setStatus("success");
    } catch (error) {
      if (error instanceof TypeError) {
        setError("network");
        return;
      }

      setError("unknown");
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await processFile(file);
    event.target.value = "";
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
    setStatus("idle");
    setSpeech("");
    setErrorMessage("");
    setErrorType(null);
    setIsResultVisible(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFB] px-4 py-8 text-[#1B3A4B] md:py-12">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6">
        <header className="space-y-3 text-center">
          <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1B3A4B] shadow-sm">
            {usageText}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight">우리 아이가 말을 한다면 🐾</h1>
          <p className="text-sm leading-relaxed text-[#1B3A4B]">
            사진 한 장으로 우리 아이 시점의 귀여운 한마디를 만들어 보세요. SNS에 바로 공유할 수 있는 정사각형 카드로 보여드려요.
          </p>
        </header>

        {user && pets.length > 0 ? (
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <label htmlFor="pet-selector" className="mb-2 block text-sm font-semibold text-[#1B3A4B]">
              어떤 아이의 사진인가요?
            </label>
            <select
              id="pet-selector"
              value={selectedPetId}
              onChange={(event) => setSelectedPetId(event.target.value)}
              className="w-full rounded-xl border border-[#1B3A4B]/20 bg-white px-3 py-2 text-sm text-[#1B3A4B] outline-none focus:border-[#2A9D8F]"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </option>
              ))}
            </select>
          </section>
        ) : null}

        <section ref={styleSectionRef} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-[#1B3A4B]">대사 스타일을 골라줘</p>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((option) => {
              const isSelected = style === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStyle(option.value)}
                  className={`rounded-2xl border px-2 py-3 text-center text-sm font-bold transition ${
                    isSelected ? "border-[#E67E22] bg-[#E67E22] text-white" : "border-[#D1D5DB] bg-white text-[#1B3A4B]"
                  }`}
                >
                  <span className="block">{option.emoji}</span>
                  <span className="mt-1 block">{option.label}</span>
                  <span className={`mt-2 block text-[11px] font-medium ${isSelected ? "text-white/90" : "text-[#6B7280]"}`}>
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
          {uploadedImageData ? (
            <button
              type="button"
              onClick={handleRegenerateWithStyle}
              className="w-full rounded-xl bg-[#1B3A4B] px-3 py-2 text-sm font-semibold text-white"
            >
              선택한 스타일로 다시 생성하기
            </button>
          ) : null}
        </section>

        {status !== "success" ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
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
            className={`cursor-pointer rounded-3xl border-2 border-dashed bg-white p-5 shadow-sm transition ${
              isDragging ? "border-[#2A9D8F]" : "border-[#1B3A4B]/20"
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
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#E8EEF1]">
                  <Image src={previewUrl} alt="업로드한 반려동물 사진 미리보기" fill className="object-cover" unoptimized />
                </div>
                <p className="text-center text-xs text-[#1B3A4B]">이미지를 다시 누르면 다른 사진으로 변경할 수 있어요.</p>
              </div>
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-[#E8EEF1]/60 text-center">
                <span className="text-4xl">📷</span>
                <p className="text-base font-bold">드래그하거나 눌러서 사진 올리기</p>
                <p className="text-xs text-[#1B3A4B]">최대 5MB · jpg/png/webp</p>
              </div>
            )}
          </div>
        ) : null}

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#E8EEF1] p-4">
                <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-sm">
                  {previewUrl ? <Image src={previewUrl} alt="분석 중인 반려동물 사진" fill className="object-cover" unoptimized /> : null}
                </div>
                <div className="relative mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#1B3A4B] shadow-sm">
                  <span className="absolute -top-2 left-5 h-4 w-4 rotate-45 bg-white" aria-hidden />
                  <div className="flex items-center gap-2">
                    <span>우리 아이가 생각하는 중... 🐾</span>
                    <span className="inline-flex items-center gap-1" aria-hidden>
                      {[1, 2, 3].map((dot) => (
                        <span
                          key={dot}
                          className={`h-2 w-2 rounded-full bg-[#2A9D8F] transition-opacity ${typingDots >= dot ? "opacity-100" : "opacity-25"}`}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-[#1B3A4B]/70">보통 5~10초 걸려요</p>
            </div>
          )}

          {status === "success" && previewUrl && (
            <div className={`space-y-5 transition-all duration-500 ${isResultVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
              <p className="inline-flex rounded-full bg-[#FFF4E8] px-3 py-1 text-xs font-semibold text-[#E67E22]">{STYLE_BADGE_LABEL[style]}</p>
              <div className="relative rounded-3xl bg-gradient-to-br from-[#2A9D8F] to-[#1B6F78] px-6 py-5 text-xl font-extrabold leading-relaxed text-white shadow-lg">
                <span className="absolute -bottom-2 left-10 h-5 w-5 rotate-45 bg-[#1B6F78]" aria-hidden />
                “{speech}”
              </div>

              <ShareCard
                petImageUrl={previewUrl}
                dialogue={speech}
                petName={selectedPet?.name ?? ""}
                kakaoJavaScriptKey={process.env.NEXT_PUBLIC_KAKAO_JS_KEY}
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl border border-[#1B3A4B]/25 bg-white px-4 py-4 text-base font-extrabold text-[#1B3A4B] shadow-sm"
                >
                  다시 해보기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareTitle = `${selectedPet?.name ?? "우리 아이"}의 펫토커 결과`;
                    const shareText = `“${speech}”`;

                    if (navigator.share) {
                      void navigator.share({ title: shareTitle, text: shareText, url: window.location.href });
                      return;
                    }

                    void navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${window.location.href}`);
                    setErrorMessage("공유 링크를 복사했어요. 원하는 앱에 붙여넣어 공유해 보세요!");
                  }}
                  className="rounded-2xl bg-[#2A9D8F] px-4 py-4 text-base font-extrabold text-white shadow-md shadow-[#2A9D8F]/35"
                >
                  공유하기
                </button>
              </div>
              <button
                type="button"
                onClick={() => styleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="w-full rounded-2xl border border-[#E67E22]/40 bg-[#FFF4E8] px-4 py-3 text-sm font-bold text-[#C96C1E]"
              >
                다른 스타일로 다시 해보기
              </button>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <div className="rounded-2xl border border-[#1B3A4B]/10 bg-[#F8FAFB] p-4 text-center text-sm text-[#1B3A4B]">
              {status === "error" ? (
                <div className="space-y-3">
                  <p>{errorMessage}</p>
                  {errorType === "usage_exceeded" ? (
                    <Link
                      href="https://apps.apple.com/"
                      className="inline-flex rounded-lg bg-[#2A9D8F] px-4 py-2 text-xs font-bold text-white"
                    >
                      앱 다운로드
                    </Link>
                  ) : null}
                </div>
              ) : (
                "사진을 업로드하면 여기에 우리 아이의 1인칭 대사가 나타나요!"
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-amber-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#1B3A4B]">앱에서 기록하면 우리 아이를 더 잘 아는 AI가 돼요</p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-brand-secondary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-ctaHover"
          >
            앱 다운로드
          </button>
        </section>

        {errorMessage && status !== "error" ? <p className="text-center text-xs font-medium text-rose-500">{errorMessage}</p> : null}
      </section>
    </main>
  );
}
