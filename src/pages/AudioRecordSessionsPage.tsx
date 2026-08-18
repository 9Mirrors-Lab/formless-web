/**
 * Record Sessions — scripts for author re-records.
 * Keep the spoken lines large and the cues small so this page can sit beside the mic.
 */
import { Fragment } from 'react';

import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import {
  RECORD_SESSION_LIST,
  RECORD_SESSIONS,
  type RecordSession,
  type ScriptBeat,
} from '@/data/audioRecordSessions';

function Cue({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fb5aa]/70">
      {children}
    </p>
  );
}

function SpokenLines({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 space-y-5">
      {lines.map((line, index) => (
        <p
          key={`${index}-${line.slice(0, 24)}`}
          className="font-serif text-[1.2rem] font-light leading-[1.55] tracking-[-0.015em] text-cream sm:text-[1.35rem] sm:leading-[1.5]"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function BeatBlock({ beat }: { beat: ScriptBeat }) {
  return (
    <article className="border-b border-cream/[0.08] py-7 last:border-b-0">
      <Cue>{beat.cue}</Cue>
      <SpokenLines lines={beat.lines} />
    </article>
  );
}

function SessionMeta({ session }: { session: RecordSession }) {
  return (
    <aside className="lg:sticky lg:top-14 lg:col-start-2 lg:row-start-1 lg:row-span-2">
      <section
        id="re-record"
        className="w-full rounded-lg border border-cream/10 bg-[#0a0e0c] px-3 py-3"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9fb5aa]/70">
          {session.sectionTitle}
        </p>
        <h2 className="mt-1 font-serif text-[1.25rem] italic leading-none tracking-[-0.03em] text-cream">
          {session.track}
        </h2>
        <p className="mt-2 text-[11px] font-light leading-snug text-cream/60">
          {session.why}
        </p>

        <ul className="mt-2.5 space-y-1 border-t border-cream/10 pt-2.5">
          {session.reminders.map((item) => (
            <li
              key={item.text}
              className="flex gap-1.5 text-[10px] font-light leading-tight text-cream/55"
            >
              <span
                className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#9fb5aa]"
                aria-hidden
              />
              <span>
                {item.text}{' '}
                {item.href && item.hrefLabel ? (
                  <a
                    href={item.href}
                    className="text-[#9fb5aa] underline decoration-[#9fb5aa]/30 underline-offset-4 hover:text-cream"
                  >
                    {item.hrefLabel}
                  </a>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function SessionScript({ session }: { session: RecordSession }) {
  return (
    <section id="script" className="min-w-0 lg:col-start-1">
      <div className="sticky top-10 z-10 border-b border-cream/10 bg-[#080a09]/92 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-serif text-[1.15rem] italic tracking-[-0.02em] text-cream">
            Script
            <span className="ml-2 not-italic text-moss">{session.track}</span>
          </p>
          <p className="font-mono text-[11px] text-cream/40">
            Save as {session.saveAs}
          </p>
        </div>
      </div>

      <div className="max-w-4xl pt-5">
        <div className="rounded-xl border border-[#9fb5aa]/25 bg-[#9fb5aa]/08 px-5 py-5">
          <Cue>Room</Cue>
          <p className="mt-3 font-companion text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-cream">
            {session.roomSeconds}
            <span className="ml-1 text-[1rem] font-medium text-cream/35">s</span>
          </p>
          <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-cream/75">
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
          <p className="mt-2 text-[13px] font-light leading-relaxed text-cream/55">
            {session.closing.note}
          </p>
          <SpokenLines lines={session.closing.lines} />
        </article>

        <div className="mt-10 mb-20 text-right">
          <p className="font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] italic leading-none tracking-[-0.02em] text-cream">
            Stop <span className="not-italic text-moss">recording</span>
          </p>
          <p className="mt-3 text-[13px] font-light text-cream/40">
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
      <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
        <BrandPageBody>
          <div className="grid items-start gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,22rem)]">
            <div className="min-w-0">
              <BrandPageHeader
                title={RECORD_SESSIONS.title}
                description={RECORD_SESSIONS.lede}
              />
            </div>
            {RECORD_SESSION_LIST.map((session) => (
              <Fragment key={session.id}>
                <SessionMeta session={session} />
                <SessionScript session={session} />
              </Fragment>
            ))}
          </div>
        </BrandPageBody>
      </div>
    </BrandShell>
  );
}
