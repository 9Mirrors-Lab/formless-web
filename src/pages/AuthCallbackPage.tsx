import { useEffect, useState } from 'react';

import { authLinkClassName } from '@/components/auth/AuthPageShell';
import {
  completeAuthCallback,
  getAuthErrorMessage,
  takeAuthNextPath,
} from '@/lib/auth';

type CallbackState = 'loading' | 'error';

export function AuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Completing sign in…');

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const { error } = await completeAuthCallback();
        if (!active) return;

        if (error) {
          setState('error');
          setMessage(getAuthErrorMessage(error));
          return;
        }

        window.location.replace(takeAuthNextPath('/account'));
      } catch (error) {
        if (!active) return;
        setState('error');
        setMessage(
          error instanceof Error ? error.message : getAuthErrorMessage(null),
        );
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#080a09] px-6 text-center">
      <div className="noise-overlay-dark" aria-hidden />
      <div className="relative max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/45">
          Member access
        </p>
        <h1 className="mt-3 font-serif text-4xl italic text-cream">
          {state === 'loading' ? 'Signing you in' : 'Could not sign in'}
        </h1>
        <p
          className="mt-4 font-sans text-sm leading-relaxed text-cream/65"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
        {state === 'error' ? (
          <a href="/login" className={`mt-8 inline-block ${authLinkClassName}`}>
            Return to sign in
          </a>
        ) : null}
      </div>
    </div>
  );
}
