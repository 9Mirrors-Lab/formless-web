/** Analysis report for Formless audiobook chapter masters (client editorial). */

export type AnalysisVerdict = 'pass' | 'action' | 'guide';

export type ChapterValue = {
  label: string;
  value: number;
  unit?: string;
};

export type MicroAction = {
  id: string;
  title: string;
  detail: string;
  tone: AnalysisVerdict;
};

export type AnalysisMetricId =
  | 'lufs'
  | 'lra'
  | 'rms'
  | 'peak'
  | 'crest'
  | 'noise'
  | 'silence'
  | 'spectral'
  | 'hpf'
  | 'compression'
  | 'limiter';

export type AnalysisMetric = {
  id: AnalysisMetricId;
  index: string;
  name: string;
  shortName: string;
  verdict: AnalysisVerdict;
  headline: string;
  question: string;
  answer: string;
  why: string;
  chart: 'bars' | 'range' | 'legacy' | 'spike' | 'crest' | 'floor' | 'share' | 'spectrum' | 'hpf' | 'compress' | 'ceiling';
  values?: ChapterValue[];
  single?: { label: string; value: number; unit: string };
  spectrum?: { low: number; mid: number; high: number };
  share?: number;
  notes?: string[];
};

export const AUDIO_ANALYSIS_VERDICT = {
  eyebrow: 'Recording analysis',
  title: 'The narrator sounds consistent.',
  lede: 'Keep the performance. Polish only what the file needs for ACX.',
  note: 'Strong starting point.',
} as const;

export const AUDIO_ANALYSIS_ACTIONS: MicroAction[] = [
  {
    id: 'limiter',
    title: 'Cap peaks at −3 dB',
    detail: 'Limit brief P/B/T spikes. Leave overall loudness alone.',
    tone: 'action',
  },
  {
    id: 'noise-ch3',
    title: 'Quiet Chapter 3 room tone',
    detail: 'Noise floor near −55. Chapter 4 is already clean.',
    tone: 'action',
  },
  {
    id: 'hpf',
    title: 'Ease out low rumble',
    detail: 'Gentle high-pass around 80 Hz. Keep the voice warm.',
    tone: 'guide',
  },
  {
    id: 'compress',
    title: 'Light level evening',
    detail: 'Soft compression only. Protect natural dynamics.',
    tone: 'guide',
  },
];

