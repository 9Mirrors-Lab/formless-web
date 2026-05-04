import { useRef } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Compass,
  Feather,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { FrequencyOfMindVisual } from "@/components/FrequencyOfMindVisual";
import {
  BRIEF_SECTIONS,
  CONTENT_OPPORTUNITIES,
  CREATIVE_DIRECTION,
  CTA_RECOMMENDATIONS,
  HOMEPAGE_FLOW,
  MESSAGING_PILLARS,
  OPEN_QUESTIONS,
  POSITIONING_STATEMENT,
  SITE_STRUCTURE,
  VISITOR_JOURNEY,
  WEBSITE_BRIEF,
  type BriefSection,
} from "@/data/briefContent";

function KeyPointsSidebar() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <aside
      ref={containerRef}
      className="hidden xl:block"
    >
      <div className="sticky top-8 rounded-lg border border-clay/20 bg-clay/8 p-5 max-w-xs">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-clay animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-clay/70">
            Key Points
          </p>
        </div>
        <nav className="space-y-3">
          {BRIEF_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex gap-3 rounded-md p-3 transition hover:bg-clay/15"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-clay/30 bg-clay/10 font-mono text-xs text-clay group-hover:bg-clay/20">
                {section.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-charcoal group-hover:text-clay">
                  {section.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-tight text-charcoal/60 group-hover:text-charcoal/70">
                  {section.lead}
                </p>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SectionShell({
  section,
  children,
}: {
  section: BriefSection;
  children: React.ReactNode;
}) {
  return (
    <section
      id={section.id}
      className="scroll-mt-28 border-t border-charcoal/15 py-14 md:py-20"
    >
      <div className="mb-8 flex items-start gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-moss/30 bg-moss/10 font-mono text-sm text-moss">
          {String(section.number).padStart(2, "0")}
        </span>
        <div className="max-w-3xl">
          <p className="mb-2 text-sm uppercase text-moss">Brief section</p>
          <h2 className="font-serif text-4xl font-light italic leading-tight text-charcoal md:text-5xl">
            {section.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-charcoal/72">
            {section.lead}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function TextBlocks({ section }: { section: BriefSection }) {
  return (
    <div className="space-y-6">
      {section.body?.map((paragraph) => (
        <p
          key={paragraph}
          className="max-w-4xl text-base leading-8 text-charcoal/72 md:text-lg"
        >
          {paragraph}
        </p>
      ))}

      {section.items ? (
        <div className="grid gap-4 md:grid-cols-2">
          {section.items.map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-charcoal/12 bg-white/55 p-6 shadow-sm"
            >
              <h3 className="mb-3 text-sm font-semibold uppercase text-moss">
                {item.label}
              </h3>
              <p className="text-base leading-7 text-charcoal/72">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {section.callout ? (
        <blockquote className="max-w-4xl rounded-lg border-l-4 border-clay bg-clay/10 px-6 py-5 font-serif text-2xl italic leading-9 text-charcoal">
          {section.callout}
        </blockquote>
      ) : null}
    </div>
  );
}

function MessagingPillarsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {MESSAGING_PILLARS.map((pillar) => (
        <article
          key={pillar.name}
          className="rounded-lg border border-charcoal/12 bg-white/60 p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-clay" aria-hidden />
            <h3 className="text-xl font-semibold text-charcoal">
              {pillar.name}
            </h3>
          </div>
          <p className="mb-4 text-base leading-7 text-charcoal/76">
            {pillar.coreIdea}
          </p>
          <p className="mb-5 text-sm leading-6 text-charcoal/62">
            {pillar.supportingLanguage}
          </p>
          <p className="border-t border-charcoal/10 pt-4 font-serif text-2xl italic leading-8 text-moss">
            {pillar.exampleCopy}
          </p>
        </article>
      ))}
    </div>
  );
}

function VisitorJourney() {
  return (
    <ol className="grid gap-3">
      {VISITOR_JOURNEY.map((step, index) => (
        <li
          key={step.label}
          className="grid gap-4 rounded-lg border border-charcoal/12 bg-white/50 p-5 md:grid-cols-[120px_1fr_280px] md:items-center"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-clay">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold text-charcoal">{step.label}</h3>
          </div>
          <p className="text-base leading-7 text-charcoal/72">{step.intent}</p>
          <p className="font-serif text-xl italic leading-7 text-moss">
            {step.visitorThought}
          </p>
        </li>
      ))}
    </ol>
  );
}

function SiteStructure() {
  return (
    <div className="grid gap-4">
      {SITE_STRUCTURE.map((item) => (
        <article
          key={item.name}
          className="grid gap-5 rounded-lg border border-charcoal/12 bg-white/55 p-6 lg:grid-cols-[180px_1fr_190px]"
        >
          <h3 className="text-2xl font-semibold text-charcoal">{item.name}</h3>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-moss">
              Purpose
            </p>
            <p className="mb-5 text-base leading-7 text-charcoal/72">
              {item.purpose}
            </p>
            <p className="text-base leading-7 text-charcoal/65">
              {item.suggestedContent}
            </p>
          </div>
          <div className="flex items-start justify-start lg:justify-end">
            <span className="rounded-full border border-clay/30 bg-clay/10 px-4 py-2 text-sm font-medium text-clay">
              {item.cta}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

function HomepageFlow() {
  return (
    <div className="space-y-5">
      {HOMEPAGE_FLOW.map((section, index) => (
        <article
          key={section.sectionName}
          className="rounded-lg border border-charcoal/12 bg-white/60 p-6"
        >
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
            <div>
              <span className="font-mono text-sm text-clay">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-charcoal">
                {section.sectionName}
              </h3>
            </div>
            {section.cta ? (
              <span className="w-fit rounded-full border border-moss/25 bg-moss/10 px-4 py-2 text-sm font-medium text-moss">
                {section.cta}
              </span>
            ) : null}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-moss">
                Purpose
              </p>
              <p className="text-base leading-7 text-charcoal/72">
                {section.purpose}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-moss">
                Suggested headline
              </p>
              <p className="font-serif text-2xl italic leading-8 text-charcoal">
                {section.suggestedHeadline}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-moss">
                Experience notes
              </p>
              <p className="text-base leading-7 text-charcoal/72">
                {section.designNotes}
              </p>
            </div>
          </div>
          <p className="mt-5 border-t border-charcoal/10 pt-5 text-base leading-7 text-charcoal/65">
            {section.keyContent}
          </p>
        </article>
      ))}
    </div>
  );
}

function CreativeDirection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CREATIVE_DIRECTION.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-charcoal/12 bg-white/55 p-6"
        >
          <h3 className="mb-3 text-sm font-semibold uppercase text-moss">
            {item.label}
          </h3>
          <p className="text-base leading-7 text-charcoal/72">
            {item.direction}
          </p>
        </article>
      ))}
    </div>
  );
}

function ContentOpportunities() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {CONTENT_OPPORTUNITIES.map((opportunity) => (
        <article
          key={opportunity.type}
          className="rounded-lg border border-charcoal/12 bg-white/55 p-6"
        >
          <h3 className="mb-4 text-xl font-semibold text-charcoal">
            {opportunity.type}
          </h3>
          <ul className="space-y-3">
            {opportunity.ideas.map((idea) => (
              <li key={idea} className="flex gap-3 text-base text-charcoal/72">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span className="leading-7">{idea}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function CallsToAction() {
  return (
    <div className="grid gap-4">
      {CTA_RECOMMENDATIONS.map((cta) => (
        <article
          key={cta.label}
          className="grid gap-5 rounded-lg border border-charcoal/12 bg-white/60 p-6 md:grid-cols-[180px_1fr_220px]"
        >
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-moss">
              {cta.label}
            </p>
            <p className="font-serif text-2xl italic text-charcoal">
              {cta.buttonText}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-moss">
              Why it fits
            </p>
            <p className="text-base leading-7 text-charcoal/72">{cta.why}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-moss">
              Where
            </p>
            <p className="text-base leading-7 text-charcoal/65">{cta.where}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function OpenQuestions() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {OPEN_QUESTIONS.map((group) => (
        <article
          key={group.group}
          className="rounded-lg border border-charcoal/12 bg-white/55 p-6"
        >
          <h3 className="mb-4 text-xl font-semibold text-charcoal">
            {group.group}
          </h3>
          <ul className="space-y-3">
            {group.questions.map((question) => (
              <li
                key={question}
                className="border-l border-moss/35 pl-4 text-base leading-7 text-charcoal/72"
              >
                {question}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function renderSection(section: BriefSection) {
  switch (section.number) {
    case 7:
      return <MessagingPillarsGrid />;
    case 8:
      return <VisitorJourney />;
    case 9:
      return <SiteStructure />;
    case 10:
      return <HomepageFlow />;
    case 11:
      return <CreativeDirection />;
    case 12:
      return <ContentOpportunities />;
    case 14:
      return <CallsToAction />;
    case 15:
      return <OpenQuestions />;
    default:
      return <TextBlocks section={section} />;
  }
}

export default function BriefPage() {
  return (
    <div className="brief-dark min-h-screen bg-[#080a09] text-cream selection:bg-clay/35 selection:text-cream">
      <div className="noise-overlay-dark" aria-hidden />

      <header className="relative isolate overflow-hidden border-b border-cream/10 bg-[radial-gradient(circle_at_18%_12%,rgba(204,88,51,0.11),transparent_34%),radial-gradient(circle_at_74%_8%,rgba(159,181,170,0.11),transparent_28%)]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 md:px-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.06] px-4 py-2 text-sm font-medium text-cream/82 transition hover:border-[#9FB5AA]/35 hover:text-[#B7CDBF]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Home
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/moodboard"
              className="hidden rounded-full border border-cream/15 bg-cream/[0.06] px-4 py-2 text-sm font-medium text-cream/82 transition hover:border-[#CC5833]/45 hover:text-cream sm:inline-flex"
            >
              Moodboard
            </a>
            <a
              href="#homepage-flow"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-medium text-[#080a09] transition hover:bg-[#B7CDBF]"
            >
              Homepage flow
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 md:px-8 md:pb-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm uppercase text-[#9FB5AA]">
              {WEBSITE_BRIEF.eyebrow}
            </p>
            <h1 className="font-serif text-5xl font-light italic leading-[1.05] text-cream md:text-7xl">
              {WEBSITE_BRIEF.title}
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-9 text-cream/72">
              {WEBSITE_BRIEF.summary}
            </p>
            <div className="mt-10 max-w-3xl rounded-lg border border-[#9FB5AA]/18 bg-[#9FB5AA]/8 p-6">
              <p className="mb-3 text-sm font-semibold uppercase text-[#9FB5AA]">
                Positioning
              </p>
              <p className="text-lg leading-8 text-cream/76">
                {POSITIONING_STATEMENT}
              </p>
            </div>
          </div>

          <FrequencyOfMindVisual
            className="aspect-[4/5] min-h-[520px] rounded-lg border border-cream/10 bg-[#050806] text-cream shadow-2xl shadow-black/35"
            showCaption
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <section className="mb-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-lg border border-charcoal/12 bg-white/60 p-5">
              <MessageCircle className="mb-4 h-5 w-5 text-clay" aria-hidden />
              <p className="text-sm uppercase text-moss">Audience</p>
              <p className="mt-2 text-lg font-semibold leading-6">
                Anyone who has had enough
              </p>
            </article>
            <article className="rounded-lg border border-charcoal/12 bg-white/60 p-5">
              <Compass className="mb-4 h-5 w-5 text-clay" aria-hidden />
              <p className="text-sm uppercase text-moss">Core reframe</p>
              <p className="mt-2 text-lg font-semibold leading-6">
                You are not the voice
              </p>
            </article>
            <article className="rounded-lg border border-charcoal/12 bg-white/60 p-5">
              <Feather className="mb-4 h-5 w-5 text-clay" aria-hidden />
              <p className="text-sm uppercase text-moss">Experience</p>
              <p className="mt-2 text-lg font-semibold leading-6">
                Calm, simple, reflective
              </p>
            </article>
            <article className="rounded-lg border border-charcoal/12 bg-white/60 p-5">
              <BookOpen className="mb-4 h-5 w-5 text-clay" aria-hidden />
              <p className="text-sm uppercase text-moss">Path</p>
              <p className="mt-2 text-lg font-semibold leading-6">
                Book, science, reflection
              </p>
            </article>
          </section>

          {BRIEF_SECTIONS.map((section) => (
            <SectionShell key={section.id} section={section}>
              {renderSection(section)}
            </SectionShell>
          ))}
        </div>

        <KeyPointsSidebar />
      </main>
    </div>
  );
}
