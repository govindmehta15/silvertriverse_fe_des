'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function TransactionEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams?.get('action') || 'PROCESS';
  
  const [phase, setPhase] = useState<'initiating' | 'processing' | 'verifying' | 'success'>('initiating');

  useEffect(() => {
    // Simulate complex luxury transaction process
    const timeouts = [
      setTimeout(() => setPhase('processing'), 1500),
      setTimeout(() => setPhase('verifying'), 3500),
      setTimeout(() => setPhase('success'), 5500),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const getActionLabel = () => {
    switch(action.toLowerCase()) {
      case 'buy': return 'AQUISITION';
      case 'sell': return 'LIQUIDATION';
      case 'bid': return 'SOVEREIGN BID';
      case 'participate': return 'POOL PARTICIPATION';
      case 'deploy': return 'UTILITY DEPLOYMENT';
      default: return 'PROTOCOL EVENT';
    }
  };

  return (
    <div className="w-full min-h-screen bg-royal-blue flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pulse */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'success' ? 'bg-emerald-500/10 opacity-100' : 'bg-gold/5 opacity-50 blur-[200px] animate-pulse'}`} />

      <div className="relative z-10 w-full max-w-2xl px-6 md:px-0">
        <Link href="/" className="absolute -top-32 left-0 text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all">
          ← ABORT PROTOCOL
        </Link>

        {/* Processing State */}
        {phase !== 'success' && (
          <div className="text-center space-y-16 animate-shimmer">
             <div className="space-y-4">
                <span className="text-[12px] font-black text-gold/60 uppercase tracking-[0.8em] animate-pulse">
                  {phase === 'initiating' ? 'INITIATING HANDSHAKE...' : phase === 'processing' ? 'SECURING SOVEREIGN ALLOCATION...' : 'VERIFYING METROPOLIS LEDGER...'}
                </span>
                <h1 className="text-6xl md:text-8xl font-black italic gold-text serif uppercase leading-none">
                  {getActionLabel()}
                </h1>
             </div>

             <div className="w-64 h-64 mx-auto relative group">
                <div className="absolute inset-0 border-4 border-gold/20 rounded-full animate-spin [animation-duration:3s]" />
                <div className="absolute inset-4 border-4 border-t-gold/80 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:1s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-2xl font-black italic serif text-white">{phase === 'initiating' ? '12%' : phase === 'processing' ? '64%' : '98%'}</span>
                </div>
             </div>

             <div className="luxury-glass p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-left">
                <p>{'>'} Engine Payload: {action.toUpperCase()}_SIGNATURE</p>
                <p className="mt-2">{'>'} Routing: DISTRICT 07 SERVER</p>
                <p className="mt-2 text-gold">{'>'} Status: {phase.toUpperCase()}</p>
             </div>
          </div>
        )}

        {/* Success State */}
        {phase === 'success' && (
          <div className="text-center space-y-16 animate-shimmer">
             <div className="space-y-4">
                <span className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.8em]">LEDGER SECURED</span>
                <h1 className="text-6xl md:text-8xl font-black italic text-white serif uppercase leading-none shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  SUCCESS
                </h1>
                <p className="text-lg text-zinc-400 font-medium italic underline decoration-gold/10 serif tracking-wide mt-6">
                  "Your action has been eternally forged into the SilverTriverse architecture."
                </p>
             </div>

             <div className="w-64 h-64 mx-auto luxury-glass bg-emerald-500/10 rounded-full border-emerald-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                   <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                   <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
             </div>

             <div className="grid grid-cols-2 gap-6 mt-12 w-full max-w-lg mx-auto">
                <button 
                  onClick={() => router.back()} 
                  className="h-16 luxury-glass border-gold/10 text-white font-black text-[10px] uppercase tracking-[0.5em] rounded-[30px] hover:bg-gold/5 transition-all"
                >
                   Return to UI
                </button>
                <button 
                  onClick={() => router.push('/cu/portfolio')}
                  className="h-16 bg-gold text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-[30px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                >
                   View Portfolio
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">
        TRANSACTION ENGINE v2.4 • SECURE PROTOCOL
      </div>
    </div>
  );
}

export default function TransactionEnginePage() {
  return (
    <Suspense fallback={
       <div className="w-full h-screen bg-royal-blue flex items-center justify-center">
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">CARRIAGE PREPARATION...</span>
       </div>
    }>
      <TransactionEngineContent />
    </Suspense>
  );
}
