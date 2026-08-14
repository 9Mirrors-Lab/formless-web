import {
  AUDIO_BOOK,
  formatAudioRuntime,
} from '@/data/audioBook';

type AdvanceListenRuntimeProps = {
  align?: 'left' | 'center' | 'right';
  size?: 'folio' | 'quiet';
};

const ALIGN_CLASS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export function AdvanceListenRuntime({
  align = 'right',
  size = 'folio',
}: AdvanceListenRuntimeProps) {
  const runtime = formatAudioRuntime(AUDIO_BOOK.runtimeSeconds);
  const isFolio = size === 'folio';

  return (
    <p className={ALIGN_CLASS[align]} aria-label={`Runtime ${runtime}`}>
      <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-cream/55">
        Runtime
      </span>
      <span
        className={
          isFolio
            ? 'mt-1.5 block font-serif text-[1.65rem] italic tabular-nums leading-none text-cream md:text-[1.85rem]'
            : 'mt-1 block font-serif text-lg italic tabular-nums leading-none text-cream/85'
        }
      >
        {runtime}
      </span>
    </p>
  );
}
