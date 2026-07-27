/**
 * iPhone send-take: one action at a time.
 * Idle → Choose. Ready → Upload. Busy → progress. Done → Send another.
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

export default function AudioSendTakePage() {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UiStatus>('idle');
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
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

  const title = (() => {
    switch (status) {
      case 'idle':
        return 'Send your take';
      case 'ready':
        return 'Ready';
      case 'preparing':
        return 'Preparing';
      case 'uploading':
        return 'Uploading';
      case 'saving':
        return 'Saving';
      case 'complete':
        return 'Received';
      case 'error':
        return 'Failed';
      default: {
        const _exhaustive: never = status;
        return _exhaustive;
      }
    }
  })();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050806] font-companion text-cream touch-manipulation">
      {/* Brief Frequency of Mind field (component is relative; shell fills the viewport) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <FrequencyOfMindVisual className="h-full w-full" showCaption={false} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,6,0.28)_0%,rgba(5,8,6,0.12)_45%,rgba(5,8,6,0.55)_100%)]"
        aria-hidden
      />

      <main
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pt-[max(1.75rem,env(safe-area-inset-top))]"
        aria-labelledby={titleId}
      >
        <h1
          id={titleId}
          className="text-[1.75rem] font-semibold tracking-[-0.03em] text-cream"
        >
          {title}
        </h1>

        <input
          ref={fileInputRef}
          type="file"
          accept={UPLOAD_SPEC.acceptAttr}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            chooseFile(event.target.files?.[0] ?? null);
          }}
        />

        <div className="flex flex-1 flex-col justify-center py-10">
          {/* Idle: nothing but the single choose action lives in the footer */}
          {status === 'idle' ? (
            <p className="text-[17px] font-light leading-relaxed text-cream/50">
              Pick a WAV or M4A from Files on your iPhone.
            </p>
          ) : null}

          {/* Ready: show the file once. Change file is a text link, not a second hero. */}
          {status === 'ready' && selectedFile ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream/35">
                File
              </p>
              <p className="mt-3 break-all text-xl font-medium leading-snug tracking-[-0.02em] text-cream">
                {selectedFile.name}
              </p>
              <p className="mt-2 text-[15px] font-light text-cream/45">
                {formatFileBytes(selectedFile.size)}
              </p>
              <button
                type="button"
                onClick={openFilePicker}
                className="mt-6 min-h-12 text-[15px] font-medium text-[#9fb5aa] active:text-cream"
              >
                Change file
              </button>
            </div>
          ) : null}

          {/* Busy / complete: progress is the center */}
          {(busy || status === 'complete') && progress ? (
            <div aria-live="polite" aria-atomic="true">
              {selectedFile ? (
                <p className="mb-6 break-all text-[15px] font-light text-cream/45">
                  {selectedFile.name}
                </p>
              ) : null}

              <div className="flex items-end justify-between gap-4">
                <p className="text-[15px] font-light text-cream/55">
                  {status === 'saving'
                    ? 'Saving…'
                    : status === 'complete'
                      ? 'Done'
                      : status === 'preparing'
                        ? 'Preparing…'
                        : 'Uploading…'}
                </p>
                <p className="text-4xl font-semibold tabular-nums tracking-tight text-cream">
                  {percent}%
                </p>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-cream/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Upload progress"
              >
                <div
                  className="h-full rounded-full bg-moss transition-[transform] duration-200 ease-out"
                  style={{
                    width: '100%',
                    transform: `scaleX(${Math.max(percent, 1) / 100})`,
                    transformOrigin: 'left center',
                  }}
                />
              </div>

              <p className="mt-3 font-mono text-[13px] tabular-nums text-cream/40">
                {formatFileBytes(progress.loadedBytes)}
                <span className="text-cream/20"> / </span>
                {formatFileBytes(progress.totalBytes)}
              </p>

              {sentId && status === 'complete' ? (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/28">
                  Ref {sentId.slice(0, 8)}
                </p>
              ) : null}
            </div>
          ) : null}

          {status === 'error' ? (
            <p role="alert" className="text-[17px] font-light leading-relaxed text-[#e0a090]">
              {error ?? 'Upload failed.'}
            </p>
          ) : null}
        </div>

        {/* One primary button. Only one job per state. */}
        <div className="relative z-10 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          {status === 'idle' ? (
            <button
              type="button"
              onClick={openFilePicker}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-moss text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-[0.98]"
            >
              Choose file
            </button>
          ) : null}

          {status === 'ready' ? (
            <button
              type="button"
              onClick={() => void sendFile()}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-moss text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-[0.98]"
            >
              Upload
            </button>
          ) : null}

          {busy ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-cream/20 bg-[#0c100e]/70 text-[15px] font-semibold text-cream/80 backdrop-blur-sm active:bg-cream/5"
            >
              Cancel
            </button>
          ) : null}

          {status === 'complete' ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-moss text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-[0.98]"
            >
              Send another
            </button>
          ) : null}

          {status === 'error' ? (
            <button
              type="button"
              onClick={() => {
                reset();
                openFilePicker();
              }}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-moss text-[15px] font-semibold text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-[0.98]"
            >
              Try again
            </button>
          ) : null}
        </div>
      </main>
    </div>
  );
}
