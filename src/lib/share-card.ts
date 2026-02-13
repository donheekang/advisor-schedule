export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1080;

const WARM_BACKGROUND = '#FFF6E9';
const BUBBLE_BACKGROUND = '#FFFFFF';
const TEXT_COLOR = '#1E293B';
const WATERMARK_COLOR = '#94A3B8';

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

  context.fillStyle = WARM_BACKGROUND;
  context.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const petImage = await loadImage(payload.petImageUrl);
  const topAreaHeight = Math.floor(SHARE_CARD_HEIGHT * 0.6);

  const sourceRatio = petImage.width / petImage.height;
  const targetRatio = SHARE_CARD_WIDTH / topAreaHeight;

  let sourceWidth = petImage.width;
  let sourceHeight = petImage.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = petImage.height * targetRatio;
    sourceX = (petImage.width - sourceWidth) / 2;
  } else {
    sourceHeight = petImage.width / targetRatio;
    sourceY = (petImage.height - sourceHeight) / 2;
  }

  context.drawImage(
    petImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    SHARE_CARD_WIDTH,
    topAreaHeight
  );

  const bubbleTop = topAreaHeight + 40;
  const bubbleHeight = SHARE_CARD_HEIGHT - bubbleTop - 60;
  const bubbleX = 48;
  const bubbleWidth = SHARE_CARD_WIDTH - bubbleX * 2;

  context.fillStyle = BUBBLE_BACKGROUND;
  context.beginPath();
  context.roundRect(bubbleX, bubbleTop, bubbleWidth, bubbleHeight, 40);
  context.fill();

  context.fillStyle = TEXT_COLOR;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.font = '700 52px Pretendard, Apple SD Gothic Neo, sans-serif';

  const speaker = payload.petName ? `${payload.petName}의 한마디` : '우리 아이의 한마디';
  context.fillText(speaker, bubbleX + 48, bubbleTop + 40);

  context.font = '500 42px Pretendard, Apple SD Gothic Neo, sans-serif';
  const textMaxWidth = bubbleWidth - 96;
  const lines = wrapText(context, `“${payload.dialogue}”`, textMaxWidth, 4);
  lines.forEach((line, index) => {
    context.fillText(line, bubbleX + 48, bubbleTop + 140 + index * 60);
  });

  context.font = '500 28px Pretendard, Apple SD Gothic Neo, sans-serif';
  context.fillStyle = WATERMARK_COLOR;
  context.textAlign = 'right';
  context.fillText('PetHealthPlus', SHARE_CARD_WIDTH - 56, SHARE_CARD_HEIGHT - 42);

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
