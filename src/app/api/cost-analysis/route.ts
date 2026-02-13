import { verifyBearerToken } from '@/lib/auth';
import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type AnthropicClient = {
  messages: {
    create: (params: {
      model: string;
      max_tokens: number;
      system: string;
      stream: true;
      messages: Array<{
        role: 'user' | 'assistant';
        content: string;
      }>;
    }) => Promise<AsyncIterable<{ type: string; delta?: { type: string; text: string } }>>;
  };
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type SearchContext = {
  itemName?: string;
  region?: string;
  stats?: {
    average?: number;
    min?: number;
    max?: number;
    sampleSize?: number;
    source?: string;
  };
  seedRange?: {
    min?: number;
    max?: number;
    source?: string;
  };
};

type CostAnalysisRequestBody = {
  message?: string;
  history?: ChatMessage[];
  context?: SearchContext;
};

type PetContext = {
  breed: string | null;
  age: number | null;
};

const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_TURNS = 10;

const SYSTEM_PROMPT = `당신은 반려동물 진료비 분석 전문가입니다.
역할: 진료비 가격 정보 제공 및 영수증 항목 설명
규칙:
- 의료 판단 절대 금지 (진단, 처방, 치료 권유 안 함)
- '이 병원이 좋다/나쁘다' 평가 금지
- 가격 비교, 항목 설명, 비용 절약 팁만 제공
- 모든 응답 끝에 면책 조항 포함: '※ 이 정보는 참고용이며 의료 판단이 아닙니다.'
- 데이터 출처를 명시 (평균 가격 언급 시)
- 친근하고 이해하기 쉬운 한국어로 설명`;

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
}

function calculateAgeInYears(birthday: string | null): number | null {
  if (!birthday) {
    return null;
  }

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (beforeBirthday) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function normalizeHistory(history: ChatMessage[] | undefined): ChatMessage[] {
  if (!history?.length) {
    return [];
  }

  return history
    .filter(
      (message): message is ChatMessage =>
        (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string'
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim()
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_TURNS * 2);
}

async function getPetContext(firebaseUid: string): Promise<PetContext | null> {
  const supabase = getSupabaseServerClient();

  const userResult = await supabase.from('users').select('id').eq('firebase_uid', firebaseUid).maybeSingle();
  if (userResult.error || !userResult.data) {
    return null;
  }

  const petResult = await supabase
    .from('pets')
    .select('breed, birthday')
    .eq('user_id', userResult.data.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (petResult.error || !petResult.data) {
    return null;
  }

  return {
    breed: petResult.data.breed,
    age: calculateAgeInYears(petResult.data.birthday)
  };
}

async function getItemStats(itemName: string): Promise<{ min: number; max: number; avg: number; count: number } | null> {
  const normalizedItem = itemName.trim();
  if (!normalizedItem) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const statsResult = await supabase
    .from('health_items')
    .select('price')
    .ilike('item_name', `%${normalizedItem}%`)
    .limit(200);

  if (statsResult.error || !statsResult.data?.length) {
    return null;
  }

  const prices = statsResult.data.map((row) => row.price).filter((price) => Number.isFinite(price));
  if (!prices.length) {
    return null;
  }

  const total = prices.reduce((sum, value) => sum + value, 0);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Math.round(total / prices.length),
    count: prices.length
  };
}

function buildContextPrompt(params: {
  searchContext?: SearchContext;
  petContext: PetContext | null;
  dbStats: Awaited<ReturnType<typeof getItemStats>>;
}): string {
  const sourceContext = params.searchContext;
  const sections: string[] = [];

  if (sourceContext?.itemName) {
    sections.push(`- 검색 항목: ${sourceContext.itemName}`);
  }

  if (sourceContext?.region) {
    sections.push(`- 검색 지역: ${sourceContext.region}`);
  }

  if (params.dbStats) {
    sections.push(
      `- DB 가격 통계(health_items, 표본 ${params.dbStats.count}건): 평균 ${params.dbStats.avg.toLocaleString('ko-KR')}원, 최소 ${params.dbStats.min.toLocaleString('ko-KR')}원, 최대 ${params.dbStats.max.toLocaleString('ko-KR')}원`
    );
  }

  if (sourceContext?.stats) {
    sections.push(
      `- 화면 통계(${sourceContext.stats.source ?? '서비스 집계'}): 평균 ${sourceContext.stats.average?.toLocaleString('ko-KR') ?? '정보 없음'}원, 최소 ${sourceContext.stats.min?.toLocaleString('ko-KR') ?? '정보 없음'}원, 최대 ${sourceContext.stats.max?.toLocaleString('ko-KR') ?? '정보 없음'}원, 표본 ${sourceContext.stats.sampleSize ?? '정보 없음'}건`
    );
  }

  if (sourceContext?.seedRange) {
    sections.push(
      `- 시드 데이터 범위(${sourceContext.seedRange.source ?? '시드 데이터'}): 최소 ${sourceContext.seedRange.min?.toLocaleString('ko-KR') ?? '정보 없음'}원, 최대 ${sourceContext.seedRange.max?.toLocaleString('ko-KR') ?? '정보 없음'}원`
    );
  }

  if (params.petContext) {
    sections.push(
      `- 회원 반려동물 정보: 품종 ${params.petContext.breed ?? '정보 없음'}, 나이 ${params.petContext.age ?? '정보 없음'}세`
    );
  }

  if (!sections.length) {
    return '참고 컨텍스트: 없음';
  }

  return `참고 컨텍스트:\n${sections.join('\n')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CostAnalysisRequestBody;
    const message = body.message?.trim();
    const searchContext = body.context;

    if (!message) {
      return NextResponse.json({ error: '질문을 입력해주세요.' }, { status: 400 });
    }

    const history = normalizeHistory(body.history);

    const authorizationHeader = request.headers.get('authorization') ?? undefined;
    let firebaseUid: string | null = null;

    if (authorizationHeader) {
      try {
        const decoded = await verifyBearerToken(authorizationHeader);
        firebaseUid = decoded.uid;
      } catch {
        firebaseUid = null;
      }
    }

    const [petContext, dbStats] = await Promise.all([
      firebaseUid ? getPetContext(firebaseUid) : Promise.resolve(null),
      searchContext?.itemName ? getItemStats(searchContext.itemName) : Promise.resolve(null)
    ]);

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return NextResponse.json({ error: 'LLM API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: Anthropic } = require('@anthropic-ai/sdk') as {
      default: new (options: { apiKey: string }) => AnthropicClient;
    };

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });
    const contextPrompt = buildContextPrompt({ searchContext, petContext, dbStats });

    const stream = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      stream: true,
      messages: [
        ...history,
        {
          role: 'user',
          content: `${contextPrompt}\n\n사용자 질문: ${message}`
        }
      ]
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: `비용 분석 중 오류가 발생했습니다: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ error: '비용 분석 중 알 수 없는 오류가 발생했습니다.' }, { status: 500 });
  }
}
