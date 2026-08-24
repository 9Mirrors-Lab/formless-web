import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  formatAudioTime,
  type AudioSentence,
} from '@/data/audioBook';
import {
  formatFindingClock,
  formatFindingPlaceLine,
  gapCompareRows,
  gapPlaybackWindow,
  listenChoicesForFinding,
  type GapDecisionChoiceId,
  type ManuscriptFinding,
} from '@/data/audioManuscriptFindings';

function kindHeading(
  finding: ManuscriptFinding,
  resolvedHeard: boolean,
): { kicker: string; title: string } {
  const clock = formatFindingClock(finding);
  switch (finding.kind) {
    case 'wording':
      return {
        kicker: 'Spoken wording',
        title: `Spoken wording at ${clock}`,
      };
    case 'name':
      return {
        kicker: 'Name spelling',
        title: `Spoken name at ${clock}`,
      };
    case 'missing':
      return resolvedHeard
        ? {
            kicker: 'Present in recording',
            title: `Heard in the take at ${clock}`,
          }
        : {
            kicker: 'Possible missing sentence',
            title: `Possible missing sentence at ${clock}`,
          };
    case 'delivery':
      return {
        kicker: 'Delivery / punch',
        title: `Delivery punch at ${clock}`,
      };
    default: {
      const _exhaustive: never = finding.kind;
      return _exhaustive;
    }
  }
}

const LABEL_CLASS =
  'font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#c5d9cf]';
const BODY_CLASS = 'font-sans text-sm leading-relaxed';

type ManuscriptGapCardProps = {
  finding: ManuscriptFinding;
  selected: boolean;
  currentTime: number;
  playing: boolean;
  chapterId: number;
  cues: {
    before: AudioSentence[];
    after: AudioSentence[];
    manuscript: AudioSentence[];
  };
  decision: GapDecisionChoiceId | null;
  /** Waveform + transport rendered under the gap timeline when this card is active. */
  playerSlot?: ReactNode;
  onSelect: () => void;
  onSeek: (time: number) => void;
  onPlayWindow: (start: number, end: number) => void;
  onDecision: (choice: GapDecisionChoiceId) => void;
};

