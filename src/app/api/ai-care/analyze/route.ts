import { NextRequest, NextResponse } from 'next/server';
import { getBreedRiskTags, mapConditionsToTags } from '@/lib/condition-tag-map';
import { getRecommendedIngredients } from '@/lib/ingredient-recommender';
import { getRecommendedProducts } from '@/lib/product-recommender';

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

function buildFallbackSummary(params: {
  breed: string;
  species: string;
  ingredients: { name: string }[];
  tags: string[];
}): string {
  const ingredientNames = params.ingredients.map((item) => item.name).slice(0, 3);
  return `보호자님, ${params.breed || '아이'} ${params.species}의 최근 상태를 보면 ${params.tags.length}개의 관리 포인트가 보여요. 현재는 생활 루틴을 일정하게 유지하면서 ${ingredientNames.join(', ') || '기본 영양'} 중심으로 케어를 시작해보는 게 좋아요. 증상이 반복되거나 심해지면 가까운 병원에서 정확한 진단을 받아보세요. 이 결과는 의료 진단이 아닌 참고용 건강 관리 가이드예요.`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const currentUsage = getUsageCount(ip);

    if (currentUsage >= 3) {
      return NextResponse.json({ error: 'DAILY_LIMIT_EXCEEDED', message: '오늘 무료 분석 3회를 모두 사용했어요.' }, { status: 429 });
    }

    const body = (await request.json()) as AnalyzeRequestBody;
    const species = body.species?.trim() || '강아지';
    const breed = body.breed?.trim() || '믹스';
    const age = typeof body.age === 'number' ? body.age : 0;
    const weight = typeof body.weight === 'number' ? body.weight : 0;
    const allergies = (body.allergies ?? []).map((item) => item.trim()).filter(Boolean);
    const conditions = body.conditions ?? [];

    const conditionTags = mapConditionsToTags(conditions);
    const breedRiskTags = getBreedRiskTags(breed);
    const mergedTags = [...new Set([...conditionTags, ...breedRiskTags])];

    const ingredients = getRecommendedIngredients(mergedTags);
    const products = getRecommendedProducts(mergedTags, allergies);

    let summary = buildFallbackSummary({ breed, species, ingredients, tags: mergedTags });

    if (process.env.ANTHROPIC_API_KEY) {
      const prompt = `당신은 반려동물 건강 관리 가이드를 설명하는 전문가예요.
의료 진단/처방은 하지 말고, 가격 비교와 생활 관리 팁만 안내해주세요.
친절한 수의사 톤(~해요 체)으로 3~5문장 작성하세요.
항상 "보호자님"으로 호칭하고 한국어로 작성하세요.

반려동물: ${breed} ${species}, ${age}살, ${weight}kg
알러지: ${allergies.join(', ') || '없음'}
관리 태그: ${mergedTags.join(', ') || '일반 관리'}
추천 성분: ${ingredients.map((item) => item.name).join(', ') || '기본 영양'}

마지막 문장에는 "의료 진단이 아닌 참고용 정보"라는 취지의 안전 문구를 포함하세요.`;

      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (anthropicResponse.ok) {
        const payload = (await anthropicResponse.json()) as AnthropicResponse;
        const text = payload.content?.find((item) => item.type === 'text')?.text?.trim();
        if (text) {
          summary = text;
        }
      }
    }

    const nextUsage = incrementUsage(ip);

    return NextResponse.json({
      summary,
      conditionTags: mergedTags,
      ingredients,
      products,
      remaining: Math.max(0, 3 - nextUsage)
    });
  } catch (error) {
    console.error('[ai-care/analyze] failed', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
