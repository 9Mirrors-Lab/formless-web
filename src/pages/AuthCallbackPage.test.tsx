import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AuthCallbackPage } from './AuthCallbackPage';

describe('AuthCallbackPage', () => {
  it('renders a sign-in status screen without CMS content', () => {
    const html = renderToStaticMarkup(<AuthCallbackPage />);

    expect(html).toContain('Signing you in');
    expect(html).toContain('Completing sign in');
  });
});
