import { describe, expect, it } from 'vitest';

import {
  downsamplePeaks,
  findMpegFrameOffset,
  parseContentRangeTotal,
  peaksFromChannel,
} from '@/lib/extractAudioPeaks';

describe('waveform peak helpers', () => {
  it('finds an MP3 frame sync and skips a zero layer', () => {
    const bytes = new Uint8Array([0x11, 0xff, 0xfb, 0x00]);
    expect(findMpegFrameOffset(bytes)).toBe(1);
  });

  it('downsamples by keeping the loudest sample in each block', () => {
    expect(downsamplePeaks([0.1, 0.8, 0.2, 0.4], 2)).toEqual([0.8, 0.4]);
  });

  it('reads the total size from a Content-Range header', () => {
    expect(parseContentRangeTotal('bytes 0-1023/86501921')).toBe(86501921);
    expect(parseContentRangeTotal('bytes 0-1023/*')).toBeNull();
  });

  it('builds peak bars from a channel buffer', () => {
    const channel = new Float32Array([0.1, -0.9, 0.2, 0.3]);
    const peaks = peaksFromChannel(channel, 2);
    expect(peaks).toHaveLength(2);
    expect(peaks[0]).toBeCloseTo(0.9);
    expect(peaks[1]).toBeCloseTo(0.3);
  });
});
