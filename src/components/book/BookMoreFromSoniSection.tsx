import { ParticleButton } from '@/components/ParticleButton';
import { TeachingIconMark } from '@/components/iconography/TeachingIconMark';
import { BOOK_PREVIEW_MORE } from '@/data/bookInsightsPreview';

type MoreItem =
  | {
      id: string;
      kind: 'quote';
      background: 'sand';
      text: string;
    }
  | {
      id: string;
      kind: 'image';
      imageSrc: string;
      imageAlt: string;
      text: string;
    };

type BookMoreFromSoniSectionProps = {
  title?: string;
  items?: MoreItem[];
  exploreLabel?: string;
  exploreHref?: string;
  trackLocation?: string;
  id?: string;
  className?: string;
};

function QuoteTile({ text }: { text: string }) {
  return (
    <article className="flex min-h-[22rem] flex-col items-center justify-center bg-[#e8e2d6] px-8 py-10 text-center md:min-h-[26rem]">
      <p className="max-w-[18ch] font-serif text-2xl leading-snug text-charcoal/90 md:text-[1.65rem]">
        {text}
      </p>
      <div className="mt-8 opacity-70" aria-hidden>
        <TeachingIconMark id="space" theme="light" size={36} />
      </div>
    </article>
  );
}

/** Droppable secondary insights row. */
export function BookMoreFromSoniSection({
  title = BOOK_PREVIEW_MORE.title,
  items = BOOK_PREVIEW_MORE.items as MoreItem[],
  exploreLabel = BOOK_PREVIEW_MORE.exploreLabel,
  exploreHref = BOOK_PREVIEW_MORE.exploreHref,
  trackLocation = 'book_more_from_soni',
  id = 'more-from-soni',
  className = '',
}: BookMoreFromSoniSectionProps) {
  return (
    <section
      id={id}
      className={`w-full border-t border-charcoal/8 bg-cream px-6 py-20 text-charcoal md:px-16 md:py-28 lg:px-24 ${className}`.trim()}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl italic text-charcoal md:text-4xl">{title}</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map((item) => {
            if (item.kind === 'image') {
              return (
                <article key={item.id} className="relative min-h-[20rem] overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-charcoal/45" aria-hidden />
                  <p className="relative z-[1] flex h-full items-end p-6 font-serif text-xl leading-snug text-cream">
                    {item.text}
                  </p>
                </article>
              );
            }

            return <QuoteTile key={item.id} text={item.text} />;
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <ParticleButton
            href={exploreHref}
            variant="secondary"
            trackLocation={trackLocation}
            trackLabel={exploreLabel}
            className="rounded-none border-charcoal/25 px-10"
          >
            {exploreLabel}
          </ParticleButton>
        </div>
      </div>
    </section>
  );
}
