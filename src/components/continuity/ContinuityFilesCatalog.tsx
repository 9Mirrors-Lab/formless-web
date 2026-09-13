import { useMemo, useState } from 'react';

import { Field } from '@/components/continuity/ContinuityUi';
import {
  CONTINUITY_ASSETS,
  continuityAssetsNeedingConsolidation,
  type ContinuityAsset,
} from '@/data/continuityHome';

type BrandFilter = 'all' | 'Eyes Closed' | 'Formless' | 'split';

function assetKey(asset: ContinuityAsset): string {
  return `${asset.brand}-${asset.category}`;
}

export function ContinuityFilesCatalog({ query = '' }: { query?: string }) {
  const [brand, setBrand] = useState<BrandFilter>('all');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const splitCount = continuityAssetsNeedingConsolidation().length;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CONTINUITY_ASSETS.filter((asset) => {
      if (brand === 'split' && !asset.needsConsolidation) return false;
      if (brand === 'Eyes Closed' && asset.brand !== 'Eyes Closed') return false;
      if (brand === 'Formless' && asset.brand !== 'Formless') return false;
      if (!needle) return true;
      return [asset.category, asset.primaryLocation, asset.backupLocation, asset.fileOwner, asset.brand]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [brand, query]);

  const filters: { id: BrandFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Eyes Closed', label: 'Eyes Closed' },
    { id: 'Formless', label: 'Formless' },
    { id: 'split', label: 'Still split' },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-px bg-cream/15">
        <Stat value={String(CONTINUITY_ASSETS.length)} label="Collections" />
        <Stat value={String(splitCount)} label="Still split" />
        <Stat value="2" label="Brands" />
      </div>
      <p className="mt-6 max-w-[52ch] font-sans text-sm leading-relaxed text-cream/70">
        These are the creative originals a partner would pack up: logos, covers, manuscript, and
        audio. Several still live in more than one place. The site can keep running while those
        copies are gathered. Do not delete a folder until a named backup exists.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="File collections">
        {filters.map((filter) => {
          const selected = brand === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setBrand(filter.id)}
              className={`cursor-pointer inline-flex min-h-11 items-center px-4 font-sans text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80 ${
                selected
                  ? 'bg-cream text-charcoal'
                  : 'border border-cream/20 text-cream/80 hover:border-cream/45 hover:text-cream'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 font-sans text-sm text-cream/65">
          Nothing in this drawer matches. Try Logos, masters, Drive, or Canva, or clear the search.
        </p>
      ) : (
        <ul className="mt-4">
          {rows.map((asset) => {
            const key = assetKey(asset);
            const open = openKey === key;
            return (
              <li key={key} className="border-t border-cream/12">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenKey(open ? null : key)}
                  className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 text-left transition-colors duration-200 hover:bg-cream/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
                >
                  <span className="min-w-0">
                    <span className="block font-sans text-lg leading-snug text-cream">
                      {asset.category}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-cream/50">
                      <span>{asset.brand}</span>
                      <span
                        className={
                          asset.needsConsolidation ? 'text-cream' : 'text-cream/45'
                        }
                      >
                        {asset.needsConsolidation ? 'Needs gathering' : 'Has a home'}
                      </span>
                    </span>
                  </span>
                  <span className="font-sans text-lg text-cream/40" aria-hidden>
                    {open ? '–' : '+'}
                  </span>
                </button>
                {open ? (
                  <dl className="mb-6 grid grid-cols-1 gap-6 border-l border-cream/30 pb-2 pl-5 sm:grid-cols-2">
                    <Field label="Primary location">{asset.primaryLocation}</Field>
                    <Field label="Backup">{asset.backupLocation}</Field>
                    <Field label="Owner">{asset.fileOwner}</Field>
                    <Field label="Last verified">{asset.lastVerified}</Field>
                    {asset.needsConsolidation ? (
                      <div className="sm:col-span-2">
                        <Field label="Until it is gathered">
                          Keep every copy. Name one Drive or repo home later. Do not tidy by deleting.
                        </Field>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#080a09]/80 px-4 py-5 md:px-6">
      <p className="font-serif text-3xl font-light italic leading-none text-cream">{value}</p>
      <p className="mt-2 font-sans text-sm text-cream/50">{label}</p>
    </div>
  );
}
