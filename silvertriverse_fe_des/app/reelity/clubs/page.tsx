'use client';

import React from 'react';
import Link from 'next/link';

export default function ClubsPage() {
  const clubs = [
    { name: 'Vanguard Alpha', members: '1.2k', type: 'Combat Protocol', label: 'ELITE' },
    { name: 'Cyber Seekers', members: '850', type: 'Exploration Node', label: 'ACTIVE' },
    { name: 'Neon Knights', members: '2.4k', type: 'Social Syndicate', label: 'PUBLIC' },
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between items-start gap-12">
        <div className="space-y-6">
           <Link href="/" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">← BACK TO REELITY</Link>
           <h1 className="text-7xl font-black italic gold-text serif uppercase leading-none">THE CLUBS</h1>
           <p className="max-w-xl text-xl text-zinc-500 font-medium italic underline decoration-gold/20 serif tracking-wide pl-2 leading-relaxed mt-4">
             Exclusive community hubs within the Social Engine. Find your sovereign faction.
           </p>
        </div>
        
        <div className="luxury-glass px-12 py-8 border-gold/10 hover:border-gold/30 transition-all text-center">
           <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">ACTIVE FACTIONS</span>
           <span className="text-4xl font-black text-white italic serif gold-text">12</span>
        </div>
      </header>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <div key={club.name} className="luxury-glass group overflow-hidden border-gold/10 hover:border-gold/40 hover:-translate-y-3 transition-all duration-700 rounded-[40px] flex flex-col relative">
            <div className="p-12 space-y-8 flex-1">
              <div className="flex justify-between items-center mb-4">
                 <div className="h-1 w-16 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                 <span className="px-4 py-1 glass bg-gold/10 text-gold text-[8px] font-black uppercase tracking-[0.4em] rounded-full border border-gold/20 flex-shrink-0">
                    {club.label}
                 </span>
              </div>
              <h3 className="text-3xl font-black text-white italic serif uppercase leading-none">{club.name}</h3>
              <div className="flex flex-col gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                <span className="text-gold">{club.type}</span>
                <span>{club.members} VERIFIED MEMBERS</span>
              </div>
            </div>
            
            <div className="p-12 pt-0">
               <button 
                 className="w-full h-16 rounded-[30px] font-black text-[10px] uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 luxury-glass border-gold/20 text-gold hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
               >
                 REQUEST PROTOCOL ACCESS
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
