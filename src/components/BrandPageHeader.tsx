import type { ReactNode } from "react";

type BrandPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

/** Shared top block for Brand Toolkit pages. Keep this structure identical across materials. */
export function BrandPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: BrandPageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 text-left md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9fb5aa]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-4xl italic text-cream md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-cream/65">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}

export function BrandPageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 lg:p-10">
      {children}
    </div>
  );
}
