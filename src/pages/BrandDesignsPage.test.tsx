import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import BrandDesignsPage from './BrandDesignsPage';

describe('BrandDesignsPage', () => {
  const html = renderToStaticMarkup(<BrandDesignsPage />);

  it('groups page directions under primary pages', () => {
    expect(html).toContain('id="page-group-home"');
    expect(html).toContain('id="page-group-formless"');
    expect(html).toContain('>Formless<');
    expect(html).toContain('/design/previews/page-layout-tests.jpg');
    expect(html).toContain('Monument · home');
    expect(html).toContain('Monument · book');
    expect(html).toContain('Live page');
  });

  it('lists studio section tabs', () => {
    expect(html).toContain('aria-label="Design studio sections"');
    expect(html).toContain('Print &amp; social');
    expect(html).toContain('Final files');
    expect(html).toContain('Shipped');
    expect(html).toContain('Email');
  });

  it('includes shipped and email shelves in the tab list', () => {
    expect(html).toContain('Live pages and letters');
    expect(html).toContain('Zoho letters and previews');
  });
});
