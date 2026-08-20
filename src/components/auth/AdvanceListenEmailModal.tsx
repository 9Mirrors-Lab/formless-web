import { useState, type FormEvent } from 'react';
import { XIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  captureSignupFailed,
  captureSignupStarted,
  captureSignupSucceeded,
} from '@/lib/analytics';
import { listenLockup } from '@/components/audio-review/advanceListenType';
import { captureAdvanceListenEmail } from '@/lib/advanceListenAccess';
import { isValidEmail } from '@/lib/auth';

function goHome(): void {
  window.location.assign('/');
}

const inputClassName =
  'w-full rounded-full border border-cream/15 bg-charcoal/60 px-5 py-3.5 font-sans text-sm text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-cream/30 focus:ring-2 focus:ring-cream/10';

const buttonClassName =
  'w-full rounded-full bg-clay px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-transform hover:-translate-y-0.5 hover:bg-[#b54d2d] disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Email-only door for /advance-listen.
 * Publishers and early listeners do not need an Eyes Closed account.
 */
export function AdvanceListenEmailModal({
  onUnlocked,
}: {
  onUnlocked: () => void;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    captureSignupStarted('advance_listen', 'advance_listen_gate');

    if (!isValidEmail(trimmed)) {
      captureSignupFailed('advance_listen', 'advance_listen_gate', 'invalid_email');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const result = await captureAdvanceListenEmail(trimmed);
    setSubmitting(false);

    if (!result.ok) {
      captureSignupFailed('advance_listen', 'advance_listen_gate', 'server_error');
      setErrorMessage(result.errorMessage);
      return;
    }

    captureSignupSucceeded('advance_listen', 'advance_listen_gate');
    onUnlocked();
  }

  return (
    <div className="min-h-[100dvh] bg-[#080a09]">
      <div className="noise-overlay-dark" aria-hidden />
      <Dialog open>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-[#050806]/78 supports-backdrop-filter:backdrop-blur-[3px]"
          className="max-h-[90dvh] overflow-y-auto border-cream/12 bg-[#0e120f] p-6 text-cream shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:max-w-md sm:p-8"
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            goHome();
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            goHome();
          }}
        >
          <button
            type="button"
            className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            onClick={goHome}
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
          <DialogHeader className="text-center sm:text-center">
            <p className={`${listenLockup.chrome} text-[11px] text-cream/45`}>
              Advance Listening Access
            </p>
            <DialogTitle className={`${listenLockup.book} text-4xl text-cream`}>
              Formless
            </DialogTitle>
            <DialogDescription className="sr-only">
              Enter your email to preview the audiobook.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div>
              <label htmlFor="advance-listen-email" className="sr-only">
                Email
              </label>
              <input
                id="advance-listen-email"
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
                className={inputClassName}
              />
            </div>

            {errorMessage ? (
              <p
                className="rounded-2xl border border-clay/35 bg-clay/15 px-4 py-3 text-sm text-cream"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}

            <button type="submit" disabled={submitting} className={buttonClassName}>
              {submitting ? 'Please wait…' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="font-medium text-cream underline-offset-4 hover:text-white hover:underline"
              onClick={goHome}
            >
              Back to home
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
