/**
 * Results from comparing the recorded take to the manuscript.
 * Ryan Needs surfaces open findings. Record Sessions holds the punch when one exists.
 */

export type ManuscriptFinding = {
  id: string;
  chapterId: number;
  at: string;
  sentence: string;
  href: string;
  door: string;
  /** When set, this finding is the Ryan Needs line for that Record Session. */
  sessionId?: string;
};

export const MANUSCRIPT_FINDINGS: readonly ManuscriptFinding[] = [
  {
    id: 'ch9-productivity-rush',
    chapterId: 9,
    at: '2:32',
    sentence:
      'Chapter 9 manuscript: “productivity” is rushed at 2:32 in the source take.',
    href: '/audio/record-sessions#chapter-9-productivity',
    door: 'Record Sessions',
    sessionId: 'chapter-9-productivity',
  },
];
