import { AuthForm } from '@/components/AuthForm';
import { authLinkClassName, AuthPageShell } from '@/components/auth/AuthPageShell';
import { useAuth } from '@/context/AuthContext';

export function SignupPage() {
  const { status, user, signUp } = useAuth();

  if (status === 'misconfigured') {
    return (
      <AuthPageShell>
        <p className="max-w-md text-center font-sans text-sm text-cream/70">
          Account creation is not configured yet. Add your Supabase URL and anon key to the environment.
        </p>
      </AuthPageShell>
    );
  }

  if (status === 'ready' && user) {
    window.location.replace('/account');
    return null;
  }

  return (
    <AuthPageShell>
      <AuthForm
        title="Create your account"
        description="Register now so you are ready when additional member content opens."
        submitLabel="Create account"
        passwordAutoComplete="new-password"
        alternateAction={
          <>
            Already have an account?{' '}
            <a href="/login" className={authLinkClassName}>
              Sign in
            </a>
          </>
        }
        onSubmit={async (credentials) => {
          const result = await signUp(credentials);
          if (result.errorMessage) {
            return { errorMessage: result.errorMessage };
          }

          if (result.needsEmailConfirmation) {
            return {
              successMessage:
                'Check your email for a confirmation link, then return here to sign in.',
            };
          }

          window.location.replace('/account');
          return {};
        }}
      />
    </AuthPageShell>
  );
}
