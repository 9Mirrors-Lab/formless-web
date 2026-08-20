/**
 * Manuscript alignment: final book script (Advance Reader Copy) vs the audio
 * track script (Whisper-timed read-along for each recorded take).
 *
 * Record Sessions shows these diffs for decision-making.
 * Ryan Needs only lists findings that already have a re-record session.
 */

import type { AudioSentence } from '@/data/audioBook';
import { formatAudioTime } from '@/data/audioBook';
import { manuscriptForChapter } from '@/data/audioManuscripts';

export type ManuscriptFindingKind =
  | 'missing'
  | 'wording'
  | 'delivery'
  | 'name';

/** Where to open the ARC / print manuscript. */
export type ManuscriptPlace = {
  /** Chapter or front-matter label, e.g. "Chapter 2 · Awareness and The Ego". */
  chapter: string;
  /** Optional section heading inside the chapter. */
  section?: string;
  /** Optional page hint, e.g. "~p.53". */
  page?: string;
  /** Short landmark: after / before a known line. */
  landmark: string;
};

export type ManuscriptFinding = {
  id: string;
  /** Audio chapter id (matches listen order / studio catalog). */
  chapterId: number;
  kind: ManuscriptFindingKind;
  /**
   * What this row is about in plain language (decision focus).
   * Not a location string.
   */
  decision: string;
  /** Structured place in the final book script (ARC). */
  finalPlace: ManuscriptPlace;
  /** Exact/near wording in the final book script. */
  finalScriptText: string;
  /** Audio file stub, e.g. 04_Chapter_2. */
  trackFile: string;
  /** Seek window on the recorded take (seconds). */
  trackStartSeconds: number;
  trackEndSeconds: number;
  /** One-line note about what the take does at that window. */
  trackNote: string;
  /**
   * What the audio track script has at that spot.
   * Empty string = nothing there (gap in the take/cues).
   */
  trackScriptText: string;
  href: string;
  door: string;
  /** Optional delivery timestamp for punch takes. */
  at?: string;
  /** When set, Ryan Needs can point at this Record Session. */
  sessionId?: string;

  /**
   * Legacy display strings (kept for older call sites / tests).
   * Prefer finalPlace + track clocks in new UI.
   */
  finalScriptWhere: string;
  audioTrack: string;
  trackScriptWhere: string;
};

function placeLine(place: ManuscriptPlace): string {
  const bits = [
    `Final script (ARC) · ${place.chapter}`,
    place.section,
    place.page,
    place.landmark,
  ].filter(Boolean);
  return bits.join(' · ');
}

function trackLine(
  chapterLabel: string,
  trackFile: string,
  start: number,
  end: number,
  note: string,
): { audioTrack: string; trackScriptWhere: string } {
  return {
    audioTrack: `Audio track · ${chapterLabel} · ${trackFile}`,
    trackScriptWhere: `Track script at ${formatAudioTime(start)}–${formatAudioTime(end)}: ${note}`,
  };
}

function finding(
  row: Omit<
    ManuscriptFinding,
    'finalScriptWhere' | 'audioTrack' | 'trackScriptWhere'
  > & { chapterLabel: string },
): ManuscriptFinding {
  const { chapterLabel, ...rest } = row;
  const track = trackLine(
    chapterLabel,
    rest.trackFile,
    rest.trackStartSeconds,
    rest.trackEndSeconds,
    rest.trackNote,
  );
  return {
    ...rest,
    finalScriptWhere: placeLine(rest.finalPlace),
    audioTrack: track.audioTrack,
    trackScriptWhere: track.trackScriptWhere,
  };
}

