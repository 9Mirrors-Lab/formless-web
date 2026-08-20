/**
 * Record Sessions — scripts for author re-records.
 * Title is the only display size. Instructions stay body. Spoken lines stay large for the mic.
 * Manuscript diffs (ARC vs track) sit above the open re-record script.
 * Alignment uses the same tap-a-line → seek pattern as listen read-along.
 */
import { ExternalLink, Layers, Pause, Play, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import {
  AudioCompareMultitrack,
  type AudioCompareHandle,
} from '@/components/audio-review/AudioCompareMultitrack';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import {
  formatAudioTime,
  formatChapterIndex,
  type AudioSentence,
} from '@/data/audioBook';
import {
  formatFindingClock,
  manuscriptDiffFindings,
  trackCueWindow,
  type ManuscriptFinding,
  type ManuscriptPlace,
} from '@/data/audioManuscriptFindings';
import {
  RECORD_SESSION_LIST,
  RECORD_SESSIONS,
  WAV_EXPORT_STEPS,
  type RecordSession,
} from '@/data/audioRecordSessions';
import { useAudiobookReview } from '@/hooks/useAudiobookReview';

const LABEL_CLASS =
  'font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#c5d9cf]';
const BODY_CLASS = 'font-sans text-sm leading-relaxed';
const DRIVE_BUTTON_CLASS =
  'inline-flex h-11 items-center gap-1.5 rounded-full bg-clay px-4 font-sans text-sm font-medium text-cream transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80';

function kindLabel(kind: ManuscriptFinding['kind']): string {
  switch (kind) {
    case 'missing':
      return 'Gap in audio track script';
    case 'wording':
      return 'Wording differs';
    case 'name':
      return 'Name spelling';
    case 'delivery':
      return 'Delivery / punch';
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

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

function SaveHelperMark() {
  return (
    <span
      className="record-helper-mark inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-visible rounded-full border border-clay/25 bg-clay/[0.12]"
      aria-hidden
    >
      <TeachingIconMark
        id="space"
        theme="dark"
        size={44}
        animate={false}
        className="pointer-events-none"
      />
    </span>
  );
}

function SaveBlock({ fileName }: { fileName: string }) {
  return (
    <div className="mt-10 mb-20 max-w-3xl border-t border-cream/12 pt-6">
      <div className="flex items-center gap-4 py-3">
        <SaveHelperMark />
        <div className="min-w-0">
          <p className="font-sans text-sm text-cream">Save as WAV in Audacity</p>
          <p className="mt-0.5 font-mono text-sm text-cream/55">{fileName}</p>
        </div>
      </div>
      <ol className={`${BODY_CLASS} mt-1 list-decimal space-y-2 pl-5 text-cream/70`}>
        {WAV_EXPORT_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
        <li>
          Name the file <span className="font-mono text-cream">{fileName}</span>
        </li>
      </ol>
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

function BookPlace({ place }: { place: ManuscriptPlace }) {
  return (
    <div className="space-y-1">
      <p className="font-sans text-sm text-cream">{place.chapter}</p>
      {(place.section || place.page) && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {[place.section, place.page].filter(Boolean).join(' · ')}
        </p>
      )}
      <p className={`${BODY_CLASS} text-cream/55`}>{place.landmark}</p>
    </div>
  );
}

type AlignmentListenProps = {
  findings: readonly ManuscriptFinding[];
  activeFindingId: string | null;
  currentTime: number;
  playing: boolean;
  chapterId: number;
  chapterTitle: string;
  chapterLength: number;
  originalUrl: string | null | undefined;
  optimizedUrl: string | null | undefined;
  source: 'original' | 'optimized';
  audioLoading: boolean;
  playerRef: RefObject<AudioCompareHandle | null>;
  onSelectFinding: (finding: ManuscriptFinding) => void;
  onSeekCue: (finding: ManuscriptFinding, time: number) => void;
  onTogglePlay: () => void;
  onTimeUpdate: (time: number) => void;
  onReady: () => void;
  onSourceChange: (source: 'original' | 'optimized') => void;
};

function TrackCueButton({
  sentence,
  active,
  onSeek,
}: {
  sentence: AudioSentence;
  active: boolean;
  onSeek: () => void;
}) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={onSeek}
      className={`block w-full text-left transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        active ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
      }`}
    >
      <span
        className={`font-sans text-[15px] leading-relaxed ${
          active ? 'underline decoration-[#9fb5aa]/50 underline-offset-4' : ''
        }`}
      >
        {sentence.text}
      </span>
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-cream/30">
        {formatAudioTime(sentence.start)}
      </span>
    </button>
  );
}

function ManuscriptDiffPanel({
  findings,
  activeFindingId,
  currentTime,
  playing,
  chapterId,
  chapterTitle,
  chapterLength,
  originalUrl,
  optimizedUrl,
  source,
  audioLoading,
  playerRef,
  onSelectFinding,
  onSeekCue,
  onTogglePlay,
  onTimeUpdate,
  onReady,
  onSourceChange,
}: AlignmentListenProps) {
  if (findings.length === 0) return null;

  const activeFinding =
    findings.find((row) => row.id === activeFindingId) ?? findings[0] ?? null;

  return (
    <section
      id="manuscript-diffs"
      className="scroll-mt-16 border-b border-cream/12 pb-10"
      aria-labelledby="manuscript-diffs-heading"
    >
      <p className={LABEL_CLASS}>Script alignment</p>
      <h2
        id="manuscript-diffs-heading"
        className="mt-1 font-serif text-lg italic leading-snug tracking-[-0.02em] text-cream"
      >
        Final book script vs audio track script
      </h2>
      <p className={`mt-3 max-w-2xl ${BODY_CLASS} text-cream/55`}>
        Book side shows where to open the ARC. Take side is the Whisper-timed track script;
        tap a line to jump the playhead, same as read-along.
      </p>

      {activeFinding ? (
        <div className="sticky top-14 z-10 mt-6 border border-cream/12 bg-[#0c100e]/96 px-3 py-3 backdrop-blur-md md:px-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex h-11 w-11 items-center justify-center bg-clay text-cream transition-colors hover:bg-clay/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
              aria-label={playing ? 'Pause take' : 'Play take'}
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm text-cream">
                {formatChapterIndex(chapterId)} · {chapterTitle || activeFinding.finalPlace.chapter}
              </p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
                {activeFinding.trackFile} · {formatFindingClock(activeFinding)} ·{' '}
                {formatAudioTime(currentTime)} / {formatAudioTime(chapterLength)}
              </p>
            </div>
            {!activeFindingId ? (
              <p className={`${BODY_CLASS} text-cream/45`}>Tap a take line to scrub</p>
            ) : null}
          </div>
          <div className="mt-3 min-h-[72px]">
            <AudioCompareMultitrack
              ref={playerRef}
              originalUrl={originalUrl}
              optimizedUrl={optimizedUrl}
              activeSource={source}
              playing={playing}
              loading={audioLoading}
              durationSeconds={chapterLength || null}
              optimizedOnly
              trackHeight={56}
              onSourceChange={onSourceChange}
              onTimeUpdate={onTimeUpdate}
              onReady={onReady}
            />
          </div>
        </div>
      ) : null}

      <ul className="mt-8 divide-y divide-cream/10 border-y border-cream/12">
        {findings.map((finding) => {
          const cues = trackCueWindow(finding);
          const selected = activeFindingId === finding.id;
          const showGap = finding.kind === 'missing';
          const isCueActive = (sentence: AudioSentence) =>
            selected &&
            chapterId === finding.chapterId &&
            currentTime >= sentence.start &&
            currentTime < sentence.end;

          return (
            <li
              key={finding.id}
              id={finding.id}
              className={`scroll-mt-28 py-8 ${selected ? 'bg-cream/[0.02]' : ''}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="font-sans text-sm text-cream">
                  {finding.finalPlace.chapter}
                  <span className="text-cream/40"> · </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/50">
                    {finding.trackFile}
                  </span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
                  {kindLabel(finding.kind)}
                </p>
              </div>
              <p className={`mt-2 max-w-3xl ${BODY_CLASS} text-cream/70`}>{finding.decision}</p>

              <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="min-w-0">
                  <p className={LABEL_CLASS}>In the book</p>
                  <div className="mt-3">
                    <BookPlace place={finding.finalPlace} />
                  </div>
                  <p className="mt-5 max-w-[62ch] font-serif text-lg leading-relaxed text-cream md:text-xl">
                    {finding.finalScriptText.trim().length > 0
                      ? finding.finalScriptText
                      : '(not in the final script)'}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className={LABEL_CLASS}>In the take</p>
                    <button
                      type="button"
                      onClick={() => onSelectFinding(finding)}
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#c5d9cf] underline decoration-[#c5d9cf]/35 underline-offset-4 transition-colors hover:text-cream"
                    >
                      Jump {formatFindingClock(finding)}
                    </button>
                  </div>
                  <p className={`mt-3 ${BODY_CLASS} text-cream/55`}>{finding.trackNote}</p>

                  <div className="mt-4 space-y-3" role="list" aria-label="Track script cues">
                    {cues.before.map((sentence) => (
                      <TrackCueButton
                        key={sentence.id}
                        sentence={sentence}
                        active={isCueActive(sentence)}
                        onSeek={() => onSeekCue(finding, sentence.start)}
                      />
                    ))}

                    {showGap ? (
                      <p className="border-y border-dashed border-cream/20 py-3 font-sans text-sm italic text-cream/50">
                        Gap here
                        {finding.finalScriptText.trim().length > 0
                          ? ` · book has: “${finding.finalScriptText.slice(0, 72)}${
                              finding.finalScriptText.length > 72 ? '…' : ''
                            }”`
                          : ' · nothing in the audio track script at this spot'}
                      </p>
                    ) : null}

                    {cues.after.map((sentence) => (
                      <TrackCueButton
                        key={sentence.id}
                        sentence={sentence}
                        active={isCueActive(sentence)}
                        onSeek={() => onSeekCue(finding, sentence.start)}
                      />
                    ))}

                    {!showGap &&
                    finding.trackScriptText.trim().length > 0 &&
                    !cues.manuscript.some(
                      (cue) =>
                        cue.text.trim().toLowerCase() ===
                        finding.trackScriptText.trim().toLowerCase(),
                    ) ? (
                      <button
                        type="button"
                        onClick={() => onSeekCue(finding, finding.trackStartSeconds)}
                        className="block w-full text-left text-cream/70 transition-colors hover:text-cream"
                      >
                        <span className="font-sans text-[15px] leading-relaxed">
                          {finding.trackScriptText}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-cream/30">
                          {formatAudioTime(finding.trackStartSeconds)}
                        </span>
                      </button>
                    ) : null}

                    {cues.manuscript.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => onSeekCue(finding, finding.trackStartSeconds)}
                        className="block w-full text-left text-cream/50 transition-colors hover:text-cream"
                      >
                        <span className="font-sans text-[15px] leading-relaxed">
                          {finding.trackScriptText.trim().length > 0
                            ? finding.trackScriptText
                            : 'No timed cues loaded for this chapter yet. Jump to the noted clock.'}
                        </span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
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

        <div className="mt-10 text-right">
          <p className={LABEL_CLASS}>Stop recording</p>
          <p className={`mt-2 ${BODY_CLASS} text-cream/55`}>{session.stopCue}</p>
        </div>

        <SaveBlock fileName={session.saveAs} />
      </div>
    </section>
  );
}

export default function AudioRecordSessionsPage() {
  const diffFindings = manuscriptDiffFindings();
  const initialChapterId = diffFindings[0]?.chapterId ?? 2;
  const playerRef = useRef<AudioCompareHandle>(null);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const pendingSeekRef = useRef<number | null>(null);

  const onSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const review = useAudiobookReview({
    initialChapterId,
    onSeek,
  });

  const {
    chapterId,
    chapter,
    selectChapter,
    seek,
    setPlaying,
    playing,
    currentTime,
    setCurrentTime,
    originalUrl,
    optimizedUrl,
    source,
    setSource,
    audioLoading,
    audioReady,
    setAudioReady,
  } = review;

  const jumpToFinding = useCallback(
    (finding: ManuscriptFinding, time = finding.trackStartSeconds) => {
      setActiveFindingId(finding.id);
      pendingSeekRef.current = time;
      if (chapterId !== finding.chapterId) {
        selectChapter(finding.chapterId);
        return;
      }
      if (audioReady) {
        pendingSeekRef.current = null;
        seek(time);
        setPlaying(true);
      }
    },
    [audioReady, chapterId, seek, selectChapter, setPlaying],
  );

  useEffect(() => {
    if (pendingSeekRef.current == null) return;
    if (!audioReady) return;
    const next = pendingSeekRef.current;
    pendingSeekRef.current = null;
    seek(next);
    setPlaying(true);
  }, [audioReady, chapterId, seek, setPlaying]);

  return (
    <BrandShell activeId="record-sessions" crumb="Record Sessions" noise={false}>
      <div className="fixed inset-0 z-10 overflow-x-hidden overflow-y-auto bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <SessionToast fileName={RECORD_SESSION_LIST[0]?.saveAs ?? ''} />
        <BrandPageBody>
          <div className="flex min-w-0 flex-col gap-6">
            <BrandPageHeader title={RECORD_SESSIONS.title} />
            <ManuscriptDiffPanel
              findings={diffFindings}
              activeFindingId={activeFindingId}
              currentTime={currentTime}
              playing={playing}
              chapterId={chapterId}
              chapterTitle={chapter.title}
              chapterLength={chapter.length}
              originalUrl={originalUrl}
              optimizedUrl={optimizedUrl}
              source={source}
              audioLoading={audioLoading}
              playerRef={playerRef}
              onSelectFinding={(finding) => jumpToFinding(finding)}
              onSeekCue={(finding, time) => jumpToFinding(finding, time)}
              onTogglePlay={() => {
                if (!activeFindingId && diffFindings[0]) {
                  jumpToFinding(diffFindings[0]);
                  return;
                }
                setPlaying(!playing);
              }}
              onTimeUpdate={setCurrentTime}
              onReady={() => setAudioReady(true)}
              onSourceChange={setSource}
            />
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
            <div className="border-t border-cream/12 pt-8">
              <p className={LABEL_CLASS}>Open re-record</p>
            </div>
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
