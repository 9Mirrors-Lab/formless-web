/** Low-resolution waveform peaks for wavesurfer / multitrack (avoids a second full-file decode). */

export type AudioPeaksResult = {
  peaks: number[][];
  duration: number;
};

const MPEG_SYNC_MASK = 0xe0;

export function findMpegFrameOffset(bytes: Uint8Array): number {
  for (let index = 0; index < bytes.length - 1; index += 1) {
    const next = bytes[index + 1];
    if (bytes[index] === 0xff && next != null && (next & MPEG_SYNC_MASK) === MPEG_SYNC_MASK) {
      if ((next & 0x06) === 0) continue;
      return index;
    }
  }
  return -1;
}

export function downsamplePeaks(peaks: number[], count: number): number[] {
  if (count <= 0 || peaks.length === 0) return [];
  if (peaks.length <= count) return [...peaks];

  const out: number[] = [];
  const block = peaks.length / count;
  for (let index = 0; index < count; index += 1) {
    const start = Math.floor(index * block);
    const end = Math.max(start + 1, Math.floor((index + 1) * block));
    let max = 0;
    for (let cursor = start; cursor < end; cursor += 1) {
      const value = peaks[cursor] ?? 0;
      if (value > max) max = value;
    }
    out.push(max);
  }
  return out;
}

export function peaksFromChannel(channel: Float32Array, peaksCount: number): number[] {
  const count = Math.max(1, peaksCount);
  const blockSize = Math.max(1, Math.floor(channel.length / count));
  const peaks: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const start = index * blockSize;
    const end = Math.min(channel.length, start + blockSize);
    let max = 0;
    for (let cursor = start; cursor < end; cursor += 1) {
      const value = Math.abs(channel[cursor] ?? 0);
      if (value > max) max = value;
    }
    peaks.push(max);
  }

  return peaks;
}

export function parseContentRangeTotal(header: string | null): number | null {
  if (!header) return null;
  const match = /\/(\d+)$/.exec(header.trim());
  if (!match) return null;
  const total = Number(match[1]);
  return Number.isFinite(total) && total > 0 ? total : null;
}

async function decodeAudio(
  context: AudioContext,
  buffer: ArrayBuffer,
): Promise<{ channel: Float32Array; duration: number }> {
  const bytes = new Uint8Array(buffer);
  const offset = findMpegFrameOffset(bytes);
  const slice = offset > 0 ? buffer.slice(offset) : buffer.slice(0);
  const decoded = await context.decodeAudioData(slice.slice(0));
  return { channel: decoded.getChannelData(0), duration: decoded.duration };
}

async function peakFromBuffer(context: AudioContext, buffer: ArrayBuffer): Promise<number> {
  try {
    const { channel } = await decodeAudio(context, buffer);
    let max = 0;
    for (let index = 0; index < channel.length; index += 1) {
      const value = Math.abs(channel[index] ?? 0);
      if (value > max) max = value;
    }
    return max;
  } catch {
    return 0;
  }
}

/**
 * Fetch once, decode at 8 kHz, and downsample to peak bars.
 * Pass these as `peaks` so wavesurfer-multitrack does not re-fetch the media blob.
 */
