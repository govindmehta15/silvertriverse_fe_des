'use client';

import React from 'react';
import Link from 'next/link';

export default function CUInsights() {
  const topGainers = [
     { name: "METROPOLIS_CORE", cap: "12,450 ETH", change: "+14.2%" },
     { name: "THEATRE_NODE_01", cap: "8,200 ETH", change: "+11.8%" },
     { name: "VANGUARD_SUIT", cap: "4,100 ETH", change: "+5.4%" },
  ];

  return (
    <div className="w-full min-h-screen p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
         <div className="space-y-6">
            <Link href="/cu" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← CU CENTRAL</Link>
            <h1 className="text-5xl md:text-7xl font-black italic gold-text serif uppercase mt-6 mb-4">MARKET INTELLIGENCE</h1>
            <p className="max-w-xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 border-l-2 border-gold/10">
              Aggregated real-time metrics of the entire Silvertriverse Economy. Derived directly from trading exchange events.
            </p>
         </div>
      </header>

      {/* CORE METRICS (INDEX & CAP) */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
         <div className="luxury-glass p-12 border-gold/20 rounded-[40px] relative overflow-hidden group hover:border-gold/50 transition-all">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614729939124-032f0b5689ce?w=800&q=80')] bg-cover opacity-10 mix-blend-screen transition-transform duration-1000 group-hover:scale-110" />
            <div className="relative z-10 space-y-4">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
               </span>
               <h3 className="text-2xl font-black text-white italic serif uppercase">SILVER_TRIVERSE INDEX</h3>
               <p className="text-sm text-zinc-400 font-serif italic max-w-sm mb-6">Weighted average of price variants across all verified collectible assets.</p>
               <div className="pt-8 border-t border-white/10 flex items-end justify-between">
                  <div>
                     <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">INDEX RATING</span>
                     <span className="text-6xl font-black text-white italic serif">4,812.4</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-500 italic serif">+112.8 (2.4%)</span>
               </div>
            </div>
         </div>

         <div className="luxury-glass p-12 border-white/10 rounded-[40px] relative overflow-hidden group hover:border-gold/30 transition-all">
            <div className="relative z-10 space-y-4">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.6em]">AGGREGATED VALUE</span>
               <h3 className="text-2xl font-black text-white italic serif uppercase">TOTAL MARKET CAPITALIZATION</h3>
               <p className="text-sm text-zinc-400 font-serif italic max-w-sm mb-6">Σ (Last Price × Total Supply). The absolute valuation of the digital ecosystem.</p>
               <div className="pt-8 border-t border-white/10">
                  <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">GLOBAL MARKET CAP</span>
                  <span className="text-6xl font-black gold-text italic serif tracking-tighter">184,882.5 ETH</span>
               </div>
               {/* Mock Graph */}
               <div className="mt-8 h-20 w-full flex items-end gap-1 opacity-50">
                  {[20,30,45,35,50,60,55,70,85,90,95,100].map((v, i) => (
                     <div key={i} className="flex-1 bg-gold/50 rounded-t-sm transition-all hover:bg-gold" style={{ height: `${v}%` }} />
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* TOP ASSETS TABLE */}
      <div className="luxury-glass rounded-[40px] border border-white/5 overflow-hidden">
         <div className="p-8 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em]">TOP LIQUID ASSETS</span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">24H SNAPSHOT</span>
         </div>
         <div className="p-4">
            <div className="grid grid-cols-12 gap-4 p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <span className="col-span-1">RANK</span>
               <span className="col-span-5">ASSET IDENTIFIER</span>
               <span className="col-span-3 text-right">MARKET CAP</span>
               <span className="col-span-3 text-right">24H CHANGE</span>
            </div>
            
            {topGainers.map((asset, i) => (
               <Link href={`/cu/${asset.name}`} key={asset.name} className="grid grid-cols-12 gap-4 p-4 items-center text-sm border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="col-span-1 text-gold font-black italic serif text-lg">{i+1}</span>
                  <span className="col-span-5 font-black text-white italic serif group-hover:text-gold transition-colors">{asset.name}</span>
                  <span className="col-span-3 text-right text-zinc-300 font-mono">{asset.cap}</span>
                  <span className="col-span-3 text-right text-emerald-400 font-black italic serif drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">{asset.change}</span>
               </Link>
            ))}
         </div>
      </div>
    </div>
  );
}
