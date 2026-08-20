import { describe, expect, it } from 'vitest';

import {
  LAUNCH_CHANNELS,
  LAUNCH_PHASES,
  LAUNCH_PIECES,
  findLaunchPiece,
  formatLaunchPieceCopy,
  formatLaunchSubjects,
  launchDeskHref,
  launchFiltersFromSearch,
  phasesUsedBy,
  pieceKindLabel,
  pieceShortLabel,
  piecesForChannel,
  piecesForPhase,
  piecesForView,
  summarizeLaunchCampaign,
} from '@/data/bookLaunchCampaign';

describe('bookLaunchCampaign', () => {
  it('keeps warm emails, professional emails, and LinkedIn posts in their campaigns', () => {
    const summary = summarizeLaunchCampaign();
    expect(summary.total).toBe(25);
    expect(summary.emails).toBe(15);
    expect(summary.posts).toBe(10);
    expect(summary.byChannel.warm).toBe(9);
    expect(summary.byChannel.professional).toBe(6);
    expect(summary.byChannel.linkedin).toBe(10);

    expect(piecesForChannel('warm').map((piece) => piece.id)).toEqual([
      'warm-1',
      'warm-2',
      'warm-3',
      'warm-4',
      'warm-5',
      'warm-6',
      'warm-7',
      'warm-8',
      'warm-9',
    ]);
    expect(piecesForChannel('professional').map((piece) => piece.number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(LAUNCH_CHANNELS.warm.pieceKind).toBe('email');
    expect(LAUNCH_CHANNELS.linkedin.pieceKind).toBe('post');
  });

  it('lines pieces up on the shared launch timeline', () => {
    expect(piecesForPhase('3-weeks').map((piece) => piece.id)).toEqual([
      'warm-1',
      'pro-1',
      'li-1',
    ]);
    expect(piecesForPhase('2-5-weeks').map((piece) => piece.id)).toEqual(['warm-2']);
    expect(piecesForPhase('eve').map((piece) => piece.id)).toEqual(['warm-5']);
    expect(piecesForPhase('late-launch').map((piece) => piece.id)).toEqual(['li-8']);
    expect(piecesForPhase('launch-day').map((piece) => piece.channel)).toEqual([
      'warm',
      'professional',
      'linkedin',
    ]);

    const warmPhases = phasesUsedBy(piecesForChannel('warm')).map((phase) => phase.id);
    expect(warmPhases).toContain('2-5-weeks');
    expect(warmPhases).toContain('eve');
    expect(warmPhases).not.toContain('late-launch');
    expect(LAUNCH_PHASES).toHaveLength(11);
  });

  it('filters the desk by campaign view', () => {
    expect(piecesForView('all')).toHaveLength(25);
    expect(piecesForView('intake')).toHaveLength(25);
    expect(piecesForView('warm').every((piece) => piece.channel === 'warm')).toBe(
      true,
    );
    expect(findLaunchPiece('pro-3')?.title).toBe('Launch day');
    expect(findLaunchPiece('missing')).toBeNull();
  });

  it('copies an email with a subject and a post as body only', () => {
    const warm = findLaunchPiece('warm-1')!;
    expect(pieceKindLabel(warm.kind)).toBe('Email');
    expect(pieceShortLabel(warm)).toBe('Email 1');
    expect(formatLaunchSubjects(warm)).toContain(
      '1. I’d love your help with something meaningful',
    );
    expect(formatLaunchPieceCopy(warm)).toContain(
      'Subject: I’d love your help with something meaningful',
    );
    expect(formatLaunchPieceCopy(warm, 3)).toContain('Subject: Your early copy is ready');
    expect(formatLaunchPieceCopy(warm)).toContain('[ARC Download Link]');

    const post = findLaunchPiece('li-6')!;
    expect(formatLaunchPieceCopy(post)).toBe(post.body);
    expect(formatLaunchPieceCopy(post).startsWith('Subject:')).toBe(false);
  });

  it('builds and reads desk URLs', () => {
    expect(launchDeskHref()).toBe('/brand/book-launch-campaign');
    expect(launchDeskHref({ campaign: 'all' })).toBe('/brand/book-launch-campaign');
    expect(
      launchDeskHref({ campaign: 'warm', piece: 'warm-1' }),
    ).toBe('/brand/book-launch-campaign?campaign=warm&piece=warm-1');

    expect(launchFiltersFromSearch('')).toEqual({ campaign: 'all', piece: null });
    expect(
      launchFiltersFromSearch('?campaign=professional&piece=pro-2'),
    ).toEqual({ campaign: 'professional', piece: 'pro-2' });
    expect(launchFiltersFromSearch('?campaign=nope&piece=missing')).toEqual({
      campaign: 'all',
      piece: null,
    });
  });
});
