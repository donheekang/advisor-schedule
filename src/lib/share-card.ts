export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1080; // 기본값, 실제 렌더링 시 동적 조절

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

const EMOTION_TEXT: Record<ShareCardPayload['emotion'], { label: string; emoji: string; gradientStart: string; gradientEnd: string }> = {
  happy: { label: '신남', emoji: '😆', gradientStart: '#FFD93D', gradientEnd: '#FF8A00' },
  peaceful: { label: '평화', emoji: '😌', gradientStart: '#A8E6CF', gradientEnd: '#3DC1C3' },
  curious: { label: '호기심', emoji: '🧐', gradientStart: '#A0C4FF', gradientEnd: '#6C63FF' },
  grumpy: { label: '투정', emoji: '😤', gradientStart: '#FFA8A8', gradientEnd: '#FF6B6B' },
  proud: { label: '도도', emoji: '😏', gradientStart: '#D9ABFF', gradientEnd: '#A855F7' },
  love: { label: '사랑', emoji: '🥰', gradientStart: '#FFB8C6', gradientEnd: '#FF6B9D' },
  sleepy: { label: '나른', emoji: '😴', gradientStart: '#B8C6FF', gradientEnd: '#7C85DE' },
  hungry: { label: '배고픔', emoji: '🤤', gradientStart: '#FFDDA1', gradientEnd: '#FF9F43' }
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

/** 부드러운 둥근 사각형 그리기 */
const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/** 그림자 설정 헬퍼 */
const setShadow = (ctx: CanvasRenderingContext2D, blur: number, offsetY: number, color: string) => {
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowColor = color;
};

const clearShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = 'transparent';
};

