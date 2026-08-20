import { canonicalChapterTitle } from '@/data/audioBook';
import {
  MANUSCRIPT_FINDINGS,
  type ManuscriptFinding,
} from '@/data/audioManuscriptFindings';
import type { RecordSession } from '@/data/audioRecordSessions';
import type { StudioChapterRecord } from '@/data/audiobookStudioCatalog';

export type BrandNeed = {
  id: string;
  sentence: string;
  href: string;
  door: string;
};

const RECORD_HREF = '/audio/record-sessions';
const LADDER_HREF = '/audio/editorial2';

function titleList(records: StudioChapterRecord[]): string {
  const names = records.map((record) => canonicalChapterTitle(record.chapterId));
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export function collectBrandNeeds(
  sessions: readonly RecordSession[],
  records: readonly StudioChapterRecord[],
  findings: readonly ManuscriptFinding[] = MANUSCRIPT_FINDINGS,
): BrandNeed[] {
  const needs: BrandNeed[] = [];
  const rerecordTracks = new Set(sessions.map((session) => session.track));
  const sessionsById = new Map(sessions.map((session) => [session.id, session]));
  const coveredSessionIds = new Set<string>();

  for (const finding of findings) {
    const session = finding.sessionId
      ? sessionsById.get(finding.sessionId)
      : undefined;
    if (finding.sessionId) coveredSessionIds.add(finding.sessionId);
    needs.push({
      id: `manuscript:${finding.id}`,
      sentence: finding.sentence,
      href: session ? `${RECORD_HREF}#${session.id}` : finding.href,
      door: finding.door,
    });
  }

  for (const session of sessions) {
    if (coveredSessionIds.has(session.id)) continue;
    needs.push({
      id: `rerecord:${session.id}`,
      sentence: `Author needs to re-record ${session.track}.`,
      href: `${RECORD_HREF}#${session.id}`,
      door: 'Record Sessions',
    });
  }

  const missingTakes = records.filter(
    (record) =>
      record.current === 'not-recorded' &&
      !rerecordTracks.has(canonicalChapterTitle(record.chapterId)),
  );
  if (missingTakes.length === 1) {
    needs.push({
      id: 'take:one',
      sentence: `${titleList(missingTakes)} still needs a take.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  } else if (missingTakes.length > 1 && missingTakes.length <= 3) {
    needs.push({
      id: 'take:few',
      sentence: `${titleList(missingTakes)} still need a take.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  } else if (missingTakes.length > 3) {
    needs.push({
      id: 'take:many',
      sentence: `${missingTakes.length} chapters still need a take.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  }

  const localMasters = records.filter((record) => record.current === 'mastered');
  if (localMasters.length === 1) {
    needs.push({
      id: 'master:one',
      sentence: `${titleList(localMasters)} has a local master that is not published yet.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  } else if (localMasters.length > 1) {
    needs.push({
      id: 'master:many',
      sentence: `${localMasters.length} local masters are not published yet.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  }

  const waitingSignOff = records.filter((record) => record.current === 'published');
  if (waitingSignOff.length === 1) {
    needs.push({
      id: 'signoff:one',
      sentence: `${titleList(waitingSignOff)} is published and still needs sign-off.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  } else if (waitingSignOff.length > 1) {
    needs.push({
      id: 'signoff:many',
      sentence: `${waitingSignOff.length} published chapters still need sign-off.`,
      href: LADDER_HREF,
      door: 'Studio ladder',
    });
  }

  return needs;
}
