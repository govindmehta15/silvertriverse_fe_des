import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

function useCountdown(targetMs) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, targetMs - now);
    const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
    return { formatted: diff <= 0 ? 'CLOSED' : `${h}h ${m}m ${s}s`, isExpired: diff <= 0, isUrgent: diff < 600000 && diff > 0 };
}

const YOURS_CATEGORIES = ['Film Inspired', 'Goddess of India', 'Global Style', 'Celebrity Inspired'];

export default function MerchYoursPage() {
    const { yoursDrops, yoursParticipations, participateYours, runYoursAllocation, formatPrice } = useMerchEngine();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Film Inspired');
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [resultModal, setResultModal] = useState(null);
    const [subFilter, setSubFilter] = useState('All');

    const filtered = yoursDrops.filter(d => {
        if (d.category !== filter) return false;
        if (filter === 'Goddess of India' && subFilter !== 'All') {
            return d.subCategory === subFilter;
        }
        return true;
    }).sort((a, b) => a.isLive === b.isLive ? 0 : a.isLive ? -1 : 1);

    const goddessList = ['All', 'Saraswati', 'Lakshmi', 'Parvati', 'Durga', 'Sita', 'Ganga', 'Meenakshi', 'Draupadi', 'Savitri', 'Ahalya', 'Devayani', 'Arundhati'];

    const handleParticipate = async (dropId) => {
        const result = await participateYours(dropId);
        if (result.success) setResultModal({ type: 'participated', amount: result.blocked });
    };

    const handleAllocate = (dropId) => {
        runYoursAllocation(dropId);
        const part = yoursParticipations[dropId];
        setTimeout(() => {
            const drop = yoursDrops.find(d => d.id === dropId);
            // Refresh will show result
        }, 100);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-navy-950/80 to-navy-950" />
                <div className="relative px-4 pt-8 pb-6 max-w-4xl mx-auto">
                    <button onClick={() => navigate('/merchandise')} className="text-gold text-[9px] font-bold uppercase tracking-[0.4em] hover:underline mb-4 block">← Atelier</button>
                    <h1 className="font-serif text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold uppercase italic">YOURS</h1>
                    <p className="text-gray-500 text-xs mt-2 italic max-w-lg">Limited drops. Allocation-based participation. Prove intent → mandate block → algorithm decides ownership.</p>
                    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
                        {YOURS_CATEGORIES.map(f => (
                            <button key={f} onClick={() => { setFilter(f); setSubFilter('All'); }}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                                    filter === f ? 'bg-gold/15 text-gold border-gold/30 shadow-[0_0_10px_rgba(201,162,39,0.1)]' : 'text-gray-400 border-navy-700/30 hover:border-gold/20'
                                }`}>{f}</button>
                        ))}
                    </div>

                    {filter === 'Goddess of India' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
                            className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2 pt-2 border-t border-navy-700/20">
                            {goddessList.map(g => (
                                <button key={g} onClick={() => setSubFilter(g)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter border transition-all whitespace-nowrap ${
                                        subFilter === g ? 'bg-purple-900/40 text-purple-300 border-purple-500/40' : 'text-gray-500 border-navy-700/20 hover:border-purple-500/20'
                                    }`}>{g}</button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Drops Grid */}
            <div className="px-4 max-w-4xl mx-auto mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filtered.map(drop => <DropCard key={drop.id} drop={drop} participation={yoursParticipations[drop.id]}
                        onParticipate={handleParticipate} onAllocate={handleAllocate} onSelect={(d) => navigate(`/merchandise/detail/yours/${d.id}`)} formatPrice={formatPrice} />)}
                </div>
            </div>

            {/* Detail Modal Removed - Using Dedicated Page */}

            {/* Result Modal */}
            <AnimatePresence>
                {resultModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setResultModal(null)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-navy-900 border border-gold/30 rounded-2xl p-8 max-w-sm w-full text-center"
                            onClick={e => e.stopPropagation()}>
                            <span className="text-5xl block mb-4">✓</span>
                            <h3 className="text-white font-serif text-xl font-bold mb-2">Participation Registered</h3>
                            <p className="text-gold text-sm font-mono mb-4">{formatPrice(resultModal.amount)} blocked as mandate</p>
                            <p className="text-gray-500 text-xs mb-6">Your funds are blocked. If you're not selected by the algorithm, you'll get a full refund.</p>
                            <button onClick={() => setResultModal(null)} className="w-full py-3 bg-gold text-black rounded-xl text-xs uppercase font-bold tracking-widest">Got It</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DropCard({ drop, participation, onParticipate, onAllocate, onSelect, formatPrice }) {
    const { formatted, isExpired, isUrgent } = useCountdown(drop.closesAt);
    const hasPart = !!participation;
    const canAllocate = drop.status === 'CLOSED' && drop.participants.length > 0;
    const overSub = drop.participants.length > drop.totalUnits ? Math.round(drop.participants.length / drop.totalUnits) : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-navy-700/30 overflow-hidden group hover:border-gold/30 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(10,15,30,0.95) 100%)' }}>

            <div className="relative aspect-[4/3] overflow-hidden" onClick={() => onSelect(drop)}>
                <img src={drop.image} alt={drop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded-full border backdrop-blur-md ${
                        isExpired ? 'bg-navy-900/80 border-navy-700/30 text-gray-400'
                        : isUrgent ? 'bg-red-900/70 border-red-500/30 text-red-300 animate-pulse'
                        : 'bg-navy-900/70 border-gold/20 text-gold'
                    }`}>{formatted}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">{drop.filmReference}</span>
                </div>
                <div className="absolute top-2.5 left-2.5">
                    <span className="text-[8px] font-bold text-black bg-gold px-2 py-0.5 rounded-full uppercase tracking-wider">Limited Edition</span>
                </div>
            </div>

            <div className="p-3.5" onClick={() => onSelect(drop)}>
                <h3 className="font-serif text-sm font-bold text-white mb-1">{drop.title}</h3>

                {/* Participants count */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-800/50 border border-navy-700/20 mb-3">
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-white font-mono font-black text-lg">{drop.participants.length.toLocaleString()}</span>
                            <span className="text-gray-500 text-[9px] uppercase">participants</span>
                        </div>
                        <span className="text-gray-600 text-[8px]">for {drop.totalUnits} units</span>
                    </div>
                    {drop.category === 'Goddess of India' && (
                        <div className="text-right">
                            <span className="text-purple-400 font-bold text-[10px] block uppercase tracking-tighter">{drop.subCategory}</span>
                            <span className="text-gray-600 text-[7px] uppercase italic">Divine Spirit</span>
                        </div>
                    )}
                    {overSub > 1 && drop.category !== 'Goddess of India' && (
                        <div className="text-right">
                            <span className="text-amber-400 font-mono font-bold text-sm block">{overSub}x</span>
                            <span className="text-amber-500/60 text-[7px] uppercase">oversubscribed</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-1">
                    <span className="text-gold font-mono font-bold text-base">{formatPrice(drop.price)}</span>
                    <span className="text-[8px] text-green-400">Reward Pool: {formatPrice(drop.rewardPool)}</span>
                </div>
            </div>

            <div className="px-3.5 pb-3.5">
                {drop.isLive && !hasPart && (
                    <button onClick={(e) => { e.stopPropagation(); onParticipate(drop.id); }}
                        className="w-full py-3 bg-gold text-black rounded-xl text-[10px] uppercase font-black tracking-[0.3em] hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(201,162,39,0.12)]">
                        PARTICIPATE
                    </button>
                )}
                {hasPart && participation.status === 'ACTIVE' && (
                    <div className="py-2.5 bg-green-950/30 border border-green-700/20 rounded-xl text-center">
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">✓ PARTICIPATING — {formatPrice(participation.amount)}</span>
                    </div>
                )}
                {canAllocate && (
                    <button onClick={(e) => { e.stopPropagation(); onAllocate(drop.id); }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-blue-500 transition-all animate-pulse">
                        🎲 RUN ALLOCATION ({drop.participants.length.toLocaleString()} → {drop.totalUnits})
                    </button>
                )}
                {drop.status === 'ALLOCATED' && (
                    <div className="p-2.5 rounded-xl border border-gold/20 bg-gold/5 text-center">
                        <span className="text-gold font-mono font-bold text-sm">🏆 {drop.allocated.length} Winners</span>
                        {participation?.status === 'WON' && <span className="text-gold text-xs font-bold block mt-1">🎉 YOU GOT THE MERCH!</span>}
                        {participation?.status === 'RELEASED' && <span className="text-gray-500 text-[9px] block mt-1">Not allocated · Mandate released</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function DetailModal({ drop, onClose, participation, onParticipate, onAllocate, formatPrice }) {
    const { formatted, isExpired } = useCountdown(drop.closesAt);
    const hasPart = !!participation;
    const canAllocate = drop.status === 'CLOSED' && drop.participants.length > 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="bg-navy-900 border border-gold/20 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>

                <div className="relative h-[200px] overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
                    <img src={drop.image} alt={drop.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white border border-white/10">✕</button>
                    <div className="absolute bottom-4 left-4">
                        <span className="text-[8px] text-gold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-gold/20">{drop.filmReference}</span>
                    </div>
                </div>

                <div className="p-5">
                    <h2 className="font-serif text-xl font-bold text-white mb-2">{drop.title}</h2>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{drop.story}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { label: 'PRICE', value: formatPrice(drop.price), color: 'text-gold' },
                            { label: 'UNITS', value: drop.totalUnits },
                            { label: 'PARTICIPANTS', value: drop.participants.length.toLocaleString() },
                        ].map((s, i) => (
                            <div key={i} className="text-center p-2.5 rounded-xl bg-navy-800/40 border border-navy-700/20">
                                <span className={`font-mono font-bold text-sm block ${s.color || 'text-white'}`}>{s.value}</span>
                                <span className="text-[7px] text-gray-600 uppercase tracking-widest">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-navy-800/30 rounded-xl border border-navy-700/20 mb-4">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                            <span className="text-gray-500">Timer</span>
                            <span className={isExpired ? 'text-gray-400' : 'text-gold font-mono'}>{formatted}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest mt-2">
                            <span className="text-gray-500">Reward Pool</span>
                            <span className="text-green-400">{formatPrice(drop.rewardPool)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest mt-2">
                            <span className="text-gray-500">Edition</span>
                            <span className="text-gray-300">{drop.serialNumber} / {drop.editionSize}</span>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="mb-4 p-3 rounded-xl border border-navy-700/20 bg-navy-800/20">
                        <h4 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">How YOURS Works</h4>
                        <div className="space-y-1.5 text-[10px] text-gray-500 leading-relaxed">
                            <p>1. <strong className="text-gray-300">Participate</strong> — Your {formatPrice(drop.price)} is blocked as a mandate</p>
                            <p>2. <strong className="text-gray-300">Algorithm Runs</strong> — Random selection from all participants</p>
                            <p>3. <strong className="text-gray-300">Winner</strong> — You receive the merch + reward value</p>
                            <p>4. <strong className="text-gray-300">Non-winner</strong> — Full mandate released + indirect reward value</p>
                        </div>
                    </div>

                    {/* Action */}
                    {drop.isLive && !hasPart && (
                        <button onClick={() => onParticipate(drop.id)}
                            className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.3em] shadow-[0_0_30px_rgba(201,162,39,0.2)] hover:bg-yellow-300 transition-all">
                            PARTICIPATE — BLOCK {formatPrice(drop.price)}
                        </button>
                    )}
                    {hasPart && participation.status === 'ACTIVE' && (
                        <div className="py-4 bg-green-950/30 border border-green-700/20 rounded-xl text-center">
                            <span className="text-green-400 text-sm font-bold">✓ Participating — Mandate Active</span>
                        </div>
                    )}
                    {canAllocate && (
                        <button onClick={() => onAllocate(drop.id)}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm uppercase font-black tracking-[0.2em] animate-pulse">
                            🎲 RUN ALLOCATION
                        </button>
                    )}
                    {drop.status === 'ALLOCATED' && participation?.status === 'WON' && (
                        <div className="py-4 bg-gold/10 border border-gold/30 rounded-xl text-center">
                            <span className="text-gold text-lg font-bold">🎉 YOU GOT THE MERCH!</span>
                        </div>
                    )}
                    {drop.status === 'ALLOCATED' && participation?.status === 'RELEASED' && (
                        <div className="py-4 bg-navy-800/40 border border-navy-700/20 rounded-xl text-center">
                            <span className="text-gray-400 text-sm">Not allocated — {formatPrice(participation.amount)} released</span>
                            <p className="text-gray-600 text-xs mt-1">You still gained indirect reward value</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
