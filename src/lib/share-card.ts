export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1080; // 기본값, 실제 렌더링 시 동적 조절

const BUBBLE_BACKGROUND = '#FFFFFF';
const TEXT_COLOR = '#17191f';

export type ShareCardPayload = {
  petImageUrl: string;
  dialogue: string;
  petName?: string;
  emotion: 'happy' | 'peaceful' | 'curious' | 'grumpy' | 'proud' | 'love' | 'sleepy' | 'hungry';
  emotionScore: number;
};

export type ShareCardRenderResult = {
  blob: Blob;
  dataUrl: string;
};

const EMOTION_TEXT: Record<ShareCardPayload['emotion'], { label: string; background: string }> = {
  happy: { label: '신남', background: '#eaf2ff' },
  peaceful: { label: '평화', background: '#ecfdf3' },
  curious: { label: '호기심', background: '#f0f7ff' },
  grumpy: { label: '투정', background: '#fff1f2' },
  proud: { label: '도도', background: '#f5f3ff' },
  love: { label: '사랑', background: '#fdf2f8' },
  sleepy: { label: '나른', background: '#eef2ff' },
  hungry: { label: '배고픔', background: '#fffbeb' }
};

const loadImage = async (src: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Failed to load image for share card.'));
    image.src = src;
  });

  return image;
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      current = candidate;
      return;
    }

    if (current) {
      lines.push(current);
      current = word;
      return;
    }

    lines.push(word);
    current = '';
  });

  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const trimmed = lines.slice(0, maxLines);
  const last = trimmed[maxLines - 1] ?? '';
  trimmed[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 2))}…`;
  return trimmed;
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL.'));
    reader.readAsDataURL(blob);
  });

export const getPetTalkerResultUrl = (resultId: string, origin = window.location.origin) => `${origin}/pet-talker/result/${resultId}`;

export const getPetTalkerOgImageUrl = (resultId: string, origin = window.location.origin) => `${origin}/pet-talker/result/${resultId}/og.png`;

export const createPetTalkerOgMetadata = (resultId: string, origin = window.location.origin) => ({
  title: '우리 아이가 이렇게 말해요',
  openGraph: {
    title: '우리 아이가 이렇게 말해요',
    images: [{ url: getPetTalkerOgImageUrl(resultId, origin), width: 1080, height: 1080 }]
  }
});

export const renderShareCard = async (payload: ShareCardPayload): Promise<ShareCardRenderResult> => {
  // 1) 높이 계산을 위한 임시 캔버스
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = SHARE_CARD_WIDTH;
  measureCanvas.height = 100;
  const measureCtx = measureCanvas.getContext('2d')!;

  await document.fonts.load("700 50px 'Pretendard Variable'");
  await document.fonts.load("500 40px 'Pretendard Variable'");

  const imageSize = 320;
  const imageY = 88;
  const bubbleX = 76;
  const bubbleWidth = SHARE_CARD_WIDTH - bubbleX * 2;
  const lineHeight = 58;

  measureCtx.font = "500 44px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  const textMaxWidth = bubbleWidth - 96;
  const lines = wrapText(measureCtx, payload.dialogue, textMaxWidth, 6);

  const bubbleBaseHeight = 300;
  const bubbleHeight = bubbleBaseHeight + lines.length * lineHeight;
  const bubbleTop = imageY + imageSize + 78;
  const footerHeight = 170;
  const totalHeight = bubbleTop + bubbleHeight + footerHeight;

  // 2) 실제 캔버스 생성 (동적 높이)
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = totalHeight;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context is not available.');
  }

  // 배경
  const warmGradient = context.createLinearGradient(0, 0, SHARE_CARD_WIDTH, totalHeight);
  warmGradient.addColorStop(0, '#f3f5f9');
  warmGradient.addColorStop(1, '#eaf2ff');
  context.fillStyle = warmGradient;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, totalHeight);

  // 반려동물 이미지
  const petImage = await loadImage(payload.petImageUrl);
  const imageX = (SHARE_CARD_WIDTH - imageSize) / 2;

  context.save();
  context.beginPath();
  context.arc(SHARE_CARD_WIDTH / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
  context.closePath();
  context.clip();

  const sourceSize = Math.min(petImage.width, petImage.height);
  const sourceX = (petImage.width - sourceSize) / 2;
  const sourceY = (petImage.height - sourceSize) / 2;
  context.drawImage(petImage, sourceX, sourceY, sourceSize, sourceSize, imageX, imageY, imageSize, imageSize);
  context.restore();

  context.lineWidth = 14;
  context.strokeStyle = '#FFFFFF';
  context.beginPath();
  context.arc(SHARE_CARD_WIDTH / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
  context.stroke();

  // 말풍선 버블
  context.fillStyle = BUBBLE_BACKGROUND;
  context.beginPath();
  context.roundRect(bubbleX, bubbleTop, bubbleWidth, bubbleHeight, 44);
  context.fill();

  context.fillStyle = BUBBLE_BACKGROUND;
  context.beginPath();
  context.moveTo(SHARE_CARD_WIDTH / 2 - 26, bubbleTop);
  context.lineTo(SHARE_CARD_WIDTH / 2 + 26, bubbleTop);
  context.lineTo(SHARE_CARD_WIDTH / 2, bubbleTop - 32);
  context.closePath();
  context.fill();

  // 제목
  context.fillStyle = TEXT_COLOR;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.font = "700 56px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  context.fillText('우리 아이의 한마디', bubbleX + 48, bubbleTop + 42);

  // 감정 칩
  const emotionMeta = EMOTION_TEXT[payload.emotion];
  context.fillStyle = emotionMeta.background;
  context.beginPath();
  context.roundRect(bubbleX + 48, bubbleTop + 122, 320, 64, 999);
  context.fill();

  context.font = "700 34px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  context.fillStyle = TEXT_COLOR;
  context.fillText(`${emotionMeta.label} ${payload.emotionScore}점`, bubbleX + 72, bubbleTop + 137);

  // 대사 텍스트 (최대 6줄)
  context.font = "500 44px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  lines.forEach((line, index) => {
    context.fillText(line, bubbleX + 48, bubbleTop + 222 + index * lineHeight);
  });

  // 펫 이름
  context.font = "500 28px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  context.fillStyle = '#9CA3AF';
  context.fillText(`— ${payload.petName || '우리 아이'}`, bubbleX + 48, bubbleTop + bubbleHeight - 56);

  // 하단 PetHealth+ 바
  context.fillStyle = '#FFFFFF';
  context.globalAlpha = 0.95;
  context.beginPath();
  context.roundRect(80, totalHeight - 140, SHARE_CARD_WIDTH - 160, 92, 28);
  context.fill();
  context.globalAlpha = 1;

  context.font = "700 36px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  context.fillStyle = '#0B3041';
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.fillText('PetHealth+', 118, totalHeight - 82);

  context.font = "600 24px 'Pretendard Variable', Pretendard, Apple SD Gothic Neo, sans-serif";
  context.fillStyle = '#697182';
  const dateText = new Date().toLocaleDateString('ko-KR');
  context.fillText(dateText, 338, totalHeight - 82);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error('Failed to export share card PNG.'));
        return;
      }
      resolve(result);
    }, 'image/png');
  });

  return {
    blob,
    dataUrl: await blobToDataUrl(blob)
  };
};

export const downloadShareCard = (blob: Blob, filename = 'pet-talker-share-card.png') => {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(blobUrl);
};
