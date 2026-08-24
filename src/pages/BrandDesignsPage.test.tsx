import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import BrandDesignsPage from './BrandDesignsPage';

describe('BrandDesignsPage', () => {
  const html = renderToStaticMarkup(<BrandDesignsPage />);

  it('keeps special preview as a live page link', () => {
    expect(html).toContain('href="/special-preview"');
    expect(html).toContain('aria-label="Open Special preview: Live page"');
    expect(html).not.toMatch(
      /<button[^>]*aria-label="Open Special preview: Live page"/,
    );
  });

  it('opens image thumbs as buttons, including coded email screenshots', () => {
    expect(html).toMatch(
      /<button[^>]*aria-label="Open Stay Close: Waitlist thank-you kit"/,
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Open Stay Close: Intended waitlist letter"/,
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Open Waitlist letter: Coded letter"/,
    );
    expect(html).toMatch(
      /<button[^>]*aria-label="Open Kindle preorder: Coded letter"/,
    );
    expect(html).not.toMatch(
      /<a[^>]*aria-label="Open Waitlist letter: Coded letter"/,
    );
    expect(html).not.toMatch(
      /<a[^>]*aria-label="Open Kindle preorder: Coded letter"/,
    );
  });

  it('still lists the coded email files in the path row', () => {
    expect(html).toContain('/email-previews/waitlist-intended.html');
    expect(html).toContain('/emails/formless-preorder.html');
  });
});
