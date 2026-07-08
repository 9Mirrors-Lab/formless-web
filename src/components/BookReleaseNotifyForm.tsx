import { useState, type FormEvent, type ReactNode } from 'react';
import { BookOpen, Calendar, Send } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import {
  captureSignupFailed,
  captureSignupStarted,
  captureSignupSucceeded,
} from '@/lib/analytics';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type BookReleaseNotifyFormProps = {
  releaseDate?: string;
  subheadline?: string;
  ctaLabel?: string;
  metaRelease?: string;
  metaUpdates?: string;
  successTitle?: string;
  errorMessage?: string;
};

const DEFAULT_RELEASE_DATE = 'September 1';
const DEFAULT_SUBHEADLINE = 'Join the waitlist and be the first to know when the book is here.';
const DEFAULT_CTA = 'Notify me';
const DEFAULT_META_RELEASE = 'Releasing September 1';
const DEFAULT_META_UPDATES = 'Launch updates';
const DEFAULT_SUCCESS_TITLE = "You're on the list.";
const DEFAULT_ERROR = 'Enter a valid email, or try again in a moment.';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function MetaItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-clay/80" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}

function NotifyMetaRow({
  metaRelease,
  metaUpdates,
}: {
  metaRelease: string;
  metaUpdates: string;
}) {
  return (
    <div className="mt-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max flex-nowrap items-center justify-center gap-x-2 font-sans text-[10px] leading-none text-cream/45 sm:gap-x-2.5 sm:text-[11px]">
      <MetaItem icon={<Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />} label={metaRelease} />
      <span className="shrink-0 text-cream/20" aria-hidden="true">
        |
      </span>
      <MetaItem icon={<Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />} label={metaUpdates} />
      </div>
    </div>
  );
}

export function BookReleaseNotifyForm({
  releaseDate = DEFAULT_RELEASE_DATE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaLabel = DEFAULT_CTA,
  metaRelease = DEFAULT_META_RELEASE,
  metaUpdates = DEFAULT_META_UPDATES,
  successTitle = DEFAULT_SUCCESS_TITLE,
  errorMessage = DEFAULT_ERROR,
}: BookReleaseNotifyFormProps) {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const buttonLabel = ctaLabel.trim() || DEFAULT_CTA;
  const subheadCopy = subheadline.trim() || DEFAULT_SUBHEADLINE;
  const releaseDateLabel = releaseDate.trim() || DEFAULT_RELEASE_DATE;
  const resolvedMetaRelease = metaRelease.trim() || DEFAULT_META_RELEASE;
  const resolvedMetaUpdates = metaUpdates.trim() || DEFAULT_META_UPDATES;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    captureSignupStarted('book_page', 'book_release_form');

    if (!isValidEmail(trimmed)) {
      captureSignupFailed('book_page', 'book_release_form', 'invalid_email');
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
          captureSignupSucceeded('book_page', 'book_release_form');
          setSubmittedEmail(normalizedEmail);
          setStatus('success');
          return;
        }
        throw error;
      }

      captureSignupSucceeded('book_page', 'book_release_form');
      setSubmittedEmail(normalizedEmail);
      setStatus('success');
      setEmail('');
    } catch {
      captureSignupFailed('book_page', 'book_release_form', 'server_error');
      setStatus('error');
    }
  }

  const cardClassName =
    'rounded-2xl border border-cream/15 bg-cream/[0.06] p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)]';

  if (status === 'success') {
    return (
      <div className={cardClassName} role="status" aria-live="polite">
        <div className="mb-6 flex items-start gap-4">
          <div
            className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-clay/30 bg-clay/10 text-clay"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-[1.65rem] leading-[1.15] text-cream md:text-[1.85rem]">
              {successTitle}
            </h2>
            <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-cream/55 md:text-[15px]">
              We will notify <span className="text-cream/85">{submittedEmail}</span> when the book
              is available on {releaseDateLabel}, 2026.
            </p>
          </div>
        </div>

        <NotifyMetaRow
          metaRelease={resolvedMetaRelease}
          metaUpdates={resolvedMetaUpdates}
        />
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="relative mb-7 pl-14">
        <div
          className="absolute left-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-cream/[0.04] text-cream/70"
          aria-hidden="true"
        >
          <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        <h2 className="whitespace-nowrap font-serif text-[1.28rem] leading-tight text-cream sm:text-[1.42rem] md:text-[1.55rem]">
          The countdown to{' '}
          <span className="text-clay">{releaseDateLabel}</span>
          {'\u00A0'}is on.
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-cream/55 md:text-[15px]">
          {subheadCopy}
        </p>
      </div>

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
          className="w-full rounded-full border border-cream/15 bg-[#080a09]/70 px-6 py-4 font-sans text-sm text-cream placeholder:text-cream/30 transition-all duration-300 focus:border-cream/30 focus:bg-[#080a09] focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-full bg-clay px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream transition-colors duration-500 hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : buttonLabel}
        </button>
      </form>

      {status === 'error' ? (
        <p className="mt-3 font-sans text-sm text-clay/90" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <NotifyMetaRow
        metaRelease={resolvedMetaRelease}
        metaUpdates={resolvedMetaUpdates}
      />
    </div>
  );
}
