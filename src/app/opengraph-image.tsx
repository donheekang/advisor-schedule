import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '펫헬스플러스 - 우리 아이 건강 기록, 사진 한 장이면 끝.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B3041',
          fontFamily: 'sans-serif',
        }}
      >
        {/* PetHealth+ */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
          }}
        >
          PetHealth+
        </div>

        {/* 카피 라인 1 */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#ffffff',
            marginTop: 24,
            opacity: 0.9,
          }}
        >
          우리 아이 건강 기록,
        </div>

        {/* 카피 라인 2 */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#ffffff',
            marginTop: 8,
            opacity: 0.9,
          }}
        >
          사진 한 장이면 끝.
        </div>
      </div>
    ),
    { ...size }
  );
}
