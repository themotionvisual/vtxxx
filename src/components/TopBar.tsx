import { RefreshCw, Search, Maximize2, Minimize2, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { useState } from 'react';
import { googleSignIn, getAccessToken } from '../authSession';

export function TopBar() {
  const { isCompact, setIsCompact } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleSheetsExport = async () => {
    setIsExporting(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const result = await googleSignIn();
        token = result?.accessToken || null;
      }
      
      if (token) {
        // Mock export functionality
        setToastMessage('Exported to Google Sheets successfully!');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
      setToastMessage('Failed to authenticate with Google.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className={`border-b-4 border-neo-black flex items-center justify-between px-4 bg-neo-white transition-all relative ${isCompact ? 'h-14' : 'h-16'}`}>
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-neo-lime neo-border text-neo-black px-4 py-2 rounded-full flex items-center gap-2 z-50 font-bold text-xs uppercase"
          >
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-black tracking-tight uppercase font-head">
          <span className="text-neo-black">VIEW</span>
          <span className="text-neo-cyan">TUBE</span>
        </h1>
        <button 
          onClick={() => setIsCompact(!isCompact)}
          className="flex items-center gap-2 px-3 py-1 bg-neo-white neo-border-thick rounded-md font-bold text-[10px] uppercase tracking-wider hover:bg-neo-gray transition-colors"
        >
          {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          HIDE NAV
        </button>
      </div>

      {/* Middle Banner */}
      <div className="hidden lg:flex flex-col neo-border-thick rounded-lg px-4 py-1.5 min-w-[400px]">
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">TURN CHANNEL DATA INTO CLEAR GROWTH ACTIONS</span>
        <span className="text-[8px] font-bold uppercase text-neo-black/60 tracking-wider mb-1">CONNECT, SYNC, THEN LAUNCH YOUR FIRST OPTIMIZED WORKFLOW IN MINUTES.</span>
        <div className="flex gap-1 h-3 mt-1">
          <div className="bg-neo-lime neo-border text-[6px] font-black flex items-center px-1 flex-1 uppercase">DAILY GROWTH SIGNALS</div>
          <div className="bg-neo-cyan neo-border text-[6px] font-black flex items-center px-1 flex-1 uppercase">AI CONTENT TOOLS</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <button className="px-3 py-1 bg-neo-lime neo-border-thick rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#00e600] transition-colors neo-shadow-hover h-8 flex items-center justify-center">
            CONNECT CHANNEL
          </button>
          <button className="px-3 py-1 bg-neo-yellow neo-border-thick rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#e6cc00] transition-colors neo-shadow-hover h-8 flex items-center justify-center">
            JOIN
          </button>
        </div>

        <div className="flex items-center gap-2 neo-border-thick rounded-lg px-2 h-[68px] bg-neo-white">
          <div className="w-8 h-8 rounded-full neo-border flex items-center justify-center bg-neo-off">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase leading-tight">NOT CONNECTED</span>
            <span className="text-[7px] font-bold uppercase leading-tight text-neo-black/60">NOT CONNECTED</span>
            <span className="text-[7px] font-bold uppercase leading-tight text-neo-black/60">NOT CONNECTED</span>
          </div>
        </div>

        <div className="flex flex-col neo-border-thick rounded-lg px-3 justify-center h-[68px] bg-neo-white min-w-[120px]">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-black uppercase">BASIC</span>
            <span className="text-[10px] font-black uppercase">0 CREDITS</span>
          </div>
          <div className="w-full h-2 neo-border rounded-full mt-1"></div>
        </div>

        <button className="bg-neo-yellow neo-border-thick rounded-lg font-black text-xs uppercase px-3 h-[68px] hover:bg-[#e6cc00] transition-colors neo-shadow-hover">
          MENU
        </button>
      </div>
    </header>
  );
}
