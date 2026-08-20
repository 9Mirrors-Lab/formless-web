import { describe, expect, it } from 'vitest';

import {
  ENDORSEMENTS,
  attributionLine,
  cutsOfKind,
  endorsementDeskHref,
  endorsementFiltersFromSearch,
  endorsementsToText,
  filterEndorsements,
  formatEndorsementCopy,
  preferredCut,
  summarizeEndorsements,
} from '@/data/endorsements';

describe('endorsements', () => {
  it('keeps every voice that arrived, including Esther later', () => {
    expect(ENDORSEMENTS).toHaveLength(13);
    expect(ENDORSEMENTS.map((row) => row.id)).toContain('esther-mcdonald');
    expect(ENDORSEMENTS.at(-1)?.id).toBe('esther-mcdonald');
  });

  it('flags work still open on the desk', () => {
    const summary = summarizeEndorsements(ENDORSEMENTS);
    expect(summary.total).toBe(13);
    expect(summary.byStatus['needs-trim']).toBe(1);
    expect(summary.byStatus['needs-pick']).toBe(1);
    expect(summary.byVoice.clinical).toBe(4);
    expect(summary.byVoice.peer).toBe(1);
    expect(summary.withTrim).toBe(10);
  });

  it('filters by voice, theme, status, and search', () => {
    const clinical = filterEndorsements(ENDORSEMENTS, {
      voice: 'clinical',
      theme: 'all',
      status: 'all',
      query: '',
    });
    expect(clinical.map((row) => row.id)).toEqual([
      'william-lambos',
      'rittika-saini',
      'stephanie-bass',
      'angie-bains',
    ]);

    const recovery = filterEndorsements(ENDORSEMENTS, {
      voice: 'all',
      theme: 'recovery',
      status: 'all',
      query: '',
    });
    expect(recovery.map((row) => row.id)).toEqual(['courtney-gallacher']);

    const needsTrim = filterEndorsements(ENDORSEMENTS, {
      voice: 'all',
      theme: 'all',
      status: 'needs-trim',
      query: '',
    });
    expect(needsTrim.map((row) => row.id)).toEqual(['esther-mcdonald']);

    const search = filterEndorsements(ENDORSEMENTS, {
      voice: 'all',
      theme: 'all',
      status: 'all',
      query: 'neuroscientist',
    });
    expect(search.map((row) => row.id)).toEqual(['william-lambos']);
  });

  it('falls back when a cut is missing', () => {
    const esther = ENDORSEMENTS.find((row) => row.id === 'esther-mcdonald')!;
    expect(preferredCut(esther, 'trimmed').kind).toBe('full');
    expect(preferredCut(esther, 'pull').kind).toBe('full');

    const jackie = ENDORSEMENTS.find((row) => row.id === 'jackie-krawczak')!;
    expect(preferredCut(jackie, 'pull').text).toMatch(/society needs/i);

    const courtney = ENDORSEMENTS.find((row) => row.id === 'courtney-gallacher')!;
    expect(cutsOfKind(courtney, 'trimmed')).toHaveLength(2);
    expect(preferredCut(courtney, 'trimmed').variant).toBe('a');
  });

  it('reads desk filters from the URL', () => {
    expect(endorsementFiltersFromSearch('?voice=clinical&cut=pull')).toEqual({
      voice: 'clinical',
      theme: 'all',
      status: 'all',
      cut: 'pull',
      query: '',
    });
    expect(endorsementDeskHref({ voice: 'clinical', cut: 'pull' })).toBe(
      '/brand/endorsements?voice=clinical&cut=pull',
    );
    expect(endorsementDeskHref()).toBe('/brand/endorsements');
  });

  it('formats a paste-ready cut', () => {
    const sean = ENDORSEMENTS[0]!;
    const pull = preferredCut(sean, 'pull');
    expect(formatEndorsementCopy(sean, pull)).toContain('change the world');
    expect(formatEndorsementCopy(sean, pull)).toContain(attributionLine(sean));
    expect(endorsementsToText([sean], 'pull')).toContain('Sean Cottman');
  });
});
