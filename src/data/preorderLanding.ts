import type { PreorderAudience } from '@/config/preorderAccess';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';

/** Final Kindle jacket. Portrait 5:8. Matches the listing. */
export const PREORDER_COVER_SRC = FORMLESS_BOOK_COVER.src;
export const PREORDER_COVER_WIDTH = FORMLESS_BOOK_COVER.width;
export const PREORDER_COVER_HEIGHT = FORMLESS_BOOK_COVER.height;

export const PREORDER_WORDMARK_SRC = '/brand/eyes-closed-lockup-on-cream.svg';

/** Live Kindle listing. Override with VITE_KINDLE_PREORDER_URL if needed. */
export const KINDLE_PREORDER_HREF = 'https://www.amazon.com/dp/B0HFYC45QC';

/** Search listing kept if the product page is unpublished. */
export const KINDLE_PREORDER_SEARCH_HREF =
  'https://www.amazon.com/s?k=Formless+Who+You+Truly+Are+Beyond+the+Mind+Sonika+Cottman';

export function kindlePreorderHref(): string {
  const fromEnv = import.meta.env.VITE_KINDLE_PREORDER_URL?.trim();
  return fromEnv || KINDLE_PREORDER_HREF;
}

export const PREORDER_FACTS = {
  format: 'Kindle',
  price: '$0.99',
  /** Short status line for hero lockups (e.g. Amazon · $0.99 · Out now). */
  delivers: 'Out now',
  deliversFull: 'September 1, 2026',
  pages: '183 pages',
  language: 'English',
} as const;

export const AMAZON_PURCHASE_CTA = 'Buy on Amazon';

export const PREORDER_INTRO_LABEL = 'Introduction';

export type PreorderCopy = {
  relation: string;
  title: string;
  deck: string;
  lede: string;
  preorderLabel: string;
  documentTitle: string;
};

export const PREORDER_COPY: Record<PreorderAudience, PreorderCopy> = {
  waitlist: {
    relation: 'A special preview',
    title: 'Before you read the book, hear where the journey begins.',
    deck: 'Out now on Amazon · $0.99',
    lede: 'As a thank you for being here, I wanted to share the introduction to Formless with you in my own voice.',
    preorderLabel: AMAZON_PURCHASE_CTA,
    documentTitle: 'A special preview',
  },
  'stay-close': {
    relation: '',
    title: 'Formless',
    deck: 'is out now.',
    lede: 'You are not the voice in your head. You are the one who hears it. The book is a doorway into that, now on Kindle.',
    preorderLabel: AMAZON_PURCHASE_CTA,
    documentTitle: 'Formless is out now',
  },
};
