import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { EASE } from '@/components/continuity-v2/motion';
import { Quiet, Reveal } from '@/components/continuity-v2/primitives';
import {
  ASSET_COLLECTIONS,
  assetsForCollection,
  type AssetCollection,
  type AssetCollectionId,
} from '@/data/continuityAtlas';

/** Bento spans: the archive should read as a composed shelf, not a grid of equals. */
const SPANS: Record<AssetCollectionId, string> = {
  'eyes-closed': 'md:col-span-4 md:row-span-2',
  formless: 'md:col-span-2 md:row-span-3',
  brand: 'md:col-span-2 md:row-span-2',
  publishing: 'md:col-span-2 md:row-span-2',
  audio: 'md:col-span-2 md:row-span-3',
  social: 'md:col-span-2 md:row-span-2',
};

export function AssetArchive() {
  const [openId, setOpenId] = useState<AssetCollectionId | null>(null);
  const reduce = useReducedMotion();
  const open = ASSET_COLLECTIONS.find((collection) => collection.id === openId) ?? null;

  return (
    <div>
      <Reveal className="max-w-[58ch]">
        <p className="font-sans text-[1.02rem] leading-[1.8] text-cream/65 md:text-[1.12rem]">
          This is the organised creative archive behind the brand: where every original lives, where
          a second copy is kept, and which collections still sit in more than one place.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:auto-rows-[112px] md:grid-cols-6">
        {ASSET_COLLECTIONS.map((collection, index) => {
          const assets = assetsForCollection(collection);
          const needsWork = assets.filter((asset) => asset.needsConsolidation).length;
          const isOpen = openId === collection.id;
          return (
            <Reveal
              key={collection.id}
              delay={index * 0.06}
              className={`${SPANS[collection.id]} min-h-[148px]`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : collection.id)}
                aria-expanded={isOpen}
                className={`group relative flex h-full w-full cursor-pointer flex-col justify-end overflow-hidden border p-5 text-left transition-colors duration-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70 ${
                  isOpen
                    ? 'border-cream/45 bg-cream/[0.07]'
                    : 'border-cream/12 bg-cream/[0.025] hover:border-cream/30 hover:bg-cream/[0.05]'
                }`}
              >
                {collection.preview ? (
                  <img
                    src={collection.preview.src}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                      isOpen
                        ? 'opacity-45 grayscale-0'
                        : 'opacity-25 grayscale group-hover:opacity-40 group-hover:grayscale-0'
                    }`}
                  />
                ) : null}
                {collection.preview ? (
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[#080a09] via-[#080a09]/70 to-[#080a09]/25"
                    aria-hidden
                  />
                ) : null}

                <span className="relative">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-cream/30">
                    {String(index + 1).padStart(2, '0')} · {assets.length} sets of files
                  </span>
                  <span className="mt-2 block font-sans text-[1.15rem] font-light tracking-[-0.02em] text-cream">
                    {collection.label}
                  </span>
                  <span className="mt-2 block max-w-[34ch] font-sans text-[12.5px] leading-snug text-cream/50">
                    {collection.blurb}
                  </span>
                  {needsWork ? (
                    <span className="mt-3 block font-sans text-[11px] tracking-[0.14em] text-clay/80">
                      NEEDS CONSOLIDATION · {needsWork}
                    </span>
                  ) : null}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key={open.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-10 border-t border-cream/12 pt-10"
          >
            <CollectionDetail collection={open} onClose={() => setOpenId(null)} />
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 font-sans text-[13px] tracking-[0.08em] text-cream/35"
          >
            Open a collection to see where its originals and backups are kept.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function CollectionDetail({
  collection,
  onClose,
}: {
  collection: AssetCollection;
  onClose: () => void;
}) {
  const assets = assetsForCollection(collection);

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="font-sans text-[1.7rem] font-light tracking-[-0.03em] text-cream sm:text-[2.1rem]">
            {collection.label}
          </h3>
          <p className="mt-3 max-w-[52ch] font-sans text-[14.5px] text-cream/55">
            {collection.blurb}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 shrink-0 cursor-pointer px-2 font-sans text-[12px] tracking-[0.14em] text-cream/40 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70"
        >
          CLOSE
        </button>
      </div>

      <ul className="mt-10 flex flex-col">
        {assets.map((asset) => (
          <li key={asset.category} className="border-t border-cream/10 py-7 last:border-b">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h4 className="font-sans text-[1.02rem] text-cream">{asset.category}</h4>
              <span className="font-sans text-[11.5px] uppercase tracking-[0.18em] text-cream/30">
                {asset.brand}
              </span>
              {asset.needsConsolidation ? (
                <span className="font-sans text-[11px] tracking-[0.14em] text-clay/80">
                  NEEDS CONSOLIDATION
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <ArchiveSlot kind="master" label="Primary location" value={asset.primaryLocation} />
              <ArchiveSlot kind="backup" label="Backup location" value={asset.backupLocation} />
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              <p className="font-sans text-[12.5px] text-cream/45">
                <span className="text-cream/30">File owner · </span>
                {asset.fileOwner}
              </p>
              <p className="font-sans text-[12.5px] text-cream/45">
                <span className="text-cream/30">Last verified · </span>
                {asset.lastVerified}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {assets.some((asset) => asset.needsConsolidation) ? (
        <p className="mt-8 max-w-[62ch] font-sans text-[14px] leading-relaxed text-cream/50">
          Nothing here is lost. These collections simply live in more than one place, and bringing
          them into a single named folder would make this archive easier to hand over.
        </p>
      ) : null}
    </div>
  );
}

function ArchiveSlot({
  kind,
  label,
  value,
}: {
  kind: 'master' | 'backup';
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span
        className={`mt-1 size-3.5 shrink-0 ${
          kind === 'master' ? 'bg-cream/70' : 'border border-cream/45'
        }`}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="font-sans text-[10.5px] uppercase tracking-[0.2em] text-cream/35">{label}</p>
        <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-cream/70">{value}</p>
      </div>
    </div>
  );
}

export function ArchiveLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      <span className="flex items-center gap-2.5">
        <span className="size-3 bg-cream/70" aria-hidden />
        <span className="font-sans text-[12px] tracking-[0.06em] text-cream/50">Master files</span>
      </span>
      <span className="flex items-center gap-2.5">
        <span className="size-3 border border-cream/45" aria-hidden />
        <span className="font-sans text-[12px] tracking-[0.06em] text-cream/50">Backups</span>
      </span>
      <Quiet>Working files stay with their owner</Quiet>
    </div>
  );
}
