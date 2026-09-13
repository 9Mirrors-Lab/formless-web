import type { ReactNode } from 'react';

type ContinuityDisclosureProps = {
  id?: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function ContinuityDisclosure({
  id,
  title,
  children,
  defaultOpen = false,
  className = 'group border-t border-cream/12 py-5',
}: ContinuityDisclosureProps) {
  return (
    <details
      id={id}
      className={className}
      open={defaultOpen ? true : undefined}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left font-sans text-base text-cream marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          className="shrink-0 text-cream/45 transition-transform duration-300 group-open:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <div className="mt-4 max-w-[65ch] font-sans text-sm leading-relaxed text-cream/70">
        {children}
      </div>
    </details>
  );
}
