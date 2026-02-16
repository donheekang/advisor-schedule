"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

type RequestStatus = "idle" | "loading" | "success" | "error";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

export default function PetTalkerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [speech, setSpeech] = useState("");
  const [emotion, setEmotion] = useState("happy");
  const [emotionScore, setEmotionScore] = useState(80);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [usageCount, setUsageCount] = useState(0);

  const usageText = useMemo(() => `오늘 ${usageCount}/2회 사용`, [usageCount]);

  const handleFileValidation = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage("jpg, png, webp 파일만 업로드할 수 있어요.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("파일 크기는 최대 5MB까지 가능해요.");
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
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

      const response = await fetch("/api/pet-talker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          petInfo: undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("failed");
      }

      const data = (await response.json()) as { speech?: string; emotion?: string; emotionScore?: number };
      setSpeech(data.speech ?? "오늘 산책 2번 가면 세상 제일 행복할 것 같아요!");
      setEmotion(data.emotion ?? "happy");
      setEmotionScore(data.emotionScore ?? 80);
      setStatus("success");
      setUsageCount((prev) => Math.min(prev + 1, 2));
    } catch {
      setStatus("error");
      setErrorMessage("대사를 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
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
            사진 한 장으로 우리 아이 시점의 귀여운 한마디를 만들어 보세요. SNS에 바로 공유할 수 있는 정사각형
            카드로 보여드려요.
          </p>
        </header>

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

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          {status === "loading" && (
            <div className="animate-pulse space-y-4">
              <div className="h-56 rounded-2xl bg-[#E8EEF1]" />
              <div className="h-4 w-4/5 rounded-full bg-[#E8EEF1]" />
              <div className="h-4 w-3/5 rounded-full bg-[#E8EEF1]" />
            </div>
          )}

          {status === "success" && previewUrl && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#E8EEF1] p-3">
                <p className="mb-3 text-center text-xs font-semibold text-[#1B3A4B]">
                  감정: {emotion} · 공감도 {emotionScore}
                </p>
                <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-sm">
                  <Image src={previewUrl} alt="반려동물 공유 카드" fill className="object-cover" unoptimized />
                </div>
                <div className="relative mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#1B3A4B] shadow-sm">
                  <span className="absolute -top-2 left-5 h-4 w-4 rotate-45 bg-white" aria-hidden />
                  “{speech}”
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-[#1B3A4B]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1B3A4B]"
                >
                  다시 해보기
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#2A9D8F] px-3 py-2 text-sm font-semibold text-white"
                >
                  공유하기 (카카오톡/인스타)
                </button>
              </div>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <div className="rounded-2xl border border-[#1B3A4B]/10 bg-[#F8FAFB] p-4 text-center text-sm text-[#1B3A4B]">
              {status === "error"
                ? errorMessage
                : "사진을 업로드하면 여기에 우리 아이의 1인칭 대사가 나타나요!"}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-amber-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#1B3A4B]">앱에서 기록하면 우리 아이를 더 잘 아는 AI가 돼요</p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-brand-secondary hover:bg-brand-ctaHover px-4 py-3 text-sm font-bold text-white shadow-sm"
          >
            앱 다운로드
          </button>
        </section>

        {status === "success" && (
          <section className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-[#F8C79F]/40">
            <p className="text-lg font-bold text-[#4F2A1D]">우리 아이 건강도 확인해보세요</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link
                href="/ai-care"
                className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2 text-sm font-bold text-white"
              >
                무료 AI 견적서 →
              </Link>
              <Link
                href="/cost-search"
                className="rounded-xl border border-[#F97316] bg-white px-4 py-2 text-sm font-bold text-[#C2410C]"
              >
                진료비 검색 →
              </Link>
            </div>
          </section>
        )}

        {errorMessage && status !== "error" && (
          <p className="text-center text-xs font-medium text-rose-500">{errorMessage}</p>
        )}
      </section>
    </main>
  );
}
