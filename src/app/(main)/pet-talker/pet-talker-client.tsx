"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

import { StoreComingSoonButtons } from "@/components/store-coming-soon-buttons";

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
  const hasResult = status === "success" && Boolean(speech);

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
    <main className="min-h-screen bg-[#F5E5FC] px-4 py-8 text-[#1F2937] md:py-12">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6">
        <header className="space-y-3 text-center">
          <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1F2937] shadow-sm">
            {usageText}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight">우리 아이가 말을 한다면 🐾</h1>
          <p className="text-sm leading-relaxed text-[#1F2937]">
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
          className={
            'cursor-pointer rounded-3xl border-2 border-dashed bg-white p-5 shadow-sm transition ' +
            (isDragging ? 'border-[#48B8D0]' : 'border-[#1F2937]/20')
          }
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
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5E5FC]">
                <Image src={previewUrl} alt="업로드한 반려동물 사진 미리보기" fill className="object-cover" unoptimized />
              </div>
              <p className="text-center text-xs text-[#1F2937]">이미지를 다시 누르면 다른 사진으로 변경할 수 있어요.</p>
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-[#F5E5FC]/60 text-center">
              <span className="text-4xl">📷</span>
              <p className="text-base font-bold">드래그하거나 눌러서 사진 올리기</p>
              <p className="text-xs text-[#1F2937]">최대 5MB · jpg/png/webp</p>
            </div>
          )}
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          {status === "loading" && (
            <div className="animate-pulse space-y-4">
              <div className="h-56 rounded-2xl bg-[#F5E5FC]" />
              <div className="h-4 w-4/5 rounded-full bg-[#F5E5FC]" />
              <div className="h-4 w-3/5 rounded-full bg-[#F5E5FC]" />
            </div>
          )}

          {status === "success" && previewUrl && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F5E5FC] p-3">
                <p className="mb-3 text-center text-xs font-semibold text-[#1F2937]">
                  감정: {emotion} · 공감도 {emotionScore}
                </p>
                <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-white shadow-sm">
                  <Image src={previewUrl} alt="반려동물 공유 카드" fill className="object-cover" unoptimized />
                </div>
                <div className="relative mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#1F2937] shadow-sm">
                  <span className="absolute -top-2 left-5 h-4 w-4 rotate-45 bg-white" aria-hidden />
                  “{speech}”
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-[#1F2937]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1F2937]"
                >
                  다시 해보기
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#48B8D0] px-3 py-2 text-sm font-semibold text-white"
                >
                  공유하기 (카카오톡/인스타)
                </button>
              </div>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <div className="rounded-2xl border border-[#1F2937]/10 bg-[#F5E5FC] p-4 text-center text-sm text-[#1F2937]">
              {status === "error"
                ? errorMessage
                : "사진을 업로드하면 여기에 우리 아이의 1인칭 대사가 나타나요!"}
            </div>
          )}
        </section>

        {hasResult && (
          <div className="mx-auto mt-6 w-full max-w-2xl">
            <div className="rounded-3xl border border-[#48B8D0]/20 bg-gradient-to-r from-[#48B8D0]/5 to-[#C084FC]/5 p-6">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex-1">
                  <p className="mb-1 text-base font-bold text-[#0B3041]">우리 아이 기록, 앱에서 모아보세요</p>
                  <p className="text-sm text-[#6B7280]">진료 기록부터 체중 변화까지 — AI가 알아서 정리해줘요</p>
                </div>
                <StoreComingSoonButtons tone="light" />
              </div>
            </div>
          </div>
        )}

        {status === "success" && (
          <section className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-[#B28B84]/40">
            <p className="text-lg font-bold text-[#1F2937]">우리 아이 건강도 확인해보세요</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link
                href="/ai-care"
                className="rounded-xl bg-gradient-to-r from-[#48B8D0] to-[#B28B84] px-4 py-2 text-sm font-bold text-white"
              >
                무료 AI 견적서 →
              </Link>
              <Link
                href="/cost-search"
                className="rounded-xl border border-[#48B8D0] bg-white px-4 py-2 text-sm font-bold text-[#48B8D0]"
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
