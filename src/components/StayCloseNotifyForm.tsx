import { useState, type FormEvent } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';

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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const supabase = createBrowserSupabaseClient();
      const normalizedEmail = trimmed.toLowerCase();
      const { error } = await supabase.from('newsletter_signups').insert({
        email: normalizedEmail,
        source: 'about_stay_close',
      });

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          return;
        }
        throw error;
      }

      setStatus('success');
      setEmail('');
    } catch {
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
          <a href={emailLink.href}>{emailLink.text}</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            if (status === 'error') setStatus('idle');
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
          {errorMessage}
        </p>
      ) : null}
      <div className="signoff">
        <a href={emailLink.href}>{emailLink.text}</a>
      </div>
    </>
  );
}
