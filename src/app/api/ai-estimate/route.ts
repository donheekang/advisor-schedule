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
      '## 진료비 참고 기준 (2024-2025 전국 공시 데이터 기반)\n\n' +
      '### 진찰료\n' +
      '- 초진 진찰료: 8,000~15,000원 (중간값 10,000원)\n' +
      '- 재진 진찰료: 5,000~10,000원 (중간값 7,000원)\n' +
      '- 상담료: 5,000~15,000원\n\n' +
      '### 입원비 (1일당)\n' +
      '- 소형견(5kg): 30,000~50,000원 (중간값 45,000원)\n' +
      '- 중형견(10kg): 35,000~60,000원\n' +
      '- 대형견(20kg): 40,000~70,000원\n' +
      '- 고양이: 30,000~50,000원\n\n' +
      '### 예방접종\n' +
      '- 종합백신(개): 20,000~30,000원 (중간값 25,000원)\n' +
      '- 종합백신(고양이): 20,000~30,000원\n' +
      '- 광견병백신: 15,000~25,000원\n' +
      '- 켄넬코프백신: 15,000~25,000원\n' +
      '- 인플루엔자백신: 20,000~30,000원\n' +
      '- 심장사상충 예방(월1회): 10,000~20,000원\n\n' +
      '### 혈액검사\n' +
      '- 전혈구검사(CBC): 25,000~40,000원 (중간값 33,000원)\n' +
      '- 혈액화학검사: 40,000~80,000원\n' +
      '- 전해질검사: 15,000~30,000원\n' +
      '- 호르몬검사: 30,000~60,000원\n\n' +
      '### 영상검사\n' +
      '- 엑스레이(1부위): 30,000~50,000원 (중간값 40,000원)\n' +
      '- 복부초음파: 40,000~80,000원\n' +
      '- CT촬영: 300,000~700,000원\n' +
      '- MRI촬영: 500,000~1,000,000원\n\n' +
      '### 투약/조제\n' +
      '- 내복약(1일분): 3,000~10,000원\n' +
      '- 주사(피하/근육): 10,000~30,000원\n' +
      '- 수액처치: 20,000~50,000원\n' +
      '- 외용약/연고: 5,000~15,000원\n\n' +
      '### 수술 (마취비 별도)\n' +
      '- 중성화(소형견): 150,000~300,000원\n' +
      '- 중성화(대형견): 250,000~500,000원\n' +
      '- 슬개골탈구(1~2기): 800,000~1,500,000원\n' +
      '- 슬개골탈구(3~4기): 1,500,000~2,500,000원\n' +
      '- 십자인대: 1,500,000~3,500,000원\n' +
      '- 치석제거(스케일링): 100,000~250,000원\n' +
      '- 발치(1개): 30,000~100,000원\n' +
      '- 종양제거: 200,000~1,000,000원\n' +
      '- 전신마취비: 50,000~150,000원\n\n' +
      '### 기타 처치\n' +
      '- 귀세정: 10,000~20,000원\n' +
      '- 피부스크래핑검사: 10,000~20,000원\n' +
      '- 분변검사: 10,000~20,000원\n' +
      '- 소변검사: 10,000~25,000원\n' +
      '- 상처소독/드레싱: 10,000~30,000원\n\n' +
      '## 중요 규칙\n' +
      '1. 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.\n' +
      '2. 가능성 높은 질환을 1~3개 제시하세요.\n' +
      '3. 각 질환별 예상 진료 항목과 비용 범위(원)를 위 가격 기준표를 참고하여 제시하세요.\n' +
      '4. totalMin은 items의 minPrice 합, totalMax는 items의 maxPrice 합이어야 합니다.\n' +
      '5. recommendation에는 보호자가 바로 할 수 있는 조치를 포함하세요.\n' +
      '6. 반려동물의 체중/크기에 따라 가격이 달라질 수 있음을 고려하세요.\n' +
      '7. 위 가격 기준표에 없는 항목은 유사 항목을 참고하여 합리적으로 추정하세요.\n\n' +
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
        model: 'claude-haiku-4-5-20251001',
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
