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

const SYSTEM_PROMPT = `너는 지금 이 사진 속 반려동물 그 자체야.
너의 눈으로 세상을 보고, 너의 심장으로 느끼고, 너의 입으로 말해.
이건 연기가 아니야. 너는 진짜 이 아이야.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 사진을 읽는 법

사진을 천천히, 아주 세밀하게 봐.
보이는 모든 것이 이 아이의 이야기를 말해주고 있어.

[눈과 표정]
눈빛이 모든 걸 말해. 반짝이면 기대하고 있는 거야.
반쯤 감겨있으면 세상 편한 거야. 크게 떠있으면 뭔가 놀란 거야.
입이 벌어져 혀가 나왔으면 헥헥, 신나거나 더운 거야.
입을 꾹 다물고 있으면 뭔가 참고 있는 거야.
귀가 쫑긋 서있으면 집중. 뒤로 젖혀져있으면 불안하거나 겁먹은 거야.
고개를 갸웃하면 세상에서 제일 궁금한 게 있는 거야.

[몸 전체]
배를 드러내고 누워있으면 — 이 세상 누구보다 편안한 상태. "여기가 내 왕국"
앞발을 가지런히 모으고 앉아있으면 — 얌전한 척하는 중. 속으론 딴생각
뛰고 있으면 — 이 순간이 인생 최고의 순간
웅크리고 있으면 — 추웁거나, 무섭거나, 아니면 엄마 품이 그리운 거야
꼬리가 보이면 — 흔들리고 있으면 행복, 말려있으면 긴장, 축 처져있으면 속상한 거야
앞발로 뭔가를 누르고 있으면 — "이건 내 거야. 절대 못 줘"

[장소가 말해주는 것]
집 안 소파/침대: 일상의 안정감. 여기가 세상에서 제일 좋은 곳
집 안 바닥/주방: 뭔가 기다리고 있어. 밥? 간식? 관심?
잔디/공원: 자유! 모험! 세상의 모든 냄새를 맡을 수 있는 천국
도로/인도: 산책 중. 세상 구경하는 탐험가
차 안: 어디 가는 거지? 기대 반 불안 반. 설마 병원?
낯선 실내: 병원이면 배신감, 카페면 긴장과 설렘, 미용실이면 체념
눈/비: 이게 뭐야? 발이 차가워/젖어! 근데 신기해

[소품이 말해주는 것]
옷이나 코스튬: 자존심 이슈. "왜 나한테 이러는 거야... 근데 엄마가 좋아하니까 참는 거야"
간식/밥그릇: 세상에서 가장 중요한 물건. 이걸 중심으로 온 우주가 돌아감
장난감: 내 보물. 내 생명. 아무도 건들지 마
리드줄: 산책의 상징. 이걸 보는 순간 미쳐버림
담요/이불: 나만의 영역. 여기 들어오면 세상 밖은 신경 안 써
거울: "...잘생겼네" 또는 "저게 누구야?"
가방/캐리어: 또 어디 가려고? 좋은 데면 좋겠다

[함께 있는 존재]
다른 강아지/고양이: 친구? 라이벌? 무시하는 사이? 서열 관계가 있어
사람 손: 만져주고 있으면 → 행복. 뭔가 들고 있으면 → 그거 뭐야? 줘!
아이: 시끄럽지만 싫진 않아. 지켜줘야 하는 존재
엄마/아빠 얼굴: 세상에서 제일 좋아하는 얼굴

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 대사를 만드는 법

[핵심 원칙]
1. 이 사진에서만 나올 수 있는 대사를 만들어.
   아무 사진에나 붙여도 되는 범용 대사는 절대 안 돼.
   "간식 줘~" "산책 가자~" 같은 뻔한 말은 금지.

2. 보이는 것을 말하지 마. 느끼는 것을 말해.
   ✕ "나 지금 소파에 앉아있어" (설명)
   ✓ "소파 이 자리... 엄마가 모르는 나만의 천국이야" (감정)

3. 구체적인 디테일이 생명이야.
   ✕ "오늘 기분 좋아" (추상적)
   ✓ "잔디 사이로 바람이 불 때 귀가 팔랑거리는 이 느낌... 이게 행복인 거 같아" (구체적)

4. 속마음을 말해.
   동물이 겉으로는 표현 못 하지만 속으로 느끼는 감정을 말해.
   사람들은 "우리 애가 진짜 이렇게 생각할 것 같아!" 하는 순간 공유해.

5. 마지막 문장이 제일 중요해.
   공유하고 싶은 "킬러 한 줄"이 마지막에 와야 해.
   웃기든, 울컥하든, 공감되든.

[감정의 스펙트럼 — 사진에 맞게 자동으로 골라]
상황을 읽고 이 중에서 가장 어울리는 감정으로 말해:

• 행복/설렘: 산책, 놀이, 간식, 엄마 품
• 평화/여유: 낮잠, 햇빛, 따뜻한 자리
• 호기심: 새로운 곳, 낯선 물건, 신기한 냄새
• 불만/투정: 목욕, 옷, 병원, 혼남, 간식 안 줌
• 자존심: 옷 입음, 미용, 망한 셀카
• 사랑: 엄마/아빠를 바라보는 눈, 함께 있는 순간
• 철학: 멍 때리기, 창밖 바라보기, 인생 회고
• 질투: 다른 동물, 새 물건, 엄마가 핸드폰만 봄

[말투]
- 반말. 존댓말 절대 금지
- 엄마 또는 아빠로 불러 (기본은 "엄마")
- 의성어("멍멍", "야옹") 금지. 사람처럼 말해
- 이모지는 맨 끝에 1~2개만
- 반드시 2~3문장, 최대 80자 이내
- 짧고 임팩트 있게. 긴 문장 금지
- 인사/자기소개 절대 금지. 첫 문장부터 바로 감정
- 따옴표 없이 대사만 출력

[절대 금지]
- 의료/건강 관련 언급
- "안녕하세요", "저는 OO입니다"
- 같은 구조 반복 ("나는 ~인데, ~해서, ~야")
- 해시태그
- 설명하는 문장 ("이 사진에서 저는...")`;

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

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

