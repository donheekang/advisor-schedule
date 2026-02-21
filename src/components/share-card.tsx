"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { downloadShareCard, renderShareCard, type ShareCardRenderResult } from "@/lib/share-card";

type ShareCardProps = {
  petImageUrl: string;
  dialogue: string;
  petName?: string;
  emotion: "happy" | "peaceful" | "curious" | "grumpy" | "proud" | "love" | "sleepy" | "hungry";
  emotionScore: number;
  kakaoJavaScriptKey?: string;
};

type KakaoSharePayload = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
};

type KakaoApi = {
  isInitialized: () => boolean;
  init: (appKey: string) => void;
  Share: {
    sendDefault: (payload: KakaoSharePayload) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoApi;
  }
}

export function ShareCard({ petImageUrl, dialogue, petName, emotion, emotionScore, kakaoJavaScriptKey }: ShareCardProps) {
  const [card, setCard] = useState<ShareCardRenderResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/pet-talker";
    }

    return `${window.location.origin}/pet-talker`;
  }, []);

  const generateCard = useCallback(async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await renderShareCard({ petImageUrl, dialogue, petName, emotion, emotionScore });
      setCard(generated);
      return generated;
    } catch {
      setErrorMessage("공유 이미지를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [dialogue, emotion, emotionScore, petImageUrl, petName]);

  useEffect(() => {
    if (!kakaoJavaScriptKey || !window.Kakao) {
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoJavaScriptKey);
    }
  }, [kakaoJavaScriptKey]);

  useEffect(() => {
    void generateCard();
  }, [generateCard]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleDownload = async () => {
    const currentCard = card ?? (await generateCard());
    if (!currentCard) {
      return;
    }

    downloadShareCard(currentCard.blob);
  };

  const handleKakaoShare = async () => {
    if (!window.Kakao) {
      return;
    }

    const titlePetName = petName ? petName + "이(가)" : "우리 아이가";
    const truncatedDialogue = dialogue.length > 150 ? dialogue.slice(0, 147) + "..." : dialogue;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: titlePetName + " 이렇게 말한대",
        description: truncatedDialogue,
        imageUrl: resultUrl + "/og-image.png",
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl
        }
      },
      buttons: [
        {
          title: "나도 해보기",
          link: {
            mobileWebUrl: resultUrl,
            webUrl: resultUrl
          }
        }
      ]
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(resultUrl);
    setToastMessage("링크가 복사되었어요!");
  };

  return (
    <section className="space-y-4 border-b-8 border-[#F2F4F6] py-6">
      <h2 className="text-[15px] font-bold text-[#191F28]">SNS 공유 카드</h2>
      <p className="text-sm text-[#8B95A1]">이미지 저장, 카카오톡 공유, 링크 복사를 한 번에 할 수 있어요.</p>

      <div className="overflow-hidden rounded-[14px] border-[1.5px] border-[#E5E8EB] bg-white">
        {card ? (
          <img alt="펫토커 공유 카드 미리보기" className="h-auto w-full" src={card.dataUrl} />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-[#8B95A1]">
            {isGenerating ? "카드를 생성하고 있어요..." : "공유 카드를 생성하지 못했어요."}
          </div>
        )}
      </div>

      {errorMessage ? <p className="text-sm text-rose-500">{errorMessage}</p> : null}
      {toastMessage ? <p className="text-sm font-semibold text-[#06B56C]">{toastMessage}</p> : null}

      <div className="grid grid-cols-3 gap-3">
        <button
          className="rounded-[14px] bg-[#191F28] px-3 py-3 text-xs font-bold text-white disabled:opacity-60"
          disabled={isGenerating}
          onClick={() => void handleDownload()}
          type="button"
        >
          이미지 저장
        </button>
        <button
          className="rounded-[14px] bg-[#FEE500] px-3 py-3 text-xs font-bold text-[#191F28] disabled:opacity-60"
          disabled={isGenerating || !kakaoJavaScriptKey}
          onClick={() => void handleKakaoShare()}
          type="button"
        >
          카카오톡 공유
        </button>
        <button
          className="rounded-[14px] border-[1.5px] border-[#E5E8EB] px-3 py-3 text-xs font-bold text-[#4E5968] disabled:opacity-60"
          disabled={isGenerating}
          onClick={() => void handleCopyLink()}
          type="button"
        >
          링크 복사
        </button>
      </div>
    </section>
  );
}
