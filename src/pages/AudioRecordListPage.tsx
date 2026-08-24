/**
 * Record list — differences marked Record on Book vs audio.
 * Grouped by chapter. Book wording, take wording, and mark times.
 */
import { useEffect, useMemo, useState } from 'react';

import { AudibleDeskTabs } from '@/components/AudibleDeskTabs';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { BrandShell } from '@/components/app-sidebar';
import {
  AUDIO_LISTEN_ORDER,
  canonicalChapterTitle,
  formatChapterIndex,
} from '@/data/audioBook';
import { fetchScriptDiffReviewsByStatus } from '@/lib/scriptDiffReviewApi';
import {
  groupReviewRowsByChapter,
  parseDifferenceFingerprint,
  type DifferenceKind,
  type ScriptDiffReviewDetailRow,
} from '@/lib/scriptDiffReview';

const LABEL_BASE =
  'font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em]';
const LABEL = `${LABEL_BASE} text-[#9fb5aa]`;
const BODY = 'font-sans text-sm leading-relaxed';

const KIND_COPY: Record<
  DifferenceKind,
  { label: string; hint: string; className: string }
> = {
  delete: {
    label: 'Missing from audio',
    hint: 'In the book, not in the take',
    className: 'text-[#c45c4a]',
  },
  insert: {
    label: 'Extra in audio',
    hint: 'In the take, not in the book',
    className: 'text-[#3d7a6a]',
  },
  replace: {
    label: 'Different wording',
    hint: 'Book and take disagree',
    className: 'text-[#c4a04a]',
  },
};

function kindCopy(kind: DifferenceKind): (typeof KIND_COPY)[DifferenceKind] {
  switch (kind) {
    case 'delete':
    case 'insert':
    case 'replace':
      return KIND_COPY[kind];
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function spoken(value: string): string {
  const trimmed = value.trim();
  return trimmed === '' ? '—' : trimmed;
}

function formatMarkedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

function sameInstant(a: string, b: string): boolean {
  const left = new Date(a).getTime();
  const right = new Date(b).getTime();
  if (Number.isNaN(left) || Number.isNaN(right)) return a === b;
  return Math.abs(left - right) < 1000;
}

function countLabel(n: number): string {
  if (n === 1) return '1 line marked to record';
  return `${n} lines marked to record`;
}

function TimestampBlock({
  label,
  iso,
}: {
  label: string;
  iso: string;
}) {
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      <time
        dateTime={iso}
        className="mt-1 block font-sans text-sm text-cream"
      >
        {formatMarkedAt(iso)}
      </time>
      <p className="mt-0.5 truncate font-mono text-[11px] text-cream/40">
        {iso}
      </p>
    </div>
  );
}

function RecordRow({ row }: { row: ScriptDiffReviewDetailRow }) {
  const parsed = parseDifferenceFingerprint(row.fingerprint);
  const kind = parsed ? kindCopy(parsed.kind) : null;
  const createdAt = row.created_at || row.updated_at;
  const showCreated = !sameInstant(createdAt, row.updated_at);

  return (
    <article className="border-t border-cream/[0.08] py-6 first:border-t-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className={`${LABEL_BASE} ${kind?.className ?? 'text-[#9fb5aa]'}`}>
            {kind?.label ?? 'Record'}
          </p>
          {kind ? (
            <p className="mt-1 font-sans text-xs text-cream/45">{kind.hint}</p>
          ) : null}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/40">
          {row.script_model}
        </p>
      </div>

      {parsed ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className={LABEL}>Book</p>
            <p className={`mt-1.5 max-w-[65ch] text-cream ${BODY}`}>
              {spoken(parsed.book)}
            </p>
          </div>
          <div>
            <p className={LABEL}>Audio</p>
            <p className={`mt-1.5 max-w-[65ch] text-cream ${BODY}`}>
              {spoken(parsed.audio)}
            </p>
          </div>
        </div>
      ) : (
        <p className={`mt-4 text-cream/70 ${BODY}`}>{row.fingerprint}</p>
      )}

      {parsed && (parsed.before || parsed.after) ? (
        <p className={`mt-3 max-w-[72ch] text-cream/50 ${BODY}`}>
          Around:{' '}
          <span className="text-cream/70">
            {[parsed.before, parsed.after].filter(Boolean).join(' · ')}
          </span>
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {showCreated ? (
          <TimestampBlock label="First marked" iso={createdAt} />
        ) : null}
        <TimestampBlock
          label={showCreated ? 'Last updated' : 'Marked'}
          iso={row.updated_at}
        />
      </div>
    </article>
  );
}

export default function AudioRecordListPage() {
  const [rows, setRows] = useState<ScriptDiffReviewDetailRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchScriptDiffReviewsByStatus('record');
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        setRows([]);
        return;
      }
      setRows(result.rows);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(
    () => groupReviewRowsByChapter(rows ?? [], AUDIO_LISTEN_ORDER),
    [rows],
  );
  const total = rows?.length ?? 0;

  return (
    <BrandShell activeId="record-list" crumb="Record list" noise={false}>
      <div className="fixed inset-0 z-10 overflow-x-hidden overflow-y-auto bg-[#080a09] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:left-[19rem] md:pb-0">
        <BrandPageBody>
          <BrandPageHeader
            title="Record list"
            description="Lines marked Record on Book vs audio. These are recuts, not script typos."
          />
          <AudibleDeskTabs activeId="record-list" />

          {rows == null ? (
            <p className={`${BODY} text-cream/55`}>Loading marks…</p>
          ) : error ? (
            <p className={`${BODY} text-[#c45c4a]`}>{error}</p>
          ) : total === 0 ? (
            <p className={`${BODY} text-cream/55`}>
              No lines are marked Record yet.
            </p>
          ) : (
            <div className="flex min-w-0 flex-col gap-10">
              <p className={LABEL}>{countLabel(total)}</p>
              {groups.map((group) => {
                const title = canonicalChapterTitle(group.chapterId);
                return (
                  <section key={group.chapterId} className="min-w-0">
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-cream/12 pb-3">
                      <div>
                        <p className={LABEL}>
                          {formatChapterIndex(group.chapterId)} ·{' '}
                          {group.rows.length === 1
                            ? '1 mark'
                            : `${group.rows.length} marks`}
                        </p>
                        <h2 className="mt-1 font-serif text-2xl italic tracking-[-0.02em] text-cream">
                          {title}
                        </h2>
                      </div>
                      <a
                        href={`/audio/script-compare?chapter=${group.chapterId}`}
                        className="font-sans text-sm text-[#c5d9cf] underline decoration-[#c5d9cf]/40 underline-offset-4 hover:text-cream"
                      >
                        Open in book vs audio
                      </a>
                    </div>
                    <div>
                      {group.rows.map((row) => (
                        <RecordRow key={row.id} row={row} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </BrandPageBody>
      </div>
    </BrandShell>
  );
}
