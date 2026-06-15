import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

interface AccordionItem {
  id: string;
  title: string;
  image: string;
  insight: string;
  detail: string;
}

function categoriesFromContent(api: ContentApi): AccordionItem[] {
  return api.listItems('work', 'categories').flatMap((entry) => {
    const v = entry.value;
    const id = typeof v.id === 'string' ? v.id : entry.key;
    const title = typeof v.title === 'string' ? v.title : '';
    const image = typeof v.image === 'string' ? v.image : '';
    const insight = typeof v.insight === 'string' ? v.insight : '';
    const detail = typeof v.detail === 'string' ? v.detail : '';
    if (!title) return [];
    return [{ id, title, image, insight, detail }];
  });
}

export default function WorkPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const content = useContent();
  const { getText, getLink } = content;
  const categories = categoriesFromContent(content);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.sci-blob-1', {
        x: 50,
        y: -30,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.sci-blob-2', {
        x: -40,
        y: 40,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.from('.work-title', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 70%',
          once: true,
        },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const ctaBook = getLink('work', 'reframe', 'cta_book');

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>
        <section
          ref={headerRef}
          className="relative w-full px-6 md:px-16 lg:px-24 pt-52 pb-20 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sci-blob-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-moss/10 blur-[120px] will-change-transform" />
            <div className="sci-blob-2 absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-clay/6 blur-[100px] will-change-transform" />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-5xl">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
                {getText('work', 'header', 'eyebrow')}
              </span>
              <h1 className="work-title font-serif italic text-5xl md:text-7xl lg:text-[5.5rem] text-charcoal leading-[1.08]">
                {getText('work', 'header', 'title_line1')}
                <br />
                {getText('work', 'header', 'title_line2')}
              </h1>
              <p className="mt-8 text-charcoal/60 font-sans text-lg max-w-xl leading-relaxed">
                {getText('work', 'header', 'lede')}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full px-6 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
              {getText('work', 'accordion_intro', 'eyebrow')}
            </span>
            <h2 className="font-serif italic text-3xl md:text-5xl text-charcoal/90 mb-12 leading-tight">
              {getText('work', 'accordion_intro', 'title_line1')}
              <br />
              {getText('work', 'accordion_intro', 'title_line2')}
            </h2>
            <AccordionSlider items={categories} />
          </div>
        </section>

        <section className="w-full bg-charcoal text-cream px-6 md:px-16 lg:px-24 py-24 md:py-32 rounded-t-[3rem]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/30 mb-8 block">
              {getText('work', 'reframe', 'eyebrow')}
            </span>
            <h2 className="font-serif italic text-4xl md:text-6xl text-cream leading-[1.12] mb-8">
              {getText('work', 'reframe', 'heading')}
            </h2>
            <p className="font-serif italic text-5xl md:text-7xl text-clay leading-[1.08]">
              {getText('work', 'reframe', 'emphasis')}
            </p>
            <p className="mt-10 text-cream/50 font-sans text-base max-w-md leading-relaxed">
              {getText('work', 'reframe', 'body')}
            </p>
            <div className="mt-10">
              <ParticleButton href={ctaBook.href}>{ctaBook.text}</ParticleButton>
            </div>
            </div>

            <div className="flex items-center justify-center">
              <ObserverIcon />
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function AccordionSlider({ items }: { items: AccordionItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-2 h-[500px] md:h-[550px]">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <div
            key={item.id}
            className="accordion-panel relative overflow-hidden rounded-2xl cursor-pointer transition-[flex] duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ flex: isActive ? 5 : 1 }}
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
              style={{
                backgroundImage: `url("${item.image}")`,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/10" />

            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
              <h3 className="font-sans font-bold text-cream text-xl md:text-2xl transition-all duration-500">
                {item.title}
              </h3>

              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                  isActive ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <p className="font-serif italic text-cream/90 text-lg md:text-xl mb-3">
                  {item.insight}
                </p>
                <p className="font-sans text-cream/50 text-sm leading-relaxed max-w-sm">
                  {item.detail}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ObserverIcon() {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.observer-ring', {
        scale: 2.5,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        stagger: 0.6,
        ease: 'power1.out',
        transformOrigin: '50% 50%',
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-48 h-48 md:w-72 md:h-72 text-cream/20"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <circle className="observer-ring" cx="50" cy="50" r="8" />
      <circle className="observer-ring" cx="50" cy="50" r="8" style={{ animationDelay: '0.6s' }} />
      <circle className="observer-ring" cx="50" cy="50" r="8" style={{ animationDelay: '1.2s' }} />
      <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="50" cy="50" r="40" strokeDasharray="3 8" opacity="0.15" />
    </svg>
  );
}
