import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  submitSonikaInquiry,
  type SonikaInquirySource,
} from '@/lib/sonikaInquiries';

export type InquiryTopicOption = {
  value: string;
  label: string;
};

type SonikaInquiryTrayProps = {
  open: boolean;
  onClose: () => void;
  source: SonikaInquirySource;
  title: string;
  /** Optional intro under the title. When omitted, space is kept so the form does not jump up. */
  lede?: string;
  questionLabel?: string;
  questionPlaceholder?: string;
  questionHint?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  /** When true, show optional name / email / topic fields. */
  showOptionalDetails?: boolean;
  topics?: readonly InquiryTopicOption[];
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_CONTROL =
  'block w-full min-h-11 rounded-xl border border-[#f0ddbc]/20 bg-[#0b0e12]/72 px-3.5 py-3 text-base leading-normal text-[#f2eee6] outline-none placeholder:text-[#d7c7ae]/48 transition focus:border-[#d3ad75]/70 focus:ring-2 focus:ring-[#d3ad75]/28 disabled:opacity-60';

export function SonikaInquiryTray({
  open,
  onClose,
  source,
  title,
  lede,
  questionLabel = 'Your question',
  questionPlaceholder = 'What question is alive for you right now?',
  questionHint = 'Be as honest and specific as you can. Name and contact details are optional.',
  submitLabel = 'Send inquiry',
  successTitle = 'Thank you',
  successBody = 'Your inquiry has been received. Sonika reads each one personally.',
  showOptionalDetails = false,
  topics = [],
}: SonikaInquiryTrayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && status !== 'submitting') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, status]);

  function resetFormFields() {
    setQuestion('');
    setName('');
    setEmail('');
    setTopic('');
  }

  function clearError() {
    if (status === 'error') {
      setStatus('idle');
      setFormError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    setFormError(null);
    setStatus('submitting');

    const result = await submitSonikaInquiry({
      question,
      name: showOptionalDetails ? name : null,
      email: showOptionalDetails ? email : null,
      topic: showOptionalDetails ? topic : null,
      source,
    });

    if (!result.ok) {
      setFormError(result.error);
      setStatus('error');
      return;
    }

    resetFormFields();
    setStatus('success');
  }

  function handleClose() {
    if (status === 'submitting') return;
    onClose();
    window.setTimeout(() => {
      if (status === 'success') {
        setStatus('idle');
        setFormError(null);
      }
    }, 320);
  }

  const submitting = status === 'submitting';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed inset-x-0 bottom-0 z-50 flex h-[min(92dvh,100%)] w-full flex-col border-t border-[#e3c186]/26 bg-[#0c0f13]/98 shadow-[0_-24px_54px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-transform duration-400 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-w-[26.5rem] sm:border-l sm:border-t-0 sm:shadow-[-24px_0_54px_-32px_rgba(0,0,0,0.85)] ${
          open ? 'translate-y-0 sm:translate-x-0 sm:translate-y-0' : 'translate-y-full sm:translate-x-full sm:translate-y-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(232,196,128,0.16),rgba(13,16,19,0)_56%)]" />
          <div className="absolute -right-20 -top-14 h-64 w-64 rounded-full border border-[#d0a95f]/26" />
        </div>

        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-[#e3c186]/14 px-5 pb-4 pt-5 sm:px-7 sm:pt-7">
          <div className="min-w-0 flex-1">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#e3c186]/35 sm:hidden" aria-hidden />
            {lede ? (
              <p className="mt-2.5 text-base leading-relaxed text-[#e0d0b6]">{lede}</p>
            ) : (
              <div
                className="mt-2.5"
                style={{ minHeight: '6.75rem' }}
                aria-hidden
              />
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3c186]/28 text-xl leading-none text-[#e6c995] transition hover:border-[#e6c995]/70 hover:text-[#f4ddba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45 disabled:opacity-50"
            aria-label="Close inquiry tray"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="relative flex flex-1 flex-col justify-center px-5 py-8 sm:px-7" role="status" aria-live="polite">
            <div className="rounded-2xl border border-[#d3ad75]/35 bg-[#0b0e12]/65 px-5 py-6 sm:px-6 sm:py-7">
              <p className="font-serif text-2xl leading-snug text-[#f0e6d4]">{successTitle}</p>
              <p className="mt-3 text-base leading-relaxed text-[#e0d0b6]">{successBody}</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#d5ae73]/58 bg-[linear-gradient(90deg,rgba(213,174,115,0.13),rgba(213,174,115,0.05))] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2e3ca] transition hover:border-[#e2bc84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form className="relative flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} noValidate>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 [scrollbar-width:thin] [scrollbar-color:rgba(211,173,117,0.35)_transparent] sm:px-7 sm:pb-8 sm:pt-6">
              <div className="flex flex-col gap-7">
                <Field
                  id={`${source}-question`}
                  label={questionLabel}
                  required
                  hint={questionHint}
                >
                  <textarea
                    id={`${source}-question`}
                    name="question"
                    required
                    rows={7}
                    value={question}
                    disabled={submitting}
                    onChange={(event) => {
                      setQuestion(event.target.value);
                      clearError();
                    }}
                    className={`${FIELD_CONTROL} min-h-[11rem] resize-y sm:min-h-[14rem] lg:min-h-[16rem]`}
                    placeholder={questionPlaceholder}
                  />
                </Field>

                {showOptionalDetails ? (
                  <div className="flex flex-col gap-6 border-t border-[#e3c186]/14 pt-7">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#cfa970]/90">
                      Optional details
                    </p>

                    <Field id={`${source}-name`} label="Name" optional>
                      <input
                        id={`${source}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        disabled={submitting}
                        onChange={(event) => {
                          setName(event.target.value);
                          clearError();
                        }}
                        placeholder="Your name"
                        className={FIELD_CONTROL}
                      />
                    </Field>

                    <Field id={`${source}-email`} label="Email" optional>
                      <input
                        id={`${source}-email`}
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        disabled={submitting}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          clearError();
                        }}
                        placeholder="you@example.com"
                        className={FIELD_CONTROL}
                      />
                    </Field>

                    {topics.length > 0 ? (
                      <Field id={`${source}-topic`} label="Topic" optional>
                        <select
                          id={`${source}-topic`}
                          name="topic"
                          value={topic}
                          disabled={submitting}
                          onChange={(event) => {
                            setTopic(event.target.value);
                            clearError();
                          }}
                          className={FIELD_CONTROL}
                        >
                          {topics.map((option) => (
                            <option
                              key={option.value || 'default'}
                              value={option.value}
                              className="bg-[#0b0e12]"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    ) : null}
                  </div>
                ) : null}

                {status === 'error' && formError ? (
                  <p
                    className="rounded-xl border border-[#c9897a]/45 bg-[#140e0e] px-3.5 py-3 text-sm leading-relaxed text-[#efcfc4]"
                    role="alert"
                  >
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-1 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#d5ae73]/58 bg-[linear-gradient(90deg,rgba(213,174,115,0.13),rgba(213,174,115,0.05))] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2e3ca] transition hover:border-[#e2bc84] hover:bg-[linear-gradient(90deg,rgba(213,174,115,0.22),rgba(213,174,115,0.1))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45 disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? 'Sending…' : submitLabel}
                  {!submitting ? (
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </form>
        )}
      </aside>
    </>,
    document.body,
  );
}

function Field({
  id,
  label,
  required = false,
  optional = false,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={id}
        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#e0c79e]"
      >
        <span>{label}</span>
        {required ? <span className="sr-only">(required)</span> : null}
        {optional ? (
          <span className="text-[0.62rem] font-medium normal-case tracking-normal text-[#cbb892]/75">
            Optional
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-sm leading-relaxed text-[#dac7a7]">{hint}</p> : null}
    </div>
  );
}
