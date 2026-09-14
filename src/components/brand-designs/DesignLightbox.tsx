import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type DesignPreviewItem = {
  title: string;
  label: string;
  notes?: string;
  previewSrc: string;
};

export function DesignLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: DesignPreviewItem[];
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
          <p className="font-sans text-xl font-medium tracking-[-0.02em] text-cream">
            {preview.title}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/55">
            {preview.label}
            {preview.notes ? ` · ${preview.notes}` : ''}
            {hasMany ? ` · ${index + 1} of ${items.length}` : ''}
          </p>
        </figcaption>
        <img
          src={preview.previewSrc}
          alt={`${preview.title}: ${preview.label}`}
          className="max-h-[min(78dvh,1080px)] w-auto max-w-full border border-cream/10 object-contain shadow-2xl"
        />
      </figure>
    </div>
  );
}
