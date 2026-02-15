# AGENTS.md - PetHealthPlus Web

## 프로젝트 개요
반려동물 진료비 데이터 플랫폼. 앱(기존)에서 기록한 진료 데이터를 LLM이 분석하는 웹 서비스.
3층 퍼널: 펫토커(바이럴) → 진료비 검색(리텐션) → 앱 연동(수익화)

## 기술 스택
- Framework: Next.js 14+ (App Router)
- Style: Tailwind CSS
- DB: Supabase (PostgreSQL) - 기존 앱 DB 공유
- Auth: Firebase Auth (앱과 동일 계정)
- LLM: Claude API (Anthropic) - 한국어 성능 우수
- Deploy: Vercel

## 코딩 컨벤션
- TypeScript strict mode
- React Server Components 기본, 필요시 "use client"
- Tailwind CSS만 사용, 별도 CSS 파일 금지
- UI 텍스트는 한국어, 코드/주석은 영어
- 절대 경로 import (@/ prefix)
- 컴포넌트 PascalCase, 함수 camelCase, 파일 kebab-case

## 테스트
- npm run lint 에러 없어야 함
- npm run build 성공해야 함

## 주의사항
- LLM은 의료 판단 절대 금지. 가격 비교/정보 제공만 허용
- 민감한 API 키는 환경변수(.env.local)로 관리
- 한국어 SEO를 고려한 메타태그 필수
