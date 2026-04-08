'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CUDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a single Collectible Unit detail
  // Unwrap params using React.use for Next.js 15+ standards
  const resolvedParams = React.use(params as any) as any;
  const assetId = resolvedParams.id;
  
  const [utilityState, setUtilityState] = useState<string | null>(null);

  const asset = {
     name: assetId.replace('%20', ' ') || 'METROPOLIS_CORE',
     origin: "Phase 1 Algorithmic Genesis",
     narrative: "This collectible represents the foundational architecture of the Metropolis. Owning this directly impacts your ability to construct high-tier structures in the Digital Land pillar.",
     totalSupply: 50,
     currentPrice: "25.20 ETH",
     category: "BRAND",
     utilities: [
        { id: "u1", type: "LAND_CONSTRUCTION", effect: "+15% Construction Speed", validity: "LIFECYCLE" },
        { id: "u2", type: "THEATRE_BUILD", effect: "Unlocks IMAX-tier resolution", validity: "LIFECYCLE" },
        { id: "u3", type: "ENGAGEMENT_BOOST", effect: "2x Reelity algorithm reach", validity: "30 DAYS" }
     ]
  };

  return (
    <div className="w-full min-h-screen p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-white/5 pb-12">
         <div>
            <Link href="/cu" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← CU CENTRAL</Link>
            <h1 className="text-5xl md:text-7xl font-black italic text-white serif uppercase mt-6 mb-4">{asset.name}</h1>
            <div className="flex gap-4">
               <span className="px-5 py-2 luxury-glass border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                  CATEGORY: {asset.category}
               </span>
               <span className="px-5 py-2 luxury-glass border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                  SUPPLY: {asset.totalSupply}
               </span>
            </div>
         </div>
         <div className="text-right">
            <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">CURRENT SECONDARY VALUATION</span>
            <span className="text-5xl font-black italic gold-text serif tracking-tighter">{asset.currentPrice}</span>
            <div className="mt-4">
               <Link href="/cu/exchange" className="inline-block px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-full hover:bg-gold transition-all">
                  TRADE ON EXCHANGE →
               </Link>
            </div>
         </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
         {/* METADATA BLOCK */}
         <div className="space-y-12">
            <div className="aspect-[21/9] bg-zinc-950 rounded-[40px] overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/90 via-transparent" />
            </div>

            <div className="luxury-glass p-12 rounded-[40px] space-y-8 border-gold/10">
               <h3 className="text-[12px] font-black text-gold uppercase tracking-[0.6em] border-b border-gold/10 pb-6">ASSET METADATA</h3>
               <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">ORIGIN PROTOCOL</span>
                  <p className="text-white font-serif italic text-xl">{asset.origin}</p>
               </div>
               <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">INTEGRATED NARRATIVE</span>
                  <p className="text-zinc-300 font-serif italic text-lg leading-relaxed">{asset.narrative}</p>
               </div>
            </div>
         </div>

         {/* UTILITY ENGINE */}
         <div className="space-y-8">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-[40px]">
               <h3 className="text-2xl font-black italic text-emerald-400 serif uppercase mb-2">UTILITY ENGINE</h3>
               <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Applying utility broadcasts event to ecosystem</p>
            </div>

            <div className="space-y-4">
               {asset.utilities.map(u => (
                  <div key={u.id} className="luxury-glass p-8 border-white/5 rounded-3xl hover:border-gold/30 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{u.type}</span>
                        <span className="px-3 py-1 bg-white/5 text-zinc-400 text-[8px] font-black uppercase tracking-widest rounded-full">{u.validity}</span>
                     </div>
                     <p className="text-lg text-white font-serif italic mb-8">{u.effect}</p>
                     
                     {utilityState === u.id ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.4em]">
                           UTILITY APPLIED SUCCCESSFULLY
                        </div>
                     ) : (
                        <button 
                           onClick={() => setUtilityState(u.id)}
                           className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all"
                        >
                           INITIALIZE UTILITY
                        </button>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
