export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1080;

const NAVY_BACKGROUND = '#12344A';
const TEAL_ACCENT = '#2A9D8F';
const BUBBLE_BACKGROUND = '#FFFFFF';
const TEXT_COLOR = '#1B3A4B';

export type ShareCardPayload = {
  petImageUrl: string;
  dialogue: string;
  petName?: string;
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

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    const measured = context.measureText(candidate).width;

    if (measured <= maxWidth) {
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

export const getPetTalkerResultUrl = (resultId: string, origin = window.location.origin) =>
  `${origin}/pet-talker/result/${resultId}`;

export const getPetTalkerOgImageUrl = (resultId: string, origin = window.location.origin) =>
  `${origin}/pet-talker/result/${resultId}/og.png`;

export const createPetTalkerOgMetadata = (resultId: string, origin = window.location.origin) => ({
  title: '우리 강아지가 이렇게 말한대 😂',
  openGraph: {
    title: '우리 강아지가 이렇게 말한대 😂',
    images: [{ url: getPetTalkerOgImageUrl(resultId, origin), width: 1080, height: 1080 }]
  }
});

export const renderShareCard = async (
  payload: ShareCardPayload
): Promise<ShareCardRenderResult> => {
  const canvas = createCanvas();
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context is not available.');
  }

  await document.fonts.load('700 50px Pretendard');
  await document.fonts.load('500 40px Pretendard');

  context.fillStyle = NAVY_BACKGROUND;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const gradient = context.createLinearGradient(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  gradient.addColorStop(0, '#1B4B67');
  gradient.addColorStop(1, '#12344A');
  context.fillStyle = gradient;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  context.fillStyle = TEAL_ACCENT;
  context.globalAlpha = 0.2;
  context.beginPath();
  context.ellipse(220, 180, 260, 180, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(900, 860, 240, 160, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  const petImage = await loadImage(payload.petImageUrl);
  const imageSize = 320;
  const imageX = (SHARE_CARD_WIDTH - imageSize) / 2;
  const imageY = 96;

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

  const bubbleTop = imageY + imageSize + 72;
  const bubbleHeight = 350;
  const bubbleX = 80;
  const bubbleWidth = SHARE_CARD_WIDTH - bubbleX * 2;

  context.fillStyle = BUBBLE_BACKGROUND;
  context.beginPath();
  context.roundRect(bubbleX, bubbleTop, bubbleWidth, bubbleHeight, 40);
  context.fill();

  context.fillStyle = BUBBLE_BACKGROUND;
  context.beginPath();
  context.moveTo(SHARE_CARD_WIDTH / 2 - 28, bubbleTop);
  context.lineTo(SHARE_CARD_WIDTH / 2 + 28, bubbleTop);
  context.lineTo(SHARE_CARD_WIDTH / 2, bubbleTop - 34);
  context.closePath();
  context.fill();

  context.fillStyle = TEXT_COLOR;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.font = '700 52px Pretendard, Apple SD Gothic Neo, sans-serif';

  const speaker = payload.petName ? `${payload.petName}의 한마디` : '우리 아이의 한마디';
  context.fillText(speaker, bubbleX + 48, bubbleTop + 40);

  context.font = '500 42px Pretendard, Apple SD Gothic Neo, sans-serif';
  const textMaxWidth = bubbleWidth - 96;
  const lines = wrapText(context, `“${payload.dialogue}”`, textMaxWidth, 3);
  lines.forEach((line, index) => {
    context.fillText(line, bubbleX + 48, bubbleTop + 140 + index * 60);
  });

  context.fillStyle = '#FFFFFF';
  context.globalAlpha = 0.95;
  context.beginPath();
  context.roundRect(80, SHARE_CARD_HEIGHT - 170, SHARE_CARD_WIDTH - 160, 92, 28);
  context.fill();
  context.globalAlpha = 1;

  context.font = '700 42px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = TEAL_ACCENT;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText('PetHealth+', 120, SHARE_CARD_HEIGHT - 124);

  context.font = '500 28px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = '#1B3A4B';
  context.textAlign = 'right';
  context.fillText('pethealthplus.co.kr/pet-talker', SHARE_CARD_WIDTH - 120, SHARE_CARD_HEIGHT - 124);

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
