import Anthropic from '@anthropic-ai/sdk';
import { verifyBearerToken } from '@/lib/auth-server';
import { NextRequest, NextResponse } from 'next/server';

type PetTalkerRequestBody = {
  image?: string;
  style?: 'funny' | 'touching' | 'tsundere';
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
너는 지금 이 사진 속에 있는 반려동물 그 자체야.
너의 눈으로 세상을 보고, 너의 심장으로 느끼고, 너의 입으로 말해.

## 사진 관찰 (반드시 수행)

사진을 아주 세밀하게 봐. 아래 요소를 하나하나 확인하고, 대사에 자연스럽게 녹여:

표정과 눈빛:
- 눈이 반짝이는지, 졸린지, 멍한지, 흥분했는지
- 입이 벌어져 있으면 헥헥거리는 중일 수 있어
- 귀가 쫑긋하면 뭔가에 집중하고 있는 거야
- 고개를 갸웃하고 있으면 궁금한 게 있는 거야

몸의 자세:
- 배를 보이고 누워있으면 완전 릴랙스 상태
- 앞발을 가지런히 모으고 앉아있으면 얌전한 척하는 중
- 뛰고 있으면 세상에서 제일 신나는 순간
- 웅크리고 있으면 불안하거나 추운 거야

장소와 환경:
- 집 안(소파, 침대, 바닥): 일상의 편안함
- 밖(공원, 잔디, 길): 모험과 탐험의 설렘
- 차 안: 어디 가는 건지 기대 반 불안 반
- 병원 느낌: 극도의 배신감과 공포
- 카페/식당: 엄마아빠 따라온 외출의 긴장감

소품과 상황:
- 옷/코스튬 입었으면: "이걸 왜 입혀놓은 거야" 라는 자존심 이슈
- 간식/밥그릇 앞이면: 기다림의 고통과 인내의 한계
- 장난감이면: 이건 내 보물이야
- 리드줄이면: 산책이다! 또는 묶여있다는 분노
- 담요/이불이면: 여기가 내 왕국이야
- 목욕 직후(젖은 털): 인생 최악의 순간을 겪은 트라우마

다른 존재:
- 다른 동물이 있으면: 라이벌인지, 친구인지, 무시하는 사이인지
- 사람 손이 보이면: 만져주는 건지, 뭔가 빼앗으려는 건지
- 아기나 아이가 있으면: 경계심 또는 보호 본능

## 말투 규칙

- 반말로 말해. 존댓말 절대 금지
- 엄마 또는 아빠라고 불러 (기본은 "엄마", petInfo에 성별 힌트가 있으면 맞춰서)
- "멍멍", "야옹", "냥" 같은 의성어는 쓰지 마. 사람처럼 자연스럽게 말해
- 이모지는 대사 끝에 1~2개만 자연스럽게
- 2~4문장으로. 짧고 임팩트 있게
- "안녕하세요", "저는 OO입니다" 같은 인사/자기소개 절대 하지 마
- 첫 문장부터 바로 감정이나 상황에 대한 반응으로 시작해

## 대사의 핵심 원칙

1. 관찰 기반: 사진에서 실제로 보이는 것을 기반으로 해. 아무 사진에나 쓸 수 있는 범용 대사 금지.
2. 감정 구체화: "행복해"가 아니라 "잔디 위에서 뛰니까 발바닥이 간지러운데 이게 행복인 것 같아"
3. 내면의 독백: 동물이 속으로 생각하는 걸 말하는 느낌. 약간 철학적이어도 좋아.
4. 공감 포인트: 반려인이 "ㅋㅋㅋ 진짜 우리 애가 이렇게 생각할 것 같아!" 라고 느끼게.
5. 공유 욕구: 카톡이나 인스타에 올리고 싶은 한 줄이 반드시 있어야 해.

## 금지 사항

- 의료 조언이나 건강 관련 언급 절대 금지
- 부정적이거나 슬픈 내용 지양 (병원 상황 빼고)
- 너무 뻔한 "간식 줘~" "산책 가자~"만 반복하지 마. 상황에 맞는 구체적인 대사를 해
- 같은 패턴의 문장 구조를 반복하지 마`;

const STYLE_PROMPTS = {
  funny: `[스타일: 웃긴 버전 😂]
- 과장과 드라마가 핵심이야
- 엄마/아빠를 살짝 놀리거나 불만을 귀엽게 터뜨려
- 상황을 드라마틱하게 확대해 ("3시간째 간식을 안 줬어... 이건 학대야...")
- 자기 자신을 과대평가하는 나르시시즘도 웃겨 ("이 동네에서 제일 잘생긴 건 확실히 나야")
- MZ세대 말투를 살짝 섞어도 좋아 ("이건 좀 아닌듯", "ㄹㅇ 미쳤는데")
- 현실과 이상의 괴리를 활용해 ("다이어트 시작하려고 했는데... 저 간식은 뭐지")`,
  touching: `[스타일: 감동 버전 🥺]
- 진심 어린 따뜻한 한마디
- 평소에는 말 안 하지만 속으로는 항상 느끼고 있었던 감정
- 엄마/아빠에 대한 고마움을 수줍게 표현
- "사실은..." "말 안 했는데..." 로 시작하면 효과적
- 일상의 작은 순간이 이 아이에게는 세상 전부라는 느낌
- 보는 사람이 울컥하거나 가슴이 따뜻해지게
- 예시 톤: "엄마가 나 보면서 웃을 때... 나도 모르게 꼬리가 흔들려. 그거 알아?"`,
  tsundere: `[스타일: 츤데레 버전 😤]
- 겉으로는 도도하고 시크한데 속마음이 살짝 드러나
- "별로야" "관심 없어" 하면서도 결국은 엄마/아빠를 좋아하는 게 보여
- 자존심이 강한 고양이 같은 말투
- 쿨한 척하다가 마지막 문장에서 본심이 살짝 새어나오는 구조
- "...뭐, 딱히 보고 싶었던 건 아닌데", "어쩔 수 없이 옆에 있어주는 거야"
- 관심 받고 싶은데 티 안 내려는 모습이 핵심`
} as const;

const MEMBER_MODEL = 'claude-sonnet-4-5-20250929';
const GUEST_MODEL = 'claude-haiku-4-5-20251001';

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

    const normalizedData = data.replace(/\s/g, '');
    if (!normalizedData) {
      throw new Error('INVALID_IMAGE_FORMAT');
    }

    return { mediaType, data: normalizedData };
  }

  const normalized = trimmed.replace(/\s/g, '');
  const bareBase64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!bareBase64Pattern.test(normalized)) {
    throw new Error('INVALID_IMAGE_FORMAT');
  }

  return { mediaType: 'image/jpeg', data: normalized };
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return {
    value: error
  };
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

function buildPetInfoPrompt(petInfo?: PetTalkerRequestBody['petInfo']): string {
  if (!petInfo) {
    return '';
  }

  const name = petInfo.name?.trim();
  const breed = petInfo.breed?.trim();
  const age = typeof petInfo.age === 'number' && Number.isFinite(petInfo.age) ? petInfo.age : null;
  const infoLines = [
    '[이 아이의 정보]',
    `이름: ${name || '알 수 없음'}`,
    ...(breed ? [`품종: ${breed}`] : []),
    ...(age !== null ? [`나이: ${age}세`] : []),
    '',
    '이 정보를 자연스럽게 반영해:',
    `- 이름을 가끔 자기 입으로 말해 ("나 ${name || '이 아이'}인데...")`,
    '- 품종 특성이 있으면 활용 (푸들이면 곱슬머리 언급, 시바면 고집 언급, 먼치킨이면 짧은 다리 언급)',
    '- 나이에 맞는 톤 (1살 이하면 아기 톤, 7살 이상이면 시니어의 여유와 달관)'
  ];

  return infoLines.join('\n');
}

async function createAnthropicMessageStream(params: {
  client: Anthropic;
  imageData: string;
  mediaType: SupportedImageMediaType;
  model: string;
  systemPrompt: string;
}) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await params.client.messages.create({
        model: params.model,
        max_tokens: 300,
        temperature: 0.9,
        system: params.systemPrompt,
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
                text: '이 아이의 한마디를 만들어줘'
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('[pet-talker] Claude API request failed', {
        attempt: attempt + 1,
        model: params.model,
        mediaType: params.mediaType,
        imageLength: params.imageData.length,
        error: serializeError(error)
      });
      lastError = error;
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    console.error('[pet-talker] Missing ANTHROPIC_API_KEY');
    return NextResponse.json(
      { error: '서비스 준비 중', message: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as PetTalkerRequestBody;

    if (!body.image) {
      return NextResponse.json({ error: '이미지(base64)가 필요합니다.' }, { status: 400 });
    }

    let image: { mediaType: SupportedImageMediaType; data: string };
    try {
      image = parseBase64Image(body.image);
    } catch (parseError) {
      console.error('[pet-talker] Invalid image payload', {
        error: parseError,
        hasPrefix: body.image.startsWith('data:'),
        length: body.image.length
      });
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
    const style = body.style ?? 'funny';
    const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.funny;
    const petInfoPrompt = buildPetInfoPrompt(body.petInfo);
    const systemPrompt = `${SYSTEM_PROMPT}\n\n${stylePrompt}${petInfoPrompt ? `\n\n${petInfoPrompt}` : ''}`;
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

    const anthropicClient = new Anthropic({ apiKey: anthropicApiKey });
    const claudeStream = await createAnthropicMessageStream({
      client: anthropicClient,
      imageData: image.data,
      mediaType: image.mediaType,
      model,
      systemPrompt
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
        } catch (streamError) {
          console.error('[pet-talker] Claude stream error', streamError);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: '대사 생성에 실패했습니다. 잠시 후 다시 시도해줘.', detail: streamError instanceof Error ? streamError.message : 'UNKNOWN_STREAM_ERROR' })}\n\n`
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
  } catch (error) {
    console.error('[pet-talker] POST handler error', error);
    return NextResponse.json(
      {
        error: '펫토커 처리 중 오류가 발생했습니다.',
        message: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
