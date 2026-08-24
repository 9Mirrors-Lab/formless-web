import { AUDIO_BOOK } from '@/data/audioBook';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';

/** Mobile well measured 381px. Portrait jacket fits that height. */
export const ADVANCE_LISTEN_JACKET_MAX_PX = 381;

export function AdvanceListenCoverJacket() {
  return (
    <img
      src={FORMLESS_BOOK_COVER.src}
      alt={`${AUDIO_BOOK.title} cover`}
      width={FORMLESS_BOOK_COVER.width}
      height={FORMLESS_BOOK_COVER.height}
      className="aspect-[5/8] h-auto w-full max-h-[min(100%,381px)] max-w-[min(100%,238px)] rounded-sm object-contain shadow-[0_18px_44px_rgba(0,0,0,0.42)]"
    />
  );
}
