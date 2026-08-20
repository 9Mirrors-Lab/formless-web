import type { MasterPhaseId } from '@/data/audioMasterPhaseRuns';

export type AcxVerdict = 'pass' | 'fail' | 'needs-mastering' | 'watch' | 'info';

export type PhaseExplain = {
  means: string;
  whyCare: string;
};

export type MetricExplain = {
  title: string;
  means: string;
  whyCare: string;
  result: string;
  verdict: AcxVerdict;
  window?: string;
};

const PHASE_EXPLAIN: Record<MasterPhaseId, PhaseExplain> = {
  1: {
    means:
      'A health check on the raw recording before we change a thing.',
    whyCare:
      'ACX will reject a file that is too quiet, too peaky, or too noisy. These numbers show which of those checks would fail today, and what mastering has to fix.',
  },
  2: {
    means:
      'A plain-language read of the take: what to keep, what to polish, and how to treat the voice.',
    whyCare:
      'The point is a clean ACX pass without flattening the performance. This is not an approval gate. Processing continues from these notes.',
  },
  3: {
    means:
      'Clean the take: room hiss, clicks, rumble, and hard plosives. The voice stays the same.',
    whyCare:
      'ACX fails a noisy floor, and human reviewers fail files that click, hiss, or sound processed. This is the sound-quality pass.',
  },
  4: {
    means:
      'Shape the chapter into the file ACX actually accepts: loudness, peaks, opening and closing quiet, MP3 format.',
    whyCare:
      'A good read still fails upload if the file is the wrong loudness, clips, or has the wrong pause at the start or end. This is the compliance pass.',
  },
  5: {
    means:
      'Re-measure the finished master against the same ACX checks.',
    whyCare:
      'This is the ACX score that matters. Green here means Audible automated checks should pass for loudness, peaks, noise, and file shape.',
  },
  6: {
    means:
      'The dossier is written and the track is handed to Final QC.',
    whyCare:
      'Final QC is the last ear check before upload. This phase files the evidence. It does not submit to ACX.',
  },
};

type MetricFamily =
  | 'rms'
  | 'peak'
  | 'noise'
  | 'head-max'
  | 'head-noise'
  | 'lufs-lra'
  | 'crest'
  | 'silence'
  | 'duration'
  | 'format'
  | 'acx'
  | 'head-length'
  | 'tail-length'
  | 'first-word'
  | 'tail-room'
  | 'loudnorm-i'
  | 'loudnorm-tp'
  | 'loudnorm-lra'
  | 'loudnorm-offset'
  | 'loudnorm-target'
  | 'speech-start'
  | 'body-end'
  | 'room-window'
  | 'unknown';

function normalize(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/−/g, '-')
    .toLowerCase();
}

function fmt(n: number): string {
  const two = n.toFixed(2);
  if (two.endsWith('0')) return n.toFixed(1);
  return two;
}

function extractSignedFloats(value: string): number[] {
  const normalized = normalize(value);
  return [...normalized.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  );
}

function lastNumber(nums: number[]): number | undefined {
  return nums.length ? nums[nums.length - 1] : undefined;
}

