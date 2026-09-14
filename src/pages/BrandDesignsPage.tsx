import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, Images } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import {
  DesignLightbox,
  type DesignPreviewItem,
} from '@/components/brand-designs/DesignLightbox';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  BRAND_ASSET_FAMILIES,
  activeDesigns,
  designCurrentVersion,
  designKindLabel,
  draftDesigns,
  materialStatusLabel,
  type BrandAssetVariant,
  type BrandDesign,
  type DesignVersion,
  type MaterialStatus,
} from '@/data/brandMaterials';
import {
  BRAND_PAGE_EXPLORATIONS,
  pageExplorationsGrouped,
  type PageExploration,
  type PageExplorationGroup,
} from '@/data/brandPageExplorations';
import {
  CANVA_TEMPLATE_IDEAS,
  FORMLESS_3D_MOCKUPS,
  canvaChannelLabel,
  formless3dMockupPreviews,
  type CanvaTemplateIdea,
  type Formless3dMockup,
} from '@/data/canvaTemplateIdeas';

type StudioSection = 'review' | 'shipped' | 'pages' | 'email' | 'print' | 'files';

const STUDIO_SECTIONS: Array<{ id: StudioSection; label: string; hint: string }> = [
  {
    id: 'review',
    label: 'Review',
    hint: 'In work and page directions',
  },
  {
    id: 'shipped',
    label: 'Shipped',
    hint: 'Live pages and letters',
  },
  {
    id: 'pages',
    label: 'Pages',
    hint: 'Interactive site explorations',
  },
  {
    id: 'email',
    label: 'Email',
    hint: 'Zoho letters and previews',
  },
  {
    id: 'print',
    label: 'Print & social',
    hint: 'Mockups and Canva ideas',
  },
  {
    id: 'files',
    label: 'Final files',
    hint: 'Cover art and marks',
  },
];

function isImagePath(path?: string): boolean {
  return Boolean(path && /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(path));
}

function isLivePageHref(href: string): boolean {
  return !isImagePath(href);
}

function pageHrefFor(design: BrandDesign, version: DesignVersion): string | undefined {
  const href = version.href ?? design.href;
  if (!href || !isLivePageHref(href)) return undefined;
  return href;
}

function previewItemsFor(design: BrandDesign): DesignPreviewItem[] {
  return design.versions
    .filter((version) => !pageHrefFor(design, version))
    .map((version) => ({
      title: design.title,
      label: version.label,
      notes: version.notes,
      previewSrc: version.previewSrc,
    }));
}

function statusTone(status: MaterialStatus): string {
  switch (status) {
    case 'active':
      return 'border-clay/50 bg-clay/15 text-cream';
    case 'draft':
      return 'border-cream/20 bg-cream/[0.04] text-cream/70';
    case 'archived':
      return 'border-cream/10 bg-transparent text-cream/45';
    default: {
      const _never: never = status;
      return _never;
    }
  }
}

function StatusMark({ status }: { status: MaterialStatus }) {
  return (
    <span
      className={[
        'inline-flex h-6 items-center rounded-full border px-2 font-mono text-[9px] uppercase tracking-[0.14em]',
        statusTone(status),
      ].join(' ')}
    >
      {materialStatusLabel(status)}
    </span>
  );
}

