'use client';

import React from 'react';
import Link from 'next/link';

export default function DigitalShelf() {
  const ownedAssets = [
     {
        id: "CU-892A",
        name: "METROPOLIS_CORE NODE",
        category: "BRAND",
        acquiredPrice: "24.5 ETH",
        currentPrice: "25.2 ETH",
        acquiredDate: "2026-03-12",
        acquiredFrom: "PRIMARY ALLOCATION",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        utilitiesActive: 2
     },
     {
        id: "CU-111B",
        name: "NOLAN DIRECTORS CHAIR",
        category: "FILM",
        acquiredPrice: "18.2 ETH",
        currentPrice: "16.8 ETH",
        acquiredDate: "2026-02-18",
        acquiredFrom: "SECONDARY EXCHANGE",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
        utilitiesActive: 0
     }
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-20">
         <Link href="/profile" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← PROFILE HUB</Link>
         <h1 className="text-5xl md:text-7xl font-black italic gold-text serif uppercase mt-6 mb-4">DIGITAL SHELF</h1>
         <p className="max-w-2xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 border-l-2 border-gold/10">
           The persistent ownership layer. All your verified Collectible Units reside here. Route them to your Metropolis Land for gamification, or list them for liquidity on the Secondary Exchange.
         </p>
      </header>

      {ownedAssets.length === 0 ? (
         <div className="py-40 flex flex-col items-center justify-center border border-white/5 luxury-glass rounded-[60px]">
            <span className="text-6xl opacity-20 mb-6">✦</span>
            <h2 className="text-3xl font-black italic text-zinc-500 serif uppercase">YOUR SHELF IS EMPTY</h2>
            <Link href="/cu/allocation" className="mt-8 px-8 py-4 bg-gold text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 transition-all">
               VISIT PRIMARY ISSUANCE MARKET
            </Link>
         </div>
      ) : (
         <div className="grid lg:grid-cols-2 gap-12">
            {ownedAssets.map((asset) => (
               <div key={asset.id} className="luxury-glass rounded-[40px] border border-white/5 overflow-hidden flex flex-col hover:border-gold/30 transition-all duration-500 bg-zinc-950">
                  <div className="aspect-video relative overflow-hidden group">
                     <img src={asset.image} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent" />
                     <div className="absolute top-6 right-6 flex gap-2">
                        <span className="px-4 py-2 luxury-glass border-gold/20 text-gold text-[8px] font-black uppercase tracking-widest rounded-full">
                           {asset.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                     <div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] block mb-2">VERIFIED ASSET : {asset.id}</span>
                        <h2 className="text-3xl font-black text-white italic serif uppercase">{asset.name}</h2>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block">AQUIRED PRICE</span>
                           <span className="text-lg font-black text-white italic serif">{asset.acquiredPrice}</span>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block">MARKET VALUE</span>
                           <span className="text-lg font-black text-gold italic serif">{asset.currentPrice}</span>
                        </div>
                        <div className="space-y-1 col-span-2">
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block">ORIGIN ROUTE</span>
                           <span className="text-sm font-black text-emerald-400 italic serif">{asset.acquiredFrom} • {asset.acquiredDate}</span>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-4 border-t border-white/5">
                        <Link 
                           href={`/cu/${asset.name.replace(' ', '%20')}`}
                           className="flex-1 py-4 luxury-glass border-emerald-500/20 text-emerald-400 text-center rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-500/10 transition-colors"
                        >
                           USE UTILITIES ({asset.utilitiesActive})
                        </Link>
                        <Link 
                           href="/cu/exchange"
                           className="flex-[1.5] py-4 bg-white/5 border border-white/10 text-white text-center rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gold hover:text-black hover:border-gold transition-colors"
                        >
                           LIST ON EXCHANGE
                        </Link>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
