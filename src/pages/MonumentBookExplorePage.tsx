/**
 * Monument book exploration — same CMS copy, architectural Southwestern layout.
 * Lab only (/monument-book); does not change production /book until promoted.
 */

import { PageLayout } from '@/components/PageLayout';
import { MonumentBookExplore } from '@/components/monument/MonumentBookExplore';

export default function MonumentBookExplorePage() {
  return (
    <PageLayout hideNav briefSpectrum>
      <MonumentBookExplore />
    </PageLayout>
  );
}
