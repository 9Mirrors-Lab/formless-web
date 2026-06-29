import { PageLayout } from '@/components/PageLayout';

export function LegalPageFallback() {
  return (
    <PageLayout briefSpectrum>
      <div className="site-page-header flex min-h-[50vh] w-full items-center justify-center px-6 pb-24 md:px-16 lg:px-24">
        <p className="font-serif text-xl text-cream/70">This page is unavailable right now.</p>
      </div>
    </PageLayout>
  );
}
