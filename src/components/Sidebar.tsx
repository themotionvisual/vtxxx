import { LayoutDashboard, Video, Users, BrainCircuit, Settings, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';

const NAV_ITEMS = [
  { label: 'DASHBOARD', active: true, color: 'bg-[#FF3399]' },
  { label: 'STUDIO', color: 'bg-[#FF3399]' },
  { label: 'PROJECTS', color: 'bg-neo-orange' },
  { label: 'ANALYTICS', color: 'bg-neo-yellow' },
  { label: 'EDITOR', color: 'bg-neo-lime' },
  { label: 'SETTINGS', color: 'bg-neo-cyan' },
  { label: 'USER GUIDE', color: 'bg-neo-blue' },
  { label: 'CONNECT YOUTUBE', color: 'bg-neo-purple' },
];

export function Sidebar() {
  const { isCompact } = useAppContext();

  if (isCompact) return null; // Or render a collapsed version. In the image it's expanded.

  return (
    <div className={`border-r-4 border-neo-black bg-neo-off flex flex-col py-4 px-3 gap-3 h-full shrink-0 w-64 overflow-y-auto scrollbar-hide`}>
      <nav className="flex flex-col gap-2 w-full">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`w-full py-2.5 px-4 rounded-full flex items-center justify-center transition-all cursor-pointer neo-border-thick text-xs font-black uppercase tracking-widest ${item.color} ${item.color === 'bg-[#FF3399]' || item.color === 'bg-neo-purple' ? 'text-neo-white' : 'text-neo-black'} neo-shadow-hover`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 w-full pb-4">
        <button className="w-full py-2 neo-border-thick bg-neo-white text-neo-black font-black text-[10px] uppercase tracking-widest rounded-lg mb-4 hover:bg-neo-gray transition-colors">
          HIDE SIDEBAR
        </button>
        <div className="flex gap-2 justify-center text-[10px] font-bold text-neo-black/60 underline">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      
      <div className="w-full neo-border-thick bg-neo-white rounded-xl p-3 flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[10px] font-black uppercase tracking-widest">AI-ASSISTANT</span>
           <span className="text-[8px] font-bold text-neo-red uppercase">KEY REQUIRED</span>
        </div>
        <span className="text-xl font-black uppercase font-head">HOW CAN I</span>
      </div>
    </div>
  );
}
