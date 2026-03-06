import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
  signOut as firebaseSignOut
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

function getClientAuth() {
  if (!auth) {
    throw new Error('FIREBASE_AUTH_NOT_AVAILABLE');
  }

  return auth;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getClientAuth(), provider);
}

export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return signInWithPopup(getClientAuth(), provider);
}

/**
 * 카카오 로그인 — REST API 리다이렉트 방식
 * 1) 카카오 인가 페이지로 리다이렉트
 * 2) 인가코드 → 서버 → Firebase Custom Token
 * 3) signInWithCustomToken()으로 Firebase 로그인
 */
export function redirectToKakaoLogin() {
  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri = `${window.location.origin}/auth/kakao/callback`;

  const kakaoAuthUrl =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${kakaoClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code`;

  window.location.href = kakaoAuthUrl;
}

/**
 * 카카오 인가코드를 서버에 보내고 Firebase Custom Token으로 로그인
 */
export async function signInWithKakaoCode(code: string) {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pethealthplus.onrender.com';
  const redirectUri = `${window.location.origin}/auth/kakao/callback`;

  const response = await fetch(`${serverUrl}/auth/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '카카오 로그인에 실패했습니다.');
  }

  const data = await response.json();
  const firebaseToken = data.firebase_token || data.firebaseToken || data.custom_token;

  if (!firebaseToken) {
    throw new Error('서버에서 Firebase 토큰을 받지 못했습니다.');
  }

  return signInWithCustomToken(getClientAuth(), firebaseToken);
}

export async function signOutUser() {
  return firebaseSignOut(getClientAuth());
}
