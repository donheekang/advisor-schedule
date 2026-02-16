import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { petType, breed, age, weight, symptoms } = await req.json();

    if (!symptoms || !symptoms.trim()) {
      return NextResponse.json({ error: '증상을 입력해주세요' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt =
      '당신은 대한민국의 수의 진료비 전문가 AI입니다. 반려동물 보호자가 증상을 설명하면, 가능성 높은 질환과 예상 진료비를 분석해주세요.\n\n' +
      '중요 규칙:\n' +
      '1. 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.\n' +
      '2. 가능성 높은 질환을 1~3개 제시하세요.\n' +
      '3. 각 질환별 예상 진료 항목과 비용 범위(원)를 한국 동물병원 2024-2025 평균 기준으로 제시하세요.\n' +
      '4. totalMin은 items의 minPrice 합, totalMax는 items의 maxPrice 합이어야 합니다.\n' +
      '5. recommendation에는 보호자가 바로 할 수 있는 조치를 포함하세요.\n\n' +
      'JSON 형식:\n' +
      '{\n' +
      '  "conditions": [\n' +
      '    {\n' +
      '      "name": "질환명",\n' +
      '      "probability": "높음 또는 보통 또는 낮음",\n' +
      '      "description": "질환 설명 2~3문장",\n' +
      '      "items": [\n' +
      '        { "name": "진료항목명", "minPrice": 숫자, "maxPrice": 숫자 }\n' +
      '      ],\n' +
      '      "totalMin": 숫자,\n' +
      '      "totalMax": 숫자\n' +
      '    }\n' +
      '  ],\n' +
      '  "recommendation": "수의사 추천사항 3~4문장"\n' +
      '}';

    const petTypeKo = petType === 'dog' ? '강아지' : '고양이';
    const userMessage =
      '반려동물 정보:\n' +
      '- 종류: ' +
      petTypeKo +
      '\n' +
      '- 품종: ' +
      (breed || '미입력') +
      '\n' +
      '- 나이: ' +
      (age ? age + '살' : '미입력') +
      '\n' +
      '- 체중: ' +
      (weight ? weight + 'kg' : '미입력') +
      '\n\n' +
      '증상:\n' +
      symptoms;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return NextResponse.json({ error: 'AI 분석 중 오류가 발생했습니다' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI estimate error:', error);
    return NextResponse.json({ error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
