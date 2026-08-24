import { describe, expect, it } from 'vitest';

import {
  LAUNCH_ADS,
  LAUNCH_CALENDAR,
  LAUNCH_CHANNELS,
  LAUNCH_LANDING,
  LAUNCH_PHASES,
  LAUNCH_POSITIONING,
  LAUNCH_SCRIPTS,
  findLaunchPiece,
  formatLaunchPieceCopy,
  formatLaunchSubjects,
  launchDeskHref,
  launchFiltersFromSearch,
  phasesForRunway,
  phasesUsedBy,
  pieceKindLabel,
  pieceShortLabel,
  piecesForChannel,
  piecesForPhase,
  piecesForRunway,
  piecesForView,
  summarizeLaunchCampaign,
} from '@/data/bookLaunchCampaign';

describe('bookLaunchCampaign', () => {
  it('keeps warm notes, list letters, LinkedIn, and X on dated runways', () => {
    const summary = summarizeLaunchCampaign();
    expect(summary.total).toBe(33);
    expect(summary.emails).toBe(17);
    expect(summary.posts).toBe(16);
    expect(summary.byChannel.warm).toBe(6);
    expect(summary.byChannel.waitlist).toBe(5);
    expect(summary.byChannel['stay-close']).toBe(4);
    expect(summary.byChannel.advance).toBe(2);
    expect(summary.byChannel.linkedin).toBe(8);
    expect(summary.byChannel.x).toBe(8);
    expect(summary.byRunway.before).toBe(10);
    expect(summary.byRunway.launch).toBe(6);
    expect(summary.byRunway.after).toBe(17);

    expect(piecesForChannel('warm').map((piece) => piece.id)).toEqual([
      'warm-1',
      'warm-2',
      'warm-3',
      'warm-4',
      'warm-5',
      'warm-6',
    ]);
    expect(piecesForChannel('waitlist').map((piece) => piece.number)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(piecesForChannel('stay-close').map((piece) => piece.id)).toEqual([
      'stay-1',
      'stay-2',
      'stay-3',
      'stay-4',
    ]);
    expect(piecesForChannel('advance').map((piece) => piece.id)).toEqual([
      'adv-1',
      'adv-2',
    ]);
    expect(LAUNCH_CHANNELS.warm.pieceKind).toBe('email');
    expect(LAUNCH_CHANNELS.waitlist.pieceKind).toBe('email');
    expect(LAUNCH_CHANNELS['stay-close'].pieceKind).toBe('email');
    expect(LAUNCH_CHANNELS.advance.pieceKind).toBe('email');
    expect(LAUNCH_CHANNELS.linkedin.pieceKind).toBe('post');
    expect(LAUNCH_CHANNELS.x.pieceKind).toBe('post');
  });

  it('lines pieces up on the shared launch timeline', () => {
    expect(piecesForPhase('quiet').map((piece) => piece.id)).toEqual([
      'warm-1',
      'warm-2',
      'li-1',
      'x-1',
    ]);
    expect(piecesForPhase('eve').map((piece) => piece.id)).toEqual(['warm-4']);
    expect(piecesForPhase('week-2').map((piece) => piece.id)).toEqual([
      'pro-5',
      'stay-4',
      'adv-2',
      'li-5',
      'x-5',
    ]);
    expect(piecesForPhase('launch-day').map((piece) => piece.channel)).toEqual([
      'warm',
      'waitlist',
      'stay-close',
      'advance',
      'linkedin',
      'x',
    ]);

    const warmPhases = phasesUsedBy(piecesForChannel('warm')).map((phase) => phase.id);
    expect(warmPhases).toContain('quiet');
    expect(warmPhases).toContain('eve');
    expect(warmPhases).not.toContain('month-2');
    expect(LAUNCH_PHASES).toHaveLength(9);
    expect(phasesForRunway('before').map((phase) => phase.id)).toEqual([
      'quiet',
      'approach',
      'eve',
    ]);
    expect(piecesForRunway('launch')).toHaveLength(6);
  });

  it('filters the desk by campaign view', () => {
    expect(piecesForView('all')).toHaveLength(33);
    expect(piecesForView('intake')).toHaveLength(33);
    expect(piecesForView('landing')).toHaveLength(33);
    expect(piecesForView('warm').every((piece) => piece.channel === 'warm')).toBe(
      true,
    );
    expect(findLaunchPiece('pro-2')?.title).toBe('Formless is available');
    expect(findLaunchPiece('missing')).toBeNull();
  });

  it('copies an email with a subject and a post as body only', () => {
    const warm = findLaunchPiece('warm-1')!;
    expect(pieceKindLabel(warm.kind)).toBe('Email');
    expect(pieceShortLabel(warm)).toBe('Email 1');
    expect(formatLaunchSubjects(warm)).toContain(
      "1. Something I've been writing is almost here",
    );
    expect(formatLaunchPieceCopy(warm)).toContain(
      "Subject: Something I've been writing is almost here",
    );
    expect(formatLaunchPieceCopy(warm, 2)).toContain(
      'Subject: I wanted you to hear this from me',
    );
    expect(formatLaunchPieceCopy(warm)).toContain('September 1');
    expect(formatLaunchPieceCopy(warm)).not.toContain('launch team');

    const post = findLaunchPiece('li-3')!;
    expect(formatLaunchPieceCopy(post)).toBe(post.body);
    expect(formatLaunchPieceCopy(post).startsWith('Subject:')).toBe(false);
    expect(post.body).toContain('Kindle and Audible');
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
    ).toEqual({ campaign: 'waitlist', piece: 'pro-2' });
    expect(
      launchFiltersFromSearch('?campaign=waitlist&piece=pro-2'),
    ).toEqual({ campaign: 'waitlist', piece: 'pro-2' });
    expect(
      launchFiltersFromSearch('?campaign=stay-close&piece=stay-2'),
    ).toEqual({ campaign: 'stay-close', piece: 'stay-2' });
    expect(launchFiltersFromSearch('?campaign=x&piece=x-3')).toEqual({
      campaign: 'x',
      piece: 'x-3',
    });
    expect(launchFiltersFromSearch('?campaign=nope&piece=missing')).toEqual({
      campaign: 'all',
      piece: null,
    });
  });

  it('locks Formless positioning and supporting assets', () => {
    expect(LAUNCH_POSITIONING.book).toBe('Formless');
    expect(LAUNCH_POSITIONING.launchDate).toContain('September 1, 2026');
    expect(LAUNCH_LANDING.map((section) => section.id)).toEqual([
      'hero',
      'problem',
      'solution',
      'how',
      'themes',
      'proof',
      'cta',
    ]);
    expect(LAUNCH_ADS).toHaveLength(4);
    expect(LAUNCH_SCRIPTS).toHaveLength(2);
    expect(LAUNCH_CALENDAR[0]?.when).toBe('Sat Aug 22');
    expect(LAUNCH_ADS.every((ad) => !/learn more/i.test(ad.cta))).toBe(true);
  });
});
