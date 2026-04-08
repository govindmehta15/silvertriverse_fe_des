'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState('');

  // Sample post data for detail view
  const post = {
    id: params.id,
    userName: "AETHER_PRO",
    userAvatar: "https://i.pravatar.cc/150?u=aether",
    time: "24m ago",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80",
    likes: "1,200",
    commentsCount: "84",
    caption: "The Vanguard-01 core module represents the pinnacle of digital craftsmanship. Beyond reality, beyond identity. Experience excellence as a standard within the metropolis.",
    hashtags: ["#CU", "#EXCELLENCE", "#VANGUARD"],
    ctaText: "Aquire Module • 0.85 ETH",
    type: "cu"
  };

  const comments = [
    { id: 1, user: "NEXUS_ALPHA", avatar: "https://i.pravatar.cc/150?u=1", text: "Finally! Been waiting for the v.4 compatibility.", time: "12m ago" },
    { id: 2, user: "STYLE_MINER", avatar: "https://i.pravatar.cc/150?u=2", text: "Can we use this for the ZYWH drops?", time: "5m ago" },
    { id: 3, user: "GENESIS_X", avatar: "https://i.pravatar.cc/150?u=3", text: "Looks legendary. Absolute masterpiece.", time: "1m ago" },
  ];

  return (
    <div className="w-full min-h-full bg-royal-blue lg:flex lg:h-full lg:overflow-hidden">
      {/* Left Side: Media Hero (Responsive) */}
      <div className="relative aspect-[4/5] w-full lg:h-full lg:flex-[1.3] lg:bg-zinc-950 flex items-center justify-center border-r border-gold/10">
        <Link href="/" className="absolute top-10 left-10 z-50 h-12 w-12 luxury-glass flex items-center justify-center rounded-2xl text-gold hover:scale-110 active:scale-95 transition-all duration-500">
           ←
        </Link>
        <img src={post.image} alt="" className="h-full w-full object-cover lg:h-[90%] lg:w-[90%] lg:rounded-[40px] lg:shadow-[0_0_100px_rgba(212,175,55,0.1)] border-gold/5" />
      </div>

      {/* Right Side: Interactions & Royal Logic */}
      <div className="flex flex-col flex-1 lg:h-full lg:bg-royal-blue max-w-2xl mx-auto lg:max-w-none">
        {/* Detail Header */}
        <div className="flex items-center justify-between p-10 border-b border-gold/10">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 luxury-glass gold-border p-1 rounded-2xl">
                 <img src={post.userAvatar} alt="" className="h-full w-full object-cover rounded-xl" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase serif gold-text">{post.userName}</h2>
                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold tracking-[0.4em] uppercase">
                   <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                   AUTHENTIC VANGUARD NODE
                </div>
              </div>
           </div>
           <button className="h-10 px-8 rounded-full luxury-glass text-[9px] font-black uppercase tracking-[0.3em] text-white hover:text-gold hover:gold-border transition-all duration-700">
              Follow
           </button>
        </div>

        {/* Narrative & Stats Section */}
        <div className="p-10 pb-6 border-b border-gold/10 bg-white/5 backdrop-blur-3xl animate-shimmer">
           <p className="text-zinc-300 leading-relaxed text-lg serif italic">
             "{post.caption}"
           </p>
           <div className="mt-6 flex flex-wrap gap-4">
             {post.hashtags.map(t => <span key={t} className="text-[10px] font-black text-gold/60 uppercase tracking-[0.4em]">{t}</span>)}
           </div>
           <div className="mt-8 flex items-center gap-10 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-black">
              <span>{post.time}</span>
              <span className="flex items-center gap-2 text-gold"><div className="h-1 w-1 bg-gold rounded-full" />{post.likes} LIKES</span>
              <span>METROPOLIS DISTRICT 07</span>
           </div>
        </div>

        {/* Dynamic Comments Layer (Luxury Scroll) */}
        <div className="flex-1 overflow-y-auto px-10 py-8 no-scrollbar space-y-10">
           {comments.map(c => (
              <div key={c.id} className="flex gap-6 group">
                 <div className="h-10 w-10 luxury-card rounded-xl overflow-hidden border-gold/10 group-hover:border-gold/30 transition-all duration-500 flex-shrink-0">
                    <img src={c.avatar} alt="" className="h-full w-full object-cover grayscale opacity-60 group-hover:opacity-100" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[13px] text-zinc-300 leading-relaxed">
                       <span className="font-black text-gold mr-3 uppercase tracking-widest">{c.user}</span>
                       {c.text}
                    </p>
                    <div className="flex gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
                       <span>{c.time}</span>
                       <button className="hover:text-white transition-colors">Reply</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* --- ROYAL ECONOMY CTA (Detail Level) --- */}
        <div className="p-10 border-t border-gold/10 luxury-glass shadow-inner">
           <button className="w-full h-20 bg-gold text-black rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-700 flex items-center justify-center gap-6 group">
               {post.ctaText}
               <div className="h-10 w-10 luxury-glass bg-black/10 flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
               </div>
           </button>
           
           {/* Add Review / Propose Component */}
           <div className="mt-8 flex gap-6">
              <input 
                type="text" 
                placeholder="PROPOSE ARCHIVAL REACT..." 
                className="flex-1 bg-transparent border-none text-[10px] font-black uppercase tracking-[0.5em] text-silk focus:ring-0 placeholder:text-zinc-700 serif italic" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                disabled={!comment}
                className="text-gold font-black text-[10px] uppercase tracking-[0.5em] opacity-40 hover:opacity-100 disabled:opacity-10 transition-all duration-500"
              >
                DEPLOY
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