export const AUDIO_ANALYSIS_METRICS: AnalysisMetric[] = [
  {
    id: 'lufs',
    index: '01',
    name: 'LUFS',
    shortName: 'Loudness',
    verdict: 'pass',
    headline: 'How loud the whole recording feels over time',
    question: 'What does LUFS mean?',
    answer:
      'Imagine two people speaking. Person A whispers. Person B shouts. Now imagine they both speak for an hour. LUFS answers: how loud does this entire recording feel over time? Not peaks. Not the loudest word. The overall listening experience.',
    why: 'All four chapters sit within 1 dB. That is outstanding. Many professionally produced audiobooks vary more. The listener moves chapter to chapter without reaching for the volume knob.',
    chart: 'bars',
    values: [
      { label: 'Introduction', value: -21.4 },
      { label: 'Chapter 2', value: -21.2 },
      { label: 'Chapter 3', value: -22.1 },
      { label: 'Chapter 4', value: -21.4 },
    ],
    notes: [
      'Around −21 LUFS is exactly what you expect from an audiobook: comfortable, relaxed.',
      'You do not adjust volume every sentence.',
    ],
  },
  {
    id: 'lra',
    index: '02',
    name: 'LRA',
    shortName: 'Loudness range',
    verdict: 'pass',
    headline: 'How dramatic the narration is',
    question: 'What does it measure?',
    answer:
      'Imagine Morgan Freeman reading. Sometimes quiet. Sometimes excited. Sometimes emotional. LRA measures that movement. High LRA swings quiet to loud. Low LRA stays steady, chapter after chapter.',
    why: 'Around 4 LU is excellent for audiobooks. The narrator naturally keeps a consistent delivery. No need to compress heavily.',
    chart: 'range',
    values: [
      { label: 'Introduction', value: 4.5 },
      { label: 'Chapter 2', value: 4.4 },
      { label: 'Chapter 3', value: 4.3 },
      { label: 'Chapter 4', value: 4.1 },
    ],
  },
  {
    id: 'rms',
    index: '03',
    name: 'RMS',
    shortName: 'Legacy loudness',
    verdict: 'pass',
    headline: 'The older average-loudness measure',
    question: 'Why still look at RMS?',
    answer:
      'Think of RMS as the older way of measuring average loudness. Before LUFS became standard, everyone used RMS. Today LUFS is modern; RMS is legacy. ACX still uses RMS in its requirements.',
    why: 'Yours already passes. We do not want to change it much.',
    chart: 'legacy',
    values: [
      { label: 'Sample A', value: -21.9 },
      { label: 'Sample B', value: -22.8 },
      { label: 'Sample C', value: -22.0 },
    ],
  },
  {
    id: 'peak',
    index: '04',
    name: 'Peak',
    shortName: 'True peak',
    verdict: 'action',
    headline: 'The loudest instant in the recording',
    question: 'Why is yours failing?',
    answer:
      'Imagine clapping once in a quiet room. Everything stays soft, then one clap. That clap is the peak. Here, consonants like P, B, and T create a brief burst of air that reaches 0 dB.',
    why: 'ACX wants −3 dB. The solution is not turning the whole book down. It is controlling those brief spikes. That is what a limiter is for.',
    chart: 'spike',
    values: [
      { label: 'Take A', value: -0.1 },
      { label: 'Take B', value: -0.2 },
      { label: 'Take C', value: 0.0 },
    ],
    notes: ['Target ceiling: −3 dB', 'Action: limiter, not global gain cut'],
  },
  {
    id: 'crest',
    index: '05',
    name: 'Crest factor',
    shortName: 'Peak − average',
    verdict: 'pass',
    headline: 'How much life remains in the performance',
    question: 'What is crest factor?',
    answer:
      'Peak minus average loudness. Recording A stays flat like a radio announcer. Recording B breathes: soft, louder, soft again. Natural. Human.',
    why: 'Your crest factor of 22 dB means the narration still has life. Do not destroy that.',
    chart: 'crest',
    single: { label: 'Crest factor', value: 22, unit: 'dB' },
  },
  {
    id: 'noise',
    index: '06',
    name: 'Noise floor',
    shortName: 'Room silence',
    verdict: 'action',
    headline: 'What remains when the narrator stops',
    question: 'What is the noise floor?',
    answer:
      'Imagine the narrator stops speaking. What remains? Air conditioner. Computer fan. Room. That is the noise floor.',
    why: 'Chapter 4 at −62 is almost silent; excellent. Chapter 3 at −55 lets the room in. Only Chapter 3 needs more noise reduction.',
    chart: 'floor',
    values: [
      { label: 'Chapter 3', value: -55 },
      { label: 'Chapter 4', value: -62 },
    ],
  },
  {
    id: 'silence',
    index: '07',
    name: 'Silence share',
    shortName: 'Natural pause',
    verdict: 'pass',
    headline: 'How much of the recording is silence',
    question: 'Is silence bad?',
    answer:
      'Not bad silence. Natural pauses. Breathing. Thinking. Audiobooks should have pauses. At 5% the narrator sounds rushed. At 50% everything feels painfully slow.',
    why: 'Around 23% is exactly what we would expect.',
    chart: 'share',
    values: [
      { label: 'Introduction', value: 23 },
      { label: 'Chapter 2', value: 24 },
      { label: 'Chapter 3', value: 25 },
    ],
    share: 23,
  },
  {
    id: 'spectral',
    index: '08',
    name: 'Spectral balance',
    shortName: 'Tone color',
    verdict: 'guide',
    headline: 'Where the voice energy lives',
    question: 'What does the spectrum say?',
    answer:
      'Imagine a piano: bass, middle, treble. Every voice spreads energy across those regions. Your report shows strong lows, moderate mids, quieter highs.',
    why: 'The recording is warm, not bright. Rich and full rather than airy or sparkly. Not a problem; it simply guides the EQ.',
    chart: 'spectrum',
    spectrum: { low: 10, mid: 6, high: 2 },
  },
  {
    id: 'hpf',
    index: '09',
    name: 'High-pass filter',
    shortName: 'HPF',
    verdict: 'guide',
    headline: 'Remove what the listener does not need',
    question: 'Does HPF change the voice?',
    answer:
      'People think it changes the voice. It usually does not. Everything below about 80 Hz is mostly desk vibration, footsteps, HVAC rumble, mic handling, traffic.',
    why: 'A gentle high-pass says: remove the stuff the listener does not need. Used gently, the narrator will not suddenly sound thin.',
    chart: 'hpf',
  },
  {
    id: 'compression',
    index: '10',
    name: 'Compression',
    shortName: 'Dynamics',
    verdict: 'guide',
    headline: 'Bring loud and quiet a little closer',
    question: 'What question does compression answer?',
    answer:
      'Can we make loud words a little closer to the quiet words? Not LOUD then quiet, but medium-loud then medium-quiet.',
    why: 'Light compression keeps listeners from constantly adjusting volume. Heavy compression makes voices flat and fatiguing. Your narration only needs a gentle touch.',
    chart: 'compress',
  },
  {
    id: 'limiter',
    index: '11',
    name: 'Limiter',
    shortName: 'Ceiling',
    verdict: 'action',
    headline: 'A ceiling for brief spikes',
    question: 'What does a limiter do?',
    answer:
      'Think of a limiter as a ceiling. Without it, peaks can hit 0 dB. With it, peaks stop at a −3 dB ceiling. Whenever audio tries to exceed that line, the limiter gently trims only that instant.',
    why: 'Everything else stays the same. This is how we fix the peak fails without flattening the book.',
    chart: 'ceiling',
  },
];

export function analysisMetricById(id: AnalysisMetricId): AnalysisMetric {
  const metric = AUDIO_ANALYSIS_METRICS.find((item) => item.id === id);
  if (!metric) {
    throw new Error(`Unknown analysis metric: ${id}`);
  }
  return metric;
}
