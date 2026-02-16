import { NextRequest, NextResponse } from 'next/server';
import { generateLocalCareReport } from '@/lib/care-report';

type AnalyzeRequestBody = {
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  allergies?: string[];
  conditions?: string[];
};

type AnthropicResponse = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

const usageStore = new Map<string, number>();

function getClientIp(request: NextRequest): string {
  const connectingIp = request.headers.get('cf-connecting-ip');
  if (connectingIp) {
    return connectingIp.trim();
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() ?? 'unknown';
}

function getUsageKey(ip: string): string {
  return `${new Date().toISOString().slice(0, 10)}:${ip}`;
}

function getUsageCount(ip: string): number {
  return usageStore.get(getUsageKey(ip)) ?? 0;
}

function incrementUsage(ip: string): number {
  const key = getUsageKey(ip);
  const next = (usageStore.get(key) ?? 0) + 1;
  usageStore.set(key, next);
  return next;
}

function buildFallbackInsight(reportSummary: string): string {
  return `${reportSummary}\n\n이 결과는 가격 비교/생활 루틴 안내를 위한 참고 정보예요. 의료 진단이나 처방은 반드시 병원 상담을 통해 확인해주세요.`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const currentUsage = getUsageCount(ip);

    if (currentUsage >= 3) {
      return NextResponse.json(
        { error: 'DAILY_LIMIT_EXCEEDED', message: '오늘 무료 분석 3회를 모두 사용했어요.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as AnalyzeRequestBody;
    const species = body.species?.trim() || '강아지';
    const breed = body.breed?.trim() || '믹스';
    const age = typeof body.age === 'number' ? body.age : 0;
    const weight = typeof body.weight === 'number' ? body.weight : 0;
    const allergies = (body.allergies ?? []).map((item) => item.trim()).filter(Boolean);
    const conditions = body.conditions ?? [];

    const localReport = generateLocalCareReport(species, breed, age, conditions, allergies);
    let insight = buildFallbackInsight(localReport.summary);
    let source: 'ai' | 'local' = 'local';

    if (process.env.ANTHROPIC_API_KEY) {
      const prompt = `당신은 반려동물 케어 루틴 가이드입니다.
의료 판단/진단은 절대 하지 말고, 생활 루틴과 가격 비교 관점의 정보만 한국어로 안내하세요.
톤은 친절한 "~해요" 체로 3~4문장으로 작성하세요.

반려동물 정보: ${breed} ${species}, ${age}살, ${weight}kg
최근 진료 선택: ${conditions.join(', ') || '없음'}
알러지: ${allergies.join(', ') || '없음'}
로컬 리포트 요약: ${localReport.summary}

마지막 문장은 "의료 진단이 아닌 참고용 정보"라는 취지의 안전 문구를 포함해주세요.`;

      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (anthropicResponse.ok) {
          const payload = (await anthropicResponse.json()) as AnthropicResponse;
          const text = payload.content?.find((item) => item.type === 'text')?.text?.trim();
          if (text) {
            insight = text;
            source = 'ai';
          }
        }
      } catch (anthropicError) {
        console.warn('[ai-care/analyze] anthropic fallback to local insight', anthropicError);
      }
    }

    const nextUsage = incrementUsage(ip);

    return NextResponse.json({
      insight,
      source,
      remaining: Math.max(0, 3 - nextUsage)
    });
  } catch (error) {
    console.error('[ai-care/analyze] failed', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
