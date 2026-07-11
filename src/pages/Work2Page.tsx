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
  imagePosition?: string;
  insight: string;
  detail: string;
}

const DEFAULT_CATEGORY_IMAGE_POSITION = 'center 18%';

const CATEGORY_IMAGE_POSITION: Record<string, string> = {
  relationships: DEFAULT_CATEGORY_IMAGE_POSITION,
  career: DEFAULT_CATEGORY_IMAGE_POSITION,
  body: DEFAULT_CATEGORY_IMAGE_POSITION,
  family: DEFAULT_CATEGORY_IMAGE_POSITION,
};

function categoriesFromContent(api: ContentApi): AccordionItem[] {
  return api.listItems('work', 'categories').flatMap((entry) => {
    const v = entry.value;
    const id = typeof v.id === 'string' ? v.id : entry.key;
    const title = typeof v.title === 'string' ? v.title : '';
    const image = typeof v.image === 'string' ? v.image : '';
    const imagePosition =
      typeof v.imagePosition === 'string'
        ? v.imagePosition
        : CATEGORY_IMAGE_POSITION[id] ?? DEFAULT_CATEGORY_IMAGE_POSITION;
    const insight = typeof v.insight === 'string' ? v.insight : '';
    const detail = typeof v.detail === 'string' ? v.detail : '';
    if (!title) return [];
    return [{ id, title, image, imagePosition, insight, detail }];
  });
}

