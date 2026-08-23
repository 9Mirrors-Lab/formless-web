import { formatAudioTime } from '@/data/audioBook';
import { useIntroductionAudio } from '@/hooks/useIntroductionAudio';

type IntroductionPlayerTone = 'dusk' | 'paper';
type IntroductionPlayerLayout = 'orb' | 'bar';

type IntroductionPlayerProps = {
  tone: IntroductionPlayerTone;
  layout: IntroductionPlayerLayout;
  label: string;
};

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden>
      <path d="M0 0v20l16-10L0 0Z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={className} aria-hidden>
      <rect x="0" y="0" width="5" height="20" fill="currentColor" />
      <rect x="11" y="0" width="5" height="20" fill="currentColor" />
    </svg>
  );
}

export function IntroductionPlayer({ tone, layout, label }: IntroductionPlayerProps) {
  const audio = useIntroductionAudio();
  const progress = audio.duration > 0 ? audio.currentTime / audio.duration : 0;
  const disabled = audio.status !== 'ready';
  const dusk = tone === 'dusk';

  const buttonClass =
    layout === 'orb'
      ? dusk
        ? 'flex h-20 w-20 items-center justify-center rounded-full border border-cream/40 bg-cream text-charcoal transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.04] disabled:opacity-40'
        : 'flex h-16 w-16 items-center justify-center rounded-full bg-moss text-cream transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.04] disabled:opacity-40'
      : dusk
        ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/35 text-cream disabled:opacity-40'
        : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream disabled:opacity-40';

  const glyphClass = layout === 'orb' ? 'h-11 w-9' : 'h-5 w-4';
  const playShift = layout === 'orb' ? 'ml-1' : 'ml-0.5';
  const metaClass = dusk ? 'text-cream/70' : 'text-charcoal/55';
  const trackClass = dusk ? 'bg-cream/20' : 'bg-charcoal/12';
  const fillClass = dusk ? 'bg-cream' : 'bg-moss';

  return (
    <div className={layout === 'orb' ? 'flex flex-col items-center gap-5' : 'flex w-full items-center gap-3'}>
      {audio.src ? (
        <audio ref={audio.audioRef} src={audio.src} preload="metadata" />
      ) : null}

      <button
        type="button"
        onClick={audio.toggle}
        disabled={disabled}
        aria-label={audio.playing ? `Pause ${label}` : `Play ${label}`}
        className={buttonClass}
      >
        {audio.playing ? (
          <PauseGlyph className={glyphClass} />
        ) : (
          <PlayGlyph className={`${playShift} ${glyphClass}`} />
        )}
      </button>

      <div className={layout === 'orb' ? 'flex w-56 flex-col items-center gap-2' : 'min-w-0 flex-1'}>
        {layout === 'bar' ? (
          <p className={`mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.18em] ${metaClass}`}>
            {label}
          </p>
        ) : (
          <p className={`font-sans text-[10px] font-medium uppercase tracking-[0.22em] ${metaClass}`}>
            {label}
          </p>
        )}

        <div
          className={`relative h-[2px] w-full overflow-hidden ${trackClass}`}
          role="slider"
          aria-label="Introduction position"
          aria-valuemin={0}
          aria-valuemax={Math.round(audio.duration)}
          aria-valuenow={Math.round(audio.currentTime)}
          tabIndex={disabled ? -1 : 0}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            if (rect.width <= 0) return;
            audio.seekRatio((event.clientX - rect.left) / rect.width);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') audio.seekRatio(progress + 0.05);
            if (event.key === 'ArrowLeft') audio.seekRatio(progress - 0.05);
          }}
        >
          <div className={`absolute inset-y-0 left-0 ${fillClass}`} style={{ width: `${progress * 100}%` }} />
        </div>

        <p className={`mt-1 font-mono text-[11px] tabular-nums ${metaClass}`}>
          {audio.status === 'missing'
            ? 'Introduction is being prepared'
            : `${formatAudioTime(audio.currentTime)} / ${formatAudioTime(audio.duration)}`}
        </p>
      </div>
    </div>
  );
}
