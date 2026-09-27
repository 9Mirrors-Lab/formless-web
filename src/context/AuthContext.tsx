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

import { isInternalAccessEmail } from '@/config/internalAccess';
import {
  ACCESS_LIMITED_MESSAGE,
  getAuthErrorMessage,
  SIGNUP_CLOSED_MESSAGE,
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

function sessionIsAllowlisted(session: Session | null): boolean {
  return isInternalAccessEmail(session?.user?.email);
}

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

    async function acceptOrRejectSession(next: Session | null): Promise<Session | null> {
      if (!next) return null;
      if (sessionIsAllowlisted(next)) return next;
      await supabase.auth.signOut();
      return null;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const allowed = await acceptOrRejectSession(data.session);
      if (!active) return;
      setSession(allowed);
      setStatus('ready');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Avoid feedback loops from our own signOut of rejected sessions.
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setStatus('ready');
        return;
      }

      void (async () => {
        const allowed = await acceptOrRejectSession(nextSession);
        if (!active) return;
        setSession(allowed);
        setStatus('ready');
      })();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    const { data, error } = await signInWithPassword(credentials);
    if (error) {
      return { errorMessage: getAuthErrorMessage(error) };
    }

    if (!sessionIsAllowlisted(data.session)) {
      await authSignOut();
      return { errorMessage: ACCESS_LIMITED_MESSAGE };
    }

    return {};
  }, []);

  const signUp = useCallback(async (_credentials: AuthCredentials) => {
    const { error } = await signUpWithPassword(_credentials);
    return {
      errorMessage: error ? getAuthErrorMessage(error) : SIGNUP_CLOSED_MESSAGE,
    };
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
