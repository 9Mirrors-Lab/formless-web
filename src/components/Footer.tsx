import type { ReactNode } from 'react';
import { useContent } from '@/context/ContentContext';
import { useSiteAccess } from '@/context/SiteAccessContext';

function FootLink({
  href,
  className,
  children,
  restricted,
}: {
  href: string;
  className: string;
  children: ReactNode;
  restricted: boolean;
}) {
  if (restricted) {
    return <span className={className}>{children}</span>;
  }
  return (
    <a href={href} className={className}>
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

  return (
    <footer className="w-full bg-charcoal text-cream pt-24 pb-12 px-6 md:px-16 lg:px-24 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        <div className="flex flex-col max-w-sm">
          {restricted ? (
            <span className={brandClass}>{getText('footer', 'brand', 'name')}</span>
          ) : (
            <a href={homeHref} className={brandClass}>
              {getText('footer', 'brand', 'name')}
            </a>
          )}
          <p className="font-serif italic text-cream/50 text-lg mb-8 leading-relaxed">
            {getText('footer', 'brand', 'tagline')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 md:gap-24 font-sans text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-cream/40 mb-2 font-mono text-xs tracking-widest uppercase">
              {getText('footer', 'explore', 'heading')}
            </span>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'work').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'work').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'book').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'book').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'explore', 'science').href}
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
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'about').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'connect', 'stay_close').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'stay_close').text}
            </FootLink>
            <FootLink
              restricted={restricted}
              href={getLink('footer', 'connect', 'contact').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'contact').text}
            </FootLink>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-cream/50 uppercase tracking-widest">
        <span>{getText('footer', 'legal', 'copyright')}</span>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
          <FootLink
            restricted={restricted}
            href={getLink('footer', 'legal', 'privacy').href}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'privacy').text}
          </FootLink>
          <FootLink
            restricted={restricted}
            href={getLink('footer', 'legal', 'terms').href}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'terms').text}
          </FootLink>
        </div>
      </div>
    </footer>
  );
}
