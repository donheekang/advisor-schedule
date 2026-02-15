'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onIdTokenChanged } from 'firebase/auth';
import { signIn as firebaseSignIn, signOut as firebaseSignOut } from '@/lib/auth-client';
import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/api-client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
};

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

    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setToken(null);
        apiClient.setToken(null);
        setLoading(false);
        return;
      }

      const nextToken = await nextUser.getIdToken();
      setToken(nextToken);
      apiClient.setToken(nextToken);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      signIn: async () => {
        const result = await firebaseSignIn();
        setUser(result.user);
        setToken(result.token);
        apiClient.setToken(result.token);
        return result.user;
      },
      signOut: async () => {
        await firebaseSignOut();
        setUser(null);
        setToken(null);
        apiClient.setToken(null);
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