export async function extractAudioPeaks(
  url: string,
  options?: { peaksCount?: number; signal?: AbortSignal },
): Promise<AudioPeaksResult> {
  const peaksCount = options?.peaksCount ?? 8000;
  const response = await fetch(url, {
    mode: 'cors',
    credentials: 'omit',
    signal: options?.signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch audio (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  options?.signal?.throwIfAborted();

  const context = new AudioContext({ sampleRate: 8000 });
  try {
    const { channel, duration } = await decodeAudio(context, arrayBuffer);
    options?.signal?.throwIfAborted();
    const peaks = peaksFromChannel(channel, peaksCount);
    return { peaks: [peaks], duration };
  } finally {
    await context.close();
  }
}

const OVERVIEW_BARS = 320;
/** Larger aligned chunks decode reliably; 24 KB slices rarely produce MP3 peaks. */
const SPARSE_CHUNK_BYTES = 128 * 1024;
const SPARSE_SAMPLE_COUNT = 48;
const SPARSE_CONCURRENCY = 8;
const FIRST_CHUNK_CLOSE_ENOUGH = 0.7;

export function interpolatePeaks(samples: number[], barCount: number): number[] {
  if (barCount <= 0 || samples.length === 0) return [];
  if (samples.length === 1) return Array.from({ length: barCount }, () => samples[0] ?? 0);

  const out: number[] = [];
  for (let index = 0; index < barCount; index += 1) {
    const position = (index / Math.max(1, barCount - 1)) * (samples.length - 1);
    const left = Math.floor(position);
    const right = Math.min(samples.length - 1, left + 1);
    const blend = position - left;
    const start = samples[left] ?? 0;
    const end = samples[right] ?? 0;
    out.push(start + (end - start) * blend);
  }
  return out;
}

/**
 * Overview bars for the Drive listen well. Uses the first decode when it covers
 * the chapter; otherwise samples Range chunks across the file.
 */
export async function extractOverviewPeaks(
  url: string,
  options?: { barCount?: number; durationSeconds?: number | null; signal?: AbortSignal },
): Promise<number[]> {
  const barCount = options?.barCount ?? OVERVIEW_BARS;
  const expected = options?.durationSeconds ?? null;
  const signal = options?.signal;

  const first = await fetch(url, {
    mode: 'cors',
    credentials: 'omit',
    headers: { Range: `bytes=0-${1024 * 1024 - 1}` },
    signal,
  });
  if (!first.ok && first.status !== 206) {
    throw new Error(`Failed to fetch audio (${first.status})`);
  }

  const fileSize = parseContentRangeTotal(first.headers.get('Content-Range'));
  const firstBuffer = await first.arrayBuffer();
  signal?.throwIfAborted();

  const context = new AudioContext({ sampleRate: 8000 });
  try {
    let firstPeaks: number[] = [];
    let decodedDuration = 0;
    try {
      const { channel, duration } = await decodeAudio(context, firstBuffer);
      decodedDuration = duration;
      firstPeaks = peaksFromChannel(channel, barCount);
    } catch {
      firstPeaks = [];
    }

    if (
      firstPeaks.length > 0 &&
      (expected == null || expected <= 0 || decodedDuration >= expected * FIRST_CHUNK_CLOSE_ENOUGH)
    ) {
      return downsamplePeaks(firstPeaks, barCount);
    }

    if (fileSize == null || fileSize <= SPARSE_CHUNK_BYTES) {
      return firstPeaks.length > 0 ? downsamplePeaks(firstPeaks, barCount) : [];
    }

    const sampleCount = Math.min(SPARSE_SAMPLE_COUNT, barCount);
    const samples = new Array<number>(sampleCount).fill(0);
    let cursor = 0;
    while (cursor < sampleCount) {
      signal?.throwIfAborted();
      const batchEnd = Math.min(sampleCount, cursor + SPARSE_CONCURRENCY);
      const jobs: Array<Promise<void>> = [];
      for (let index = cursor; index < batchEnd; index += 1) {
        const start = Math.floor((index / sampleCount) * fileSize);
        const end = Math.min(fileSize - 1, start + SPARSE_CHUNK_BYTES - 1);
        jobs.push(
          fetch(url, {
            mode: 'cors',
            credentials: 'omit',
            headers: { Range: `bytes=${start}-${end}` },
            signal,
          })
            .then(async (response) => {
              if (!response.ok && response.status !== 206) return;
              const buffer = await response.arrayBuffer();
              samples[index] = await peakFromBuffer(context, buffer);
            })
            .catch(() => {
              samples[index] = 0;
            }),
        );
      }
      await Promise.all(jobs);
      cursor = batchEnd;
    }

    const filled = samples.filter((value) => value > 0).length;
    if (filled < Math.max(4, Math.floor(sampleCount * 0.12)) && firstPeaks.length > 0) {
      return downsamplePeaks(firstPeaks, barCount);
    }
    return interpolatePeaks(samples, barCount);
  } finally {
    await context.close();
  }
}
