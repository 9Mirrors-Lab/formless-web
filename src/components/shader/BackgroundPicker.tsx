import { Check, Palette } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import {
  BACKGROUND_OPTIONS,
  isImageBackground,
  isShaderBackground,
  type BackgroundId,
} from './backgroundOptions';

type BackgroundPickerProps = {
  value: BackgroundId;
  onChange: (id: BackgroundId) => void;
  /** Nav: inline after About. Floating: fixed corner (legacy). */
  placement?: 'nav' | 'floating';
};

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/70';

export function BackgroundPicker({
  value,
  onChange,
  placement = 'nav',
}: BackgroundPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const enabledOptions = BACKGROUND_OPTIONS.filter((option) => option.enabled);
  const active = enabledOptions.find((option) => option.id === value) ?? enabledOptions[0];
  const isNav = placement === 'nav';

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const select = (id: BackgroundId) => {
    onChange(id);
    setOpen(false);
  };

  const rootClass = isNav
    ? 'background-picker relative z-50 shrink-0'
    : 'background-picker fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8';

  const panelClass = isNav
    ? 'absolute right-0 top-[calc(100%+0.5rem)] w-max min-w-[17rem] overflow-hidden rounded-2xl border border-cream/15 bg-charcoal/95 shadow-2xl shadow-black/50 backdrop-blur-md'
    : 'mb-3 w-max min-w-[17rem] overflow-hidden rounded-2xl border border-cream/15 bg-charcoal/95 shadow-2xl shadow-black/50 backdrop-blur-md';

  const triggerClass = isNav
    ? `inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/25 text-cream/85 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/10 hover:text-cream ${linkFocus}`
    : `inline-flex size-12 items-center justify-center rounded-full border border-cream/20 bg-charcoal/90 text-cream shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-cream/35 hover:bg-charcoal ${linkFocus}`;

  return (
    <div ref={rootRef} className={rootClass}>
      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Background options"
          className={panelClass}
        >
          <div className="border-b border-cream/10 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
              Backgrounds
            </p>
          </div>
          <ul className="flex flex-col gap-0.5 p-2">
            {enabledOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = option.id === value;
              const swatchStyle = isImageBackground(option)
                ? {
                    backgroundImage: `url("${option.imageSrc}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : isShaderBackground(option)
                  ? {
                      background: `linear-gradient(135deg, ${option.previewColors.join(', ')})`,
                    }
                  : undefined;

              return (
                <li key={option.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(option.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${linkFocus} ${
                      isSelected
                        ? 'bg-cream/10 text-cream'
                        : 'text-cream/75 hover:bg-cream/5 hover:text-cream'
                    }`}
                  >
                    <span
                      className="size-8 shrink-0 rounded-lg border border-white/10 bg-charcoal shadow-inner"
                      style={swatchStyle}
                      aria-hidden
                    />
                    <span className="flex flex-1 items-center gap-2 whitespace-nowrap">
                      <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                      <span className="font-sans text-sm font-medium">{option.label}</span>
                    </span>
                    {isSelected ? (
                      <Check className="size-4 shrink-0 text-moss" aria-hidden />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Choose background"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={triggerClass}
        title={active ? `Background: ${active.label}` : 'Choose background'}
      >
        <Palette className="size-5" aria-hidden />
      </button>
    </div>
  );
}
