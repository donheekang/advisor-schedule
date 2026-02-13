import { verifyBearerToken } from '@/lib/auth-server';
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
        role: 'user';
        content: Array<
          | {
              type: 'image';
              source: {
                type: 'base64';
                media_type: string;
                data: string;
              };
            }
          | {
              type: 'text';
              text: string;
            }
        >;
      }>;
    }) => Promise<AsyncIterable<{ type: string; delta?: { type: string; text: string } }>>;
  };
};

type PetTalkerRequestBody = {
  imageBase64?: string;
};

type UsagePolicy = {
  dailyLimit: number;
  isPremium: boolean;
  isMember: boolean;
};

type PetProfile = {
  id: string;
  name: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
};

const SYSTEM_PROMPT = `당신은 반려동물의 입장에서 1인칭으로 말하는 AI입니다.
- 반말 + 귀여운 말투 사용
- 2~4문장 (너무 길지 않게)
- 유머러스하고 SNS에 공유하고 싶은 대사
- 간식, 산책, 병원, 보호자에 대한 불만 등 반려동물 관점의 주제
- 회원이면 이름/품종/나이/진료기록을 반영한 개인화 대사
- 의료 조언 절대 금지`;

const GUEST_MODEL = 'claude-haiku-4-5-20251001';
const MEMBER_MODEL = 'claude-sonnet-4-5-20250929';

const usageStore = new Map<string, number>();

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

function parseBase64Image(imageBase64: string): { mediaType: string; data: string } {
  const trimmed = imageBase64.trim();
  const dataUrlMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(trimmed);

  if (dataUrlMatch) {
    const [, mediaType, data] = dataUrlMatch;
    return { mediaType, data };
  }

  const bareBase64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!bareBase64Pattern.test(trimmed)) {
    throw new Error('Invalid image format');
  }

  return { mediaType: 'image/jpeg', data: trimmed };
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

function getUsageKey(identifier: string): string {
  const dateKey = new Date().toISOString().slice(0, 10);
  return `${dateKey}:${identifier}`;
}

function getUsagePolicy(isMember: boolean, isPremium: boolean): UsagePolicy {
  if (isMember && isPremium) {
    return { dailyLimit: Number.POSITIVE_INFINITY, isPremium: true, isMember: true };
  }

  if (isMember) {
    return { dailyLimit: 5, isPremium: false, isMember: true };
  }

  return { dailyLimit: 2, isPremium: false, isMember: false };
}

function enforceUsageLimit(identifier: string, policy: UsagePolicy): number {
  const key = getUsageKey(identifier);
  const currentUsage = usageStore.get(key) ?? 0;

  if (currentUsage >= policy.dailyLimit) {
    throw new Error('USAGE_LIMIT_EXCEEDED');
  }

  const nextUsage = currentUsage + 1;
  usageStore.set(key, nextUsage);

  return nextUsage;
}

