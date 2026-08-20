import { listenLockup } from '@/components/audio-review/advanceListenType';
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
      <span className={`${listenLockup.chrome} block text-[10px] text-cream/55`}>
        Runtime
      </span>
      <span
        className={
          isFolio
            ? 'mt-1 block font-mono text-[12px] tabular-nums leading-none tracking-wide text-cream/70'
            : `${listenLockup.book} mt-1 block text-lg tabular-nums leading-none text-cream/85`
        }
      >
        {runtime}
      </span>
    </p>
  );
}