function StudioTabs({
  value,
  onChange,
}: {
  value: StudioSection;
  onChange: (next: StudioSection) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Design studio sections"
    >
      {STUDIO_SECTIONS.map((section) => {
        const selected = value === section.id;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(section.id)}
            className={
              selected
                ? 'inline-flex min-h-10 shrink-0 flex-col items-start border border-cream/30 bg-cream/[0.08] px-3 py-2 text-left'
                : 'inline-flex min-h-10 shrink-0 flex-col items-start border border-cream/12 px-3 py-2 text-left hover:border-cream/25'
            }
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream">
              {section.label}
            </span>
            <span className="mt-0.5 font-sans text-[11px] text-cream/45">{section.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function MaterialCard({
  design,
  onOpenGallery,
}: {
  design: BrandDesign;
  onOpenGallery: (items: DesignPreviewItem[], index: number) => void;
}) {
  const current = designCurrentVersion(design);
  const pageHref = pageHrefFor(design, current);
  const gallery = previewItemsFor(design);
  const hasGallery = gallery.length > 0;
  const multi = design.versions.length > 1;
  const thumbSrc = gallery[0]?.previewSrc ?? current.previewSrc;
  const thumbWide = hasGallery ? false : Boolean(current.wide);

  const thumb = (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0e0d]">
      <img
        src={thumbSrc}
        alt=""
        className={
          thumbWide
            ? 'h-full w-full object-contain object-center p-2'
            : 'h-full w-full object-cover object-top'
        }
      />
      {multi && hasGallery ? (
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 border border-cream/15 bg-charcoal/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/70">
          <Images className="h-3 w-3" aria-hidden />
          {design.versions.length}
        </span>
      ) : null}
    </div>
  );

  return (
    <article className="flex h-full flex-col border border-cream/12 bg-cream/[0.02]">
      {pageHref ? (
        <a href={pageHref} className="block" aria-label={`Open ${design.title}`}>
          {thumb}
        </a>
      ) : (
        <button
          type="button"
          className="block w-full text-left"
          onClick={() => {
            if (!hasGallery) return;
            onOpenGallery(gallery, 0);
          }}
          aria-label={`Preview ${design.title}`}
        >
          {thumb}
        </button>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-sans text-base font-medium leading-snug text-cream">{design.title}</h3>
          <StatusMark status={design.status} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
          {designKindLabel(design.kind)}
        </p>
        {design.usedFor ? (
          <p className="text-sm leading-relaxed text-cream/60">{design.usedFor}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {pageHref ? (
            <a
              href={pageHref}
              className="inline-flex items-center gap-1.5 border border-cream/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream transition-colors hover:border-cream/40"
            >
              Open
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : null}
          {hasGallery ? (
            <button
              type="button"
              onClick={() => onOpenGallery(gallery, 0)}
              className="inline-flex items-center gap-1.5 border border-cream/12 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60 transition-colors hover:border-cream/30 hover:text-cream"
            >
              {multi ? `Review ${design.versions.length} boards` : 'Preview'}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function PageExplorationCard({ entry }: { entry: PageExploration }) {
  const external = entry.external === true;
  return (
    <article className="flex h-full flex-col border border-cream/12 bg-cream/[0.02]">
      <a
        href={entry.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block"
        aria-label={`Open ${entry.title}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0e0d]">
          <img
            src={entry.previewSrc}
            alt=""
            className="h-full w-full object-cover object-top"
          />
        </div>
      </a>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-sans text-base font-medium leading-snug text-cream">{entry.title}</h3>
          {external ? (
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
              HTML
            </span>
          ) : null}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/55">{entry.description}</p>
        <a
          href={entry.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="mt-4 inline-flex w-fit items-center gap-1.5 border border-clay/35 bg-clay/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream transition-colors hover:border-clay/55 hover:bg-clay/20"
        >
          Open direction
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </article>
  );
}

function PageExplorationGroups({ groups }: { groups: PageExplorationGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.area} aria-labelledby={`page-group-${group.area}`}>
          <div className="mb-4 flex flex-col gap-3 border-b border-cream/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3
                  id={`page-group-${group.area}`}
                  className="font-sans text-lg font-medium tracking-[-0.02em] text-cream"
                >
                  {group.meta.label}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
                  {group.entries.length} direction{group.entries.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/50">
                {group.meta.blurb}
              </p>
            </div>
            {group.meta.productionHref ? (
              <a
                href={group.meta.productionHref}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/55 transition-colors hover:text-cream"
              >
                Live page
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
          <DesignGrid>
            {group.entries.map((entry) => (
              <PageExplorationCard key={entry.id} entry={entry} />
            ))}
          </DesignGrid>
        </section>
      ))}
    </div>
  );
}

function TemplateIdeaCard({ idea }: { idea: CanvaTemplateIdea }) {
  return (
    <article className="flex h-full flex-col gap-3 border border-cream/12 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-base font-medium text-cream">{idea.title}</h3>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/45">
          {idea.format}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-cream/60">{idea.useFor}</p>
      <div className="flex flex-wrap gap-1.5">
        {idea.channels.map((channel) => (
          <span
            key={channel}
            className="inline-flex h-7 items-center border border-cream/10 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/55"
          >
            {canvaChannelLabel(channel)}
          </span>
        ))}
      </div>
      <a
        href={idea.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex w-fit items-center gap-1.5 border border-clay/35 bg-clay/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream"
      >
        Open in Canva
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </article>
  );
}

function MockupCard({
  mockup,
  index,
  onOpen,
}: {
  mockup: Formless3dMockup;
  index: number;
  onOpen: (items: DesignPreviewItem[], index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(formless3dMockupPreviews(), index)}
      className="flex flex-col gap-2 border border-cream/12 p-2 text-left transition-colors hover:border-cream/30"
    >
      <div className="aspect-[4/3] bg-[#0c0e0d]">
        <img
          src={mockup.previewSrc}
          alt=""
          className="h-full w-full object-contain object-center"
        />
      </div>
      <div className="px-1 pb-1">
        <p className="font-sans text-sm font-medium text-cream">{mockup.title}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45">
          {mockup.label}
        </p>
      </div>
    </button>
  );
}

function AssetCard({ variant }: { variant: BrandAssetVariant }) {
  const [src, setSrc] = useState(variant.src);

  return (
    <article className="flex flex-col border border-cream/12">
      <div className="bg-[#1a1410] px-6 py-5">
        <img
          src={src}
          alt={variant.label}
          width={FORMLESS_BOOK_COVER.width}
          height={FORMLESS_BOOK_COVER.height}
          onError={() => {
            if (src !== FORMLESS_BOOK_COVER.src) setSrc(FORMLESS_BOOK_COVER.src);
          }}
          className="mx-auto w-full max-w-[10rem] object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-sm font-medium text-cream">{variant.label}</h3>
          <StatusMark status={variant.status} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
          {variant.format}
        </p>
        <p className="font-mono text-[11px] text-cream/50">{variant.canonicalPath}</p>
      </div>
    </article>
  );
}

function SectionIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-cream/55">{body}</p>
    </div>
  );
}

function DesignGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

export default function BrandDesignsPage() {
  const [section, setSection] = useState<StudioSection>('review');
  const [lightbox, setLightbox] = useState<{ items: DesignPreviewItem[]; index: number } | null>(
    null,
  );

  const shipped = useMemo(() => activeDesigns(), []);
  const inWork = useMemo(() => draftDesigns(), []);
  const emails = useMemo(
    () => [...shipped, ...inWork].filter((design) => design.kind === 'zoho-email'),
    [shipped, inWork],
  );
  const pageGroups = useMemo(() => pageExplorationsGrouped(), []);

  const openGallery = (items: DesignPreviewItem[], index: number) => {
    if (items.length === 0) return;
    setLightbox({ items, index: Math.min(Math.max(index, 0), items.length - 1) });
  };

  const headerCopy = STUDIO_SECTIONS.find((item) => item.id === section)?.hint ?? '';

  return (
    <>
      <BrandShell activeId="designs" crumb="Designs">
        <BrandPageBody>
          <div className="flex flex-col gap-8 md:gap-10">
            <BrandPageHeader
              tone="desk"
              title="Design studio"
              description="One place to review shipped work, page directions, email letters, and print ideas. Pick a shelf, open what you want to compare."
              actions={
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                  {inWork.length} in work · {BRAND_PAGE_EXPLORATIONS.length} page directions ·{' '}
                  {emails.length} email
                </p>
              }
            />

            <StudioTabs value={section} onChange={setSection} />

            {section === 'review' ? (
              <div className="flex flex-col gap-10">
                <SectionIntro
                  title="Needs review"
                  body="Drafts and interactive page directions in one pass. Open a card, compare, leave notes elsewhere."
                />
                {inWork.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                      In work · {inWork.length}
                    </h3>
                    <DesignGrid>
                      {inWork.map((design) => (
                        <MaterialCard key={design.id} design={design} onOpenGallery={openGallery} />
                      ))}
                    </DesignGrid>
                  </div>
                ) : null}
                <div className="flex flex-col gap-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    Page directions · {BRAND_PAGE_EXPLORATIONS.length}
                  </h3>
                  <PageExplorationGroups groups={pageGroups} />
                </div>
              </div>
            ) : null}

            {section === 'shipped' ? (
              <div className="flex flex-col gap-4">
                <SectionIntro
                  title="Shipped"
                  body={headerCopy}
                />
                <DesignGrid>
                  {shipped.map((design) => (
                    <MaterialCard key={design.id} design={design} onOpenGallery={openGallery} />
                  ))}
                </DesignGrid>
              </div>
            ) : null}

            {section === 'pages' ? (
              <div className="flex flex-col gap-5">
                <SectionIntro
                  title="Page explorations"
                  body="Grouped by the production page each direction explores. Open the live page to compare against what ships today."
                />
                <PageExplorationGroups groups={pageGroups} />
              </div>
            ) : null}

            {section === 'email' ? (
              <div className="flex flex-col gap-4">
                <SectionIntro
                  title="Email & letters"
                  body="Zoho-ready letters and explorations. Open the live HTML preview or review image boards."
                />
                <DesignGrid>
                  {emails.map((design) => (
                    <MaterialCard key={design.id} design={design} onOpenGallery={openGallery} />
                  ))}
                </DesignGrid>
              </div>
            ) : null}

            {section === 'print' ? (
              <div className="flex flex-col gap-10">
                <SectionIntro
                  title="Print & social"
                  body="Branded mockups and Canva library links. Copy into Canva to edit; mockups are ready for posts."
                />
                <div className="flex flex-col gap-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    3D mockups
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FORMLESS_3D_MOCKUPS.map((mockup, index) => (
                      <MockupCard key={mockup.id} mockup={mockup} index={index} onOpen={openGallery} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    Canva library
                  </h3>
                  <DesignGrid>
                    {CANVA_TEMPLATE_IDEAS.map((idea) => (
                      <TemplateIdeaCard key={idea.id} idea={idea} />
                    ))}
                  </DesignGrid>
                </div>
              </div>
            ) : null}

            {section === 'files' ? (
              <div className="flex flex-col gap-6">
                <SectionIntro
                  title="Final files"
                  body="Named finals the site and listings use. Do not swap these for draft exports."
                />
                {BRAND_ASSET_FAMILIES.map((family) => (
                  <div key={family.id} className="flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-cream/50">{family.summary}</p>
                    <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                      {family.variants.map((variant) => (
                        <AssetCard key={variant.id} variant={variant} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </BrandPageBody>
      </BrandShell>

      {lightbox ? (
        <DesignLightbox
          items={lightbox.items}
          index={lightbox.index}
          onIndexChange={(index) =>
            setLightbox((current) => (current ? { ...current, index } : current))
          }
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </>
  );
}
