"use client";

import Image from "next/image";
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
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-20 md:px-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#ffffff_0%,#fff8f8_62%,#fff6f6_100%)] px-6 py-9 shadow-[0_24px_64px_rgba(14,31,53,0.09)] ring-1 ring-black/5 md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ff7a45]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 bottom-0 h-48 w-48 rounded-full bg-[#f3caa8]/10 blur-3xl" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#ff7a45]">PET TALKER</p>
            <span className="rounded-full bg-[#ff7a45]/10 px-2.5 py-1 text-[10px] font-semibold text-[#ff7a45]">
              {usageText}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#17191f] md:text-4xl">
            오늘, 우리 아이는
            <br />
            무슨 말을 하고 싶을까요?
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[#4f5868] md:text-base">
            사진 한 장이면 충분해요. 우리 아이의 표정을 읽고, 마음을 대신 전해드릴게요.
          </p>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-lg flex-col gap-6">

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
            isDragging ? "border-[#ff7a45]" : "border-black/15"
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
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#fff0ea]">
                <Image src={previewUrl} alt="업로드한 반려동물 사진 미리보기" fill className="object-cover" unoptimized />
              </div>
              <p className="text-center text-xs text-[#17191f]">이미지를 다시 누르면 다른 사진으로 변경할 수 있어요.</p>
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-[#fff0ea]/60 text-center">
              <p className="text-base font-bold">드래그하거나 눌러서 사진 올리기</p>
              <p className="text-xs text-[#17191f]">최대 5MB · jpg/png/webp</p>
            </div>
          )}
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          {status === "loading" && (
            <div className="animate-pulse space-y-4">
              <div className="h-56 rounded-2xl bg-[#fff0ea]" />
              <div className="h-4 w-4/5 rounded-full bg-[#fff0ea]" />
              <div className="h-4 w-3/5 rounded-full bg-[#fff0ea]" />
            </div>
          )}

          {status === "success" && previewUrl && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#fff0ea] p-3">
                <p className="mb-3 text-center text-xs font-semibold text-[#17191f]">
                  감정: {emotion} · 공감도 {emotionScore}
                </p>
                <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-sm">
                  <Image src={previewUrl} alt="반려동물 공유 카드" fill className="object-cover" unoptimized />
                </div>
                <div className="relative mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#17191f] shadow-sm">
                  <span className="absolute -top-2 left-5 h-4 w-4 rotate-45 bg-white" aria-hidden />
                  “{speech}”
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#17191f]"
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
            <div className="rounded-2xl border border-[#1B3A4B]/10 bg-[#F8FAFB] p-4 text-center text-sm text-[#17191f]">
              {status === "error"
                ? errorMessage
                : "사진을 업로드하면 여기에 우리 아이의 1인칭 대사가 나타나요!"}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-amber-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#17191f]">앱에서 기록하면 우리 아이를 더 잘 아는 AI가 돼요</p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-brand-secondary hover:bg-brand-ctaHover px-4 py-3 text-sm font-bold text-white shadow-sm"
          >
            앱 다운로드
          </button>
        </section>

        {errorMessage && status !== "error" && (
          <p className="text-center text-xs font-medium text-rose-500">{errorMessage}</p>
        )}
      </section>
    </main>
  );
}
