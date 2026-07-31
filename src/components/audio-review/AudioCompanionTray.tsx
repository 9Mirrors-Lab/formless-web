/**
 * Author recording companion — shadcn Sheet (top) over the editorial room.
 * Page 1: setup + room tone. Page 2: read passage + send take.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Download, Upload, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type RefObject } from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CALIBRATION,
  COMPANION_KIT,
  COMPANION_SECTIONS,
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

type AudioCompanionTrayProps = {
  open: boolean;
  onClose: () => void;
};

type UploadStatus = 'idle' | 'ready' | 'uploading' | 'sent' | 'error';

const EASE_OUT = [0.32, 0.72, 0, 1] as const;
const STEP_IDS = COMPANION_SECTIONS.map((s) => s.id);

export function AudioCompanionTray({ open, onClose }: AudioCompanionTrayProps) {
  const reduceMotion = useReducedMotion();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const stepId = STEP_IDS[stepIndex] ?? 'prepare';

  useEffect(() => {
    if (!open) setStepIndex(0);
  }, [open]);

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

  const clearFile = () => {
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
      notes: 'Companion tray: room tone + calibration',
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

  const stepMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent
        side="top"
        showCloseButton={false}
        overlayClassName="bg-black/55"
        className="flex h-[min(58svh,38rem)] flex-col gap-0 overflow-hidden border-cream/10 bg-[#0a0e0c] p-0 font-companion text-cream shadow-[0_28px_80px_rgba(0,0,0,0.5)] data-[side=top]:h-[min(58svh,38rem)] sm:max-w-none"
      >
        <SheetHeader className="mx-auto w-full max-w-[80rem] shrink-0 space-y-0 px-5 pb-3 pt-4 text-left md:px-8 md:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9fb5aa]/70">
                {COMPANION_KIT.imprint} · {COMPANION_KIT.book}
              </p>
              <SheetTitle className="sr-only">{COMPANION_KIT.title}</SheetTitle>
              <SheetDescription className="sr-only">{COMPANION_KIT.lede}</SheetDescription>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                className="rounded-full border border-cream/15 p-2 text-cream/50 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-cream/35 hover:text-cream"
                aria-label="Close"
              >
                <X size={17} strokeWidth={1.25} />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mx-auto flex min-h-0 w-full max-w-[80rem] flex-1 flex-col overflow-hidden px-5 pb-5 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepId}
              {...stepMotion}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              {stepId === 'prepare' ? (
                <PrepareStep
                  onNext={() => setStepIndex((i) => Math.min(STEP_IDS.length - 1, i + 1))}
                />
              ) : null}
              {stepId === 'read' ? (
                <ReadAndSendStep
                  fileInputId={fileInputId}
                  fileInputRef={fileInputRef}
                  selectedFile={selectedFile}
                  uploadStatus={uploadStatus}
                  uploadError={uploadError}
                  sentId={sentId}
                  isDragging={isDragging}
                  uploadProgress={uploadProgress}
                  setIsDragging={setIsDragging}
                  chooseFile={chooseFile}
                  openFilePicker={openFilePicker}
                  clearFile={clearFile}
                  sendFile={sendFile}
                  onBack={() => setStepIndex((i) => Math.max(0, i - 1))}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PrepareStep({ onNext }: { onNext: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="flex min-h-0 flex-1 items-stretch gap-4 overflow-y-auto pb-2 md:gap-6">
      <div className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col justify-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mb-6 shrink-0"
        >
          <h3 className="font-serif text-[clamp(2.2rem,4vw,3.2rem)] italic leading-[0.9] tracking-[-0.03em] text-cream">
            Setup{' '}
            <span className="not-italic text-moss">first</span>
          </h3>
          <p className="mt-2 text-[13px] font-light text-cream/45">
            Open the template in Audacity, then continue.
          </p>
        </motion.div>

        <ol className="min-w-0 space-y-0">
          {TEMPLATE_SETUP.steps.map((step, i) => {
            const n = String(i + 1).padStart(2, '0');

            return (
              <li
                key={step.id}
                className="list-none border-b border-cream/[0.1] py-3.5 first:pt-0 last:border-b-0"
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: reduceMotion ? 0 : 0.03 + i * 0.05,
                    ease: EASE_OUT,
                  }}
                  className="flex items-start gap-3"
                >
                  <p className="w-7 shrink-0 pt-0.5 font-serif text-[0.95rem] italic tabular-nums text-[#9fb5aa]/75">
                    {n}
                  </p>
                  <div className="min-w-0 flex-1">
                    {step.kind === 'download' ? (
                      <a
                        href={TEMPLATE_SETUP.templateHref}
                        download={TEMPLATE_SETUP.templateFileName}
                        className="group inline-flex max-w-full items-baseline gap-2 text-cream transition-colors hover:text-moss"
                      >
                        <Download
                          size={14}
                          strokeWidth={1.5}
                          className="relative top-0.5 shrink-0 text-[#9fb5aa] transition-colors group-hover:text-moss"
                          aria-hidden
                        />
                        <span className="truncate border-b border-cream/25 pb-px font-mono text-[12px] leading-snug tracking-[-0.01em] transition-colors group-hover:border-moss/50">
                          {step.detail}
                        </span>
                        <span className="sr-only">Download template</span>
                      </a>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Continue to recording"
        className="my-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-cream/40 hover:text-cream"
      >
        <ChevronRight size={22} strokeWidth={1.25} aria-hidden />
      </button>
    </section>
  );
}

type SendPanelProps = {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  uploadStatus: UploadStatus;
  uploadError: string | null;
  sentId: string | null;
  isDragging: boolean;
  uploadProgress: UploadProgress | null;
  setIsDragging: (v: boolean) => void;
  chooseFile: (file: File | null) => void;
  openFilePicker: () => void;
  clearFile: () => void;
  sendFile: () => Promise<void>;
  onBack: () => void;
};

function DottedPath() {
  return (
    <div
      className="h-px min-w-6 flex-1 bg-[repeating-linear-gradient(90deg,rgba(252,249,242,0.35)_0_3px,transparent_3px_9px)]"
      aria-hidden
    />
  );
}

function ReadAndSendStep({
  fileInputId,
  fileInputRef,
  selectedFile,
  uploadStatus,
  uploadError,
  sentId,
  isDragging,
  uploadProgress,
  setIsDragging,
  chooseFile,
  openFilePicker,
  clearFile,
  sendFile,
  onBack,
}: SendPanelProps) {
  const reduceMotion = useReducedMotion();
  const [title, ...body] = CALIBRATION.bookPassageParagraphs;

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="shrink-0 pb-4"
        aria-label="Recording path"
      >
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[auto_minmax(9.5rem,12rem)_minmax(0,1fr)_minmax(12.5rem,14.5rem)] lg:gap-6">
          <div className="hidden h-12 w-12 lg:block" aria-hidden />
          <div className="flex items-center gap-3">
            <p className="shrink-0 font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] italic leading-none tracking-[-0.02em] text-cream">
              Record{' '}
              <span className="not-italic text-moss">now</span>
            </p>
            <DottedPath />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="shrink-0 font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] italic leading-none tracking-[-0.02em] text-cream">
              Read{' '}
              <span className="not-italic text-moss">now</span>
            </h3>
            <DottedPath />
          </div>
          <div className="flex items-center justify-end gap-3">
            <DottedPath />
            <p className="shrink-0 font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] italic leading-none tracking-[-0.02em] text-cream">
              Send{' '}
              <span className="not-italic text-moss">take</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid min-h-0 flex-1 grid-cols-1 content-start items-start gap-4 overflow-hidden lg:grid-cols-[auto_minmax(9.5rem,12rem)_minmax(0,1fr)_minmax(12.5rem,14.5rem)] lg:gap-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to setup"
          className="my-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/50 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-cream/40 hover:text-cream lg:order-none"
        >
          <ChevronLeft size={22} strokeWidth={1.25} aria-hidden />
        </button>

        <aside className="flex min-h-0 flex-col justify-start border-b border-cream/10 pb-5 lg:border-b-0 lg:pb-0">
          <p className="text-[13px] font-light leading-relaxed text-cream/50">
            {ROOM_TONE.lede}
          </p>
          <p className="mt-4 font-companion text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-cream">
            {ROOM_TONE.durationSeconds}
            <span className="ml-1 text-[1rem] font-medium text-cream/35">s</span>
          </p>
          <ul className="mt-4 space-y-2">
            {ROOM_TONE.rules.map((rule) => (
              <li key={rule} className="flex items-center gap-2.5 text-[13px] text-cream/75">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9fb5aa]" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] font-light leading-relaxed text-cream/35">
            {ROOM_TONE.purpose}
          </p>
        </aside>

        <article className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <p className="shrink-0 text-[13px] font-light text-cream/40">
            Keep recording. Stop when the last line ends.
          </p>
          <div className="mt-3">
            <p className="text-[0.98rem] font-medium tracking-[-0.01em] text-[#9fb5aa]/95">
              {title}
            </p>
            <div className="mt-3 columns-1 gap-x-8 md:columns-2">
              {body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 28)}
                  className="mb-3 break-inside-avoid text-[0.92rem] font-light leading-[1.48] tracking-[-0.01em] text-cream/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-4 text-right font-serif text-[clamp(1.45rem,2.6vw,2rem)] italic leading-none tracking-[-0.02em] text-cream">
              Stop{' '}
              <span className="not-italic text-moss">recording</span>
            </p>
          </div>
        </article>

        <aside className="flex shrink-0 flex-col border-t border-cream/10 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept={UPLOAD_SPEC.acceptAttr}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              chooseFile(event.target.files?.[0] ?? null);
            }}
          />

          {uploadStatus === 'sent' ? (
            <div className="rounded-xl border border-[#9fb5aa]/30 bg-[#9fb5aa]/08 px-3.5 py-3.5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-cream">
                  <Check size={14} strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium tracking-[-0.02em] text-cream">
                    Take received
                  </p>
                  {sentId ? (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/28">
                      Ref {sentId.slice(0, 8)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
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
                className={`group relative flex min-h-[10.5rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-4 py-6 text-center transition-colors duration-200 ${
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
                    {uploadStatus === 'uploading' ? 'Sending…' : 'Send take'}
                  </button>
                  <button
                    type="button"
                    onClick={clearFile}
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
            </div>
          )}

          {uploadError ? (
            <p role="alert" className="mt-2 text-[12px] font-light leading-relaxed text-[#e0a090]">
              {uploadError}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
