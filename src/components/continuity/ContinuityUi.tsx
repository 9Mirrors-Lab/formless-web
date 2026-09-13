import type { ReactNode } from 'react';

import type { ContinuityImportance } from '@/data/continuityHome';

export function importanceLabel(value: ContinuityImportance): string {
  switch (value) {
    case 'critical':
      return 'Critical';
    case 'important':
      return 'Important';
    case 'supporting':
      return 'Supporting';
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-sans text-sm text-cream/50">{label}</dt>
      <dd className="mt-1.5 font-sans text-base leading-relaxed text-cream">{children}</dd>
    </div>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="cursor-pointer underline decoration-cream/30 underline-offset-4 transition-colors duration-200 hover:decoration-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/80"
    >
      {children}
    </a>
  );
}

export function BriefingGrid({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-1 gap-7 sm:grid-cols-2">{children}</dl>;
}
