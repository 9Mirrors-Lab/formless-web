import { useState } from 'react';
import { Compass, Leaf, Presentation, Sparkles } from 'lucide-react';

import { PageLayout } from '@/components/PageLayout';
import { useAuth } from '@/context/AuthContext';
import {
  CLIENT_SITE_UPDATES_CLOSING,
  CLIENT_SITE_UPDATES_INTRO,
  SITE_UPDATES,
  STATUS_LABELS,
  type SiteUpdate,
  type UpdateStatus,
} from '@/data/clientSiteUpdatesContent';

type ClientTab = 'updates' | 'presentation';

const SEO_PRESENTATION_SRC = '/client/seo-presentation.html';

function statusClassName(status: UpdateStatus): string {
  switch (status) {
    case 'live':
      return 'border-moss/30 bg-moss/10 text-moss';
    case 'rolling-out':
      return 'border-clay/35 bg-clay/10 text-clay';
    case 'planned':
      return 'border-charcoal/15 bg-charcoal/5 text-charcoal/55';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function UpdateCard({ update }: { update: SiteUpdate }) {
  return (
    <article
      id={update.id}
      className="scroll-mt-32 rounded-2xl border border-charcoal/10 bg-white/60 p-8 shadow-sm md:p-10"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${statusClassName(update.status)}`}
        >
          {STATUS_LABELS[update.status]}
        </span>
      </div>
      <h2 className="font-serif text-3xl italic leading-tight text-charcoal md:text-4xl">
        {update.title}
      </h2>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">{update.summary}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-moss/15 bg-moss/[0.04] p-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-moss/80">
            Why it matters
          </p>
          <p className="text-base leading-7 text-charcoal/72">{update.whyItMatters}</p>
        </div>
        <div className="rounded-xl border border-charcoal/10 bg-charcoal/[0.03] p-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            What you will notice
          </p>
          <p className="text-base leading-7 text-charcoal/72">{update.whatYouWillNotice}</p>
        </div>
      </div>
    </article>
  );
}

function ClientTabBar({
  activeTab,
  onChange,
}: {
  activeTab: ClientTab;
  onChange: (tab: ClientTab) => void;
}) {
  const tabClass = (tab: ClientTab) =>
    [
      'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] transition-colors',
      activeTab === tab
        ? 'border-charcoal bg-charcoal text-cream'
        : 'border-charcoal/15 bg-white/60 text-charcoal/70 hover:border-charcoal/30 hover:text-charcoal',
    ].join(' ');

  return (
    <div
      className="mt-10 flex flex-wrap gap-3"
      role="tablist"
      aria-label="Client preview sections"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'updates'}
        className={tabClass('updates')}
        onClick={() => onChange('updates')}
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        Site updates
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'presentation'}
        className={tabClass('presentation')}
        onClick={() => onChange('presentation')}
      >
        <Presentation className="h-4 w-4" aria-hidden />
        SEO walkthrough
      </button>
    </div>
  );
}

function PresentationPanel() {
  return (
    <section
      className="w-full px-6 pb-20 md:px-16 lg:px-24"
      role="tabpanel"
      aria-label="SEO walkthrough presentation"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/45">
            Slide deck
          </p>
          <p className="mt-3 text-base leading-relaxed text-charcoal/70">
            A visual walkthrough of how discovery works and what we are building for Eyes Closed.
            Use arrow keys or the on-screen controls inside the deck. You can also{' '}
            <a
              href={SEO_PRESENTATION_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-moss underline-offset-4 hover:underline"
            >
              open it full screen
            </a>
            .
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal shadow-lg">
          <iframe
            title="Eyes Closed SEO walkthrough"
            src={SEO_PRESENTATION_SRC}
            className="block h-[min(78vh,720px)] w-full bg-cream"
          />
        </div>
      </div>
    </section>
  );
}

function ProtectedGate() {
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
  return null;
}

export default function ClientSiteUpdatesPage() {
  const { status, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ClientTab>('updates');

  if (status === 'loading') {
    return (
      <PageLayout>
        <section className="flex min-h-[60vh] items-center justify-center px-6">
          <p className="font-sans text-sm tracking-wide text-charcoal/60">Loading…</p>
        </section>
      </PageLayout>
    );
  }

  if (status === 'misconfigured' || !user) {
    return <ProtectedGate />;
  }

  return (
    <PageLayout>
      <section className="site-page-header relative w-full overflow-hidden px-6 pb-10 pt-8 md:px-16 md:pb-12 lg:px-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] right-[8%] h-72 w-72 rounded-full bg-moss/8 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[5%] h-64 w-64 rounded-full bg-clay/8 blur-[90px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.28em] text-charcoal/40">
            {CLIENT_SITE_UPDATES_INTRO.eyebrow}
          </span>
          <h1 className="font-serif text-5xl italic leading-[1.05] text-charcoal md:text-6xl lg:text-7xl">
            {CLIENT_SITE_UPDATES_INTRO.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-charcoal/70 md:text-xl">
            {CLIENT_SITE_UPDATES_INTRO.lede}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal/55">
            {CLIENT_SITE_UPDATES_INTRO.note}
          </p>

          <ClientTabBar activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'updates' ? (
            <div className="mt-10 flex flex-wrap gap-4 text-sm text-charcoal/55">
              <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/50 px-4 py-2">
                <Sparkles className="h-4 w-4 text-moss" aria-hidden />
                Built for discovery
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/50 px-4 py-2">
                <Compass className="h-4 w-4 text-clay" aria-hidden />
                Clear paths inward
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/50 px-4 py-2">
                <Leaf className="h-4 w-4 text-moss" aria-hidden />
                Calm, not noisy
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {activeTab === 'updates' ? (
        <>
          <section className="w-full px-6 pb-20 md:px-16 lg:px-24" role="tabpanel">
            <div className="mx-auto flex max-w-4xl flex-col gap-8">
              {SITE_UPDATES.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </section>

          <section className="w-full border-t border-charcoal/10 bg-charcoal px-6 py-20 text-cream md:px-16 lg:px-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl italic md:text-5xl">
                {CLIENT_SITE_UPDATES_CLOSING.title}
              </h2>
              <div className="mt-8 space-y-5 text-left text-base leading-8 text-cream/75 md:text-lg">
                {CLIENT_SITE_UPDATES_CLOSING.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/40">
                Private preview · Eyes Closed website
              </p>
            </div>
          </section>
        </>
      ) : (
        <PresentationPanel />
      )}
    </PageLayout>
  );
}
