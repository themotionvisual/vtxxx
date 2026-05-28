import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import { VideoStats } from '../types';
import { useAppContext } from '../AppContext';

const MOCK_VIDEOS: (VideoStats & { description: string, tags: string[], thumbnail: string })[] = [
  { id: 'vid_1', title: 'Building a Fullstack App in 10 Minutes', publishedAt: '2 days ago', views: 45200, ctr: 5.2, avd: '4:15', revenue: 142.50, format: 'long', description: 'A complete speed run of a modern stack.', tags: ['react', 'fullstack', 'speedrun'], thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
  { id: 'vid_2', title: 'The real reason React is changing', publishedAt: '5 days ago', views: 124000, ctr: 8.4, avd: '6:30', revenue: 510.20, format: 'long', description: 'Exploring the architectural shifts in React 19.', tags: ['react', 'frontend', 'architecture'], thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
  { id: 'vid_3', title: '5 Tailwind Tricks you need to know', publishedAt: '1 week ago', views: 8900, ctr: 4.1, avd: '0:45', revenue: 12.00, format: 'shorts', description: 'Quick tailwind tips for daily dev.', tags: ['css', 'tailwind', 'tips'], thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&q=80' },
  { id: 'vid_4', title: 'System Design Interview Prep', publishedAt: '2 weeks ago', views: 320000, ctr: 9.1, avd: '12:20', revenue: 1250.00, format: 'long', description: 'A comprehensive guide to acing system design rounds.', tags: ['system-design', 'interview', 'backend'], thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
  { id: 'vid_5', title: 'Why I stopped using Next.js', publishedAt: '3 weeks ago', views: 245000, ctr: 7.8, avd: '8:45', revenue: 890.30, format: 'long', description: 'My transition away from heavy meta-frameworks.', tags: ['nextjs', 'vite', 'opinions'], thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
];

export function VideoTable() {
  const { isCompact } = useAppContext();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<keyof VideoStats>('views');
  const [dateRange, setDateRange] = useState('30d');

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const sortedData = [...MOCK_VIDEOS].sort((a, b) => {
    if (a[sortCol] < b[sortCol]) return 1;
    if (a[sortCol] > b[sortCol]) return -1;
    return 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1F26] border border-white/5 rounded-lg overflow-hidden flex flex-col h-full"
    >
      <div className={`px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between`}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#E0E0E0]">Video Baseline Analytics</h2>
        <div className="flex gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#0F1115] text-white/80 text-[10px] font-bold border border-white/10 rounded px-2 py-1 uppercase outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="bg-white/5 text-white/60 hover:text-white border border-white/10 p-1.5 rounded flex items-center justify-center transition-all">
            <Filter className={isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1 bg-transparent">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-white/[0.02] border-b border-white/10 text-[10px] uppercase text-white/40 font-bold">
            <tr className={isCompact ? 'h-8' : 'h-10'}>
              <th className="px-4 text-center w-8"></th>
              <th className="px-4 cursor-pointer hover:bg-white/5" onClick={() => setSortCol('title')}>
                <div className="flex items-center gap-1.5">Content <ArrowUpDown className="w-3 h-3 opacity-50"/></div>
              </th>
              <th className="px-4 text-right cursor-pointer hover:bg-white/5" onClick={() => setSortCol('views')}>
                <div className="flex items-center justify-end gap-1.5">Views <ArrowUpDown className="w-3 h-3 opacity-50"/></div>
              </th>
              <th className="px-4 text-right cursor-pointer hover:bg-white/5" onClick={() => setSortCol('ctr')}>
                <div className="flex items-center justify-end gap-1.5">CTR (%) <ArrowUpDown className="w-3 h-3 opacity-50"/></div>
              </th>
              <th className="px-4 text-right cursor-pointer hover:bg-white/5" onClick={() => setSortCol('avd')}>
                <div className="flex items-center justify-end gap-1.5">AVD <ArrowUpDown className="w-3 h-3 opacity-50"/></div>
              </th>
              <th className="px-4 text-right cursor-pointer hover:bg-white/5" onClick={() => setSortCol('revenue')}>
                <div className="flex items-center justify-end gap-1.5">Rev <ArrowUpDown className="w-3 h-3 opacity-50"/></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {sortedData.map((video) => (
              <React.Fragment key={video.id}>
                <tr 
                  onClick={() => toggleRow(video.id)}
                  className={`border-l-2 transition-colors cursor-pointer group hover:bg-white/[0.05] ${video.ctr >= 6.0 ? 'border-l-green-500' : 'border-l-blue-500'} ${expandedRow === video.id ? 'bg-white/[0.03]' : ''} ${isCompact ? 'h-10' : 'h-12'}`}
                >
                  <td className="px-2 text-center text-white/20">
                    <ChevronRight className={`w-4 h-4 mx-auto transition-transform ${expandedRow === video.id ? 'rotate-90 text-white' : 'group-hover:text-white/60'}`} />
                  </td>
                  <td className="px-4">
                    <div className={`font-bold text-white line-clamp-1`}>{video.title}</div>
                    {!isCompact && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] opacity-40 font-mono italic">{video.publishedAt}</span>
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white/60">
                          {video.format}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className={`px-4 text-right font-mono font-medium text-white`}>
                    {video.views.toLocaleString()}
                  </td>
                  <td className={`px-4 text-right font-mono font-medium ${video.ctr >= 6.0 ? 'text-green-400' : 'text-blue-400'}`}>
                    {video.ctr.toFixed(1)}%
                  </td>
                  <td className={`px-4 text-right font-mono font-medium text-white`}>
                    {video.avd}
                  </td>
                  <td className={`px-4 text-right font-mono font-medium text-white`}>
                    ${video.revenue.toFixed(2)}
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRow === video.id && (
                    <tr>
                      <td colSpan={6} className="p-0 border-none bg-black/20">
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-b border-white/10"
                        >
                          <div className={`flex gap-6 ${isCompact ? 'px-4 py-3' : 'px-8 py-5'}`}>
                            <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover rounded border border-white/10" />
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Video Insight</h4>
                              <p className="text-sm mb-3 text-white/80">{video.description}</p>
                              <div className="flex gap-2">
                                {video.tags.map(tag => (
                                  <span key={tag} className="text-[9px] font-mono font-bold uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">#{tag}</span>
                                ))}
                              </div>
                            </div>
                            <div className="w-48 bg-white/5 border border-white/10 rounded p-3 text-[10px] uppercase tracking-widest font-bold flex flex-col justify-center">
                              <div className="flex justify-between mb-2">
                                <span className="opacity-40">Status</span>
                                <span className="text-green-400">Public</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-40">Category</span>
                                <span className="text-white">Education</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
