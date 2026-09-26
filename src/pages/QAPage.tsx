import { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { SonikaInquiryTray, type InquiryTopicOption } from '../components/SonikaInquiryTray';
import {
  FEATURED_INQUIRY_ID,
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

  const activeQuestion =
    RECENT_QUESTIONS.find((item) => item.id === activeQuestionId) ?? RECENT_QUESTIONS[0];

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

        <section className="site-page-header relative z-10 px-6 pb-14 md:px-16 md:pb-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-start lg:gap-14">
              <div className="max-w-2xl">
                <h1 className="text-balance font-serif text-4xl leading-[1.08] text-[#f3efe7] md:text-[3.35rem]">
                  Q&amp;A with Sonika
                </h1>
                <p className="mt-6 max-w-[38rem] text-base leading-relaxed text-[#ede4d3] md:text-[1.05rem]">
                  Explore insights from Sonika around the questions that arise in everyday life.
                  Submit a question and receive a perspective rooted in presence and awareness.
                </p>
                <p className="mt-5 max-w-[34rem] border-l border-[#d5ae73]/35 pl-4 font-serif text-[1.05rem] leading-relaxed text-[#e8d5b4]/92 md:text-[1.12rem]">
                  And always remember, the answers you seek are already within you.
                </p>
              </div>

              <aside className="relative max-w-xs border-t border-[#e3c186]/18 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
                <div className="flex items-center gap-2 text-[#e4c58f]">
                  <StarGlyph />
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]">Ask Sonika</p>
                </div>
                <p className="mt-2.5 font-serif text-[0.95rem] leading-[1.4] text-[#e6d5b8]/92">
                  Share what is alive for you.
                </p>
                <button
                  type="button"
                  onClick={() => setIsQuestionTrayOpen(true)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 px-0 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#f2e3ca] underline decoration-[#d5ae73]/65 underline-offset-[5px] transition hover:text-[#f4ddba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
                >
                  Submit question
                  <span aria-hidden>→</span>
                </button>
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
                    How do I find peace when my mind is constantly overthinking?
                  </p>
                  <p className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-[#d0a86d]">
                    A reader
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
                        <p className="mt-1 text-sm leading-relaxed text-[#e7dac5]/88">
                          Author. Guide.
                          <br />
                          Student of life.
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
                        O
                      </span>
                      <span className="font-serif">
                        verthinking is often our mind&apos;s way of trying to protect us. It replays, it
                        prepares, and it tries to control outcomes.
                      </span>
                    </p>
                    <p className="font-serif">
                      But peace isn&apos;t found in controlling your thoughts; it&apos;s found in returning
                      to the present moment, again and again.
                    </p>
                    <p className="font-serif">
                      Peace returns when awareness interrupts the loop. Feel your breath, feel your
                      body, and come back to what is actually here.
                    </p>
                    <p className="font-serif">
                      Start small and repeat often. You are not your thoughts. You are the one aware
                      of them.
                    </p>
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
                    <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#cfa970]">
                      {item.topic}
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
          title="Have a question for Sonika?"
          lede="Share what is alive for you. Only your question is required."
          questionLabel="Your question"
          questionPlaceholder="Ask your question..."
          questionHint="Be as clear and specific as you can."
          submitLabel="Submit question"
          successTitle="Thanks for asking"
          successBody="Your question has been received for review. Sonika reads each inquiry personally."
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
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#cfa970]">{inquiry.topic}</p>
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
