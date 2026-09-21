import { useState, type FormEvent } from 'react';
import { PageLayout } from '../components/PageLayout';
import {
  FEATURED_INQUIRY_ID,
  INQUIRE_WITH_SONIKA_HERO,
  SONIKA_INQUIRIES,
  type SonikaInquiry,
} from '../data/sonikaInquiriesContent';
import { usePageMeta } from '../hooks/usePageMeta';

const PORTRAIT_PHOTO = '/assets/Soni-shot1.png';

export default function InquireWithSonikaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isInquiryTrayOpen, setIsInquiryTrayOpen] = useState(false);
  const [activeInquiryId, setActiveInquiryId] = useState<string>(FEATURED_INQUIRY_ID);

  const featured = SONIKA_INQUIRIES.find((item) => item.id === FEATURED_INQUIRY_ID)!;
  const activeInquiry =
    SONIKA_INQUIRIES.find((item) => item.id === activeInquiryId) ?? featured;
  const moreInquiries = SONIKA_INQUIRIES.filter((item) => item.id !== FEATURED_INQUIRY_ID);

  usePageMeta({
    title: 'Inquire with Sonika | Eyes Closed',
    description: INQUIRE_WITH_SONIKA_HERO.lede,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  const selectInquiry = (id: string) => {
    setActiveInquiryId(id);
    document.getElementById('inquiry-reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageLayout dark>
      <div className="relative overflow-hidden bg-[#07090b] text-[#f2eee6]">
        <PageBackdrop />

        <section className="site-page-header relative z-10 px-6 pb-10 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#d9b978]/88">
                {INQUIRE_WITH_SONIKA_HERO.subtitle}
              </p>
              <h1 className="mt-3 text-balance font-serif text-4xl leading-[1.06] text-[#f3efe7] md:text-[3.2rem]">
                {INQUIRE_WITH_SONIKA_HERO.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#ede4d3]">
                {INQUIRE_WITH_SONIKA_HERO.lede}
              </p>
              <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-[#e8d5b4]/92">
                {INQUIRE_WITH_SONIKA_HERO.remembrance}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <p className="max-w-2xl text-[1.02rem] leading-relaxed text-[#e5d8c3]/90">
                {INQUIRE_WITH_SONIKA_HERO.invitation}
              </p>
              <div className="rounded-2xl border border-[#e3c186]/22 bg-[#0b0e12]/76 p-5 md:p-6">
                <div className="flex items-center gap-2 text-[#e4c58f]">
                  <StarGlyph />
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]">Anonymous inquiry</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#e0d0b6]">
                  Share what is alive for you. No name or email required.
                </p>
                <button
                  type="button"
                  onClick={() => setIsInquiryTrayOpen(true)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d5ae73]/52 bg-[linear-gradient(90deg,rgba(213,174,115,0.16),rgba(213,174,115,0.06))] px-4 py-2.5 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#f2e3ca] transition hover:border-[#e2bc84] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
                >
                  Submit inquiry
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-14 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <InquirySpread inquiry={featured} label="Featured inquiry" showPortrait />
          </div>
        </section>

        <section className="relative z-10 px-6 pb-8 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#f0e6d4] md:text-[2rem]">Explore more inquiries</h2>
                <p className="mt-2 max-w-xl text-sm text-[#dcc9a8]/88">
                  Select a question to read Sonika&apos;s full response below.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {moreInquiries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectInquiry(item.id)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    activeInquiryId === item.id
                      ? 'border-[#dcb67e]/55 bg-[#10151b]/92 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.85)]'
                      : 'border-[#edd8b2]/18 bg-[#0b0f13]/80 hover:border-[#dcb67e]/42'
                  }`}
                >
                  <p className="font-serif text-xl text-[#d5ad72]/90">&ldquo;</p>
                  <p className="mt-1 font-serif text-[1.15rem] leading-[1.32] text-[#f0e8d8]">{item.question}</p>
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#cfa970]">{item.topic}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {activeInquiry.id !== featured.id ? (
          <section
            id="inquiry-reading"
            className="relative z-10 scroll-mt-24 px-6 pb-14 md:px-16 lg:px-24"
          >
            <div className="mx-auto max-w-6xl">
              <InquirySpread inquiry={activeInquiry} label="Sonika's insight" />
            </div>
          </section>
        ) : null}

        <section className="relative z-10 px-6 pb-20 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl rounded-[1.35rem] border border-[#e4c188]/24 bg-[linear-gradient(105deg,#0b0f12_0%,#0d1318_58%,#1a2028_100%)] px-6 py-6 shadow-[0_20px_48px_-32px_rgba(0,0,0,0.8)] md:px-8">
            <div className="flex items-start gap-4 text-[#e8cc9b]">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center">
                <StarGlyph />
              </span>
              <p className="max-w-3xl font-serif text-2xl leading-[1.32] text-[#efe4cf] md:text-[2rem]">
                {INQUIRE_WITH_SONIKA_HERO.closing}
              </p>
            </div>
          </div>
        </section>

        <InquiryTray
          open={isInquiryTrayOpen}
          onClose={() => setIsInquiryTrayOpen(false)}
          onSubmit={onSubmit}
          submitted={submitted}
        />
      </div>
    </PageLayout>
  );
}

function InquirySpread({
  inquiry,
  label,
  showPortrait = false,
}: {
  inquiry: SonikaInquiry;
  label: string;
  showPortrait?: boolean;
}) {
  const firstParagraph = inquiry.answerParagraphs[0] ?? '';
  const restParagraphs = inquiry.answerParagraphs.slice(1);

  return (
    <article className="rounded-3xl border border-[#e3c186]/32 bg-[#0d1014]/82 p-5 shadow-[0_30px_72px_-34px_rgba(0,0,0,0.82)] backdrop-blur-sm md:p-7">
      <div className="flex items-center gap-2 text-[#dbbb8c]">
        <StarGlyph />
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col border-b border-[#f2d8aa]/16 pb-5 lg:min-h-[18rem] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.21em] text-[#d9c4a5]/76">
            Inquiry
          </p>
          <p className="mt-3 font-serif text-[1.55rem] leading-[1.24] text-[#f4eee1] md:text-[1.85rem]">
            {inquiry.question}
          </p>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#cfa970]">{inquiry.topic}</p>

          {showPortrait ? (
            <div className="mt-auto border-t border-[#f2d8aa]/12 pt-6">
              <div className="flex items-center gap-4">
                <img
                  src={PORTRAIT_PHOTO}
                  alt="Portrait of Sonika Cottman"
                  className="h-15 w-15 shrink-0 rounded-full border border-[#d6b37c]/44 object-cover object-center"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ddb884]">Sonika</p>
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
          ) : null}
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.21em] text-[#d9c4a5]/76">
            Sonika&apos;s insight
          </p>
          <div className="mt-4 space-y-3 text-[1.08rem] leading-[1.62] text-[#ecdfc6] md:text-[1.2rem]">
            <p>
              <span className="mr-1.5 inline-block align-top font-serif text-[2.5rem] leading-[0.82] text-[#ddb77f]">
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
            className="mt-6 text-[2.75rem] leading-none text-[#d7ad70] md:text-[3.1rem]"
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

function InquiryTray({
  open,
  onClose,
  onSubmit,
  submitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitted: boolean;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-[25.5rem] overflow-y-auto border-l border-[#e3c186]/26 bg-[#0c0f13]/96 p-6 shadow-[-24px_0_54px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-transform duration-400 md:p-7 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(232,196,128,0.16),rgba(13,16,19,0)_56%)]" />
          <div className="absolute -right-20 -top-14 h-64 w-64 rounded-full border border-[#d0a95f]/26" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl leading-tight text-[#f3e9d5]">Submit your inquiry</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e3c186]/28 text-[#e6c995] transition hover:border-[#e6c995]/70 hover:text-[#f4ddba]"
            aria-label="Close inquiry tray"
          >
            ×
          </button>
        </div>
        <p className="relative mt-3 text-sm leading-relaxed text-[#e0d0b6]">
          Your message stays anonymous. Sonika reads each inquiry personally.
        </p>

        <form className="relative mt-6 space-y-4" onSubmit={onSubmit}>
          <label htmlFor="inquire-question" className="block text-[0.7rem] uppercase tracking-[0.2em] text-[#e0c79e]">
            Your inquiry
          </label>
          <textarea
            id="inquire-question"
            name="question"
            required
            rows={6}
            className="block w-full resize-y rounded-xl border border-[#f0ddbc]/20 bg-[#0b0e12]/72 px-3 py-2.5 text-sm text-[#f2eee6] outline-none placeholder:text-[#e2d4bd]/66 transition focus:border-[#d3ad75]/70 focus:ring-2 focus:ring-[#d3ad75]/28"
            placeholder="What question is alive for you right now?"
          />
          <p className="text-xs leading-relaxed text-[#dac7a7]">
            Be as honest and specific as you can. You do not need to share your name.
          </p>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#d5ae73]/58 bg-[linear-gradient(90deg,rgba(213,174,115,0.13),rgba(213,174,115,0.05))] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2e3ca] transition hover:border-[#e2bc84] hover:bg-[linear-gradient(90deg,rgba(213,174,115,0.22),rgba(213,174,115,0.1))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3ad75]/45"
          >
            Send inquiry
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </button>
          {submitted ? (
            <p className="rounded-xl border border-[#d3ad75]/40 bg-[#0c1012] px-3 py-2 text-xs text-[#e6c995]">
              Thank you. Your inquiry has been received.
            </p>
          ) : null}
        </form>
      </aside>
    </>
  );
}

function PageBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(64% 54% at 12% 14%, rgba(208,169,95,0.16), rgba(7,9,11,0) 68%), radial-gradient(42% 38% at 88% 14%, rgba(208,169,95,0.2), rgba(7,9,11,0) 70%), linear-gradient(180deg, #0a0d10 0%, #06080a 72%, #050709 100%)',
      }}
      aria-hidden
    />
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2.3 13.4 9l6.3 3-6.3 3L12 21.7 10.6 15 4.3 12l6.3-3L12 2.3Z" />
    </svg>
  );
}
