import { authLinkClassName, AuthPagePanel, AuthPageShell } from '@/components/auth/AuthPageShell';
import { useAuth } from '@/context/AuthContext';

/**
 * Public account creation is closed. Existing allowlisted operators use /login.
 */
export function SignupPage() {
  const { status, user } = useAuth();

  if (status === 'ready' && user) {
    window.location.replace('/account');
    return null;
  }

  return (
    <AuthPageShell>
      <AuthPagePanel
        eyebrow="Member access"
        title="Account creation closed"
        description={
          <p>
            New accounts are not open right now. Approved Eyes Closed operators can{' '}
            <a href="/login" className={authLinkClassName}>
              sign in
            </a>
            .
          </p>
        }
      >
        <a
          href="/login"
          className="mt-10 inline-flex w-full items-center justify-center rounded-full border border-cream/15 bg-charcoal/60 px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:border-cream/30 hover:bg-charcoal/80"
        >
          Sign in
        </a>
        <a href="/" className={`mt-6 inline-block ${authLinkClassName}`}>
          Back to home
        </a>
      </AuthPagePanel>
    </AuthPageShell>
  );
}
