import { useLayoutEffect } from 'react';

import { legacySignupsRedirectTarget } from '@/lib/engagementDesk';

/** Legacy route: send /brand/signups to Engagement → Signups. */
export default function BrandSignupsPage() {
  useLayoutEffect(() => {
    window.location.replace(legacySignupsRedirectTarget(window.location.search));
  }, []);

  return null;
}