async function getMemberContext(firebaseUid: string): Promise<{
  isMember: boolean;
  isPremium: boolean;
  petProfile: PetProfile | null;
  recentRecord: string | null;
}> {
  const supabase = getSupabaseServerClient();

  const userResult = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (userResult.error || !userResult.data) {
    return { isMember: false, isPremium: false, petProfile: null, recentRecord: null };
  }

  const appUserId = userResult.data.id;

  const [petResult, membershipResult] = await Promise.all([
    supabase
      .from('pets')
      .select('id, name, breed, birthday, weight')
      .eq('user_id', appUserId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('users').select('is_premium').eq('id', appUserId).maybeSingle()
  ]);

  const isPremium = Boolean((membershipResult.data as { is_premium?: boolean } | null)?.is_premium);

  if (petResult.error || !petResult.data) {
    return { isMember: true, isPremium, petProfile: null, recentRecord: null };
  }

  const petProfile: PetProfile = {
    id: petResult.data.id,
    name: petResult.data.name,
    breed: petResult.data.breed,
    age: calculateAgeInYears(petResult.data.birthday),
    weight: petResult.data.weight
  };

  const recentRecordResult = await supabase
    .from('health_records')
    .select('visit_date, memo, total_amount')
    .eq('pet_id', petProfile.id)
    .eq('is_deleted', false)
    .order('visit_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  const recentRecord = recentRecordResult.data
    ? `방문일 ${recentRecordResult.data.visit_date}, 메모 ${recentRecordResult.data.memo ?? '없음'}, 진료비 ${recentRecordResult.data.total_amount}원`
    : null;

  return {
    isMember: true,
    isPremium,
    petProfile,
    recentRecord
  };
}

async function streamClaudeDialogue(params: {
  imageData: string;
  mediaType: string;
  isMember: boolean;
  petProfile: PetProfile | null;
  recentRecord: string | null;
}): Promise<string> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error('Missing Anthropic API key');
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: Anthropic } = require('@anthropic-ai/sdk') as {
    default: new (options: { apiKey: string }) => AnthropicClient;
  };

  const anthropic = new Anthropic({ apiKey: anthropicApiKey });

  const profileText =
    params.isMember && params.petProfile
      ? `\n이 아이 정보: 이름=${params.petProfile.name}, 품종=${params.petProfile.breed ?? '알 수 없음'}, 나이=${params.petProfile.age ?? '알 수 없음'}세, 체중=${params.petProfile.weight ?? '알 수 없음'}kg\n최근 진료: ${params.recentRecord ?? '기록 없음'}`
      : '';

  const userPrompt = `[이미지 첨부]${profileText}\n이 아이가 지금 무슨 생각을 하고 있을지 1인칭으로 말해줘.`;

  const stream = await anthropic.messages.create({
    model: params.isMember ? MEMBER_MODEL : GUEST_MODEL,
    max_tokens: 220,
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
            text: userPrompt
          }
        ]
      }
    ]
  });

  let dialogue = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      dialogue += event.delta.text;
    }
  }

  return dialogue.trim();
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PetTalkerRequestBody;
    const imageBase64 = body.imageBase64;

    if (!imageBase64) {
      return NextResponse.json({ error: '이미지(base64)가 필요합니다.' }, { status: 400 });
    }

    let image: { mediaType: string; data: string };
    try {
      image = parseBase64Image(imageBase64);
    } catch {
      return NextResponse.json({ error: '이미지 형식이 올바르지 않습니다.' }, { status: 400 });
    }

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

    const memberContext = firebaseUid
      ? await getMemberContext(firebaseUid)
      : { isMember: false, isPremium: false, petProfile: null, recentRecord: null };

    const usagePolicy = getUsagePolicy(memberContext.isMember, memberContext.isPremium);
    const usageIdentifier = memberContext.isMember ? `user:${firebaseUid}` : `ip:${getClientIp(request)}`;

    let usageCount = 0;
    try {
      usageCount = enforceUsageLimit(usageIdentifier, usagePolicy);
    } catch (error) {
      if (error instanceof Error && error.message === 'USAGE_LIMIT_EXCEEDED') {
        return NextResponse.json({ error: '일일 사용량을 초과했습니다.' }, { status: 429 });
      }
      throw error;
    }

    const dialogue = await streamClaudeDialogue({
      imageData: image.data,
      mediaType: image.mediaType,
      isMember: memberContext.isMember,
      petProfile: memberContext.petProfile,
      recentRecord: memberContext.recentRecord
    });

    if (!dialogue) {
      return NextResponse.json({ error: '대사 생성에 실패했습니다.' }, { status: 502 });
    }

    const characterLevel = memberContext.isPremium ? 10 : Math.min(memberContext.isMember ? 8 : 5, usageCount + 1);

    return NextResponse.json({ dialogue, characterLevel });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: `펫토커 처리 중 오류가 발생했습니다: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ error: '펫토커 처리 중 알 수 없는 오류가 발생했습니다.' }, { status: 500 });
  }
}
