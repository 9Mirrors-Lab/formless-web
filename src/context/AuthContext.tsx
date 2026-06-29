/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import {
  getAuthErrorMessage,
  signInWithGoogle,
  signInWithPassword,
  signOut as authSignOut,
  signUpWithPassword,
  type AuthCredentials,
} from '@/lib/auth';
import { getBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

type AuthStatus = 'loading' | 'ready' | 'misconfigured';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  signIn: (credentials: AuthCredentials) => Promise<{ errorMessage?: string }>;
  signUp: (credentials: AuthCredentials) => Promise<{
    errorMessage?: string;
    needsEmailConfirmation?: boolean;
  }>;
  signInWithGoogle: () => Promise<{ errorMessage?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      setStatus('misconfigured');
      return;
    }

    const supabase = getBrowserSupabaseClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setStatus('ready');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus('ready');
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    const { error } = await signInWithPassword(credentials);
    if (error) {
      return { errorMessage: getAuthErrorMessage(error) };
    }
    return {};
  }, []);

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    const { data, error } = await signUpWithPassword(credentials);
    if (error) {
      return { errorMessage: getAuthErrorMessage(error) };
    }

    const needsEmailConfirmation = Boolean(data.user) && !data.session;
    return { needsEmailConfirmation };
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, []);

  const signInWithGoogleAuth = useCallback(async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      return { errorMessage: getAuthErrorMessage(error) };
    }
    return {};
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      session,
      signIn,
      signUp,
      signInWithGoogle: signInWithGoogleAuth,
      signOut,
    }),
    [session, signIn, signUp, signInWithGoogleAuth, signOut, status],
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

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}
