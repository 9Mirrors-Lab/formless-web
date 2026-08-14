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
            ? `${listenLockup.book} mt-1.5 block text-[1.65rem] tabular-nums leading-none text-cream md:text-[1.85rem]`
            : `${listenLockup.book} mt-1 block text-lg tabular-nums leading-none text-cream/85`
        }
      >
        {runtime}
      </span>
    </p>
  );
}