export default function Work2Page() {
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
  const downloadSheet = getLink('work', 'accordion_intro', 'download_sheet');

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>
        <section
          ref={headerRef}
          className="site-page-header relative w-full overflow-hidden px-6 pb-20 md:px-16 lg:px-24"
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
              <p className="mt-8 text-charcoal/60 font-sans text-lg max-w-none leading-relaxed">
                {getText('work', 'header', 'lede')}
              </p>
            </div>
          </div>
        </section>

        <section className="relative w-full overflow-x-hidden py-10 md:py-12">
          <div className="px-6 md:px-16 lg:px-24">
            <div className="mx-auto w-full max-w-6xl">
              <span className="mb-6 block font-mono text-xs tracking-[0.3em] uppercase text-cream/40">
                {getText('work', 'accordion_intro', 'eyebrow')}
              </span>
              <PracticePanelsSection
                titleLine1={getText('work', 'accordion_intro', 'title_line1')}
                titleLine2={getText('work', 'accordion_intro', 'title_line2')}
                lede={getText('work', 'accordion_intro', 'lede')}
                downloadSheet={downloadSheet}
                items={categories}
              />
            </div>
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

interface CategoryAccent {
  gradient: string;
}

const CATEGORY_ACCENTS: CategoryAccent[] = [
  { gradient: 'linear-gradient(150deg, rgba(46, 64, 54, 0.52) 0%, rgba(26, 26, 26, 0.32) 100%)' },
  { gradient: 'linear-gradient(150deg, rgba(204, 88, 51, 0.48) 0%, rgba(26, 26, 26, 0.32) 100%)' },
  { gradient: 'linear-gradient(150deg, rgba(74, 95, 79, 0.5) 0%, rgba(26, 26, 26, 0.32) 100%)' },
  { gradient: 'linear-gradient(150deg, rgba(138, 80, 48, 0.48) 0%, rgba(26, 26, 26, 0.32) 100%)' },
];

const HALFTONE_SIDE_MASK =
  'linear-gradient(100deg, transparent 0%, transparent 30%, black 62%, black 100%)';

function formatCategoryNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function PracticePanelsSection({
  titleLine1,
  titleLine2,
  lede,
  downloadSheet,
  items,
}: {
  titleLine1: string;
  titleLine2: string;
  lede: string;
  downloadSheet: { text: string; href: string };
  items: AccordionItem[];
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = items[selectedIdx] ?? items[0];
  const accent = CATEGORY_ACCENTS[selectedIdx] ?? CATEGORY_ACCENTS[0];

  if (!selected) return null;

  return (
    <div className="work-practice-panel-bleed">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3rem]">
        <PracticeHalftoneBackdrop
          image={selected.image}
          position={selected.imagePosition ?? DEFAULT_CATEGORY_IMAGE_POSITION}
        />
      </div>

      <div className="relative z-10 px-6 pt-10 pb-12 md:px-16 md:pt-12 md:pb-14 lg:px-16">
        <h2 className="mb-4 max-w-[26ch] font-serif text-3xl font-light italic leading-[1.15] text-cream md:text-5xl">
          {titleLine1}
          <br />
          {titleLine2}
        </h2>
        <p className="mb-8 max-w-xl font-sans text-base leading-relaxed text-cream/55 md:mb-10 md:text-lg">
          {lede}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] md:gap-x-16 md:gap-y-6">
          <nav
            className="flex flex-col border-t border-cream/12 md:col-start-1 md:row-start-1"
            aria-label="Practice categories"
          >
            {items.map((item, index) => {
              const isSelected = index === selectedIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="flex min-h-11 cursor-pointer items-baseline gap-4 border-b border-cream/12 px-1 py-4 text-left transition-opacity duration-300 hover:opacity-70"
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedIdx(index)}
                >
                  <span
                    className="font-mono text-[0.7rem] tracking-[0.1em]"
                    style={{
                      color: isSelected ? '#D46544' : 'rgba(242,240,233,0.35)',
                    }}
                  >
                    {formatCategoryNumber(index)}
                  </span>
                  <span
                    className="font-sans text-[1.0625rem] leading-snug"
                    style={{
                      color: isSelected ? '#F2F0E9' : 'rgba(242,240,233,0.4)',
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <PracticeVideo
            key={`${selected.id}-video`}
            accent={accent}
            className="order-2 md:col-start-2 md:row-start-1"
          />

          <PracticeDownloadCallout
            downloadSheet={downloadSheet}
            className="order-4 md:col-start-1 md:row-start-2 md:-mt-1 md:self-start"
          />

          <PracticeContentCard key={selected.id} item={selected} className="order-3 md:col-start-2 md:row-start-2" />
        </div>
      </div>
    </div>
  );
}

function PracticeHalftoneBackdrop({
  image,
  position = DEFAULT_CATEGORY_IMAGE_POSITION,
}: {
  image: string;
  position?: string;
}) {
  const displayedRef = useRef({ image, position });
  const frontRef = useRef(0);
  const [slots, setSlots] = useState(() => [
    { image, position, opacity: 1 },
    { image, position, opacity: 0 },
  ]);

  useLayoutEffect(() => {
    const displayed = displayedRef.current;
    if (displayed.image === image && displayed.position === position) return;

    const front = frontRef.current;
    const back = front === 0 ? 1 : 0;
    let cancelled = false;

    const swap = () => {
      if (cancelled) return;
      displayedRef.current = { image, position };
      setSlots((prev) => {
        const next = [...prev];
        next[back] = { image, position, opacity: 1 };
        next[front] = { ...prev[front], opacity: 0 };
        return next;
      });
      frontRef.current = back;
    };

    const preload = new Image();
    preload.src = image;
    if (preload.complete) swap();
    else preload.onload = swap;

    return () => {
      cancelled = true;
    };
  }, [image, position]);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        WebkitMaskImage: HALFTONE_SIDE_MASK,
        maskImage: HALFTONE_SIDE_MASK,
      }}
      aria-hidden
    >
      {slots.map((slot, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover brightness-[0.92] saturate-[1.05] transition-opacity duration-500 ease-out"
          style={{
            backgroundImage: `url("${slot.image}")`,
            backgroundPosition: slot.position,
            opacity: slot.opacity,
          }}
        />
      ))}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-55"
        style={{
          backgroundImage:
            'radial-gradient(rgba(26,26,26,0.55) 1px, transparent 1.4px)',
          backgroundSize: '7px 7px',
        }}
      />
    </div>
  );
}

function PracticeVideo({
  accent,
  className = '',
}: {
  accent: CategoryAccent;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-cream/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-[10px] transition-[background] duration-500 ease-out ${className}`.trim()}
      style={{ background: accent.gradient }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-cream/30 bg-cream/14 backdrop-blur-[6px]">
          <PlayIcon />
        </div>
      </div>
    </div>
  );
}

function PracticeContentCard({
  item,
  className = '',
}: {
  item: AccordionItem;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
    );
  }, [item.id]);

  return (
    <div
      ref={cardRef}
      className={`w-full rounded-[1.25rem] border border-cream/[0.08] bg-[rgba(15,16,15,0.5)] p-7 backdrop-blur-[14px] md:p-[30px_34px] ${className}`.trim()}
    >
      <p className="mb-5 font-serif text-xl font-light italic leading-snug text-cream md:text-[1.75rem]">
        {item.insight}
      </p>
      <p className="font-sans text-[0.9375rem] leading-[1.75] text-cream/60">
        {item.detail}
      </p>
    </div>
  );
}

function PracticeDownloadCallout({
  downloadSheet,
  className = '',
}: {
  downloadSheet: { text: string; href: string };
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      <div className="flex items-start gap-3">
        <div className="work-practice-download-pulse relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-clay/35" aria-hidden />
          <span className="absolute inset-[3px] rounded-full border border-clay/20" aria-hidden />
          <span className="relative h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
        </div>
        <div className="min-w-0 pt-1">
          <span className="mb-1 block font-mono text-[10px] tracking-[0.24em] uppercase text-clay/80">
            Take it with you
          </span>
          <p className="font-serif text-sm italic leading-snug text-cream/50">
            A printable sheet for the practice.
          </p>
        </div>
      </div>
      <div
        className="h-px w-full bg-gradient-to-r from-clay/55 via-cream/12 to-transparent"
        aria-hidden
      />
      <a
        href={downloadSheet.href || '#'}
        className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] uppercase text-clay no-underline transition-opacity hover:opacity-80"
      >
        <DownloadIcon />
        {downloadSheet.text || 'Download practice sheet'}
      </a>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 5.5V18.5L19 12L8 5.5Z" fill="#F2F0E9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
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
