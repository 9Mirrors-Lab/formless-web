import { useLayoutEffect, useRef, useState, useCallback, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageLayout } from '../components/PageLayout';
import { ParticleButton } from '../components/ParticleButton';
import { useContent, type ContentApi } from '@/context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

type FutureItem = { title: string; desc: string };

function futureFromContent(api: ContentApi): FutureItem[] {
  return api.listItems('about', 'future').flatMap((entry) => {
    const v = entry.value;
    const title = typeof v.title === 'string' ? v.title : '';
    const desc = typeof v.desc === 'string' ? v.desc : '';
    if (!title) return [];
    return [{ title, desc }];
  });
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const futureRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const content = useContent();
  const { getText, getLink, getImage } = content;
  const futureItems = futureFromContent(content);
  const heroImage = getImage('about', 'hero', 'image');
  const emailLink = getLink('about', 'stay_close', 'email_link');

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setEmail('');
      alert(getText('about', 'stay_close', 'form_success'));
    },
    [getText],
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      gsap.from('.about-image', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.5 });

      gsap.from('.future-item', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: futureRef.current, start: 'top 75%', once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageLayout briefSpectrum>
      <div ref={pageRef}>
        <section className="w-full px-6 md:px-16 lg:px-24 pt-40 pb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="about-image relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto md:h-[70vh]">
              <img
                src={heroImage.src}
                alt={heroImage.alt || ''}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>

            <div className="about-title">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
                {getText('about', 'hero', 'eyebrow')}
              </span>
              <h1 className="font-serif italic text-5xl md:text-7xl text-charcoal leading-[1.08] mb-8">
                {getText('about', 'hero', 'title')}
              </h1>
              <div className="space-y-6 text-charcoal/70 font-sans text-lg leading-relaxed max-w-xl">
                <p>{getText('about', 'hero', 'body_para1')}</p>
                <p>{getText('about', 'hero', 'body_para2')}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={futureRef}
          className="w-full px-6 md:px-16 lg:px-24 py-20 md:py-28 border-t border-charcoal/8"
        >
          <div className="max-w-6xl mx-auto">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40 mb-6 block">
              {getText('about', 'future_intro', 'eyebrow')}
            </span>
            <h2 className="font-serif italic text-3xl md:text-5xl text-charcoal/90 mb-16 leading-tight">
              {getText('about', 'future_intro', 'title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {futureItems.map((item) => (
                <div
                  key={item.title}
                  className="future-item group p-8 rounded-2xl border border-charcoal/8 bg-white/40 hover:border-moss/30 hover:bg-moss/5 transition-all duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)]"
                >
                  <h3 className="font-sans font-bold text-lg text-charcoal mb-3 group-hover:text-moss transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="stay-close"
          className="w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 bg-moss text-cream"
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/40 mb-8 block">
              {getText('about', 'stay_close', 'eyebrow')}
            </span>
            <h2 className="font-serif italic text-4xl md:text-6xl text-cream leading-[1.12] mb-6">
              {getText('about', 'stay_close', 'title')}
            </h2>
            <p className="text-cream/50 font-sans text-base max-w-md mx-auto leading-relaxed mb-12">
              {getText('about', 'stay_close', 'lede')}
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getText('about', 'stay_close', 'email_placeholder')}
                required
                className="w-full sm:flex-1 px-6 py-4 rounded-full bg-cream/10 border border-cream/15 text-cream placeholder:text-cream/30 font-sans text-sm focus:outline-none focus:border-cream/40 transition-colors"
              />
              <ParticleButton>{getText('about', 'stay_close', 'submit')}</ParticleButton>
            </form>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-cream/20">
              {getText('about', 'stay_close', 'fine_print')}
            </p>

            <div className="mt-16 pt-10 border-t border-cream/10">
              <a
                href={emailLink.href}
                className="text-cream/50 hover:text-cream font-sans text-sm transition-colors"
              >
                {emailLink.text}
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
