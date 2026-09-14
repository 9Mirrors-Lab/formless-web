import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type DesignReviewSwitcherItem = {
  id: string;
  index: string;
  label: string;
  href?: string;
};

type DesignReviewSwitcherProps = {
  ariaLabel: string;
  items: readonly DesignReviewSwitcherItem[];
  activeId: string;
  onSelect?: (id: string) => void;
};

const TAB_CLASS =
  'inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border-0 bg-transparent px-[0.95rem] py-[0.6rem] font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay max-[560px]:px-[0.6rem] max-[560px]:text-[9.5px]';

function tabTone(active: boolean): string {
  return active
    ? 'bg-cream text-charcoal'
    : 'text-cream/55 hover:text-cream';
}

export function DesignReviewSwitcher({
  ariaLabel,
  items,
  activeId,
  onSelect,
}: DesignReviewSwitcherProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center bg-gradient-to-t from-[#0e120f]/78 via-[#0e120f]/32 to-transparent pb-5 pt-16">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="pointer-events-auto flex max-w-[calc(100%-1.5rem)] items-center gap-1 overflow-x-auto rounded-full border border-cream/15 bg-[#0e120f]/80 p-[0.4rem] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-[14px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = item.id === activeId;
          const className = `${TAB_CLASS} ${tabTone(active)}`;
          const body = (
            <>
              <span className="mr-[0.45rem] text-clay">{item.index}</span>
              <span className="max-[560px]:hidden">{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                role="tab"
                aria-selected={active}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                {body}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={className}
              onClick={() => onSelect?.(item.id)}
            >
              {body}
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}