function matchFamily(label: string): MetricFamily {
  const l = normalize(label);
  if (l.includes('pre rms') || l === 'rms' || l.startsWith('rms ')) return 'rms';
  if (l.includes('pre peak') || l.includes('true peak') || l === 'peak') {
    return 'peak';
  }
  if (l.includes('pre noise') || l.includes('noise (')) return 'noise';
  if (l.includes('noise')) return 'noise';
  if (l.includes('head max') || l.includes('gap max')) return 'head-max';
  if (l.includes('head 0')) return 'head-noise';
  if (l.includes('lufs')) return 'lufs-lra';
  if (l.includes('crest')) return 'crest';
  if (l.includes('silence')) return 'silence';
  if (l.includes('duration')) return 'duration';
  if (l.includes('format')) return 'format';
  if (l === 'acx' || l.startsWith('acx ')) return 'acx';
  if (l.includes('speech_start') || l.includes('speech start')) {
    return 'speech-start';
  }
  if (l.includes('body_end') || l.includes('body end')) return 'body-end';
  if (l.includes('room window')) return 'room-window';
  if (
    (l.includes('0.75') && l.includes('1.5')) ||
    l.includes('first-word') ||
    (l.includes('speech') && !l.includes('speech_start'))
  ) {
    return 'first-word';
  }
  if (l.includes('last 2')) return 'tail-room';
  if (l.includes('tail')) return 'tail-length';
  if (l === 'head' || l.startsWith('head ')) return 'head-length';
  if (l.includes('loudnorm input_i')) return 'loudnorm-i';
  if (l.includes('loudnorm input_tp')) return 'loudnorm-tp';
  if (l.includes('loudnorm input_lra')) return 'loudnorm-lra';
  if (l.includes('loudnorm offset')) return 'loudnorm-offset';
  if (l.includes('loudnorm target')) return 'loudnorm-target';
  return 'unknown';
}

function isPrePhase(phaseId: MasterPhaseId): boolean {
  return phaseId === 1 || phaseId === 2 || phaseId === 3;
}

function explainRms(
  value: string,
  phaseId: MasterPhaseId,
): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const current = lastNumber(nums);
  const before = nums.length > 1 ? nums[0] : undefined;
  if (current == null) {
    return { verdict: 'info', result: value };
  }
  const inWindow = current >= -23 && current <= -18;
  if (before != null) {
    if (inWindow) {
      return {
        verdict: 'pass',
        result: `Started at ${fmt(before)}, too quiet for ACX. Finished at ${fmt(current)}, inside the -23 to -18 window. Volume will not fail the upload.`,
      };
    }
    return {
      verdict: 'fail',
      result: `Finished at ${fmt(current)}, outside the -23 to -18 ACX window. Volume would fail the upload.`,
    };
  }
  if (inWindow) {
    return {
      verdict: 'pass',
      result: `${fmt(current)} is inside the -23 to -18 window. Volume is not a blocker.`,
    };
  }
  if (current < -23) {
    if (isPrePhase(phaseId)) {
      return {
        verdict: 'needs-mastering',
        result: `${fmt(current)} is quieter than ACX allows. The take is healthy. Mastering will raise it into the -23 to -18 window. No re-record.`,
      };
    }
    return {
      verdict: 'fail',
      result: `${fmt(current)} is still quieter than ACX allows. Volume would fail the upload.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(current)} is louder than ACX allows. The chapter would sound pushed and fail the volume check.`,
  };
}

function explainPeak(
  value: string,
  phaseId: MasterPhaseId,
): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const current = lastNumber(nums);
  const before = nums.length > 1 ? nums[0] : undefined;
  if (current == null) {
    return { verdict: 'info', result: value };
  }
  const passes = current <= -3;
  if (before != null && passes) {
    return {
      verdict: 'pass',
      result: `Started at ${fmt(before)} and finished at ${fmt(current)}, under the -3.0 ceiling. Peaks will not clip, so this check will not fail the upload.`,
    };
  }
  if (passes) {
    if (isPrePhase(phaseId) && current <= -6) {
      return {
        verdict: 'pass',
        result: `${fmt(current)} leaves healthy headroom. Peaks are not a problem. The limiter is only a safety net.`,
      };
    }
    return {
      verdict: 'pass',
      result: `${fmt(current)} stays under the -3.0 ACX ceiling. The file will not distort on the loudest word.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(current)} is hotter than -3.0. ACX will reject clipping. This chapter is not upload-ready.`,
  };
}

