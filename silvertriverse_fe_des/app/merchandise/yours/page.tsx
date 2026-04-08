'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { premiumMerchandise } from '../../lib/data';

// === DATA ===
const CATEGORIES = ['GODDESS OF INDIA', 'ARCHIVE SELECTIONS', 'FILM-INSPIRED', 'CELEBRITY STYLE'];

const GODDESS_COLLECTION = [
  { name: 'SARASWATI', trait: 'Knowledge & Purity', color: 'from-amber-100/40 to-yellow-600/20', border: 'border-yellow-200/50', weave: 'Kasavu / Venkatagiri' },
  { name: 'LAKSHMI', trait: 'Prosperity & Wealth', color: 'from-red-900/40 to-yellow-600/20', border: 'border-red-500/50', weave: 'Banarasi / Paithani' },
  { name: 'PARVATI', trait: 'Marriage & Motherhood', color: 'from-emerald-900/40 to-yellow-600/20', border: 'border-emerald-500/50', weave: 'Kanchipuram' },
  { name: 'DURGA', trait: 'Warrior Power', color: 'from-red-600/40 to-red-950/20', border: 'border-red-500/80', weave: 'Lal-Par / Sambalpuri' },
  { name: 'SITA', trait: 'Devotion & Grace', color: 'from-orange-400/30 to-amber-900/20', border: 'border-orange-300/50', weave: 'Chanderi / Maheshwari' },
  { name: 'GANGA', trait: 'Flow & Purification', color: 'from-sky-300/30 to-white/10', border: 'border-sky-300/50', weave: 'Jamdani' },
  { name: 'MEENAKSHI', trait: 'Temple Royalty', color: 'from-emerald-700/40 to-green-950/20', border: 'border-emerald-400/50', weave: 'Madurai Silk' },
  { name: 'DRAUPADI', trait: 'Courage & Dignity', color: 'from-rose-950/60 to-red-950/40', border: 'border-rose-800/50', weave: 'Patola / Bandhani' },
  { name: 'SAVITRI', trait: 'Determination', color: 'from-yellow-500/40 to-amber-800/20', border: 'border-yellow-400/50', weave: 'Ikat Weaves' },
  { name: 'AHALYA', trait: 'Transformation', color: 'from-zinc-400/30 to-zinc-800/20', border: 'border-zinc-300/50', weave: 'Tussar / Raw Silk' },
  { name: 'TARA', trait: 'Wisdom & Diplomacy', color: 'from-blue-600/40 to-blue-950/20', border: 'border-blue-400/50', weave: 'Mysore Silk' },
  { name: 'ARUNDHATI', trait: 'Loyalty & Integrity', color: 'from-purple-300/30 to-white/10', border: 'border-purple-300/50', weave: 'Paithani' },
];

