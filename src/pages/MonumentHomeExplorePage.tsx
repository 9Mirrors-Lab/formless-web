/**
 * Monument home exploration — Southwestern surreal, matte charcoal, monolithic forms.
 * Lab only (/monument-home); does not change production home until promoted.
 */

import { PageLayout } from '@/components/PageLayout';
import { MonumentHomeExplore } from '@/components/monument/MonumentHomeExplore';

export default function MonumentHomeExplorePage() {
  return (
    <PageLayout hideNav briefSpectrum>
      <MonumentHomeExplore />
    </PageLayout>
  );
}
