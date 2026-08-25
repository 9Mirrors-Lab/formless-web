import { useState, type FormEvent, type ReactNode } from 'react';

import { isValidEmail } from '@/lib/auth';

import { authPanelClassName } from '@/components/auth/AuthPageShell';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

type AuthFormTheme = 'light' | 'dark';

const themeStyles: Record<
  AuthFormTheme,
  {
    eyebrow: string;
    title: string;
    description: string;
    input: string;
    button: string;
    alternate: string;
    error: string;
    success: string;
  }
> = {
  light: {
    eyebrow: 'text-moss/70',
    title: 'text-charcoal',
    description: 'text-charcoal/65',
    input:
      'border-charcoal/15 bg-white text-charcoal placeholder:text-charcoal/35 focus:border-moss/50 focus:ring-moss/15',
    button: 'bg-charcoal text-cream',
    alternate: 'text-charcoal/65',
    error: 'border-clay/25 bg-clay/10 text-charcoal',
    success: 'border-moss/20 bg-moss/10 text-charcoal',
  },
  dark: {
    eyebrow: 'text-cream/45',
    title: 'text-cream',
    description: 'text-cream/65',
    input:
      'border-cream/15 bg-charcoal/60 text-cream placeholder:text-cream/35 focus:border-cream/30 focus:ring-cream/10',
    button: 'bg-clay text-cream hover:bg-[#b54d2d]',
    alternate: 'text-cream/60',
    error: 'border-clay/35 bg-clay/15 text-cream',
    success: 'border-moss/35 bg-moss/20 text-cream',
  },
};

const inputBaseClassName =
  'w-full rounded-full border px-5 py-3.5 font-sans text-sm outline-none transition-colors focus:ring-2';

const buttonBaseClassName =
  'w-full rounded-full px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60';

export type AuthFormValues = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  mode?: 'signin' | 'signup';
  theme?: AuthFormTheme;
  passwordAutoComplete?: 'current-password' | 'new-password';
  showGoogleAuth?: boolean;
  hideIntro?: boolean;
  googleNextPath?: string | null;
  alternateAction: ReactNode;
  onSubmit: (values: AuthFormValues) => Promise<{
    errorMessage?: string;
    successMessage?: string;
  }>;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  mode = 'signin',
  theme = 'dark',
  passwordAutoComplete = 'current-password',
  showGoogleAuth = true,
  hideIntro = false,
  googleNextPath,
  alternateAction,
  onSubmit,
}: AuthFormProps) {
  const styles = themeStyles[theme];
  const isSignup = mode === 'signup';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (isSignup) {
      if (!trimmedFirstName) {
        setErrorMessage('Enter your first name.');
        return;
      }

      if (!trimmedLastName) {
        setErrorMessage('Enter your last name.');
        return;
      }
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Use a password with at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit({
      email: trimmedEmail,
      password,
      ...(isSignup
        ? { firstName: trimmedFirstName, lastName: trimmedLastName }
        : {}),
    });
    setSubmitting(false);

    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      return;
    }

    if (result.successMessage) {
      setSuccessMessage(result.successMessage);
      setPassword('');
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {hideIntro ? null : (
        <div
          className={`mb-10 px-8 py-10 text-center ${
            theme === 'dark' ? authPanelClassName : ''
          }`}
        >
          <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.24em] ${styles.eyebrow}`}>
            Member access
          </p>
          <h1 className={`font-serif text-4xl italic ${styles.title}`}>{title}</h1>
          <p className={`mt-4 font-sans text-sm leading-relaxed ${styles.description}`}>{description}</p>
        </div>
      )}

      {showGoogleAuth ? (
        <div className="mb-6 space-y-4">
          <GoogleAuthButton disabled={submitting} nextPath={googleNextPath} />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-cream/10" aria-hidden />
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${styles.eyebrow}`}>
              or
            </span>
            <span className="h-px flex-1 bg-cream/10" aria-hidden />
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="auth-first-name" className="sr-only">
                First name
              </label>
              <input
                id="auth-first-name"
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="First name"
                disabled={submitting}
                required
                className={`${inputBaseClassName} ${styles.input}`}
              />
            </div>
            <div>
              <label htmlFor="auth-last-name" className="sr-only">
                Last name
              </label>
              <input
                id="auth-last-name"
                type="text"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Last name"
                disabled={submitting}
                required
                className={`${inputBaseClassName} ${styles.input}`}
              />
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="auth-email" className="sr-only">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Email address"
            disabled={submitting}
            required
            className={`${inputBaseClassName} ${styles.input}`}
          />
        </div>

        <div>
          <label htmlFor="auth-password" className="sr-only">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            name="password"
            autoComplete={passwordAutoComplete}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Password"
            disabled={submitting}
            required
            minLength={6}
            className={`${inputBaseClassName} ${styles.input}`}
          />
        </div>

        {errorMessage ? (
          <p className={`rounded-2xl border px-4 py-3 text-sm ${styles.error}`} role="alert">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className={`rounded-2xl border px-4 py-3 text-sm ${styles.success}`} role="status">
            {successMessage}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className={`${buttonBaseClassName} ${styles.button}`}>
          {submitting ? 'Please wait…' : submitLabel}
        </button>
      </form>

      <div className={`mt-8 text-center font-sans text-sm ${styles.alternate}`}>{alternateAction}</div>
    </div>
  );
}
