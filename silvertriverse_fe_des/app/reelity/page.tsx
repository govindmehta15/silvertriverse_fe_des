import React from 'react';

export default function ReelityPage() {
  return (
    <div className="min-h-screen p-8 md:p-16">
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter premium-gradient-text md:text-7xl">
          REELITY
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          The Social Engine of SilverTriverse. Connect, record, and project your digital legacy across the multiverse.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Core Engine Card */}
        <div className="glass group overflow-hidden p-1 transition-all duration-500 hover:border-white/20">
          <div className="h-full rounded-[19px] bg-black/40 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-reelity/10 text-accent-reelity">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Social Engine</h3>
            <p className="mt-2 text-sm text-zinc-400">Real-time engagement layer for all Triverse activities.</p>
          </div>
        </div>

        {/* Clubs Section */}
        <div className="glass group overflow-hidden p-1 transition-all duration-500 hover:border-white/20">
          <div className="h-full rounded-[19px] bg-black/40 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-reelity/10 text-accent-reelity">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Clubs</h3>
            <p className="mt-2 text-sm text-zinc-400">Join exclusive communities, guilds, and factions within the world.</p>
          </div>
        </div>

        {/* Reality Feed */}
        <div className="glass group overflow-hidden p-1 transition-all duration-500 hover:border-white/20">
          <div className="h-full rounded-[19px] bg-black/40 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-reelity/10 text-accent-reelity">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Live Feed</h3>
            <p className="mt-2 text-sm text-zinc-400">Ephemeral moments captured across the 50x50 metropolis.</p>
          </div>
        </div>
      </div>

      {/* Feature Preview Section */}
      <section className="mt-20">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-white/50 uppercase">Engine Capabilities</h2>
        <div className="glass bg-white/5 p-8 text-center">
          <p className="text-xl font-light italic text-zinc-300">
             "Where identity meets infinity."
          </p>
        </div>
      </section>
    </div>
  );
}
