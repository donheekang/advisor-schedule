import { NextResponse } from 'next/server';

const RENDER_API_BASE = process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://pethealthplus.onrender.com';
const RENDER_TIMEOUT = 5000;

type CostStatsResponse = {
  totalItems: number;
  categories: number;
  regions: number;
  source: 'live' | 'fallback';
};

const FALLBACK_STATS: CostStatsResponse = {
  totalItems: 128540,
  categories: 7,
  regions: 17,
  source: 'fallback',
};

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RENDER_TIMEOUT);

    const res = await fetch(`${RENDER_API_BASE}/api/cost/stats`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as CostStatsResponse;
      if (typeof data.totalItems === 'number' && data.totalItems > 0) {
        return NextResponse.json({ ...data, source: 'live' });
      }
    }
  } catch {
    // Render failed -> fallback
  }

  return NextResponse.json(FALLBACK_STATS);
}
