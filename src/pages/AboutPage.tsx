import { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { StayCloseNotifyForm } from '../components/StayCloseNotifyForm';
import { textFromEntry } from '@/lib/content';
import { useContent, type ContentApi } from '@/context/ContentContext';
import './AboutPage.css';

type FutureItem = { title: string; desc: string };

function heroBodyParagraphs(content: ContentApi): { key: string; text: string }[] {
  return content
    .ordered('about', 'hero')
    .filter((entry) => entry.key.startsWith('body_para') && entry.type === 'text')
    .map((entry) => ({ key: entry.key, text: textFromEntry(entry) }))
    .filter((entry) => entry.text);
}

function futureFromContent(api: ContentApi): FutureItem[] {
  return api.listItems('about', 'future').flatMap((entry) => {
    const v = entry.value;
    const title = typeof v.title === 'string' ? v.title : '';
    const desc = typeof v.desc === 'string' ? v.desc : '';
    if (!title) return [];
    return [{ title, desc }];
  });
}



const PORTRAIT_PHOTO = '/assets/Soni-shot1.png';

function Layout1({
  content,
  futureItems,
  bodyParagraphs,
}: {
  content: ContentApi;
  futureItems: FutureItem[];
  bodyParagraphs: { key: string; text: string }[];
}) {
  const { getText } = content;
  const portraitTag = getText('about', 'hero', 'portrait_tag');
  const eyebrow = getText('about', 'hero', 'eyebrow');
  return (
    <section className="layout is-active">
      <header className="l1-hero">
        <div className="l1-grid">
          <div className="l1-portrait relative">
            <div className="frame"><img src={PORTRAIT_PHOTO} alt="Portrait of Sonika Cottman" /></div>
            <div className="tag">
              <span className="caption">{portraitTag}</span>
              <span className="name">Sonika Cottman</span>
            </div>
          </div>
          <div className="l1-copy">
            <span className="eyebrow">{eyebrow} <span className="dot">●</span></span>
            <h1>{getText('about', 'hero', 'title')}</h1>
            <div className="body-copy measure">
              {bodyParagraphs.map((paragraph) => (
                <p key={paragraph.key}>{paragraph.text}</p>
              ))}
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

function Layout4({
  content,
  futureItems,
  emailLink,
  bodyParagraphs,
}: {
  content: ContentApi;
  futureItems: FutureItem[];
  emailLink: { href: string };
  bodyParagraphs: { key: string; text: string }[];
}) {
  const { getText } = content;
  const eyebrow = getText('about', 'hero', 'eyebrow');
  return (
    <section className="layout is-active">
      <div className="l4-wrap">
        <aside className="l4-aside">
          <span className="eyebrow">{eyebrow} <span className="dot">●</span></span>
          <div className="name">Sonika<br />Cottman</div>
          <div className="frame relative">
            <img src={PORTRAIT_PHOTO} alt="Portrait of Sonika Cottman" />
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
          <div className="l4-cols">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.key}>{paragraph.text}</p>
            ))}
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

function StayCloseSection({ content }: { content: ContentApi }) {
  const { getText, getLink } = content;
  const emailLink = getLink('about', 'stay_close', 'email_link');

  return (
    <section className="stay" id="stay-close">
      <svg className="orbit-bg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <ellipse cx="600" cy="200" rx="240" ry="90" fill="none" stroke="#9fb5aa" strokeWidth="1" opacity=".4" />
        <ellipse cx="600" cy="200" rx="150" ry="150" fill="none" stroke="#d46544" strokeWidth="1" opacity=".4" />
        <circle cx="600" cy="200" r="46" fill="none" stroke="#9fb5aa" strokeWidth="1" opacity=".55" />
      </svg>
      <div className="stay-inner">
        <span className="eyebrow">{getText('about', 'stay_close', 'eyebrow')}</span>
        <h2>{getText('about', 'stay_close', 'title')}</h2>
        <p className="lede">{getText('about', 'stay_close', 'lede')}</p>
        <StayCloseNotifyForm
          emailPlaceholder={getText('about', 'stay_close', 'email_placeholder')}
          submitLabel={getText('about', 'stay_close', 'submit')}
          finePrint={getText('about', 'stay_close', 'fine_print')}
          successTitle={getText('about', 'stay_close', 'form_success')}
          errorMessage={getText('about', 'stay_close', 'form_error')}
          emailLink={emailLink}
        />
      </div>
    </section>
  );
}

export default function AboutPage({ defaultLayout = 1 }: { defaultLayout?: 1 | 4 } = {}) {
  const [layout, setLayout] = useState<1 | 4>(defaultLayout);
  const content = useContent();
  const { getLink } = content;
  const futureItems = futureFromContent(content);
  const bodyParagraphs = heroBodyParagraphs(content);
  const emailLink = getLink('about', 'stay_close', 'email_link');

  return (
    <PageLayout briefSpectrum>
      <div id="about-page-scope">
        {layout === 1 && (
          <Layout1
            content={content}
            futureItems={futureItems}
            bodyParagraphs={bodyParagraphs}
          />
        )}
        
        {layout === 4 && (
          <Layout4
            content={content}
            futureItems={futureItems}
            emailLink={emailLink}
            bodyParagraphs={bodyParagraphs}
          />
        )}

        <StayCloseSection content={content} />

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
