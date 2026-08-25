import { useState, type FormEvent, type ReactNode } from 'react';
import { validateSignupNames } from '@/lib/auth';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import {
  captureCtaClick,
  captureSignupFailed,
  captureSignupStarted,
  captureSignupSucceeded,
} from '@/lib/analytics';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type StayCloseNotifyFormProps = {
  emailPlaceholder: string;
  submitLabel: string;
  finePrint: string;
  successTitle: string;
  errorMessage: string;
  emailLink: { href: string; text: string };
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function StayField({
  id,
  label,
  children,
  className = '',
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`stay-field ${className}`.trim()}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
    </div>
  );
}

export function StayCloseNotifyForm({
  emailPlaceholder,
  submitLabel,
  finePrint,
  successTitle,
  errorMessage,
  emailLink,
}: StayCloseNotifyFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  function clearError() {
    if (status === 'error') {
      setStatus('idle');
      setFormError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmed = email.trim();
    captureSignupStarted('about_stay_close', 'about_stay_close_form');

    const nameError = validateSignupNames(trimmedFirstName, trimmedLastName);
    if (nameError) {
      captureSignupFailed('about_stay_close', 'about_stay_close_form', 'invalid_name');
      setFormError(nameError);
      setStatus('error');
      return;
    }

    if (!isValidEmail(trimmed)) {
      captureSignupFailed('about_stay_close', 'about_stay_close_form', 'invalid_email');
      setFormError(errorMessage);
      setStatus('error');
      return;
    }

    setFormError(null);
    setStatus('submitting');

    try {
      const supabase = createBrowserSupabaseClient();
      const normalizedEmail = trimmed.toLowerCase();
      const { error } = await supabase.from('newsletter_signups').insert({
        email: normalizedEmail,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        source: 'about_stay_close',
      });

      if (error) {
        if (error.code === '23505') {
          captureSignupSucceeded('about_stay_close', 'about_stay_close_form');
          setStatus('success');
          return;
        }
        throw error;
      }

      captureSignupSucceeded('about_stay_close', 'about_stay_close_form');
      setStatus('success');
      setEmail('');
      setFirstName('');
      setLastName('');
    } catch {
      captureSignupFailed('about_stay_close', 'about_stay_close_form', 'server_error');
      setFormError(errorMessage);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="stay-success" role="status" aria-live="polite">
        <div className="stay-success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="stay-success-title">{successTitle}</p>
        <p className="fine">{finePrint}</p>
        <div className="signoff">
          <a
            href={emailLink.href}
            onClick={() => captureCtaClick(emailLink.text, emailLink.href, 'about_stay_close_email')}
          >
            {emailLink.text}
          </a>
        </div>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <div className="stay-form-wrap">
      <form onSubmit={handleSubmit} className="stay-form" noValidate>
        <div className="stay-name-row">
          <StayField id="stay-close-first-name" label="First name">
            <input
              id="stay-close-first-name"
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                clearError();
              }}
              placeholder="First name"
              disabled={submitting}
              required
            />
          </StayField>

          <StayField id="stay-close-last-name" label="Last name">
            <input
              id="stay-close-last-name"
              type="text"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                clearError();
              }}
              placeholder="Last name"
              disabled={submitting}
              required
            />
          </StayField>
        </div>

        <StayField id="stay-close-email" label="Email">
          <input
            id="stay-close-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
            }}
            placeholder={emailPlaceholder}
            disabled={submitting}
            required
          />
        </StayField>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : submitLabel}
        </button>
      </form>

      <p className="fine">{finePrint}</p>
      {status === 'error' ? (
        <p className="stay-error" role="alert">
          {formError ?? errorMessage}
        </p>
      ) : null}
      <div className="signoff">
        <a
          href={emailLink.href}
          onClick={() => captureCtaClick(emailLink.text, emailLink.href, 'about_stay_close_email')}
        >
          {emailLink.text}
        </a>
      </div>
    </div>
  );
}
