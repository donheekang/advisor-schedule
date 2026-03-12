'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { downloadShareCard, renderShareCard, type ShareCardRenderResult } from '@/lib/share-card';

type ShareCardProps = {
  petImageUrl: string;
  dialogue: string;
  petName?: string;
  emotion: 'happy' | 'peaceful' | 'curious' | 'grumpy' | 'proud' | 'love' | 'sleepy' | 'hungry';
  emotionScore: number;
  kakaoJavaScriptKey?: string;
};

type KakaoSharePayload = {
  objectType: 'feed';
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
    if (typeof window === 'undefined') {
      return '/pet-talker';
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
      setErrorMessage('공유 이미지를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
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
    const currentCard = card ?? (await generateCard());
    if (!currentCard || !window.Kakao) {
      return;
    }

    const titlePetName = petName ? `${petName}이(가)` : '우리 아이가';

    const ogImageUrl = `${window.location.origin}/og/default.png`;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${titlePetName} 이렇게 말해요`,
        description: dialogue.length > 100 ? `${dialogue.slice(0, 100)}…` : dialogue,
        imageUrl: ogImageUrl,
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl
        }
      },
      buttons: [
        {
          title: '나도 해보기',
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
    setToastMessage('링크가 복사되었어요!');
  };

  return (
    <section className="space-y-5 rounded-[2rem] bg-[linear-gradient(160deg,#fff8f5_0%,#fff0ea_50%,#ffe8d6_100%)] p-6 ring-1 ring-black/5 sm:p-7">
      <div>
        <h2 className="text-lg font-bold text-[#17191f]">SNS 공유 카드</h2>
        <p className="mt-1 text-sm text-[#697182]">이미지 다운로드, 카카오톡 공유, 링크 복사를 한 번에 진행할 수 있어요.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
        {card ? (
          <Image
            alt="펫토커 공유 카드 미리보기"
            className="h-auto w-full"
            height={1080}
            src={card.dataUrl}
            unoptimized
            width={1080}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-[#697182]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="h-8 w-8 animate-spin text-[#ff7a45]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span>카드를 생성하고 있어요...</span>
              </div>
            ) : '공유 카드를 생성하지 못했어요.'}
          </div>
        )}
      </div>

      {errorMessage ? <p className="text-sm text-rose-500">{errorMessage}</p> : null}
      {toastMessage ? (
        <div className="rounded-xl bg-[#0B3041] px-4 py-2.5 text-center text-sm font-semibold text-white">
          {toastMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2.5">
        <button
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-3.5 text-xs font-bold text-[#4f5868] ring-1 ring-black/5 transition hover:bg-[#f8f4ef] disabled:opacity-50"
          disabled={isGenerating}
          onClick={() => void handleDownload()}
          type="button"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          이미지
        </button>
        <button
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#FEE500] px-3 py-3.5 text-xs font-bold text-[#3C1E1E] transition hover:bg-[#FFEB33] disabled:opacity-50"
          disabled={isGenerating || !kakaoJavaScriptKey}
          onClick={() => void handleKakaoShare()}
          type="button"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.69 1.794 5.055 4.508 6.398l-1.15 4.268a.5.5 0 00.77.528l5.022-3.348c.28.02.56.032.85.032 5.523 0 10-3.463 10-7.878S17.523 3 12 3z" />
          </svg>
          카카오톡
        </button>
        <button
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-3.5 text-xs font-bold text-[#4f5868] ring-1 ring-black/5 transition hover:bg-[#f8f4ef] disabled:opacity-50"
          disabled={isGenerating}
          onClick={() => void handleCopyLink()}
          type="button"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          링크 복사
        </button>
      </div>
    </section>
  );
}
