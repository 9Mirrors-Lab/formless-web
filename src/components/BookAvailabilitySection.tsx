type AvailabilityPlatform = {
  id: string;
  label: string;
  verb: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName: string;
};

const PLATFORMS: AvailabilityPlatform[] = [
  {
    id: 'amazon-books',
    label: 'Amazon Books',
    verb: 'Hold it.',
    logoSrc: '/brand/amazon-books-on-dark.svg',
    logoAlt: 'Amazon Books',
    logoClassName: 'h-8 w-auto max-w-[168px] md:h-9 object-contain object-left',
  },
  {
    id: 'kindle',
    label: 'Kindle',
    verb: 'Read it.',
    logoSrc: '/brand/kindle-on-dark.svg',
    logoAlt: 'Kindle',
    logoClassName: 'h-7 w-auto max-w-[148px] md:h-8 object-contain object-left',
  },
  {
    id: 'audible',
    label: 'Audible',
    verb: 'Listen.',
    logoSrc: '/brand/audible-on-dark.svg',
    logoAlt: 'Audible',
    logoClassName: 'h-8 w-auto max-w-[160px] md:h-9 object-contain object-left',
  },
];

type BookAvailabilitySectionProps = {
  eyebrow?: string;
  title?: string;
};

export function BookAvailabilitySection({
  eyebrow = 'Available on',
  title = 'One book. Three ways in.',
}: BookAvailabilitySectionProps) {
  return (
    <section
      className="book-availability relative w-full overflow-x-hidden border-t border-cream/10 px-6 py-20 md:px-16 md:py-24 lg:px-24"
      aria-labelledby="book-availability-heading"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-cream/30">
          {eyebrow}
        </span>
        <h2
          id="book-availability-heading"
          className="book-availability-title mb-14 max-w-2xl font-serif text-3xl leading-tight text-cream md:mb-16 md:text-5xl"
        >
          {title}
        </h2>

        <ul className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {PLATFORMS.map((platform, index) => (
            <li
              key={platform.id}
              className={[
                'availability-platform group flex flex-col gap-8 py-10 md:gap-10 md:px-8 md:py-2',
                index > 0
                  ? 'border-t border-cream/10 md:border-t-0 md:border-l md:border-cream/10'
                  : '',
                index === 0 ? 'md:pl-0' : '',
                index === PLATFORMS.length - 1 ? 'md:pr-0' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[0.65rem] tabular-nums tracking-[0.2em] text-cream/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cream/40">
                  {platform.label}
                </span>
              </div>

              <div className="flex min-h-[2.75rem] items-center">
                <img
                  src={platform.logoSrc}
                  alt={platform.logoAlt}
                  className={platform.logoClassName}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p className="font-serif text-2xl italic leading-[1.2] text-cream/75 md:text-[1.65rem]">
                {platform.verb}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
