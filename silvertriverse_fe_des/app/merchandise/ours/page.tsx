'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dailyMerchandise } from '../../lib/data';

export default function OursHome() {
   const [activeProduct, setActiveProduct] = useState(dailyMerchandise[0]);
  // Simulate active buyers in the chain
  const [buyers, setBuyers] = useState([
    { id: 'Node_1', reward: '₹ 150', isUser: false },
    { id: 'Node_2', reward: '₹ 75', isUser: false },
    { id: 'Node_3', reward: '₹ 0', isUser: false },
  ]);

  const [hasEntered, setHasEntered] = useState(false);

  const triggerPurchase = () => {
     setHasEntered(true);
     // Shift everyone up relative to rewards
     const updated = buyers.map((b, i) => ({
        ...b,
        // The earlier you are, the higher your accumulated reward
        reward: `₹ ${parseInt(b.reward.replace('₹ ', '')) + (buyers.length - i) * 50}`
     }));
     setBuyers([...updated, { id: 'YOU', reward: '₹ 0', isUser: true }]);
  };

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-[1400px] mx-auto pb-40">
      
      {/* HEADER */}
      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-6">
           <Link href="/merchandise" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← MULTIVERSE ATELIER</Link>
           <h1 className="text-7xl font-black italic gold-text serif uppercase leading-none">OURS</h1>
           <p className="max-w-xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 leading-relaxed">
             Our Unified Real Style. Accessible fashion powered by backward-flowing chain economics. Enter early. Grow as others enter.
           </p>
        </div>
        
        <div className="luxury-glass px-12 py-8 border-gold/10 text-center">
           <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">CHAIN ECONOMICS</span>
           <span className="text-xl font-black text-emerald-400 italic serif">ACTIVE</span>
        </div>
      </header>

      {/* CHAIN SELECTION */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-16 border-b border-white/5 pb-8">
         {dailyMerchandise.map(prod => (
            <button 
              key={prod.id} 
              onClick={() => {
                 setActiveProduct(prod);
                 setHasEntered(false);
              }}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 whitespace-nowrap ${activeProduct.id === prod.id ? 'bg-white text-black' : 'luxury-glass text-zinc-500 border border-white/5 hover:text-white'}`}
            >
               {prod.title}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         
         {/* PRODUCT CARD */}
         <div className="luxury-glass rounded-[40px] border border-white/5 overflow-hidden">
            <div className="aspect-[4/5] bg-zinc-900 relative">
               <img src={activeProduct.images[0]} alt={activeProduct.title} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
               <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase tracking-[0.5em] rounded-full">
                  STOCK: 4 / 200 REMAINING
               </div>
            </div>
            <div className="p-12 space-y-8">
               <div>
                  <h2 className="text-3xl font-black italic text-white serif uppercase mb-4">{activeProduct.title}</h2>
                  <p className="text-sm text-zinc-500 font-medium italic serif">{activeProduct.story}</p>
               </div>
               
               <div className="flex justify-between items-center pb-8 border-b border-white/5">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">DIRECT PRICE</span>
                  <span className="text-3xl font-black text-gold italic serif">₹ {activeProduct.price.toLocaleString()}</span>
               </div>

               <div className="space-y-4">
                  <p className="text-[9px] font-black text-gold uppercase tracking-[0.3em] flex items-center gap-2">
                     <span className="text-xl">⚠️</span> IMPORTANT: REWARD LOGIC
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed font-serif italic">
                     When you purchase, you lock in your position. When the next buyer purchases, value flows backward up the chain to you. All accumulated rewards are injected directly into your Portfolio Wallet to increase your ecosystem share price.
                  </p>
               </div>

               <button 
                 onClick={triggerPurchase}
                 disabled={hasEntered}
                 className={`h-20 w-full rounded-full font-black text-[12px] uppercase tracking-[0.5em] transition-all ${hasEntered ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gold text-black shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-[1.02]'}`}
               >
                  {hasEntered ? 'POSITION SECURED' : 'PURCHASE & CLAIM POSITION'}
               </button>
            </div>
         </div>

         {/* CHAIN VISUALIZATION & PORTFOLIO */}
         <div className="space-y-8">
            <div className="luxury-glass p-12 rounded-[40px] border border-gold/10">
               <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  LIVE REWARD CHAIN
               </h3>
               
               <div className="space-y-4 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-gold/50 to-transparent" />
                  
                  {buyers.map((buyer, idx) => (
                     <div key={idx} className={`relative flex items-center gap-6 p-6 rounded-3xl border transition-all duration-700 ${buyer.isUser ? 'bg-gold/10 border-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'luxury-glass border-white/5'}`}>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 z-10 ${buyer.isUser ? 'bg-gold text-black' : 'bg-zinc-900 border border-gold/20 text-white'}`}>
                           <span className="text-xs font-black">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                           <span className={`text-[10px] font-black tracking-[0.3em] uppercase block mb-1 ${buyer.isUser ? 'text-gold' : 'text-zinc-400'}`}>
                              {buyer.id}
                           </span>
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Locked Position</span>
                        </div>
                        <div className="text-right">
                           <span className="block text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">ACCUMULATED YIELD</span>
                           <span className="text-xl font-black italic serif text-white">{buyer.reward}</span>
                        </div>
                     </div>
                  ))}
               </div>

               {hasEntered && (
                  <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center animate-fade-in">
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Simulated Network Growth</p>
                     <p className="text-sm text-zinc-400 font-medium italic serif">As new buyers enter below you, your accumulated yield will continuously increase.</p>
                  </div>
               )}
            </div>

            {/* PORTFOLIO WALLET INJECTION */}
            <div className="luxury-glass p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-royal-blue/60 to-transparent">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em]">DESTINATION PORTFOLIO</span>
                  <span className="px-4 py-1 glass text-gold text-[8px] font-black uppercase tracking-[0.3em] rounded-full border border-gold/30">LOCKED ECOSYSTEM VALUE</span>
               </div>
               <p className="text-xs text-zinc-400 font-medium italic serif leading-relaxed mb-6">
                  Rewards earned from OURS chain sequences cannot be withdrawn as cash. They are injected directly into your Silvertriverse Portfolio, increasing your dynamic share price and platform purchasing power.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
