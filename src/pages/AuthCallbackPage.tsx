import { useEffect, useState } from 'react';

import { authLinkClassName, AuthPagePanel, AuthPageShell } from '@/components/auth/AuthPageShell';
import { completeAuthCallback, getAuthErrorMessage } from '@/lib/auth';

type CallbackState = 'loading' | 'error';

export function AuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Completing sign in…');

  useEffect(() => {
    let active = true;

    async function run() {
      const { error } = await completeAuthCallback();
      if (!active) return;

      if (error) {
        setState('error');
        setMessage(getAuthErrorMessage(error));
        return;
      }

      window.location.replace('/account');
    }

    void run();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthPageShell>
      <AuthPagePanel
        eyebrow="Member access"
        title={state === 'loading' ? 'Signing you in' : 'Could not sign in'}
        description={
          <p role="status" aria-live="polite">
            {message}
          </p>
        }
      >
        {state === 'error' ? (
          <a href="/login" className={`mt-8 inline-block ${authLinkClassName}`}>
            Return to sign in
          </a>
        ) : null}
      </AuthPagePanel>
    </AuthPageShell>
  );
}
