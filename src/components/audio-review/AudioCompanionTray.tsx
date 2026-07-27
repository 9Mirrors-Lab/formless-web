/**
 * Author recording companion — slide-out tray
 *
 * Three steps only: room tone → read calibration → send WAV/M4A.
 * Upload is the job of step 3; format notes stay one line.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Upload, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
  CALIBRATION,
  COMPANION_KIT,
  COMPANION_SECTIONS,
  ROOM_TONE,
  UPLOAD_SPEC,
  type CompanionSectionId,
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

const SECTION_ANCHORS: Record<CompanionSectionId, string> = {
  room: 'companion-room-tone',
  calibration: 'companion-calibration',
  send: 'companion-send',
};

export function AudioCompanionTray({ open, onClose }: AudioCompanionTrayProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const fileInputId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<CompanionSectionId>('room');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setActiveSection('room');
      return;
    }
    const root = scrollRef.current;
    if (!root) return;

    const nodes = COMPANION_SECTIONS.map((section) =>
      root.querySelector<HTMLElement>(`#${SECTION_ANCHORS[section.id]}`),
    ).filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const match = COMPANION_SECTIONS.find(
          (section) => SECTION_ANCHORS[section.id] === visible.target.id,
        );
        if (match) setActiveSection(match.id);
      },
      { root, rootMargin: '-12% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [open]);

  const scrollToSection = (id: CompanionSectionId) => {
    const root = scrollRef.current;
    const target = root?.querySelector<HTMLElement>(`#${SECTION_ANCHORS[id]}`);
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setActiveSection(id);
  };

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

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close companion kit"
            className="absolute inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 36 }
            }
            className="absolute inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col border-l border-cream/10 bg-[#0c100e] font-companion text-cream shadow-[-20px_0_48px_rgba(0,0,0,0.4)] md:max-w-[30rem]"
          >
            <header className="relative z-[1] flex shrink-0 items-start justify-between gap-4 border-b border-cream/10 px-5 py-4 md:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9fb5aa]/80">
                  {COMPANION_KIT.imprint} · {COMPANION_KIT.book}
                </p>
                <h2
                  id={titleId}
                  className="mt-1.5 text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-cream"
                >
                  Recording companion
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-full border border-cream/15 p-2.5 text-cream/50 transition-colors duration-200 hover:border-cream/35 hover:text-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>

            <nav
              aria-label="Recording steps"
              className="relative z-[1] flex shrink-0 gap-1 border-b border-cream/10 px-4 py-3 md:px-5"
            >
              {COMPANION_SECTIONS.map((section, index) => {
                const selected = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`flex min-h-11 min-w-0 flex-1 flex-col items-start justify-center rounded-xl px-2.5 py-2 text-left transition-colors duration-200 ${
                      selected
                        ? 'bg-moss text-cream'
                        : 'text-cream/45 hover:bg-cream/[0.04] hover:text-cream/75'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-medium tabular-nums tracking-[0.16em] ${
                        selected ? 'text-cream/70' : 'text-cream/30'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-0.5 truncate text-[11px] font-medium tracking-[-0.01em]">
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div
              ref={scrollRef}
              className="relative z-[1] min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-14 pt-6 md:px-6"
            >
              {/* 01 Room tone */}
              <section id={SECTION_ANCHORS.room} className="scroll-mt-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/35">
                  01 · {ROOM_TONE.name}
                </p>
                <h3 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-cream">
                  {ROOM_TONE.headline}
                </h3>
                <ol className="mt-6 space-y-0">
                  {ROOM_TONE.rules.map((rule, i) => (
                    <li
                      key={rule}
                      className="flex items-baseline gap-3 border-t border-cream/10 py-3.5 first:border-t-0 first:pt-0"
                    >
                      <span className="text-[11px] font-medium tabular-nums text-cream/30">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-lg font-medium tracking-[-0.02em] text-cream/90">
                        {rule}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm font-light leading-relaxed text-cream/45">
                  {ROOM_TONE.purpose} Start silence only after record is already rolling.
                </p>
              </section>

              {/* 02 Calibration */}
              <section
                id={SECTION_ANCHORS.calibration}
                className="scroll-mt-4 mt-12 border-t border-cream/10 pt-10"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/35">
                  02 · {CALIBRATION.name}
                </p>
                <h3 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-cream">
                  {CALIBRATION.headline}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-cream/45">
                  Read the opening of Chapter One. Stop when the passage ends.
                </p>

                <article className="mt-6 rounded-2xl border border-cream/10 bg-[#101412] px-5 py-7 md:px-6 md:py-8">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9fb5aa]/75">
                    {CALIBRATION.chapterLabel}
                  </p>
                  <div className="mt-6 space-y-6">
                    {CALIBRATION.bookPassageParagraphs.map((paragraph, index) => {
                      const isTitle = index === 0;
                      return (
                        <p
                          key={`${index}-${paragraph.slice(0, 24)}`}
                          className={
                            isTitle
                              ? 'text-[0.95rem] font-medium tracking-[-0.01em] text-[#9fb5aa]/90'
                              : 'max-w-[34ch] text-[1.15rem] font-light leading-[1.7] tracking-[-0.012em] text-cream/92'
                          }
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </article>
              </section>

              {/* 03 Send */}
              <section
                id={SECTION_ANCHORS.send}
                className="scroll-mt-4 mt-12 border-t border-cream/10 pt-10"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/35">
                  03 · {UPLOAD_SPEC.name}
                </p>
                <h3 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-cream">
                  Send your take
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-cream/45">
                  Export your take, then upload here. Room tone first, then the passage.
                </p>
                <p className="mt-3 font-mono text-[12px] tracking-normal text-[#9fb5aa]/85">
                  .wav or .m4a
                  <span className="text-cream/30"> · </span>
                  {UPLOAD_SPEC.channels} · {UPLOAD_SPEC.sampleRate}
                </p>
                <p className="mt-3">
                  <a
                    href="/audio/send-take"
                    className="text-xs font-medium uppercase tracking-[0.14em] text-cream/45 underline-offset-4 transition-colors hover:text-cream/75 hover:underline"
                  >
                    Open phone upload page
                  </a>
                </p>

                {/*
                  Native file input kept in-flow for reliability.
                  accept uses extensions only; MIME lists gray out Finder on macOS.
                */}
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

                <div className="mt-6">
                  {uploadStatus === 'sent' ? (
                    <div className="rounded-2xl border border-[#9fb5aa]/30 bg-[#9fb5aa]/08 px-4 py-5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-moss text-cream">
                          <Check size={15} strokeWidth={2} aria-hidden />
                        </span>
                        <div>
                          <p className="text-base font-medium tracking-[-0.02em] text-cream">
                            Take received
                          </p>
                          <p className="mt-1 text-sm font-light leading-relaxed text-cream/50">
                            Room tone and calibration are in. You can close this tray.
                          </p>
                          {sentId ? (
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/28">
                              Ref {sentId.slice(0, 8)}
                            </p>
                          ) : null}
                          <button
                            type="button"
                            onClick={clearFile}
                            className="mt-3 min-h-10 text-[11px] font-medium uppercase tracking-[0.16em] text-cream/45 transition-colors hover:text-cream/75"
                          >
                            Send another
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl border border-dashed px-4 py-6 transition-colors duration-200 ${
                        isDragging
                          ? 'border-[#9fb5aa]/55 bg-[#9fb5aa]/08'
                          : selectedFile
                            ? 'border-[#9fb5aa]/35 bg-cream/[0.03]'
                            : 'border-cream/20 bg-cream/[0.02]'
                      }`}
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
                    >
                      <div className="flex flex-col items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-[#9fb5aa]">
                          <Upload size={18} strokeWidth={1.75} aria-hidden />
                        </span>
                        <div>
                          <p className="text-base font-medium tracking-[-0.015em] text-cream/90">
                            {selectedFile ? selectedFile.name : 'Choose your file'}
                          </p>
                          <p className="mt-1 text-sm font-light text-cream/40">
                            {selectedFile
                              ? formatFileBytes(selectedFile.size)
                              : 'Drop a file here, or browse'}
                          </p>
                        </div>

                        <div className="mt-1 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={openFilePicker}
                            disabled={uploadStatus === 'uploading'}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-cream/20 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-cream/80 transition-colors hover:border-cream/40 hover:text-cream disabled:opacity-50"
                          >
                            {selectedFile ? 'Choose different' : 'Browse files'}
                          </button>

                          {selectedFile ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void sendFile()}
                                disabled={uploadStatus === 'uploading'}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-moss px-5 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition-opacity hover:opacity-95 disabled:cursor-wait disabled:opacity-70"
                              >
                                {uploadStatus === 'uploading' ? 'Sending…' : 'Send take'}
                              </button>
                              <button
                                type="button"
                                onClick={clearFile}
                                disabled={uploadStatus === 'uploading'}
                                className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-xs font-medium uppercase tracking-[0.12em] text-cream/45 transition-colors hover:text-cream/75 disabled:opacity-50"
                              >
                                Clear
                              </button>
                            </>
                          ) : null}
                        </div>

                        {uploadStatus === 'uploading' && uploadProgress ? (
                          <div className="mt-4 w-full" aria-live="polite">
                            <p className="text-xs font-light leading-relaxed text-cream/55">
                              {uploadProgress.message}
                            </p>
                            <div className="mt-2 flex items-baseline justify-between gap-3 text-[11px] text-cream/40">
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
                              className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10"
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
                    </div>
                  )}

                  {uploadError ? (
                    <p
                      role="alert"
                      className="mt-3 text-sm font-light leading-relaxed text-[#e0a090]"
                    >
                      {uploadError}
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
