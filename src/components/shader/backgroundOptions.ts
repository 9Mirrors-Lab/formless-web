import type { LucideIcon } from 'lucide-react';
import { Mountain, Sun, Trees, Waves, Wind } from 'lucide-react';

export type BackgroundId =
  | 'forest'
  | 'sunset'
  | 'sunset-coast'
  | 'mountain-valley'
  | 'misty-river'
  | 'desert-dusk';

export type ThemePalette = {
  baseBg: string;
  meshPrimary: readonly [string, string, string, string, string];
  meshOverlay: readonly [string, string, string, string];
};

export type BackgroundKind = 'shader' | 'image';

type BackgroundOptionBase = {
  id: BackgroundId;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
};

export type ShaderBackgroundOption = BackgroundOptionBase & {
  kind: 'shader';
  previewColors: readonly [string, string, string];
  palette: ThemePalette;
};

export type ImageBackgroundOption = BackgroundOptionBase & {
  kind: 'image';
  imageSrc: string;
  /** Fallback color while the image loads. */
  baseBg: string;
};

export type BackgroundOption = ShaderBackgroundOption | ImageBackgroundOption;

const FOREST_PALETTE: ThemePalette = {
  baseBg: '#080A08',
  meshPrimary: ['#080A08', '#1B241B', '#26211A', '#4A5239', '#8C7A5A'],
  meshOverlay: ['#080A08', '#26211A', '#8C7A5A', '#4A5239'],
};

const SUNSET_PALETTE: ThemePalette = {
  baseBg: '#0c0a14',
  meshPrimary: ['#0c0a14', '#1e1b4b', '#5b21b6', '#c2410c', '#fbbf24'],
  meshOverlay: ['#0c0a14', '#312e81', '#ea580c', '#fde68a'],
};

/** Add new entries here as backgrounds are approved (target: 6 total). */
export const BACKGROUND_OPTIONS: readonly BackgroundOption[] = [
  {
    id: 'forest',
    kind: 'shader',
    label: 'Forest',
    icon: Trees,
    previewColors: ['#1B241B', '#4A5239', '#8C7A5A'],
    palette: FOREST_PALETTE,
    enabled: true,
  },
  {
    id: 'sunset',
    kind: 'shader',
    label: 'Sunset',
    icon: Sun,
    previewColors: ['#5b21b6', '#c2410c', '#fbbf24'],
    palette: SUNSET_PALETTE,
    enabled: true,
  },
  {
    id: 'sunset-coast',
    kind: 'image',
    label: 'Sunset Coast',
    icon: Sun,
    imageSrc: '/backgrounds/sunset-coast.jpg',
    baseBg: '#1a1208',
    enabled: true,
  },
  {
    id: 'mountain-valley',
    kind: 'image',
    label: 'Mountain Valley',
    icon: Mountain,
    imageSrc: '/backgrounds/mountain-valley.jpg',
    baseBg: '#141820',
    enabled: true,
  },
  {
    id: 'misty-river',
    kind: 'image',
    label: 'Misty River',
    icon: Waves,
    imageSrc: '/backgrounds/misty-river.jpg',
    baseBg: '#121614',
    enabled: true,
  },
  {
    id: 'desert-dusk',
    kind: 'image',
    label: 'Desert Dusk',
    icon: Wind,
    imageSrc: '/backgrounds/desert-dusk.jpg',
    baseBg: '#1a1008',
    enabled: true,
  },
];

export const DEFAULT_BACKGROUND_ID: BackgroundId = 'forest';

const ENABLED_IDS = new Set(
  BACKGROUND_OPTIONS.filter((option) => option.enabled).map((option) => option.id),
);

export function getBackgroundOption(id: BackgroundId): BackgroundOption {
  const match = BACKGROUND_OPTIONS.find((option) => option.id === id);
  if (match?.enabled) {
    return match;
  }
  return BACKGROUND_OPTIONS.find((option) => option.enabled) ?? BACKGROUND_OPTIONS[0];
}

export function parseBackgroundId(value: string | null): BackgroundId {
  if (value && ENABLED_IDS.has(value as BackgroundId)) {
    return value as BackgroundId;
  }
  return DEFAULT_BACKGROUND_ID;
}

export function isShaderBackground(option: BackgroundOption): option is ShaderBackgroundOption {
  return option.kind === 'shader';
}

export function isImageBackground(option: BackgroundOption): option is ImageBackgroundOption {
  return option.kind === 'image';
}
