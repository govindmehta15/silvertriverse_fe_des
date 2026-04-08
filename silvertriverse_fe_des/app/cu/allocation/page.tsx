'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { collectibleUnits } from '../../lib/data';

export default function CUAllocation() {
  const [biddingState, setBiddingState] = useState<'idle' | 'mandate' | 'processing' | 'allocated'>('idle');

  const liveAllocations = collectibleUnits
    .filter(u => u.phase === 'entry' || u.phase === 'bidding')
    .map(u => ({
        id: `ALC-${u.id}`,
        name: u.title.toUpperCase(),
        category: u.category.toUpperCase(),
        totalSupply: u.totalTokens,
        basePrice: `${u.tokenPrice} INR`,
        endTime: u.phase === 'entry' ? 'OPENING SOON' : '2h 15m',
        image: u.banner
    }));

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-20">
         <Link href="/cu" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← CU CENTRAL</Link>
         <h1 className="text-5xl md:text-7xl font-black italic gold-text serif uppercase mt-6 mb-4">ALLOCATION ENGINE</h1>
         <p className="max-w-2xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 border-l-2 border-gold/10">
           The primary issuance market for Collectible Units. Supply is strictly fixed. Register a mandate. If demand outpaces supply, the algorithm determines holders.
         </p>
      </header>

      <div className="space-y-12">
         {liveAllocations.map(event => (
            <div key={event.id} className="luxury-glass p-8 md:p-12 border-gold/10 rounded-[40px] flex flex-col lg:flex-row gap-12 group hover:border-gold/30 transition-all duration-700">
               <div className="lg:w-1/3 aspect-square rounded-[30px] overflow-hidden relative bg-zinc-950">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/90 via-transparent" />
                  <span className="absolute top-6 left-6 px-4 py-2 bg-gold/10 text-gold border border-gold/20 text-[8px] font-black uppercase tracking-[0.5em] rounded-full">
                     {event.category}
                  </span>
               </div>
               
               <div className="flex-1 space-y-10 flex flex-col justify-between">
                  <div>
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] mb-2 block animate-pulse">LIVE BIDDING WINDOW</span>
                     <h2 className="text-4xl lg:text-5xl font-black text-white italic serif uppercase">{event.name}</h2>
                     <p className="text-zinc-500 text-sm mt-2">EVENT_ID: {event.id}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                     <div>
                        <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">BASE ASSET PRICE</span>
                        <span className="text-2xl font-black text-white italic serif">{event.basePrice}</span>
                     </div>
                     <div>
                        <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">FIXED SUPPLY</span>
                        <span className="text-2xl font-black text-white italic serif">{event.totalSupply} UNITS</span>
                     </div>
                     <div>
                        <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">T-MINUS</span>
                        <span className="text-2xl font-black text-emerald-400 italic serif">{event.endTime}</span>
                     </div>
                  </div>

                  {biddingState === 'idle' && (
                     <button 
                        onClick={() => setBiddingState('mandate')}
                        className="h-20 w-full bg-gold text-black rounded-[40px] font-black text-[12px] uppercase tracking-[0.6em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                     >
                        REGISTER BID MANDATE
                     </button>
                  )}
                  {biddingState === 'mandate' && (
                     <div className="p-8 luxury-glass border border-gold/30 rounded-[30px] space-y-6">
                        <div className="flex items-center gap-4 text-rose-500">
                           <span className="text-xl">⚠️</span>
                           <h4 className="text-xs font-black uppercase tracking-[0.3em]">FUND BLOCKING AUTHORIZATION</h4>
                        </div>
                        <p className="text-sm text-zinc-400 italic serif">
                           By placing a bid, {event.basePrice} will be blocked in your mandate system. At the end of the allocation loop, the engine will either execute the trade and distribute the CU, or release your funds if supply is exhausted.
                        </p>
                        <div className="flex gap-4">
                           <button 
                              onClick={() => {
                                 setBiddingState('processing');
                                 setTimeout(() => setBiddingState('allocated'), 3000);
                              }}
                              className="flex-1 py-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all"
                           >
                              CONFIRM & BLOCK FUNDS
                           </button>
                           <button 
                              onClick={() => setBiddingState('idle')}
                              className="px-8 py-4 luxury-glass text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white"
                           >
                              CANCEL
                           </button>
                        </div>
                     </div>
                  )}
                  {biddingState === 'processing' && (
                     <div className="h-20 w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-[40px]">
                        <span className="h-4 w-4 bg-gold rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em]">BLOCKING MANDATE AND ROUTING BID TO ALLOCATION KAFKA STREAM...</span>
                     </div>
                  )}
                  {biddingState === 'allocated' && (
                     <div className="h-20 w-full flex items-center justify-center gap-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-[40px]">
                        <span className="text-2xl">✓</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">MANDATE BLOCKED. WAITING FOR END_TIME FOR ALGORITHMIC DISTRIBUTION.</span>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
