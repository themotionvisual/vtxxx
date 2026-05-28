import { motion } from 'motion/react';
import { Brain, Terminal } from 'lucide-react';
import { useAppContext } from '../AppContext';

export function AIBrain() {
  const { isCompact } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-[#16181D] border border-white/10 rounded-lg flex flex-col h-full ${isCompact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E0E0E0] flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-blue-400" />
          Workspace AI Brain
        </h3>
        <button className="text-[10px] text-blue-400 uppercase font-bold hover:underline">Configure</button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 bg-blue-500 rounded"></div>
            <div>
              <p className="text-[11px] leading-relaxed text-white/80">Analyzing CTR variance in last 48h. Adjusting <span className="text-white font-mono bg-white/10 px-1 rounded border border-white/20">video_metrics</span> sync frequency for high-growth assets.</p>
              <span className="text-[9px] opacity-40 uppercase font-mono mt-1 block">Just now</span>
            </div>
          </div>
          <div className="flex gap-3 opacity-60">
            <div className="w-1 bg-white/20 rounded"></div>
            <div>
              <p className="text-[11px] leading-relaxed text-white/80">Detected missing OAuth scopes for Deep Traffic Geography. Prompting fallback to CSV source.</p>
              <span className="text-[9px] opacity-40 uppercase font-mono mt-1 block">4m ago</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">
            Self-Written Strategy Prompt
          </h3>
          <div className="bg-[#1C1F26] border border-white/5 rounded flex flex-col p-3 font-mono text-[10px] text-white/60 leading-relaxed shadow-inner">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
              <Terminal className="w-3 h-3 text-white/40" />
              <span className="text-white/40">system_workflow.yml</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <span className="text-blue-400">behavior:</span> shift_focus<br/>
              <span className="text-blue-400">priority:</span> minimize_shorts_production<br/>
              <span className="text-blue-400">content_direction:</span><br/>
              &nbsp;&nbsp;- double_down_on(architecture reviews)<br/>
              &nbsp;&nbsp;- enforce_pacing(fast_intro_to_code)<br/>
              <br/>
              <span className="text-white/30 italic"># Auto-generated based on recent retention drop in Shorts.</span>
            </motion.div>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded text-[10px] uppercase font-bold tracking-widest transition-colors"
        >
          Generate New Briefs
        </motion.button>
      </div>
    </motion.div>
  );
}
