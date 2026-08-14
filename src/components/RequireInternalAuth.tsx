import type { ReactNode } from 'react';

import { InternalLoginModal } from '@/components/auth/InternalLoginModal';
import {
  authLinkClassName,
  AuthPagePanel,
  AuthPageShell,
} from '@/components/auth/AuthPageShell';
import {
  isInternalAccessEmail,
  isInternalAuthBypassEnabled,
} from '@/config/internalAccess';
import { useAuth } from '@/context/AuthContext';

type RequireInternalAuthProps = {
  children: ReactNode;
};

function InternalStatusScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#080a09] px-6 text-center">
      <div className="noise-overlay-dark" aria-hidden />
      <div className="relative max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/45">
          Member access
        </p>
        <h1 className="mt-3 font-serif text-4xl italic text-cream">{title}</h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-cream/65">{description}</p>
      </div>
    </div>
  );
}

function AuthBypassBanner() {
  return (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-[99998] rounded-md border border-amber-200/25 bg-[#121614]/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200/85 shadow-md"
      role="status"
    >
      Dev auth bypass
    </div>
  );
}

/**
 * Requires a signed-in Supabase user whose email is on the internal allowlist.
 * Unauthenticated visitors see a login modal instead of Brand Studio or its nav.
 *
 * Local testing can skip the gate when `isInternalAuthBypassEnabled()` is true
 * (Vite DEV + explicit env/query). Production builds never bypass.
 */
export function RequireInternalAuth({ children }: RequireInternalAuthProps) {
  const { status, user, signOut } = useAuth();
  const bypass = isInternalAuthBypassEnabled();

  if (bypass) {
    return (
      <>
        {children}
        <AuthBypassBanner />
      </>
    );
  }

  if (status === 'loading') {
    return (
      <InternalStatusScreen
        title="Loading"
        description="Checking your access…"
      />
    );
  }

  if (status === 'misconfigured') {
    return (
      <InternalStatusScreen
        title="Unavailable"
        description="Sign-in is not configured yet. Add your Supabase URL and anon key to the environment."
      />
    );
  }

  if (!user) {
    return <InternalLoginModal />;
  }

  if (!isInternalAccessEmail(user.email)) {
    return (
      <AuthPageShell>
        <AuthPagePanel
          eyebrow="Member access"
          title="Access limited"
          description={
            <>
              <p>
                This area is only available to approved Eyes Closed accounts.
              </p>
              <p className="mt-3 text-cream/55">
                You are signed in as{' '}
                <span className="font-medium text-cream">
                  {user.email ?? 'this account'}
                </span>
                .
              </p>
            </>
          }
        >
          <button
            type="button"
            className="mt-10 w-full rounded-full border border-cream/15 bg-charcoal/60 px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:border-cream/30 hover:bg-charcoal/80"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
          <a href="/" className={`mt-6 inline-block ${authLinkClassName}`}>
            Back to home
          </a>
        </AuthPagePanel>
      </AuthPageShell>
    );
  }

  return children;
}
