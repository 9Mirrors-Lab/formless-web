import { useMemo } from 'react';
import WavesurferPlayer from '@wavesurfer/react';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js';

import {
  AUDIO_DEMO,
  WAVE_GRADIENTS,
  type WaveformAccent,
} from '@/components/audio-review/waveformTheme';

type WaveformProps = {
  /** Demo audio URL; defaults by accent (moss → optimized, else original). */
  url?: string;
  /** Kept for call-site compatibility; progress is driven by wavesurfer itself. */
  progress?: number;
  accent?: WaveformAccent;
  height?: number;
  className?: string;
  /** Legacy mock seed; unused once real audio is loaded. */
  seed?: number;
  bars?: number;
};

/**
 * Dark wavesurfer.js waveform via @wavesurfer/react.
 * Gradient fill + Hover plugin (cursor line + timestamp).
 */
export function AudioWaveform({
  url,
  accent = 'muted',
  height = 64,
  className = '',
}: WaveformProps) {
  const colors = WAVE_GRADIENTS[accent];
  const audioUrl =
    url ?? (accent === 'moss' ? AUDIO_DEMO.optimized : AUDIO_DEMO.original);

  const plugins = useMemo(
    () => [
      HoverPlugin.create({
        lineColor: colors.hover,
        lineWidth: 1,
        labelBackground: '#0b0d0c',
        labelColor: '#f2f0e9',
        labelSize: 11,
      }),
    ],
    [colors.hover],
  );

  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden>
      <WavesurferPlayer
        height={height}
        url={audioUrl}
        waveColor={colors.wave}
        progressColor={colors.progress}
        cursorColor={colors.cursor}
        cursorWidth={1}
        barWidth={2}
        barGap={1}
        barRadius={1}
        normalize
        interact
        hideScrollbar
        plugins={plugins}
      />
    </div>
  );
}
