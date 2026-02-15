"use client";

import { useAuth } from "@/components/auth-provider";
import { ShareCard } from "@/components/share-card";
import { apiClient, ApiError } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type RequestStatus = "idle" | "loading" | "success" | "error";
type ErrorType = "missing_api_key" | "network" | "usage_exceeded" | "invalid_format" | "file_too_large" | "unknown";
type EmotionCode = "happy" | "peaceful" | "curious" | "grumpy" | "proud" | "love" | "sleepy" | "hungry";

type EmotionMeta = {
  emoji: string;
  label: string;
  background: string;
  border: string;
  animationClassName: string;
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
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EMOTION_META: Record<EmotionCode, EmotionMeta> = {
  happy: { emoji: "😆", label: "신남", background: "#FEF3C7", border: "#F59E0B", animationClassName: "emotion-animate-bounce" },
  peaceful: { emoji: "😌", label: "평화", background: "#D1FAE5", border: "#10B981", animationClassName: "emotion-animate-breathe" },
  curious: { emoji: "🤔", label: "호기심", background: "#DBEAFE", border: "#3B82F6", animationClassName: "emotion-animate-tilt" },
  grumpy: { emoji: "😤", label: "투정", background: "#FEE2E2", border: "#EF4444", animationClassName: "emotion-animate-shake" },
  proud: { emoji: "😏", label: "도도", background: "#F3E8FF", border: "#8B5CF6", animationClassName: "emotion-animate-shake" },
  love: { emoji: "🥰", label: "사랑", background: "#FCE7F3", border: "#EC4899", animationClassName: "emotion-animate-heartbeat" },
  sleepy: { emoji: "😴", label: "나른", background: "#E0E7FF", border: "#6366F1", animationClassName: "emotion-animate-breathe" },
  hungry: { emoji: "🤤", label: "배고픔", background: "#FFEDD5", border: "#F97316", animationClassName: "emotion-animate-bounce" }
};

const ERROR_MESSAGE_BY_TYPE: Record<ErrorType, string> = {
  missing_api_key: "서비스 준비 중이에요. 곧 만나요! 🐶",
  network: "인터넷 연결을 확인해주세요",
  usage_exceeded: "오늘 사용 횟수를 다 썼어요!",
  invalid_format: "jpg, png, webp 형식만 올릴 수 있어요",
  file_too_large: "5MB 이하 사진만 올릴 수 있어요",
  unknown: "대사를 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요."
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
  const [emotion, setEmotion] = useState<EmotionCode>("happy");
  const [emotionScore, setEmotionScore] = useState(80);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [typingDots, setTypingDots] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [callingName, setCallingName] = useState("엄마");
  const [showCallingPrompt, setShowCallingPrompt] = useState(false);

  const usageText = useMemo(() => `오늘 ${usageCount}/2회 사용`, [usageCount]);
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (status !== "loading") {
      return;
    }

    const timer = window.setInterval(() => {
      setTypingDots((prev) => (prev % 3) + 1);
    }, 320);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedCallingName = window.localStorage.getItem("petTalkerCallingName")?.trim();
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

  const handleSpeechPlayback = () => {
    if (typeof window === "undefined" || !speech) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speech);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
    setShowMessageInput(true);
    setStatus("idle");
    setSpeech("");
    setUserMessage("");
    setIsSpeaking(false);
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  const generateSpeech = async () => {
    if (!previewUrl) return;
    setStatus("loading");
    setShowMessageInput(false);
    setIsSpeaking(false);
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }

    try {
      const blob = await fetch(previewUrl).then((response) => response.blob());
      const file = new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" });
      const image = await toDataUrl(file);
      const response = await fetch("/api/pet-talker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      const data = (await response.json()) as { speech?: string; emotion?: EmotionCode; emotionScore?: number };
      const validEmotionCodes: EmotionCode[] = ["happy", "peaceful", "curious", "grumpy", "proud", "love", "sleepy", "hungry"];

      let finalSpeech = data.speech ?? "";
      if (finalSpeech.includes('"speech"') || finalSpeech.includes('```')) {
        try {
          const cl = finalSpeech.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
          const jm = cl.match(/\{[\s\S]*\}/);
          if (jm) {
            const p = JSON.parse(jm[0]) as { speech?: string };
            if (p.speech) finalSpeech = p.speech;
          }
        } catch {
          // fallback
        }
      }
      finalSpeech = finalSpeech.replace(/^["']|["']$/g, "").trim();
      if (!finalSpeech) finalSpeech = `${callingName}, 나 지금 세상에서 제일 행복해 🐾`;

      setSpeech(finalSpeech.replace(/엄마/g, callingName));
      setEmotion(validEmotionCodes.includes(data.emotion as EmotionCode) ? (data.emotion as EmotionCode) : "happy");
      setEmotionScore(
        typeof data.emotionScore === "number" && Number.isInteger(data.emotionScore)
          ? Math.min(99, Math.max(50, data.emotionScore))
          : 85
      );
      setStatus("success");
      setUsageCount((prev) => Math.min(prev + 1, 2));
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setError("usage_exceeded");
        return;
      }

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
    setIsSpeaking(false);
    setShowMessageInput(false);
    setUserMessage("");
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  const handleCallingSelect = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    setCallingName(trimmedValue);
    setShowCallingPrompt(false);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("petTalkerCallingName", trimmedValue);
    }
  };

  const emotionMeta = EMOTION_META[emotion];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] px-4 py-8 text-[#2D2D2D] md:py-12">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6">
        <header className="space-y-3 text-center">
          <p className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#7C4A2D] shadow-sm">{usageText}</p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#4F2A1D]">우리 아이가 말을 한다면 🐾</h1>
          <p className="text-sm leading-relaxed text-[#7C4A2D]">사진 한 장으로 우리 아이의 마음을 따뜻한 한마디로 들어보세요.</p>
        </header>

        {user && pets.length > 0 ? (
          <section className="rounded-2xl bg-white/95 p-4 shadow-sm">
            <label htmlFor="pet-selector" className="mb-2 block text-sm font-semibold text-[#7C4A2D]">
              어떤 아이의 사진인가요?
            </label>
            <select
              id="pet-selector"
              value={selectedPetId}
              onChange={(event) => setSelectedPetId(event.target.value)}
              className="w-full rounded-xl border border-[#FDBA74] bg-white px-3 py-2 text-sm text-[#5A3325] outline-none focus:border-[#F97316]"
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

        {showCallingPrompt ? (
          <div className="space-y-5 rounded-3xl bg-white/95 p-8 text-center shadow-lg">
            <p className="text-4xl">🐾</p>
            <h2 className="text-xl font-bold text-[#4F2A1D]">
              우리 아이가 나를
              <br />
              뭐라고 부를까요?
            </h2>
            <p className="text-sm text-[#A36241]">한 번 선택하면 기억할게요!</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleCallingSelect("엄마")}
                className="rounded-2xl bg-gradient-to-b from-[#FFB7C5] to-[#FF8FAB] px-8 py-4 text-lg font-bold text-white shadow-lg transition active:scale-95"
              >
                엄마
              </button>
              <button
                type="button"
                onClick={() => handleCallingSelect("아빠")}
                className="rounded-2xl bg-gradient-to-b from-[#87CEEB] to-[#5BA3D9] px-8 py-4 text-lg font-bold text-white shadow-lg transition active:scale-95"
              >
                아빠
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="다른 호칭 직접 입력 (예: 언니, 오빠)"
                maxLength={10}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    const value = (event.target as HTMLInputElement).value.trim();
                    if (value) {
                      handleCallingSelect(value);
                    }
                  }
                }}
                className="w-full rounded-2xl border border-[#F8C79F] bg-[#FFF8F0] px-4 py-3 text-center text-sm text-[#4F2A1D] placeholder-[#C4956E] outline-none focus:border-[#F97316]"
              />
            </div>
          </div>
        ) : (
          <>
            {status !== "success" && !showMessageInput ? (
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
                className={`cursor-pointer rounded-3xl border bg-gradient-to-b from-white to-[#FFF6EE] p-6 shadow-lg transition ${
                  isDragging ? "border-[#F97316]" : "border-[#F8C79F]"
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
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#FFEFE2]">
                      <Image src={previewUrl} alt="업로드한 반려동물 사진 미리보기" fill className="object-cover" unoptimized />
                    </div>
                    <p className="text-center text-xs text-[#A36241]">이미지를 다시 누르면 다른 사진으로 변경할 수 있어요.</p>
                  </div>
                ) : (
                  <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl text-center">
                    <span className="text-5xl">🐾</span>
                    <p className="text-lg font-semibold text-[#6B3D2A]">우리 아이 사진을 올려주세요</p>
                    <p className="text-[11px] text-[#AE7A5F]">최대 5MB · jpg/png/webp</p>
                  </div>
                )}
              </div>
            ) : null}

            {showMessageInput && status === "idle" && previewUrl && (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <div className="relative aspect-square w-full">
                    <Image src={previewUrl} alt="업로드한 사진" fill className="object-cover" unoptimized />
                  </div>
                </div>

                <div className="rounded-3xl bg-white/95 p-5 shadow-lg">
                  <p className="mb-1 text-base font-bold text-[#4F2A1D]">우리 아이에게 한마디 💬</p>
                  <p className="mb-3 text-xs text-[#A36241]">말을 걸면 더 재밌는 반응이 나와요!</p>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {["사랑해 ❤️", "배고프지? 🍖", "산책 갈까? 🐕", "뭐 생각해? 🤔", "미안해 늦어서 😢", "잘했어! 👏"].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setUserMessage(quick)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          userMessage === quick ? "bg-[#F97316] text-white shadow-md" : "bg-[#FFF0E6] text-[#7C4A2D] hover:bg-[#FFE0CC]"
                        }`}
                      >
                        {quick}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(event) => setUserMessage(event.target.value.slice(0, 50))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          void generateSpeech();
                        }
                      }}
                      placeholder="직접 입력해도 돼요 (최대 50자)"
                      maxLength={50}
                      className="w-full rounded-2xl border border-[#F8C79F] bg-[#FFF8F0] px-4 py-3 pr-12 text-sm text-[#4F2A1D] placeholder-[#C4956E] outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C4956E]">{userMessage.length}/50</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void generateSpeech()}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#FB923C] py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98]"
                >
                  🐾 우리 아이의 반응 보기
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserMessage("");
                    void generateSpeech();
                  }}
                  className="w-full text-center text-sm text-[#A36241]"
                >
                  말 없이 사진만으로 해보기
                </button>
              </div>
            )}
          </>
        )}

        <section className="rounded-3xl bg-white/80 p-5 shadow-sm">
          {status === "loading" && (
            <div className="space-y-4 rounded-3xl bg-[#FFF5EB] p-4 motion-safe:animate-pulse">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-3xl shadow-xl">
                {previewUrl ? <Image src={previewUrl} alt="분석 중인 반려동물 사진" fill className="object-cover" unoptimized /> : null}
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <p className="text-base font-medium text-[#6B3D2A]">우리 아이가 생각하고 있어요...</p>
                <div className="mt-2 inline-flex items-center gap-1">
                  {[1, 2, 3].map((dot) => (
                    <span key={dot} className={`h-2 w-2 rounded-full bg-[#F97316] ${typingDots >= dot ? "opacity-100" : "opacity-25"}`} />
                  ))}
                </div>
              </div>
              <p className="text-center text-sm text-[#A36241]">잠깐만요, 곧 말할 거예요 🐾</p>
            </div>
          )}

          {status === "success" && previewUrl && (
            <div className="space-y-5 opacity-0 motion-safe:animate-[fadeIn_0.5s_ease-out_forwards] motion-reduce:opacity-100">
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={previewUrl}
                    alt="반려동물 결과 사진"
                    fill
                    unoptimized
                    className={`object-cover ${emotionMeta.animationClassName}`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                </div>
              </div>

              {userMessage && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#F97316] px-4 py-2.5 text-sm font-medium text-white shadow-md">
                    {userMessage}
                  </div>
                </div>
              )}

              <div className="flex justify-center opacity-0 motion-safe:animate-[fadeInUp_0.4s_ease-out_0.3s_forwards] motion-reduce:opacity-100">
                <span
                  style={{ backgroundColor: emotionMeta.background, borderColor: emotionMeta.border }}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold text-[#5C321E] shadow-md motion-safe:animate-bounce"
                >
                  <span>{emotionMeta.emoji}</span>
                  <span>{emotionMeta.label}</span>
                  <span>{emotionScore}점</span>
                </span>
              </div>

              <div className="relative rounded-3xl bg-white p-6 text-lg font-medium leading-relaxed text-[#2D2D2D] shadow-lg opacity-0 motion-safe:animate-[fadeInUp_0.5s_ease-out_0.5s_forwards] motion-reduce:opacity-100">
                <span className="absolute -top-2 left-9 h-5 w-5 rotate-45 bg-white" aria-hidden />
                <p>{speech}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-sm text-gray-400">— {selectedPet?.name ?? "우리 아이"}</p>
                  <button
                    type="button"
                    onClick={handleSpeechPlayback}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FB923C] text-white shadow-md"
                    aria-label="대사 음성 재생"
                  >
                    {isSpeaking ? (
                      <span className="flex items-end gap-0.5">
                        {[0, 1, 2].map((bar) => (
                          <span
                            key={bar}
                            className="h-3 w-1 rounded-full bg-white motion-safe:animate-[wave_0.9s_ease-in-out_infinite]"
                            style={{ animationDelay: `${bar * 0.15}s` }}
                          />
                        ))}
                      </span>
                    ) : (
                      "🔊"
                    )}
                  </button>
                </div>
              </div>

              <ShareCard
                petImageUrl={previewUrl}
                dialogue={speech}
                petName={selectedPet?.name ?? ""}
                emotion={emotion}
                emotionScore={emotionScore}
                kakaoJavaScriptKey={process.env.NEXT_PUBLIC_KAKAO_JS_KEY}
              />

              <div className="grid grid-cols-2 gap-3 opacity-0 motion-safe:animate-[fadeIn_0.5s_ease-out_0.8s_forwards] motion-reduce:opacity-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl border border-[#F97316] bg-white px-4 py-4 text-base font-bold text-[#C2410C]"
                >
                  다시 해보기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareTitle = `${selectedPet?.name ?? "우리 아이"}의 펫토커 결과`;
                    const shareText = speech;

                    if (navigator.share) {
                      void navigator.share({ title: shareTitle, text: shareText, url: window.location.href });
                      return;
                    }

                    void navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${window.location.href}`);
                    setErrorMessage("공유 링크를 복사했어요. 원하는 앱에 붙여넣어 공유해 보세요!");
                  }}
                  className="rounded-2xl bg-[#F97316] px-4 py-4 text-base font-bold text-white shadow-md"
                >
                  공유하기
                </button>
              </div>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <div className="rounded-2xl border border-[#F8C79F] bg-[#FFF8F2] p-4 text-center text-sm text-[#7C4A2D]">
              {status === "error" ? (
                <div className="space-y-3">
                  <p>{errorMessage}</p>
                  {errorType === "usage_exceeded" ? (
                    <Link href="https://apps.apple.com/" className="inline-flex rounded-lg bg-[#F97316] px-4 py-2 text-xs font-bold text-white">
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

        <section className="rounded-3xl bg-gradient-to-r from-[#F97316] to-[#FB923C] p-6 text-center shadow-lg">
          <p className="text-sm font-semibold text-white">앱에서 기록하면 우리 아이를 더 잘 아는 AI가 돼요</p>
          <button type="button" className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#EA580C] shadow-sm">
            앱 다운로드
          </button>
        </section>

        {errorMessage && status !== "error" ? <p className="text-center text-xs font-medium text-[#C2410C]">{errorMessage}</p> : null}
      </section>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        @keyframes tilt {
          0% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
          100% {
            transform: rotate(-3deg);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }
        .emotion-animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
        .emotion-animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        .emotion-animate-tilt {
          animation: tilt 2s ease-in-out infinite;
        }
        .emotion-animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
        .emotion-animate-heartbeat {
          animation: heartbeat 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .emotion-animate-bounce,
          .emotion-animate-breathe,
          .emotion-animate-tilt,
          .emotion-animate-shake,
          .emotion-animate-heartbeat {
            animation: none;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </main>
  );
}