export default function YoursHome() {
  const [activeCat, setActiveCat] = useState('GODDESS OF INDIA');
  
  // IPO States: null -> 'mandate' -> 'bidding' -> 'allocated' | 'released'
  const [ipoState, setIpoState] = useState<{status: string, item: any} | null>(null);

  const triggerAllocation = () => {
     setIpoState(prev => ({ ...prev!, status: 'bidding' }));
     setTimeout(() => {
        // Randomly succeed or fail to show mechanics
        const success = Math.random() > 0.5;
        setIpoState(prev => ({ ...prev!, status: success ? 'allocated' : 'released' }));
     }, 3000);
  };

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-[1400px] mx-auto pb-40">
      
      {/* HEADER */}
      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
           <Link href="/merchandise" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← MULTIVERSE ATELIER</Link>
           <h1 className="text-7xl font-black italic gold-text serif uppercase leading-none">YOURS</h1>
           <p className="max-w-2xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 leading-relaxed">
             Yielding Out Uniqueness in Refined Styles. Scarcity-driven allocation. No direct purchases. Prove intent, submit bids, and let the algorithm determine ownership.
           </p>
        </div>
        
        <div className="flex gap-4">
           {['Register Bank Mandate', 'Algorithm Sort'].map(tag => (
              <span key={tag} className="px-4 py-2 luxury-glass border-gold/10 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">{tag}</span>
           ))}
        </div>
      </header>

      {/* CATEGORY NAV */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-16 border-b border-white/5 pb-8">
         {CATEGORIES.map(cat => (
           <button 
             key={cat} 
             onClick={() => setActiveCat(cat)}
             className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 whitespace-nowrap ${activeCat === cat ? 'bg-gold text-black border-none shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'luxury-glass text-zinc-500 border border-white/5 hover:text-white'}`}
           >
              {cat}
           </button>
         ))}
      </div>

      {/* GODDESS OF INDIA RENDER */}
      {activeCat === 'GODDESS OF INDIA' && (
         <div className="space-y-16">
            <div className="max-w-3xl">
               <h2 className="text-4xl font-black italic text-white serif uppercase mb-4">Goddess of India Collection</h2>
               <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] font-black">12-Tier Divine Curations. Hand-woven algorithms.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {GODDESS_COLLECTION.map(goddess => (
                  <div key={goddess.name} className={`relative p-8 rounded-[40px] luxury-glass border bg-gradient-to-br ${goddess.color} ${goddess.border} transition-all duration-700 hover:scale-105 group overflow-hidden`}>
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
                     <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div>
                           <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.5em] block mb-2">{goddess.trait}</span>
                           <h3 className="text-3xl font-black italic text-white serif uppercase leading-none drop-shadow-md">{goddess.name}</h3>
                        </div>
                        <div>
                           <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-4 border-l-2 pl-2 border-white/30">{goddess.weave}</span>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setIpoState({ status: 'mandate', item: goddess })}
                                className="flex-1 py-3 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold transition-colors"
                              >
                                 BID IPO
                              </button>
                              <button className="h-10 w-10 luxury-glass flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10" title="View Story Booklet">
                                 📖
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* ARCHIVE SELECTIONS (MIGRATED DATA) */}
      {activeCat === 'ARCHIVE SELECTIONS' && (
         <div className="space-y-16 animate-fade-in">
            <div className="max-w-3xl">
               <h2 className="text-4xl font-black italic text-white serif uppercase mb-4">Archive Selections</h2>
               <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] font-black">Elite artifacts migrated from the legacy multiverse.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {premiumMerchandise.map(item => (
                  <div key={item.id} className="luxury-glass p-10 border border-gold/10 rounded-[40px] hover:border-gold/40 transition-all duration-700 hover:-translate-y-2 group">
                     <div className="aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden mb-8 border border-white/5 relative">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-gold/30 rounded-full text-[8px] font-black text-gold uppercase tracking-widest">
                           {item.rarity}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{item.filmReference}</span>
                        <h3 className="text-3xl font-black italic text-white serif uppercase leading-none">{item.title}</h3>
                        <p className="text-xs text-zinc-500 font-serif italic line-clamp-2">{item.story}</p>
                        
                        <div className="pt-6 flex items-center justify-between border-t border-white/5">
                           <span className="text-lg font-black text-white serif">₹{item.price.toLocaleString()}</span>
                           <button 
                             onClick={() => setIpoState({ status: 'mandate', item: { ...item, name: item.title } })}
                             className="px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold transition-colors"
                           >
                              PROVE INTENT
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* FALLBACK FOR OTHER CATEGORIES */}
      {activeCat !== 'GODDESS OF INDIA' && activeCat !== 'ARCHIVE SELECTIONS' && (
         <div className="flex flex-col items-center justify-center py-40 border border-white/5 luxury-glass rounded-[60px]">
            <span className="text-6xl opacity-20 mb-6">✦</span>
            <h2 className="text-2xl font-black italic text-zinc-500 serif uppercase tracking-widest">{activeCat} DROP PENDING</h2>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mt-4">Awaiting algorithm synchronization...</p>
         </div>
      )}

      {/* IPO MODAL INTERFACE */}
      {ipoState && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="max-w-2xl w-full luxury-glass border border-gold/20 rounded-[40px] p-12 relative overflow-hidden">
               {ipoState.status === 'mandate' && (
                 <div className="space-y-8 relative z-10 text-center">
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.6em]">IPO PARTICIPATION MANDATE</span>
                    <h2 className="text-4xl font-black italic text-white serif uppercase">{ipoState.item.name} ARTIFACT</h2>
                    <p className="text-sm text-zinc-400 italic serif max-w-lg mx-auto">
                       To prove intent, your bank must authorize a mandate for the bidding amount. If demand exceeds supply, an algorithm selects buyers. Funds are immediately released if unselected.
                    </p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                          <span className="text-zinc-500">ESTIMATED VALUE</span>
                          <span className="text-gold">1.2 ETH (UPI AUTO-HOLD)</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                          <span className="text-zinc-500">CURRENT BIDS</span>
                          <span className="text-white">412 BIDS FOR 50 UNITS</span>
                       </div>
                    </div>

                    <button onClick={triggerAllocation} className="h-16 w-full bg-gold text-black rounded-full font-black text-[12px] uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-[1.02] transition-all">
                       REGISTER BANK MANDATE & BID
                    </button>
                    <button onClick={() => setIpoState(null)} className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                       CANCEL
                    </button>
                 </div>
               )}

               {ipoState.status === 'bidding' && (
                 <div className="space-y-8 relative z-10 text-center py-12">
                    <div className="h-24 w-24 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                    <h2 className="text-2xl font-black italic gold-text serif uppercase">ALLOCATION ALGORITHM RUNNING</h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">Processing intent vs Supply...</p>
                 </div>
               )}

               {ipoState.status === 'allocated' && (
                 <div className="space-y-8 relative z-10 text-center py-8">
                    <span className="text-6xl text-emerald-500 block mb-6">✦</span>
                    <h2 className="text-4xl font-black italic text-white serif uppercase">ALLOCATION SUCCESSFUL</h2>
                    <p className="text-sm text-zinc-400 italic serif">You have secured the {ipoState.item.name} artifact. Mandate converted to payment.</p>
                    <button onClick={() => setIpoState(null)} className="h-16 w-full luxury-glass border border-emerald-500/50 text-emerald-400 rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-emerald-500/10 transition-all">
                       VIEW STORY BOOKLET
                    </button>
                 </div>
               )}

               {ipoState.status === 'released' && (
                 <div className="space-y-8 relative z-10 text-center py-8">
                    <span className="text-6xl text-rose-500 block mb-6">✕</span>
                    <h2 className="text-4xl font-black italic text-white serif uppercase">ALLOCATION FAILED</h2>
                    <p className="text-sm text-zinc-400 italic serif">Demand exceeded supply. You were not selected by the algorithm.</p>
                    <div className="px-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                       <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Bank Mandate Successfully Released</span>
                    </div>
                    <button onClick={() => setIpoState(null)} className="h-16 w-full luxury-glass border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white/5 transition-all">
                       RETURN TO DROPS
                    </button>
                 </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
}
