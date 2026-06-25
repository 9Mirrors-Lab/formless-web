import {
  getBackgroundOption,
  isShaderBackground,
  type BackgroundId,
  type ThemePalette,
} from './backgroundOptions';

export type { BackgroundId, ThemePalette };
/** @deprecated Use BackgroundId */
export type ShaderThemeId = BackgroundId;

export function getBackgroundPalette(id: BackgroundId): ThemePalette | null {
  const option = getBackgroundOption(id);
  if (!isShaderBackground(option)) {
    return null;
  }
  return option.palette;
}

export function getShaderThemeIds(): BackgroundId[] {
  return ['forest', 'sunset'];
}
