import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (Object.values(firebaseConfig).some((value) => !value)) {
  throw new Error('Missing Firebase environment variables');
}

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
