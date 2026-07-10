import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Star, X } from 'lucide-react';
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_DARK_TEXT,
  INTEGRATION_IDEAS,
  IntegrationCategory,
} from '../data/integrations';

const SHORTLIST_KEY = 'viewtube.integrations.shortlist';

function loadShortlist(): Set<string> {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function IntegrationsHub() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IntegrationCategory | null>(null);
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [shortlist, setShortlist] = useState<Set<string>>(loadShortlist);

  const toggleShortlist = (id: string) => {
    setShortlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATION_IDEAS.filter((idea) => {
      if (category && idea.category !== category) return false;
      if (shortlistOnly && !shortlist.has(idea.id)) return false;
      if (q && !`${idea.title} ${idea.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category, shortlistOnly, shortlist]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-neo-off neo-border-thick rounded-xl p-4 flex flex-col gap-3 w-full">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-col leading-tight">
            <h2 className="text-2xl font-black uppercase font-head">INTEGRATIONS HUB</h2>
            <span className="text-[10px] font-bold uppercase text-neo-black/50 tracking-widest">
              100 WAYS TO LEVERAGE THE YOUTUBE API · SHORTLIST YOUR ROADMAP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-neo-white neo-border-thick rounded-lg px-3 h-9">
              <Search className="w-3.5 h-3.5 opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH 100 IDEAS..."
                className="bg-transparent text-[11px] font-bold uppercase tracking-wider outline-none w-44 placeholder:text-neo-black/30"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X className="w-3 h-3 opacity-50 hover:opacity-100" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShortlistOnly(!shortlistOnly)}
              className={`flex items-center gap-1.5 px-3 h-9 neo-border-thick rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors neo-shadow-hover ${
                shortlistOnly ? 'bg-neo-yellow' : 'bg-neo-white hover:bg-neo-gray'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${shortlistOnly ? 'fill-neo-black' : ''}`} />
              SHORTLIST ({shortlist.size})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory(null)}
            className={`px-2.5 py-1 neo-border rounded-full text-[9px] font-black uppercase tracking-wider transition-transform hover:-translate-y-0.5 ${
              category === null ? 'bg-neo-black text-neo-white' : 'bg-neo-white'
            }`}
          >
            ALL 100
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? null : cat)}
              className={`px-2.5 py-1 neo-border rounded-full text-[9px] font-black uppercase tracking-wider transition-transform hover:-translate-y-0.5 ${
                category === cat
                  ? `${CATEGORY_COLORS[cat]} ${CATEGORY_DARK_TEXT.includes(cat) ? 'text-neo-white' : ''} neo-shadow-sm`
                  : 'bg-neo-white opacity-70 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-neo-white neo-border-thick rounded-xl p-10 flex flex-col items-center gap-2">
          <span className="text-sm font-black uppercase tracking-widest text-neo-black/40">
            NO IDEAS MATCH YOUR FILTERS
          </span>
          <button
            onClick={() => { setQuery(''); setCategory(null); setShortlistOnly(false); }}
            className="bg-neo-yellow neo-border px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest neo-shadow-hover"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((idea, i) => {
            const starred = shortlist.has(idea.id);
            const darkText = CATEGORY_DARK_TEXT.includes(idea.category);
            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.4) }}
                className="bg-neo-white neo-border-thick rounded-xl flex flex-col overflow-hidden neo-shadow-hover"
              >
                <div className={`${CATEGORY_COLORS[idea.category]} border-b-[3px] border-neo-black px-3 py-1.5 flex justify-between items-center gap-2`}>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${darkText ? 'text-neo-white' : 'text-neo-black'}`}>
                    {idea.category}
                  </span>
                  <button
                    onClick={() => toggleShortlist(idea.id)}
                    aria-label={starred ? 'Remove from shortlist' : 'Add to shortlist'}
                    className="w-6 h-6 bg-neo-white neo-border rounded flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                  >
                    <Star className={`w-3.5 h-3.5 ${starred ? 'fill-neo-yellow stroke-neo-black' : 'opacity-40'}`} />
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <h3 className="text-lg font-black uppercase font-head leading-tight">{idea.title}</h3>
                  <p className="text-[11px] font-medium leading-snug text-neo-black/70 flex-1">{idea.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
