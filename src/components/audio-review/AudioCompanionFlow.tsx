/**
 * Author recording companion — guidance + always-visible upload.
 * `page` is the standalone kit. `tray` is the editorial side panel.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Download, Upload } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import {
  CALIBRATION,
  COMPANION_KIT,
  ROOM_TONE,
  TEMPLATE_SETUP,
  UPLOAD_SPEC,
} from '@/data/audioCompanionKit';
import {
  formatFileBytes,
  uploadSessionTake,
  validateSessionTakeFile,
  type UploadProgress,
} from '@/lib/audiobookSessionTakes';

type UploadStatus = 'idle' | 'ready' | 'uploading' | 'sent' | 'error';

const EASE_OUT = [0.32, 0.72, 0, 1] as const;

type AudioCompanionFlowProps = {
  variant?: 'page' | 'tray';
};

export function AudioCompanionFlow({ variant = 'page' }: AudioCompanionFlowProps) {
  const isTray = variant === 'tray';
  const reduceMotion = useReducedMotion();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const chooseFile = (file: File | null) => {
    setSentId(null);
    setUploadError(null);
    setUploadProgress(null);
    if (!file) {
      setSelectedFile(null);
      setUploadStatus('idle');
      return;
    }
    const invalid = validateSessionTakeFile(file);
    if (invalid) {
      setSelectedFile(null);
      setUploadStatus('error');
      setUploadError(invalid);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setSelectedFile(file);
    setUploadStatus('ready');
  };

  const openFilePicker = () => {
    const input = fileInputRef.current;
    if (!input || uploadStatus === 'uploading') return;
    input.value = '';
    input.click();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadError(null);
    setSentId(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendFile = async () => {
    if (!selectedFile || uploadStatus === 'uploading') return;
    setUploadStatus('uploading');
    setUploadError(null);
    setUploadProgress({
      phase: 'preparing',
      loadedBytes: 0,
      totalBytes: selectedFile.size,
      percent: 0,
      message: `Preparing ${formatFileBytes(selectedFile.size)}…`,
    });
    const result = await uploadSessionTake({
      file: selectedFile,
      takeKind: 'initial_calibration',
      notes: 'Companion: room tone + calibration',
      roomToneSeconds: ROOM_TONE.durationSeconds,
      onProgress: setUploadProgress,
    });
    if (!result.ok) {
      setUploadStatus('error');
      setUploadError(result.error);
      return;
    }
    setSentId(result.id);
    setUploadStatus('sent');
  };

  const [title, ...body] = CALIBRATION.bookPassageParagraphs;

  const setupSteps = TEMPLATE_SETUP.steps.filter((step) => step.kind !== 'download');
  const downloadStep = TEMPLATE_SETUP.steps.find((step) => step.kind === 'download');

  const panelClass = isTray
    ? 'border-b border-cream/10 pb-6'
    : 'rounded-xl border border-cream/10 bg-[#0a0e0c] px-5 py-5 md:px-7 md:py-6';

  return (
    <div
      className={
        isTray
          ? 'font-companion text-cream'
          : 'flex min-h-0 flex-1 flex-col font-companion text-cream'
      }
    >
      {isTray ? null : (
        <header className="shrink-0 pb-4 md:pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9fb5aa]/70">
            {COMPANION_KIT.imprint} · {COMPANION_KIT.book}
          </p>
          <p className="mt-1 text-[13px] font-light text-cream/45">{COMPANION_KIT.lede}</p>
        </header>
      )}

      <div
        className={
          isTray
            ? 'flex flex-col gap-6'
            : 'relative flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto'
        }
      >
        {downloadStep ? (
          <section className={panelClass}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className={
                isTray
                  ? 'flex flex-col gap-4'
                  : 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
              }
            >
              <div className="min-w-0">
                <p
                  className={
                    isTray
                      ? 'font-serif text-[1.75rem] italic leading-none tracking-[-0.03em] text-cream'
                      : 'font-serif text-[clamp(1.5rem,2.6vw,2rem)] italic leading-none tracking-[-0.03em] text-cream'
                  }
                >
                  Download <span className="not-italic text-moss">template</span>
                </p>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-cream/45">
                  Start here. Get the Audacity project before you record.
                </p>
              </div>
              <a
                href={TEMPLATE_SETUP.templateHref}
                download={TEMPLATE_SETUP.templateFileName}
                className={
                  isTray
                    ? 'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-moss px-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-cream transition-opacity hover:opacity-95'
                    : 'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-moss px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-opacity hover:opacity-95'
                }
              >
                <Download size={14} strokeWidth={1.75} aria-hidden />
                <span className="min-w-0 truncate">{downloadStep.detail}</span>
              </a>
            </motion.div>
          </section>
        ) : null}

        <div className={isTray ? '' : 'rounded-xl border border-cream/10 bg-[#0a0e0c] px-5 py-5 md:px-7 md:py-6'}>
          <section className="relative">
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
              className={
                isTray
                  ? 'font-serif text-[1.75rem] italic leading-none tracking-[-0.03em] text-cream'
                  : 'font-serif text-[clamp(1.85rem,3.2vw,2.6rem)] italic leading-[0.95] tracking-[-0.03em] text-cream'
              }
            >
              Setup <span className="not-italic text-moss">first</span>
            </motion.h2>
            <p className="mt-2 text-[13px] font-light text-cream/45">
              Open the template in Audacity, then record.
            </p>

            <ol className="mt-5 space-y-0">
              {setupSteps.map((step, i) => {
                const n = String(i + 1).padStart(2, '0');
                return (
                  <li
                    key={step.id}
                    className="list-none border-b border-cream/[0.1] py-3.5 first:pt-0 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <p className="w-7 shrink-0 pt-0.5 font-serif text-[0.95rem] italic tabular-nums text-[#9fb5aa]/75">
                        {n}
                      </p>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.95rem] font-semibold leading-snug tracking-[-0.02em] text-cream">
                          {step.action}
                        </p>
                        {step.kind === 'action' ? (
                          <p className="mt-1.5 text-[12px] font-light leading-snug text-cream/45">
                            Choose{' '}
                            <span className="font-mono text-[11px] text-cream/70">
                              {step.detail}
                            </span>
                          </p>
                        ) : null}
                        {step.kind === 'save' ? (
                          <p className="mt-1.5 text-[12px] font-light leading-snug text-cream/45">
                            Save as{' '}
                            <span className="break-all font-mono text-[11px] text-cream/80">
                              {step.detail}
                            </span>
                          </p>
                        ) : null}
                        {step.kind === 'settings' ? (
                          <p className="mt-1.5 text-[12px] font-light leading-relaxed text-cream/50">
                            {step.detail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="relative mt-10 border-t border-cream/10 pt-8">
            <div
              className={
                isTray
                  ? 'grid gap-8'
                  : 'grid gap-8 md:grid-cols-[minmax(9rem,11rem)_minmax(0,1fr)] md:gap-8'
              }
            >
              <aside>
                <p className="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] italic leading-none tracking-[-0.02em] text-cream">
                  Record <span className="not-italic text-moss">now</span>
                </p>
                <p className="mt-3 text-[13px] font-light leading-relaxed text-cream/50">
                  {ROOM_TONE.lede}
                </p>
                <p className="mt-4 font-companion text-[2.5rem] font-semibold leading-none tracking-[-0.04em] text-cream">
                  {ROOM_TONE.durationSeconds}
                  <span className="ml-1 text-[1rem] font-medium text-cream/35">s</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {ROOM_TONE.rules.map((rule) => (
                    <li key={rule} className="flex items-center gap-2.5 text-[13px] text-cream/75">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9fb5aa]"
                        aria-hidden
                      />
                      {rule}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[12px] font-light leading-relaxed text-cream/35">
                  {ROOM_TONE.purpose}
                </p>
              </aside>

              <article>
                <p className="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] italic leading-none tracking-[-0.02em] text-cream">
                  Read <span className="not-italic text-moss">now</span>
                </p>
                <p className="mt-3 text-[13px] font-light text-cream/40">
                  Keep recording. Stop when the last line ends.
                </p>
                <p className="mt-4 text-[0.98rem] font-medium tracking-[-0.01em] text-[#9fb5aa]/95">
                  {title}
                </p>
                <div className={isTray ? 'mt-3 columns-1' : 'mt-3 columns-1 gap-x-8 md:columns-2'}>
                  {body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 28)}
                      className="mb-3 break-inside-avoid text-[0.92rem] font-light leading-[1.48] tracking-[-0.01em] text-cream/90"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <p className="mt-4 text-right font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] italic leading-none tracking-[-0.02em] text-cream">
                  Stop <span className="not-italic text-moss">recording</span>
                </p>
              </article>
            </div>
          </section>
        </div>

        <section className={isTray ? 'border-t border-cream/10 pt-6' : 'rounded-xl border border-cream/10 bg-[#0a0e0c] px-4 py-4 md:px-5 md:py-5'}>
          <p className="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] italic leading-none tracking-[-0.02em] text-cream">
            Send <span className="not-italic text-moss">take</span>
          </p>
          <p className="mt-2 text-[12px] font-light leading-relaxed text-cream/40">
            {UPLOAD_SPEC.lede} {UPLOAD_SPEC.maxSizeLabel}.
          </p>

          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            {...(UPLOAD_SPEC.acceptAttr ? { accept: UPLOAD_SPEC.acceptAttr } : {})}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              chooseFile(event.target.files?.[0] ?? null);
            }}
          />

          <div className="mt-4 flex flex-col gap-3 sm:max-w-md">
            {uploadStatus === 'sent' ? (
              <>
                <div className="rounded-xl border border-[#9fb5aa]/30 bg-[#9fb5aa]/08 px-3.5 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-cream">
                      <Check size={14} strokeWidth={2} aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-medium tracking-[-0.02em] text-cream">
                        Take received in Drive
                      </p>
                      {sentId ? (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/28">
                          Ref {sentId.slice(0, 8)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-moss px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-opacity hover:opacity-95"
                >
                  Send another
                </button>
              </>
            ) : (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFilePicker}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openFilePicker();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    if (event.currentTarget === event.target) setIsDragging(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    chooseFile(event.dataTransfer.files?.[0] ?? null);
                  }}
                  className={`group relative flex min-h-[9.5rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-4 py-5 text-center transition-colors duration-200 ${
                    isDragging
                      ? 'border-[#9fb5aa]/55 bg-[#9fb5aa]/12'
                      : selectedFile
                        ? 'border-[#9fb5aa]/40 bg-[#141816]'
                        : 'border-cream/22 bg-[#121614] hover:border-cream/40 hover:bg-[#151916]'
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(252,249,242,0.7) 1px, transparent 0)',
                      backgroundSize: '14px 14px',
                    }}
                    aria-hidden
                  />
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-cream/[0.03] text-[#9fb5aa] transition-transform duration-300 group-hover:scale-105">
                    <Upload size={17} strokeWidth={1.75} aria-hidden />
                  </span>
                  {selectedFile ? (
                    <>
                      <p className="relative mt-3 max-w-full truncate text-[13px] font-medium tracking-[-0.015em] text-cream/90">
                        {selectedFile.name}
                      </p>
                      <p className="relative mt-1 text-[11px] font-light text-cream/40">
                        {formatFileBytes(selectedFile.size)} · click to replace
                      </p>
                    </>
                  ) : (
                    <p className="relative mt-3 text-[13px] font-medium tracking-[-0.015em] text-cream/80">
                      Drop take here
                    </p>
                  )}
                </div>

                {selectedFile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void sendFile()}
                      disabled={uploadStatus === 'uploading'}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-moss px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-opacity hover:opacity-95 disabled:cursor-wait disabled:opacity-70"
                    >
                      {uploadStatus === 'uploading' ? 'Sending to Drive…' : 'Send to Drive'}
                    </button>
                    <button
                      type="button"
                      onClick={resetUpload}
                      disabled={uploadStatus === 'uploading'}
                      className="inline-flex min-h-8 w-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.12em] text-cream/40 transition-colors hover:text-cream/70 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </>
                ) : null}

                {uploadStatus === 'uploading' && uploadProgress ? (
                  <div className="w-full" aria-live="polite">
                    <div className="flex items-baseline justify-between gap-3 text-[10px] text-cream/40">
                      <span className="tabular-nums">
                        {formatFileBytes(uploadProgress.loadedBytes)}
                        <span className="text-cream/25"> / </span>
                        {formatFileBytes(uploadProgress.totalBytes)}
                      </span>
                      <span className="font-medium tabular-nums text-cream/70">
                        {uploadProgress.percent}%
                      </span>
                    </div>
                    <div
                      className="mt-2 h-1 overflow-hidden rounded-full bg-cream/10"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={uploadProgress.percent}
                      aria-label="Upload progress"
                    >
                      <div
                        className="h-full rounded-full bg-moss transition-[width] duration-200 ease-out"
                        style={{ width: `${uploadProgress.percent}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {uploadError ? (
              <p
                role="alert"
                className="text-[12px] font-light leading-relaxed text-[#e0a090]"
              >
                {uploadError}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
