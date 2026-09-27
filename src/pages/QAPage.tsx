import { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { SonikaInquiryTray, type InquiryTopicOption } from '../components/SonikaInquiryTray';
import {
  FEATURED_INQUIRY_ID,
  INQUIRE_WITH_SONIKA_HERO,
  SONIKA_INQUIRIES,
  type SonikaInquiry,
} from '../data/sonikaInquiriesContent';

const TOPICS: InquiryTopicOption[] = [
  { value: '', label: 'Select a topic' },
  { value: 'life-direction', label: 'Life direction' },
  { value: 'presence', label: 'Presence' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'peace', label: 'Peace & resilience' },
];

const RECENT_QUESTIONS = SONIKA_INQUIRIES.filter((item) => item.id !== FEATURED_INQUIRY_ID).slice(
  0,
  4,
);

export default function QAPage() {
  const [isQuestionTrayOpen, setIsQuestionTrayOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(RECENT_QUESTIONS[0]?.id ?? '');

  const featured = SONIKA_INQUIRIES.find((item) => item.id === FEATURED_INQUIRY_ID)!;
  const activeQuestion =
    RECENT_QUESTIONS.find((item) => item.id === activeQuestionId) ?? RECENT_QUESTIONS[0];
  const featuredFirst = featured.answerParagraphs[0] ?? '';
  const featuredRest = featured.answerParagraphs.slice(1);

  return (
    <PageLayout dark>
      <div className="relative overflow-hidden bg-[#07090b] text-[#f2eee6]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(64% 54% at 12% 14%, rgba(208,169,95,0.16), rgba(7,9,11,0) 68%), radial-gradient(42% 38% at 88% 14%, rgba(208,169,95,0.2), rgba(7,9,11,0) 70%), linear-gradient(180deg, #0a0d10 0%, #06080a 72%, #050709 100%)',
          }}
          aria-hidden
        />

        <section className="site-page-header relative z-10 px-6 pb-10 md:px-16 md:pb-12 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-16">
              <div className="inquire-rise min-w-0 max-w-3xl flex-1 lg:max-w-none">
                <div className="flex max-w-md items-center gap-4">
                  <span className="shrink-0 font-sans text-[0.9rem] font-medium leading-none tracking-[0.14em] text-[#f2eee6]/85 md:text-[1rem]">
                    01
                  </span>
                  <span className="h-px w-28 shrink-0 bg-[#d9b978] md:w-36" aria-hidden />
                </div>

                <h1 className="mt-7 text-balance font-serif text-[2.85rem] font-medium uppercase leading-[0.98] tracking-[0.01em] text-[#f5f1e9] md:mt-8 md:text-[3.75rem] lg:text-[4.15rem]">
                  <span className="block">Inquire</span>
                  <span className="block">
                    With <span className="text-[#d9b978]">Sonika</span>
                  </span>
                </h1>

                <p className="mt-7 max-w-[38rem] font-sans text-[1.02rem] leading-[1.7] text-[#e8e0d2]/88 md:mt-8 md:text-[1.06rem]">
                  {INQUIRE_WITH_SONIKA_HERO.lede}
                </p>

                <figure className="mt-9 max-w-[36rem] border-l border-[#d9b978] pl-5 md:mt-10">
                  <blockquote className="font-serif text-[0.92rem] font-medium uppercase leading-[1.45] tracking-[0.06em] text-[#f2eee6]/88 md:text-[1rem] md:leading-[1.5] md:tracking-[0.07em]">
                    {INQUIRE_WITH_SONIKA_HERO.remembrance}
                  </blockquote>
                </figure>
              </div>

              <aside
                className="inquire-rise w-full shrink-0 lg:w-[20.5rem]"
                style={{ animationDelay: '140ms' }}
              >
                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3c186]/25 px-5 py-7 text-left shadow-[0_28px_64px_-40px_rgba(0,0,0,0.9)] md:px-6 md:py-8"
                  style={{
                    background:
                      'radial-gradient(92% 72% at 50% 28%, rgba(58,48,34,0.38) 0%, rgba(22,20,16,0.18) 42%, rgba(6,7,9,0) 74%), radial-gradient(120% 90% at 50% 110%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(22,19,26,0.55) 0%, rgba(10,11,14,0.42) 48%, rgba(4,5,6,0.5) 100%)',
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      background:
                        'radial-gradient(70% 55% at 50% 40%, rgba(217,185,120,0.08), rgba(217,185,120,0) 68%)',
                    }}
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <p className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d9b978]">
                        Your inquiries
                      </p>
                      <span className="h-px min-w-0 flex-1 bg-[#d9b978]" aria-hidden />
                    </div>

                    <p className="mt-6 text-left font-serif text-[1.55rem] leading-[1.22] text-[#f5f1e9] md:text-[1.65rem]">
                      Submit your inquiry here
                      <br />
                      and <em className="italic text-[#d9b978]">remain anonymous.</em>
                    </p>

                    <p className="mt-5 flex-1 text-left font-serif text-[1.05rem] leading-[1.65] text-[#e8e0d2]/90 md:text-[1.12rem]">
                      Sonika personally reads each inquiry,
                      <br />
                      offering her insights and perspective
                      <br />
                      while always pointing you back to the
                      <br />
                      wisdom within yourself.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsQuestionTrayOpen(true)}
                      className="group mt-7 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#e0bc7a]/75 bg-[linear-gradient(100deg,rgba(215,176,116,0.42),rgba(215,176,116,0.14))] px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#faf3e4] shadow-[0_10px_28px_-16px_rgba(0,0,0,0.85)] transition hover:border-[#efd09a] hover:bg-[linear-gradient(100deg,rgba(215,176,116,0.52),rgba(215,176,116,0.2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/50"
                    >
                      Submit your inquiry
                      <span
                        className="text-base transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-14 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <article className="rounded-3xl border border-[#e3c186]/32 bg-[#0d1014]/82 p-5 shadow-[0_30px_72px_-34px_rgba(0,0,0,0.82)] backdrop-blur-sm md:p-7">
              <div className="flex items-center gap-2 text-[#dbbb8c]">
                <StarGlyph />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Featured answer</p>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col border-b border-[#f2d8aa]/16 pb-5 lg:min-h-[20rem] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.21em] text-[#d9c4a5]/76">
                    Reader question
                  </p>
                  <p className="mt-3 font-serif text-[1.72rem] leading-[1.22] text-[#f4eee1] md:text-[2rem]">
                    {featured.question}
                  </p>

                  <div className="mt-auto border-t border-[#f2d8aa]/12 pt-6">
                    <div className="flex items-center gap-4">
                      <img
                        src="/assets/Soni-shot1.png"
                        alt="Portrait of Sonika Cottman"
                        className="h-15 w-15 shrink-0 rounded-full border border-[#d6b37c]/44 object-cover object-center"
                      />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ddb884]">
                          Sonika
                        </p>
                        <a
                          href="/about"
                          className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#ddb77f] transition hover:text-[#f0d8ad]"
                        >
                          View bio →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.21em] text-[#d9c4a5]/76">
                    Sonika&apos;s answer
                  </p>
                  <div className="mt-4 space-y-3 text-[1.12rem] leading-[1.6] text-[#ecdfc6] md:text-[1.26rem]">
                    <p>
                      <span className="mr-1.5 inline-block align-top font-serif text-[2.7rem] leading-[0.82] text-[#ddb77f]">
                        {featuredFirst.charAt(0)}
                      </span>
                      <span className="font-serif">{featuredFirst.slice(1)}</span>
                    </p>
                    {featuredRest.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)} className="font-serif">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <p
                    className="mt-6 text-[3rem] leading-none text-[#d7ad70] md:text-[3.4rem]"
                    style={{
                      fontFamily:
                        '"Snell Roundhand", "Apple Chancery", "Brush Script MT", "Segoe Script", cursive',
                    }}
                  >
                    Sonika
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-8 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-[#d8be93]">Recent questions</h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {RECENT_QUESTIONS.map((item) => {
                const isActive = item.id === activeQuestion?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionId(item.id);
                      document
                        .getElementById('selected-answer')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    aria-pressed={isActive}
                    className={`rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45 ${
                      isActive
                        ? 'border-[#dcb67e]/55 bg-[#10151b]/92 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.85)]'
                        : 'border-[#edd8b2]/18 bg-[#0b0f13]/80 hover:border-[#dcb67e]/42'
                    }`}
                  >
                    <p className="font-serif text-xl text-[#d5ad72]/90">&ldquo;</p>
                    <p className="mt-1 font-serif text-[1.2rem] leading-[1.28] text-[#f0e8d8] md:text-[1.28rem]">
                      {item.question}
                    </p>
                    <span className="mt-4 inline-block text-[0.82rem] text-[#e6c88e]">
                      {isActive ? 'Reading below' : 'Read answer →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {activeQuestion ? (
          <section
            id="selected-answer"
            className="relative z-10 scroll-mt-24 px-6 pb-20 md:px-16 lg:px-24"
          >
            <div className="mx-auto max-w-6xl">
              <SelectedAnswerPanel inquiry={activeQuestion} />
            </div>
          </section>
        ) : null}

        <SonikaInquiryTray
          open={isQuestionTrayOpen}
          onClose={() => setIsQuestionTrayOpen(false)}
          source="qa"
          title="Submit your inquiry"
          questionLabel="Submit your inquiry"
          questionPlaceholder=""
          questionHint=""
          submitLabel="Submit your inquiry"
          successTitle="Thank you"
          successBody=""
          showOptionalDetails
          topics={TOPICS}
        />
      </div>
    </PageLayout>
  );
}

