import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

import {
  StudioRungTick,
  studioRungExplain,
} from '@/components/audio-review/StudioFileLadder';
import {
  formatAudioTime,
  formatChapterIndex,
  type AudioChapter,
} from '@/data/audioBook';
import type { StudioChapterRecord } from '@/data/audiobookStudioCatalog';
import { STUDIO_RUNGS } from '@/data/studioLadder';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const LADDER_COL_SPAN = 3 + STUDIO_RUNGS.length;

const HEAD =
  'px-1 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-cream/50';

type StudioChapterTableProps = {
  chapters: AudioChapter[];
  records: StudioChapterRecord[];
  expandedId: number | null;
  onToggle: (chapterId: number) => void;
  detail: ReactNode;
};

export function StudioChapterTable({
  chapters,
  records,
  expandedId,
  onToggle,
  detail,
}: StudioChapterTableProps) {
  const reduceMotion = useReducedMotion();
  const recordById = new Map(records.map((record) => [record.chapterId, record]));

  return (
    <TooltipProvider delayDuration={200}>
    <div className="scrollbar-cream min-h-0 flex-1 overflow-auto">
      <table className="w-full caption-bottom border-collapse text-left text-[12px]">
        <thead className="sticky top-0 z-10 bg-[#0d100e]">
          <tr className="border-b border-cream/10">
            <th className={`sticky left-0 z-10 min-w-[9rem] bg-[#0d100e] pl-3 text-left md:min-w-[14rem] ${HEAD}`}>
              Chapter
            </th>
            <th className={`w-12 pr-1 text-right md:w-[4.5rem] md:pr-2 ${HEAD}`}>Time</th>
            {STUDIO_RUNGS.map((rung) => (
              <th
                key={rung.id}
                className={`w-7 text-center md:w-10 ${HEAD}`}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="mx-auto block min-h-11 min-w-7 cursor-help text-center"
                    >
                      {rung.short}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[16rem] border border-cream/10 bg-[#1a1f1c] px-3 py-2 text-left text-[12px] leading-snug text-cream"
                  >
                    <p className="font-medium text-cream">{rung.label}</p>
                    <p className="mt-1 text-cream/65">{rung.truth}</p>
                    {rung.id === 'session-saved' ? (
                      <p className="mt-1.5 text-cream/45">
                        A dashed mark with a slash means this chapter skipped the Audacity project and went straight to WAV.
                      </p>
                    ) : null}
                  </TooltipContent>
                </Tooltip>
              </th>
            ))}
            <th className="w-6 pr-2 md:w-8 md:pr-3" aria-hidden />
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => {
            const record = recordById.get(chapter.id);
            const expanded = expandedId === chapter.id;
            return (
              <Fragment key={chapter.id}>
                <tr
                  className={`border-b border-cream/[0.07] text-cream transition-colors duration-150 ${
                    expanded
                      ? 'bg-cream/[0.045]'
                      : 'hover:bg-cream/[0.03]'
                  }`}
                >
                  <td
                    className={`sticky left-0 p-0 whitespace-normal ${
                      expanded ? 'bg-[#121614]' : 'bg-[#0d100e]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={`${chapter.title}${
                        record ? `, ${record.currentRung.label}` : ''
                      }`}
                      onClick={() => onToggle(chapter.id)}
                      className="flex min-h-11 w-full items-center gap-2 px-3 text-left"
                    >
                      <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-cream/50">
                        {formatChapterIndex(chapter.id)}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate text-[13px] tracking-tight ${
                          expanded ? 'text-cream' : 'text-cream/75'
                        }`}
                      >
                        {chapter.title}
                      </span>
                    </button>
                  </td>
                  <td className="p-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => onToggle(chapter.id)}
                      className="flex min-h-11 w-full items-center justify-end px-2 font-mono text-[11px] tabular-nums text-cream/50"
                    >
                      {formatAudioTime(chapter.length)}
                    </button>
                  </td>
                  {STUDIO_RUNGS.map((rung) => {
                    const state = record?.states[rung.id] ?? 'upcoming';
                    const explain = studioRungExplain(rung.id, state);
                    return (
                      <td key={rung.id} className="p-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={() => onToggle(chapter.id)}
                              className="flex min-h-11 w-full items-center justify-center"
                              aria-label={explain}
                            >
                              <StudioRungTick id={rung.id} state={state} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="max-w-[16rem] border border-cream/10 bg-[#1a1f1c] px-3 py-2 text-left text-[12px] leading-snug text-cream"
                          >
                            {explain}
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                  <td className="p-0 pr-3">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => onToggle(chapter.id)}
                      className="flex min-h-11 w-full items-center justify-center"
                      aria-hidden
                    >
                      <ChevronDown
                        size={14}
                        className={`text-cream/45 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          expanded ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
                {expanded ? (
                  <tr className="border-b border-cream/10">
                    <td colSpan={LADDER_COL_SPAN} className="p-0">
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="border-t border-cream/[0.06] bg-[#101412] px-4 py-4 md:px-5"
                      >
                        {detail}
                      </motion.div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
    </TooltipProvider>
  );
}