function explainNoise(
  value: string,
  phaseId: MasterPhaseId,
): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const current = lastNumber(nums);
  const before = nums.length > 1 ? nums[0] : undefined;
  if (current == null) {
    return { verdict: 'info', result: value };
  }
  const passes = current <= -60;
  if (before != null && passes) {
    return {
      verdict: 'pass',
      result: `Room quiet moved from ${fmt(before)} to ${fmt(current)}. Both beat the -60 ACX floor, so hiss will not fail the upload.`,
    };
  }
  if (passes) {
    return {
      verdict: 'pass',
      result: `${fmt(current)} is quieter than the -60 ACX floor. The pauses will not hiss on the finished file.`,
    };
  }
  if (isPrePhase(phaseId)) {
    return {
      verdict: 'needs-mastering',
      result: `${fmt(current)} is louder than the -60 ACX floor. Restoration has to pull the room down or this chapter fails.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(current)} is louder than the -60 ACX floor. The pauses would fail the noise check.`,
  };
}

function explainHeadMax(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const max = lastNumber(nums);
  const mean = nums.length > 1 ? nums[0] : undefined;
  if (max == null) {
    return { verdict: 'info', result: value };
  }
  if (max <= -55) {
    return {
      verdict: 'pass',
      result:
        mean != null
          ? `Opening quiet averages ${fmt(mean)} with a loudest instant of ${fmt(max)}. Both stay in the safe bed, so the start will not click.`
          : `${fmt(max)} stays at or below -55. The opening quiet has no click or leftover word.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(max)} is hotter than -55 in the opening quiet. That is a click or the edge of a word. ACX needs that bed clean. Recut the head before upload.`,
  };
}

function explainHeadLength(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const seconds = nums[0];
  if (seconds == null) {
    return { verdict: 'info', result: value };
  }
  if (seconds >= 0.5 && seconds <= 1) {
    return {
      verdict: 'pass',
      result: `${fmt(seconds)} s of opening quiet is inside the ACX 0.5-1 s window. The file will not fail for a missing or overlong pause.`,
    };
  }
  if (seconds > 1) {
    return {
      verdict: 'fail',
      result: `${fmt(seconds)} s of opening quiet is longer than the 1 s ACX limit. Trim the head or the upload fails.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(seconds)} s of opening quiet is shorter than 0.5 s. ACX wants a breath of room before the first word.`,
  };
}

function explainTailLength(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const seconds = nums[0];
  if (seconds == null) {
    return { verdict: 'info', result: value };
  }
  if (seconds >= 1 && seconds <= 5) {
    return {
      verdict: 'pass',
      result: `${fmt(seconds)} s of closing quiet is inside the ACX 1-5 s window. The chapter will not cut off on the last word.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(seconds)} s of closing quiet is outside the ACX 1-5 s window. Fix the tail before upload.`,
  };
}

function explainFirstWord(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const text = normalize(value);
  const nums = extractSignedFloats(value);
  const level = lastNumber(nums);
  if (text.includes('room') || (level != null && level <= -50)) {
    return {
      verdict: 'fail',
      result:
        'The first word should start by 0.75 s. This window is still room, so the opening pause is too long. ACX fails a head longer than 1 s.',
    };
  }
  if (level != null && level > -40) {
    return {
      verdict: 'pass',
      result: `${fmt(level)} in the first-word window is speech. The opening pause did not eat the first word.`,
    };
  }
  return {
    verdict: 'info',
    result: value,
  };
}

function explainTailRoom(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const level = nums[0];
  if (level == null) {
    return { verdict: 'info', result: value };
  }
  if (level <= -50) {
    return {
      verdict: 'pass',
      result: `${fmt(level)} on the last two seconds is room, not leftover speech. The chapter ends cleanly.`,
    };
  }
  return {
    verdict: 'fail',
    result: `${fmt(level)} on the last two seconds still looks like speech. Cut the body on the last real word or ACX hears a chopped ending.`,
  };
}

function explainFormat(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const text = normalize(value);
  const ok =
    text.includes('mp3') &&
    text.includes('192') &&
    (text.includes('44.1') || text.includes('44100')) &&
    text.includes('mono');
  if (ok) {
    return {
      verdict: 'pass',
      result:
        'MP3, 192 kbps, mono, 44.1 kHz is the ACX file shape. The portal will not reject this chapter for format.',
    };
  }
  return {
    verdict: 'fail',
    result: `${value} is not the ACX file shape (MP3 192k CBR, mono, 44.1 kHz). The upload would fail before anyone hears it.`,
  };
}

function explainAcx(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const text = normalize(value);
  const hasFail = text.includes('fail');
  if (hasFail) {
    const head = text.includes('head');
    return {
      verdict: 'fail',
      result: head
        ? 'Loudness and peaks can pass and the file still fail ACX if the opening quiet is dirty or too long. Fix the head before upload.'
        : `${value} Still has an ACX miss. Do not upload until every check is green.`,
    };
  }
  if (text.includes('pass')) {
    return {
      verdict: 'pass',
      result:
        'RMS, peaks, and noise are in the ACX window. The automated checks should accept this chapter.',
    };
  }
  return { verdict: 'info', result: value };
}

function explainLufs(value: string): Pick<MetricExplain, 'result' | 'verdict'> {
  const nums = extractSignedFloats(value);
  const lufs = nums[0];
  const lra = nums[1];
  if (lufs == null) {
    return { verdict: 'info', result: value };
  }
  const nearTarget = lufs >= -23 && lufs <= -18;
  const lraText =
    lra != null
      ? ` Loudness range is ${fmt(lra)} LU, a controlled read.`
      : '';
  if (nearTarget) {
    return {
      verdict: 'pass',
      result: `${fmt(lufs)} LUFS is how loud the whole chapter feels. That sits with the ACX volume window, so listeners will not ride the knob.${lraText}`,
    };
  }
  return {
    verdict: 'watch',
    result: `${fmt(lufs)} LUFS is how loud the chapter feels over time. ACX scores RMS, not LUFS, but this should land near -20 after mastering.${lraText}`,
  };
}

export function explainPhase(phaseId: MasterPhaseId): PhaseExplain {
  return PHASE_EXPLAIN[phaseId];
}

export function verdictLabel(verdict: AcxVerdict): string {
  switch (verdict) {
    case 'pass':
      return 'ACX pass';
    case 'fail':
      return 'ACX fail';
    case 'needs-mastering':
      return 'Fix in mastering';
    case 'watch':
      return 'Quality';
    case 'info':
      return 'Context';
    default: {
      const _exhaustive: never = verdict;
      return _exhaustive;
    }
  }
}

export function explainMetric(
  label: string,
  value: string,
  phaseId: MasterPhaseId,
): MetricExplain {
  const family = matchFamily(label);
  switch (family) {
    case 'rms': {
      const judged = explainRms(value, phaseId);
      return {
        title: 'Average loudness',
        means: 'How loud the whole chapter averages from start to finish.',
        whyCare:
          'ACX only accepts -23 to -18. Too quiet and listeners crank the volume. Too loud and it sounds pushed. Miss the window and the upload is rejected.',
        window: 'ACX: -23 to -18 dBFS',
        ...judged,
      };
    }
    case 'peak': {
      const judged = explainPeak(value, phaseId);
      return {
        title: 'Loudest instant',
        means: 'The single loudest spike, usually a plosive or a strong word.',
        whyCare:
          'ACX rejects anything hotter than -3.0. A pass here means the file will not clip or distort on the loudest moment.',
        window: 'ACX: -3.0 dBFS or quieter',
        ...judged,
      };
    }
    case 'noise': {
      const judged = explainNoise(value, phaseId);
      return {
        title: 'Room quiet',
        means: 'How loud the pauses are when nobody is speaking.',
        whyCare:
          'ACX rejects a noise floor louder than -60. If the room hisses between sentences, the chapter fails even when the read is good.',
        window: 'ACX: -60 dB or quieter',
        ...judged,
      };
    }
    case 'head-max':
    case 'head-noise': {
      const judged = explainHeadMax(value);
      return {
        title: 'Opening quiet',
        means: 'The breath of room before the first word, and the loudest instant in that breath.',
        whyCare:
          'ACX wants 0.5-1 s of clean room at the start. A click or leftover word in that bed fails the file even if average loudness is fine.',
        window: 'Mean -60 or quieter, max -55 or quieter',
        ...judged,
      };
    }
    case 'lufs-lra': {
      const judged = explainLufs(value);
      return {
        title: 'How loud it feels',
        means: 'Overall listening loudness, plus how much the voice rises and falls.',
        whyCare:
          'Listeners should not touch the volume between chapters. ACX scores RMS, but this number is the same story in listening terms.',
        window: 'Aim near -20 LUFS, range about 3-5 LU',
        ...judged,
      };
    }
    case 'crest': {
      const nums = extractSignedFloats(value);
      const crest = nums[0];
      return {
        title: 'Punch left in the voice',
        means: 'The gap between the loudest spike and the average level.',
        whyCare:
          'Too little punch means the read was squashed. ACX will not fail this number, but a flat chapter sounds cheap next to the others.',
        window: 'Healthy narration often sits around 20 dB',
        verdict: 'watch',
        result:
          crest != null
            ? `${fmt(crest)} dB of punch is still in the performance. Do not squash it just to chase a number.`
            : value,
      };
    }
    case 'silence': {
      return {
        title: 'Pause share',
        means: 'How much of the file is breath and pause instead of speech.',
        whyCare:
          'This is pacing, not an ACX reject. A natural pause pattern keeps the chapter listenable. Dead air or a rushed read both hurt quality.',
        verdict: 'watch',
        result: `${value} of the file is pause. That is normal audiobook pacing, not a fail.`,
      };
    }
    case 'duration': {
      return {
        title: 'Length',
        means: 'How long this chapter runs.',
        whyCare:
          'ACX does not score runtime, but a file that is empty or far too short is a truncated encode. Confirm the chapter is whole.',
        verdict: 'info',
        result: `${value} is the measured length of this file.`,
      };
    }
    case 'format': {
      const judged = explainFormat(value);
      return {
        title: 'File shape',
        means: 'The container ACX will actually accept.',
        whyCare:
          'Wrong format fails before anyone hears the chapter. ACX wants MP3, 192 kbps CBR, mono, 44.1 kHz.',
        window: 'MP3 192k CBR mono 44.1 kHz',
        ...judged,
      };
    }
    case 'acx': {
      const judged = explainAcx(value);
      return {
        title: 'ACX score',
        means: 'The combined pass or fail across loudness, peaks, and noise.',
        whyCare:
          'This is the ACX upload gate. One red check and Audible rejects the file, even if the read is excellent.',
        ...judged,
      };
    }
    case 'head-length': {
      const judged = explainHeadLength(value);
      return {
        title: 'Opening pause',
        means: 'How long the file waits in room tone before the first word.',
        whyCare:
          'ACX requires 0.5-1 s. Too short feels like a slam-in. Too long fails the spec.',
        window: 'ACX: 0.5-1 s',
        ...judged,
      };
    }
    case 'tail-length': {
      const judged = explainTailLength(value);
      return {
        title: 'Closing pause',
        means: 'How long the file rests after the last word.',
        whyCare:
          'ACX requires 1-5 s of room at the end. A chopped last word or a long dead tail both fail review.',
        window: 'ACX: 1-5 s',
        ...judged,
      };
    }
    case 'first-word': {
      const judged = explainFirstWord(value);
      return {
        title: 'First word',
        means: 'Whether speech has started by 0.75-1.5 s, right after the opening pause.',
        whyCare:
          'If this window is still room, the head is too long and ACX fails. If it is speech, the first word survived the trim.',
        ...judged,
      };
    }
    case 'tail-room': {
      const judged = explainTailRoom(value);
      return {
        title: 'Last two seconds',
        means: 'Whether the file ends on room, not leftover speech.',
        whyCare:
          'A chopped last word fails human review even when the meters look green. The tail must be quiet.',
        ...judged,
      };
    }
    case 'loudnorm-i': {
      const nums = extractSignedFloats(value);
      const n = nums[0];
      return {
        title: 'Loudness before the raise',
        means: 'Where the chapter sat before mastering lifted it.',
        whyCare:
          'ACX needs the finished file near -20. This starting number is why we boost. The read itself is not the problem.',
        verdict: 'info',
        result:
          n != null
            ? `${fmt(n)} is the starting loudness. Mastering raises this into the ACX window.`
            : value,
      };
    }
    case 'loudnorm-tp': {
      const nums = extractSignedFloats(value);
      const n = nums[0];
      return {
        title: 'Peak before the limiter',
        means: 'The loudest spike before the final ceiling.',
        whyCare:
          'We keep this under -3.0 on the finished file so ACX does not reject clipping.',
        verdict: 'info',
        result:
          n != null
            ? `${fmt(n)} is the starting peak. The limiter holds the master to the ACX ceiling.`
            : value,
      };
    }
    case 'loudnorm-lra': {
      const nums = extractSignedFloats(value);
      const n = nums[0];
      return {
        title: 'Range before encode',
        means: 'How much the voice already rose and fell.',
        whyCare:
          'A tight range means light compression only. Over-compressing would flatten the read without helping ACX.',
        verdict: 'info',
        result:
          n != null
            ? `${fmt(n)} LU of range is already controlled. Mastering does not need to squash the voice.`
            : value,
      };
    }
    case 'loudnorm-offset': {
      return {
        title: 'Fine loudness trim',
        means: 'A tiny correction on the second loudness pass.',
        whyCare:
          'This keeps the finished average inside the ACX window without changing the performance.',
        verdict: 'info',
        result: `${value} is a small targeting correction, not a new mix.`,
      };
    }
    case 'loudnorm-target': {
      return {
        title: 'Loudness target',
        means: 'The aiming point for the finished chapter.',
        whyCare:
          'About -20 lands in the middle of the ACX -23 to -18 window, so volume should pass.',
        verdict: 'info',
        result: `${value} is the ACX-shaped target for this encode.`,
      };
    }
    case 'speech-start': {
      return {
        title: 'Where the first word is',
        means: 'The timestamp where narration actually begins.',
        whyCare:
          'We cut the opening pause from this point. Miss it and ACX either eats the first word or leaves a head that is too long.',
        verdict: 'info',
        result: `${value} is where speech starts, so the delivered head can stay inside 0.5-1 s.`,
      };
    }
    case 'body-end': {
      return {
        title: 'Where the last word is',
        means: 'The timestamp where narration actually ends.',
        whyCare:
          'We add the closing pause after this point. Cut early and the last word is chopped. Cut late and leftover speech sits in the tail.',
        verdict: 'info',
        result: `${value} is the last real word, so the 1-5 s ACX tail can be clean room.`,
      };
    }
    case 'room-window': {
      return {
        title: 'Room we copied',
        means: 'The clean slice of this chapter\'s own quiet, used for the opening and closing pause.',
        whyCare:
          'ACX wants natural room, not digital silence. Using this chapter\'s own quiet keeps the bed honest and the noise check green.',
        verdict: 'info',
        result: `${value} is the quiet we used for the ACX head and tail.`,
      };
    }
    case 'unknown': {
      return {
        title: label,
        means: 'A measurement from this phase of the ACX pass.',
        whyCare:
          'Every number on this page exists to get the chapter to a clean ACX pass: legal loudness, legal peaks, legal quiet, legal file.',
        verdict: 'info',
        result: value,
      };
    }
    default: {
      const _exhaustive: never = family;
      return _exhaustive;
    }
  }
}
