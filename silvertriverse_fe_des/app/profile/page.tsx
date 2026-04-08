'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts'|'shelf'|'portfolio'|'land'|'settings'>('shelf');

  const shelfItems = [
    { name: "Vanguard Core", category: "CU ASSET", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80" },
    { name: "ZYWH Parka v.0.9", category: "MERCH OWNED", image: "https://images.unsplash.com/photo-1539109132332-629ee3e87049?w=400&q=80" },
    { name: "Nexus Droid", category: "COLLECTIBLE", image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&q=80" },
    { name: "Epic Relic #07", category: "COLLECTIBLE", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80" },
  ];

  const portfolioHoldings = [
    { type: "OURS Share Value", amount: "4.82 ETH", delta: "+12.4%" },
    { type: "CU Holdings", amount: "14 Units", delta: "Active" },
    { type: "Distro Rewards", amount: "0.41 ETH", delta: "+2.1%" },
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40 lg:h-full lg:overflow-hidden lg:flex lg:flex-col lg:pb-0">
      
      {/* Royal Header */}
      <header className="mb-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 lg:flex-shrink-0">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-12 text-center md:text-left">
           <div className="relative h-48 w-48 group shrink-0">
              <div className="absolute inset-0 bg-gold/30 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative h-full w-full rounded-full gold-border p-2 overflow-hidden luxury-glass">
                 <div className="h-full w-full rounded-full bg-royal-blue overflow-hidden border border-gold/10">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop" alt="Profile" className="h-full w-full object-cover grayscale opacity-60 hover:opacity-100 transition-all duration-1000" />
                 </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-black px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl whitespace-nowrap">
                 ELITE VANGUARD
              </div>
           </div>
           
           <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic serif gold-text leading-none">
                 LEGACY_01
              </h1>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.6em] uppercase">
                 TRIVERSE_ESTATE :: 8822-109X-B
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                 <button className="px-6 py-2 luxury-glass border-gold/20 text-gold text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold hover:text-black transition-colors">EDIT PROFILE</button>
                 <button className="px-6 py-2 luxury-glass border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-colors">SHARE</button>
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 lg:gap-8 w-full md:w-auto">
           <div className="luxury-glass px-8 py-6 border-gold/10 text-center">
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Net Worth</span>
              <span className="text-2xl font-black text-white italic serif tracking-widest">12.4E</span>
           </div>
           <div className="luxury-glass px-8 py-6 border-gold/10 text-center">
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Followers</span>
              <span className="text-2xl font-black text-white italic serif tracking-widest">14.2K</span>
           </div>
        </div>
      </header>

      {/* Sub-Navigation Hub */}
      <nav className="mb-12 flex items-center justify-start gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-gold/10 lg:flex-shrink-0">
         {[
            { id: 'posts', label: 'POSTS' },
            { id: 'shelf', label: 'DIGITAL SHELF' },
            { id: 'portfolio', label: 'PORTFOLIO' },
            { id: 'land', label: 'LAND HOLDINGS' },
            { id: 'settings', label: 'SETTINGS' }
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                     ? 'bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                     : 'text-zinc-500 hover:text-gold hover:bg-gold/5'
               }`}
            >
               {tab.label}
            </button>
         ))}
      </nav>

      {/* Dynamic Content Area */}
      <div className="lg:flex-1 lg:overflow-y-auto no-scrollbar relative">
         
         {/* --- DIGITAL SHELF --- */}
         {activeTab === 'shelf' && (
            <div className="animate-fade-in">
               <div className="mb-8 flex items-end justify-between">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-white uppercase italic tracking-tight serif">THE DIGITAL SHELF</h2>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">PROJECTION OF SOVEREIGN GEAR & ASSETS</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {shelfItems.map((item, i) => (
                    <div key={i} className="luxury-glass group overflow-hidden border-gold/5 transition-all hover:border-gold/30 rounded-[30px]">
                       <div className="aspect-square bg-zinc-950 overflow-hidden relative">
                          <img src={item.image} alt="" className="h-full w-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-royal-blue via-transparent opacity-80" />
                          
                          <div className="absolute top-6 right-6">
                             <span className="px-4 py-1 luxury-glass bg-gold/10 text-gold text-[8px] font-black uppercase tracking-[0.4em] rounded-full border-gold/20 backdrop-blur-md">
                                {item.category}
                             </span>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 right-6">
                             <span className="text-xl font-black text-white uppercase serif italic truncate block mb-4">{item.name}</span>
                             <button className="w-full py-3 luxury-glass border-white/20 text-[9px] text-white uppercase font-black tracking-widest rounded-xl hover:bg-white hover:text-black transition-colors">
                                View Artifact
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         )}

         {/* --- PORTFOLIO --- */}
         {activeTab === 'portfolio' && (
            <div className="space-y-12 animate-fade-in">
               <div className="mb-8 flex items-end justify-between">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-white uppercase italic tracking-tight serif">FINANCIAL PORTFOLIO</h2>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.4em]">LIVE MARKET METRICS & YIELD</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {portfolioHoldings.map((h, i) => (
                     <div key={i} className="luxury-glass p-12 border-gold/10 hover:border-gold/30 transition-all rounded-[40px] relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 text-[120px] font-black text-white/5 group-hover:text-gold/5 pointer-events-none serif transition-colors duration-1000">0{i+1}</div>
                        <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-4 relative z-10">{h.type}</span>
                        <span className="text-5xl font-black text-white italic serif gold-text relative z-10 block mb-6">{h.amount}</span>
                        <div className="flex items-center gap-3 relative z-10">
                           <span className="px-4 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[9px] font-black tracking-widest">{h.delta}</span>
                           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">30D TREND</span>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="luxury-glass p-12 rounded-[40px] border-gold/10 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-white uppercase italic serif mb-2">PORTFOLIO SYNC</h3>
                     <p className="text-xs text-zinc-500 font-mono tracking-widest">Connect external wallets to unify sovereign holdings.</p>
                  </div>
                  <button className="px-10 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-full hover:bg-gold transition-colors">
                     Connect Ledger
                  </button>
               </div>
            </div>
         )}
         
         {/* --- EMPTY STATES FOR OTHER TABS --- */}
         {(activeTab === 'posts' || activeTab === 'land' || activeTab === 'settings') && (
            <div className="flex flex-col items-center justify-center p-20 luxury-glass rounded-[40px] border-gold/5 border-dashed h-96 animate-fade-in group hover:border-gold/30 transition-all">
               <div className="h-20 w-20 rounded-full bg-gold/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold/50 tracking-tighter">◬</span>
               </div>
               <h3 className="text-3xl font-black text-white italic serif uppercase mb-4 opacity-50 group-hover:opacity-100 group-hover:gold-text transition-all">
                  {activeTab} MODULE OFFLINE
               </h3>
               <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 font-black">
                  WAITING ON METROPOLIS SECONARY PHASE UNLOCK
               </p>
            </div>
         )}
      </div>
    </div>
  );
}
