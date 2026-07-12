import { resolveHeroLayoutVariant } from '@/config/featureFlags';
import { Hero } from './Hero';
import { LayoutTestHeroSection } from './LayoutTestHeroSection';

/** Home hero with feature-flagged layout variants (classic vs layout-test lockup). */
export function HomeHero() {
  const variant = resolveHeroLayoutVariant();

  if (variant === 'layout-test') {
    return <LayoutTestHeroSection />;
  }

  return <Hero />;
}
