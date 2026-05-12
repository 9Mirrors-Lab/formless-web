/** Removes `<a>...</a>` from CMS strings, preserving inner text and other markup. */
export function stripAnchorsFromCopy(input: string): string {
  if (!input.includes('<a')) return input;
  return input.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
}
