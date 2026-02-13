import { auth } from '@/lib/firebase';
import { User, GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

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

function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase admin environment variables');
  }

  let adminAppModule: {
    cert: (value: { projectId: string; clientEmail: string; privateKey: string }) => unknown;
    getApps: () => unknown[];
    initializeApp: (options: { credential: unknown }) => unknown;
  };
  let adminAuthModule: { getAuth: () => { verifyIdToken: (token: string) => Promise<{ uid: string }> } };

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    adminAppModule = require('firebase-admin/app');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    adminAuthModule = require('firebase-admin/auth');
  } catch {
    throw new Error('firebase-admin package is required for server token verification');
  }

  if (adminAppModule.getApps().length === 0) {
    adminAppModule.initializeApp({
      credential: adminAppModule.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
  }

  return adminAuthModule.getAuth();
}

export async function verifyBearerToken(authorizationHeader?: string): Promise<{ uid: string }> {
  const [scheme, token] = authorizationHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    throw new Error('Unauthorized');
  }

  const adminAuth = getFirebaseAdminAuth();
  return adminAuth.verifyIdToken(token);
}

type AuthenticatedHandler = (
  request: NextRequest,
  authContext: { userId: string }
) => Promise<Response> | Response;

export function withAuth(handler: AuthenticatedHandler) {
  return async function authenticatedRoute(request: NextRequest): Promise<Response> {
    const authorizationHeader = request.headers.get('authorization') ?? undefined;

    try {
      const decodedToken = await verifyBearerToken(authorizationHeader);
      return handler(request, { userId: decodedToken.uid });
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
