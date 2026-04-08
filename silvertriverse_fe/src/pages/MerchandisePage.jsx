import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

const PILLARS = [
    { id: 'yours', name: 'YOURS', icon: '✨', label: 'PARTICIPATION DROPS', desc: 'Limited drops. Allocation-based. Prove intent, participate, and let the algorithm decide ownership.', emotion: 'Hope', color: 'from-gold/20 to-amber-900/10', border: 'border-gold/20 hover:border-gold/50', path: '/merchandise/yours' },
    { id: 'ours', name: 'OURS', icon: '🔗', label: 'CHAIN ECONOMY', desc: 'Buy in early. Earn backward-flowing rewards as more users enter the chain after you.', emotion: 'Early Advantage', color: 'from-emerald-900/20 to-emerald-950/10', border: 'border-emerald-700/20 hover:border-emerald-500/40', path: '/merchandise/ours' },
    { id: 'zywh', name: 'ZYWH', icon: '🧩', label: 'MYSTERY ATELIER', desc: 'Decode the hidden price digit-by-digit. Only qualified decoders enter the exclusive auction.', emotion: 'Curiosity', color: 'from-purple-900/20 to-purple-950/10', border: 'border-purple-700/20 hover:border-purple-500/40', path: '/merchandise/zywh' },
    { id: 'desire', name: 'DESIRE', icon: '🏆', label: 'ELITE MARKETPLACE', desc: 'The pinnacle of rarity. Direct acquire or live auction for the most exclusive artifacts.', emotion: 'Ownership', color: 'from-rose-900/20 to-rose-950/10', border: 'border-rose-700/20 hover:border-rose-500/40', path: '/merchandise/desire' },
];

const STATS = [
    { label: 'Total Releases', value: '156' },
    { label: 'Active Participants', value: '2.4K' },
    { label: 'Atelier Status', value: 'LIVE', color: 'text-emerald-400' },
];

export default function MerchandisePage() {
    const navigate = useNavigate();
    const { ownedMerch } = useMerchEngine();

    return (
        <div className="min-h-screen pb-20">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
                </div>
                <div className="relative px-4 pt-12 pb-8 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
                        <span className="h-[1.5px] w-12 bg-gold/40" />
                        <span className="text-gold/60 text-[10px] font-black uppercase tracking-[0.5em]">Multiverse Atelier</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold via-yellow-200 to-gold uppercase tracking-[0.05em] italic">
                        Merchandise
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                        className="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed italic">
                        Beyond shopping. Beyond listings. A multi-layer engagement economy where products are entry points into value systems.
                    </motion.p>

                    {/* Flow steps */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="mt-5 flex items-center gap-1.5 flex-wrap">
                        {['🎴 Participate', '🔨 Compete', '🧩 Discover', '✅ Own'].map((step, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[9px] text-gray-400 bg-navy-800/60 border border-navy-700/30 px-2.5 py-1 rounded-full">{step}</span>
                                {i < 3 && <span className="text-gold/20 text-[9px] mx-1">→</span>}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Pillar Grid */}
            <div className="px-4 max-w-5xl mx-auto mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {PILLARS.map((pillar, idx) => (
                        <motion.div key={pillar.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            onClick={() => navigate(pillar.path)}
                            className={`rounded-2xl border p-7 cursor-pointer group transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br ${pillar.color} ${pillar.border}`}
                            style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(10,15,30,0.95) 100%)' }}>

                            <div className="flex items-start justify-between mb-6">
                                <span className="text-[9px] font-bold text-gold/60 uppercase tracking-[0.4em]">{pillar.label}</span>
                                <span className="text-3xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{pillar.icon}</span>
                            </div>

                            <h2 className="font-serif text-4xl font-black text-white italic uppercase mb-2 group-hover:text-gold transition-colors duration-500">{pillar.name}</h2>
                            <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-sm">{pillar.desc}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-navy-800/50 border border-navy-700/20 text-gray-400">
                                    Emotion: {pillar.emotion}
                                </span>
                                <span className="text-[9px] text-gold/50 font-bold uppercase tracking-widest group-hover:text-gold transition-colors flex items-center gap-1">
                                    Enter →
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-12 pt-8 border-t border-navy-700/20 flex flex-wrap gap-12 justify-center">
                    {STATS.map((s, i) => (
                        <div key={i} className="text-center">
                            <span className="block text-[8px] font-bold text-gray-600 uppercase tracking-[0.4em] mb-2">{s.label}</span>
                            <span className={`text-2xl font-black italic font-serif ${s.color || 'text-gold'}`}>{s.value}</span>
                        </div>
                    ))}
                </div>

                {/* Design Philosophy */}
                <div className="mt-12 p-6 rounded-2xl border border-navy-700/20 text-center" style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <h3 className="text-white font-serif text-lg font-bold mb-3 uppercase tracking-wider">Not Shopping. Not E-Commerce.</h3>
                    <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                        {[
                            { label: 'YOURS', feel: '🙏 Hope' },
                            { label: 'OURS', feel: '⚡ Advantage' },
                            { label: 'ZYWH', feel: '🔮 Curiosity' },
                            { label: 'DESIRE', feel: '👑 Ownership' },
                        ].map(e => (
                            <div key={e.label} className="p-2.5 rounded-xl bg-navy-800/30 border border-navy-700/15">
                                <span className="block text-white text-xs font-bold">{e.label}</span>
                                <span className="text-[8px] text-gray-500">{e.feel}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600 text-[9px] mt-3 italic uppercase tracking-widest">Gaming + Investing + Culture</p>
                </div>
            </div>
            {/* Bottom: Digital Shelf Access */}
            <div className="px-4 max-w-4xl mx-auto mt-12 pb-20">
                <div className="p-6 rounded-3xl border border-navy-700/30 bg-navy-900/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-3xl">🗂️</div>
                        <div>
                            <h3 className="text-white font-serif text-xl font-bold">Your Digital Shelf</h3>
                            <p className="text-gray-500 text-xs">Access all items acquired across YOURS, OURS, ZYWH, and DESIRE.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center px-4">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Owned Assets</span>
                            <span className="text-white font-mono font-bold text-xl">{ownedMerch?.length || 0}</span>
                        </div>
                        <button onClick={() => navigate('/merchandise/shelf')}
                            className="px-8 py-3 bg-white text-black rounded-xl text-xs uppercase font-black tracking-widest hover:bg-gold transition-all">
                            Open Shelf
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
