import { Hero } from './Hero';
import { CurtainReveal } from './CurtainReveal';

/** Shared home body used by full `App` and restricted public shell. */
export function HomePageContent() {
  return (
    <>
      <Hero />
      <CurtainReveal />
    </>
  );
}
