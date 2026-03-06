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
  const provider = new OAuthProvider('oidc.kakao');
  return signInWithPopup(getClientAuth(), provider);
}

export async function signOutUser() {
  return firebaseSignOut(getClientAuth());
}
