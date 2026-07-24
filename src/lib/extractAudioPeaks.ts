/** Low-resolution waveform peaks for wavesurfer / multitrack (avoids a second full-file decode). */

export type AudioPeaksResult = {
  peaks: number[][];
  duration: number;
};

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
    const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
    options?.signal?.throwIfAborted();

    const channel = decoded.getChannelData(0);
    const blockSize = Math.max(1, Math.floor(channel.length / peaksCount));
    const peaks: number[] = [];

    for (let i = 0; i < peaksCount; i += 1) {
      const start = i * blockSize;
      const end = Math.min(channel.length, start + blockSize);
      let max = 0;
      for (let j = start; j < end; j += 1) {
        const value = Math.abs(channel[j] ?? 0);
        if (value > max) max = value;
      }
      peaks.push(max);
    }

    return { peaks: [peaks], duration: decoded.duration };
  } finally {
    await context.close();
  }
}
