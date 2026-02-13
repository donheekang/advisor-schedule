import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId: string;
  storageBucket: string;
};

const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''
};

const requiredConfigEntries: Array<[keyof FirebaseClientConfig, string]> = [
  ['apiKey', 'NEXT_PUBLIC_FIREBASE_API_KEY'],
  ['authDomain', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  ['appId', 'NEXT_PUBLIC_FIREBASE_APP_ID']
];

export const missingFirebaseConfigKeys = requiredConfigEntries
  .filter(([key]) => firebaseConfig[key].length === 0)
  .map(([, envName]) => envName);

const hasFirebaseConfig = missingFirebaseConfigKeys.length === 0;

const app: FirebaseApp | null =
  hasFirebaseConfig && typeof window !== 'undefined'
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0] ?? null
    : null;

export const auth: Auth | null = app ? getAuth(app) : null;

export const firebaseConfigStatus = {
  hasFirebaseConfig,
  missingFirebaseConfigKeys
} as const;
