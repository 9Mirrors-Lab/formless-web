import { useState, type FormEvent } from 'react';
import { PageLayout } from '../components/PageLayout';

type TopicOption = {
  value: string;
  label: string;
};

const TOPICS: TopicOption[] = [
  { value: '', label: 'Select a topic' },
  { value: 'life-direction', label: 'Life direction' },
  { value: 'presence', label: 'Presence' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'peace', label: 'Peace & resilience' },
];

const RECENT_QUESTIONS = [
  {
    question: "How do I know if I'm on the right path?",
    topic: 'Life direction',
  },
  {
    question: 'What does it mean to surrender?',
    topic: 'Surrender',
  },
  {
    question: 'How can I build a deeper connection with myself?',
    topic: 'Self-awareness',
  },
  {
    question: 'How do I stay grounded in uncertain times?',
    topic: 'Peace & resilience',
  },
];

export default function QAPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState('');
  const [isQuestionTrayOpen, setIsQuestionTrayOpen] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
    setTopic('');
  };

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

        <section className="site-page-header relative z-10 px-6 pb-12 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl md:relative md:pr-[16rem]">
              <div className="max-w-3xl">
                <h1 className="text-balance font-serif text-4xl leading-[1.08] text-[#f3efe7] md:text-[3.35rem]">
                  Q&amp;A with Sonika
                </h1>
                <p className="mt-5 max-w-2xl text-base text-[#ede4d3]">
                  Thoughtful answers to life&apos;s deeper questions.
                </p>
                <div className="mt-5 w-full md:absolute md:right-0 md:top-1 md:mt-0 md:w-[14.25rem]">
                  <div className="relative pl-4 md:pl-5">
                    <span
                      className="absolute bottom-1 left-0 top-1 w-px bg-[linear-gradient(180deg,rgba(212,173,108,0.1),rgba(212,173,108,0.7),rgba(212,173,108,0.1))]"
                      aria-hidden
                    />
                    <div className="flex items-center gap-2 text-[#e4c58f]">
                      <StarGlyph />
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]">Ask Sonika</p>
                    </div>
                    <p className="mt-2 font-serif text-[0.98rem] leading-[1.42] text-[#e6d5b8]/92">
                      Explore reflections and guidance from Sonika, then submit your own question.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsQuestionTrayOpen(true)}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 px-0 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#f2e3ca] underline decoration-[#d5ae73]/65 underline-offset-[5px] transition hover:text-[#f4ddba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
                    >
                      Submit question
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-18 md:px-16 lg:px-24">
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
                        <button
                          type="button"
                          className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#ddb77f] transition hover:text-[#f0d8ad]"
                        >
                          View bio →
                        </button>
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

        <section className="relative z-10 px-6 pb-10 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xs uppercase tracking-[0.22em] text-[#d8be93]">Recent questions</h3>
              <button
                type="button"
                className="text-[0.68rem] uppercase tracking-[0.18em] text-[#e1c695] transition hover:text-[#f0dcbb]"
              >
                View all questions
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {RECENT_QUESTIONS.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-[#edd8b2]/18 bg-[#0b0f13]/80 p-3.5 transition hover:-translate-y-0.5 hover:border-[#dcb67e]/42"
                >
                  <p className="font-serif text-xl text-[#d5ad72]/90">&ldquo;</p>
                  <p className="mt-1 font-serif text-[1.38rem] leading-[1.26] text-[#f0e8d8]">{item.question}</p>
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#cfa970]">
                    {item.topic}
                  </p>
                  <button
                    type="button"
                    className="mt-4 text-[0.82rem] text-[#e6c88e] transition hover:text-[#f4ddba]"
                  >
                    Read answer →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl rounded-[1.35rem] border border-[#e4c188]/24 bg-[linear-gradient(105deg,#0b0f12_0%,#0d1318_58%,#1a2028_100%)] px-6 py-6 shadow-[0_20px_48px_-32px_rgba(0,0,0,0.8)] md:px-8">
            <div className="flex items-start gap-4 text-[#e8cc9b]">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center">
                <StarGlyph />
              </span>
              <p className="max-w-3xl font-serif text-2xl leading-[1.3] text-[#efe4cf] md:text-[2rem]">
                There are no small questions on the path within.
                <br />
                Each question is a doorway to deeper understanding.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
            isQuestionTrayOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsQuestionTrayOpen(false)}
          aria-hidden={!isQuestionTrayOpen}
        />
        <aside
          className={`fixed right-0 top-0 z-50 h-full w-full max-w-[25.5rem] overflow-y-auto border-l border-[#e3c186]/26 bg-[#0c0f13]/96 p-6 shadow-[-24px_0_54px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-transform duration-400 md:p-7 ${
            isQuestionTrayOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isQuestionTrayOpen}
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(232,196,128,0.16),rgba(13,16,19,0)_56%)]" />
            <div className="absolute -right-20 -top-14 h-64 w-64 rounded-full border border-[#d0a95f]/26" />
          </div>

          <div className="relative flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl leading-tight text-[#f3e9d5]">Have a question for Sonika?</h2>
            <button
              type="button"
              onClick={() => setIsQuestionTrayOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e3c186]/28 text-[#e6c995] transition hover:border-[#e6c995]/70 hover:text-[#f4ddba]"
              aria-label="Close question tray"
            >
              ×
            </button>
          </div>
          <p className="relative mt-3 text-sm leading-relaxed text-[#e0d0b6]">We&apos;d love to hear from you.</p>

          <form className="relative mt-6 space-y-4" onSubmit={onSubmit}>
            <FieldLabel htmlFor="qa-name">Name</FieldLabel>
            <FieldInput id="qa-name" name="name" placeholder="Your name" required />

            <FieldLabel htmlFor="qa-email">Email (optional)</FieldLabel>
            <FieldInput id="qa-email" name="email" placeholder="you@example.com" type="email" />

            <FieldLabel htmlFor="qa-topic">Topic</FieldLabel>
            <FieldSelect
              id="qa-topic"
              name="topic"
              value={topic}
              onChange={(value) => setTopic(value)}
              options={TOPICS}
            />

            <FieldLabel htmlFor="qa-question">Your question</FieldLabel>
            <textarea
              id="qa-question"
              name="question"
              required
              rows={4}
              className="block w-full resize-y rounded-xl border border-[#f0ddbc]/20 bg-[#0b0e12]/72 px-3 py-2.5 text-sm text-[#f2eee6] outline-none placeholder:text-[#e2d4bd]/66 transition focus:border-[#d3ad75]/70 focus:ring-2 focus:ring-[#d3ad75]/28"
              placeholder="Ask your question..."
            />

            <p className="text-xs text-[#dac7a7]">Be as clear and specific as you can.</p>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#d5ae73]/58 bg-[linear-gradient(90deg,rgba(213,174,115,0.13),rgba(213,174,115,0.05))] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2e3ca] transition hover:border-[#e2bc84] hover:bg-[linear-gradient(90deg,rgba(213,174,115,0.22),rgba(213,174,115,0.1))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
            >
              Submit question
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </button>
            {submitted ? (
              <p className="rounded-xl border border-[#d3ad75]/40 bg-[#0c1012] px-3 py-2 text-xs text-[#e6c995]">
                Thanks. Your question has been received for review.
              </p>
            ) : null}
          </form>
        </aside>
      </div>
    </PageLayout>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[0.7rem] uppercase tracking-[0.2em] text-[#e0c79e]">
      {children}
    </label>
  );
}

function FieldInput({
  id,
  name,
  placeholder,
  type = 'text',
  required = false,
}: {
  id: string;
  name: string;
  placeholder: string;
  type?: 'text' | 'email';
  required?: boolean;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="block w-full rounded-xl border border-[#f0ddbc]/20 bg-[#0b0e12]/72 px-3 py-2.5 text-sm text-[#f2eee6] outline-none placeholder:text-[#d7c7ae]/48 transition focus:border-[#d3ad75]/70 focus:ring-2 focus:ring-[#d3ad75]/28"
    />
  );
}

function FieldSelect({
  id,
  name,
  value,
  onChange,
  options,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: TopicOption[];
}) {
  return (
    <select
      id={id}
      name={name}
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="block w-full rounded-xl border border-[#f0ddbc]/20 bg-[#0b0e12]/72 px-3 py-2.5 text-sm text-[#f2eee6] outline-none transition focus:border-[#d3ad75]/70 focus:ring-2 focus:ring-[#d3ad75]/28"
    >
      {options.map((option) => (
        <option key={option.value || 'default'} value={option.value} className="bg-[#0b0e12]">
          {option.label}
        </option>
      ))}
    </select>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2.3 13.4 9l6.3 3-6.3 3L12 21.7 10.6 15 4.3 12l6.3-3L12 2.3Z" />
    </svg>
  );
}
