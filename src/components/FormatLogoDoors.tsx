import { audibleHref, kindlePreorderHref } from '@/data/preorderLanding';
import { captureCtaClick } from '@/lib/analytics';

const FORMAT_LOGO_DOORS = [
  {
    id: 'kindle',
    label: 'Kindle',
    logoSrc: '/brand/kindle-on-dark.svg',
    logoClassName: 'mx-auto block h-[1.125rem] w-full max-w-[5.25rem] object-contain object-center',
    href: kindlePreorderHref,
  },
  {
    id: 'audible',
    label: 'Audible',
    logoSrc: '/brand/audible-hero.svg',
    logoClassName: 'mx-auto block h-5 w-full max-w-[5.5rem] object-contain object-center',
    href: audibleHref,
  },
] as const;

type FormatLogoDoorsProps = {
  trackLocation: string;
  className?: string;
};

export function FormatLogoDoors({
  trackLocation,
  className = 'grid w-full max-w-[13.5rem] grid-cols-2 gap-2.5 sm:max-w-[14.5rem]',
}: FormatLogoDoorsProps) {
  return (
    <ul className={className}>
      {FORMAT_LOGO_DOORS.map((door) => {
        const href = door.href();
        return (
          <li key={door.id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={door.label}
              onClick={() => captureCtaClick(door.label, href, trackLocation)}
              className="flex h-12 items-center justify-center rounded-xl border border-cream/20 bg-cream/[0.1] px-2.5 shadow-[inset_0_1px_0_rgba(242,240,233,0.18)] backdrop-blur-md transition-colors duration-200 hover:border-cream/35 hover:bg-cream/[0.16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream/50"
            >
              <img
                src={door.logoSrc}
                alt=""
                aria-hidden
                className={door.logoClassName}
              />
              <span className="sr-only">{door.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
