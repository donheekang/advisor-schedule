# PetHealthPlus Web

반려동물 진료비 데이터 플랫폼의 웹 서비스 저장소입니다.

## 기술 스택
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Firebase Auth
- Supabase

## 시작하기
1. 의존성 설치
   ```bash
   npm install
   ```
2. 환경변수 설정
   ```bash
   cp .env.local.example .env.local
   ```
   `.env.local`에 실제 키를 입력하세요.
3. 개발 서버 실행
   ```bash
   npm run dev
   ```
4. 품질 점검
   ```bash
   npm run lint
   npm run build
   ```

## 디렉터리 구조
```text
src/
  app/
    (main)/
      layout.tsx
      page.tsx
    api/
  components/
    ui/
  lib/
    firebase.ts
    supabase.ts
  types/
```

## 주의사항
- 의료 판단은 제공하지 않으며, 가격 비교/정보 제공 목적으로만 LLM을 사용합니다.
- 민감한 키는 반드시 `.env.local`로 관리하세요.
