type AvailabilityPlatform = {
  id: string;
  label: string;
  verb: string;
  verbShort: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName: string;
};

const PLATFORMS: AvailabilityPlatform[] = [
  {
    id: 'amazon-books',
    label: 'Amazon Books',
    verb: 'Hold it.',
    verbShort: 'Hold',
    logoSrc: '/brand/amazon-books-on-dark.svg',
    logoAlt: 'Amazon Books',
    logoClassName:
      'h-4 w-auto max-w-[72px] object-contain object-center md:h-9 md:max-w-[168px] md:object-left',
  },
  {
    id: 'kindle',
    label: 'Kindle',
    verb: 'Read it.',
    verbShort: 'Read',
    logoSrc: '/brand/kindle-on-dark.svg',
    logoAlt: 'Kindle',
    logoClassName:
      'h-3.5 w-auto max-w-[68px] object-contain object-center md:h-8 md:max-w-[148px] md:object-left',
  },
  {
    id: 'audible',
    label: 'Audible',
    verb: 'Listen.',
    verbShort: 'Listen',
    logoSrc: '/brand/audible-on-dark.svg',
    logoAlt: 'Audible',
    logoClassName:
      'h-4 w-auto max-w-[70px] object-contain object-center md:h-9 md:max-w-[160px] md:object-left',
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
      id="book-availability"
      className="book-availability relative w-full overflow-x-hidden border-t border-cream/10 px-6 py-10 md:px-16 md:py-24 lg:px-24"
      aria-labelledby="book-availability-heading"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <span className="mb-3 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/30 md:mb-6 md:text-xs md:font-normal">
          {eyebrow}
        </span>
        <h2
          id="book-availability-heading"
          className="book-availability-title mb-6 max-w-2xl font-serif text-[1.65rem] leading-tight text-cream md:mb-16 md:text-5xl"
        >
          {title}
        </h2>

        {/* Mobile film strip · Desktop incumbent columns */}
        <ul className="grid grid-cols-3 gap-0 border-y border-cream/10 md:border-y-0">
          {PLATFORMS.map((platform, index) => (
            <li
              key={platform.id}
              className={[
                'availability-platform group',
                'flex flex-col items-center gap-2.5 px-2 py-4 text-center',
                'md:items-start md:gap-10 md:px-8 md:py-2 md:text-left',
                index > 0 ? 'border-l border-cream/10' : '',
                index === 0 ? 'md:pl-0' : '',
                index === PLATFORMS.length - 1 ? 'md:pr-0' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="hidden items-baseline gap-3 md:flex">
                <span className="font-mono text-[0.65rem] tabular-nums tracking-[0.2em] text-cream/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cream/40">
                  {platform.label}
                </span>
              </div>

              <p className="order-1 font-serif text-base italic leading-none text-cream/85 md:order-3 md:text-2xl md:text-[1.65rem] md:text-cream/75">
                <span className="md:hidden">{platform.verbShort}</span>
                <span className="hidden md:inline">{platform.verb}</span>
              </p>

              <div className="order-2 flex min-h-[1.25rem] items-center justify-center md:order-2 md:min-h-[2.75rem] md:justify-start">
                <img
                  src={platform.logoSrc}
                  alt={platform.logoAlt}
                  className={platform.logoClassName}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
