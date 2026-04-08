'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Simple Grid size for the 2D Land
const GRID_SIZE = 30; // 30x30 = 900 plots for good performance vs density

export default function WorldPage() {
  const [activeTab, setActiveTab] = useState<'MAP' | 'TOWNSHIP' | 'CONSTRUCTION'>('MAP');
  
  // Interactive 2D Map State
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  // Generate deterministic mock ownership for the map
  const mockGridData = useMemo(() => {
     const data = [];
     for(let i=0; i<GRID_SIZE*GRID_SIZE; i++) {
        // District logic
        let district = 'UNKNOWN';
        if (i < 300) district = 'NEXUS_ZONE';
        else if (i > 600) district = 'DISTRICT_07';
        else district = 'METROPOLIS_CENTRAL';

        // Ownership logic
        const isOwned = (i % 7 === 0) || (i % 11 === 0);
        const owner = isOwned ? (i % 2 === 0 ? 'USER_AETHER' : 'KUBRICK_ARCHIVE') : null;
        
        data.push({
           id: i,
           x: i % GRID_SIZE,
           y: Math.floor(i / GRID_SIZE),
           isOwned,
           owner,
           district,
           price: isOwned ? null : '12.4 ETH'
        });
     }
     return data;
  }, []);

  const regions = [
    { name: 'DISTRICT_07', status: 'IN PROGRESS', progress: 64, build: 'METROPOLIS THEATRE HQ', power: 420 },
    { name: 'METROPOLIS_CENTRAL', status: 'STAGED', progress: 12, build: 'NEURAL GRID', power: 150 },
    { name: 'NEXUS_ZONE', status: 'LOCKED', progress: 0, build: 'LEGACY CORE', power: 0 },
  ];

  const availableCUs = [
     { id: 'CU-892A', name: 'METROPOLIS_CORE', effect: '+15% Construction Speed', type: 'LAND_CONSTRUCTION' },
     { id: 'CU-111B', name: 'IMAX DIRECTORS CHAIR', effect: 'Unlocks IMAX-tier resolution', type: 'THEATRE_BUILD' }
  ];

  const activePlotData = selectedPlot !== null ? mockGridData[selectedPlot] : null;

  return (
    <div className="w-full min-h-screen p-6 md:p-12 lg:p-20 max-w-[1400px] mx-auto pb-40">
      <header className="mb-16 space-y-8 border-b border-white/5 pb-12">
        <div className="flex items-center gap-4 text-gold text-[10px] font-black uppercase tracking-[0.5em]">
          <span className="h-[2px] w-16 bg-gold" />
          INTERACTIVE METROPOLIS GRID
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter gold-text leading-none uppercase serif italic">
          THE WORLD
        </h1>
        <p className="max-w-2xl text-xl text-zinc-500 font-medium italic leading-relaxed serif tracking-wide">
          The physical manifestation of the SilverTriverse sovereignty. Construct your Township, utilize your Collectible Units (CUs) for architectural dominance, and broadcast your progress to the ecosystem.
        </p>

        {/* Global Navigation Hub (Cross-Navigation Flows) */}
        <div className="flex flex-wrap gap-4 pt-4">
           {['MAP', 'TOWNSHIP', 'CONSTRUCTION'].map(tab => (
              <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${activeTab === tab ? 'bg-gold text-black shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'luxury-glass text-zinc-500 border border-white/5 hover:text-white'}`}
              >
                 {tab}
              </button>
           ))}
        </div>
      </header>

      {/* --- WORLD MAP VIEW (2D GRID SYSTEM) --- */}
      {activeTab === 'MAP' && (
         <div className="animate-fade-in grid lg:grid-cols-[1fr_400px] gap-8">
            
            {/* 2D Interactive Grid */}
            <div className="luxury-glass p-4 bg-zinc-950 border-gold/10 relative overflow-hidden rounded-[40px] shadow-[0_0_50px_rgba(212,175,55,0.05)]">
               <div className="w-full aspect-square overflow-auto no-scrollbar relative rounded-[30px] border border-white/5">
                  <div 
                     className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')] bg-cover bg-center grayscale opacity-10 pointer-events-none" 
                  />
                  
                  <div 
                     className="w-full h-full min-w-[600px] min-h-[600px] grid relative z-10"
                     style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                  >
                     {mockGridData.map((plot) => (
                        <div 
                           key={plot.id}
                           onClick={() => setSelectedPlot(plot.id)}
                           className={`
                              border-[0.5px] border-white/[0.03] transition-all duration-200 cursor-pointer
                              ${selectedPlot === plot.id ? 'bg-gold/50 border-gold z-20 scale-110 shadow-[0_0_20px_rgba(212,175,55,0.5)]' : ''}
                              ${plot.isOwned ? 'bg-emerald-500/10 hover:bg-emerald-500/40' : 'hover:bg-gold/20'}
                           `}
                           title={`Plot [${plot.x}, ${plot.y}]`}
                        >
                           {/* Add tiny visual markers for owned plots */}
                           {plot.isOwned && <div className="w-full h-full bg-emerald-500/20" />}
                        </div>
                     ))}
                  </div>
               </div>
               <div className="mt-6 flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">
                  <span>{GRID_SIZE}x{GRID_SIZE} DIGITAL TOPOGRAPHY</span>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500/20 block" /> OWNED</span>
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-transparent border border-white/20 block" /> AVAILABLE</span>
                  </div>
               </div>
            </div>

            {/* Plot Information Panel */}
            <div className="space-y-6">
               {activePlotData ? (
                  <div className="luxury-glass p-8 rounded-[40px] border border-gold/20 shadow-xl bg-royal-blue/90 w-full animate-fade-in relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl">✦</div>
                     
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] block mb-2">
                        {activePlotData.district}
                     </span>
                     <h3 className="text-4xl font-black text-white italic serif uppercase mb-8">
                        PLOT [{activePlotData.x}, {activePlotData.y}]
                     </h3>
                     
                     <div className="space-y-6">
                        <div className="pb-6 border-b border-white/10">
                           <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">OWNERSHIP STATUS</span>
                           {activePlotData.isOwned ? (
                              <div>
                                 <span className="text-xl font-serif italic text-emerald-400">CLAIMED</span>
                                 <p className="text-xs font-black text-white uppercase tracking-widest mt-2">Owner: {activePlotData.owner}</p>
                              </div>
                           ) : (
                              <span className="text-xl font-serif italic text-gold">AVAILABLE FOR MINT</span>
                           )}
                        </div>
                        
                        {!activePlotData.isOwned ? (
                           <div className="pt-4">
                              <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">CURRENT VALUATION</span>
                              <span className="text-3xl font-black text-white italic serif">{activePlotData.price}</span>
                              <button className="w-full mt-8 py-4 bg-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
                                 ACQUIRE LAND NODE
                              </button>
                           </div>
                        ) : (
                           <div className="pt-4">
                              <Link 
                                 href={`/profile/${activePlotData.owner}`}
                                 className="block w-full py-4 bg-white/5 border border-white/10 text-white text-center rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gold hover:text-black hover:border-gold transition-colors"
                              >
                                 VISIT OWNER PROFILE
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               ) : (
                  <div className="luxury-glass p-8 rounded-[40px] border border-white/5 text-center flex flex-col items-center justify-center h-64 text-zinc-500">
                     <span className="text-3xl mb-4">⚲</span>
                     <p className="text-xs font-black uppercase tracking-widest">Select a plot from the grid to view topological data</p>
                  </div>
               )}

               <div className="luxury-glass p-8 border-white/5 rounded-[40px]">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">REGIONAL PROGRESS</h4>
                  <div className="space-y-6">
                     {regions.map((r, i) => (
                        <div key={i}>
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black text-white uppercase tracking-tighter serif italic">{r.name}</span>
                              <span className="text-[8px] font-black text-emerald-400">{r.progress}%</span>
                           </div>
                           <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400" style={{ width: `${r.progress}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* --- TOWNSHIP / CONSTRUCTION VIEW --- */}
      {(activeTab === 'TOWNSHIP' || activeTab === 'CONSTRUCTION') && (
         <div className="animate-fade-in grid lg:grid-cols-[1fr_400px] gap-12">
            
            {/* CONSTRUCTION HQ */}
            <div className="space-y-8">
               <div className="aspect-video bg-zinc-950 rounded-[40px] overflow-hidden relative luxury-glass border border-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                  <img src="https://images.unsplash.com/photo-1541888086438-e4b2d5d83626?w=1200&q=80" alt="Township" className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/90 via-royal-blue/20 to-transparent" />
                  <div className="absolute bottom-12 left-12">
                     <span className="px-5 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl mb-4 inline-block">
                        LEVEL 4 TOWNSHIP
                     </span>
                     <h2 className="text-6xl font-black text-white italic serif uppercase">DISTRICT 07 HQ</h2>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="luxury-glass p-8 border-gold/10">
                     <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">TOWNSHIP POWER</span>
                     <span className="text-4xl font-black text-white italic serif">420 TP</span>
                  </div>
                  <div className="luxury-glass p-8 border-gold/10">
                     <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">ACTIVE STRUCTURES</span>
                     <span className="text-4xl font-black text-white italic serif">12 / 50</span>
                  </div>
               </div>
            </div>

            {/* COLLECTIBLE USAGE TERMINAL (UTILITY ENGINE SYNC) */}
            <div className="luxury-glass p-8 rounded-[40px] border border-white/5 space-y-8">
               <div>
                  <h3 className="text-[12px] font-black text-gold uppercase tracking-[0.6em] mb-2">CU UTILITY TERMINAL</h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                     Inject your owned Collectible Units from your Digital Shelf to accelerate construction.
                  </p>
               </div>

               <div className="space-y-4">
                  {availableCUs.map(cu => (
                     <div key={cu.id} className="p-6 bg-zinc-900 border border-white/5 hover:border-gold/30 rounded-3xl transition-all group">
                        <div className="mb-4">
                           <h4 className="text-sm font-black text-white uppercase italic serif group-hover:text-gold transition-colors">{cu.name}</h4>
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] block mt-1">{cu.type}</span>
                        </div>
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl mb-6">
                           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{cu.effect}</span>
                        </div>
                        <button 
                           className="w-full py-4 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gold hover:text-black transition-all"
                           onClick={() => alert(`Broadcasting UTILITY_USED event for ${cu.name}. Construction sped up! Syncing with Feed Engine...`)}
                        >
                           INJECT UTILITY TO LAND
                        </button>
                     </div>
                  ))}
               </div>

               {/* Cross-Navigation Hook: Feed Update */}
               <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mb-6">
                     Applying utility will automatically broadcast your Township progress to the Reelity Feed.
                  </p>
                  <Link href="/" className="block w-full py-4 bg-transparent border border-white/20 text-white text-center rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all">
                     RETURN TO REELITY FEED
                  </Link>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
