import {
  audibleHref,
  kindlePreorderHref,
} from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';

type AvailabilityPlatform = {
  id: string;
  label: string;
  verb: string;
  verbShort: string;
  logoSrc: string;
  logoAlt: string;
  logoClassName: string;
  status: 'live' | 'coming_soon';
  href?: () => string;
};

const PLATFORMS: AvailabilityPlatform[] = [
  {
    id: 'kindle',
    label: 'Kindle',
    verb: 'Read it.',
    verbShort: 'Read',
    logoSrc: '/brand/kindle-on-dark.svg',
    logoAlt: 'Kindle',
    logoClassName:
      'h-3.5 w-auto max-w-[68px] object-contain object-center md:h-8 md:max-w-[148px] md:object-left',
    status: 'live',
    href: kindlePreorderHref,
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
    status: 'live',
    href: audibleHref,
  },
  {
    id: 'amazon-books',
    label: 'Amazon Books',
    verb: 'Hold it.',
    verbShort: 'Hold',
    logoSrc: '/brand/amazon-books-on-dark.svg',
    logoAlt: 'Amazon Books',
    logoClassName:
      'h-4 w-auto max-w-[72px] object-contain object-center opacity-55 md:h-9 md:max-w-[168px] md:object-left',
    status: 'coming_soon',
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
          {PLATFORMS.map((platform, index) => {
            const isComingSoon = platform.status === 'coming_soon';
            const href = platform.href?.();

            return (
              <li
                key={platform.id}
                className={[
                  'availability-platform group',
                  'flex h-full flex-col items-center gap-2.5 px-2 py-4 text-center',
                  'md:items-start md:gap-8 md:px-8 md:py-2 md:text-left',
                  index > 0 ? 'border-l border-cream/10' : '',
                  index === 0 ? 'md:pl-0' : '',
                  index === PLATFORMS.length - 1 ? 'md:pr-0' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="hidden items-start gap-3 md:flex">
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-sm tabular-nums leading-none text-[#E89540]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="mt-1.5 block h-px w-5 bg-[#E89540]/70"
                      aria-hidden
                    />
                  </div>
                  <span className="pt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cream/40">
                    {platform.label}
                  </span>
                </div>

                <p
                  className={[
                    'order-1 font-serif text-base italic leading-none md:order-3 md:mt-auto md:text-2xl md:text-[1.65rem]',
                    isComingSoon ? 'text-cream/55 md:text-cream/45' : 'text-cream/85 md:text-cream/75',
                  ].join(' ')}
                >
                  <span className="md:hidden">{platform.verbShort}</span>
                  <span className="hidden md:inline">{platform.verb}</span>
                </p>

                <div className="order-2 flex min-h-[1.25rem] flex-col items-center md:order-2 md:min-h-0 md:flex-1 md:items-start">
                  <div className="flex flex-col items-center gap-2 md:items-start">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          captureCtaClick(platform.label, href, 'book_availability')
                        }
                        className="inline-flex rounded-sm transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/50"
                        aria-label={`Get Formless on ${platform.label}`}
                      >
                        <img
                          src={platform.logoSrc}
                          alt=""
                          aria-hidden
                          className={platform.logoClassName}
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    ) : (
                      <span
                        className="inline-flex"
                        aria-label={`${platform.label}: coming soon`}
                      >
                        <img
                          src={platform.logoSrc}
                          alt=""
                          aria-hidden
                          className={platform.logoClassName}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-2 flex h-7 items-center justify-center md:justify-start"
                    aria-hidden={!isComingSoon}
                  >
                    {isComingSoon ? (
                      <span
                        className="inline-flex items-center rounded-full border border-[#E89540]/55 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-cream/85 shadow-[0_0_14px_rgba(232,149,64,0.18)] md:text-[10px]"
                      >
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
