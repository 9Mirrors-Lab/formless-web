import type { LegalDocument } from '@/lib/legalDocument';
import { PageLayout } from './PageLayout';

type LegalDocumentPageProps = {
  document: LegalDocument;
  companion?: { href: string; label: string };
};

export function LegalDocumentPage({ document, companion }: LegalDocumentPageProps) {
  return (
    <PageLayout briefSpectrum>
      <article className="site-page-header w-full px-6 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-cream/40">
            Legal
          </p>
          <h1 className="font-serif text-4xl leading-[1.1] text-cream md:text-5xl">
            {document.title}
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-cream/45">
            Effective {document.effectiveDate}
          </p>
          <p className="mt-8 font-sans text-lg leading-relaxed text-cream/70">
            {document.intro}
          </p>

          <div className="mt-14 space-y-12">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-cream/85">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 font-sans text-base leading-relaxed text-cream/62">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul className="list-disc space-y-2 pl-5 marker:text-clay/80">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-16 border-t border-cream/10 pt-8">
            <p className="font-sans text-sm leading-relaxed text-cream/55">
              Questions? Email{' '}
              <a
                href={`mailto:${document.contactEmail}`}
                className="text-clay underline-offset-4 transition-colors hover:text-clay/80 hover:underline"
              >
                {document.contactEmail}
              </a>
              .
            </p>
            {companion ? (
              <p className="mt-3 font-sans text-sm text-cream/55">
                See also{' '}
                <a
                  href={companion.href}
                  className="text-clay underline-offset-4 transition-colors hover:text-clay/80 hover:underline"
                >
                  {companion.label}
                </a>
                .
              </p>
            ) : null}
          </footer>
        </div>
      </article>
    </PageLayout>
  );
}
