import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  KINDLE_PREORDER_HREF,
  PREORDER_COPY,
  PREORDER_FACTS,
  kindlePreorderHref,
} from './preorderLanding';

describe('preorderLanding copy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('frames waitlist as a special preview that begins with the Introduction', () => {
    expect(PREORDER_COPY.waitlist.relation.toLowerCase()).toContain('special preview');
    expect(PREORDER_COPY.waitlist.deck.toLowerCase()).toBe('out now on amazon · $0.99');
    expect(PREORDER_COPY.waitlist.preorderLabel).toBe('Buy on Amazon');
    expect(PREORDER_COPY.waitlist.title.toLowerCase()).toContain('before you read the book');
    expect(PREORDER_COPY.waitlist.lede.toLowerCase()).toContain('own voice');
    expect(PREORDER_COPY['stay-close'].relation).toBe('');
    expect(PREORDER_COPY['stay-close'].deck.toLowerCase()).toBe('is out now.');
    expect(PREORDER_COPY['stay-close'].preorderLabel).toBe('Buy on Amazon');
    expect(PREORDER_COPY['stay-close'].documentTitle.toLowerCase()).toContain('out now');
    expect(PREORDER_COPY['stay-close'].lede.toLowerCase()).not.toContain('staying close');
    expect(PREORDER_COPY['stay-close'].lede.toLowerCase()).not.toContain('teaching');
  });

  it('names the Kindle facts from the listing', () => {
    expect(PREORDER_FACTS.price).toBe('$0.99');
    expect(PREORDER_FACTS.delivers).toBe('Out now');
    expect(PREORDER_FACTS.pages).toContain('183');
  });

  it('uses the live Kindle product URL until env overrides', () => {
    vi.stubEnv('VITE_KINDLE_PREORDER_URL', '');
    expect(kindlePreorderHref()).toBe(KINDLE_PREORDER_HREF);
  });

  it('prefers the product URL when provided', () => {
    vi.stubEnv('VITE_KINDLE_PREORDER_URL', 'https://www.amazon.com/dp/EXAMPLE');
    expect(kindlePreorderHref()).toBe('https://www.amazon.com/dp/EXAMPLE');
  });
});