export const renderShareCard = async (payload: ShareCardPayload): Promise<ShareCardRenderResult> => {
  // 1) 높이 계산을 위한 임시 캔버스
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = SHARE_CARD_WIDTH;
  measureCanvas.height = 100;
  const measureCtx = measureCanvas.getContext('2d')!;

  await document.fonts.load("700 50px 'Pretendard Variable'");
  await document.fonts.load("500 40px 'Pretendard Variable'");

  const imageSize = 300;
  const imageY = 100;
  const bubbleX = 72;
  const bubbleWidth = SHARE_CARD_WIDTH - bubbleX * 2;
  const lineHeight = 56;
  const FONT_FAMILY = "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', sans-serif";

  measureCtx.font = `500 42px ${FONT_FAMILY}`;
  const textMaxWidth = bubbleWidth - 100;
  const lines = wrapText(measureCtx, payload.dialogue, textMaxWidth, 6);

  const bubbleBaseHeight = 310;
  const bubbleHeight = bubbleBaseHeight + lines.length * lineHeight;
  const bubbleTop = imageY + imageSize + 60;
  const footerHeight = 150;
  const totalHeight = bubbleTop + bubbleHeight + footerHeight;

  // 2) 실제 캔버스 생성
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available.');

  // ─── 배경: 부드러운 웜 그라데이션 ───
  const bg = ctx.createLinearGradient(0, 0, SHARE_CARD_WIDTH, totalHeight);
  bg.addColorStop(0, '#FFF5EE');
  bg.addColorStop(0.4, '#FFF0E6');
  bg.addColorStop(0.7, '#FFE8D6');
  bg.addColorStop(1, '#FFDFC8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, totalHeight);

  // ─── 장식: 부드러운 빛 원들 ───
  ctx.globalAlpha = 0.15;
  const radial1 = ctx.createRadialGradient(180, 160, 0, 180, 160, 320);
  radial1.addColorStop(0, '#ff7a45');
  radial1.addColorStop(1, 'transparent');
  ctx.fillStyle = radial1;
  ctx.fillRect(0, 0, 500, 480);

  const radial2 = ctx.createRadialGradient(SHARE_CARD_WIDTH - 120, totalHeight - 200, 0, SHARE_CARD_WIDTH - 120, totalHeight - 200, 280);
  radial2.addColorStop(0, '#ffb088');
  radial2.addColorStop(1, 'transparent');
  ctx.fillStyle = radial2;
  ctx.fillRect(SHARE_CARD_WIDTH - 400, totalHeight - 480, 400, 480);

  ctx.globalAlpha = 0.08;
  const radial3 = ctx.createRadialGradient(SHARE_CARD_WIDTH - 200, 100, 0, SHARE_CARD_WIDTH - 200, 100, 200);
  radial3.addColorStop(0, '#f9a825');
  radial3.addColorStop(1, 'transparent');
  ctx.fillStyle = radial3;
  ctx.fillRect(SHARE_CARD_WIDTH - 400, 0, 400, 300);
  ctx.globalAlpha = 1;

  // ─── 반려동물 이미지 (그림자 + 두꺼운 테두리) ───
  const imgCenterX = SHARE_CARD_WIDTH / 2;
  const imgCenterY = imageY + imageSize / 2;
  const imgRadius = imageSize / 2;

  // 이미지 외곽 그림자
  setShadow(ctx, 40, 12, 'rgba(255, 122, 69, 0.25)');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(imgCenterX, imgCenterY, imgRadius + 8, 0, Math.PI * 2);
  ctx.fill();
  clearShadow(ctx);

  // 흰색 테두리 링
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(imgCenterX, imgCenterY, imgRadius + 3, 0, Math.PI * 2);
  ctx.stroke();

  // 이미지 클리핑
  const petImage = await loadImage(payload.petImageUrl);
  const imageX = (SHARE_CARD_WIDTH - imageSize) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(imgCenterX, imgCenterY, imgRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const sourceSize = Math.min(petImage.width, petImage.height);
  const sourceX = (petImage.width - sourceSize) / 2;
  const sourceY = (petImage.height - sourceSize) / 2;
  ctx.drawImage(petImage, sourceX, sourceY, sourceSize, sourceSize, imageX, imageY, imageSize, imageSize);
  ctx.restore();

  // ─── 말풍선 카드 (그림자 + 부드러운 둥근 모서리) ───
  setShadow(ctx, 48, 16, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, bubbleX, bubbleTop, bubbleWidth, bubbleHeight, 40);
  ctx.fill();
  clearShadow(ctx);

  // 말풍선 꼬리 (삼각형)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(imgCenterX - 22, bubbleTop);
  ctx.lineTo(imgCenterX + 22, bubbleTop);
  ctx.lineTo(imgCenterX, bubbleTop - 28);
  ctx.closePath();
  ctx.fill();

  // ─── "우리 아이의 한마디" 제목 ───
  const contentX = bubbleX + 50;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `800 52px ${FONT_FAMILY}`;
  ctx.fillText('우리 아이의 한마디', contentX, bubbleTop + 44);

  // ─── 감정 칩 (그라데이션 + 이모지) ───
  const emotionMeta = EMOTION_TEXT[payload.emotion];
  const chipY = bubbleTop + 118;
  const chipText = `${emotionMeta.emoji}  ${emotionMeta.label} ${payload.emotionScore}점`;

  ctx.font = `700 32px ${FONT_FAMILY}`;
  const chipTextWidth = ctx.measureText(chipText).width;
  const chipWidth = chipTextWidth + 48;
  const chipHeight = 56;

  const chipGrad = ctx.createLinearGradient(contentX, chipY, contentX + chipWidth, chipY + chipHeight);
  chipGrad.addColorStop(0, emotionMeta.gradientStart);
  chipGrad.addColorStop(1, emotionMeta.gradientEnd);
  ctx.fillStyle = chipGrad;
  roundRect(ctx, contentX, chipY, chipWidth, chipHeight, 999);
  ctx.fill();

  ctx.font = `700 32px ${FONT_FAMILY}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.fillText(chipText, contentX + 24, chipY + chipHeight / 2 + 1);

  // ─── 대사 텍스트 ───
  ctx.textBaseline = 'top';
  ctx.font = `500 42px ${FONT_FAMILY}`;
  ctx.fillStyle = '#333333';
  const textStartY = chipY + chipHeight + 32;
  lines.forEach((line, index) => {
    ctx.fillText(line, contentX, textStartY + index * lineHeight);
  });

  // ─── 펫 이름 ───
  ctx.font = `500 26px ${FONT_FAMILY}`;
  ctx.fillStyle = '#b0b8c1';
  ctx.fillText(`— ${payload.petName || '우리 아이'}`, contentX, bubbleTop + bubbleHeight - 52);

  // ─── 하단 브랜딩 바 ───
  const footerBarY = totalHeight - 120;
  const footerBarH = 76;
  const footerBarX = 80;
  const footerBarW = SHARE_CARD_WIDTH - 160;

  setShadow(ctx, 20, 4, 'rgba(0, 0, 0, 0.06)');
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundRect(ctx, footerBarX, footerBarY, footerBarW, footerBarH, 38);
  ctx.fill();
  clearShadow(ctx);

  // 오렌지 악센트 도트
  ctx.fillStyle = '#ff7a45';
  ctx.beginPath();
  ctx.arc(footerBarX + 34, footerBarY + footerBarH / 2, 8, 0, Math.PI * 2);
  ctx.fill();

  // PetHealth+ 텍스트
  ctx.textBaseline = 'middle';
  ctx.font = `800 32px ${FONT_FAMILY}`;
  ctx.fillStyle = '#0B3041';
  ctx.fillText('PetHealth+', footerBarX + 56, footerBarY + footerBarH / 2);

  // 날짜
  ctx.font = `500 24px ${FONT_FAMILY}`;
  ctx.fillStyle = '#9CA3AF';
  const dateText = new Date().toLocaleDateString('ko-KR');
  ctx.textAlign = 'right';
  ctx.fillText(dateText, footerBarX + footerBarW - 34, footerBarY + footerBarH / 2);
  ctx.textAlign = 'left';

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
