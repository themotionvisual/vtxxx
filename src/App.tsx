import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MetricsOverview } from './components/MetricsOverview';
import { VideoTable } from './components/VideoTable';
import { AIBrain } from './components/AIBrain';

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-neo-off text-neo-black overflow-hidden font-sans font-bold">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10">
          <MetricsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-neo-pink neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[220px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-4 h-4 border-2 border-neo-black rounded"></div>
                   UPLOAD CADENCE
                 </h2>
                 <div className="flex gap-1">
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              <div className="flex-1 bg-neo-white neo-border rounded p-2 flex flex-col justify-between">
                <span className="text-[8px] font-black uppercase text-neo-black/40">LAST 21 DAYS</span>
                <div className="grid grid-cols-7 gap-1 flex-1 py-1">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <div key={i} className={`rounded-sm neo-border ${i === 17 ? 'border-neo-pink bg-neo-white flex items-end justify-center text-[5px] text-neo-pink font-black pb-[1px]' : i > 17 ? 'border-dashed opacity-50 bg-neo-off' : 'bg-neo-white'}`}>
                      {i === 17 ? 'TODAY' : ''}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[7px] font-black uppercase">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-neo-cyan neo-border"></div>LONG</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-neo-yellow neo-border"></div>SHORT</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-neo-lime neo-border"></div>BOTH</div>
                </div>
              </div>
            </div>

            <div className="bg-neo-orange neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[220px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-4 h-4 border-2 border-neo-black rounded flex items-center justify-center"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
                   REALTIME
                 </h2>
                 <div className="flex gap-1 items-center">
                   <div className="flex mr-2">
                     <button className="bg-neo-orange neo-border px-1.5 py-0.5 text-[6px] font-black text-neo-white">48H</button>
                     <button className="bg-neo-white neo-border px-1.5 py-0.5 text-[6px] font-black opacity-60">60M</button>
                   </div>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              <div className="flex-1 bg-neo-white neo-border rounded p-3 flex flex-col relative overflow-hidden">
                 <div className="flex items-center gap-1 text-[8px] font-black text-neo-orange mb-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-neo-orange"></span> Updating live
                 </div>
                 <div className="flex justify-between items-start z-10 relative">
                   <span className="text-[10px] font-black uppercase tracking-widest text-neo-black/60">VIEWS • LAST 48 HOURS</span>
                   <div className="flex flex-col items-end leading-none">
                     <span className="text-[10px] font-black uppercase tracking-widest text-neo-black/60">VIEWS</span>
                     <span className="text-2xl font-black">750</span>
                   </div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 h-[80%] flex items-end justify-between px-2 opacity-50 px-3">
                   {/* Mock Bars */}
                   {[40,20,60,30,80,90,50,20,70,80,40].map((h, i) => (
                     <div key={i} className="w-4 bg-neo-orange neo-border rounded-t-sm" style={{ height: `${h}%` }}></div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-neo-yellow neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[220px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-4 h-4 border-2 border-neo-black rounded flex items-center justify-center"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
                   GOALS TRACKER
                 </h2>
                 <div className="flex gap-1">
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              
              <div className="flex-1 bg-neo-white neo-border rounded p-2 flex gap-4">
                 <div className="flex flex-col gap-2 w-20">
                   <button className="bg-neo-white neo-border py-1 text-[8px] font-black uppercase leading-tight rounded-sm">SUBS<br/><span className="text-[6px] opacity-60">SET</span></button>
                   <button className="bg-neo-white neo-border py-1 text-[8px] font-black uppercase leading-tight rounded-sm">VIEWS<br/><span className="text-[6px] opacity-60">SET</span></button>
                   <button className="bg-neo-white neo-border py-1 text-[8px] font-black uppercase leading-tight rounded-sm opacity-50">$REV<br/><span className="text-[6px]">SET</span></button>
                   <button className="bg-neo-white neo-border py-1 text-[8px] font-black uppercase leading-tight rounded-sm opacity-50">OTHER<br/><span className="text-[6px]">SET</span></button>
                 </div>
                 
                 <div className="flex-1 border-l-2 border-neo-black/10 flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="text-[10px] font-black text-neo-black/20 uppercase tracking-widest absolute top-2 left-2">CLICK LEFT...</span>
                    
                    <div className="flex flex-col w-full px-4 gap-2 opacity-50 mt-4">
                       <div className="flex items-center w-full relative h-4 bg-neo-yellow/20 neo-border rounded overflow-hidden">
                         <div className="h-full bg-neo-yellow border-r-2 border-neo-black w-[40%] text-[8px] flex items-center px-1">SADDLE</div>
                         <div className="absolute right-1 text-[8px] font-black">2,041</div>
                       </div>
                       <div className="flex items-center w-full relative h-4 bg-neo-yellow/20 neo-border rounded overflow-hidden">
                         <div className="h-full bg-neo-yellow border-r-2 border-neo-black w-[30%] text-[8px] flex items-center px-1">FRENCH</div>
                         <div className="absolute right-1 text-[8px] font-black">2,041</div>
                       </div>
                       <div className="flex items-center w-full relative h-4 bg-neo-yellow/20 neo-border rounded overflow-hidden">
                         <div className="h-full bg-neo-yellow border-r-2 border-neo-black w-[50%] text-[8px] flex items-center px-1">LEGION</div>
                         <div className="absolute right-1 text-[8px] font-black">1,973</div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-32 flex flex-col gap-1 overflow-visible z-10 pt-4">
                   <div className="text-[6px] font-black uppercase text-right w-full border-b border-neo-black/20 mb-1 pb-0.5">AVG VIEWS</div>
                   <div className="bg-neo-yellow neo-border text-[6px] font-black px-1 flex items-center h-3 w-[120%] -ml-[20%] relative shadow-[1px_1px_0_#000]">3,492</div>
                   <div className="bg-neo-yellow neo-border text-[6px] font-black px-1 flex items-center h-3 w-[110%] -ml-[10%] relative shadow-[1px_1px_0_#000]">3,492</div>
                   <div className="bg-neo-yellow neo-border text-[6px] font-black px-1 flex items-center h-3 w-80% relative shadow-[1px_1px_0_#000]">2,328</div>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-neo-off neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[180px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-5 h-5 border-2 border-neo-black rounded-lg"></div>
                   DAILY ORACLE
                 </h2>
                 <div className="flex gap-1">
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              <div className="flex-1 bg-neo-white neo-border rounded p-3 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center bg-neo-pink/10 border border-neo-pink/20 rounded p-1">
                  <span className="text-[8px] font-black uppercase text-neo-pink flex items-center gap-1"><span className="w-1.5 h-1.5 bg-neo-pink rounded-full"></span> STRATEGIC PRIORITIES</span>
                  <span className="text-[8px] font-black opacity-40">0/5</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-neo-off neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[180px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-5 h-5 border-2 border-neo-black rounded-lg"></div>
                   ASK ME
                 </h2>
                 <div className="flex gap-1">
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              <div className="flex-1 bg-neo-white neo-border rounded p-3 flex flex-col gap-2">
                <span className="text-[8px] font-black uppercase text-neo-black/40">QUICK TOPICS</span>
              </div>
            </div>

            <div className="bg-neo-off neo-border-thick rounded-xl p-3 flex flex-col relative w-full h-[180px]">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-black uppercase font-head text-neo-black flex items-center gap-1">
                   <div className="w-5 h-5 border-2 border-neo-black rounded-lg bg-neo-lime"></div>
                   AI JOURNAL
                 </h2>
                 <div className="flex gap-1">
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">?</button>
                   <button className="w-4 h-4 bg-neo-white neo-border rounded flex items-center justify-center text-[10px] font-bold font-mono">-</button>
                 </div>
              </div>
              <div className="flex-1 bg-neo-white neo-border rounded p-2 flex flex-col justify-end gap-1">
                 <div className="flex gap-0.5 justify-between w-full opacity-60">
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">SITE</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">SELF</span>
                   <span className="text-[5px] font-black uppercase bg-neo-cyan text-neo-white border border-neo-cyan rounded-sm px-1 py-0.5">CONTENT</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">STYLE</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">GOALS</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">COMMUNITY</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">PLANS</span>
                   <span className="text-[5px] font-black uppercase border border-neo-black/20 rounded-sm px-1 py-0.5">PROJECTS</span>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
