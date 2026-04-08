'use client';

import React from 'react';
import Link from 'next/link';

export default function CUHubPage() {
  const sections = [
    { 
      name: 'Allocation Market', 
      href: '/cu/allocation', 
      desc: 'Sovereign drops & primary distribution.', 
      icon: '🏛️',
      stats: '4 ACTIVE DROPS'
    },
    { 
      name: 'Trading Exchange', 
      href: '/cu/exchange', 
      desc: 'Secondary market with real-time liquidity.', 
      icon: '📈',
      stats: '12.4M VOL'
    },
    { 
      name: 'My Portfolio', 
      href: '/cu/portfolio', 
      desc: 'Manage your owned vanguards and yield.', 
      icon: '💼',
      stats: '14 UNITS'
    },
    { 
      name: 'Market Insights', 
      href: '/cu/insights', 
      desc: 'Deep analytics on metropolis economy.', 
      icon: '📊',
      stats: '+4.2% INDEX'
    }
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-24 space-y-8">
        <div className="flex items-center gap-4 text-gold text-xs font-black uppercase tracking-[0.4em]">
          <span className="h-[1.5px] w-16 bg-gold" />
          CU SOVEREIGN ENGINE
        </div>
        <h1 className="text-7xl font-black tracking-tighter gold-text lg:text-9xl leading-none uppercase serif italic">
          COLLECTIBLES
        </h1>
        <p className="max-w-2xl text-xl text-zinc-500 font-medium italic leading-relaxed serif border-l-2 border-gold/10 pl-10">
          The financial pillar of the SilverTriverse. Manage your digital property through an elite trading ecosystem.
        </p>
      </header>

      {/* Hub Navigation Grid */}
      <div className="grid gap-10 md:grid-cols-2">
        {sections.map((s) => (
          <Link 
            key={s.name} 
            href={s.href}
            className="luxury-glass group p-12 border-gold/10 hover:border-gold/40 hover:-translate-y-2 transition-all duration-700 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                {s.icon}
             </div>
             <div className="space-y-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{s.stats}</span>
                <h2 className="text-4xl font-black text-white serif italic uppercase group-hover:gold-text transition-all duration-500">{s.name}</h2>
                <p className="max-w-md text-sm text-zinc-500 font-medium serif italic uppercase tracking-[0.2em]">{s.desc}</p>
             </div>
             
             <div className="mt-12 flex items-center gap-3 text-[10px] font-black text-gold uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity">
                ACCESS MODULE
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
             </div>
          </Link>
        ))}
      </div>

      {/* Global Market Stats Bar */}
      <div className="mt-32 border-t border-gold/10 pt-16 flex flex-wrap gap-20">
         <div>
            <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">METROPOLS CAP</span>
            <span className="text-3xl font-black text-white italic serif gold-text">$1.24B</span>
         </div>
         <div>
            <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">24H VOLUME</span>
            <span className="text-3xl font-black text-white italic serif gold-text">840 ETH</span>
         </div>
         <div>
            <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2">ACTIVE NODES</span>
            <span className="text-3xl font-black text-white italic serif gold-text">42,882</span>
         </div>
      </div>
    </div>
  );
}
