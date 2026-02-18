import type { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get('title') ?? '반려동물 진료비 가이드';
  const category = request.nextUrl.searchParams.get('category') ?? '전체';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF8F0, #FFEDD5)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          color: '#4F2A1D'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>PetHealth+</div>
          <div style={{ fontSize: 24, color: '#A36241' }}>{category}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
          <div style={{ fontSize: 28, color: '#7C4A2D' }}>전국 실데이터 기반 반려동물 진료비 비교</div>
        </div>

        <div style={{ fontSize: 20, color: '#A36241' }}>pethealthplus.kr</div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
