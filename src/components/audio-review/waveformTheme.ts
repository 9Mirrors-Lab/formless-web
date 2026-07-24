/** Dark theme tokens for wavesurfer.js on audio review mockups. */

export const AUDIO_DEMO = {
  original: '/audio/demo-original.wav',
  optimized: '/audio/demo-optimized.wav',
} as const;

export type WaveformAccent = 'muted' | 'moss' | 'clay' | 'ink';

/** Gradient stops for waveColor / progressColor (wavesurfer array = vertical gradient). */
export const WAVE_GRADIENTS: Record<
  WaveformAccent,
  { wave: string[]; progress: string[]; cursor: string; hover: string }
> = {
  muted: {
    wave: ['#1c1f1d', '#3a3f3c', '#6b716c'],
    progress: ['#4a524c', '#8a938c', '#c8ccc4'],
    cursor: '#9fb5aa',
    hover: 'rgba(242, 240, 233, 0.55)',
  },
  moss: {
    wave: ['#0f1a15', '#1f3a2e', '#3d5f4e'],
    progress: ['#2a4a3c', '#6a9a82', '#9fb5aa'],
    cursor: '#9fb5aa',
    hover: 'rgba(159, 181, 170, 0.7)',
  },
  clay: {
    wave: ['#1a1210', '#3a241c', '#6a4030'],
    progress: ['#8a4030', '#d46544', '#e8a090'],
    cursor: '#d46544',
    hover: 'rgba(212, 101, 68, 0.65)',
  },
  ink: {
    wave: ['#0a0a0a', '#1a1a1a', '#3a3a3a'],
    progress: ['#2a2a2a', '#5a5a5a', '#8a8a8a'],
    cursor: '#f2f0e9',
    hover: 'rgba(242, 240, 233, 0.45)',
  },
};
