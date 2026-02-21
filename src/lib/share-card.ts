export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1200;

const CREAM_BACKGROUND = '#F8FAFB';
const BUBBLE_BACKGROUND = '#FFFFFF';
const TEXT_COLOR = '#191F28';

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

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  return canvas;
};

const EMOTION_TEXT: Record<ShareCardPayload['emotion'], { emoji: string; label: string; background: string }> = {
  happy: { emoji: '😆', label: '신남', background: '#FEF3C7' },
  peaceful: { emoji: '😌', label: '평화', background: '#D1FAE5' },
  curious: { emoji: '🤔', label: '호기심', background: '#DBEAFE' },
  grumpy: { emoji: '😤', label: '투정', background: '#FEE2E2' },
  proud: { emoji: '😏', label: '도도', background: '#F3E8FF' },
  love: { emoji: '🥰', label: '사랑', background: '#FCE7F3' },
  sleepy: { emoji: '😴', label: '나른', background: '#E0E7FF' },
  hungry: { emoji: '🤤', label: '배고픔', background: '#FFEDD5' }
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
  title: '우리 강아지가 이렇게 말한대 😂',
  openGraph: {
    title: '우리 강아지가 이렇게 말한대 😂',
    images: [{ url: getPetTalkerOgImageUrl(resultId, origin), width: 1080, height: 1080 }]
  }
});

export const renderShareCard = async (payload: ShareCardPayload): Promise<ShareCardRenderResult> => {
  const canvas = createCanvas();
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context is not available.');
  }

  await document.fonts.load('700 50px Pretendard');
  await document.fonts.load('500 40px Pretendard');

  context.fillStyle = CREAM_BACKGROUND;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const warmGradient = context.createLinearGradient(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  warmGradient.addColorStop(0, '#F8FAFB');
  warmGradient.addColorStop(1, '#F2F4F6');
  context.fillStyle = warmGradient;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const petImage = await loadImage(payload.petImageUrl);
  const imageSize = 320;
  const imageX = (SHARE_CARD_WIDTH - imageSize) / 2;
  const imageY = 88;

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

  const bubbleTop = imageY + imageSize + 78;
  const bubbleHeight = 520;
  const bubbleX = 76;
  const bubbleWidth = SHARE_CARD_WIDTH - bubbleX * 2;

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

  context.fillStyle = TEXT_COLOR;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.font = '700 56px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillText('우리 아이의 한마디', bubbleX + 48, bubbleTop + 42);

  const emotionMeta = EMOTION_TEXT[payload.emotion];
  context.fillStyle = emotionMeta.background;
  context.beginPath();
  context.roundRect(bubbleX + 48, bubbleTop + 122, 320, 64, 999);
  context.fill();

  context.font = '700 34px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = TEXT_COLOR;
  context.fillText(`${emotionMeta.emoji} ${emotionMeta.label} ${payload.emotionScore}점`, bubbleX + 72, bubbleTop + 137);

  context.font = '500 36px Pretendard, Apple SD Gothic Neo, sans-serif';
  const textMaxWidth = bubbleWidth - 96;
  const lines = wrapText(context, payload.dialogue, textMaxWidth, 6);
  lines.forEach((line, index) => {
    context.fillText(line, bubbleX + 48, bubbleTop + 210 + index * 48);
  });

  context.font = '500 28px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = '#8B95A1';
  context.fillText(`— ${payload.petName || '우리 아이'}`, bubbleX + 48, bubbleTop + bubbleHeight - 56);

  context.fillStyle = '#FFFFFF';
  context.globalAlpha = 0.95;
  context.beginPath();
  context.roundRect(80, SHARE_CARD_HEIGHT - 170, SHARE_CARD_WIDTH - 160, 92, 28);
  context.fill();
  context.globalAlpha = 1;

  context.font = '700 36px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = '#191F28';
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.fillText('PetHealth+', 118, SHARE_CARD_HEIGHT - 112);

  context.font = '600 24px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = '#8B95A1';
  const dateText = new Date().toLocaleDateString('ko-KR');
  context.fillText(dateText, 338, SHARE_CARD_HEIGHT - 112);

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
