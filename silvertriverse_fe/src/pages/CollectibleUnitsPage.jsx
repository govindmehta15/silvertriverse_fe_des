import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCuEngine } from '../context/CuEngineContext';

// ─── Countdown hook ──────────────────────────────────────────────
function useCountdownTimer(targetMs) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);
    const diff = Math.max(0, targetMs - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return {
        formatted: diff <= 0 ? 'CLOSED' : `${h}h ${m}m ${s}s`,
        isUrgent: diff < 600000 && diff > 0,
        isExpired: diff <= 0,
    };
}

const RARITY = {
    standard: { bg: 'bg-zinc-700/30', text: 'text-zinc-300', border: 'border-zinc-500/20', label: 'Standard' },
    limited: { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-500/20', label: 'Limited' },
    collectors: { bg: 'bg-purple-900/30', text: 'text-purple-300', border: 'border-purple-500/20', label: "Collector's" },
    masterpiece: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/30', label: '✦ Masterpiece' },
};

// ═══════════════════════════════════════════════════════════════════
// SINGLE DROP CARD (clickable → detail page)
// ═══════════════════════════════════════════════════════════════════
function DropCard({ drop, onBid, userBid, onAllocate, onClick }) {
    const { formatted, isUrgent, isExpired } = useCountdownTimer(drop.closesAt);
    const rarity = RARITY[drop.cardRarity] || RARITY.standard;
    const hasBid = !!userBid;
    const canAllocate = drop.status === 'CLOSED' && drop.bidders.length > 0;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
            className="rounded-2xl border border-navy-700/30 overflow-hidden group transition-all hover:border-gold/30 cursor-pointer"
            style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(10,15,30,0.95) 100%)' }}>

            {/* Card Image (tap to go to detail) */}
            <div className="relative aspect-[4/3] overflow-hidden" onClick={onClick}>
                <img src={drop.cardImage} alt={drop.cardName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${rarity.bg} ${rarity.text} ${rarity.border}`}>{rarity.label}</span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded-full border backdrop-blur-md ${
                        isExpired ? 'bg-navy-900/80 border-navy-700/30 text-gray-400'
                        : isUrgent ? 'bg-red-900/70 border-red-500/30 text-red-300 animate-pulse'
                        : 'bg-navy-900/70 border-gold/20 text-gold'
                    }`}>{formatted}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-base">{drop.parentLogo}</span>
                    <span className="text-[8px] text-gray-300 uppercase tracking-widest font-bold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">{drop.parentTitle}</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-[8px] text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">{drop.totalCards} card{drop.totalCards > 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Info */}
            <div className="p-3.5" onClick={onClick}>
                <h3 className="font-serif text-sm font-bold text-white mb-0.5">{drop.cardName}</h3>
                <p className="text-gray-500 text-[10px] line-clamp-1 mb-2">{drop.cardDesc}</p>

                {/* PROMINENT BIDDER COUNT */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-800/50 border border-navy-700/20 mb-3">
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-white font-mono font-black text-xl">{drop.bidders.length.toLocaleString()}</span>
                            <span className="text-gray-500 text-[9px] uppercase">bidders</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-gray-600 text-[8px]">for</span>
                            <span className="text-gold font-mono font-bold text-xs">{drop.totalCards}</span>
                            <span className="text-gray-600 text-[8px]">cards</span>
                        </div>
                    </div>
                    {drop.bidders.length > drop.totalCards && (
                        <div className="text-right">
                            <span className="text-amber-400 font-mono font-bold text-sm block">{Math.round(drop.bidders.length / drop.totalCards)}x</span>
                            <span className="text-amber-500/60 text-[7px] uppercase">oversubscribed</span>
                        </div>
                    )}
                </div>

                {/* Price + Land utility */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-gold font-mono font-bold text-base">₹{drop.cardPrice}</span>
                    <span className="text-[8px] text-gray-500 flex items-center gap-1">🏗️ Land Power {drop.utility?.power || 5}</span>
                </div>
            </div>

            {/* Action */}
            <div className="px-3.5 pb-3.5">
                {drop.isLive && !hasBid && (
                    <button onClick={(e) => { e.stopPropagation(); onBid(drop.id); }}
                        className="w-full py-3 bg-gold text-black rounded-xl text-[10px] uppercase font-black tracking-[0.3em] hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(201,162,39,0.12)]">
                        BID ₹{drop.cardPrice}
                    </button>
                )}
                {drop.isLive && hasBid && userBid.status === 'BLOCKED' && (
                    <div className="py-2.5 bg-green-950/30 border border-green-700/20 rounded-xl text-center">
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">✓ BID PLACED — ₹{userBid.amount}</span>
                    </div>
                )}
                {canAllocate && (
                    <button onClick={(e) => { e.stopPropagation(); onAllocate(drop.id); }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-blue-500 transition-all animate-pulse">
                        🎲 ALLOCATE ({drop.bidders.length.toLocaleString()} bidders → {drop.totalCards} winners)
                    </button>
                )}
                {drop.status === 'ALLOCATED' && (
                    <div className="p-2.5 rounded-xl border border-gold/20 bg-gold/5 text-center">
                        <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-gold font-mono font-bold text-sm">🏆 {drop.allocated.length} Winners</span>
                            <span className="text-gray-500 text-[9px]">·</span>
                            <span className="text-gray-400 text-[9px]">{(drop.losersCount || drop.bidders.length - drop.allocated.length).toLocaleString()} refunded</span>
                        </div>
                        {userBid?.status === 'WON' && <span className="text-gold text-xs font-bold block">🎉 YOU WON!</span>}
                        {userBid?.status === 'REFUNDED' && <span className="text-gray-500 text-[9px] block">Not allocated · ₹{userBid.amount} refunded to you</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// DIGITAL SHELF
// ═══════════════════════════════════════════════════════════════════
function OwnedShelf({ category }) {
    const { ownedCards, formatPrice } = useCuEngine();
    const navigate = useNavigate();
    const filtered = ownedCards.filter(c => c.category === category);

    if (filtered.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <span className="text-5xl block mb-4 opacity-20">📦</span>
                <h3 className="text-gray-500 font-serif italic text-lg mb-2">Your shelf is empty</h3>
                <p className="text-gray-600 text-sm">Win a card allocation to see it here.</p>
            </div>
        );
    }

    return (
        <div className="px-4 max-w-4xl mx-auto py-6 space-y-4">
            <h2 className="font-serif text-xl text-gold font-bold uppercase tracking-wider">Your Cards ({filtered.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map(card => {
                    const rarity = RARITY[card.cardRarity] || RARITY.standard;
                    return (
                        <motion.div key={card.id} whileHover={{ y: -3 }} onClick={() => navigate(`/collectible-units/drop/${card.dropId}`)}
                            className="rounded-xl border border-gold/20 overflow-hidden hover:border-gold/40 transition-all cursor-pointer"
                            style={{ background: 'linear-gradient(180deg, rgba(201,162,39,0.04) 0%, rgba(10,15,30,0.95) 100%)' }}>
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={card.cardImage} alt={card.cardName} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                                <div className="absolute top-2 left-2">
                                    <span className={`text-[7px] px-2 py-0.5 rounded-full border ${rarity.bg} ${rarity.text} ${rarity.border}`}>{rarity.label}</span>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-gray-500 text-[8px] uppercase tracking-wider">{card.parentLogo} {card.parentTitle}</p>
                                <h4 className="font-serif text-sm font-bold text-white mt-0.5">{card.cardName}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gold font-mono text-xs font-bold">₹{card.acquiredPrice}</span>
                                    {card.utility && <span className="text-[8px] text-gray-500">{card.utility.icon} {card.utility.name}</span>}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
const DROP_FILTERS = [
    { value: 'all', label: 'All Drops' },
    { value: 'live', label: '🔴 Live Bidding' },
    { value: 'closed', label: '⏰ Closed' },
];

export default function CollectibleUnitsPage() {
    const { CATEGORIES, getDrops, placeBid, runAllocation, userBids, getStats } = useCuEngine();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('film');
    const [dropFilter, setDropFilter] = useState('all');
    const [view, setView] = useState('drops');

    const drops = getDrops(activeCategory, dropFilter);
    const stats = getStats(activeCategory);

    return (
        <div className="min-h-screen pb-20 relative">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/images/film_scifi.png" alt="" className="w-full h-full object-cover opacity-15" />
                    <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
                </div>
                <div className="relative px-4 pt-10 pb-6 max-w-4xl mx-auto text-center">
                    <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="font-serif text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold via-yellow-200 to-gold uppercase tracking-[0.1em]">
                        Collectible Units
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                        className="text-gray-400 text-sm tracking-[0.15em] uppercase mt-1">
                        Daily Card Drops · Bid ₹5–₹50 · Random Allocation
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="mt-3 flex items-center justify-center gap-1 flex-wrap">
                        {['🎴 Drop', '🔨 Bid', '⏰ Close', '🎲 Allocate', '✅ Win/Refund'].map((step, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[9px] text-gray-400 bg-navy-800/60 border border-navy-700/30 px-2 py-1 rounded-full">{step}</span>
                                {i < 4 && <span className="text-gold/20 text-[9px] mx-0.5">→</span>}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Categories + View */}
            <div className="px-4 max-w-4xl mx-auto mb-4 space-y-3">
                <div className="flex gap-2 justify-center">
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                                activeCategory === cat.id ? 'bg-gold/15 text-gold border-gold/40' : 'text-gray-400 border-navy-600/50 hover:border-gold/25'
                            }`}>{cat.icon} {cat.label}</button>
                    ))}
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => setView('drops')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                            view === 'drops' ? 'bg-white text-black border-white' : 'text-gray-400 border-navy-700/30 hover:text-white'
                        }`}>🎴 Today's Drops</button>
                    <button onClick={() => setView('shelf')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                            view === 'shelf' ? 'bg-white text-black border-white' : 'text-gray-400 border-navy-700/30 hover:text-white'
                        }`}>📦 My Shelf</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={`${activeCategory}_${view}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                    {view === 'shelf' && <OwnedShelf category={activeCategory} />}

                    {view === 'drops' && (
                        <div className="px-4 max-w-4xl mx-auto">
                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {[
                                    { label: 'Total Drops', value: stats.totalDrops },
                                    { label: 'Live Now', value: stats.liveDrops, color: 'text-green-400' },
                                    { label: 'Total Bids', value: stats.totalBids, color: 'text-gold' },
                                    { label: 'Allocated', value: stats.cardsAllocated },
                                ].map((s, i) => (
                                    <div key={i} className="text-center p-3 rounded-xl border border-navy-700/20" style={{ background: 'rgba(15,23,42,0.5)' }}>
                                        <span className={`font-mono font-bold text-lg ${s.color || 'text-white'}`}>{s.value}</span>
                                        <span className="block text-[7px] text-gray-600 uppercase tracking-widest mt-1">{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 mb-5">
                                {DROP_FILTERS.map(f => (
                                    <button key={f.value} onClick={() => setDropFilter(f.value)}
                                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                                            dropFilter === f.value ? 'bg-gold/15 text-gold border-gold/30' : 'text-gray-400 border-navy-700/30 hover:border-gold/20'
                                        }`}>{f.label}</button>
                                ))}
                            </div>

                            {drops.length === 0 ? (
                                <div className="text-center py-16">
                                    <span className="text-4xl block mb-4 opacity-20">🎴</span>
                                    <p className="text-gray-600 text-sm">No drops matching this filter.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {drops.map(drop => (
                                        <DropCard key={drop.id} drop={drop} userBid={userBids[drop.id]}
                                            onBid={placeBid} onAllocate={runAllocation}
                                            onClick={() => navigate(`/collectible-units/drop/${drop.id}`)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
