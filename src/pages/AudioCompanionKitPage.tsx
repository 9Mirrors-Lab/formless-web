/**
 * Audiobook companion kit — author session ritual
 *
 * Visual thesis: Dark quiet room; Bricolage Grotesque only (no serif);
 * ritual steps over DAW chrome. Room-tone timer is the one interactive tool.
 * Content plan: verdict → room tone → book calibration → post-approval benchmark → full session.
 * Shares Listen / Companion / Analysis workspace tabs with the editorial page.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioWorkspaceNav } from '@/components/audio-review/AudioWorkspaceNav';
import {
  AFTER_APPROVAL,
  CALIBRATION,
  COMPANION_KIT,
  COMPANION_SECTIONS,
  ROOM_TONE,
  SESSION_FLOW,
} from '@/data/audioCompanionKit';

function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function RoomToneTimer() {
  const reduceMotion = useReducedMotion();
  const duration = ROOM_TONE.durationSeconds;
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clear(), [clear]);

  useEffect(() => {
    if (!running) {
      clear();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clear;
  }, [running, clear]);

  const start = () => {
    setDone(false);
    setRemaining(duration);
    setRunning(true);
  };

  const reset = () => {
    clear();
    setRunning(false);
    setDone(false);
    setRemaining(duration);
  };

  const progress = 1 - remaining / duration;

  return (
    <div className="rounded-[1.75rem] border border-cream/10 bg-[#0f1311] p-6 md:p-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cream/35">
        Live timer · {duration}s
      </p>
      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className={`text-6xl font-semibold tabular-nums tracking-tight md:text-7xl ${
              done ? 'text-[#9fb5aa]' : running ? 'text-cream' : 'text-cream/70'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTimer(remaining)}
          </p>
          <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-cream/45">
            {done
              ? 'Room tone captured. Continue into calibration without stopping the take if your workflow allows.'
              : running
                ? 'Stay still. Let the room speak.'
                : 'Press start when recording has already begun.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={running ? reset : start}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-moss px-6 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
          >
            {running ? 'Reset' : done ? 'Run again' : 'Start 30s'}
          </button>
          {running ? (
            <button
              type="button"
              onClick={() => setRunning(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-cream/20 px-6 text-sm font-medium uppercase tracking-[0.12em] text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
            >
              Pause
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-cream/10" aria-hidden>
        <motion.div
          className="h-full rounded-full bg-[#9fb5aa]"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </div>
    </div>
  );
}

function SectionEyebrow({ index, name }: { index: string; name: string }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cream/40">
      <span className="tabular-nums text-cream/30">{index}</span>
      <span className="mx-2 text-cream/20">·</span>
      {name}
    </p>
  );
}

function CaptureGlyph({ id }: { id: string }) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'hvac':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path {...common} d="M4 12h16M7 8c2 2 2 6 0 8M17 8c-2 2-2 6 0 8M12 5v14" />
        </svg>
      );
    case 'fans':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <circle {...common} cx="12" cy="12" r="2" />
          <path {...common} d="M12 4c3 2 4 4 4 8s-1 6-4 8c-3-2-4-4-4-8s1-6 4-8z" />
        </svg>
      );
    case 'self-noise':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <rect {...common} x="9" y="3" width="6" height="11" rx="3" />
          <path {...common} d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
        </svg>
      );
    case 'ambience':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path {...common} d="M3 14c2-1 3 1 5 0s3 1 5 0 3 1 5 0 3 1 5 0" />
          <path {...common} d="M3 18c2-1 3 1 5 0s3 1 5 0 3 1 5 0 3 1 5 0" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AudioCompanionKitPage() {
  const reduceMotion = useReducedMotion();
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div className="min-h-[100svh] bg-[#0a0c0b] font-companion text-cream antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,64,54,0.28),_transparent_55%)]" />

      <header className="relative border-b border-cream/10 bg-[#0d100e]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3 md:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9fb5aa]/80">
              {COMPANION_KIT.imprint} · {COMPANION_KIT.book}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-cream/35">
              {COMPANION_KIT.eyebrow}
            </p>
          </div>
          <AudioWorkspaceNav active="companion" />
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-10 md:pt-16">
        <section className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-cream md:text-6xl lg:text-[4.1rem]">
            {COMPANION_KIT.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-cream/55">
            {COMPANION_KIT.lede}
          </p>
        </section>

        <nav
          aria-label="Kit sections"
          className="mt-10 flex gap-2 overflow-x-auto pb-1"
        >
          {COMPANION_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={section.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-cream/12 bg-cream/[0.03] px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-cream/55 transition-colors hover:border-[#9fb5aa]/35 hover:text-cream"
            >
              {section.label}
            </a>
          ))}
        </nav>

        {/* Room tone */}
        <section id="room-tone" className="scroll-mt-8 mt-20 md:mt-28">
          <SectionEyebrow index={ROOM_TONE.index} name={ROOM_TONE.name} />
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-cream md:text-5xl">
            {ROOM_TONE.headline}
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-14">
            <div>
              <ol className="space-y-4">
                {ROOM_TONE.rules.map((rule, i) => (
                  <li key={rule} className="flex items-baseline gap-4">
                    <span className="text-[11px] font-medium tabular-nums text-cream/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-2xl font-medium tracking-[-0.02em] text-cream/90 md:text-[1.65rem]">
                      {rule}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-lg text-base font-light leading-relaxed text-cream/50">
                {ROOM_TONE.purpose} The goal is to capture what remains{' '}
                <span className="font-normal text-cream/70">{ROOM_TONE.without}</span>.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ROOM_TONE.captures.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border-b border-cream/10 py-3 text-sm font-light text-cream/65"
                  >
                    <span className="text-[#9fb5aa]">
                      <CaptureGlyph id={item.id} />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <RoomToneTimer />
          </div>
        </section>

        {/* Calibration */}
        <section id="calibration" className="scroll-mt-8 mt-24 border-t border-cream/10 pt-20 md:mt-32 md:pt-24">
          <SectionEyebrow index={CALIBRATION.index} name={CALIBRATION.name} />
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-cream md:text-5xl">
            {CALIBRATION.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-cream/55">
            {CALIBRATION.preferredLede}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {CALIBRATION.matches.map((item) => (
              <span
                key={item}
                className="rounded-full border border-cream/12 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cream/45"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-xl font-medium leading-snug tracking-[-0.015em] text-[#9fb5aa]/90">
            {CALIBRATION.consistencyNote}
          </p>

          <article className="mt-12 rounded-[2rem] border border-cream/10 bg-[#101412] px-6 py-10 md:px-12 md:py-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/35">
              Read aloud · {CALIBRATION.chapterLabel}
            </p>
            <div className="mt-8 whitespace-pre-wrap text-2xl font-light leading-[1.55] tracking-[-0.01em] text-cream md:text-[1.75rem]">
              {CALIBRATION.bookPassage}
            </div>
          </article>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowFallback((open) => !open)}
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/40 transition-colors hover:text-cream/70"
              aria-expanded={showFallback}
            >
              {showFallback ? 'Hide fallback paragraph' : 'Show fallback paragraph'}
            </button>
            <AnimatePresence initial={false}>
              {showFallback ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 max-w-3xl border-l border-cream/15 pl-5"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/35">
                    {CALIBRATION.fallbackTitle}
                  </p>
                  <p className="mt-2 text-sm font-light leading-relaxed text-cream/45">
                    {CALIBRATION.fallbackLede}
                  </p>
                  <p className="mt-5 text-xl font-light leading-relaxed tracking-[-0.01em] text-cream/80">
                    {CALIBRATION.fallbackPassage}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {CALIBRATION.exercises.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-cream/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-cream/40"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {/* After approval */}
        <section id="benchmark" className="scroll-mt-8 mt-24 border-t border-cream/10 pt-20 md:mt-32 md:pt-24">
          <SectionEyebrow index={AFTER_APPROVAL.index} name={AFTER_APPROVAL.name} />
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-cream md:text-5xl">
            {AFTER_APPROVAL.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-cream/55">
            {AFTER_APPROVAL.lede}
          </p>

          <ol className="mt-12 grid gap-0 md:grid-cols-2">
            {AFTER_APPROVAL.steps.map((step, index) => (
              <li
                key={step.id}
                className="border-t border-cream/10 py-8 md:border-cream/10 md:px-6 md:odd:border-r md:odd:pr-10 md:even:pl-10"
              >
                <p className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-[#9fb5aa]/70">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-cream">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-cream/50">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Full session */}
        <section id="session" className="scroll-mt-8 mt-24 border-t border-cream/10 pt-20 md:mt-32 md:pt-24">
          <SectionEyebrow index={SESSION_FLOW.index} name={SESSION_FLOW.name} />
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-cream md:text-5xl">
            {SESSION_FLOW.headline}
          </h2>

          <ol className="mt-12 max-w-xl">
            {SESSION_FLOW.steps.map((step, index) => {
              const isLast = index === SESSION_FLOW.steps.length - 1;
              return (
                <li key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
                  {!isLast ? (
                    <span
                      className="absolute left-[0.85rem] top-8 h-[calc(100%-1.25rem)] w-px bg-cream/12"
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream/20 bg-[#0a0c0b] text-[10px] font-medium tabular-nums text-cream/50">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-xl font-medium tracking-[-0.02em] text-cream md:text-2xl">
                      {step.label}
                    </p>
                    {'note' in step && step.note ? (
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9fb5aa]/75">
                        {step.note}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="mt-24 border-t border-cream/10 pt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/30">
            Formless recording companion · Eyes Closed
          </p>
        </footer>
      </main>
    </div>
  );
}
