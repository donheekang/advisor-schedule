'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  downloadShareCard,
  getPetTalkerResultUrl,
  renderShareCard,
  type ShareCardRenderResult
} from '@/lib/share-card';

type ShareCardProps = {
  resultId: string;
  petImageUrl: string;
  dialogue: string;
  petName?: string;
  kakaoJavaScriptKey?: string;
};

type KakaoLinkPayload = {
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
  buttons?: Array<{
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
  Link: {
    sendDefault: (payload: KakaoLinkPayload) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoApi;
  }
}

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';

const useKakaoSdk = (appKey?: string) => {
  useEffect(() => {
    if (!appKey) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${KAKAO_SDK_URL}"]`);

    const initialize = () => {
      if (!window.Kakao) {
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
      }
    };

    if (existingScript) {
      initialize();
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = initialize;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [appKey]);
};

export function ShareCard({ resultId, petImageUrl, dialogue, petName, kakaoJavaScriptKey }: ShareCardProps) {
  const [card, setCard] = useState<ShareCardRenderResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useKakaoSdk(kakaoJavaScriptKey);

  const resultUrl = useMemo(() => getPetTalkerResultUrl(resultId), [resultId]);

  const generateCard = useCallback(async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await renderShareCard({ petImageUrl, dialogue, petName });
      setCard(generated);
      return generated;
    } catch {
      setErrorMessage('공유 이미지를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [dialogue, petImageUrl, petName]);

  useEffect(() => {
    void generateCard();
  }, [generateCard]);

  const handleDownload = async () => {
    const currentCard = card ?? (await generateCard());
    if (!currentCard) {
      return;
    }

    downloadShareCard(currentCard.blob);
  };

  const handleShare = async () => {
    const currentCard = card ?? (await generateCard());
    if (!currentCard) {
      return;
    }

    if (navigator.share && navigator.canShare) {
      const file = new File([currentCard.blob], 'pet-talker-share-card.png', {
        type: 'image/png'
      });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '우리 강아지가 이렇게 말한대 😂',
          text: '펫토커 결과를 공유해보세요!',
          url: resultUrl,
          files: [file]
        });
        return;
      }
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': currentCard.blob
      })
    ]);
  };

  const handleKakaoShare = async () => {
    const currentCard = card ?? (await generateCard());
    if (!currentCard || !window.Kakao) {
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '우리 강아지가 이렇게 말한대 😂',
        description: '펫토커 결과를 확인해보세요.',
        imageUrl: currentCard.dataUrl,
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl
        }
      },
      buttons: [
        {
          title: '결과 보기',
          link: {
            mobileWebUrl: resultUrl,
            webUrl: resultUrl
          }
        }
      ]
    });
  };

  return (
    <section className="space-y-4 rounded-3xl bg-amber-50 p-6">
      <h2 className="text-xl font-bold text-slate-900">SNS 공유 카드</h2>
      <p className="text-sm text-slate-600">인스타그램/카카오톡에 바로 공유할 수 있는 정사각형 카드예요.</p>

      <div className="overflow-hidden rounded-2xl bg-white">
        {card ? (
          <img alt="펫토커 공유 카드 미리보기" className="h-auto w-full" src={card.dataUrl} />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-slate-500">
            {isGenerating ? '카드를 생성하고 있어요...' : '공유 카드를 생성하지 못했어요.'}
          </div>
        )}
      </div>

      {errorMessage ? <p className="text-sm text-rose-500">{errorMessage}</p> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          disabled={isGenerating}
          onClick={() => void handleDownload()}
          type="button"
        >
          이미지 다운로드
        </button>
        <button
          className="rounded-xl bg-yellow-300 px-4 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60"
          disabled={isGenerating || !kakaoJavaScriptKey}
          onClick={() => void handleKakaoShare()}
          type="button"
        >
          카카오톡 공유
        </button>
        <button
          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 disabled:opacity-60"
          disabled={isGenerating}
          onClick={() => void handleShare()}
          type="button"
        >
          클립보드/공유
        </button>
      </div>
    </section>
  );
}
