import { useState } from 'react';
import { Layers, X, ChevronRight } from 'lucide-react';

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDevelopment] = useState(true);

  // In a real app, you'd check process.env.NODE_ENV or similar
  // For now, we'll just render it always, but user can hide it
  
  if (!isDevelopment) return null;

  const devPages = [
    { name: '── Site Pages ──', path: '' },
    { name: 'Holding', path: '/' },
    { name: 'Full home', path: '/home' },
    { name: 'The Work', path: '/work' },
    { name: 'The Book', path: '/book' },
    { name: 'Science', path: '/science' },
    { name: 'About', path: '/about' },
    { name: '── Dev Pages ──', path: '' },
    { name: 'Brief', path: '/brief' },
    { name: 'Moodboard', path: '/moodboard' },
    { name: 'Design System', path: '/design-system' },
    { name: 'Design Framework', path: '/design-framework' },
    { name: 'Icons', path: '/icons' },
    { name: 'Colors (dark explorations)', path: '/colors' },
    { name: 'Eyes Closed logo options', path: '/eyes-closed-logo-options' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="bg-charcoal/95 backdrop-blur-md text-cream p-5 rounded-xl shadow-2xl border border-cream/10 mb-4 w-64 transform transition-all origin-bottom-right">
          <div className="flex justify-between items-center mb-4 border-b border-cream/10 pb-3">
            <h3 className="font-bold uppercase tracking-widest text-xs text-cream/70 flex items-center gap-2">
              <Layers size={14} />
              Dev Navigation
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-cream/50 hover:text-cream transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {devPages.map((page, idx) => (
              <li key={page.path || `sep-${idx}`}>
                {page.path ? (
                  <a 
                    href={page.path} 
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-cream/5 text-sm text-cream/90 hover:text-moss transition-all group"
                  >
                    {page.name}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="block py-2 px-3 text-[10px] font-mono text-cream/30 tracking-widest uppercase mt-2">
                    {page.name.replace(/─/g, '').trim()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-charcoal text-cream p-3 rounded-full shadow-lg border border-cream/10 hover:bg-moss hover:text-charcoal hover:scale-105 transition-all flex items-center justify-center group"
          title="Development Pages"
        >
          <Layers size={20} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};
