import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthResponse, LoginInput, PublicUser, RegisterInput } from '@sahakar/shared';
import { api, setAccessToken, setRefreshHandler } from './api';

interface AuthState {
  user: PublicUser | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<AuthState['status']>('loading');
  const refreshing = useRef<Promise<boolean> | null>(null);

  const applySession = useCallback(
    (res: AuthResponse) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      setStatus('authenticated');
      // Follow the account's saved language unless the user already picked one this visit.
      if (res.user.preferredLanguage && res.user.preferredLanguage !== i18n.resolvedLanguage) {
        void i18n.changeLanguage(res.user.preferredLanguage);
      }
    },
    [i18n],
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  // Silent refresh using the httpOnly cookie. De-duplicated across concurrent 401s.
  const doRefresh = useCallback(async (): Promise<boolean> => {
    if (refreshing.current) return refreshing.current;
    refreshing.current = (async () => {
      try {
        const res = await api<AuthResponse>('/auth/refresh', { method: 'POST', auth: false });
        applySession(res);
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshing.current = null;
      }
    })();
    return refreshing.current;
  }, [applySession, clearSession]);

  useEffect(() => {
    setRefreshHandler(doRefresh);
    void doRefresh().then((ok) => {
      if (!ok) setStatus('anonymous');
    });
    return () => setRefreshHandler(null);
  }, [doRefresh]);

  const login = useCallback(
    async (input: LoginInput) => {
      const res = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: input,
        auth: false,
      });
      applySession(res);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: input,
        auth: false,
      });
      applySession(res);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api<void>('/auth/logout', { method: 'POST', auth: false });
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthState>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
