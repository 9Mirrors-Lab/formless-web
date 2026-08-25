import { useState, type FormEvent } from 'react';
import { SignupNameFields } from '@/components/SignupNameFields';
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SignupNameFields
          idPrefix="stay-close"
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={(value) => {
            setFirstName(value);
            clearError();
          }}
          onLastNameChange={(value) => {
            setLastName(value);
            clearError();
          }}
          disabled={status === 'submitting'}
          inputClassName=""
          wrapperClassName="stay-name-fields"
        />
        <label htmlFor="stay-close-email" className="sr-only">
          Email address
        </label>
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
          disabled={status === 'submitting'}
          required
        />
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : submitLabel}
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
    </>
  );
}
