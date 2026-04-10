import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLHeritageVault() {
    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);

    useEffect(() => {
        setCoins(sllService.getHeritageCoins());
    }, []);

    return (
        <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 lg:pl-0 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <header className="max-w-7xl mx-auto mb-20 relative z-10">
                <Link to="/sll" className="group flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:text-white transition-colors">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit to Stadium
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-4">
                            Heritage <span className="text-silver-shimmer italic">Vault</span>
                        </h1>
                        <p className="text-gray-500 max-w-xl text-xs uppercase font-black tracking-[0.4em] leading-relaxed">
                            A museum-grade archive of commemorative artifacts that define cinematic history. 
                            Minted in 10g Pure Silver.
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 relative z-10">
                {/* COIN COLLECTIONS */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/40 italic">Historical Archive</h2>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {coins.map((coin, idx) => (
                            <motion.div 
                                key={coin.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setSelectedCoin(coin)}
                                className={`group relative aspect-square bg-navy-900/20 border rounded-full p-8 cursor-pointer transition-all duration-500 ${
                                    selectedCoin?.id === coin.id ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] scale-105' : 'border-white/5 hover:border-white/20'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="w-full h-full rounded-full border border-white/5 p-2 shadow-inner">
                                        <img 
                                            src={coin.image} 
                                            alt={coin.name} 
                                            className={`w-full h-full object-contain rounded-full transition-transform duration-700 ${
                                                selectedCoin?.id === coin.id ? 'rotate-[360deg]' : 'group-hover:rotate-12'
                                            }`} 
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-white/60">{coin.date}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ARTIFACT SPECS */}
                <aside>
                    <AnimatePresence mode="wait">
                        {selectedCoin ? (
                            <motion.div 
                                key={selectedCoin.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="sticky top-12 bg-navy-950/80 border border-white/5 rounded-[40px] p-10 backdrop-blur-3xl"
                            >
                                <div className="w-32 h-32 mx-auto mb-10 relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse" />
                                    <img src={selectedCoin.image} className="w-full h-full object-contain relative z-10" alt="" />
                                </div>

                                <div className="text-center mb-10">
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] mb-3 block">Legitimacy Verifier</span>
                                    <h3 className="text-2xl font-serif font-bold mb-2">{selectedCoin.name}</h3>
                                    <p className="text-xs text-gray-500 italic">Historical Winner: {selectedCoin.winner}</p>
                                </div>

                                <div className="space-y-6">
                                    <SpecRow label="Tournament" value={selectedCoin.tournament} />
                                    <SpecRow label="Allocation" value="Community SLL Mint" />
                                    <SpecRow label="Composition" value={selectedCoin.material} />
                                    <SpecRow label="Rarity Profile" value="Ultra Mythic (1/1)" />
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/5">
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-relaxed text-center">
                                        This artifact is cross-verifiable on the Block-Legacy chain. 
                                        Digital ownership enables special "Pillar 7" construction bonuses in the Metaverse.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 border border-white/5 rounded-[40px] bg-white/[0.01]">
                                <span className="text-4xl mb-6">🏛️</span>
                                <p className="text-sm font-bold text-gray-500 text-center uppercase tracking-widest leading-loose">
                                    Select an artifact from the archive to view its high-fidelity metadata.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </aside>
            </main>
        </div>
    );
}

function SpecRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{label}</span>
            <span className="text-xs font-bold text-white text-right">{value}</span>
        </div>
    );
}
