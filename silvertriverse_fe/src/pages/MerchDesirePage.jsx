import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

const RARITY_STYLES = {
    legendary: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/30', glow: 'shadow-[0_0_30px_rgba(201,162,39,0.1)]' },
    'ultra-rare': { bg: 'bg-purple-900/20', text: 'text-purple-300', border: 'border-purple-500/20' },
    rare: { bg: 'bg-blue-900/20', text: 'text-blue-300', border: 'border-blue-500/20' },
    limited: { bg: 'bg-zinc-800/20', text: 'text-zinc-300', border: 'border-zinc-500/20' },
};

function useTimer(targetMs) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, (targetMs || 0) - now);
    const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
    return { formatted: diff <= 0 ? 'ENDED' : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, isExpired: diff <= 0 };
}

export default function MerchDesirePage() {
    const { desireListings, desireBids, bidDesire, acquireDesire, formatPrice } = useMerchEngine();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('all');
    const [actionResult, setActionResult] = useState(null);

    const filtered = desireListings.filter(l => {
        if (filter === 'auction') return l.isAuction;
        if (filter === 'direct') return !l.isAuction;
        return true;
    });

    const handleBid = async (listingId, amount) => {
        const result = await bidDesire(listingId, amount);
        if (result.success) setActionResult({ type: 'bid', amount });
    };

    const handleAcquire = async (listingId) => {
        const result = await acquireDesire(listingId);
        if (result.success) setActionResult({ type: 'acquired' });
    };

    // if (selectedItem) {
    //     return <DesireDetail item={selectedItem} bid={desireBids[selectedItem.id]}
    //         onBack={() => setSelectedItem(null)} onBid={handleBid} onAcquire={handleAcquire} formatPrice={formatPrice} />;
    // }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-950/15 via-navy-950/80 to-navy-950" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[120px]" />
                <div className="relative px-4 pt-8 pb-6 max-w-4xl mx-auto">
                    <button onClick={() => navigate('/merchandise')} className="text-gold text-[9px] font-bold uppercase tracking-[0.4em] hover:underline mb-4 block">← Atelier</button>
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="font-serif text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold uppercase italic">DESIRE</h1>
                            <p className="text-gray-500 text-xs mt-2 italic max-w-md">The pinnacle of digital rarity. Direct acquire or live auction for the most exclusive artifacts.</p>
                        </div>
                        <div className="text-center p-3 rounded-2xl border border-gold/15 bg-gold/5">
                            <span className="text-[7px] text-gray-600 uppercase tracking-widest block">Total Supply</span>
                            <span className="text-gold font-mono font-black text-xl">{desireListings.length} Units</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mt-4">
                        {['all', 'auction', 'direct'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                    filter === f ? 'bg-gold/15 text-gold border-gold/30' : 'text-gray-400 border-navy-700/30 hover:border-gold/20'
                                }`}>{f === 'all' ? 'All' : f === 'auction' ? '🔨 Auction' : '💎 Direct'}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="px-4 max-w-4xl mx-auto mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filtered.map((item, idx) => {
                        const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.limited;
                        return (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => navigate(`/merchandise/detail/desire/${item.id}`)}
                                className={`rounded-2xl border overflow-hidden cursor-pointer group hover:border-gold/40 transition-all hover:-translate-y-1 ${rarity.border} ${rarity.glow || ''}`}
                                style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(10,15,30,0.98) 100%)' }}>

                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm border ${rarity.bg} ${rarity.text} ${rarity.border}`}>
                                            {item.rarity}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <div className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
                                            <span className="text-[7px] text-rose-400 font-bold block uppercase tracking-widest leading-none mb-0.5">Util Pwr</span>
                                            <span className="text-white font-mono font-bold text-xs">+{item.utilityPower}</span>
                                        </div>
                                    </div>
                                    <span className="absolute top-3 right-12 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm bg-black/50 text-gold border border-gold/20">
                                        {item.editionSize <= 1 ? '1 of 1' : `1 of ${item.editionSize}`}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">{item.filmReference}</span>
                                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors mt-1 mb-3">{item.title}</h3>

                                    <div className="flex justify-between items-end pt-3 border-t border-navy-700/15">
                                        <div>
                                            <span className="text-[7px] text-gray-600 uppercase tracking-widest block">
                                                {item.isAuction ? 'Current Bid' : 'Valuation'}
                                            </span>
                                            <span className="text-gold font-mono font-bold text-lg">
                                                {formatPrice(item.isAuction ? item.currentBid : item.price)}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            {item.isAuction ? (
                                                <span className="text-[9px] text-amber-400 font-bold uppercase animate-pulse">🔴 Live Auction</span>
                                            ) : (
                                                <span className="text-[9px] text-emerald-400 font-bold uppercase">💎 Direct Acquire</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Action Result Modal */}
            <AnimatePresence>
                {actionResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setActionResult(null)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-navy-900 border border-gold/30 rounded-2xl p-8 max-w-sm w-full text-center"
                            onClick={e => e.stopPropagation()}>
                            <span className="text-5xl block mb-4">{actionResult.type === 'acquired' ? '👑' : '🔨'}</span>
                            <h3 className="text-white font-serif text-xl font-bold mb-2">
                                {actionResult.type === 'acquired' ? 'Masterpiece Acquired!' : 'Bid Placed!'}
                            </h3>
                            <p className="text-gray-500 text-xs mb-6">
                                {actionResult.type === 'acquired' ? 'Added to your Digital Shelf.' : `Your bid of ${formatPrice(actionResult.amount)} is active.`}
                            </p>
                            <button onClick={() => { setActionResult(null); setSelectedItem(null); }}
                                className="w-full py-3 bg-gold text-black rounded-xl text-xs uppercase font-bold tracking-widest">Done</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DesireDetail({ item, bid, onBack, onBid, onAcquire, formatPrice }) {
    const { formatted } = useTimer(item.auctionEndsAt);
    const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.limited;
    const hasBid = !!bid;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[320px] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/20" />
                <button onClick={onBack} className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm text-white z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${rarity.bg} ${rarity.text} ${rarity.border}`}>{item.rarity}</span>
                    <span className="text-[8px] text-gold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/20">{item.editionSize <= 1 ? '1 of 1' : `1 of ${item.editionSize}`}</span>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 max-w-2xl mx-auto -mt-6 relative z-10">
                <div className="rounded-2xl border border-gold/20 p-6 mb-5"
                    style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(10,15,30,0.98) 100%)' }}>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">{item.filmReference}</span>
                    <h1 className="font-serif text-2xl font-black text-white mb-2">{item.title}</h1>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.story}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-navy-800/40 border border-navy-700/20">
                            <span className="text-[7px] text-gray-600 uppercase tracking-widest block">Rarity Index</span>
                            <span className="text-white font-mono font-bold text-lg">{item.rarity === 'legendary' ? '99.9%' : item.rarity === 'ultra-rare' ? '95%' : '85%'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-navy-800/40 border border-navy-700/20">
                            <span className="text-[7px] text-gray-600 uppercase tracking-widest block">Verified Owners</span>
                            <span className="text-white font-mono font-bold text-lg">0</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {[
                            { label: 'Material', value: item.materialDetails },
                            { label: 'Origin', value: item.artisanOrigin },
                            { label: 'Serial', value: item.serialNumber },
                            { label: 'Edition', value: `${item.editionSize} units` },
                        ].map((d, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-navy-800/20 border border-navy-700/10">
                                <span className="text-[7px] text-gray-600 uppercase tracking-widest block">{d.label}</span>
                                <span className="text-gray-300 text-xs font-bold">{d.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Auction or Direct */}
                    {item.isAuction ? (
                        <div className="rounded-xl border border-gold/20 p-5 bg-gold/3 mb-5">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block animate-pulse">Live Bidding Active</span>
                                    <span className="text-gold font-mono font-black text-3xl">{formatPrice(item.currentBid)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block">Time Left</span>
                                    <span className="text-emerald-400 font-mono font-bold text-xl">{formatted}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] text-gray-500 mb-4">
                                <span>{item.bidders} bidders active</span>
                                <span className="h-3 w-px bg-gray-700" />
                                <span>Leading: {item.bidders > 0 ? 'Anonymous' : 'No bids'}</span>
                            </div>

                            {!hasBid ? (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => onBid(item.id, Math.floor(item.currentBid * 1.05))}
                                    className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.3em] shadow-[0_0_30px_rgba(201,162,39,0.15)] hover:bg-yellow-300 transition-all">
                                    PLACE BID — {formatPrice(Math.floor(item.currentBid * 1.05))}
                                </motion.button>
                            ) : (
                                <div className="py-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center">
                                    <span className="text-emerald-400 font-bold text-sm">✓ Bid Active — {formatPrice(bid.amount)}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-navy-700/20 p-5 mb-5">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block">Sovereign Valuation</span>
                                    <span className="text-gold font-mono font-black text-3xl">{formatPrice(item.price)}</span>
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => onAcquire(item.id)}
                                className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.3em] hover:bg-yellow-300 transition-all">
                                ACQUIRE MASTERPIECE
                            </motion.button>
                        </div>
                    )}

                    {/* Provenance */}
                    <div className="p-4 rounded-xl border border-cyan-900/20 bg-cyan-950/10">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⬡</span>
                            <div>
                                <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Authenticated by Desire Protocol</p>
                                <p className="text-gray-500 text-[10px]">Ownership transfers to your Digital Shelf upon acquisition.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
