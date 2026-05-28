import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { MetricSummary } from '../types';
import { useAppContext } from '../AppContext';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// Replaced METRICS
export function MetricsOverview() {
  const { isCompact } = useAppContext();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* GET STARTED */}
      <div className="bg-neo-off neo-border-thick rounded-xl p-4 flex flex-col relative w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase font-head">GET STARTED</h2>
          <button className="bg-neo-white neo-border px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-neo-gray transition-colors">HIDE</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neo-white neo-border rounded-lg p-3 flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-widest leading-tight">CONNECT CHANNEL</span>
            <span className="text-[10px] font-bold text-neo-black/60 mb-2">Not connected</span>
            <button className="w-full bg-neo-lime neo-border rounded py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#00e600] transition-colors neo-shadow-sm">CONNECT</button>
          </div>
          <div className="bg-neo-white neo-border rounded-lg p-3 flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-widest leading-tight">RUN FIRST SYNC</span>
            <span className="text-[10px] font-bold text-neo-black/60 mb-2">Not synced</span>
            <button className="w-full bg-neo-cyan neo-border rounded py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#00e6e6] transition-colors neo-shadow-sm">RUN FIRST SYNC</button>
          </div>
          <div className="bg-neo-white neo-border rounded-lg p-3 flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-widest leading-tight">CONFIRM BILLING/CREDITS</span>
            <span className="text-[10px] font-bold text-neo-black/60 mb-2">Needs review</span>
            <button className="w-full bg-neo-yellow neo-border rounded py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#e6cc00] transition-colors neo-shadow-sm">OPEN BILLING</button>
          </div>
          <div className="bg-neo-white neo-border rounded-lg p-3 flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-widest leading-tight">PREVIEW FIRST RECOMMENDED TOOL</span>
            <span className="text-[10px] font-bold text-neo-black/60 mb-2">Pending</span>
            <button className="w-full bg-neo-blue neo-border rounded py-1.5 text-[10px] font-black uppercase tracking-widest text-neo-white hover:bg-[#4d88ff] transition-colors neo-shadow-sm">OPEN TOOL</button>
          </div>
        </div>
      </div>

      {/* Main Grid Below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Channel Overview */}
        <div className="bg-neo-off neo-border-thick rounded-xl p-4 flex flex-col relative w-full h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black uppercase font-head text-neo-black opacity-40">CHANNEL OVERVIEW</h2>
            <div className="flex gap-1">
              <button className="w-5 h-5 bg-neo-white neo-border rounded flex items-center justify-center text-xs font-bold font-mono">?</button>
              <button className="w-5 h-5 bg-neo-white neo-border rounded flex items-center justify-center text-xs font-bold font-mono">-</button>
            </div>
          </div>

          <div className="flex h-full gap-4 items-center justify-center">
            <div className="w-32 h-32 rounded-full neo-border-thick bg-neo-gray flex items-center justify-center shrink-0">
               <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-cyan border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black flex items-center justify-center">SUBSCRIBERS</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  92 <span className="text-[6px] text-neo-red">▲ +50</span>
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-cyan flex-1"></div>
                  <div className="h-1 bg-neo-cyan flex-1"></div>
                  <div className="h-1 bg-neo-cyan flex-1"></div>
                  <div className="h-1 bg-neo-cyan flex-1"></div>
                  <div className="h-1 bg-neo-cyan flex-1"></div>
                </div>
              </div>

              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-blue border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black text-neo-white flex items-center justify-center">VIEWS (28D)</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  55.0K <span className="text-[6px] text-neo-red">▲ +2.1%</span>
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-blue flex-1"></div>
                  <div className="h-1 bg-neo-blue flex-1"></div>
                  <div className="h-1 bg-neo-blue flex-1"></div>
                  <div className="h-1 bg-neo-blue flex-1"></div>
                  <div className="h-1 bg-neo-blue opacity-20 flex-1"></div>
                </div>
              </div>

              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-purple border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black text-neo-white flex items-center justify-center">WATCH HOURS</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  0
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-purple opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-purple opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-purple opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-purple opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-purple opacity-20 flex-1"></div>
                </div>
              </div>

              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-pink border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black text-neo-white flex items-center justify-center">SUB VELOCITY</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  50 <span className="text-[6px] text-neo-red">▲ 50</span>
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-pink flex-1"></div>
                  <div className="h-1 bg-neo-pink flex-1"></div>
                  <div className="h-1 bg-neo-pink opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-pink opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-pink opacity-20 flex-1"></div>
                </div>
              </div>
              
              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-orange border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black flex items-center justify-center">REVENUE (28D)</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  $0
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-orange opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-orange opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-orange opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-orange opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-orange opacity-20 flex-1"></div>
                </div>
              </div>
              
              <div className="bg-neo-white neo-border rounded flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-3 bg-neo-yellow border-b-2 border-neo-black absolute top-0 left-0 text-[6px] font-black flex items-center justify-center">NEW VIDEOS</div>
                <div className="mt-4 text-sm font-black flex items-center gap-1">
                  1 <span className="text-[6px] text-neo-red">▲ 1</span>
                </div>
                <div className="flex gap-0.5 w-full mt-1">
                  <div className="h-1 bg-neo-yellow flex-1"></div>
                  <div className="h-1 bg-neo-yellow opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-yellow opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-yellow opacity-20 flex-1"></div>
                  <div className="h-1 bg-neo-yellow opacity-20 flex-1"></div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end border-t-2 border-neo-gray pt-2">
             <div className="flex flex-col leading-tight">
               <span className="text-[10px] font-black uppercase">YOUR CHANNEL</span>
               <span className="text-[8px] font-bold text-neo-black/40">@handle</span>
             </div>
             <button className="bg-neo-gray neo-border text-[8px] font-black uppercase px-2 py-0.5 rounded text-neo-black/40">VISIT CHANNEL</button>
          </div>
        </div>

        {/* Right Columns (Placeholders for other widgets) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-neo-off neo-border-thick rounded-xl flex flex-col relative w-full h-[320px] overflow-hidden">
             <div className="h-10 bg-neo-pink border-b-2 border-neo-black flex items-center justify-between px-3">
                <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-neo-black rounded-lg"></div>
                  COMMUNITY POST
                </h2>
                <div className="flex gap-1">
                   <button className="bg-neo-white px-2 py-0.5 neo-border rounded-full text-[8px] font-black">WRITE</button>
                   <button className="bg-neo-off px-2 py-0.5 neo-border rounded-full text-[8px] font-black opacity-60">CREATE</button>
                </div>
             </div>
             <div className="p-3 flex-1 flex flex-col bg-neo-white">
                <div className="flex gap-1 bg-neo-white neo-border rounded p-1 mb-2">
                  <button className="flex-1 bg-neo-pink text-neo-white text-[8px] font-black text-center py-1 rounded">TEXT</button>
                  <button className="flex-1 text-[8px] font-black text-center py-1 rounded hover:bg-neo-gray">IMAGE</button>
                  <button className="flex-1 text-[8px] font-black text-center py-1 rounded hover:bg-neo-gray">POLL</button>
                  <button className="flex-1 text-[8px] font-black text-center py-1 rounded hover:bg-neo-gray">IMG POLL</button>
                  <button className="flex-1 text-[8px] font-black text-center py-1 rounded hover:bg-neo-gray">VIDEO</button>
                </div>
                <textarea 
                  className="flex-1 neo-border p-2 text-xs resize-none focus:outline-none focus:bg-neo-off" 
                  placeholder="What's on your mind? Draft your text post..."
                ></textarea>
                <div className="flex gap-2 mt-2 h-8">
                  <button className="w-8 neo-border rounded flex items-center justify-center hover:bg-neo-gray">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                  </button>
                  <button className="w-8 neo-border rounded flex items-center justify-center hover:bg-neo-gray">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                  <button className="flex-1 bg-neo-pink text-neo-white neo-border rounded text-[10px] font-black hover:bg-[#e62e8a] transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    POST TO CHANNEL
                  </button>
                </div>
             </div>
           </div>

           <div className="bg-neo-off neo-border-thick rounded-xl flex flex-col relative w-full h-[320px] overflow-hidden">
             <div className="h-10 bg-neo-pink border-b-2 border-neo-black flex items-center justify-between px-3">
                <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-neo-black rounded-lg"></div>
                  COMMENT RESPONDER
                </h2>
                <div className="flex gap-1">
                   <button className="bg-neo-white px-2 py-0.5 neo-border rounded-full text-[8px] font-black">NEW</button>
                   <button className="bg-neo-off px-2 py-0.5 neo-border rounded-full text-[8px] font-black opacity-60">OLD</button>
                </div>
             </div>
             <div className="p-3 flex-1 flex flex-col items-center justify-center bg-neo-white relative">
               <span className="text-[10px] font-black text-neo-black/40 uppercase tracking-widest">NO COMMENTS FOUND.</span>
               <div className="absolute bottom-3 left-3 right-3 flex gap-2 h-8">
                  <button className="flex-1 bg-neo-pink opacity-50 neo-border rounded flex items-center justify-center"></button>
                  <button className="flex-1 bg-neo-pink opacity-50 neo-border rounded flex items-center justify-center"></button>
                  <button className="flex-1 bg-neo-white neo-border rounded flex items-center justify-center text-[8px] font-black text-neo-pink hover:bg-neo-off transition-colors">
                    + VIDEOS
                  </button>
               </div>
             </div>
           </div>
        </div>

      </div>

    </div>
  );
}
