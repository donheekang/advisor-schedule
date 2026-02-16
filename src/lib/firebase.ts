import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ''
};

const requiredConfigEntries: Array<[keyof typeof firebaseConfig, string]> = [
  ['apiKey', 'NEXT_PUBLIC_FIREBASE_API_KEY'],
  ['authDomain', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  ['appId', 'NEXT_PUBLIC_FIREBASE_APP_ID']
];

const missingFirebaseConfigKeys = requiredConfigEntries
  .filter(([key]) => firebaseConfig[key].length === 0)
  .map(([, envName]) => envName);

const hasFirebaseConfig = missingFirebaseConfigKeys.length === 0;

const app: FirebaseApp | null =
  hasFirebaseConfig && typeof window !== 'undefined'
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0] ?? null
    : null;

const auth: Auth | null = app ? getAuth(app) : null;

const firebaseConfigStatus = {
  hasFirebaseConfig,
  missingFirebaseConfigKeys
} as const;

export { app, auth, firebaseConfigStatus };
