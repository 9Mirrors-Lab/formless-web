/** Strip optional quotes from a font-family value. */
export function parseFontFamilyName(family: string): string {
  return family.replace(/^["']|["']$/g, "").trim();
}

/** True when the browser has a usable face for this family (no generic fallbacks). */
export async function isFontFamilyAvailable(family: string): Promise<boolean> {
  const name = parseFontFamilyName(family);
  if (!name) return false;

  const probes = [
    `400 16px "${name}"`,
    `300 16px "${name}"`,
    `italic 400 16px "${name}"`,
    `italic 300 16px "${name}"`,
  ];

  try {
    await document.fonts.ready;
    await Promise.all(probes.map((spec) => document.fonts.load(spec).catch(() => undefined)));

    return probes.some((spec) => document.fonts.check(spec));
  } catch {
    return false;
  }
}
