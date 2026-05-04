import { useEffect, useState } from 'react';

const initialCards = [
  { id: 1, label: "Epigenetic Age", value: "32.4 yrs", delta: "-4.2 yrs", trend: "down" },
  { id: 2, label: "Microbiome Score", value: "94/100", delta: "+12 pts", trend: "up" },
  { id: 3, label: "Cortisol Optimization", value: "Optimal", delta: "Peak Sync", trend: "neutral" },
];

export function DiagnosticShuffler() {
  const [cards, setCards] = useState(initialCards);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        if (last) newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {cards.map((card, index) => {
        const translateY = index * 24; 
        const scale = 1 - index * 0.05; 
        const opacity = 1 - index * 0.2;
        const zIndex = 3 - index;

        return (
          <div
            key={card.id}
            className="absolute w-full max-w-[280px] bg-white border border-charcoal/5 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-[800ms] flex flex-col justify-between aspect-[4/3] will-change-transform"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              zIndex,
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-charcoal/40 mb-2 block">Parameter 0{card.id}</span>
              <span className="font-sans font-semibold text-lg leading-tight">{card.label}</span>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <span className="font-serif italic text-4xl text-moss leading-none">{card.value}</span>
              <span className={`font-mono text-[10px] uppercase font-bold tracking-wider mb-1 ${card.trend === 'up' ? 'text-clay' : card.trend === 'down' ? 'text-moss' : 'text-charcoal/40'}`}>
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
