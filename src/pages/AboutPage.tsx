import { useState, useCallback, type FormEvent } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useContent, type ContentApi } from '@/context/ContentContext';
import './AboutPage.css';

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

function StayClose({ content, email, setEmail, handleSubmit, emailLink }: any) {
  const { getText } = content;
  return (
    <section className="stay">
      <svg className="orbit-bg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <ellipse cx="600" cy="200" rx="240" ry="90" fill="none" stroke="#9fb5aa" strokeWidth="1" opacity=".4" />
        <ellipse cx="600" cy="200" rx="150" ry="150" fill="none" stroke="#d46544" strokeWidth="1" opacity=".4" />
        <circle cx="600" cy="200" r="46" fill="none" stroke="#9fb5aa" strokeWidth="1" opacity=".55" />
      </svg>
      <div className="stay-inner">
        <span className="eyebrow">{getText('about', 'stay_close', 'eyebrow')}</span>
        <h2>{getText('about', 'stay_close', 'title')}</h2>
        <p className="lede">{getText('about', 'stay_close', 'lede')}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={getText('about', 'stay_close', 'email_placeholder')}
            required
          />
          <button type="submit">{getText('about', 'stay_close', 'submit')}</button>
        </form>
        <p className="fine">{getText('about', 'stay_close', 'fine_print')}</p>
        <div className="signoff">
          <a href={emailLink.href}>{emailLink.text}</a>
        </div>
      </div>
    </section>
  );
}

const PHOTOS = [
  '/assets/Soni-shot1.png',
  '/assets/Soni-shot2.png',
  '/assets/Soni-shot3.png',
  '/assets/Soni-shot4.png',
  '/assets/Soni-shot5.png',
  '/assets/Soni-shot6.png'
];

function PhotoSwitcher({ activeIndex, onChange }: { activeIndex: number, onChange: (i: number) => void }) {
  return (
    <div className="absolute top-28 -left-28 flex flex-col gap-3 z-20">
      {PHOTOS.map((_, idx) => (
        <button
          key={idx}
          onClick={() => onChange(idx)}
          className={`text-[10px] uppercase tracking-widest font-mono text-left transition-colors whitespace-nowrap ${
            activeIndex === idx ? 'text-clay' : 'text-cream/40 hover:text-cream'
          }`}
        >
          Photo {idx + 1}
        </button>
      ))}
    </div>
  );
}

function Layout1({ content, futureItems, emailLink, activePhotoIndex, setActivePhotoIndex }: any) {
  const { getText } = content;
  return (
    <section className="layout is-active">
      <header className="l1-hero">
        <div className="l1-grid">
          <div className="l1-portrait relative">
            <PhotoSwitcher activeIndex={activePhotoIndex} onChange={setActivePhotoIndex} />
            <div className="frame"><img src={PHOTOS[activePhotoIndex]} alt="Portrait of Sonika Cottman" /></div>
            <div className="tag">
              <span className="caption">The Author</span>
              <span className="name">Sonika Cottman</span>
            </div>
          </div>
          <div className="l1-copy">
            <span className="eyebrow">The Author <span className="dot">●</span></span>
            <h1>{getText('about', 'hero', 'title')}</h1>
            <div className="body-copy measure">
              <p>{getText('about', 'hero', 'body_para1')}</p>
              <p>{getText('about', 'hero', 'body_para2')}</p>
            </div>
            <div className="l1-sign"><span className="line"></span><span>Begin with a reflection.</span></div>
          </div>
        </div>
      </header>

      <section className="l1-future">
        <div className="future-head">
          <span className="eyebrow">{getText('about', 'future_intro', 'eyebrow')} <span className="dot">●</span></span>
          <h2>{getText('about', 'future_intro', 'title')}</h2>
        </div>
        <div className="l1-rows">
          {futureItems.map((item: FutureItem, i: number) => (
            <div className="l1-row" key={item.title}>
              <span className="num">0{i + 1}</span>
              <span className="t">{item.title}</span>
              <span className="d">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Layout4({ content, futureItems, emailLink, activePhotoIndex, setActivePhotoIndex }: any) {
  const { getText } = content;
  return (
    <section className="layout is-active">
      <div className="l4-wrap">
        <aside className="l4-aside">
          <span className="eyebrow">The Author <span className="dot">●</span></span>
          <div className="name">Sonika<br />Cottman</div>
          <div className="frame relative">
            <PhotoSwitcher activeIndex={activePhotoIndex} onChange={setActivePhotoIndex} />
            <img src={PHOTOS[activePhotoIndex]} alt="Portrait of Sonika Cottman" />
          </div>
          <div className="meta">
            <div className="row"><span>Field</span><span>Inner awareness</span></div>
            <div className="row"><span>Work</span><span>Formless</span></div>
            <div className="row"><span>Status</span><span>Unfolding</span></div>
          </div>
          <a href={emailLink.href} className="contact">Get in touch →</a>
        </aside>

        <main className="l4-main">
          <h1>{getText('about', 'hero', 'title')}</h1>
          <p className="l4-pull">You are not the voice in the head. Peace does not depend on outer circumstances arranging themselves.</p>
          <div className="l4-cols">
            <p>{getText('about', 'hero', 'body_para1')}</p>
            <p>{getText('about', 'hero', 'body_para2')}</p>
            <p>That foundation is the recognition that you are not the voice in the head, and that peace does not depend on outer circumstances arranging themselves.</p>
            <p>The writing continues. The teaching unfolds. This is a studio for a work in progress, not a storefront.</p>
          </div>

          <section className="l4-future">
            <span className="eyebrow">{getText('about', 'future_intro', 'eyebrow')} <span className="dot">●</span></span>
            <div className="items">
              {futureItems.map((item: FutureItem) => (
                <div className="l4-fi" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default function AboutPage({ defaultLayout = 1 }: { defaultLayout?: 1 | 4 } = {}) {
  const [layout, setLayout] = useState<1 | 4>(defaultLayout);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const content = useContent();
  const { getText, getLink, getImage } = content;
  const futureItems = futureFromContent(content);
  const emailLink = getLink('about', 'stay_close', 'email_link');

  return (
    <PageLayout briefSpectrum>
      <div id="about-page-scope">
        {layout === 1 && (
          <Layout1 
            content={content} 
            futureItems={futureItems} 
            emailLink={emailLink} 
            activePhotoIndex={activePhotoIndex}
            setActivePhotoIndex={setActivePhotoIndex}
          />
        )}
        
        {layout === 4 && (
          <Layout4 
            content={content} 
            futureItems={futureItems} 
            emailLink={emailLink} 
            activePhotoIndex={activePhotoIndex}
            setActivePhotoIndex={setActivePhotoIndex}
          />
        )}

        <div className="switcher" role="tablist" aria-label="About page layout">
          <button 
            className={layout === 1 ? 'active' : ''} 
            onClick={() => setLayout(1)}
          >
            <span className="n">01</span><span className="lbl">Editorial Split</span>
          </button>
          <button 
            className={layout === 4 ? 'active' : ''} 
            onClick={() => setLayout(4)}
          >
            <span className="n">04</span><span className="lbl">Magazine</span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
