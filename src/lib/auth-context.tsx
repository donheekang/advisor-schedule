'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/api-client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  token: null,
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setUser(fbUser);
        setToken(idToken);
        apiClient.setToken(idToken);

        try {
          await apiClient.upsertUser();
        } catch (error) {
          console.warn('upsertUser failed:', error);
        }
      } else {
        setUser(null);
        setToken(null);
        apiClient.setToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading, token }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
