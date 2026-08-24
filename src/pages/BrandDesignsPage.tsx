import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { FORMLESS_BOOK_COVER } from '@/data/bookCover';
import {
  BRAND_ASSET_FAMILIES,
  DESIGN_KINDS_IN_USE,
  designChipFacetLabel,
  designChips,
  designCurrentVersion,
  designKindCounts,
  designKindLabel,
  designVersionRoleLabel,
  designVersionRows,
  designsByKind,
  formatShortDate,
  liveWindowLabel,
  materialStatusLabel,
  type BrandAssetVariant,
  type BrandDesign,
  type DesignChip,
  type DesignKind,
  type DesignVersion,
  type MaterialStatus,
} from '@/data/brandMaterials';

type KindFilter = DesignKind | 'all';

type OpenPreview = {
  title: string;
  label: string;
  notes?: string;
  previewSrc: string;
};

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

function isImagePath(path?: string): boolean {
  return Boolean(path && /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(path));
}

function isLivePageHref(href: string): boolean {
  if (isImagePath(href)) return false;
  return true;
}

function pageHrefFor(design: BrandDesign, version: DesignVersion): string | undefined {
  const href = version.href ?? design.href;
  if (!href || !isLivePageHref(href)) return undefined;
  return href;
}

type OpenLightbox = (items: OpenPreview[], index: number) => void;

function previewIndexFor(design: BrandDesign, version: DesignVersion): number {
  return imagePreviewsFor(design).findIndex(
    (item) => item.previewSrc === version.previewSrc && item.label === version.label,
  );
}

const LIVE_SITE_ORIGIN = 'https://www.eyesclosed.love';

function liveSiteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${LIVE_SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function StatusMark({ status }: { status: MaterialStatus }) {
  return (
    <span
      className={[
        'inline-flex h-7 items-center rounded-full border px-2.5 font-mono text-[10px] uppercase tracking-[0.16em]',
        statusTone(status),
      ].join(' ')}
    >
      {materialStatusLabel(status)}
    </span>
  );
}

function FacetChip({ chip }: { chip: DesignChip }) {
  const loud = chip.facet === 'kind';
  return (
    <span
      className={
        loud
          ? 'inline-flex h-8 items-center gap-2 border border-cream/25 bg-cream/[0.08] px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream'
          : 'inline-flex h-8 items-center gap-2 border border-cream/12 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream'
      }
    >
      <span className="text-cream/40">{designChipFacetLabel(chip.facet)}</span>
      <span className={loud ? 'text-cream' : 'text-cream/80'}>{chip.label}</span>
    </span>
  );
}

function KindFilter({
  value,
  onChange,
  counts,
}: {
  value: KindFilter;
  onChange: (next: KindFilter) => void;
  counts: { all: number } & Record<DesignKind, number>;
}) {
  const options: Array<{ id: KindFilter; label: string; count: number }> = [
    { id: 'all', label: 'All', count: counts.all },
    ...DESIGN_KINDS_IN_USE.map((kind) => ({
      id: kind,
      label: designKindLabel(kind),
      count: counts[kind],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by kind">
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={
              selected
                ? 'inline-flex h-9 items-center gap-2 border border-cream/30 bg-cream/[0.08] px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream'
                : 'inline-flex h-9 items-center gap-2 border border-cream/12 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50 hover:border-cream/25 hover:text-cream/80'
            }
          >
            {option.label}
            <span className={selected ? 'text-cream/60' : 'text-cream/30'}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function imagePreviewsFor(design: BrandDesign): OpenPreview[] {
  return design.versions
    .filter((version) => !pageHrefFor(design, version))
    .map((version) => ({
      title: design.title,
      label: version.label,
      notes: version.notes,
      previewSrc: version.previewSrc,
    }));
}

function DesignLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: OpenPreview[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const preview = items[index];
  const hasMany = items.length > 1;

  const go = (delta: number) => {
    if (!hasMany || items.length === 0) return;
    onIndexChange((index + delta + items.length) % items.length);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (!hasMany) return;
      if (event.key === 'ArrowLeft') {
        onIndexChange((index - 1 + items.length) % items.length);
      }
      if (event.key === 'ArrowRight') {
        onIndexChange((index + 1) % items.length);
      }
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [hasMany, index, items.length, onClose, onIndexChange]);

  if (!preview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050806]/92 p-3 backdrop-blur-sm sm:p-5 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${preview.title}: ${preview.label}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal"
        aria-label="Close preview"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {hasMany ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            go(-1);
          }}
          className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal sm:left-5"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      ) : null}

      {hasMany ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            go(1);
          }}
          className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-charcoal/80 text-cream transition-colors hover:border-cream/30 hover:bg-charcoal sm:right-5"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      ) : null}

      <figure
        className="flex max-h-full w-full max-w-[min(96vw,1200px)] flex-col items-center gap-3 sm:gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <figcaption className="text-center">
          <p className="font-serif text-xl italic text-cream">{preview.title}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/55">
            {preview.label}
            {preview.notes ? ` · ${preview.notes}` : ''}
            {hasMany ? ` · ${index + 1} of ${items.length}` : ''}
          </p>
        </figcaption>
        <button
          type="button"
          onClick={() => go(1)}
          className="max-h-[min(78dvh,1080px)] cursor-pointer border-0 bg-transparent p-0"
          aria-label={hasMany ? 'Next image' : preview.label}
        >
          <img
            src={preview.previewSrc}
            alt={`${preview.title}: ${preview.label}`}
            className="max-h-[min(78dvh,1080px)] w-auto max-w-full border border-cream/10 object-contain shadow-2xl"
          />
        </button>
      </figure>
    </div>
  );
}

function PreviewThumb({
  design,
  version,
  onOpen,
  compact,
}: {
  design: BrandDesign;
  version: DesignVersion;
  onOpen: OpenLightbox;
  compact?: boolean;
}) {
  const pageHref = pageHrefFor(design, version);
  const className = compact
    ? 'flex min-w-0 flex-col gap-1.5 border border-cream/10 p-1.5 text-left transition-colors hover:border-cream/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]'
    : 'flex items-center justify-center bg-[#0c0e0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb5aa]';
  const caption = compact ? (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45">
        {designVersionRoleLabel(version.role)}
      </span>
      <span className="font-sans text-xs leading-snug text-cream/80">{version.label}</span>
    </>
  ) : null;
  const image = (
    <img
      src={version.previewSrc}
      alt=""
      className={
        compact && version.wide
          ? 'aspect-[3/2] w-full object-contain object-center'
          : 'aspect-[4/5] w-full object-cover object-top'
      }
    />
  );

  if (pageHref) {
    return (
      <a href={pageHref} className={className} aria-label={`Open ${design.title}: ${version.label}`}>
        {caption}
        {image}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        const items = imagePreviewsFor(design);
        const index = previewIndexFor(design, version);
        if (index < 0 || items.length === 0) return;
        onOpen(items, index);
      }}
      className={className}
      aria-label={`Open ${design.title}: ${version.label}`}
    >
      {caption}
      {image}
    </button>
  );
}

function VersionGallery({
  design,
  onOpen,
}: {
  design: BrandDesign;
  onOpen: OpenLightbox;
}) {
  const rows = designVersionRows(design);

  return (
    <div className="flex flex-col gap-8" aria-label={`${design.title} versions`}>
      {rows.map((row, index) => (
        <div key={row.label || `row-${index}`} className="flex flex-col gap-3">
          {row.label ? (
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55">
              {row.label}
            </h3>
          ) : null}
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(15rem,16.5rem))]"
            role="list"
          >
            {row.versions.map((version) => (
              <div
                key={version.id}
                role="listitem"
                className={version.wide ? 'col-span-2' : undefined}
              >
                <PreviewThumb design={design} version={version} onOpen={onOpen} compact />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesignMeta({ design, version }: { design: BrandDesign; version: DesignVersion }) {
  const chips = designChips(design);
  const pathHref = version.href ?? design.href;
  const showLiveUrl = design.status === 'active';
  const pathLabel = pathHref && showLiveUrl ? liveSiteUrl(pathHref) : pathHref;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-[1.65rem] italic leading-none tracking-[-0.02em] text-cream md:text-[1.9rem]">
          {design.title}
        </h2>
        <StatusMark status={design.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <FacetChip key={chip.id} chip={chip} />
        ))}
        {design.liveFrom && design.liveUntil ? (
          <span className="inline-flex h-8 items-center gap-2 border border-cream/12 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream">
            <span className="text-cream/40">Live</span>
            <span className="text-cream/80">
              {liveWindowLabel(design.liveFrom, design.liveUntil)}
            </span>
          </span>
        ) : null}
      </div>
      {design.usedFor ? (
        <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-cream/70 md:text-[0.9375rem]">
          {design.usedFor}
        </p>
      ) : null}
      <dl className="mt-6 grid gap-4 border-t border-cream/10 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45 sm:grid-cols-2">
        <div>
          <dt>Path</dt>
          <dd className="mt-1.5 break-all normal-case tracking-normal text-cream/80">
            {pathHref && pathLabel ? (
              <a
                href={pathHref}
                className="underline-offset-4 hover:text-cream hover:underline"
              >
                {pathLabel}
              </a>
            ) : (
              <span>Zoho template · not on the site</span>
            )}
            {design.aliases?.map((alias) => (
              <span key={alias} className="mt-1 block text-cream/40">
                also {showLiveUrl ? liveSiteUrl(alias) : alias}
              </span>
            ))}
            <span className="mt-1 block text-cream/40">{version.filename}</span>
          </dd>
        </div>
        <div>
          <dt>After this window</dt>
          <dd className="mt-1.5 normal-case tracking-normal text-cream/80">
            {design.liveUntil
              ? `Comes down ${formatShortDate(design.liveUntil)}`
              : 'No take-down date'}
          </dd>
        </div>
      </dl>
    </>
  );
}

function DesignPlate({
  design,
  onOpen,
}: {
  design: BrandDesign;
  onOpen: OpenLightbox;
}) {
  const current = designCurrentVersion(design);
  const many = design.versions.length > 1;

  if (many) {
    return (
      <article className="border border-cream/12 px-5 py-5 md:px-8 md:py-7">
        <DesignMeta design={design} version={current} />
        <div className="mt-6">
          <VersionGallery design={design} onOpen={onOpen} />
        </div>
      </article>
    );
  }

  return (
    <article className="grid overflow-hidden border border-cream/12 md:grid-cols-[16.5rem_minmax(0,1fr)]">
      <PreviewThumb design={design} version={current} onOpen={onOpen} />
      <div className="px-5 py-5 md:px-8 md:py-7">
        <DesignMeta design={design} version={current} />
      </div>
    </article>
  );
}

function AssetCard({ variant }: { variant: BrandAssetVariant }) {
  const [src, setSrc] = useState(variant.src);

  return (
    <article className="flex flex-col border border-cream/12">
      <div className="bg-[#1a1410] px-8 py-6">
        <img
          src={src}
          alt={variant.label}
          width={FORMLESS_BOOK_COVER.width}
          height={FORMLESS_BOOK_COVER.height}
          onError={() => {
            if (src !== FORMLESS_BOOK_COVER.src) {
              setSrc(FORMLESS_BOOK_COVER.src);
            }
          }}
          className="mx-auto w-full max-w-[11rem] object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans text-sm font-medium text-cream">{variant.label}</h3>
          <StatusMark status={variant.status} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
          {variant.format}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-cream/55">
          {variant.canonicalPath}
        </p>
        {variant.notes ? (
          <p className="font-sans text-xs leading-relaxed text-cream/50">{variant.notes}</p>
        ) : null}
        <p className="mt-auto pt-2 font-sans text-xs leading-relaxed text-cream/40">
          Used on {variant.usedOn.join(', ')}
        </p>
      </div>
    </article>
  );
}

function DesignShelf({
  heading,
  designs,
  onOpen,
}: {
  heading: string;
  designs: BrandDesign[];
  onOpen: OpenLightbox;
}) {
  const headingId = heading.toLowerCase().replace(/\s+/g, '-');

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <h2
          id={headingId}
          className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55"
        >
          {heading}
        </h2>
        <div className="h-px flex-1 bg-cream/12" aria-hidden />
      </div>
      {designs.length === 0 ? (
        <p className="font-sans text-sm text-cream/45">Nothing in this shelf yet.</p>
      ) : (
        designs.map((design) => (
          <DesignPlate key={design.id} design={design} onOpen={onOpen} />
        ))
      )}
    </section>
  );
}

export default function BrandDesignsPage() {
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [lightbox, setLightbox] = useState<{ items: OpenPreview[]; index: number } | null>(null);
  const visible = designsByKind(kindFilter);
  const live = visible.filter((design) => design.status === 'active');
  const inWork = visible.filter((design) => design.status === 'draft');
  const counts = designKindCounts();

  const openLightbox: OpenLightbox = (items, index) => {
    if (items.length === 0) return;
    setLightbox({ items, index: Math.min(Math.max(index, 0), items.length - 1) });
  };

  return (
    <>
      <BrandShell activeId="designs" crumb="Designs">
        <BrandPageBody>
          <div className="flex flex-col gap-10 md:gap-12">
            <BrandPageHeader
              tone="desk"
              title="Designs"
              description="One card per job. Live, intended, system, and exploration sit on that card so versions do not scatter."
              actions={
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                  {live.length} live · {inWork.length} in work
                </p>
              }
            />

            <KindFilter value={kindFilter} onChange={setKindFilter} counts={counts} />

            <DesignShelf heading="Live designs" designs={live} onOpen={openLightbox} />
            <DesignShelf heading="In work" designs={inWork} onOpen={openLightbox} />

            <section aria-labelledby="designs-files-heading" className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <h2
                  id="designs-files-heading"
                  className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-cream/55"
                >
                  Final files
                </h2>
                <div className="h-px flex-1 bg-cream/12" aria-hidden />
              </div>
              {BRAND_ASSET_FAMILIES.map((family) => (
                <div key={family.id} className="flex flex-col gap-4">
                  <p className="max-w-2xl font-sans text-sm leading-relaxed text-cream/50">
                    {family.summary}
                  </p>
                  <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {family.variants.map((variant) => (
                      <AssetCard key={variant.id} variant={variant} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
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
