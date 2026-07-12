import { CurtainReveal } from './CurtainReveal';
import { HomeHero } from './HomeHero';

/** Shared home body used by full `App` and restricted public shell. */
export function HomePageContent() {
  return (
    <>
      <HomeHero />
      <CurtainReveal />
    </>
  );
}
