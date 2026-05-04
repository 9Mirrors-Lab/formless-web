const threads = [
  {
    title: "What the pages hold",
    body: "Formless is a quiet inquiry into who you are beneath the noise of the mind; awareness, presence, and stillness when thought thins out.",
    cta: "Rest in the themes",
    href: "#philosophy",
    highlight: false,
  },
  {
    title: "Fragments in motion",
    body: "Passages and glimpses appear here as the manuscript stays alive. Nothing is packaged for a shelf; the work is allowed to stay unfinished.",
    cta: "Open the archive",
    href: "#protocol",
    highlight: true,
  },
  {
    title: "The writing, ongoing",
    body: "Small notes from the desk: what is emerging, what is asking to be said, and the patience of something still taking shape.",
    cta: "Follow the thread",
    href: "#updates",
    highlight: false,
  },
];

export function Membership() {
  return (
    <section id="book" className="w-full py-32 px-6 md:px-16 lg:px-24 bg-cream">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-20 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.2em] text-moss/70 uppercase mb-4 block">
            The manuscript
          </span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-charcoal mb-6">
            Ways into Formless
          </h2>
          <p className="font-sans text-charcoal/60 leading-relaxed">
            This is a studio for a book in progress, not a storefront. Move toward what resonates; there is nothing here to buy, only to meet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
          {threads.map((thread, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all duration-500 overflow-hidden ${
                thread.highlight
                  ? "bg-moss text-cream shadow-2xl scale-100 md:scale-105 z-10"
                  : "bg-white text-charcoal border border-charcoal/5 hover:border-moss/20 hover:shadow-xl"
              }`}
            >
              <h3 className="font-sans font-semibold text-2xl mb-4 leading-snug">{thread.title}</h3>
              <p
                className={`font-sans text-base leading-relaxed flex-grow mb-10 ${
                  thread.highlight ? "text-cream/85" : "text-charcoal/75"
                }`}
              >
                {thread.body}
              </p>

              <a
                href={thread.href}
                className={`relative overflow-hidden group w-full py-4 rounded-full font-sans font-semibold text-sm tracking-wider uppercase text-center transition-transform hover:scale-105 active:scale-95 ${
                  thread.highlight
                    ? "bg-clay text-white"
                    : "bg-charcoal/5 text-charcoal"
                }`}
              >
                <span
                  className={`absolute inset-0 w-full h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${
                    thread.highlight ? "bg-[#A34323]" : "bg-moss"
                  }`}
                />
                <span
                  className={`relative z-10 block transition-colors duration-500 ${
                    !thread.highlight && "group-hover:text-cream"
                  }`}
                >
                  {thread.cta}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
