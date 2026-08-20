import { describe, expect, it } from 'vitest';

import {
  explainMetric,
  explainPhase,
  verdictLabel,
} from '@/data/audioMasterPhaseExplain';

describe('explainPhase', () => {
  it('tells the user what each phase is for and why ACX cares', () => {
    const pre = explainPhase(1);
    expect(pre.means.toLowerCase()).toContain('raw');
    expect(pre.whyCare.toLowerCase()).toContain('acx');

    const post = explainPhase(5);
    expect(post.means.toLowerCase()).toMatch(/finished|master/);
    expect(post.whyCare.toLowerCase()).toContain('acx');
  });
});

describe('explainMetric', () => {
  it('explains a quiet pre-flight RMS as a mastering job, not a re-record', () => {
    const explained = explainMetric('RMS', '−28.5 dBFS', 1);
    expect(explained.title.toLowerCase()).toMatch(/loud/);
    expect(explained.verdict).toBe('needs-mastering');
    expect(explained.means.toLowerCase()).toMatch(/average|loud/);
    expect(explained.whyCare.toLowerCase()).toContain('acx');
    expect(explained.result).toContain('-28.5');
    expect(explained.result.toLowerCase()).toMatch(/quiet|raise|master/);
    expect(explained.window).toContain('-23');
  });

  it('ties a post-flight RMS move to an ACX pass', () => {
    const explained = explainMetric(
      'Pre RMS → Post RMS',
      '−28.5 → −21.0 dBFS',
      5,
    );
    expect(explained.verdict).toBe('pass');
    expect(explained.result).toContain('-21.0');
    expect(explained.result.toLowerCase()).toMatch(/window|pass|upload/);
    expect(explained.whyCare.toLowerCase()).toContain('acx');
  });

  it('marks a post-flight peak under -3.0 as an ACX pass', () => {
    const explained = explainMetric('True peak', '-3.7 dBFS', 5);
    expect(explained.verdict).toBe('pass');
    expect(explained.result).toContain('-3.7');
    expect(explained.whyCare.toLowerCase()).toMatch(/clip|distort|peak/);
  });

  it('marks head noise quieter than -60 as an ACX pass', () => {
    const explained = explainMetric(
      'Noise (head 0.5–9.0 s)',
      '−69.7 dB',
      1,
    );
    expect(explained.verdict).toBe('pass');
    expect(explained.result).toContain('-69.7');
    expect(explained.whyCare.toLowerCase()).toMatch(/hiss|room|noise/);
  });

  it('fails a hot head max so the opening quiet cannot click', () => {
    const explained = explainMetric(
      'Head 0-0.75 s',
      '-67.1 / max -53.4 dB',
      5,
    );
    expect(explained.verdict).toBe('fail');
    expect(explained.result).toContain('-53.4');
    expect(explained.result.toLowerCase()).toMatch(/click|quiet|head/);
  });

  it('fails an ACX row that still has a head-max miss', () => {
    const explained = explainMetric(
      'ACX',
      'RMS and peak PASS; head max FAIL',
      5,
    );
    expect(explained.verdict).toBe('fail');
    expect(explained.result.toLowerCase()).toMatch(/head/);
    expect(explained.whyCare.toLowerCase()).toContain('acx');
  });

  it('passes a 0.75 s head as the ACX opening pause', () => {
    const explained = explainMetric('Head', '0.75 s', 5);
    expect(explained.verdict).toBe('pass');
    expect(explained.result).toContain('0.75');
  });

  it('passes MP3 192k mono 44.1 kHz as the ACX file shape', () => {
    const explained = explainMetric(
      'Format',
      'MP3 192k CBR mono 44.1 kHz, 29:40.33',
      5,
    );
    expect(explained.verdict).toBe('pass');
    expect(explained.whyCare.toLowerCase()).toMatch(/format|upload|file/);
  });

  it('fails a first-word window that is still room', () => {
    const explained = explainMetric(
      '0.75-1.5 s',
      'room, -68.6 / -56.3',
      5,
    );
    expect(explained.verdict).toBe('fail');
    expect(explained.result.toLowerCase()).toMatch(/word|head|long|pause/);
  });

  it('passes a first-word window that is already speech', () => {
    const explained = explainMetric(
      '0.75–1.5 s speech',
      '−18.0 dB mean',
      5,
    );
    expect(explained.verdict).toBe('pass');
    expect(explained.result.toLowerCase()).toMatch(/word|speech|start/);
  });
});

describe('verdictLabel', () => {
  it('names verdicts in plain language', () => {
    expect(verdictLabel('pass')).toBe('ACX pass');
    expect(verdictLabel('fail')).toBe('ACX fail');
    expect(verdictLabel('needs-mastering')).toBe('Fix in mastering');
    expect(verdictLabel('watch')).toBe('Quality');
    expect(verdictLabel('info')).toBe('Context');
  });
});
