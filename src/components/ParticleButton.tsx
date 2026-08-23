import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react';
import { captureCtaClick } from '@/lib/analytics';

interface ParticleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  trackLocation?: string;
  trackLabel?: string;
  target?: string;
  rel?: string;
}

/**
 * CTA button with particle burst on click.
 */
export function ParticleButton({
  children,
  onClick,
  href,
  className = '',
  variant = 'primary',
  trackLocation,
  trackLabel,
  target,
  rel,
}: ParticleButtonProps) {
  const particleContainerRef = useRef<HTMLDivElement>(null);

  const spawnParticles = useCallback((e: MouseEvent) => {
    const container = particleContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const count = 12;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle-dot';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 50;
      p.style.cssText = `
        position:absolute; left:${x}px; top:${y}px;
        width:4px; height:4px; border-radius:50%;
        background: currentColor; opacity:1; pointer-events:none;
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
        animation: particle-burst 0.6s cubic-bezier(.16,1,.3,1) forwards;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      spawnParticles(e as unknown as MouseEvent);
      if (href && trackLocation) {
        captureCtaClick(trackLabel ?? String(children), href, trackLocation);
      }
      onClick?.();
    },
    [children, href, onClick, spawnParticles, trackLabel, trackLocation],
  );

  const baseClasses = `
    relative inline-flex items-center gap-3 font-sans font-semibold text-sm uppercase tracking-[0.15em]
    px-8 py-4 rounded-full cursor-pointer
    transition-all duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)]
    ${
      variant === 'primary'
        ? 'bg-moss text-cream hover:bg-moss/90 hover:shadow-lg hover:shadow-moss/20'
        : 'bg-transparent text-charcoal border border-charcoal/20 hover:bg-charcoal hover:text-cream'
    }
    ${className}
  `.trim();

  const content = (
    <>
      <div ref={particleContainerRef} className="absolute inset-0 overflow-hidden rounded-full pointer-events-none" />
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={baseClasses}
      onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {content}
    </button>
  );
}