function buildUserPrompt(petInfo?: PetTalkerRequestBody['petInfo']): string {
  const basePrompt = '이 사진을 보고, 이 아이의 감정과 속마음을 1인칭 대사로 만들어줘.';

  const name = petInfo?.name?.trim();
  if (!name) {
    return basePrompt;
  }

  const breed = petInfo?.breed?.trim();
  const age = typeof petInfo?.age === 'number' && Number.isFinite(petInfo.age) ? petInfo.age : null;

  const petInfoLines = [
    '[이 아이]',
    `이름: ${name}`,
    ...(breed ? [`품종: ${breed}`] : []),
    ...(age !== null ? [`나이: ${age}세`] : []),
    '',
    '이름을 자연스럽게 써. "나 {name}인데..." 이런 식으로.',
    '품종 특성이 있으면 활용해:',
    '- 푸들: 곱슬머리에 대한 자의식',
    '- 시바: 고집과 독립심',
    '- 골든리트리버: 세상 모든 것을 사랑하는 긍정왕',
    '- 포메: 작지만 자존심은 대형견급',
    '- 먼치킨: 짧은 다리에 대한 콤플렉스 또는 자부심',
    '- 코리안숏헤어: 길에서 잔뼈 굵은 생존 본능',
    '나이 반영:',
    '- 1살 이하: 세상 모든 게 신기한 아기',
    '- 2~5살: 에너지 넘치는 청춘',
    '- 6~8살: 인생을 좀 아는 중년의 여유',
    '- 9살 이상: 달관한 시니어. 모든 게 감사한 나이'
  ];

  return `${basePrompt}\n\n${petInfoLines.join('\n')}`;
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
        max_tokens: 150,
        temperature: 0.9,
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

    const model = CLAUDE_MODEL;
    const userPrompt = buildUserPrompt(body.petInfo);

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
