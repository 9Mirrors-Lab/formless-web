import { type PointerEvent as ReactPointerEvent } from 'react';

import { formatAudioTime } from '@/data/audioBook';
import type { ReRecordCue } from '@/data/audioReRecords';

type ReRecordMarkerStripProps = {
  durationSeconds: number;
  currentTime: number;
  cues: readonly ReRecordCue[];
  activeCueId?: string | null;
  onSeek: (time: number) => void;
};

function seekFromClientX(
  clientX: number,
  target: HTMLElement,
  duration: number,
  onSeek: (time: number) => void,
): void {
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0) return;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  onSeek(ratio * duration);
}

/**
 * Full-track scrub line with listen tags at re-record edits.
 * Drag the playhead or click a tag to jump.
 */
export function ReRecordMarkerStrip({
  durationSeconds,
  currentTime,
  cues,
  activeCueId = null,
  onSeek,
}: ReRecordMarkerStripProps) {
  const duration = Math.max(1, durationSeconds);
  const progress = Math.min(1, Math.max(0, currentTime / duration));

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromClientX(event.clientX, event.currentTarget, duration, onSeek);
  };

  const onTrackPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    seekFromClientX(event.clientX, event.currentTarget, duration, onSeek);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
          Listen tags
        </p>
        <p className="font-mono text-[10px] tabular-nums text-cream/40">
          {cues.length} tag{cues.length === 1 ? '' : 's'}
        </p>
      </div>

      <div
        className="relative h-16 cursor-pointer overflow-visible rounded-sm border border-cream/12 bg-[#0e1110] px-1"
        role="slider"
        aria-label="Re-record timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            onSeek(Math.max(0, currentTime - 5));
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            onSeek(Math.min(duration, currentTime + 5));
          }
        }}
      >
        <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-cream/20" />

        <div
          className="pointer-events-none absolute top-1/2 left-3 h-px -translate-y-1/2 bg-[#9fb5aa]/70"
          style={{ width: `calc((100% - 1.5rem) * ${progress})` }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_0_3px_rgba(14,17,16,0.85)]"
          style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${progress})` }}
          aria-hidden
        />

        {cues.map((item) => {
          const left = Math.min(98, Math.max(2, (item.atSeconds / duration) * 100));
          const active = item.id === activeCueId;
          return (
            <button
              key={item.id}
              type="button"
              title={`${formatAudioTime(item.atSeconds)} · ${item.note}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onSeek(item.atSeconds);
              }}
              className={`absolute top-1.5 z-10 -translate-x-1/2 rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? 'bg-moss text-cream'
                  : 'bg-cream/90 text-[#121614] hover:bg-cream'
              }`}
              style={{ left: `${left}%` }}
            >
              <span className="block max-w-[7.5rem] truncate">{item.tag}</span>
              <span
                className={`absolute top-full left-1/2 h-3 w-px -translate-x-1/2 ${
                  active ? 'bg-moss' : 'bg-cream/70'
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