export const MANUSCRIPT_FINDINGS: readonly ManuscriptFinding[] = [
  finding({
    id: 'ch9-productivity-rush',
    chapterId: 9,
    chapterLabel: 'Chapter 9 · Living in Freedom',
    kind: 'delivery',
    at: '2:32',
    decision:
      'Re-record the “productivity” line; delivery is rushed at 2:32 in the Chapter 9 take.',
    finalPlace: {
      chapter: 'Chapter 9 · Living in Freedom',
      landmark: 'same wording as the punch below',
    },
    finalScriptText:
      'I see that there is a different kind of productivity that comes from stillness and presence.',
    trackFile: '11_Chapter_9',
    trackStartSeconds: 152,
    trackEndSeconds: 160,
    trackNote: 'studio note: sounds rushed',
    trackScriptText:
      'I see that there is a different kind of productivity that comes from stillness and presence.',
    href: '/audio/record-sessions#chapter-9-productivity',
    door: 'Record Sessions',
    sessionId: 'chapter-9-productivity',
  }),
  finding({
    id: 'ch2-story-embedded',
    chapterId: 2,
    chapterLabel: 'Chapter 2 · Awareness and the Ego',
    kind: 'missing',
    decision:
      'Decide whether this ARC sentence was skipped in the take, or only missing from the cue text.',
    finalPlace: {
      chapter: 'Chapter 2 · Awareness and The Ego',
      landmark:
        'after “bundle of thoughts shaped by not feeling seen or safe growing up,” before “The more I believed that story…”',
    },
    finalScriptText:
      'The story had embedded itself so deeply that it felt like the truth. The more I believed that story, the more real it became.',
    trackFile: '04_Chapter_2',
    trackStartSeconds: 1328.62,
    trackEndSeconds: 1345.62,
    trackNote:
      'cue goes from the “bundle of thoughts…” line straight into “The more I believed the story…” (no “embedded itself so deeply” line)',
    trackScriptText: '',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
  finding({
    id: 'ch4-complete-you',
    chapterId: 4,
    chapterLabel: 'Chapter 4 · Resistance and Surrender',
    kind: 'missing',
    decision:
      'Decide whether this ARC bridge was skipped in the take, or only missing from the cue text.',
    finalPlace: {
      chapter: 'Chapter 4 · Resistance and Surrender',
      section: 'Living in Alignment with Life',
      page: '~p.53',
      landmark:
        'right after “Life doesn’t require your control. It requires your presence.”',
    },
    finalScriptText:
      'When you no longer need life to complete you, you stop running. And in that stillness, you realize the current was always carrying you exactly where you needed to go.',
    trackFile: '06_Chapter_4',
    trackStartSeconds: 2376.93,
    trackEndSeconds: 2382.05,
    trackNote:
      'after “It requires your presence.” the next cue is already “When resistance drops, presence begins to flow…”',
    trackScriptText: '',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
  finding({
    id: 'ch6-decision-to-leave',
    chapterId: 6,
    chapterLabel: 'Chapter 6 · Work, Identity and Purpose',
    kind: 'missing',
    decision:
      'Decide whether this ARC sentence was skipped in the take, or only missing from the cue text.',
    finalPlace: {
      chapter: 'Chapter 6 · Work, Identity and Purpose',
      page: '~p.79',
      landmark:
        'after “I felt fear, threatened, and resistance toward the change,” before “I questioned my value…”',
    },
    finalScriptText:
      'I made her decision to leave about me and felt it shouldn’t be happening.',
    trackFile: '08_Chapter_6',
    trackStartSeconds: 1023.81,
    trackEndSeconds: 1033.0,
    trackNote:
      'after “resistance toward the change” the next cue is “I questioned my value…”',
    trackScriptText: '',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
  finding({
    id: 'ch6-reflect-role',
    chapterId: 6,
    chapterLabel: 'Chapter 6 · Work, Identity and Purpose',
    kind: 'wording',
    decision:
      'Final script opens this reflection with “Observe the role you play at work.” Track script keeps the follow-up questions but drops that lead-in.',
    finalPlace: {
      chapter: 'Chapter 6 · Work, Identity and Purpose',
      section: 'Inner and Outer Purpose',
      page: '~p.87',
      landmark:
        '“A moment to reflect” after “Understanding inner and outer purpose is foundational…”',
    },
    finalScriptText:
      'A moment to reflect: Observe the role you play at work. Who would you be without your job title? What would change if presence became your primary purpose?',
    trackFile: '08_Chapter_6',
    trackStartSeconds: 2479.0,
    trackEndSeconds: 2507.0,
    trackNote:
      'after “presence moves from concept to lived experience,” the next cue is the job-title questions only (no “Observe the role you play at work”)',
    trackScriptText:
      'Who would you be without your job title? What would change if presence became your primary purpose?',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
  finding({
    id: 'ack-books-about-author',
    chapterId: 12,
    chapterLabel: 'Acknowledgments',
    kind: 'missing',
    decision:
      'Decide if the audio should include the reading list and About the Author, or keep those print-only.',
    finalPlace: {
      chapter: 'Acknowledgments',
      landmark:
        'after personal thanks · “Books That Shaped This Journey” (TOC ~p.149) then “About the Author” (TOC ~p.151)',
    },
    finalScriptText:
      'Books That Shaped This Journey (numbered reading list) and About the Author (~457 words after the personal thanks).',
    trackFile: '12_Acknowledgments',
    trackStartSeconds: 420,
    trackEndSeconds: 428.73,
    trackNote:
      'ends on “Thank you for helping me share this message with the world.” No cues after that for the reading list or About the Author',
    trackScriptText: '',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
  finding({
    id: 'opening-nya-sj',
    chapterId: 13,
    chapterLabel: 'Opening Credits',
    kind: 'name',
    decision: 'Lock dedication spelling to the final script (Nya / SJ) or keep the spoken form.',
    finalPlace: {
      chapter: 'Opening Credits / front matter',
      landmark: 'dedication page (before Contents)',
    },
    finalScriptText: 'Dedicated to my two greatest teachers, my children, Nya and SJ.',
    trackFile: '01_Opening_Credits',
    trackStartSeconds: 17.87,
    trackEndSeconds: 23.55,
    trackNote: 'dedication line as spoken in the take',
    trackScriptText:
      'Dedicated to my two greatest teachers, my children, Naya and S.J.',
    href: '/audio/record-sessions#manuscript-diffs',
    door: 'Record Sessions',
  }),
];

/** Alignment diffs for the Record Sessions panel (excludes delivery-only punches). */
export function manuscriptDiffFindings(
  findings: readonly ManuscriptFinding[] = MANUSCRIPT_FINDINGS,
): ManuscriptFinding[] {
  return findings.filter((finding) => finding.kind !== 'delivery');
}

/** Findings Ryan Needs may surface (only open re-record sessions). */
export function ryanNeedsManuscriptFindings(
  findings: readonly ManuscriptFinding[] = MANUSCRIPT_FINDINGS,
): ManuscriptFinding[] {
  return findings.filter((finding) => Boolean(finding.sessionId));
}

/** Cues around a finding’s seek window for read-along style scrubbing. */
export function trackCueWindow(
  finding: ManuscriptFinding,
  radius = 2,
): {
  before: AudioSentence[];
  after: AudioSentence[];
  manuscript: AudioSentence[];
} {
  const manuscript = manuscriptForChapter(finding.chapterId);
  if (manuscript.length === 0) {
    return { before: [], after: [], manuscript };
  }

  let pivot = manuscript.findIndex(
    (cue) =>
      cue.start < finding.trackEndSeconds && cue.end > finding.trackStartSeconds,
  );
  if (pivot < 0) {
    // Prefer the last cue that ends at/before the window (gap sits after it).
    let lastBefore = -1;
    for (let i = 0; i < manuscript.length; i += 1) {
      const cue = manuscript[i]!;
      if (cue.end <= finding.trackStartSeconds) lastBefore = i;
      else break;
    }
    pivot = lastBefore >= 0 ? lastBefore : manuscript.length - 1;
  }

  const from = Math.max(0, pivot - radius);
  const to = Math.min(manuscript.length, pivot + radius + 1);
  const slice = manuscript.slice(from, to);
  const localPivot = pivot - from;

  return {
    before: slice.slice(0, localPivot + 1),
    after: slice.slice(localPivot + 1),
    manuscript: slice,
  };
}

export function formatFindingClock(finding: ManuscriptFinding): string {
  return `${formatAudioTime(finding.trackStartSeconds)}–${formatAudioTime(finding.trackEndSeconds)}`;
}
