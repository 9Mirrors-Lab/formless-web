import { Hero } from '@/components/Hero';
import { CurtainReveal } from '@/components/CurtainReveal';
import { ClientReviewBanner } from '@/components/ClientReviewBanner';
import { Footer } from '@/components/Footer';

/** Archived original home hero for client comparison (pre–layout-test lockup). */
export default function ClientReviewHeroClassicPage() {
  return (
    <div className="min-h-screen bg-charcoal text-cream">
      <ClientReviewBanner
        title="Original home hero"
        status="reference"
        note="This is the hero design before the layout-test lockup and Formless book panel. Kept here for side-by-side review with the current live home."
      />
      <Hero />
      <CurtainReveal />
      <Footer />
    </div>
  );
}
