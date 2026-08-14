import {
  FOREST_PALETTE,
  SUNSET_PALETTE,
  type ThemePalette,
} from '@/components/shader/backgroundOptions';
import type { AudioChapterId } from '@/data/audioBook';

export type ListenFieldThemeId =
  | 'forest'
  | 'sunset'
  | 'ember'
  | 'river'
  | 'void'
  | 'dusk';

export type ListenFieldTheme = {
  id: ListenFieldThemeId;
  palette: ThemePalette;
  motion: 'forest' | 'sunset';
};

const EMBER_PALETTE: ThemePalette = {
  baseBg: '#0c0806',
  meshPrimary: ['#0c0806', '#1a1210', '#3d241c', '#8c4a32', '#cc5833'],
  meshOverlay: ['#0c0806', '#3d241c', '#cc5833', '#8c7a5a'],
};

const RIVER_PALETTE: ThemePalette = {
  baseBg: '#07090a',
  meshPrimary: ['#07090a', '#12181a', '#1c2a2e', '#3d5c58', '#7a9aa0'],
  meshOverlay: ['#07090a', '#1c2a2e', '#7a9aa0', '#4A5239'],
};

const VOID_PALETTE: ThemePalette = {
  baseBg: '#060807',
  meshPrimary: ['#060807', '#0e1210', '#1a1c18', '#3a3d36', '#c4c0b4'],
  meshOverlay: ['#060807', '#1a1c18', '#c4c0b4', '#8C7A5A'],
};

const DUSK_PALETTE: ThemePalette = {
  baseBg: '#0a0908',
  meshPrimary: ['#0a0908', '#161310', '#2a2418', '#5c4a32', '#a89070'],
  meshOverlay: ['#0a0908', '#2a2418', '#a89070', '#4A5239'],
};

export const LISTEN_FIELD_THEMES: Record<ListenFieldThemeId, ListenFieldTheme> = {
  forest: { id: 'forest', palette: FOREST_PALETTE, motion: 'forest' },
  sunset: { id: 'sunset', palette: SUNSET_PALETTE, motion: 'sunset' },
  ember: { id: 'ember', palette: EMBER_PALETTE, motion: 'sunset' },
  river: { id: 'river', palette: RIVER_PALETTE, motion: 'forest' },
  void: { id: 'void', palette: VOID_PALETTE, motion: 'forest' },
  dusk: { id: 'dusk', palette: DUSK_PALETTE, motion: 'sunset' },
};

/** Adjacent tracks never share a tone. Each of the six fields is used twice. */
export const LISTEN_FIELD_THEME_BY_CHAPTER: Record<AudioChapterId, ListenFieldThemeId> = {
  13: 'forest',
  0: 'void',
  1: 'ember',
  2: 'river',
  3: 'dusk',
  4: 'sunset',
  5: 'ember',
  6: 'dusk',
  7: 'forest',
  8: 'river',
  9: 'sunset',
  12: 'void',
};

export function listenFieldThemeForChapter(chapterId: number): ListenFieldTheme {
  const themeId =
    chapterId in LISTEN_FIELD_THEME_BY_CHAPTER
      ? LISTEN_FIELD_THEME_BY_CHAPTER[chapterId as AudioChapterId]
      : 'forest';
  return LISTEN_FIELD_THEMES[themeId];
}
