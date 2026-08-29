import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import BrandDesignsPage from './BrandDesignsPage';

describe('BrandDesignsPage', () => {
  const html = renderToStaticMarkup(<BrandDesignsPage />);

  it('keeps special preview as a live page link on Active', () => {
    expect(html).toContain('href="/special-preview"');
    expect(html).toContain('aria-label="Open Special preview: Live page"');
    expect(html).not.toMatch(
      /<button[^>]*aria-label="Open Special preview: Live page"/,
    );
  });

  it('shows Active designs only on the default tab', () => {
    expect(html).toContain('Kindle preorder');
    expect(html).toContain('Special preview');
    expect(html).toContain('Audible Master · Illuminated Manuscript');
    expect(html).not.toContain('Stay Close');
    expect(html).not.toContain('Waitlist letter');
    expect(html).not.toContain('/emails/formless-waitlist-preview.html');
  });

  it('opens coded Kindle letters as page links', () => {
    expect(html).toMatch(
      /<a[^>]*href="\/emails\/formless-preorder.html"[^>]*aria-label="Open Kindle preorder: Jacket lockup"/,
    );
    expect(html).not.toMatch(
      /<button[^>]*aria-label="Open Kindle preorder: Jacket lockup"/,
    );
  });

  it('exposes Active, In work, and Template ideas tabs', () => {
    expect(html).toContain('Template ideas');
    expect(html).toContain('In work');
    expect(html).toContain('aria-label="Designs sections"');
    expect(html).toMatch(/role="tab"[^>]*aria-selected="true"[^>]*>Active</);
    expect(html).toMatch(/role="tab"[^>]*>In work</);
    expect(html).toMatch(/role="tab"[^>]*>Template ideas</);
  });
});
