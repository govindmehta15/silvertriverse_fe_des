'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ZywhHome() {
  const [phase, setPhase] = useState<'entry' | 'step_1' | 'step_2' | 'step_3' | 'step_4' | 'auction'>('entry');
  const [lengthGuess, setLengthGuess] = useState<number | null>(null);
  const [firstDigit, setFirstDigit] = useState<number | null>(null);
  const [midDigits, setMidDigits] = useState('');
  
  // The correct diamond price is: 8,450,000 (7 digits length, starts with 8, mid is 450000)

  return (
    <div className="w-full min-h-full bg-royal-blue lg:h-full lg:overflow-hidden flex flex-col">
      <header className="p-8 md:p-12 border-b border-gold/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-20">
         <div className="flex items-center gap-6">
            <Link href="/merchandise" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← ATELIER</Link>
            <h1 className="text-4xl md:text-5xl font-black italic gold-text serif uppercase">ZYWH</h1>
         </div>
         <div className="flex flex-wrap gap-4">
            <span className="px-6 py-2 luxury-glass border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.4em] rounded-full">GAMIFIED AUCTION</span>
            <span className="px-6 py-2 glass border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">STAGE :: {phase.toUpperCase()}</span>
         </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden relative">
         {/* Diamond visual background */}
         <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none mix-blend-screen">
            <img src="https://images.unsplash.com/photo-1611085583191-a3b1ce3e970a?w=1200&q=80" alt="" className="w-[800px] h-[800px] object-cover rounded-full blur-3xl animate-pulse" />
         </div>
         
         {/* --- ENTRY --- */}
         {phase === 'entry' && (
            <div className="text-center space-y-12 max-w-4xl relative z-10">
               <div className="space-y-6">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.6em] block animate-pulse">Zillion Years Worth of Heritage</span>
                  <h2 className="text-5xl md:text-7xl font-black italic text-white serif uppercase leading-none">THE IMPERIAL CUT</h2>
                  <div className="w-24 h-[1px] bg-gold/50 mx-auto" />
                  <div className="luxury-glass px-8 py-4 border-gold/10 inline-block rounded-2xl mb-4">
                     <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">CURRENT UNLOCK TARGET</span>
                     <span className="text-sm text-gold font-black uppercase serif italic">OBSIDIAN MONOLITH FRAGMENT :: AE-001</span>
                  </div>
                  <p className="max-w-xl mx-auto text-lg text-zinc-400 font-medium italic serif tracking-wide leading-relaxed">
                     A diamond should not be given a price. Its worth must be discovered. Before entering the auction, pre-qualify by decoding the vault for the legendary Monolith fragment.
                  </p>
               </div>
               <button 
                 onClick={() => setPhase('step_1')}
                 className="h-20 w-80 bg-white text-black font-black text-[10px] uppercase tracking-[0.6em] rounded-[40px] hover:bg-gold transition-all duration-700 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
               >
                  COMMENCE DECODING
               </button>
            </div>
         )}

         {/* --- STEP 1: Total Digits --- */}
         {phase === 'step_1' && (
            <div className="luxury-glass p-12 md:p-20 border-gold/10 rounded-[60px] max-w-3xl w-full text-center space-y-12 relative z-10">
               <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] block mb-4">STEP 1 OF 4</span>
                  <h3 className="text-3xl font-black text-white italic serif uppercase">Decode Length</h3>
                  <p className="text-zinc-500 text-sm italic serif mt-4">How many digits make up the base valuation of this heritage asset?</p>
               </div>
               
               <div className="flex flex-wrap justify-center gap-4">
                  {[5, 6, 7, 8, 9].map(n => (
                     <button 
                        key={n} 
                        onClick={() => {
                           setLengthGuess(n);
                           setTimeout(() => setPhase('step_2'), 600);
                        }}
                        className={`h-24 w-24 rounded-full luxury-glass border transition-all text-2xl font-black serif ${lengthGuess === n ? 'bg-gold border-gold text-black scale-110' : 'border-white/10 text-white hover:border-gold/30 hover:text-gold'}`}
                     >
                        {n}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* --- STEP 2: First Digit --- */}
         {phase === 'step_2' && (
            <div className="luxury-glass p-12 md:p-20 border-gold/10 rounded-[60px] max-w-4xl w-full text-center space-y-12 relative z-10 animate-fade-in">
               <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] block mb-4">STEP 2 OF 4</span>
                  <h3 className="text-3xl font-black text-white italic serif uppercase">The Vanguard Digit</h3>
                  <p className="text-zinc-500 text-sm italic serif mt-4">Identify the starting digit of the valuation.</p>
               </div>
               
               {/* Visual representation of the spaces locked in step 1 */}
               <div className="flex justify-center gap-3 mb-12">
                  {Array.from({ length: 7 }).map((_, i) => (
                     <div key={i} className={`h-16 w-12 md:h-20 md:w-16 luxury-glass rounded-xl flex items-center justify-center border-white/10 ${i === 0 ? 'border-gold/50 bg-gold/5' : ''}`}>
                        <span className="text-2xl text-zinc-700 italic serif">?</span>
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                     <button 
                        key={n} 
                        onClick={() => {
                           setFirstDigit(n);
                           setTimeout(() => setPhase('step_3'), 600);
                        }}
                        className={`h-20 rounded-2xl luxury-glass border transition-all text-2xl font-black serif ${firstDigit === n ? 'bg-gold border-gold text-black scale-105' : 'border-white/10 text-white hover:border-gold/30'}`}
                     >
                        {n}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* --- STEP 3: AutoPay Mandate --- */}
         {phase === 'step_3' && (
            <div className="text-center space-y-12 max-w-4xl relative z-10 animate-fade-in">
               <div className="p-12 md:p-20 luxury-glass border-gold/30 bg-gradient-to-b from-royal-blue to-royal-blue/40 rounded-[60px] shadow-[0_0_80px_rgba(212,175,55,0.15)] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
                  
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] block mb-8">STEP 3 OF 4 :: PRE-QUALIFICATION</span>
                  <h2 className="text-5xl md:text-7xl font-black italic text-white serif uppercase leading-none mb-8">FINANCIAL INTENT</h2>
                  
                  <p className="max-w-2xl mx-auto text-lg text-silk font-medium italic serif tracking-wide leading-relaxed mb-12">
                     To proceed to the final decode, you must authorize a UPI AutoPay mandate. This blocks 15% of the estimated value to filter out casual observers. Your portfolio shares will be used as collateral.
                  </p>

                  <div className="bg-black/40 border border-white/5 rounded-[30px] p-8 max-w-md mx-auto space-y-6 mb-12 text-left">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                        <span className="text-zinc-500">EST. MANDATE HOLD</span>
                        <span className="text-gold text-sm">₹ 1,260,000</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] pt-6 border-t border-white/5">
                        <span className="text-zinc-500">PORTFOLIO COLLATERAL</span>
                        <span className="text-emerald-400 text-sm">SUFFICIENT</span>
                     </div>
                  </div>

                  <button 
                     onClick={() => setPhase('step_4')}
                     className="h-20 w-80 bg-gold text-black font-black text-[10px] uppercase tracking-[0.6em] rounded-[40px] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                  >
                     AUTHORIZE MANDATE
                  </button>
               </div>
            </div>
         )}

         {/* --- STEP 4: Final Unlock --- */}
         {phase === 'step_4' && (
            <div className="luxury-glass p-12 md:p-20 border-gold/10 rounded-[60px] max-w-4xl w-full text-center space-y-12 relative z-10 animate-fade-in">
               <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] block mb-4">FINAL STEP</span>
                  <h3 className="text-3xl font-black text-emerald-400 italic serif uppercase drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">MANDATE SECURED</h3>
                  <p className="text-white text-lg italic serif mt-4">The core value has been unsealed. Decode the remaining digits to enter the auction.</p>
               </div>
               
               {/* Visual representation: First digit is shown, last digit is shown. User guesses middle. */}
               <div className="flex justify-center flex-wrap gap-3 mb-8">
                  <div className="h-16 w-12 md:h-20 md:w-16 bg-gold text-black rounded-xl flex items-center justify-center font-black text-3xl serif shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                     8
                  </div>
                  <div className="flex items-center mx-2 text-gold">,</div>
                  
                  {/* The missing digits string input visually represented */}
                  <div className="flex gap-2 p-2 luxury-glass rounded-2xl border-white/20">
                     <input 
                        type="tel" 
                        maxLength={3} 
                        value={midDigits} 
                        onChange={e => setMidDigits(e.target.value)}
                        placeholder="???"
                        className="w-32 bg-transparent text-center text-3xl text-white font-black serif focus:outline-none placeholder:text-zinc-700 tracking-[0.5em]"
                     />
                  </div>
                  
                  <div className="flex items-center mx-2 text-gold">,</div>
                  <div className="h-16 w-12 md:h-20 md:w-16 glass bg-white/5 rounded-xl flex items-center justify-center font-black text-3xl serif text-white/50 border border-white/10">0</div>
                  <div className="h-16 w-12 md:h-20 md:w-16 glass bg-white/5 rounded-xl flex items-center justify-center font-black text-3xl serif text-white/50 border border-white/10">0</div>
                  <div className="h-16 w-12 md:h-20 md:w-16 glass bg-white/5 rounded-xl flex items-center justify-center font-black text-3xl serif text-white/50 border border-white/10">0</div>
               </div>

               <div className="pt-8">
                  <button 
                     onClick={() => {
                        if(midDigits === '450') {
                           setPhase('auction');
                        } else {
                           alert('Incorrect decode. Mandate remains locked pending correct entry.');
                        }
                     }}
                     className="h-20 px-16 bg-white text-black font-black text-[12px] uppercase tracking-[0.6em] rounded-[40px] hover:bg-gold transition-all shadow-[0_15px_40px_rgba(255,255,255,0.1)]"
                  >
                     DECODE FINAL PRICE
                  </button>
               </div>
            </div>
         )}

         {/* --- Phase 6: Proper Auction Room --- */}
         {phase === 'auction' && (
            <div className="text-center luxury-glass p-12 md:p-32 border-gold/50 rounded-[80px] max-w-6xl w-full space-y-16 relative z-10 animate-fade-in shadow-[0_0_100px_rgba(212,175,55,0.1)]">
               
               <div className="absolute -top-12 inset-x-0 flex justify-center">
                  <div className="px-8 py-4 bg-emerald-950 border border-emerald-500/50 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                     ACCESS GRANTED :: EXCLUSIVE BIDDING POOL
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-7xl md:text-9xl font-black italic text-white serif uppercase leading-none gold-text drop-shadow-xl">LIVE AUCTION</h2>
                  <p className="text-zinc-400 font-black tracking-[0.4em] uppercase text-sm">THE IMPERIAL CUT DIAMOND</p>
               </div>
               
               <div className="flex flex-col md:flex-row justify-center gap-20 py-12 border-y border-white/5">
                  <div className="text-center space-y-4">
                     <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.6em]">DECODED BASE</span>
                     <span className="text-6xl font-black text-white italic serif tracking-widest line-through decoration-rose-500/50">₹ 84.5L</span>
                  </div>
                  <div className="w-[1px] bg-white/10 hidden md:block" />
                  <div className="text-center space-y-4">
                     <span className="block text-[10px] font-black text-gold uppercase tracking-[0.6em]">CURRENT WAR BID</span>
                     <span className="text-6xl font-black text-gold italic serif tracking-widest drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">₹ 142.8L</span>
                  </div>
               </div>

               <button className="h-24 w-full md:w-[600px] bg-gold text-black font-black text-[14px] uppercase tracking-[0.8em] rounded-[50px] transition-all hover:bg-white hover:scale-[1.02] shadow-[0_30px_100px_rgba(212,175,55,0.2)]">
                  OVERRIDE & BID ₹ 145.0L
               </button>

               <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex justify-center items-center gap-8">
                  <span><span className="text-white">4</span> ELITE BIDDERS ONLINE</span>
                  <span className="h-4 w-[1px] bg-zinc-700" />
                  <span className="text-emerald-500 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> MANDATE VERIFIED</span>
               </div>
            </div>
         )}
      </main>
    </div>
  );
}