function SelectedAnswerPanel({ inquiry }: { inquiry: SonikaInquiry }) {
  const firstParagraph = inquiry.answerParagraphs[0] ?? '';
  const restParagraphs = inquiry.answerParagraphs.slice(1);

  return (
    <article className="rounded-[1.35rem] border border-[#e4c188]/28 bg-[linear-gradient(105deg,#0b0f12_0%,#0d1318_58%,#141a22_100%)] px-5 py-6 shadow-[0_20px_48px_-32px_rgba(0,0,0,0.8)] md:px-8 md:py-8">
      <div className="flex items-center gap-2 text-[#e8cc9b]">
        <StarGlyph />
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">Sonika&apos;s answer</p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d9c4a5]/76">
            Question
          </p>
          <p className="mt-3 font-serif text-[1.35rem] leading-[1.28] text-[#f0e6d4] md:text-[1.55rem]">
            {inquiry.question}
          </p>
        </div>

        <div>
          <div className="space-y-3 text-[1.05rem] leading-[1.62] text-[#ecdfc6] md:text-[1.15rem]">
            <p>
              <span className="mr-1.5 inline-block align-top font-serif text-[2.4rem] leading-[0.82] text-[#ddb77f]">
                {firstParagraph.charAt(0)}
              </span>
              <span className="font-serif">{firstParagraph.slice(1)}</span>
            </p>
            {restParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="font-serif">
                {paragraph}
              </p>
            ))}
          </div>
          <p
            className="mt-6 text-[2.5rem] leading-none text-[#d7ad70] md:text-[2.85rem]"
            style={{
              fontFamily:
                '"Snell Roundhand", "Apple Chancery", "Brush Script MT", "Segoe Script", cursive',
            }}
          >
            Sonika
          </p>
        </div>
      </div>
    </article>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2.3 13.4 9l6.3 3-6.3 3L12 21.7 10.6 15 4.3 12l6.3-3L12 2.3Z" />
    </svg>
  );
}
