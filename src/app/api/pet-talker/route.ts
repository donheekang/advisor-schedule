import Anthropic from '@anthropic-ai/sdk';
import { verifyBearerToken } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

type PetTalkerRequestBody = {
  image?: string;
  petInfo?: {
    name?: string;
    breed?: string;
    age?: number;
  };
};

type UsagePolicy = {
  dailyLimit: number;
  isMember: boolean;
};

type SupportedImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

const SYSTEM_PROMPT = `당신은 반려동물의 입장에서 1인칭으로 말하는 AI입니다.
규칙:
- 반말 + 귀여운 말투 사용
- 2~4문장
- 유머러스하고 SNS에 공유하고 싶은 대사
- 간식, 산책, 병원, 보호자에 대한 불만 등 반려동물 관점의 주제
- 의료 조언 절대 금지
- 사진에서 보이는 반려동물의 외형, 표정, 자세를 반영`;

const GUEST_MODEL = 'claude-haiku-4-5-20251001';
const MEMBER_MODEL = 'claude-sonnet-4-5-20250929';

const usageStore = new Map<string, number>();

function isSupportedMediaType(mediaType: string): mediaType is SupportedImageMediaType {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType);
}

function parseBase64Image(imageBase64: string): { mediaType: SupportedImageMediaType; data: string } {
  const trimmed = imageBase64.trim();
  const dataUrlMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(trimmed);

  if (dataUrlMatch) {
    const [, mediaType, data] = dataUrlMatch;
    if (!isSupportedMediaType(mediaType)) {
      throw new Error('INVALID_IMAGE_FORMAT');
    }
    return { mediaType, data };
  }

  const bareBase64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!bareBase64Pattern.test(trimmed)) {
    throw new Error('INVALID_IMAGE_FORMAT');
  }

  return { mediaType: 'image/jpeg', data: trimmed };
}

function getUsageKey(identifier: string): string {
  const dateKey = new Date().toISOString().slice(0, 10);
  return `${dateKey}:${identifier}`;
}

function getUsagePolicy(isMember: boolean): UsagePolicy {
  if (isMember) {
    return { dailyLimit: 5, isMember: true };
  }

  return { dailyLimit: 2, isMember: false };
}

function getCurrentUsage(identifier: string): number {
  const key = getUsageKey(identifier);
  return usageStore.get(key) ?? 0;
}

function incrementUsage(identifier: string): number {
  const key = getUsageKey(identifier);
  const currentUsage = usageStore.get(key) ?? 0;
  const nextUsage = currentUsage + 1;
  usageStore.set(key, nextUsage);
  return nextUsage;
}

function getClientIp(request: NextRequest): string {
  const cookieIp = request.cookies.get('pet_talker_ip')?.value;
  if (cookieIp) {
    return cookieIp;
  }

  const connectingIp = request.headers.get('cf-connecting-ip');
  if (connectingIp) {
    return connectingIp.trim();
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || 'unknown';
}

function buildUserPrompt(petInfo?: PetTalkerRequestBody['petInfo']): string {
  if (!petInfo) {
    return '이 아이가 지금 무슨 생각을 하고 있을지 1인칭으로 말해줘.';
  }

  const name = petInfo.name?.trim() || '알 수 없음';
  const breed = petInfo.breed?.trim() || '알 수 없음';
  const age = typeof petInfo.age === 'number' && Number.isFinite(petInfo.age) ? petInfo.age : '알 수 없음';

  return `이 아이가 지금 무슨 생각을 하고 있을지 1인칭으로 말해줘.\n이 아이 정보: 이름=${name}, 품종=${breed}, 나이=${age}세.\n이름과 특성을 자연스럽게 반영해줘.`;
}

async function createAnthropicMessageStream(params: {
  client: Anthropic;
  imageData: string;
  mediaType: SupportedImageMediaType;
  model: string;
  userPrompt: string;
}) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await params.client.messages.create({
        model: params.model,
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        stream: true,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: params.mediaType,
                  data: params.imageData
                }
              },
              {
                type: 'text',
                text: params.userPrompt
              }
            ]
          }
        ]
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return NextResponse.json({ error: '서비스 준비 중' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as PetTalkerRequestBody;

    if (!body.image) {
      return NextResponse.json({ error: '이미지(base64)가 필요합니다.' }, { status: 400 });
    }

    let image: { mediaType: SupportedImageMediaType; data: string };
    try {
      image = parseBase64Image(body.image);
    } catch {
      return NextResponse.json({ error: '이미지 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const authorizationHeader = request.headers.get('authorization') ?? undefined;

    let isMember = false;
    let userId: string | null = null;
    if (authorizationHeader) {
      try {
        const decoded = await verifyBearerToken(authorizationHeader);
        userId = decoded.uid;
        isMember = true;
      } catch {
        isMember = false;
      }
    }

    const usagePolicy = getUsagePolicy(isMember);
    const usageIdentifier = isMember ? `user:${userId}` : `ip:${getClientIp(request)}`;
    const currentUsage = getCurrentUsage(usageIdentifier);

    if (currentUsage >= usagePolicy.dailyLimit) {
      return NextResponse.json(
        {
          error: 'limit_exceeded',
          message: '오늘 사용 횟수를 다 썼어요',
          limit: usagePolicy.dailyLimit,
          used: currentUsage
        },
        { status: 429 }
      );
    }

    incrementUsage(usageIdentifier);

    const model = isMember ? MEMBER_MODEL : GUEST_MODEL;
    const userPrompt = isMember ? buildUserPrompt(body.petInfo) : buildUserPrompt();

    const anthropicClient = new Anthropic({ apiKey: anthropicApiKey });
    const claudeStream = await createAnthropicMessageStream({
      client: anthropicClient,
      imageData: image.data,
      mediaType: image.mediaType,
      model,
      userPrompt
    });

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of claudeStream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'text_delta', text: event.delta.text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: '대사 생성에 실패했습니다. 잠시 후 다시 시도해줘.' })}\n\n`
            )
          );
          controller.close();
        }
      }
    });

    return new Response(responseStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch {
    return NextResponse.json({ error: '펫토커 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
