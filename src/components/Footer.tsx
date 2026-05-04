import { useContent } from '@/context/ContentContext';

export function Footer() {
  const { getText, getLink } = useContent();

  return (
    <footer className="w-full bg-charcoal text-cream pt-24 pb-12 px-6 md:px-16 lg:px-24 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
        <div className="flex flex-col max-w-sm">
          <a
            href="/"
            className="font-sans font-semibold tracking-[0.2em] uppercase text-xl mb-6"
          >
            {getText('footer', 'brand', 'name')}
          </a>
          <p className="font-serif italic text-cream/50 text-lg mb-8 leading-relaxed">
            {getText('footer', 'brand', 'tagline')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 md:gap-24 font-sans text-sm">
          <div className="flex flex-col gap-4">
            <span className="text-cream/40 mb-2 font-mono text-xs tracking-widest uppercase">
              {getText('footer', 'explore', 'heading')}
            </span>
            <a
              href={getLink('footer', 'explore', 'work').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'work').text}
            </a>
            <a
              href={getLink('footer', 'explore', 'book').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'book').text}
            </a>
            <a
              href={getLink('footer', 'explore', 'science').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'explore', 'science').text}
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-cream/40 mb-2 font-mono text-xs tracking-widest uppercase">
              {getText('footer', 'connect', 'heading')}
            </span>
            <a
              href={getLink('footer', 'connect', 'about').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'about').text}
            </a>
            <a
              href={getLink('footer', 'connect', 'stay_close').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'stay_close').text}
            </a>
            <a
              href={getLink('footer', 'connect', 'contact').href}
              className="text-cream/70 hover:text-cream transition-colors"
            >
              {getLink('footer', 'connect', 'contact').text}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-cream/30 uppercase tracking-widest">
        <span>{getText('footer', 'legal', 'copyright')}</span>
        <div className="flex gap-6">
          <a
            href={getLink('footer', 'legal', 'privacy').href}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'privacy').text}
          </a>
          <a
            href={getLink('footer', 'legal', 'terms').href}
            className="hover:text-cream/80 transition-colors"
          >
            {getLink('footer', 'legal', 'terms').text}
          </a>
        </div>
      </div>
    </footer>
  );
}
