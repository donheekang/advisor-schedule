import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '펫토커 - 사진 한 장으로 듣는 우리 아이 속마음';
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
          background: 'linear-gradient(160deg, #fff8f3 0%, #fff0e6 50%, #ffe4d4 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 장식 원들 */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -40,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,122,69,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -30,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,122,69,0.06)',
          }}
        />

        {/* 말풍선 아이콘 */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff7a45, #ff9b5e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            boxShadow: '0 8px 24px rgba(255,122,69,0.25)',
          }}
        >
          <span style={{ fontSize: 40 }}>💬</span>
        </div>

        {/* PET TALKER */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#ff7a45',
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
          }}
        >
          PET TALKER
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#17191f',
            marginTop: 12,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          사진 한 장으로 듣는
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#17191f',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          우리 아이 속마음
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 20,
            color: '#8a92a3',
            marginTop: 20,
          }}
        >
          지금 무슨 생각을 하고 있을까? 사진을 올리면 우리 아이가 직접 말해줘요.
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, color: '#ff7a45', fontWeight: 600 }}>PetHealth+</span>
        </div>

        {/* 하단 오렌지 라인 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 5,
            background: 'linear-gradient(90deg, #ff7a45, #ff9b5e)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
