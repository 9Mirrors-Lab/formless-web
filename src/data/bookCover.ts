/**
 * Final Kindle jacket. Portrait 5:8. Title, subtitle, and author are in the art.
 * Cover family (ebook + print) lives in `src/data/brandMaterials.ts`.
 */
export const FORMLESS_BOOK_COVER = {
  src: '/book-covers/formless-ebook.jpg',
  width: 640,
  height: 1024,
  alt: 'Cover of Formless by Sonika Cottman. A figure dissolving into dusk light. Who You Truly Are Beyond the Mind.',
} as const;

/**
 * Print master of the same jacket. Upscaled for ~15" × 24" at 300 dpi (no stretch).
 * Use this for download / print; keep the ebook file for site pages.
 */
export const FORMLESS_PRINT_COVER = {
  src: '/book-covers/formless-print.jpg',
  width: 4480,
  height: 7168,
  dpi: 300,
  alt: FORMLESS_BOOK_COVER.alt,
} as const;
