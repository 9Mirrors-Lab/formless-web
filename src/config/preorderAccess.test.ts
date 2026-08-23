import { describe, expect, it } from 'vitest';

import { isPreorderPath, preorderAudienceFromPath } from './preorderAccess';

describe('preorderAccess', () => {
  it('recognizes waitlist and stay-close landings', () => {
    expect(isPreorderPath('/special-preview')).toBe(true);
    expect(isPreorderPath('/special-preview/')).toBe(true);
    expect(isPreorderPath('/preorder')).toBe(true);
    expect(isPreorderPath('/preorder/')).toBe(true);
    expect(isPreorderPath('/Preorder/Stay-Close')).toBe(true);
    expect(isPreorderPath('/book')).toBe(false);
    expect(isPreorderPath('/advance-listen')).toBe(false);
  });

  it('maps path to audience', () => {
    expect(preorderAudienceFromPath('/special-preview')).toBe('waitlist');
    expect(preorderAudienceFromPath('/preorder')).toBe('waitlist');
    expect(preorderAudienceFromPath('/preorder/stay-close/')).toBe('stay-close');
    expect(preorderAudienceFromPath('/preorder/other')).toBe(null);
  });
});
