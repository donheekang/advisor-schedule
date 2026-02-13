import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
};

const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value.length > 0);

const fallbackFirebaseConfig: FirebaseClientConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project'
};

const appConfig = hasFirebaseConfig ? firebaseConfig : fallbackFirebaseConfig;

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(appConfig);

export const auth: Auth = getAuth(app);
