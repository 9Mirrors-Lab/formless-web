import type { ReactNode, SVGProps } from 'react';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';
import { captureCtaClick } from '@/lib/analytics';

const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/eyesclosed.love/',
    label: 'Instagram',
    Icon: InstagramGlyph,
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/sonika-cottman/',
    label: 'LinkedIn',
    Icon: LinkedInGlyph,
    external: true,
  },
] as const;

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="5.25"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="17.2" cy="6.8" r="0.85" fill="currentColor" />
    </svg>
  );
}

function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3.5" y="9.5" width="3.5" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="5.25" cy="5.25" r="2" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M11 20.5v-5.6c0-2.2 1.15-3.35 2.85-3.35 1.55 0 2.65 1 2.65 3.35V20.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 11.35V20.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmailGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3.25"
        y="5.75"
        width="17.5"
        height="12.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M4.25 7.25 12 12.75l7.75-5.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  Icon,
  restricted,
  external = true,
}: {
  href: string;
  label: string;
  Icon: typeof InstagramGlyph;
  restricted: boolean;
  external?: boolean;
}) {
  const shellClass =
    'group inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/[0.1] text-cream/28 shadow-[inset_0_1px_2px_rgba(0,0,0,0.55)] transition-[transform,color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-cream/20 hover:text-cream/48 hover:shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.4)] active:scale-[0.97]';

  const icon = (
    <>
      <span className={shellClass}>
        <Icon className="h-[18px] w-[18px] opacity-90 [filter:drop-shadow(0_-1px_0_rgba(255,255,255,0.12))_drop-shadow(0_1px_0.5px_rgba(0,0,0,0.65))]" />
      </span>
      <span className="sr-only">{label}</span>
    </>
  );

  if (restricted) {
    return (
      <span className="inline-flex cursor-default opacity-40" aria-hidden>
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className="inline-flex"
      aria-label={label}
      onClick={() => captureCtaClick(label, href, 'footer_social')}
    >
      {icon}
    </a>
  );
}

function FootLink({
  href,
  className,
  children,
  restricted,
  label,
}: {
  href: string;
  className: string;
  children: ReactNode;
  restricted: boolean;
  label: string;
}) {
  if (restricted) {
    return <span className={className}>{children}</span>;
  }

  const handleClick = () => {
    captureCtaClick(label, href, 'footer');
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export function Footer() {
  const { restricted } = useSiteAccess();
  const { getText, getLink } = useContent();
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const homeHref = currentPath === '/revised' || currentPath.startsWith('/revised/')
    ? '/revised'
    : '/';

  const brandClass = 'font-sans font-semibold tracking-[0.2em] uppercase text-xl mb-6 inline-block';
  const contactLink = getLink('footer', 'connect', 'contact');
  const socialLinks = [
    ...SOCIAL_LINKS,
    {
      href: contactLink.href,
      label: 'Email',
      Icon: EmailGlyph,
      external: false,
    },
  ];

  return (
    <footer className="w-full bg-charcoal text-cream pt-24 pb-12 px-6 md:px-16 lg:px-24 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        <div className="flex flex-col max-w-sm">
          {restricted ? (
            <span className={brandClass}>{getText('footer', 'brand', 'name')}</span>
          ) : (
            <a
              href={homeHref}
              className={brandClass}
              onClick={() =>
                captureCtaClick(getText('footer', 'brand', 'name'), homeHref, 'footer_brand')
              }
            >
              {getText('footer', 'brand', 'name')}
            </a>
          )}
          <p className="font-serif italic text-cream/50 text-lg mb-8 leading-relaxed whitespace-pre-line">
            {getText('footer', 'brand', 'tagline')}
          </p>
          <div className="flex items-center justify-start gap-3">
            {socialLinks.map((social) => (
              <SocialLink
                key={social.label}
                href={social.href}
                label={social.label}
                Icon={social.Icon}
                restricted={restricted}
                external={social.external}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 md:gap-24 font-sans text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-cream/40 mb-2 font-mono text-xs tracking-widest uppercase">
              {getText('footer', 'explore', 'heading')}
            </span>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'work').href}
              label={getLink('footer', 'explore', 'work').text}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'work').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'book').href}
              label={getLink('footer', 'explore', 'book').text}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'book').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'science').href}
              label={getLink('footer', 'explore', 'science').text}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'science').text}
            </FootLink>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-cream/40 mb-2 font-mono text-xs tracking-widest uppercase">
              {getText('footer', 'connect', 'heading')}
            </span>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'connect', 'about').href}
              label={getLink('footer', 'connect', 'about').text}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'about').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'connect', 'stay_close').href}
              label={getLink('footer', 'connect', 'stay_close').text}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'stay_close').text}
            </FootLink>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 font-mono text-xs text-cream/50">
          <span className="uppercase tracking-widest">{getText('footer', 'legal', 'copyright')}</span>
          <p className="text-[11px] text-cream/30 tracking-wide normal-case">
            Design by{' '}
            <a
              href="https://www.9mirrors.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream/50 transition-colors"
              onClick={() => captureCtaClick('9mirrors', 'https://www.9mirrors.xyz', 'footer_credit')}
            >
              9mirrors
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-cream/50 uppercase tracking-widest md:justify-end">
          <FootLink
            restricted={restricted}
            href={getLink('footer', 'legal', 'privacy').href}
            label={getLink('footer', 'legal', 'privacy').text}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'privacy').text}
          </FootLink>
          <FootLink
            restricted={restricted}
            href={getLink('footer', 'legal', 'terms').href}
            label={getLink('footer', 'legal', 'terms').text}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'terms').text}
          </FootLink>
          <FootLink
            restricted={restricted}
            href={getLink('footer', 'legal', 'disclaimer').href}
            label={getLink('footer', 'legal', 'disclaimer').text}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'disclaimer').text}
          </FootLink>
        </div>
      </div>
    </footer>
  );
}