function GapTimeline({
  finding,
  rows,
  resolvedHeard,
}: {
  finding: ManuscriptFinding;
  rows: ReturnType<typeof gapCompareRows>;
  resolvedHeard: boolean;
}) {
  const before = rows.find((row) => row.position === 'before');
  const after = rows.find((row) => row.position === 'after');
  const beforeClock = formatAudioTime(finding.trackStartSeconds);
  const afterClock = formatAudioTime(finding.trackEndSeconds);

  return (
    <div
      className={`rounded-md border px-4 py-4 ${
        resolvedHeard
          ? 'border-[#9fb5aa]/35 bg-[#9fb5aa]/[0.08]'
          : 'border-[#d46544]/35 bg-[#d46544]/[0.08]'
      }`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <p className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-cream/70">
            {beforeClock}
          </p>
          <p className="mt-1 font-sans text-xs text-cream/55">Before sentence</p>
        </div>
        <div className="pb-1 text-center">
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
              resolvedHeard ? 'text-[#c5d9cf]' : finding.kind === 'missing' ? 'text-[#e8a090]' : 'text-[#c5d9cf]'
            }`}
          >
            {finding.kind === 'missing'
              ? resolvedHeard
                ? 'Heard in take'
                : 'Possible gap'
              : 'Spoken line'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] tabular-nums tracking-[0.08em] text-cream/70">
            {afterClock}
          </p>
          <p className="mt-1 font-sans text-xs text-cream/55">After sentence</p>
        </div>
      </div>
      <div
        className="relative mt-3 h-px bg-cream/20"
        aria-hidden
      >
        <span
          className={`absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-cream/35 to-cream/35 ${
            resolvedHeard ? 'via-[#9fb5aa]' : 'via-[#d46544]'
          }`}
        />
        <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
        <span className="absolute right-0 top-1/2 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <p className="font-sans text-[13px] leading-snug text-cream/65 line-clamp-2">
          {before?.bookText}
        </p>
        <p className="text-right font-sans text-[13px] leading-snug text-cream/65 line-clamp-2">
          {after?.bookText}
        </p>
      </div>
    </div>
  );
}

export function ManuscriptGapCard({
  finding,
  selected,
  currentTime,
  playing,
  chapterId,
  cues,
  decision,
  playerSlot,
  onSelect,
  onSeek,
  onPlayWindow,
  onDecision,
}: ManuscriptGapCardProps) {
  const rows = gapCompareRows(finding);
  const window = gapPlaybackWindow(finding);
  const [bookOpen, setBookOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const choices = listenChoicesForFinding(finding);
  const resolvedHeard =
    decision === 'heard' || finding.verifiedListen === 'heard';
  const heading = kindHeading(finding, resolvedHeard);
  const inGap =
    selected &&
    chapterId === finding.chapterId &&
    currentTime >= finding.trackStartSeconds &&
    currentTime < finding.trackEndSeconds;

  useEffect(() => {
    if (!selected) {
      setBookOpen(false);
      setTranscriptOpen(false);
    }
  }, [selected]);

  return (
    <article
      id={finding.id}
      className={`scroll-mt-28 border-b border-cream/10 py-10 ${
        selected ? 'bg-cream/[0.02]' : ''
      }`}
    >
      <header className="max-w-3xl">
        <p className={LABEL_CLASS}>{heading.kicker}</p>
        <h3 className="mt-2 font-serif text-2xl leading-snug tracking-[-0.02em] text-cream md:text-[1.75rem]">
          {heading.title}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {formatFindingPlaceLine(finding)}
        </p>
        {resolvedHeard && finding.kind === 'missing' ? (
          <p className={`mt-3 max-w-2xl ${BODY_CLASS} text-cream/55`}>
            No pickup needed. The Whisper transcript skipped this line; correct the
            cue map when you next refresh chapter timing.
          </p>
        ) : null}
      </header>

      <blockquote
        className={`mt-6 max-w-[62ch] border-l-2 pl-4 ${
          resolvedHeard ? 'border-[#9fb5aa]' : 'border-[#d46544]'
        }`}
      >
        <p className="font-serif text-xl leading-relaxed text-cream md:text-2xl">
          “{finding.finalScriptText}”
        </p>
        {inGap && playing ? (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#e8a090]">
            Listening inside highlighted window
          </p>
        ) : null}
      </blockquote>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => {
            onSelect();
            onPlayWindow(window.start, window.end);
          }}
          className="inline-flex h-12 items-center rounded-full bg-clay px-5 font-sans text-sm font-medium text-cream transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
        >
          Play this section
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {formatAudioTime(window.start)}–{formatAudioTime(window.end)}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">
            Aligned comparison of book sentences and the recording
          </caption>
          <thead>
            <tr className="border-b border-cream/15">
              <th scope="col" className={`pb-3 pr-4 ${LABEL_CLASS} font-semibold`}>
                Position
              </th>
              <th scope="col" className={`pb-3 pr-4 ${LABEL_CLASS} font-semibold`}>
                In the book
              </th>
              <th scope="col" className={`pb-3 ${LABEL_CLASS} font-semibold`}>
                In the recording
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isGap = row.position === 'gap';
              const gapAlert = isGap && !resolvedHeard;
              return (
                <tr
                  key={row.position}
                  className={`border-b border-cream/10 align-top ${
                    gapAlert
                      ? 'bg-[#d46544]/[0.1]'
                      : isGap
                        ? 'bg-[#9fb5aa]/[0.08]'
                        : ''
                  }`}
                >
                  <th
                    scope="row"
                    className={`py-4 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] ${
                      gapAlert
                        ? 'text-[#e8a090]'
                        : isGap
                          ? 'text-[#c5d9cf]'
                          : 'text-cream/45'
                    }`}
                  >
                    {row.label}
                  </th>
                  <td className="py-4 pr-4">
                    <p
                      className={`max-w-[42ch] font-serif text-[1.05rem] leading-relaxed ${
                        isGap ? 'text-cream' : 'text-cream/80'
                      }`}
                    >
                      “{row.bookText}”
                    </p>
                  </td>
                  <td className="py-4">
                    {row.recordingHeard && row.atSeconds != null ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelect();
                          onSeek(row.atSeconds!);
                        }}
                        className="font-sans text-sm text-[#c5d9cf] underline decoration-[#c5d9cf]/35 underline-offset-4 transition-colors hover:text-cream"
                      >
                        {row.recordingLabel}
                      </button>
                    ) : (
                      <p
                        className={`font-sans text-sm ${
                          gapAlert ? 'italic text-[#e8a090]' : 'text-cream/45'
                        }`}
                      >
                        {row.recordingLabel}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4">
        <GapTimeline finding={finding} rows={rows} resolvedHeard={resolvedHeard} />

        {playerSlot ? (
          <div className="border border-cream/12 bg-[#0c100e] px-3 py-3 md:px-4">
            {playerSlot}
          </div>
        ) : null}
      </div>

      <div className="mt-10 max-w-2xl">
        <p className="font-sans text-base text-cream">{finding.decision}</p>
        {choices.length > 0 && !resolvedHeard ? (
          <div className="mt-4 flex flex-col gap-2" role="group" aria-label="Listen decision">
            {choices.map((choice) => {
              const active = decision === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onDecision(choice.id)}
                  className={`min-h-11 rounded-md border px-4 py-3 text-left font-sans text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 ${
                    active
                      ? 'border-clay bg-clay/20 text-cream'
                      : 'border-cream/12 text-cream/75 hover:border-cream/25 hover:bg-cream/[0.03] hover:text-cream'
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-8 max-w-3xl space-y-2 border-t border-cream/10 pt-6">
        <details
          className="group"
          open={bookOpen}
          onToggle={(event) => setBookOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none font-sans text-sm text-cream/60 transition-colors hover:text-cream [&::-webkit-details-marker]:hidden">
            <span className="underline decoration-cream/25 underline-offset-4">
              View full book context
            </span>
          </summary>
          <p className={`mt-3 whitespace-pre-wrap ${BODY_CLASS} text-cream/70`}>
            {finding.gapContext?.fullBookParagraph?.trim() ||
              [
                finding.gapContext?.beforeBookText,
                finding.finalScriptText,
                finding.gapContext?.afterBookText,
              ]
                .filter(Boolean)
                .join(' ')}
          </p>
        </details>

        <details
          className="group"
          open={transcriptOpen}
          onToggle={(event) => setTranscriptOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none font-sans text-sm text-cream/60 transition-colors hover:text-cream [&::-webkit-details-marker]:hidden">
            <span className="underline decoration-cream/25 underline-offset-4">
              View full recording transcript
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            {cues.manuscript.length > 0 ? (
              cues.manuscript.map((sentence) => (
                <button
                  key={sentence.id}
                  type="button"
                  onClick={() => {
                    onSelect();
                    onSeek(sentence.start);
                  }}
                  className="block w-full text-left transition-colors hover:text-cream"
                >
                  <span className="font-sans text-[15px] leading-relaxed text-cream/70">
                    {sentence.text}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-cream/30">
                    {formatAudioTime(sentence.start)}
                  </span>
                </button>
              ))
            ) : (
              <p className={`${BODY_CLASS} text-cream/50`}>
                {finding.trackNote}
              </p>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}
