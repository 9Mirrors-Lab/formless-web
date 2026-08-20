import { useEffect } from 'react';

import { AuthForm } from '@/components/AuthForm';
import { authLinkClassName, AuthPageShell } from '@/components/auth/AuthPageShell';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_POST_LOGIN_PATH, safeAuthNextPath, stashAuthNextPath } from '@/lib/auth';

function nextPathFromQuery(): string {
  return safeAuthNextPath(
    new URLSearchParams(window.location.search).get('next'),
    DEFAULT_POST_LOGIN_PATH,
  );
}

export function LoginPage() {
  const { status, user, signIn } = useAuth();
  const nextPath = nextPathFromQuery();

  useEffect(() => {
    stashAuthNextPath(nextPath);
  }, [nextPath]);

  if (status === 'misconfigured') {
    return (
      <AuthPageShell>
        <p className="max-w-md text-center font-sans text-sm text-cream/70">
          Sign-in is not configured yet. Add your Supabase URL and anon key to the environment.
        </p>
      </AuthPageShell>
    );
  }

  if (status === 'ready' && user) {
    window.location.replace(nextPath);
    return null;
  }

  return (
    <AuthPageShell>
      <AuthForm
        title="Welcome back"
        description="Sign in to open Brand Studio, the hub, and other internal materials."
        submitLabel="Sign in"
        alternateAction={
          <>
            New here?{' '}
            <a href="/signup" className={authLinkClassName}>
              Create an account
            </a>
          </>
        }
        onSubmit={async (credentials) => {
          const result = await signIn(credentials);
          if (result.errorMessage) {
            return result;
          }
          window.location.replace(nextPath);
          return {};
        }}
      />
    </AuthPageShell>
  );
}
