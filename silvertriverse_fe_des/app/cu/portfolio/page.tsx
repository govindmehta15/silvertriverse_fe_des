'use client';

import React from 'react';
import Link from 'next/link';
import { collectibleUnits } from '../../lib/data';

export default function CUPortfolio() {
  const holdings = collectibleUnits
    .filter(u => u.phase === 'trading')
    .map(u => ({
        name: u.title,
        type: "CU",
        id: `#${u.id}-MOCK`,
        value: `${u.tokenPrice} INR`,
        pnl: u.currentROI,
        image: u.banner
    }));

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between items-start gap-12">
        <div className="space-y-6">
           <Link href="/cu" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← CU HUB</Link>
           <h1 className="text-6xl font-black italic gold-text serif uppercase">MY PORTFOLIO</h1>
           <p className="max-w-xl text-lg text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide">
             The secure vault of your metropolis assets. Tracking yield, performance, and utility capacity.
           </p>
        </div>
        
        <div className="flex gap-6 w-full md:w-auto">
           <div className="luxury-glass px-12 py-8 border-gold/10 hover:border-gold/30 transition-all">
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">TOTAL VALUE</span>
              <span className="text-4xl font-black text-white italic serif gold-text">2.24 ETH</span>
           </div>
           <div className="luxury-glass px-12 py-8 border-emerald-500/10 hover:border-emerald-500/30 transition-all">
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">P/L RATIO</span>
              <span className="text-4xl font-black text-emerald-400 italic serif tracking-widest">+15.2%</span>
           </div>
        </div>
      </header>

      {/* Holdings List (Digital Shelf Style) */}
      <div className="space-y-12 mb-24">
         <div className="mb-12 border-b border-white/5 pb-10 flex items-center justify-between">
            <h2 className="text-3xl font-black text-white italic serif uppercase tracking-tight">Vanguard Fleet</h2>
            <div className="flex gap-4">
               <button className="px-6 py-2 luxury-glass text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-gold transition-colors">Withdraw</button>
               <button className="px-6 py-2 bg-gold text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Deploy Gear</button>
            </div>
         </div>
         
         <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {holdings.map((h, i) => (
               <div key={i} className="luxury-glass group border-gold/5 flex h-48 overflow-hidden rounded-[32px] transition-all hover:border-gold/30 hover:shadow-2xl">
                  <div className="aspect-square h-full bg-zinc-950 overflow-hidden relative">
                     <img src={h.image} alt="" className="h-full w-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-black text-white serif italic uppercase truncate">{h.name}</h3>
                           <span className={`text-[9px] font-black font-mono tracking-widest ${h.pnl.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{h.pnl}</span>
                        </div>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{h.id}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-600">UNIT VALUE</span>
                        <span className="text-white">{h.value}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Utility-Ready Assets (Secondary shelf) */}
      <section className="mt-40">
        <div className="mb-12 border-b border-gold/10 pb-10">
           <h2 className="text-2xl font-black text-white italic serif uppercase tracking-tight">Utility Ready Assets</h2>
           <p className="text-[10px] font-black text-gold/40 uppercase tracking-[0.5em] mt-4">READY FOR DEPLOYMENT IN WORLD PILLAR</p>
        </div>
        
        <div className="luxury-glass p-0 border-gold/10 overflow-hidden group">
           <div className="p-12 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between items-start gap-8">
              <div className="flex items-center gap-8">
                 <div className="h-20 w-20 luxury-glass gold-border p-1 rounded-2xl flex-shrink-0 animate-pulse">
                    <div className="h-full w-full rounded-xl bg-zinc-900 border border-gold/10 flex items-center justify-center">
                       🏛️
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white italic serif uppercase">LEGACY_CORE_v1</h4>
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mt-2 block">POWER OUTPUT :: 1,400 kW</span>
                 </div>
              </div>
              <button className="h-14 px-12 bg-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-2xl">
                 DEPLOY TO DISTRICT_07
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
