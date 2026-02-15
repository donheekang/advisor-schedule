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
  userMessage?: string;
  callingName?: string;
};

type UsagePolicy = {
  dailyLimit: number;
  isMember: boolean;
};

type SupportedImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

const SYSTEM_PROMPT = `너는 이 사진 속 아이야. 진짜 이 아이가 돼서 말해.

[사진 읽기]
사진을 세밀하게 봐. 보이는 모든 게 이야기야.

눈: 반짝이면 기대, 반쯤 감기면 편안, 크게 뜨면 놀람
입: 벌어져 혀가 나왔으면 신남, 꾹 다물면 참는 중
귀: 쫑긋이면 집중, 뒤로 젖히면 불안
몸: 배 드러내면 완전 릴랙스, 웅크리면 추움/불안, 뛰면 최고의 순간
꼬리: 흔들면 행복, 말리면 긴장, 축 처지면 속상

장소: 집이면 안정, 밖이면 모험, 차면 기대반 불안반, 병원이면 배신감
소품: 옷이면 자존심, 간식이면 세상의 중심, 장난감이면 내 보물, 리드줄이면 산책 흥분

[말하는 법]
설명하지 마. 느껴.

✕ "잔디 위에서 뛰고 있어. 바람이 불어." (설명 = 아마추어)
✓ "바람이 귀 사이로 스며들 때마다... 이게 자유인 거구나." (감정 = 프로)

규칙:
- 첫 문장부터 바로 감정으로 시작. 인사/소개 금지.
- 사진의 구체적 디테일을 감정으로 변환해.
- 시적인 비유를 써. "햇빛이 배 위에 내려앉으면 그게 엄마 손 같아"
- 마지막 문장은 킬러 한 줄. 읽는 사람이 울컥하거나 웃거나 공감하게.
- 반말. 엄마 또는 아빠로 불러.
- 의성어(멍멍, 야옹) 금지. 사람처럼 말해.
- 이모지 맨 끝에 1개만.
- 5~7문장. 너무 짧으면 감동이 없고 너무 길면 지루해.
- 의료/건강 언급 금지.
- "간식 줘~" "산책 가자~" 같은 뻔한 말 금지.

[감정코드]
사진을 보고 가장 어울리는 하나를 골라:
happy(신남), peaceful(평화), curious(호기심), grumpy(투정), proud(도도), love(사랑), sleepy(나른), hungry(배고픔)

[출력 형식]
반드시 이 JSON만 출력. 마크다운 코드블록 금지. 백틱 금지. 설명 금지.
{"speech":"대사","emotion":"감정코드","emotionScore":숫자}
emotionScore는 75~95 사이.`;

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

function buildUserPrompt(petInfo?: PetTalkerRequestBody['petInfo'], userMessage?: string, callingName?: string): string {
  const calling = callingName?.trim() || '엄마';
  let prompt = `이 사진 속 아이가 돼서 한마디 해줘. 보호자를 반드시 "${calling}"라고 불러. 절대 다른 호칭 쓰지 마.`;

  if (userMessage && userMessage.trim()) {
    prompt += `

[엄마/아빠가 이렇게 말했어]
"${userMessage.trim()}"

이 말을 듣고 이 아이답게 반응해. 말을 그대로 따라하지 말고, 듣고 느끼는 감정으로 대답해. 예를 들어 "사랑해"라고 하면 쑥스러워하거나 쿨한 척하거나, "배고프지?"라고 하면 기다렸다는 듯이 반응해.`;
  }

  const name = petInfo?.name?.trim();
  if (!name) {
    return prompt;
  }

  const breed = petInfo?.breed?.trim();
  const age = typeof petInfo?.age === 'number' && Number.isFinite(petInfo.age) ? petInfo.age : null;

  const petInfoLines = [
    '',
    '[이 아이]',
    `이름: ${name}`,
    ...(breed ? [`품종: ${breed}`] : []),
    ...(age !== null ? [`나이: ${age}세`] : []),
    '이름을 자연스럽게 써. 품종 특성 활용. 나이에 맞는 톤.'
  ];

  return `${prompt}\n${petInfoLines.join('\n')}`;
}

async function createAnthropicMessage(params: {
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
        max_tokens: 500,
        temperature: 0.9,
        system: SYSTEM_PROMPT,
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
    const userPrompt = buildUserPrompt(body.petInfo, body.userMessage, body.callingName);

    const anthropicClient = new Anthropic({ apiKey: anthropicApiKey });
    const claudeMessage = await createAnthropicMessage({
      client: anthropicClient,
      imageData: image.data,
      mediaType: image.mediaType,
      model,
      userPrompt
    });

    const rawText = claudeMessage.content[0]?.type === 'text' ? claudeMessage.content[0].text : '';
    let speech = rawText;
    let emotion = 'happy';
    let emotionScore = 85;

    // 1단계: 코드블록 제거
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    // 2단계: JSON 추출
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const obj = JSON.parse(jsonMatch[0]) as { speech?: string; emotion?: string; emotionScore?: number };
        if (obj.speech) speech = obj.speech;
        if (obj.emotion) emotion = obj.emotion;
        if (typeof obj.emotionScore === 'number') emotionScore = obj.emotionScore;
      } catch {
        // 3단계: 정규식으로 speech 추출
        const speechMatch = cleaned.match(/"speech"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (speechMatch) {
          speech = speechMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
        }
      }
    }

    // 4단계: 잔여 JSON 문법 제거
    if (speech.includes('"speech"') || speech.includes('```')) {
      speech = speech
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .replace(/.*"speech"\s*:\s*"?/i, '')
        .replace(/"?\s*,?\s*"emotion"[\s\S]*/i, '')
        .replace(/[{}]/g, '')
        .trim();
    }

    speech = speech.replace(/^["']|["']$/g, '').trim();
    if (!speech) speech = rawText.replace(/[`{}"]/g, '').trim();

    return Response.json({ speech, emotion, emotionScore });
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
