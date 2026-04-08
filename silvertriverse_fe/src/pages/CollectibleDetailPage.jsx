import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCuEngine } from '../context/CuEngineContext';

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

const RARITY_STYLES = {
    standard: { bg: 'bg-zinc-700/30', text: 'text-zinc-300', border: 'border-zinc-500/20', glow: '', label: 'Standard' },
    limited: { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-500/20', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.08)]', label: 'Limited Edition' },
    collectors: { bg: 'bg-purple-900/30', text: 'text-purple-300', border: 'border-purple-500/20', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.1)]', label: "Collector's Edition" },
    masterpiece: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/30', glow: 'shadow-[0_0_40px_rgba(201,162,39,0.12)]', label: '✦ Ultra Rare Masterpiece' },
};

const timeAgo = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
};

export default function CollectibleDetailPage() {
    const { dropId } = useParams();
    const navigate = useNavigate();
    const { getDrop, placeBid, runAllocation, userBids, formatPrice, RARITY_POWER } = useCuEngine();

    const drop = getDrop(dropId);
    const userBid = userBids[dropId];
    const { formatted, isUrgent, isExpired } = useCountdownTimer(drop?.closesAt || 0);
    const [showAllBidders, setShowAllBidders] = useState(false);

    if (!drop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="text-5xl block mb-4 opacity-20">🎴</span>
                    <h2 className="text-white text-xl font-serif mb-2">Drop Not Found</h2>
                    <button onClick={() => navigate('/collectible-units')} className="text-gold text-sm underline">← Back to all drops</button>
                </div>
            </div>
        );
    }

    const rarity = RARITY_STYLES[drop.cardRarity] || RARITY_STYLES.standard;
    const hasBid = !!userBid;
    const canAllocate = drop.status === 'CLOSED' && drop.bidders.length > 0;
    const oversubRatio = drop.totalCards > 0 ? Math.round(drop.bidders.length / drop.totalCards) : 0;
    const rarityPower = RARITY_POWER[drop.cardRarity] || RARITY_POWER.standard;

    const displayBidders = showAllBidders ? drop.bidders : drop.bidders.slice(0, 20);

    return (
        <div className="min-h-screen pb-20 relative">
            {/* ═══ HERO IMAGE ═══ */}
            <div className="relative h-[280px] overflow-hidden">
                <img src={drop.cardImage} alt={drop.cardName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-navy-950/60" />

                <button onClick={() => navigate('/collectible-units')}
                    className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm text-white hover:bg-black/70 transition-all z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>

                <div className="absolute top-4 right-4">
                    <span className={`text-xs font-mono px-3 py-1.5 rounded-full border backdrop-blur-md ${
                        isExpired ? 'bg-navy-900/80 border-navy-700/40 text-gray-400'
                        : isUrgent ? 'bg-red-900/70 border-red-500/30 text-red-300 animate-pulse'
                        : 'bg-navy-900/70 border-gold/20 text-gold'
                    }`}>{formatted}</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${rarity.bg} ${rarity.text} ${rarity.border}`}>{rarity.label}</span>
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                        <span className="text-lg">{drop.parentLogo}</span>
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{drop.parentTitle}</span>
                    </div>
                </div>
            </div>

            {/* ═══ CARD DETAILS ═══ */}
            <div className="px-4 max-w-2xl mx-auto -mt-6 relative z-10">
                <div className={`rounded-2xl border ${rarity.border} p-6 mb-5 ${rarity.glow}`}
                    style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(10,15,30,0.98) 100%)' }}>
                    <h1 className="font-serif text-2xl font-black text-white mb-1">{drop.cardName}</h1>
                    <p className="text-gray-400 text-sm mb-5 leading-relaxed">{drop.cardDesc}</p>

                    {/* ═══ BIG BIDDER vs CARDS DISPLAY ═══ */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/20">
                            <span className="text-white font-mono font-black text-3xl block">{drop.bidders.length.toLocaleString()}</span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mt-1">Total Bidders</span>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gold/5 border border-gold/20">
                            <span className="text-gold font-mono font-black text-3xl block">{drop.totalCards}</span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mt-1">Cards Available</span>
                        </div>
                    </div>

                    {/* Oversubscription bar */}
                    {oversubRatio > 1 && (
                        <div className="p-3.5 bg-amber-950/20 border border-amber-600/20 rounded-xl mb-5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-amber-400 text-xs font-bold">⚡ {oversubRatio}x OVERSUBSCRIBED</span>
                                <span className="text-amber-500/60 text-[9px]">{drop.bidders.length.toLocaleString()} bidders for {drop.totalCards} cards</span>
                            </div>
                            <div className="h-2 bg-amber-950/40 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${Math.min(100, (drop.totalCards / drop.bidders.length) * 100)}%` }} />
                            </div>
                            <p className="text-amber-600/60 text-[9px] mt-1.5">Only {((drop.totalCards / drop.bidders.length) * 100).toFixed(1)}% chance of allocation per bidder</p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                        {[
                            { label: 'PRICE', value: `₹${drop.cardPrice}`, color: 'text-gold' },
                            { label: 'EDITION', value: drop.cardEdition.toLocaleString() },
                            { label: 'LAND POWER', value: rarityPower.power, color: 'text-green-400' },
                            { label: 'STATUS', value: drop.status === 'ALLOCATED' ? 'DONE' : drop.isLive ? 'LIVE' : 'CLOSED', color: drop.isLive ? 'text-green-400' : drop.status === 'ALLOCATED' ? 'text-gold' : 'text-gray-400' },
                        ].map((s, i) => (
                            <div key={i} className="text-center p-2.5 rounded-xl bg-navy-800/40 border border-navy-700/20">
                                <span className={`font-mono font-bold text-sm block ${s.color || 'text-white'}`}>{s.value}</span>
                                <span className="text-[7px] text-gray-600 uppercase tracking-widest">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ═══ BIDDING ACTION ═══ */}
                    {drop.isLive && !hasBid && (
                        <>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => placeBid(drop.id)}
                                className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.3em] shadow-[0_0_30px_rgba(201,162,39,0.2)] hover:bg-yellow-300 transition-all">
                                BID ₹{drop.cardPrice} — BLOCK FUNDS
                            </motion.button>
                            <p className="text-gray-600 text-[10px] text-center mt-2">₹{drop.cardPrice} will be blocked. Refunded if not allocated.</p>
                        </>
                    )}
                    {hasBid && userBid.status === 'BLOCKED' && (
                        <div className="py-4 bg-green-950/30 border border-green-700/20 rounded-xl text-center">
                            <span className="text-green-400 text-sm font-bold">✓ BID PLACED</span>
                            <p className="text-green-600 text-xs mt-1">₹{userBid.amount} blocked · Waiting for allocation</p>
                        </div>
                    )}
                    {canAllocate && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => runAllocation(drop.id)}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm uppercase font-black tracking-[0.2em] hover:bg-blue-500 transition-all animate-pulse">
                            🎲 RUN RANDOM ALLOCATION — {drop.bidders.length.toLocaleString()} BIDDERS → {drop.totalCards} WINNERS
                        </motion.button>
                    )}
                    {drop.status === 'ALLOCATED' && userBid?.status === 'WON' && (
                        <div className="py-4 bg-gold/10 border border-gold/30 rounded-xl text-center">
                            <span className="text-gold text-lg font-bold">🎉 YOU WON THIS CARD!</span>
                            <p className="text-gold/60 text-xs mt-1">Added to your Digital Shelf · Use it on Land</p>
                        </div>
                    )}
                    {drop.status === 'ALLOCATED' && userBid?.status === 'REFUNDED' && (
                        <div className="py-4 bg-navy-800/40 border border-navy-700/20 rounded-xl text-center">
                            <span className="text-gray-400 text-sm font-bold">Not allocated — ₹{userBid.amount} refunded</span>
                        </div>
                    )}
                </div>

                {/* ═══ ALLOCATION RESULTS (after bid ends) ═══ */}
                {drop.status === 'ALLOCATED' && (
                    <div className="rounded-2xl border border-gold/20 p-5 mb-5" style={{ background: 'linear-gradient(180deg, rgba(201,162,39,0.04) 0%, rgba(10,15,30,0.95) 100%)' }}>
                        <h2 className="font-serif text-lg font-bold text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                            🏆 Allocation Results
                        </h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 rounded-xl bg-gold/5 border border-gold/20">
                                <span className="text-gold font-mono font-bold text-2xl block">{drop.allocated.length}</span>
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Winners</span>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-navy-800/40 border border-navy-700/20">
                                <span className="text-white font-mono font-bold text-2xl block">{(drop.losersCount || drop.bidders.length - drop.allocated.length).toLocaleString()}</span>
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Refunded</span>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-navy-800/40 border border-navy-700/20">
                                <span className="text-white font-mono font-bold text-2xl block">{drop.bidders.length.toLocaleString()}</span>
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Total Bids</span>
                            </div>
                        </div>

                        {/* Winner names list */}
                        <h3 className="text-[10px] text-gold uppercase tracking-widest font-bold mb-2">Allocated To:</h3>
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                            {(drop.allocatedNames || []).map((name, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gold/5 border border-gold/10">
                                    <span className="text-gold">🎴</span>
                                    <span className="text-white text-sm font-bold">{name}</span>
                                    <span className="text-gold text-[8px] ml-auto uppercase tracking-widest">Winner #{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ LAND UTILITY (only use case) ═══ */}
                <div className="rounded-2xl border border-navy-700/30 p-5 mb-5" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(10,15,30,0.95) 100%)' }}>
                    <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        🏗️ Utility — Land System
                    </h2>

                    <div className="p-4 rounded-xl border border-gold/20 bg-gold/5 mb-4">
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">🌍</span>
                            <div className="flex-1">
                                <h3 className="text-white text-sm font-bold">Land Construction Power</h3>
                                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{drop.utility?.desc || 'Use this collectible card as construction material on your SilverTriverse Land plot.'}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex items-center gap-1.5 flex-1">
                                        <span className="text-[8px] text-gray-600 uppercase tracking-widest">Power</span>
                                        <div className="flex-1 h-2.5 bg-navy-800/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-green-500 to-gold rounded-full transition-all" style={{ width: `${rarityPower.power * 2}%` }} />
                                        </div>
                                        <span className="text-gold text-sm font-mono font-bold">{rarityPower.power}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Power by rarity reference */}
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Power by rarity (admin-decided)</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(RARITY_POWER).map(([key, val]) => (
                            <div key={key} className={`text-center p-2.5 rounded-xl border transition-all ${
                                drop.cardRarity === key ? 'border-gold/30 bg-gold/5' : 'border-navy-700/20 bg-navy-800/20 opacity-50'
                            }`}>
                                <span className={`font-mono font-bold text-base block ${drop.cardRarity === key ? 'text-gold' : 'text-gray-400'}`}>{val.power}</span>
                                <span className="text-[7px] text-gray-500 uppercase tracking-widest block">{key}</span>
                                {drop.cardRarity === key && <span className="text-gold text-[7px] font-bold mt-1 block">This card</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ WHERE TO USE ═══ */}
                <div className="rounded-2xl border border-navy-700/30 p-5 mb-5" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(10,15,30,0.95) 100%)' }}>
                    <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        🗺️ Where To Use
                    </h2>
                    <div className="p-4 rounded-xl border border-green-700/20 bg-green-950/10">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">🌍</span>
                            <div>
                                <h3 className="text-green-400 text-sm font-bold">SilverTriverse Land</h3>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest">The only utility destination (decided by admin)</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-400">
                            <p>• Use as <strong className="text-white">construction material</strong> for buildings on your land plot</p>
                            <p>• Higher rarity = more <strong className="text-green-400">building power</strong> contributed</p>
                            <p>• Consumed on use — card is removed from your shelf</p>
                            <p>• Can be stacked with multiple cards for bigger structures</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-[9px] mt-3 text-center italic">Future utility destinations will be unlocked by admin updates.</p>
                </div>

                {/* ═══ BIDDERS LIST ═══ */}
                <div className="rounded-2xl border border-navy-700/30 p-5 mb-5" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(10,15,30,0.95) 100%)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            👥 All Bidders ({drop.bidders.length.toLocaleString()})
                        </h2>
                        <span className="text-amber-400 text-[9px] font-mono">{drop.totalCards} slots</span>
                    </div>

                    {drop.bidders.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-3xl block mb-2 opacity-20">🤷</span>
                            <p className="text-gray-600 text-sm">No bids yet. Be the first!</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
                                {displayBidders.sort((a, b) => b.time - a.time).map((bidder, i) => {
                                    const isWinner = drop.status === 'ALLOCATED' && drop.allocated?.includes(bidder.userId);
                                    const isYou = bidder.name === 'You';
                                    return (
                                        <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                                            isWinner ? 'border-gold/30 bg-gold/5' : isYou ? 'border-green-500/20 bg-green-950/10' : 'border-navy-700/15 bg-navy-800/15'
                                        }`}>
                                            <span className="text-lg">{bidder.avatar}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white text-sm font-bold">{bidder.name}</span>
                                                    {isYou && <span className="text-green-400 text-[8px] font-bold uppercase px-1.5 py-0.5 border border-green-500/20 rounded-full">You</span>}
                                                    {isWinner && <span className="text-gold text-[8px] font-bold uppercase px-1.5 py-0.5 border border-gold/30 rounded-full bg-gold/10">🎉 Winner</span>}
                                                </div>
                                                <span className="text-gray-500 text-[9px]">{timeAgo(bidder.time)}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-gold font-mono text-xs font-bold">₹{bidder.amount}</span>
                                                <span className="block text-[7px] text-gray-600 uppercase">blocked</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {drop.bidders.length > 20 && !showAllBidders && (
                                <button onClick={() => setShowAllBidders(true)}
                                    className="w-full mt-3 py-2.5 text-center text-[10px] text-gold font-bold uppercase tracking-widest border border-gold/20 rounded-xl hover:bg-gold/5 transition-all">
                                    Show All {drop.bidders.length.toLocaleString()} Bidders
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* ═══ HOW IT WORKS ═══ */}
                <div className="rounded-2xl border border-navy-700/30 p-5" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(10,15,30,0.95) 100%)' }}>
                    <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        ℹ️ How IPO Allocation Works
                    </h2>
                    <div className="space-y-3">
                        {[
                            { step: '1', title: 'Cards Released Daily', desc: 'Admin releases a batch of collectible cards with a 4-hour bidding window.' },
                            { step: '2', title: 'Users Place Bids', desc: `Bid ₹${drop.cardPrice} to enter. Funds are blocked as a mandate — not charged yet.` },
                            { step: '3', title: 'Bidding Closes', desc: `${drop.bidders.length.toLocaleString()} users have bid for just ${drop.totalCards} cards.` },
                            { step: '4', title: 'Random Allocation', desc: `System randomly picks ${drop.totalCards} winners from all bidders. No preference or priority.` },
                            { step: '5', title: 'Winners & Refunds', desc: 'Winners get the card on their Digital Shelf. Everyone else gets a full automatic refund.' },
                            { step: '6', title: 'Use on Land', desc: 'Winners can use the card as construction material on their SilverTriverse Land plot.' },
                        ].map(s => (
                            <div key={s.step} className="flex gap-3 items-start">
                                <span className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0">{s.step}</span>
                                <div>
                                    <h4 className="text-white text-sm font-bold">{s.title}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
