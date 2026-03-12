import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '펫헬스플러스 - 우리 아이 진료비 비교 & 건강 관리';
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
        {/* 장식 원 — 상단 우측 */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255,122,69,0.07)',
          }}
        />
        {/* 장식 원 — 하단 좌측 */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -40,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(255,122,69,0.06)',
          }}
        />
        {/* 장식 원 — 중앙 우측 */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            right: 120,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,155,94,0.06)',
          }}
        />

        {/* 로고 원 + 발바닥 */}
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
          <span style={{ fontSize: 40, color: 'white' }}>🐾</span>
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#17191f',
            letterSpacing: '-1px',
          }}
        >
          PetHealth+
        </div>

        {/* 서브 카피 */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: '#4f5868',
            marginTop: 16,
          }}
        >
          우리 아이 진료비, 적정한 걸까요?
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 20,
            color: '#8a92a3',
            marginTop: 14,
          }}
        >
          전국 실제 데이터로 비교하고, 건강 기록까지 한 번에
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 18,
            color: '#ff7a45',
            fontWeight: 500,
          }}
        >
          pethealthplus.kr
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
