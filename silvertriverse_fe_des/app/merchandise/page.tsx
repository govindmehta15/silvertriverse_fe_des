'use client';

import React from 'react';
import Link from 'next/link';

export default function MerchHubPage() {
  const brands = [
    {
      name: 'YOURS',
      href: '/merchandise/yours',
      desc: 'Join the participation pool for bespoke artifacts.',
      color: '#D4AF37',
      icon: '✨',
      label: 'PARTICIPATION DROPS'
    },
    {
      name: 'OURS',
      href: '/merchandise/ours',
      desc: 'Collaborative product chains and shared ownership.',
      color: '#F8F5F2',
      icon: '🔗',
      label: 'PRODUCT CHAINS'
    },
    {
      name: 'ZYWH',
      href: '/merchandise/zywh',
      desc: 'Solve the digital puzzle to reveal the atelier.',
      color: '#D4AF37',
      icon: '🧩',
      label: 'MYSTERY ATELIER'
    },
    {
      name: 'Desire',
      href: '/merchandise/desire',
      desc: 'The pinnacle of rarity. Elite member-only gear.',
      color: '#FCF6BA',
      icon: '🏆',
      label: 'ELITE UNLOCKS'
    },
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 lg:p-20 max-w-7xl mx-auto pb-40">
      <header className="mb-24 space-y-8">
        <div className="flex items-center gap-4 text-gold text-xs font-black uppercase tracking-[0.4em]">
          <span className="h-[1.5px] w-16 bg-gold" />
          MULTIVERSE ATELIER
        </div>
        <h1 className="text-7xl font-black tracking-tighter gold-text lg:text-9xl leading-none uppercase serif italic">
          BOUTIQUE
        </h1>
        <p className="max-w-2xl text-xl text-zinc-500 font-medium italic leading-relaxed serif border-l-2 border-gold/10 pl-10">
          Beyond clothing. Beyond gear. A protocol for digital identity through high-concept drops.
        </p>
      </header>

      {/* Boutique Hub Grid */}
      <div className="grid gap-10 md:grid-cols-2">
        {brands.map((b) => (
          <Link
            key={b.name}
            href={b.href}
            className="luxury-glass group p-14 border-gold/10 hover:border-gold/40 hover:-translate-y-2 transition-all duration-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 text-5xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
              {b.icon}
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em]">{b.label}</span>
              <h2 className="text-5xl font-black text-white serif italic uppercase group-hover:gold-text transition-all duration-500">{b.name}</h2>
              <p className="max-w-md text-sm text-zinc-500 font-medium serif italic uppercase tracking-[0.3em]">{b.desc}</p>
            </div>

            <div className="mt-16 flex items-center gap-4 text-[10px] font-black text-gold uppercase tracking-[0.6em] opacity-40 group-hover:opacity-100 transition-opacity">
              ENTER ATELIER
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Atelier Footer Stats */}
      <div className="mt-40 border-t border-gold/10 pt-20 flex flex-wrap gap-24">
        <div>
          <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4 text-center">TOTAL RELEASES</span>
          <span className="text-4xl font-black text-white italic serif gold-text">156</span>
        </div>
        <div>
          <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4 text-center">ELITE PARTICIPANTS</span>
          <span className="text-4xl font-black text-white italic serif gold-text">1.2K</span>
        </div>
        <div>
          <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4 text-center">ATELIER STATUS</span>
          <span className="text-4xl font-black text-emerald-500 italic serif tracking-widest">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
