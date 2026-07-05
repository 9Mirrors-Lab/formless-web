import { AuthPagePanel, AuthPageShell } from '@/components/auth/AuthPageShell';
import { useAuth } from '@/context/AuthContext';

const signOutButtonClassName =
  'mt-10 w-full rounded-full border border-cream/15 bg-charcoal/60 px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:border-cream/30 hover:bg-charcoal/80';

export function AccountPage() {
  const { status, user, signOut } = useAuth();

  if (status === 'loading') {
    return (
      <AuthPageShell>
        <AuthPagePanel
          eyebrow="Member access"
          title="Loading"
          description="Loading your account…"
        />
      </AuthPageShell>
    );
  }

  if (status === 'misconfigured') {
    return (
      <AuthPageShell>
        <AuthPagePanel
          eyebrow="Member access"
          title="Unavailable"
          description="Account access is not configured yet. Add your Supabase URL and anon key to the environment."
        />
      </AuthPageShell>
    );
  }

  if (!user) {
    window.location.replace('/login');
    return null;
  }

  const email = user.email ?? 'your account';

  return (
    <AuthPageShell>
      <AuthPagePanel
        eyebrow="Signed in"
        title="Your account"
        description={
          <>
            <p>
              You are signed in as <span className="font-medium text-cream">{email}</span>.
            </p>
            <p className="mt-3 text-cream/55">
              Additional member content will appear here as it becomes available.
            </p>
          </>
        }
      >
        <button
          type="button"
          onClick={async () => {
            await signOut();
            window.location.replace('/');
          }}
          className={signOutButtonClassName}
        >
          Sign out
        </button>
      </AuthPagePanel>
    </AuthPageShell>
  );
}
