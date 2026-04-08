'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DesireMarketplace() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    document.title = "DESIRE | SILVERTRIVERSE ATELIER";
  }, []);

  const listings = [
    { 
      id: "y10", 
      name: "OBSIDIAN MONOLITH FRAGMENT", 
      type: "DESIRE ARTIFACT",
      edition: "1 of 5", 
      status: "LIVE AUCTION", 
      currentBid: "420,000 INR",
      timeRemaining: "01:14:22",
      image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=1200&q=80",
      description: "A piece of the very structure that caused the timeline tear. The absolute pinnacle of the film's lore.",
      bidders: 47
    },
    { 
      id: "y1", 
      name: "AETHERION PRECISION CHRONOGRAPH", 
      type: "DESIRE ARTIFACT",
      edition: "1 of 50", 
      status: "DIRECT ACQUIRE", 
      price: "250,000 INR",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      description: "Forged from titanium recovered from the Aetherion set, this precision chronograph is identical to the one worn by Commander Nova.",
      bidders: 0
    },
    { 
      id: "y2", 
      name: "THE SILHOUETTE DIAMOND RING", 
      type: "DESIRE ARTIFACT",
      edition: "1 of 100", 
      status: "DIRECT AQUIRE", 
      price: "150,000 INR",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80",
      description: "This ring was the key plot device in The Silhouette — the mysterious heirloom passed down through three generations.",
      bidders: 0
    }
  ];

  if (selectedItem) {
    return (
      <div className="w-full min-h-full bg-royal-blue lg:h-full lg:overflow-hidden lg:flex">
         <div className="relative w-full lg:flex-[1.5] lg:h-full bg-zinc-950 flex justify-center items-center overflow-hidden border-r border-gold/10 group">
            <button 
               onClick={() => setSelectedItem(null)}
               className="absolute top-12 left-12 z-50 h-14 w-14 luxury-glass flex items-center justify-center rounded-2xl text-gold hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
               ←
            </button>
            <div className="absolute inset-0 bg-gold/5 blur-[120px] animate-pulse pointer-events-none" />
            <img src={selectedItem.image} alt="" className="h-full w-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-[10px] font-black text-gold uppercase tracking-[0.6em] luxury-glass px-10 py-4 rounded-full border-gold/30">
               AUTHENTICATED BY DESIRE PROTOCOL
            </div>
         </div>

         <div className="flex-1 lg:h-full lg:overflow-y-auto no-scrollbar flex flex-col justify-between">
            <div className="p-12 lg:p-20 space-y-12">
               <div className="space-y-6">
                  <span className="px-5 py-2 glass bg-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-gold/20">
                     {selectedItem.edition} • {selectedItem.type}
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black italic gold-text serif uppercase leading-none">{selectedItem.name}</h1>
                  <p className="text-xl text-zinc-400 font-medium italic underline decoration-gold/10 serif tracking-wide leading-relaxed">
                     "{selectedItem.description}"
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gold/10">
                  <div className="luxury-glass p-10 border-gold/10">
                     <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">RARITY INDEX</span>
                     <span className="text-3xl font-black text-white italic serif tracking-widest">99.9%</span>
                  </div>
                  <div className="luxury-glass p-10 border-gold/10">
                     <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">VERIFIED OWNERS</span>
                     <span className="text-3xl font-black text-white italic serif tracking-widest">0</span>
                  </div>
               </div>
            </div>

            <div className="p-12 lg:p-20 border-t border-gold/10 luxury-glass shadow-inner bg-royal-blue sticky bottom-0">
               {selectedItem.status === 'LIVE AUCTION' ? (
                  <div className="space-y-10">
                     <div className="flex justify-between items-end">
                        <div>
                           <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-2 animate-pulse">LIVE BIDDING ACTIVE</span>
                           <span className="text-6xl font-black text-white italic serif tracking-widest gold-text">{selectedItem.currentBid}</span>
                        </div>
                        <div className="text-right">
                           <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-2">T-MINUS</span>
                           <span className="text-4xl font-black text-emerald-400 italic serif tracking-widest">{selectedItem.timeRemaining}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push('/transaction?action=bid')}
                        className="h-20 w-full bg-gold text-black rounded-[40px] font-black text-[12px] uppercase tracking-[0.6em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                     >
                        PLACE SOVEREIGN BID
                     </button>
                  </div>
               ) : selectedItem.status === 'DIRECT ACQUIRE' ? (
                  <div className="space-y-10">
                     <div className="flex justify-between items-end">
                        <div>
                           <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-2">SOVEREIGN VALUATION</span>
                           <span className="text-6xl font-black text-white italic serif tracking-widest gold-text">{selectedItem.price}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push('/transaction?action=buy')}
                        className="h-20 w-full bg-gold text-black rounded-[40px] font-black text-[12px] uppercase tracking-[0.6em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                     >
                        ACQUIRE MASTERPIECE
                     </button>
                  </div>
               ) : (
                  <div className="space-y-10 text-center">
                     <h3 className="text-4xl font-black italic text-zinc-600 serif uppercase">VAULT LOCKED</h3>
                     <button className="h-20 w-full luxury-glass text-gold border-gold/10 rounded-[40px] font-black text-[10px] uppercase tracking-[0.6em] pointer-events-none">
                        AWAITING PROTOCOL UNLOCK
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between items-start gap-12">
        <div className="space-y-6">
           <Link href="/merchandise" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← ATELIER</Link>
           <h1 className="text-7xl lg:text-9xl font-black italic gold-text serif uppercase leading-none">DESIRE</h1>
           <p className="max-w-xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 leading-relaxed mt-4">
             The absolute pinnacle of digital rarity. A private marketplace for the Metropolis Elite.
           </p>
        </div>
        
        <div className="luxury-glass px-12 py-8 border-gold/10 hover:border-gold/30 transition-all text-center">
           <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">TOTAL DESIRE SUPPLY</span>
           <span className="text-4xl font-black text-white italic serif gold-text">3 Units</span>
        </div>
      </header>

      {/* Desire Listings Grid */}
      <div className="grid gap-16 lg:grid-cols-2">
         {listings.map((item) => (
            <div 
               key={item.id} 
               onClick={() => setSelectedItem(item)}
               className={`luxury-glass p-4 rounded-[40px] border-gold/10 hover:border-gold/30 hover:shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all duration-700 cursor-pointer group flex flex-col ${item.status === 'LOCKED' ? 'opacity-50' : 'opacity-100'}`}
            >
               <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative bg-zinc-950 mb-8">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/90 via-transparent" />
                  
                  <div className="absolute top-6 right-6 px-5 py-2 luxury-glass border-gold/20 text-gold text-[9px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl">
                     {item.edition}
                  </div>
               </div>

               <div className="px-8 pb-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-3 block">{item.type}</span>
                     <h2 className="text-3xl font-black text-white italic serif uppercase group-hover:gold-text transition-colors truncate">{item.name}</h2>
                  </div>
                  
                  <div className="flex justify-between items-end pt-6 border-t border-white/5">
                     <div>
                        <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1">
                           {item.status === 'LIVE AUCTION' ? 'CURRENT BID' : item.status === 'DIRECT AQUIRE' ? 'VALUATION' : 'STATUS'}
                        </span>
                        <span className="text-xl font-black text-white italic serif">
                           {item.status === 'LIVE AUCTION' ? item.currentBid : item.status === 'DIRECT ACQUIRE' ? item.price : 'VAULT LOCKED'}
                        </span>
                     </div>
                     <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] hover:underline">Inspect Masterpiece →</span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
