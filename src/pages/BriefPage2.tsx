import { useState } from "react";
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  BRIEF_SECTIONS,
  POSITIONING_STATEMENT,
  WEBSITE_BRIEF,
  type BriefSection,
} from "../data/briefContent";
import { QuantumDustVisual } from "@/components/QuantumDustVisual";

function SectionCard({ section, index }: { section: BriefSection; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all hover:bg-white/[0.04]"
    >
      <div 
        className="flex cursor-pointer flex-col p-6 md:flex-row md:items-start md:p-8"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-moss/30 bg-moss/10 font-mono text-sm text-moss md:mb-0 md:mr-6">
          {String(section.number).padStart(2, "0")}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-cream md:text-3xl">{section.title}</h3>
            <button className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-cream transition-transform group-hover:bg-white/10">
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
          
          <p className="mt-3 text-lg leading-relaxed text-cream/70">
            {section.lead}
          </p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
                  {section.body?.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-cream/60">
                      {p}
                    </p>
                  ))}
                  
                  {section.items && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="rounded-xl bg-black/20 p-5 border border-white/5">
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-moss">
                            {item.label}
                          </h4>
                          <p className="text-sm leading-relaxed text-cream/60">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.callout && (
                    <blockquote className="border-l-2 border-clay pl-6 font-serif text-xl italic text-cream/80">
                      {section.callout}
                    </blockquote>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function BriefPage2() {
  return (
    <div className="min-h-screen bg-[#050806] text-cream selection:bg-moss/30 selection:text-cream font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(155,183,168,0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(204,88,51,0.05),transparent_50%)] pointer-events-none" />
      
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#050806]/80 px-6 py-4 backdrop-blur-xl md:px-12">
        <a href="/" className="group flex items-center gap-2 text-sm font-medium text-cream/70 transition-colors hover:text-cream">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </a>
        <div className="text-xs uppercase tracking-widest text-moss">Brief 2.0</div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-24">
        
        {/* Header Section */}
        <header className="mb-16 md:mb-24 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div className="max-w-3xl">
              <span className="mb-4 inline-block text-xs uppercase tracking-widest text-moss">
                {WEBSITE_BRIEF.eyebrow}
              </span>
              <h1 className="font-serif text-5xl font-light italic leading-tight md:text-7xl">
                {WEBSITE_BRIEF.title}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-cream/70 max-w-2xl">
                {WEBSITE_BRIEF.summary}
              </p>
            </div>
          </motion.div>
        </header>

        {/* Hero Visual */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-24"
        >
            <QuantumDustVisual />
        </motion.div>

        {/* Positioning */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 text-center shadow-2xl"
        >
          <Sparkles className="mx-auto mb-6 h-8 w-8 text-clay" />
          <h2 className="mb-6 text-sm uppercase tracking-widest text-moss">Core Positioning</h2>
          <p className="mx-auto max-w-4xl font-serif text-2xl italic leading-relaxed text-cream/90 md:text-3xl">
            "{POSITIONING_STATEMENT}"
          </p>
        </motion.div>

        {/* Sections Grid */}
        <div className="space-y-6">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-light text-cream">Strategic Pillars</h2>
            <span className="text-sm text-cream/50">Click to expand details</span>
          </div>

          {BRIEF_SECTIONS.map((section, idx) => (
            <SectionCard key={section.id} section={section} index={idx} />
          ))}
        </div>

      </main>
    </div>
  );
}
