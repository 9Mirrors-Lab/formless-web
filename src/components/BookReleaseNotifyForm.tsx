import { useState, type FormEvent, type ReactNode } from 'react';
import { BookOpen, Send } from 'lucide-react';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import {
  captureSignupFailed,
  captureSignupStarted,
  captureSignupSucceeded,
} from '@/lib/analytics';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export type BookReleaseNotifyVariant = 'card' | 'dock';

type BookReleaseNotifyFormProps = {
  releaseDate?: string;
  subheadline?: string;
  ctaLabel?: string;
  metaRelease?: string;
  metaUpdates?: string;
  successTitle?: string;
  errorMessage?: string;
  /** `dock` = mobile sticky thumb bar. `card` = desktop panel. */
  variant?: BookReleaseNotifyVariant;
};

const DEFAULT_RELEASE_DATE = 'September 1, 2026';
const DEFAULT_SUBHEADLINE =
  'Join the waitlist and be the first to\nknow when the book is here.';
const DEFAULT_CTA = 'Notify me';
const DEFAULT_META_RELEASE = 'Early look inside';
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
  compact = false,
}: {
  metaRelease: string;
  metaUpdates: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 font-sans leading-none text-cream/40',
        compact ? 'mt-2.5 text-[10px]' : 'mt-5 text-[11px] sm:gap-x-3 sm:text-xs',
      ].join(' ')}
    >
      <MetaItem
        icon={
          <BookOpen
            className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'}
            strokeWidth={1.75}
          />
        }
        label={metaRelease}
      />
      <span className="shrink-0 text-cream/20" aria-hidden="true">
        |
      </span>
      <MetaItem
        icon={
          <Send
            className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'}
            strokeWidth={1.75}
          />
        }
        label={metaUpdates}
      />
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
  variant = 'card',
}: BookReleaseNotifyFormProps) {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const buttonLabel = ctaLabel.trim() || DEFAULT_CTA;
  const subheadCopy = subheadline.trim() || DEFAULT_SUBHEADLINE;
  const releaseDateLabel = releaseDate.trim() || DEFAULT_RELEASE_DATE;
  const resolvedMetaRelease = metaRelease.trim() || DEFAULT_META_RELEASE;
  const resolvedMetaUpdates = metaUpdates.trim() || DEFAULT_META_UPDATES;
  const emailFieldId =
    variant === 'dock' ? 'book-release-email-dock' : 'book-release-email';

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

  if (variant === 'dock') {
    if (status === 'success') {
      return (
        <div className="px-1 py-1" role="status" aria-live="polite">
          <p className="font-serif text-lg leading-tight text-cream">{successTitle}</p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-cream/55">
            We will notify <span className="text-cream/85">{submittedEmail}</span> on{' '}
            {releaseDateLabel}.
          </p>
        </div>
      );
    }

    return (
      <div>
        <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
          {releaseDateLabel}
        </p>

        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <form
              onSubmit={handleSubmit}
              className="flex items-stretch"
              id="book-release-dock-form"
            >
              <label htmlFor={emailFieldId} className="sr-only">
                Email address
              </label>
              <input
                id={emailFieldId}
                type="email"
                name="email"
                autoComplete="email"
                form="book-release-dock-form"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Your email"
                disabled={status === 'submitting'}
                className="w-full rounded-full border border-cream/15 bg-[#080a09]/80 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-cream/30 focus:outline-none disabled:opacity-60"
              />
            </form>

            {status === 'error' ? (
              <p className="mt-2 font-sans text-xs text-clay/90" role="alert">
                {errorMessage}
              </p>
            ) : (
              <div className="flex justify-center">
                <NotifyMetaRow
                  metaRelease={resolvedMetaRelease}
                  metaUpdates={resolvedMetaUpdates}
                  compact
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            form="book-release-dock-form"
            disabled={status === 'submitting'}
            className="shrink-0 rounded-full bg-clay px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-500 hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? '…' : buttonLabel}
          </button>
        </div>
      </div>
    );
  }

  const cardClassName =
    'rounded-2xl border border-cream/15 bg-cream/[0.06] p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)]';

  if (status === 'success') {
    return (
      <div className={cardClassName} role="status" aria-live="polite">
        <div className="mb-6 flex items-start gap-4">
          <div
            className="mt-1 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-clay/30 bg-clay/10 text-clay sm:h-16 sm:w-16"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-[1.85rem] leading-[1.12] text-cream md:text-[2.1rem]">
              {successTitle}
            </h2>
            <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-cream/55 md:text-[15px]">
              We will notify <span className="text-cream/85">{submittedEmail}</span> when the book
              is available on {releaseDateLabel}.
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
      <div className="border-b border-cream/10 pb-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <span
            className="inline-flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center overflow-visible rounded-full border border-clay/30 bg-clay/[0.1] sm:h-[4.75rem] sm:w-[4.75rem]"
            aria-hidden="true"
          >
            <TeachingIconMark id="space" theme="dark" size={56} animate />
          </span>
          <span
            className="hidden h-12 w-px shrink-0 self-center bg-cream/15 sm:block"
            aria-hidden="true"
          />
          <h2 className="flex min-w-0 flex-col justify-center font-serif leading-[1.05] tracking-[-0.02em]">
            <span className="mb-1.5 block font-mono text-[11px] font-normal uppercase tracking-[0.28em] text-cream/50 sm:text-xs">
              The countdown is on
            </span>
            <span className="block text-[1.7rem] text-clay sm:text-[1.95rem] md:text-[2.1rem]">
              {releaseDateLabel}
            </span>
          </h2>
        </div>
      </div>

      <p className="mb-5 mt-4 whitespace-pre-line text-center font-sans text-[15px] leading-relaxed text-cream/55 md:text-base">
        {subheadCopy}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor={emailFieldId} className="sr-only">
          Email address
        </label>
        <input
          id={emailFieldId}
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
