export type TeachingQuoteBeat = {
  head: string;
  body: string;
  accent: 'clay' | 'slate';
  align: 'left' | 'right';
};

const ACCENTS: TeachingQuoteBeat['accent'][] = ['clay', 'slate', 'clay'];
const ALIGNS: TeachingQuoteBeat['align'][] = ['left', 'right', 'left'];

/** Map CMS quote strings into the POR teaching lockup beats. */
export function teachingBeatsFromQuotes(quotes: string[]): TeachingQuoteBeat[] {
  return quotes.slice(0, 3).map((quote, i) => {
    const lines = quote.split('\n').map((line) => line.trim()).filter(Boolean);
    const head = lines[0] ?? quote;
    const body = lines.slice(1).join(' ');
    return {
      head,
      body,
      accent: ACCENTS[i] ?? 'clay',
      align: ALIGNS[i] ?? 'left',
    };
  });
}

type TeachingQuotesLockupProps = {
  beats: TeachingQuoteBeat[];
  className?: string;
};

export function TeachingQuotesLockup({
  beats,
  className = '',
}: TeachingQuotesLockupProps) {
  return (
    <ol
      className={[
        'mx-auto flex w-full max-w-none list-none flex-col gap-16 pl-0 md:gap-20',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {beats.map((beat) => {
        const accentClass =
          beat.accent === 'clay' ? 'bg-clay/75' : 'bg-[#6a8286]/85';

        return (
          <li
            key={beat.head}
            className={[
              'teaching-quote-beat',
              beat.align === 'right' ? 'pl-[clamp(2rem,14vw,4.5rem)]' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex w-max max-w-none gap-4 md:gap-5">
              <div
                className={['w-px shrink-0 self-stretch', accentClass].join(' ')}
                aria-hidden="true"
              />
              <div className="shrink-0">
                <p className="font-serif text-[clamp(1.35rem,3.2vw,2.05rem)] leading-[1.3] whitespace-nowrap text-cream/82">
                  {beat.head}
                </p>
                {beat.body ? (
                  <p className="teaching-quote-body mt-1 font-serif text-[clamp(1.35rem,3.2vw,2.05rem)] leading-[1.3] whitespace-nowrap text-cream/82">
                    {beat.body}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
