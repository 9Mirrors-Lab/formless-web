import type { ReactNode } from 'react';

import { PageLayout } from '@/components/PageLayout';

export const authLinkClassName =
  'font-medium text-cream underline-offset-4 hover:text-white hover:underline';

export const authPanelClassName =
  'rounded-[2rem] border border-cream/10 bg-charcoal/80 px-8 py-10 shadow-2xl shadow-black/30 backdrop-blur-sm';

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <PageLayout dark>
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
        {children}
      </section>
    </PageLayout>
  );
}

type AuthPagePanelProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
};

export function AuthPagePanel({ eyebrow, title, description, children }: AuthPagePanelProps) {
  return (
    <div className="mx-auto w-full max-w-md text-center">
      <div className={authPanelClassName}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/45">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl italic text-cream">{title}</h1>
        {description ? (
          <div className="mt-4 font-sans text-sm leading-relaxed text-cream/65">{description}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
