import { PageLayout } from '@/components/PageLayout';
import {
  CLIENT_DESIGN_REVIEW_INDEX,
  CLIENT_REVIEW_SECTION_ORDER,
  CLIENT_REVIEW_SECTIONS,
  CLIENT_REVIEW_STATUS_LABELS,
  type ClientReviewStatus,
} from '@/data/clientDesignReviewIndex';

function statusClassName(status: ClientReviewStatus): string {
  switch (status) {
    case 'live':
      return 'text-moss';
    case 'promoted':
      return 'text-clay';
    case 'experiment':
      return 'text-cream/55';
    case 'reference':
      return 'text-cream/40';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/** Client-shareable index. Same data as the dev Design dock; dark shell matches site nav. */
export default function ClientDesignReviewPage() {
  return (
    <PageLayout dark>
      <section className="w-full px-6 pb-20 pt-28 md:px-16 md:pt-32 lg:px-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl italic leading-tight text-cream md:text-5xl">
            Design review
          </h1>
          <p className="mt-4 text-base leading-relaxed text-cream/65 md:text-lg">
            Every design direction in one list. Open a link, compare, decide. Nothing ships until you
            approve it.
          </p>
          <p className="mt-3 font-mono text-xs text-cream/40">
            {CLIENT_DESIGN_REVIEW_INDEX.length} links · local Dev Menu mirrors this list
          </p>

          <div className="mt-12 space-y-10">
            {CLIENT_REVIEW_SECTION_ORDER.map((section) => {
              const meta = CLIENT_REVIEW_SECTIONS[section];
              const items = CLIENT_DESIGN_REVIEW_INDEX.filter((entry) => entry.section === section);
              return (
                <section key={section}>
                  <h2 className="border-b border-cream/10 pb-2 font-serif text-2xl italic text-cream">
                    {meta.label}
                  </h2>
                  <ul className="mt-4 divide-y divide-cream/8">
                    {items.map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={entry.href}
                          className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-moss"
                        >
                          <span className="min-w-0">
                            <span className="block font-sans text-base text-cream/90 group-hover:text-moss">
                              {entry.title}
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] text-cream/40">
                              {entry.href}
                            </span>
                            {entry.source ? (
                              <span className="mt-0.5 block font-mono text-[10px] text-cream/30">
                                {entry.source.split(',')[0]?.trim()}
                              </span>
                            ) : null}
                            <span className="mt-1 block text-sm leading-snug text-cream/50">
                              {entry.description}
                            </span>
                          </span>
                          <span
                            className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${statusClassName(entry.status)}`}
                          >
                            {CLIENT_REVIEW_STATUS_LABELS[entry.status]}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
