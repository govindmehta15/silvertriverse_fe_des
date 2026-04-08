'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- LUXURY SHARED COMPONENTS ---

const StoriesBar = () => {
  const stories = [
    { id: 1, name: 'SILVER', brand: true, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
    { id: 2, name: 'YOURS', brand: true, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: 3, name: 'CyberPunk', brand: false, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80' },
    { id: 4, name: 'Legacy', brand: false, image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&q=80' },
    { id: 5, name: 'Nexus', brand: false, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
    { id: 6, name: 'CU-Feed', brand: true, image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80' },
  ];

  return (
    <div className="flex w-full gap-6 overflow-x-auto pb-6 pt-4 no-scrollbar scroll-smooth">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer">
          <div className="relative h-20 w-20 rounded-full p-[2px] luxury-card hover:p-[3px] transition-all duration-500">
            <div className="h-full w-full rounded-full border border-gold/20 bg-royal-blue overflow-hidden p-1 bg-zinc-900">
              <img src={story.image} alt={story.name} className="h-full w-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            {story.brand && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold border-2 border-royal-blue shadow-lg text-[10px]">
                ✦
              </div>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-gold transition-colors">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

const FilterBar = () => {
  const categories = ['All (Home)', 'Following (Fan)', 'Commerce', 'Clubs', 'Tags'];
  const [active, setActive] = useState('All (Home)');

  return (
    <div className="flex w-full gap-4 overflow-x-auto py-6 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`whitespace-nowrap px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${active === cat ? 'bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'luxury-glass text-zinc-400 border-white/5 hover:border-gold/30 hover:text-white'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

// --- FEED CARDS (5 TYPES) ---

const FeedCard = ({ type, data }: { type: string, data: any }) => {
  const router = useRouter();

  const handleAction = () => {
    if (data.actionUrl) router.push(data.actionUrl);
  };

  // 1. COMMERCE CARD (Focus: Driving Economy)
  if (type === 'commerce') {
     return (
        <div className="luxury-glass mb-8 overflow-hidden rounded-[40px] border border-gold/20 hover:border-gold/50 transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] group relative bg-black">
           <div className="absolute top-0 right-0 p-4 opacity-10">✦</div>
           <Link href={data.actionUrl || "#"} className="block relative aspect-video w-full overflow-hidden bg-zinc-950">
             <img src={data.image} alt="" className="h-full w-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 scale-100 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
             <div className="absolute top-6 left-6 px-4 py-1.5 bg-gold text-black text-[9px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl">
                {data.commerceType}
             </div>
             <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-black italic serif text-white uppercase drop-shadow-2xl">{data.title}</h3>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mt-2 animate-pulse">{data.status}</span>
             </div>
           </Link>
           <div className="p-8 border-t border-white/5">
              <p className="text-sm text-zinc-400 mb-6 font-serif italic">{data.caption}</p>
              <button onClick={handleAction} className="w-full py-4 bg-gold border border-gold/50 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white transition-colors flex items-center justify-center gap-4">
                 {data.ctaText} →
              </button>
           </div>
        </div>
     );
  }

  // 2. ACHIEVEMENT CARD (Focus: Visibility of actions)
  if (type === 'achievement') {
    return (
       <div className="luxury-glass mb-8 p-6 overflow-hidden transition-all duration-700 hover:border-emerald-500/30 group rounded-[30px] border border-white/5 bg-emerald-950/10">
          <div className="flex items-center gap-4">
             <div className="flex-shrink-0 h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                🏆
             </div>
             <div>
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] block mb-1">GLOBAL BROADCAST</span>
                <p className="text-sm font-medium italic serif text-zinc-300">
                   <strong className="text-white not-italic font-sans tracking-wider uppercase text-xs">{data.userName}</strong> {data.caption}
                </p>
             </div>
          </div>
       </div>
    );
  }

  // 3. CLUB POST CARD
  if (type === 'club') {
     return (
        <div className="luxury-glass mb-8 overflow-hidden rounded-[30px] border border-white/5 hover:border-cyan-500/30 transition-all duration-700 bg-zinc-950/50">
           <div className="bg-cyan-950/30 px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.5em] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"/> CLUB ORIGIN</span>
              <span className="text-[10px] font-bold text-white italic serif">{data.clubName}</span>
           </div>
           <div className="p-6">
              <p className="text-sm font-serif italic text-zinc-300 leading-relaxed mb-6">"{data.caption}"</p>
              <button className="w-full py-3 luxury-glass border border-cyan-500/20 text-cyan-400 rounded-xl font-black text-[9px] uppercase tracking-[0.4em] hover:bg-cyan-500/10 transition-colors">
                 ENTER COMMUNITY ROOM
              </button>
           </div>
        </div>
     );
  }

  // 4 & 5. SOCIAL OR INDUSTRY POST (Default Feed Layout)
  const isIndustry = type === 'industry';
  return (
    <div className={`luxury-glass mb-8 overflow-hidden transition-all duration-700 rounded-[40px] border ${isIndustry ? 'border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] bg-black' : 'border-white/5 bg-zinc-950/30 hover:border-white/20'}`}>
      
      {/* Main Author Block */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${data.userName}`} className={`h-12 w-12 rounded-2xl p-[2px] ${isIndustry ? 'bg-gold' : 'luxury-card'}`}>
            <img src={data.userAvatar} alt="" className="h-full w-full object-cover rounded-xl border border-black" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
               <Link href={`/profile/${data.userName}`} className="text-sm font-black text-white italic tracking-tighter uppercase serif hover:text-gold transition-colors">{data.userName}</Link>
               {isIndustry && (
                  <span className="bg-gold text-black rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px]">✓</span>
               )}
            </div>
            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
              {data.time}
            </div>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white">•••</button>
      </div>

      {/* Media Content */}
      {data.image && (
         <div className="block relative aspect-square w-full overflow-hidden bg-zinc-900 border-y border-white/5 group">
            <img src={data.image} alt="" className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.02] opacity-90" />
            
            {/* Tag/Action overlay on image */}
            {data.linkData && (
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-xl">
                     <span className="block text-[8px] text-zinc-400 uppercase tracking-widest font-black mb-1">{data.linkData.type}</span>
                     <span className="text-xs text-white uppercase italic serif font-bold">{data.linkData.title}</span>
                  </div>
                  <button onClick={() => router.push(data.linkData.url)} className="h-10 w-10 bg-gold rounded-full flex items-center justify-center text-black hover:scale-110 shadow-lg">
                     →
                  </button>
               </div>
            )}
         </div>
      )}

      {/* Interaction & Caption Layer */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <p className="text-sm text-zinc-300 leading-relaxed italic serif">
            {data.caption}
          </p>
          {data.hashtags && (
             <div className="flex flex-wrap gap-2">
               {data.hashtags.map((tag: string) => (
                 <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-white cursor-pointer">{tag}</span>
               ))}
             </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              <span className="text-[10px] font-black tracking-widest">{data.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              <span className="text-[10px] font-black tracking-widest">{data.comments}</span>
            </button>
          </div>
          <button className="text-zinc-500 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- SIDEBAR COMPONENTS ---

const PortalSpotlights = () => {
   const portals = [
      { id: 'land', title: 'Metropolis Land', message: 'Own virtual 50x50 plots.', icon: '🗺️', url: '/land', color: 'from-emerald-900/40 text-emerald-400 border-emerald-500/20' },
      { id: 'cu', title: 'CU Exchange', message: 'Trade assets in real-time.', icon: '📈', url: '/cu/exchange', color: 'from-royal-blue/60 text-gold border-gold/20' },
      { id: 'merch', title: 'ZYWH Auction', message: 'Decode the vault digits.', icon: '🏦', url: '/merchandise/zywh', color: 'from-rose-950/40 text-rose-400 border-rose-500/20' },
   ];
   return (
      <div className="grid grid-cols-1 gap-3 mb-8">
         {portals.map(p => (
            <Link href={p.url} key={p.id} className={`luxury-glass p-4 rounded-2xl border bg-gradient-to-br to-transparent relative overflow-hidden group hover:scale-[1.02] transition-transform ${p.color}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-2xl filter drop-shadow-md grayscale group-hover:grayscale-0">{p.icon}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full text-white">ENTER</span>
               </div>
               <div className="relative z-10">
                  <h4 className="text-sm font-bold font-serif italic text-white">{p.title}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">{p.message}</p>
               </div>
            </Link>
         ))}
      </div>
   );
};

const GlobalRankings = () => {
   const ranks = [
      { name: 'KUBRICK_ARCHIVE', score: '184,200', icon: '🏛️' },
      { name: 'NOLAN_NODE', score: '152,000', icon: '⏳' },
      { name: 'AETHER_PRO', score: '110,450', icon: '💻' }
   ];
   return (
      <div className="luxury-glass p-6 rounded-[30px] border border-gold/20 bg-gradient-to-b from-zinc-900/50 to-black mb-8">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"/>
               SLL RANKINGS
            </h3>
            <span className="text-[8px] text-zinc-500 uppercase font-black uppercase tracking-widest hover:text-white cursor-pointer select-none">FULL LIST</span>
         </div>
         <div className="space-y-4">
            {ranks.map((r, i) => (
               <div key={i} className="flex items-center gap-3">
                  <span className={`text-xs font-black italic serif ${i===0?'text-gold':'text-zinc-600'}`}>#{i+1}</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-sm">{r.icon}</div>
                  <div className="flex-1">
                     <p className="text-xs font-bold text-white uppercase font-sans tracking-wider">{r.name}</p>
                     <div className="w-full h-[2px] bg-white/5 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-gold" style={{width: `${100 - i*20}%`}} />
                     </div>
                  </div>
                  <span className="text-[10px] text-gold font-mono font-black">{r.score}</span>
               </div>
            ))}
         </div>
      </div>
   );
};

const LiveActivityStream = () => {
   const activities = [
      { user: 'Govind', action: 'listed CU-892A on Exchange', time: '1m ago', color: 'text-gold' },
      { user: 'Sagar', action: 'unlocked District 07 HQ', time: '3m ago', color: 'text-emerald-400' },
      { user: 'Aman', action: 'authorized mandate for IPO', time: '7m ago', color: 'text-cyan-400' },
      { user: 'Priya', action: 'purchased Neo-Noir Silk', time: '12m ago', color: 'text-rose-400' },
   ];
   return (
      <div className="luxury-glass p-6 rounded-[30px] border border-white/5 mb-8 bg-zinc-950">
         <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-2 mb-6">
            LIVE METRO HUB
         </h3>
         <div className="space-y-5">
            {activities.map((a, i) => (
               <div key={i} className="flex items-start gap-3 border-l border-white/5 pl-3 relative group">
                  <span className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-black bg-zinc-700 group-hover:bg-gold transition-colors`} />
                  <div>
                     <p className="text-[11px] text-zinc-400 leading-snug">
                        <strong className={`font-black uppercase tracking-wider ${a.color}`}>{a.user}</strong> {a.action}
                     </p>
                     <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{a.time}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

// --- MAIN PAGE LAYOUT ---

export default function ReelityPage() {
   const mockFeed = [
      {
         id: "1", type: "industry", userName: "CHRISTOPHER_NOLAN", userAvatar: "https://images.unsplash.com/photo-1542280665-27f27b409605?w=150&q=80", time: "24m ago",
         image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
         caption: "The architecture of time is rarely linear. Proud to present early schematics from the new production. Algorithm priority locked for 30 cycles.",
         hashtags: ["#INDUSTRY", "#DIRECTOR", "#FILM"], likes: "124K", comments: "9.2K",
         linkData: { title: "NOLAN DIRECTORS CHAIR (CU)", type: "COLLECTIBLE ASSET DEPLOYED", url: "/cu/NOLAN%20DIRECTORS%20CHAIR" }
      },
      {
         id: "2", type: "commerce", title: "SOVEREIGN DESIRE AUCTION", commerceType: "COMMERCE EVENT", status: "LIVE BIDDING ACTIVE",
         image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
         caption: "The Desire Vault has opened. Only 3 units exist across the entire network.",
         ctaText: "ENTER THE AUCTION ROOM", actionUrl: "/merchandise/desire"
      },
      {
         id: "3", type: "achievement", userName: "AETHER_PRO", caption: "just injected a METROPOLIS_CORE CU into their Land, speeding up construction by 15%."
      },
      {
         id: "4", type: "user", userName: "FILM_MUSE", userAvatar: "https://images.unsplash.com/photo-1539109132332-629ee3e87049?w=150&q=80", time: "5h ago",
         image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
         caption: "Just checked my Portfolio mapping in the OURS sub-pillar. The chain economics are phenomenal. Enter early, ride the aesthetic.",
         hashtags: ["#OURS", "#AESTHETIC", "#PORTFOLIO"], likes: "2,140", comments: "128",
         linkData: { title: "OURS SUB-PILLAR", type: "STOREFRONT", url: "/merchandise/ours" }
      },
      {
         id: "5", type: "club", clubName: "THE KUBRICK COLLECTIVE", caption: "Discussing the symmetrical framing techniques used in legacy sci-fi nodes. Join the frequency."
      }
   ];

   return (
      <div className="w-full min-h-screen pt-4 pb-32">
         {/* Top Full-Width Section */}
         <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-b border-white/5 mb-8">
            <StoriesBar />
            <FilterBar />
         </div>

         {/* 2-Column Dashboard Layout */}
         <div className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
            
            {/* LEFT COLUMN: MAIN FEED */}
            <div className="w-full max-w-3xl mx-auto lg:mx-0">
               
               {/* Post Trigger */}
               <div className="luxury-glass p-4 rounded-2xl border border-white/5 mb-10 flex items-center gap-4 group cursor-text bg-zinc-950/50 hover:bg-zinc-900 transition-colors">
                  <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-sm luxury-card bg-royal-blue text-white overflow-hidden p-0.5">
                     <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=150&q=80" alt="" className="rounded-full w-full h-full object-cover"/>
                  </div>
                  <span className="text-zinc-500 font-serif italic text-sm group-hover:text-white transition-colors">Broadcast to the ecosystem...</span>
               </div>

               {/* Feed */}
               <div>
                  {mockFeed.map((item) => (
                     <FeedCard key={item.id} type={item.type} data={item} />
                  ))}
               </div>
            </div>

            {/* RIGHT COLUMN: NERVOUS SYSTEM SIDEBAR */}
            <aside className="hidden lg:block w-full space-y-6 sticky top-24 self-start">
               {/* Quick Info header */}
               <div className="px-2 mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">NERVOUS SYSTEM</span>
                  <span className="text-[8px] font-bold tracking-widest text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>ONLINE</span>
               </div>
               
               <PortalSpotlights />
               <GlobalRankings />
               <LiveActivityStream />

               <div className="text-center pt-8 border-t border-white/5 text-[9px] text-zinc-600 uppercase font-black tracking-widest space-y-2">
                  <p>Silvertriverse V2.4 © 2026</p>
                  <div className="flex justify-center gap-4">
                     <span className="hover:text-gold cursor-pointer transition-colors">ECONOMY</span>
                     <span className="hover:text-gold cursor-pointer transition-colors">PRIVACY</span>
                     <span className="hover:text-gold cursor-pointer transition-colors">LAND ALGORITHM</span>
                  </div>
               </div>
            </aside>
         </div>
      </div>
   );
}
