import { useEffect, useState } from 'react';

const messages = [
  "Optimizing Circadian Rhythm...",
  "Calibrating Neural Pathways...",
  "Synchronizing Epigenetic Markers...",
  "Analyzing Biomarker Telemetry...",
];

export function TelemetryTypewriter() {
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentMessage) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 500);
    } else {
      const nextText = isDeleting 
        ? currentMessage.slice(0, text.length - 1)
        : currentMessage.slice(0, text.length + 1);
        
      timeout = setTimeout(() => setText(nextText), isDeleting ? 20 : 50);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, messageIndex]);

  return (
    <div className="w-full h-full bg-[#1A1A1A] rounded-[2rem] p-8 flex flex-col justify-between border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-clay/40 rounded-full animate-ping" />
          <div className="w-2 h-2 bg-clay rounded-full relative z-10" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">Neural Stream // Node 04</span>
      </div>
      
      <div className="flex-grow flex items-end relative z-10">
        <p className="font-mono text-sm leading-relaxed text-moss min-h-[3rem] w-full">
          &gt; {text}
          <span className="inline-block w-2.5 h-[1em] ml-1 bg-clay animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] align-middle" />
        </p>
      </div>
    </div>
  );
}
