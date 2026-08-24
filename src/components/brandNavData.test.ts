import { describe, expect, it } from 'vitest';

import {
  AUDIBLE_DESK_TABS,
  NAV_ROOMS,
  navHighlightId,
} from '@/components/brandNavData';

describe('Audible navigation', () => {
  it('keeps Listen, Book vs audio, and Record Sessions in the sidebar', () => {
    const audible = NAV_ROOMS.find((room) => room.id === 'audible');
    expect(audible?.items.map((item) => item.id)).toEqual([
      'audible',
      'script-compare',
      'record-sessions',
    ]);
    expect(audible?.items.map((item) => item.title)).toEqual([
      'Listen',
      'Book vs audio',
      'Record Sessions',
    ]);
  });

  it('moves record list, studio ladder, and process onto Book vs audio tabs', () => {
    expect(AUDIBLE_DESK_TABS.map((tab) => tab.id)).toEqual([
      'script-compare',
      'record-list',
      'audible-studio',
      'audible-process',
    ]);
  });

  it('highlights Book vs audio in the sidebar while a desk tab is open', () => {
    expect(navHighlightId('record-list')).toBe('script-compare');
    expect(navHighlightId('audible-studio')).toBe('script-compare');
    expect(navHighlightId('audible-process')).toBe('script-compare');
    expect(navHighlightId('audible')).toBe('audible');
    expect(navHighlightId('record-sessions')).toBe('record-sessions');
  });
});
