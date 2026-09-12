import { MONUMENT, MONUMENT_LAB_LINKS, type MonumentLabRoute } from './monumentShared';

type MonumentLabChromeProps = {
  active: MonumentLabRoute;
};

export function MonumentLabChrome({ active }: MonumentLabChromeProps) {
  const blurb = MONUMENT_LAB_LINKS.find((l) => l.id === active)?.blurb ?? '';

  return (
    <header
      className="fixed left-1/2 top-4 z-50 flex w-[min(96%,920px)] -translate-x-1/2 flex-col gap-2 border px-3 py-2 md:flex-row md:items-center md:gap-3 md:px-4"
      style={{
        borderColor: MONUMENT.rule,
        backgroundColor: `${MONUMENT.canvasDeep}ee`,
      }}
    >
      <a
        href="/design-lab"
        className="hidden shrink-0 px-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors md:inline"
        style={{ color: MONUMENT.textFaint }}
      >
        Lab
      </a>
      <nav
        aria-label="Monument design explorations"
        className="flex flex-1 items-center justify-center gap-1 overflow-x-auto"
      >
        {MONUMENT_LAB_LINKS.map((link) => {
          const on = link.id === active;
          return (
            <a
              key={link.id}
              href={link.href}
              aria-current={on ? 'page' : undefined}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                color: on ? MONUMENT.canvas : MONUMENT.textMuted,
                backgroundColor: on ? MONUMENT.text : 'transparent',
                outlineColor: MONUMENT.dustRed,
              }}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <p
        className="hidden max-w-[160px] truncate text-right font-serif text-[11px] not-italic lg:block"
        style={{ color: MONUMENT.textFaint }}
      >
        {blurb}
      </p>
    </header>
  );
}

export function MonumentLabFooter({ note }: { note: string }) {
  return (
    <footer
      className="border-t px-6 py-12 text-center md:px-16"
      style={{ borderColor: MONUMENT.rule }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MONUMENT.textFaint }}>
        Monument lab · exploratory only · not production branding
      </p>
      <p className="mt-3 font-serif text-sm not-italic" style={{ color: MONUMENT.textMuted }}>
        {note}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em]">
        <a href="/" style={{ color: MONUMENT.turquoiseGray }}>
          Production home
        </a>
        <a href="/book" style={{ color: MONUMENT.turquoiseGray }}>
          Production book
        </a>
      </div>
    </footer>
  );
}
