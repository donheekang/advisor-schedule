import { auth, firebaseConfigStatus } from '@/lib/firebase';
import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';

export type SignInResult = {
  user: User;
  token: string;
};

function getClientAuth() {
  if (!auth) {
    if (firebaseConfigStatus.missingFirebaseConfigKeys.length > 0) {
      throw new Error(
        `Missing Firebase env: ${firebaseConfigStatus.missingFirebaseConfigKeys.join(', ')}`
      );
    }

    throw new Error('Firebase auth is only available in the browser.');
  }

  return auth;
}

export async function signIn(): Promise<SignInResult> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(getClientAuth(), provider);
  const token = await credential.user.getIdToken();

  return {
    user: credential.user,
    token
  };
}

export async function signOut(): Promise<void> {
  await getClientAuth().signOut();
}
