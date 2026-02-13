import { auth } from '@/lib/firebase';
import { User, GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from 'firebase/auth';

export type SignInParams =
  | { provider: 'google' }
  | {
      provider: 'kakao';
      customToken: string;
    };

export async function signIn(params: SignInParams): Promise<User> {
  if (params.provider === 'google') {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    return credential.user;
  }

  const credential = await signInWithCustomToken(auth, params.customToken);
  return credential.user;
}

export async function signOut(): Promise<void> {
  await auth.signOut();
}

export async function getIdToken(user: User): Promise<string> {
  return user.getIdToken();
}
