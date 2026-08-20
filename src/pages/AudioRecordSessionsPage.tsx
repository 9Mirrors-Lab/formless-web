/**
 * Record Sessions — scripts for author re-records.
 * Title is the only display size. Instructions stay body. Spoken lines stay large for the mic.
 */
import { useState } from 'react';
import { ExternalLink, Layers, X } from 'lucide-react';

import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  RECORD_SESSION_LIST,
  RECORD_SESSIONS,
  WAV_EXPORT_STEPS,
  type RecordSession,
} from '@/data/audioRecordSessions';

const LABEL_CLASS =
  'font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#c5d9cf]';
const BODY_CLASS = 'font-sans text-sm leading-relaxed';
const DRIVE_BUTTON_CLASS =
  'inline-flex h-11 items-center gap-1.5 rounded-full bg-clay px-4 font-sans text-sm font-medium text-cream transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80';

function Cue({ children }: { children: string }) {
  return <p className={LABEL_CLASS}>{children}</p>;
}

function SpokenLines({ lines }: { lines: string[] }) {
  return (
    <div className="mt-2 space-y-4">
      {lines.map((line, index) => (
        <p
          key={`${index}-${line.slice(0, 24)}`}
          className="max-w-[65ch] font-sans text-xl leading-relaxed text-cream md:text-2xl"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function SessionToast({ fileName }: { fileName: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="sticky top-0 z-20 w-full">
      {open ? (
        <section className="bg-[#2a302c] text-cream">
          <div className="flex items-center gap-3 px-4 py-3 md:px-8 lg:px-10">
            <p className="min-w-0 flex-1 font-sans text-sm text-cream">
              Save as <span className="font-mono">{fileName}</span>
            </p>
            <DriveFolderLink className={`shrink-0 ${DRIVE_BUTTON_CLASS}`} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
              aria-label="Close save tray"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 w-full items-center gap-1.5 bg-[#2a302c] px-4 font-sans text-sm text-cream/70 transition-colors hover:bg-[#343c38] hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 md:px-8 lg:px-10"
          aria-expanded={false}
          aria-label="Open save tray"
        >
          <Layers size={13} aria-hidden />
          Save as {fileName}
        </button>
      )}
    </div>
  );
}

function DriveFolderLink({
  className,
}: {
  className?: string;
}) {
  return (
    <a
      href={RECORD_SESSIONS.uploadFolderHref}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {RECORD_SESSIONS.uploadFolderLabel}
      <ExternalLink size={14} aria-hidden />
    </a>
  );
}

function SaveHelperMark({ open }: { open: boolean }) {
  return (
    <span
      className={[
        'record-helper-mark inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-visible rounded-full border bg-clay/[0.12] transition-colors group-hover:bg-clay/[0.2] group-hover:border-clay/80',
        open ? 'border-clay/25' : 'border-clay/55 record-helper-breathe',
      ].join(' ')}
      aria-hidden
    >
      <TeachingIconMark
        id="space"
        theme="dark"
        size={44}
        animate={!open}
        className="pointer-events-none"
      />
    </span>
  );
}

function SaveBlock({ fileName }: { fileName: string }) {
  const [openItem, setOpenItem] = useState('');
  const wavOpen = openItem === 'wav-export';

  return (
    <div className="mt-4 max-w-3xl border-t border-cream/12 pt-4">
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(value) => setOpenItem(value ?? '')}
        className="w-full"
      >
        <AccordionItem value="wav-export" className="overflow-visible border-cream/12">
          <AccordionTrigger className="group items-center justify-start gap-4 overflow-visible py-3 font-sans text-sm text-cream hover:no-underline hover:text-cream [&>svg]:hidden">
            <SaveHelperMark open={wavOpen} />
            <span className="min-w-0 text-left">
              <span
                className={`block font-mono text-[10px] uppercase tracking-[0.25em] ${
                  wavOpen ? 'text-cream/40' : 'text-clay'
                }`}
              >
                {wavOpen ? 'Hide steps' : 'Export steps'}
              </span>
              <span className="mt-1 block">Save as WAV in Audacity</span>
              <span className={`mt-0.5 block font-mono text-sm ${wavOpen ? 'text-cream/55' : 'text-cream/70'}`}>
                {fileName}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className={`${BODY_CLASS} list-decimal space-y-2 pl-5 text-cream/70`}>
              {WAV_EXPORT_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
              <li>
                Name the file <span className="font-mono text-cream">{fileName}</span>
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <DriveFolderLink className={`mt-4 ${DRIVE_BUTTON_CLASS}`} />
    </div>
  );
}

function BeatBlock({ beat }: { beat: { id: string; cue: string; lines: string[] } }) {
  return (
    <article className="border-b border-cream/[0.08] py-6 last:border-b-0">
      <Cue>{beat.cue}</Cue>
      <SpokenLines lines={beat.lines} />
    </article>
  );
}

function SessionScript({ session }: { session: RecordSession }) {
  return (
    <section id={`${session.id}-script`} className="min-w-0">
      <div className="max-w-3xl">
        <p className={LABEL_CLASS}>Script</p>
        <h2 className="mt-1 font-serif text-lg italic leading-snug tracking-[-0.02em] text-cream">
          {session.track}
        </h2>
        <SaveBlock fileName={session.saveAs} />
      </div>

      <div className="max-w-3xl pt-4">
        {session.beats?.map((beat) => (
          <BeatBlock key={beat.id} beat={beat} />
        ))}

        {session.closing ? (
          <article
            id={`${session.id}-closing`}
            className="rounded-xl border border-clay/40 bg-clay/[0.07] px-5 py-6 md:px-6"
          >
            <Cue>{session.closing.cue}</Cue>
            <p className={`mt-2 ${BODY_CLASS} text-cream/70`}>{session.closing.note}</p>
            <SpokenLines lines={session.closing.lines} />
          </article>
        ) : null}

        <div className="mt-10 mb-20 text-right">
          <p className={LABEL_CLASS}>Stop recording</p>
          <p className={`mt-2 ${BODY_CLASS} text-cream/55`}>{session.stopCue}</p>
        </div>
      </div>
    </section>
  );
}

export default function AudioRecordSessionsPage() {
  return (
    <BrandShell activeId="record-sessions" crumb="Record Sessions" noise={false}>
      <div className="fixed inset-0 z-10 overflow-x-hidden overflow-y-auto bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <SessionToast fileName={RECORD_SESSION_LIST[0]?.saveAs ?? ''} />
        <BrandPageBody>
          <div className="flex min-w-0 flex-col gap-6">
            <BrandPageHeader title={RECORD_SESSIONS.title} />
            {RECORD_SESSION_LIST.length > 1 ? (
              <nav
                aria-label="Sessions"
                className="flex flex-wrap gap-x-4 gap-y-2"
              >
                {RECORD_SESSION_LIST.map((session) => (
                  <a
                    key={session.id}
                    href={`#${session.id}`}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-[#c5d9cf] underline decoration-[#c5d9cf]/40 underline-offset-4 hover:text-cream"
                  >
                    {session.track}
                  </a>
                ))}
              </nav>
            ) : null}
            {RECORD_SESSION_LIST.map((session) => (
              <div
                key={session.id}
                id={session.id}
                className="scroll-mt-16"
              >
                <p className={`max-w-xl ${BODY_CLASS} text-cream/55`}>{session.why}</p>
                <div className="mt-6">
                  <SessionScript session={session} />
                </div>
              </div>
            ))}
          </div>
        </BrandPageBody>
      </div>
    </BrandShell>
  );
}
