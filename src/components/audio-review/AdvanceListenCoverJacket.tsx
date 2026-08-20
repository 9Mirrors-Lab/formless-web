import { AUDIO_BOOK } from '@/data/audioBook';

/** Mobile well measured 381px. The jacket never exceeds this on any breakpoint. */
export const ADVANCE_LISTEN_JACKET_MAX_PX = 381;

const COVER_SRC = '/book-covers/formless-audible.png';

export function AdvanceListenCoverJacket() {
  return (
    <img
      src={COVER_SRC}
      alt={`${AUDIO_BOOK.title} cover`}
      className="aspect-square h-auto w-full max-h-[min(100%,381px)] max-w-[min(100%,381px)] rounded-[1.25rem] object-contain shadow-[0_18px_44px_rgba(0,0,0,0.42)]"
    />
  );
}
