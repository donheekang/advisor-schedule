import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
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

export async function signInWithKakao() {
  // Kakao is not natively supported by Firebase Auth.
  // Option A: Use custom token flow (requires backend)
  // Option B: Use Firebase custom OAuth provider
  // For now, we'll show a "준비 중" message for Kakao
  // and implement Google + Apple first.
  throw new Error('KAKAO_NOT_READY');
}

export async function signOutUser() {
  return firebaseSignOut(getClientAuth());
}
