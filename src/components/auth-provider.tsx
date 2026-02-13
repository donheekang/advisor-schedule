'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signIn as firebaseSignIn, signOut as firebaseSignOut } from '@/lib/auth-client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
};

const TOKEN_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setToken(null);
        setLoading(false);
        return;
      }

      const nextToken = await nextUser.getIdToken();
      setToken(nextToken);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const refreshToken = async () => {
      const refreshedToken = await user.getIdToken(true);
      setToken(refreshedToken);
    };

    const timer = setInterval(() => {
      void refreshToken();
    }, TOKEN_REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      signIn: async () => {
        const result = await firebaseSignIn();
        setUser(result.user);
        setToken(result.token);
        return result.user;
      },
      signOut: async () => {
        await firebaseSignOut();
        setUser(null);
        setToken(null);
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
