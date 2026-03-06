export type RecommendedIngredient = {
  name: string;
  points: number;
  reason: string;
};

type IngredientRule = {
  points: number;
  reason: string;
};

const TAG_INGREDIENT_RULES: Record<string, Record<string, IngredientRule>> = {
  dental_scaling: {
    덴탈껌: { points: 3, reason: '치석 재형성을 늦추고 매일 구강 자극을 주는 데 도움을 줘요.' },
    구강겔: { points: 2, reason: '칫솔 거부가 있는 아이도 잇몸 케어를 쉽게 시작할 수 있어요.' },
    핑거칫솔: { points: 1, reason: '양치 루틴 적응에 유리해서 장기 구강 관리에 좋아요.' },
    치태파우더: { points: 2, reason: '사료에 섞어 치태와 구취 관리 루틴을 만들기 좋아요.' }
  },
  dental_extraction: {
    구강겔: { points: 3, reason: '발치 후 민감한 잇몸 케어를 부드럽게 이어갈 수 있어요.' },
    덴탈껌: { points: 2, reason: '회복 이후 치아 관리 루틴 재정착에 유용해요.' },
    핑거칫솔: { points: 2, reason: '자극을 줄이며 단계적으로 양치를 재개할 수 있어요.' }
  },
  medicine_skin: {
    오메가3: { points: 3, reason: '피부 장벽과 피모 컨디션 유지에 자주 활용되는 영양 성분이에요.' },
    비오틴: { points: 2, reason: '피부와 털 건강 유지에 도움을 줄 수 있어요.' },
    저자극샴푸: { points: 2, reason: '외부 자극을 줄여 피부 관리 기본 루틴을 만들어요.' },
    세라마이드: { points: 2, reason: '피부 보습과 장벽 보완에 도움을 줄 수 있어요.' }
  },
  medicine_allergy: {
    오메가3: { points: 2, reason: '가려움 관리 루틴에서 자주 병행되는 성분이에요.' },
    세라마이드: { points: 2, reason: '피부 방어막 관리에 도움을 줄 수 있어요.' },
    프로바이오틱스: { points: 1, reason: '장 컨디션과 면역 균형 관리에 보조적으로 사용돼요.' }
  },
  ortho_patella: {
    '관절영양제(글루코사민)': { points: 3, reason: '슬개골 부담이 있는 아이의 관절 관리 기본 성분이에요.' },
    미끄럼방지매트: { points: 2, reason: '실내 미끄럼을 줄여 무릎 부담 완화에 실질적으로 도움 돼요.' },
    콘드로이틴: { points: 2, reason: '관절 연골 컨디션 유지에 함께 고려되는 성분이에요.' }
  },
  ortho_arthritis: {
    '관절영양제(글루코사민)': { points: 3, reason: '관절 사용량이 많은 아이의 일상 보조에 도움이 돼요.' },
    콘드로이틴: { points: 2, reason: '관절 유연성 관리 루틴에서 자주 같이 고려돼요.' },
    MSM: { points: 1, reason: '관절 케어 보조 성분으로 활용되는 경우가 많아요.' }
  },
  medicine_gi: {
    프로바이오틱스: { points: 3, reason: '장내 균형을 유지하고 배변 컨디션 관리에 도움을 줄 수 있어요.' },
    소화효소: { points: 2, reason: '소화 부담이 잦은 아이의 식후 관리에 보조적으로 좋아요.' },
    프리바이오틱스: { points: 1, reason: '유익균 환경을 돕는 성분으로 함께 고려돼요.' }
  },
  medicine_eye: {
    루테인: { points: 2, reason: '눈 건강 관리 루틴에서 많이 활용되는 대표 성분이에요.' },
    아스타잔틴: { points: 1, reason: '눈 피로 관리에 보조적으로 고려할 수 있어요.' },
    오메가3: { points: 1, reason: '눈물막 건강 관리에 도움을 줄 수 있어요.' }
  },
  medicine_ear: {
    오메가3: { points: 2, reason: '피부·귀 컨디션 케어 루틴에서 함께 활용돼요.' },
    저자극샴푸: { points: 1, reason: '귀 주변 피부 자극을 줄이는 기본 케어에 유용해요.' }
  },
  vaccine_comprehensive: {
    면역글루칸: { points: 2, reason: '예방 시기 컨디션 관리에 보조적으로 고려되는 성분이에요.' },
    비타민E: { points: 1, reason: '항산화 기반의 일상 면역 케어에 활용될 수 있어요.' }
  },
  vaccine_rabies: {
    비타민E: { points: 1, reason: '접종 시기 기초 컨디션 관리에 도움을 줄 수 있어요.' }
  },
  exam_blood_chem: {
    오메가3: { points: 1, reason: '전반적인 대사 컨디션 관리에 보조적으로 많이 활용돼요.' },
    코엔자임Q10: { points: 1, reason: '중장년 아이의 기초 에너지 관리 루틴에서 고려돼요.' }
  },
  exam_blood_general: {
    종합비타민: { points: 2, reason: '기본 영양 밸런스 보완이 필요할 때 고려하기 좋아요.' },
    비타민E: { points: 1, reason: '항산화 관리 루틴에 보조적으로 활용돼요.' }
  },
  exam_echo: {
    코엔자임Q10: { points: 2, reason: '심혈관 관련 일상 컨디션 관리 성분으로 고려돼요.' },
    오메가3: { points: 1, reason: '순환 건강 보조 목적으로 널리 사용돼요.' }
  },
  surgery_neutering: {
    프로바이오틱스: { points: 1, reason: '회복기 식사 루틴 안정화에 보조적으로 도움 될 수 있어요.' },
    종합비타민: { points: 1, reason: '회복기 기초 영양 밸런스 관리에 고려할 수 있어요.' }
  }
};

export function getRecommendedIngredients(tags: string[]): RecommendedIngredient[] {
  const aggregate = new Map<string, RecommendedIngredient>();

  tags.forEach((tag) => {
    const rules = TAG_INGREDIENT_RULES[tag];
    if (!rules) {
      return;
    }

    Object.entries(rules).forEach(([ingredientName, rule]) => {
      const current = aggregate.get(ingredientName);

      if (!current) {
        aggregate.set(ingredientName, {
          name: ingredientName,
          points: rule.points,
          reason: rule.reason
        });
        return;
      }

      aggregate.set(ingredientName, {
        ...current,
        points: current.points + rule.points
      });
    });
  });

  return [...aggregate.values()]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
}
