import { useState, type FormEvent } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type BookReleaseNotifyFormProps = {
  intro: string;
  ctaLabel?: string;
  finePrint?: string;
  successTitle?: string;
  errorMessage?: string;
};

const DEFAULT_CTA = 'Notify me';
const DEFAULT_FINE_PRINT = 'One email on release day. Unsubscribe anytime.';
const DEFAULT_SUCCESS_TITLE = "You're on the list.";
const DEFAULT_ERROR = 'Enter a valid email, or try again in a moment.';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function BookReleaseNotifyForm({
  intro,
  ctaLabel = DEFAULT_CTA,
  finePrint = DEFAULT_FINE_PRINT,
  successTitle = DEFAULT_SUCCESS_TITLE,
  errorMessage = DEFAULT_ERROR,
}: BookReleaseNotifyFormProps) {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const buttonLabel = ctaLabel.trim() || DEFAULT_CTA;
  const introCopy = intro.trim() || 'Sign up to be notified when the book releases.';

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
      const { error } = await supabase.from('book_release_signups').insert({
        email: normalizedEmail,
        source: 'book_page',
      });

      if (error) {
        if (error.code === '23505') {
          setSubmittedEmail(normalizedEmail);
          setStatus('success');
          return;
        }
        throw error;
      }

      setSubmittedEmail(normalizedEmail);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl border border-cream/15 bg-cream/5 p-8 md:p-10"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-moss/20 text-moss mb-5">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-serif italic text-2xl text-cream/90 leading-snug mb-3">
          {successTitle}
        </p>
        <p className="font-sans text-base text-cream/60 leading-relaxed mb-2">
          We will notify <span className="text-cream/85">{submittedEmail}</span> on September 1, 2026.
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cream/35 uppercase mt-6">
          {finePrint}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cream/15 bg-cream/5 p-8 md:p-10">
      <p className="font-sans text-base md:text-lg text-cream/70 leading-relaxed mb-6">
        {introCopy}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="book-release-email" className="sr-only">
          Email address
        </label>
        <input
          id="book-release-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="Your email"
          disabled={status === 'submitting'}
          className="w-full px-6 py-4 rounded-full border border-cream/15 bg-[#080a09]/60 font-sans text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/30 focus:bg-[#080a09] transition-all duration-300 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-4 rounded-full bg-moss text-cream font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-moss/90 transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending…' : buttonLabel}
        </button>
      </form>

      <p className="font-mono text-[10px] tracking-[0.2em] text-cream/30 uppercase mt-4">
        {finePrint}
      </p>
      {status === 'error' ? (
        <p className="font-sans text-sm text-clay/80 mt-3" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
