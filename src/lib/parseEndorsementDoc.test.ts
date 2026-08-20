import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { statusFromCuts } from '@/data/endorsements';
import { endorsementsFromDocText } from '@/lib/endorsementDoc';
import {
  endorsementIdFromName,
  parseEndorsementDoc,
} from '@/lib/parseEndorsementDoc';

const fixture = readFileSync(
  fileURLToPath(new URL('./endorsementDoc.fixture.txt', import.meta.url)),
  'utf8',
);

describe('parseEndorsementDoc', () => {
  it('reads every current letter from the Google Doc export', () => {
    const parsed = parseEndorsementDoc(fixture);
    expect(parsed.map((row) => row.id)).toEqual([
      'sean-cottman',
      'william-lambos',
      'gurprem-singh',
      'simrat-saini',
      'rebecca-lanstein',
      'jackie-krawczak',
      'rittika-saini',
      'jamie-girouard',
      'mckinna-sandoval',
      'courtney-gallacher',
      'stephanie-bass',
      'angie-bains',
      'esther-mcdonald',
    ]);
  });

  it('keeps competing short versions and later arrivals', () => {
    const parsed = parseEndorsementDoc(fixture);
    const courtney = parsed.find((row) => row.id === 'courtney-gallacher')!;
    expect(courtney.cuts.filter((cut) => cut.kind === 'trimmed')).toHaveLength(2);
    expect(courtney.cuts.some((cut) => cut.variant === 'b')).toBe(true);

    const sean = parsed.find((row) => row.id === 'sean-cottman')!;
    expect(sean.cuts.some((cut) => cut.kind === 'pull')).toBe(true);

    const esther = parsed.find((row) => row.id === 'esther-mcdonald')!;
    expect(esther.cuts).toHaveLength(1);
    expect(esther.name).toBe('Esther McDonald');

    const stephanie = parsed.find((row) => row.id === 'stephanie-bass')!;
    expect(stephanie.note).toMatch(/page 4/i);
  });

  it('picks up a new letter added to the doc', () => {
    const extra = `${fixture}

________________


This new letter is long enough that it still needs a short version for Amazon and the site. The writer talks about staying with the work day after day.

—Alex Rivera, Teacher
`;
    const parsed = parseEndorsementDoc(extra);
    expect(parsed.at(-1)?.id).toBe('alex-rivera');
    expect(parsed.at(-1)?.role).toBe('Teacher');
    expect(parsed).toHaveLength(14);
  });

  it('turns a name into a stable id', () => {
    expect(endorsementIdFromName('William A. Lambos, PhD')).toBe(
      'william-lambos',
    );
    expect(endorsementIdFromName('Jackie Krawczak LLC')).toBe('jackie-krawczak');
    expect(endorsementIdFromName('Angie Bains, MC')).toBe('angie-bains');
  });
});

describe('endorsementsFromDocText', () => {
  it('keeps desk labels and updates status from the live cuts', () => {
    const rows = endorsementsFromDocText(fixture);
    expect(rows).toHaveLength(13);

    const esther = rows.find((row) => row.id === 'esther-mcdonald')!;
    expect(esther.status).toBe('needs-trim');
    expect(esther.voices).toEqual(['professional']);

    const courtney = rows.find((row) => row.id === 'courtney-gallacher')!;
    expect(courtney.status).toBe('needs-pick');
    expect(statusFromCuts(courtney.cuts)).toBe('needs-pick');

    const jamie = rows.find((row) => row.id === 'jamie-girouard')!;
    expect(jamie.status).toBe('ready');
    expect(jamie.cuts.some((cut) => cut.kind === 'pull')).toBe(true);
  });
});
