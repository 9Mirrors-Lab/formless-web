/**
 * iPhone send-take: one action at a time.
 * Idle → Choose. Ready → Upload. Busy → progress. Done → Send another.
 * All status lives in the bottom dock so the portal never loses its stage.
 */
import { useEffect, useId, useRef, useState } from 'react';

import { FrequencyOfMindVisual } from '@/components/FrequencyOfMindVisual';
import { ROOM_TONE, UPLOAD_SPEC } from '@/data/audioCompanionKit';
import {
  formatFileBytes,
  uploadSessionTake,
  validateSessionTakeFile,
  type UploadProgress,
} from '@/lib/audiobookSessionTakes';

type UiStatus =
  | 'idle'
  | 'ready'
  | 'preparing'
  | 'uploading'
  | 'saving'
  | 'complete'
  | 'error';

const PROGRESS_BARS = 28;
const MOTION_EASE = 'cubic-bezier(0.32,0.72,0,1)';

function phaseLabel(status: UiStatus): string {
  switch (status) {
    case 'preparing':
      return 'Preparing';
    case 'uploading':
      return 'Sending';
    case 'saving':
      return 'Saving';
    case 'complete':
      return 'Received';
    case 'error':
      return 'Failed';
    case 'ready':
      return 'Ready';
    case 'idle':
      return 'Send your take';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function TransmissionMeter({
  percent,
  busy,
}: {
  percent: number;
  busy: boolean;
}) {
  const litCount = Math.max(
    1,
    Math.round((Math.max(percent, busy ? 2 : 0) / 100) * PROGRESS_BARS),
  );

  return (
    <div
      className="relative flex h-12 items-end justify-between gap-[3px]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Upload progress"
    >
      {Array.from({ length: PROGRESS_BARS }).map((_, i) => {
        const lit = i < litCount;
        const isFrontier = busy && lit && i === litCount - 1;
        const mid = Math.abs(i - (PROGRESS_BARS - 1) / 2);
        const baseH = 32 + (1 - mid / ((PROGRESS_BARS - 1) / 2)) * 52;
        const accent = i % 7 === 0;
        return (
          <span
            key={i}
            className="relative w-full overflow-hidden rounded-full"
            style={{ height: `${baseH}%`, minHeight: 12 }}
          >
            <span
              className="absolute inset-0 rounded-full bg-cream/[0.07]"
              aria-hidden
            />
            <span
              className={[
                'absolute inset-x-0 bottom-0 rounded-full transition-[transform,opacity] duration-700',
                isFrontier ? 'send-take-frontier' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                height: '100%',
                background: accent
                  ? 'linear-gradient(to top, rgba(204,88,51,0.2), rgba(204,88,51,0.92))'
                  : 'linear-gradient(to top, rgba(159,181,170,0.18), rgba(242,240,233,0.92))',
                transform: lit ? 'scaleY(1)' : 'scaleY(0.1)',
                transformOrigin: 'bottom center',
                opacity: lit ? (busy ? 0.98 : 0.7) : 0.18,
                transitionTimingFunction: MOTION_EASE,
                transitionDelay: `${i * 16}ms`,
                boxShadow: lit
                  ? accent
                    ? '0 0 12px rgba(204,88,51,0.35)'
                    : '0 0 10px rgba(159,181,170,0.28)'
                  : 'none',
              }}
              aria-hidden
            />
          </span>
        );
      })}
    </div>
  );
}

export default function AudioSendTakePage() {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UiStatus>('idle');
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [fieldCycle, setFieldCycle] = useState(0);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const demo = new URLSearchParams(window.location.search).get('demo');
    if (demo !== 'upload' && demo !== 'complete') return;

    const file = new File(
      [new Uint8Array(2_400_000)],
      'calibration-take.wav',
      { type: 'audio/wav' },
    );
    setSelectedFile(file);
    if (demo === 'complete') {
      setStatus('complete');
      setSentId('a1b2c3d4-demo-ref');
      setProgress({
        phase: 'complete',
        loadedBytes: file.size,
        totalBytes: file.size,
        percent: 100,
        message: 'Done',
      });
      return;
    }
    setStatus('uploading');
    setProgress({
      phase: 'uploading',
      loadedBytes: 960_000,
      totalBytes: file.size,
      percent: 40,
      message: 'Uploading…',
    });
  }, []);

  const chooseFile = (file: File | null) => {
    setSentId(null);
    setError(null);
    setProgress(null);
    if (!file) {
      setSelectedFile(null);
      setStatus('idle');
      return;
    }
    const invalid = validateSessionTakeFile(file);
    if (invalid) {
      setSelectedFile(null);
      setStatus('error');
      setError(invalid);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setSelectedFile(file);
    setStatus('ready');
  };

  const openFilePicker = () => {
    if (status === 'preparing' || status === 'uploading' || status === 'saving') {
      return;
    }
    const input = fileInputRef.current;
    if (!input) return;
    input.value = '';
    input.click();
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSelectedFile(null);
    setStatus('idle');
    setProgress(null);
    setError(null);
    setSentId(null);
    setFieldCycle((cycle) => cycle + 1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendFile = async () => {
    if (!selectedFile) return;
    if (status === 'preparing' || status === 'uploading' || status === 'saving') {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setSentId(null);
    setStatus('preparing');
    setProgress({
      phase: 'preparing',
      loadedBytes: 0,
      totalBytes: selectedFile.size,
      percent: 0,
      message: `Preparing ${formatFileBytes(selectedFile.size)}…`,
    });

    const result = await uploadSessionTake({
      file: selectedFile,
      takeKind: 'initial_calibration',
      notes: 'iPhone send take',
      roomToneSeconds: ROOM_TONE.durationSeconds,
      signal: controller.signal,
      onProgress: (next) => {
        setProgress(next);
        setStatus(next.phase);
        if (next.phase === 'error') setError(next.message);
      },
    });

    if (!result.ok) {
      if (result.aborted) {
        setStatus(selectedFile ? 'ready' : 'idle');
        setProgress(null);
        setError(null);
        return;
      }
      setStatus('error');
      setError(result.error);
      return;
    }

    setSentId(result.id);
    setStatus('complete');
  };

  const busy =
    status === 'preparing' || status === 'uploading' || status === 'saving';
  const percent = progress?.percent ?? (status === 'complete' ? 100 : 0);
  const fieldMotion = busy ? 'active' : status === 'complete' ? 'rest' : 'once';
  const showTransmit = (busy || status === 'complete') && Boolean(progress);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050806] font-companion text-cream touch-manipulation">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <FrequencyOfMindVisual
          key={fieldCycle}
          className="h-full w-full"
          showCaption={false}
          motion={fieldMotion}
          ignoreReducedMotion
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,6,0.62)_0%,rgba(5,8,6,0.1)_36%,rgba(5,8,6,0.14)_54%,rgba(5,8,6,0.82)_100%)]"
        aria-hidden
      />

      <main
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pt-[max(1.75rem,env(safe-area-inset-top))]"
        aria-labelledby={titleId}
      >
        <header className="shrink-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cream/35">
            Session take
          </p>
          <h1
            id={titleId}
            className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-cream transition-[opacity,transform] duration-700"
            style={{ transitionTimingFunction: MOTION_EASE }}
          >
            {phaseLabel(status)}
          </h1>
        </header>

        <input
          ref={fileInputRef}
          type="file"
          {...(UPLOAD_SPEC.acceptAttr ? { accept: UPLOAD_SPEC.acceptAttr } : {})}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            chooseFile(event.target.files?.[0] ?? null);
          }}
        />

        {/* Portal stage stays empty — atmosphere only */}
        <div className="min-h-0 flex-1" aria-hidden />

        {/* Single dock: copy, file, transmit, and CTA share one zone */}
        <div className="relative z-10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          <div className="rounded-[1.75rem] bg-cream/[0.04] p-1.5 ring-1 ring-cream/[0.08]">
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#0a0e0c]/88 px-5 pb-5 pt-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              {status === 'idle' ? (
                <div className="mb-5">
                  <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#9fb5aa]/70">
                    From Files
                  </p>
                  <p className="mt-2 text-[17px] font-light leading-snug tracking-[-0.01em] text-cream/78">
                    Audio or .aup3
                  </p>
                </div>
              ) : null}

              {status === 'ready' && selectedFile ? (
                <div className="mb-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#9fb5aa]/70">
                      Selected
                    </p>
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="min-h-11 shrink-0 text-[14px] font-medium text-[#9fb5aa] transition-colors duration-500 active:text-cream"
                      style={{ transitionTimingFunction: MOTION_EASE }}
                    >
                      Change
                    </button>
                  </div>
                  <p className="mt-2 break-all text-[17px] font-medium leading-snug tracking-[-0.02em] text-cream">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1.5 text-[13px] font-light tabular-nums text-cream/40">
                    {formatFileBytes(selectedFile.size)}
                  </p>
                </div>
              ) : null}

              {showTransmit && progress ? (
                <div className="mb-5" aria-live="polite" aria-atomic="true">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#9fb5aa]/70">
                      {status === 'complete' ? 'Complete' : 'In motion'}
                    </p>
                    <p className="text-[28px] font-semibold tabular-nums tracking-tight text-cream">
                      {percent}
                      <span className="ml-0.5 text-[14px] font-medium text-cream/40">
                        %
                      </span>
                    </p>
                  </div>

                  {selectedFile ? (
                    <p className="mt-2 truncate text-[14px] font-light text-cream/45">
                      {selectedFile.name}
                    </p>
                  ) : null}

                  <div className="mt-4">
                    <TransmissionMeter percent={percent} busy={busy} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-mono text-[12px] tabular-nums text-cream/35">
                      {formatFileBytes(progress.loadedBytes)}
                      <span className="text-cream/18"> / </span>
                      {formatFileBytes(progress.totalBytes)}
                    </p>
                    {sentId && status === 'complete' ? (
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/28">
                        Ref {sentId.slice(0, 8)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {status === 'error' ? (
                <p
                  role="alert"
                  className="mb-5 text-[15px] font-light leading-relaxed text-[#e0a090]"
                >
                  {error ?? 'Upload failed.'}
                </p>
              ) : null}

              {status === 'idle' ? (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="group inline-flex min-h-14 w-full items-center justify-between rounded-full bg-moss pl-6 pr-2 text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform duration-500 active:scale-[0.98]"
                  style={{ transitionTimingFunction: MOTION_EASE }}
                >
                  <span>Choose file</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-95">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4.5 11.5L11.5 4.5M11.5 4.5H6.25M11.5 4.5V9.75"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              ) : null}

              {status === 'ready' ? (
                <button
                  type="button"
                  onClick={() => void sendFile()}
                  className="group inline-flex min-h-14 w-full items-center justify-between rounded-full bg-moss pl-6 pr-2 text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform duration-500 active:scale-[0.98]"
                  style={{ transitionTimingFunction: MOTION_EASE }}
                >
                  <span>Upload</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-95">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M8 12.25V3.75M8 3.75L4.5 7.25M8 3.75L11.5 7.25"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              ) : null}

              {busy ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-cream/15 bg-transparent text-[15px] font-semibold text-cream/75 transition-colors duration-500 active:bg-cream/5"
                  style={{ transitionTimingFunction: MOTION_EASE }}
                >
                  Cancel
                </button>
              ) : null}

              {status === 'complete' ? (
                <button
                  type="button"
                  onClick={reset}
                  className="group inline-flex min-h-14 w-full items-center justify-between rounded-full bg-moss pl-6 pr-2 text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform duration-500 active:scale-[0.98]"
                  style={{ transitionTimingFunction: MOTION_EASE }}
                >
                  <span>Send another</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-95">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              ) : null}

              {status === 'error' ? (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    openFilePicker();
                  }}
                  className="group inline-flex min-h-14 w-full items-center justify-between rounded-full bg-moss pl-6 pr-2 text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform duration-500 active:scale-[0.98]"
                  style={{ transitionTimingFunction: MOTION_EASE }}
                >
                  <span>Try again</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-95">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4.5 11.5L11.5 4.5M11.5 4.5H6.25M11.5 4.5V9.75"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
