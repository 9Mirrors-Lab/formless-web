/**
 * Record Sessions — scripts for author re-records.
 * Keep spoken lines large and cues readable so this page can sit beside the mic.
 */
import { Fragment, useState } from 'react';
import { Layers, X } from 'lucide-react';

import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import {
  RECORD_SESSION_LIST,
  RECORD_SESSIONS,
  type RecordSession,
  type ScriptBeat,
} from '@/data/audioRecordSessions';

const CUE_CLASS =
  'text-[1.125rem] font-bold tracking-[0.04em] text-[#c5d9cf]';

function Cue({ children }: { children: string }) {
  return <p className={CUE_CLASS}>{children}</p>;
}

function SpokenLines({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 space-y-4">
      {lines.map((line, index) => (
        <p
          key={`${index}-${line.slice(0, 24)}`}
          className="max-w-[65ch] font-sans text-[1.375rem] font-medium leading-[1.55] tracking-[0.01em] text-cream md:text-[1.5rem]"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function BeatBlock({ beat }: { beat: ScriptBeat }) {
  return (
    <article className="border-b border-cream/[0.08] py-8 last:border-b-0">
      <Cue>{beat.cue}</Cue>
      <SpokenLines lines={beat.lines} />
    </article>
  );
}

function SessionToast({ notes }: { notes: string[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="sticky top-0 z-20 w-full">
      {open ? (
        <section className="bg-[#2a302c] text-cream">
          <div className="flex items-start gap-3 px-4 py-4 md:px-8 lg:px-10">
            <ul className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3 sm:gap-6">
              {notes.map((text) => (
                <li
                  key={text}
                  className="text-sm font-medium leading-snug text-cream/90"
                >
                  {text}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
              aria-label="Close session notes"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 w-full items-center gap-1.5 bg-[#2a302c] px-4 text-[11px] font-medium tracking-wide text-cream/70 transition-colors hover:bg-[#343c38] hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 md:px-8 lg:px-10"
          aria-expanded={false}
          aria-label="Open session notes"
        >
          <Layers size={13} aria-hidden />
          Session notes
        </button>
      )}
    </div>
  );
}

function SessionScript({ session }: { session: RecordSession }) {
  return (
    <section id="script" className="min-w-0">
      <div className="flex max-w-3xl flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="font-serif text-[1.75rem] italic leading-[1.12] tracking-[-0.02em] text-cream">
          Script
          <span className="ml-2 not-italic text-[#c5d9cf]">{session.track}</span>
        </p>
        <p className="font-mono text-[13px] text-cream/55">
          Save as {session.saveAs}
        </p>
      </div>

      <div className="max-w-3xl pt-5">
        <div className="rounded-xl border border-[#9fb5aa]/40 bg-[#9fb5aa]/10 px-5 py-5">
          <Cue>Room</Cue>
          <p className="mt-3 font-companion text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-cream">
            {session.roomSeconds}
            <span className="ml-1 text-[1.125rem] font-medium text-cream/55">s</span>
          </p>
          <p className="mt-3 text-[1.125rem] font-medium leading-relaxed text-cream">
            {session.roomCue}
          </p>
        </div>

        <div className="mt-2">
          {session.beats.map((beat) => (
            <BeatBlock key={beat.id} beat={beat} />
          ))}
        </div>

        <article
          id="closing"
          className="mt-4 rounded-xl border border-clay/40 bg-clay/[0.07] px-5 py-6 md:px-6"
        >
          <Cue>{session.closing.cue}</Cue>
          <p className="mt-2 text-[1.0625rem] font-medium leading-relaxed text-cream/85">
            {session.closing.note}
          </p>
          <SpokenLines lines={session.closing.lines} />
        </article>

        <div className="mt-10 mb-20 text-right">
          <p className="font-serif text-[clamp(1.5rem,2.2vw,1.85rem)] italic leading-[1.12] tracking-[-0.02em] text-cream">
            Stop <span className="not-italic text-[#c5d9cf]">recording</span>
          </p>
          <p className="mt-3 text-[1.0625rem] font-medium text-cream/80">
            {session.stopCue}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AudioRecordSessionsPage() {
  return (
    <BrandShell activeId="record-sessions" crumb="Record Sessions" noise={false}>
      <div className="fixed inset-0 z-10 overflow-x-hidden overflow-y-auto bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <SessionToast
          notes={RECORD_SESSION_LIST.flatMap((session) =>
            session.reminders.map((item) => item.text),
          )}
        />
        <BrandPageBody>
          {RECORD_SESSION_LIST.map((session) => (
            <Fragment key={session.id}>
              <div className="min-w-0">
                <BrandPageHeader title={RECORD_SESSIONS.title} />
                <p
                  id="re-record"
                  className="mt-2 max-w-xl text-sm leading-relaxed text-cream/70"
                >
                  {session.why}
                </p>
              </div>
              <SessionScript session={session} />
            </Fragment>
          ))}
        </BrandPageBody>
      </div>
    </BrandShell>
  );
}
