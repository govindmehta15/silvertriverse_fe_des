import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

const PILLAR_THEMES = {
    yours: { name: 'YOURS', accent: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/30', glow: 'shadow-gold/20' },
    ours: { name: 'OURS', accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
    zywh: { name: 'ZYWH', accent: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
    desire: { name: 'DESIRE', accent: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
};

const StockChart = ({ data, color = '#fbbf24', height = 100 }) => {
    if (!data || data.length < 2) return <div className="h-[100px] flex items-center justify-center text-gray-700 text-[10px] uppercase font-mono tracking-widest bg-navy-900/40 rounded-xl border border-white/5 italic">Initializing Index...</div>;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = range * 0.1;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 300;
        const y = height - ((val - (min - padding)) / (range + padding * 2)) * height;
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    return (
        <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 300 ${height}`} className="w-full h-full preserve-3d">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    d={`${pathData} L 300,${height} L 0,${height} Z`}
                    fill={`url(#grad-${color})`}
                />
                <motion.circle
                    cx={300}
                    cy={data[data.length - 1] ? height - ((data[data.length - 1] - (min - padding)) / (range + padding * 2)) * height : 0}
                    r="3"
                    fill={color}
                    animate={{ r: [3, 6, 3], opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </svg>
        </div>
    );
};

export default function MerchDetailPage() {
    const { pillar, id } = useParams();
    const navigate = useNavigate();
    const { getMerchItem, formatPrice, participateYours, enterOursChain, bidDesire, acquireDesire, oursPositions } = useMerchEngine();

    const [item, setItem] = useState(null);
    const [activeTab, setActiveTab] = useState('narrative'); // narrative | craft | authenticity
    const [actionLoading, setActionLoading] = useState(false);
    const [showBooklet, setShowBooklet] = useState(false);

    useEffect(() => {
        const found = getMerchItem(pillar, id);
        if (found) setItem(found);
    }, [pillar, id, getMerchItem]);

    if (!item) return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gold font-serif italic">Accessing Atelier Archives...</p>
            </div>
        </div>
    );

    const theme = PILLAR_THEMES[pillar] || PILLAR_THEMES.yours;

    const handleAction = async () => {
        setActionLoading(true);
        try {
            if (pillar === 'yours') await participateYours(item.id);
            if (pillar === 'ours') await enterOursChain(item.id);
            if (pillar === 'zywh') {
                navigate('/merchandise/zywh', { state: { autoStart: item.id } });
                return;
            }
            if (pillar === 'desire') {
                if (item.isAuction) await bidDesire(item.id, Math.floor(item.currentBid * 1.05));
                else await acquireDesire(item.id);
            }
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-32 bg-navy-950 selection:bg-gold selection:text-black">
            {/* Cinematic Hero */}
            <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-transparent to-navy-950/20" />

                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-gold/20 transition-all z-20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="absolute bottom-12 left-6 right-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border backdrop-blur-md ${theme.bg} ${theme.accent} ${theme.border}`}>
                                {pillar.toUpperCase()} • PILLAR
                            </span>
                            <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Ref: {item.serialNumber || 'ATELIER-PROTOTYPE'}</span>
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl font-black text-white italic uppercase leading-none mb-4">{item.title}</h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Current Valuation</span>
                                <span className="text-gold font-mono text-3xl font-black">{formatPrice(item.isAuction ? item.currentBid : item.price)}</span>
                            </div>
                            <div className="h-10 w-px bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Land Utility</span>
                                    <span className="text-emerald-400 font-mono font-bold text-lg flex items-center gap-2">
                                        🏗️ +{item.utilityPower} Pwr
                                    </span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Edition</span>
                                    <span className="text-white font-mono font-bold text-lg">{item.editionSize || '1 of 1'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="px-6 max-w-5xl mx-auto -mt-4 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Lateral details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Participation Area */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 ${theme.bg}`} />

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-white font-serif text-2xl font-bold uppercase tracking-wide">Atelier Participation</h2>
                                <p className="text-gray-500 text-xs mt-1">Status: <span className="text-emerald-400 font-bold uppercase">{item.isLive ? 'Live Engagement' : 'Historical Archive'}</span></p>
                            </div>
                            {item.isAuction && (
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Time Remaining</span>
                                    <span className="text-rose-400 font-mono font-bold text-xl">04:12:45</span>
                                </div>
                            )}
                        </div>

                        {/* Pillar context */}
                        {pillar === 'yours' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
                                    <span className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Allocation Pool</span>
                                    <span className="text-white font-bold">{item.totalUnits} Units</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
                                    <span className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Total Bidders</span>
                                    <span className="text-gold font-bold">{item.participants?.length || 0}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
                                    <span className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">Oversubscribed</span>
                                    <span className="text-amber-500 font-bold">{Math.round((item.participants?.length / item.totalUnits) || 0)}x</span>
                                </div>
                            </div>
                        )}

                        {item.digitalTwinId && (
                            <div className="mb-8 p-4 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⬡</span>
                                    <div>
                                        <span className="text-gold text-[8px] font-black uppercase tracking-widest block">Authenticated Digital Twin</span>
                                        <span className="text-white font-mono text-xs">{item.digitalTwinId}</span>
                                    </div>
                                </div>
                                <span className="text-[8px] text-gray-500 uppercase tracking-tighter max-w-[150px] text-right">Ownership transfers instantly upon acquisition.</span>
                            </div>
                        )}

                        {pillar === 'ours' && (
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-8">
                                <h3 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3">Chain Intelligence</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-500 text-[10px] block">Buyers in Chain</span>
                                        <span className="text-white font-bold text-lg">{item.filledSlots} / {item.totalSlots}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-500 text-[10px] block">Appreciation / Entry</span>
                                        <span className="text-emerald-400 font-mono font-bold text-lg">+{formatPrice(item.appreciationPerBuyer)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(item.filledSlots / item.totalSlots) * 100}%` }} />
                                </div>
                            </div>
                        )}

                        <button
                            disabled={!item.isLive || actionLoading}
                            onClick={handleAction}
                            className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-[0.4em] transition-all
                                ${item.isLive
                                    ? 'bg-gold text-black shadow-lg shadow-gold/10 hover:bg-yellow-300 hover:scale-[1.01]'
                                    : 'bg-navy-800 text-gray-500 cursor-not-allowed border border-navy-700'}`}>
                            {actionLoading ? 'Verifying Participation...' : item.isLive ? 'Participate Now' : 'Allocation Closed'}
                        </button>

                        <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4">
                            <span className="text-2xl">🛡️</span>
                            <div>
                                <p className="text-white text-[10px] font-bold uppercase tracking-widest">Sovereign Protection</p>
                                <p className="text-gray-600 text-[9px] italic">Participation blocked in secure mandate vaults. Allocation managed by verified algorithmic transparency.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Metadata Tabs */}
                    <div className="space-y-6">
                        <div className="flex gap-8 border-b border-white/5 pb-2">
                            {['narrative', 'craft', 'authenticity'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`text-[10px] font-bold uppercase tracking-[0.3em] pb-3 transition-all relative
                                        ${activeTab === tab ? 'text-gold' : 'text-gray-500 hover:text-white'}`}>
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="min-h-[250px]">
                                {activeTab === 'narrative' && (
                                    <div className="space-y-8">
                                        {/* Category Specific Narrative Details */}
                                        {item.category === 'Goddess of India' && (
                                            <div className="space-y-6">
                                                <div className="p-8 rounded-3xl bg-gradient-to-br from-gold/15 to-transparent border border-gold/20 italic">
                                                    <span className="text-3xl text-gold/30 block mb-2">✧</span>
                                                    <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4">The Divine Connection</h4>
                                                    <p className="text-white text-base font-serif leading-relaxed">{item.divineConnection || 'A sacred link between the deity\'s essence and the physical weave.'}</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                    <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-2">Sacred Symbolism</h4>
                                                    <p className="text-gray-400 text-xs italic">{item.sacredSymbolism || 'Timeless divine attributes.'}</p>
                                                </div>
                                            </div>
                                        )}

                                        {item.category === 'Film Inspired' && (
                                            <div className="space-y-6">
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                    <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Director's Note</h4>
                                                    <p className="text-gray-400 text-xs italic font-serif">"{item.directorNote || 'A visual anchor for the film\'s narrative.'}"</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                        <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Prop Reference</span>
                                                        <span className="text-white font-mono text-xs">{item.propRef || 'Archive-001'}</span>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-right">
                                                        <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Screen Time</span>
                                                        <span className="text-white font-mono text-xs">{item.screenTime || 'Principal Sequence'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Provenance Ledger Visualization */}
                                        <div className="relative pt-8 pb-4">
                                            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
                                            <h4 className="text-[9px] text-gray-600 uppercase tracking-[0.5em] mb-8 ml-10">Provenance Ledger</h4>
                                            <div className="space-y-10 ml-10">
                                                {[
                                                    { step: 'Origin & Intent', date: 'Concept Stage', icon: '🖋️', active: true },
                                                    { step: 'Material Sourcing', date: 'Fabrication Start', icon: '🧵', active: true },
                                                    { step: 'Crafting & Assemblage', date: 'Master Workshop', icon: '⚒️', active: true },
                                                    { step: 'Digital Cryptography', date: 'Final Step', icon: '⬡', active: true },
                                                ].map((p, i) => (
                                                    <div key={i} className="relative group">
                                                        <div className="absolute -left-[30px] w-5 h-5 rounded-full bg-navy-950 border-2 border-gold flex items-center justify-center text-[10px] z-10 shadow-[0_0_10px_rgba(201,162,39,0.5)]">
                                                            {p.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gold font-bold text-[10px] uppercase tracking-widest">{p.step}</span>
                                                            <span className="text-gray-500 text-[8px] uppercase">{p.date}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {item.category === 'Celebrity Inspired' && (
                                            <div className="space-y-6">
                                                <div className="p-8 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 italic">
                                                    <span className="text-3xl text-gold/30 block mb-4">“</span>
                                                    <p className="text-white text-lg font-serif">{item.personalQuote || 'Style is a reflection of the stories we choose to live.'}</p>
                                                    <span className="text-gold text-[10px] font-black uppercase tracking-widest mt-6 block">— The Icon\'s Reflection</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                    <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-2">Event Association</h4>
                                                    <p className="text-gray-400 text-xs">{item.eventContext || 'Silvertriverse Premier Events'}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* DESIRE Elite Pedigree */}
                                        {pillar === 'desire' && (
                                            <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-900/10 to-transparent border border-rose-500/20">
                                                <h4 className="text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">The Curator\'s Choice</h4>
                                                <p className="text-white text-sm italic font-serif leading-relaxed mb-6">"{item.curatorNote || 'Chosen for its unparalleled rarity and narrative weight.'}"</p>
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                                    <span className="text-[8px] text-gray-600 uppercase tracking-widest block mb-1">Elite Pedigree</span>
                                                    <span className="text-rose-300 text-[10px] font-bold">{item.elitePedigree || 'Authentic Production Archive'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* OURS Ecosystem Role */}
                                        {pillar === 'ours' && (
                                            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                                <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Ecosystem Identity</h4>
                                                <p className="text-gray-300 text-xs leading-relaxed">{item.ecosystemRole || 'Standardized infrastructure for the Metaverse community.'}</p>
                                                <div className="mt-4 flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-500 font-mono">BATCH ID:</span>
                                                    <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">{item.batchID || 'MET-2027-X'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* ZYWH Digital Archeology */}
                                        {pillar === 'zywh' && (
                                            <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                                                <h4 className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Digital Archeology</h4>
                                                <p className="text-gray-300 text-xs leading-relaxed mb-4">{item.heritageStory || 'Decoded from the fractured remnants of the Post-Silicon era.'}</p>
                                                
                                                {item.decodingHints && (
                                                    <div className="space-y-2 mb-4">
                                                        <h5 className="text-[7px] text-gray-500 uppercase tracking-widest">Structural Clues</h5>
                                                        {item.decodingHints.map((hint, hi) => (
                                                            <div key={hi} className="flex items-center gap-2 text-[9px] text-purple-300 font-mono italic">
                                                                <span className="text-purple-500">→</span> {hint}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center justify-between p-3 bg-black/40 rounded-xl border border-purple-700/20">
                                                    <div>
                                                        <span className="text-[7px] text-gray-500 uppercase block">Heritage Era</span>
                                                        <span className="text-white text-[10px] font-bold">{item.heritageEra || '2027 Frontier'}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[7px] text-gray-500 uppercase block">Decode Difficulty</span>
                                                        <span className="text-purple-300 text-[10px] font-bold">{item.decodingDifficulty || 'High'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-2">The Memory</h4>
                                                <p className="text-gray-500 text-xs leading-relaxed">{item.memoryReference || item.sceneInspiration || (item.category === 'Goddess of India' ? 'Rooted in ancient scriptures and timeless heritage.' : 'A pillar of cinematic history.')}</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-2">Cultural Weight</h4>
                                                <p className="text-gray-500 text-xs leading-relaxed">{item.culturalMeaning || item.culturalImpact || (item.category === 'Goddess of India' ? 'Represents the pinnacle of Indian spiritual and aesthetic identity.' : 'A key artifact of the Silvertriverse.')}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowBooklet(true)} className="flex items-center gap-3 group">
                                            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all font-bold">📖</div>
                                            <div className="text-left">
                                                <span className="text-white text-xs font-bold block">Open Story Booklet</span>
                                                <span className="text-gray-500 text-[10px] uppercase tracking-widest">Director's Notes • Set Snapshots</span>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {pillar === 'ours' && (
                                    <div className="space-y-6">
                                        {/* Market Valuation Graph */}
                                        <div className="bg-navy-900/50 p-6 rounded-3xl border border-navy-800">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Global Asset Valuation</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-emerald-400 font-mono text-[10px]">LIVE TRADING</span>
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <StockChart data={item.priceHistory} color="#10b981" height={120} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                                                    <span className="text-[8px] text-gray-600 uppercase block mb-1">Market Price</span>
                                                    <span className="text-white font-mono font-bold text-sm tracking-tight">{formatPrice(item.price)}</span>
                                                </div>
                                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-right">
                                                    <span className="text-[8px] text-gray-600 uppercase block mb-1">Demand Density</span>
                                                    <span className="text-emerald-400 font-mono font-bold text-sm tracking-tight">+{item.communityDensity}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Yield Graph (Linear Dissemination) */}
                                        {oursPositions[item.id] && (
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                className="bg-emerald-950/20 p-6 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-emerald-300 text-[10px] font-black uppercase tracking-widest">Your Yield Portfolio</h3>
                                                    <div className="text-right">
                                                        <span className="text-emerald-500 text-[8px] font-bold uppercase block">Position #{oursPositions[item.id].position}</span>
                                                        <span className="text-gray-500 text-[7px] uppercase tracking-widest">Entry Index</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-6">
                                                    <StockChart data={oursPositions[item.id].rewardHistory} color="#34d399" height={80} />
                                                </div>

                                                <div className="grid grid-cols-2 gap-8 mb-6">
                                                    <div>
                                                        <span className="text-gray-500 text-[8px] uppercase tracking-[0.2em] block mb-1">Max Potential Reward</span>
                                                        <span className="text-white font-mono font-bold text-lg">
                                                            {formatPrice((item.totalEditionSize - oursPositions[item.id].position) * (item.maxRewardValue / item.totalEditionSize))}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-gray-500 text-[8px] uppercase tracking-[0.2em] block mb-1">Current Earned</span>
                                                        <span className="text-emerald-400 font-mono font-bold text-lg">
                                                            {formatPrice(oursPositions[item.id].rewardHistory[oursPositions[item.id].rewardHistory.length - 1] || 0)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                                                        <span className="text-gray-500">Maturity Progress</span>
                                                        <span className="text-emerald-400 font-bold">{item.filledSlots} / {item.totalEditionSize} Units</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-navy-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(item.filledSlots / item.totalEditionSize) * 100}%` }} />
                                                    </div>
                                                    <p className="text-[8px] text-gray-500 italic text-center uppercase tracking-tighter">
                                                        Earn {formatPrice(item.maxRewardValue / item.totalEditionSize)} for every subsequent unit sold.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="bg-navy-900/50 p-6 rounded-3xl border border-navy-800">
                                            <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-navy-800 pb-4">Live Stock Chain</h3>
                                            <div className="space-y-3 relative max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-emerald-500/40 to-transparent z-0" />
                                                {item.chain?.slice().reverse().map((node, idx) => {
                                                    const isUser = node.name === 'You';
                                                    return (
                                                        <div key={idx} className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all ${isUser ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-navy-800/20 border-navy-700/10'
                                                            }`}>
                                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${isUser ? 'bg-emerald-500 text-black' : 'bg-navy-800 border border-emerald-700/20 text-white'
                                                                }`}>{node.position}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isUser ? 'text-emerald-400' : 'text-gray-300'}`}>
                                                                    {node.name} {isUser && '(You)'}
                                                                </span>
                                                                <span className="text-[8px] text-gray-600 uppercase tracking-widest">Holder Position</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-widest block">Value</span>
                                                                <span className="text-white font-mono font-bold text-sm">{formatPrice(node.currentStockPrice)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'craft' && (
                                    <div className="space-y-6">
                                        <div className="bg-navy-900/50 p-6 rounded-3xl border border-navy-800">
                                            <div className="flex items-center justify-between mb-6 border-b border-navy-800 pb-4">
                                                <h3 className="text-white text-xs font-bold uppercase tracking-widest">Master Craftsmanship</h3>
                                                <span className="px-2.5 py-1 rounded bg-gold/10 border border-gold/20 text-gold text-[8px] font-bold uppercase tracking-widest">
                                                    {item.authenticityRating || 'Sovereign Grade'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                                                {[
                                                    { label: 'Artisan Origin', value: item.heritageOrigin || item.craftsmanship?.origin || item.artisanOrigin || 'Silvertriverse Atelier' },
                                                    { label: item.category === 'Goddess of India' ? 'Fabric Feel' : 'Core Material', value: item.fabricFeel || item.craftsmanship?.materials?.split(',')[0] || item.materialDetails || item.fabricDetails || 'Premium Composite' },
                                                    { label: 'Process', value: item.manufacturingProcess || (item.category === 'Goddess of India' ? 'Ancestral hand-weaving (400+ hours)' : 'Hand-finished with precision calibration.') },
                                                    { label: 'Complexity Index', value: 'High / Precision Grade' },
                                                ].map(d => (
                                                    <div key={d.label}>
                                                        <span className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">{d.label}</span>
                                                        <span className="text-gray-300 text-xs font-bold leading-relaxed">{d.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Category Specific Craft Details */}
                                            {item.category === 'Goddess of India' && (
                                                <div className="space-y-6">
                                                    <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10">
                                                        <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                                            <span>✧</span> Sacred Motifs
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(item.sacredMotifs || 'Temple Borders, Lotus, Hamsa').split(',').map(m => (
                                                                <span key={m} className="px-3 py-1.5 rounded-lg bg-navy-950 border border-gold/20 text-[10px] text-gold/80 font-serif italic">
                                                                    {m.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {(item.category === 'Film Inspired' || item.category === 'Celebrity Inspired') && (
                                                <div className="space-y-6">
                                                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                                        <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Manufacturing Log</h4>
                                                        <p className="text-gray-400 text-[11px] leading-relaxed italic font-mono">{item.manufacturingLog || 'Precision crafted with cinematic resilience.'}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ZYWH Restoration */}
                                            {pillar === 'zywh' && (
                                                <div className="p-6 rounded-2xl bg-purple-900/10 border border-purple-500/20 mt-4">
                                                    <h4 className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Restoration Ledger</h4>
                                                    <p className="text-gray-400 text-[10px] leading-relaxed italic">{item.restorationLog || 'Digital geometry stabilized for Metaverse 2.0.'}</p>
                                                </div>
                                            )}

                                            {/* DESIRE Value Trend */}
                                            {pillar === 'desire' && (
                                                <div className="p-6 rounded-2xl bg-rose-900/10 border border-rose-500/20 mt-4">
                                                    <h4 className="text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Valuation Analysis</h4>
                                                    <p className="text-white font-mono text-xs font-bold">{item.historicalValuation || 'Stable Appreciation'}</p>
                                                    <span className="text-[8px] text-gray-600 uppercase mt-2 block tracking-widest">Sovereign Asset Index</span>
                                                </div>
                                            )}

                                            {/* OURS Technical Matrix */}
                                            {pillar === 'ours' && (
                                                <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/20 mt-4">
                                                    <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Hardware Matrix</h4>
                                                    <p className="text-white font-mono text-[11px] font-bold">{item.technicalSpecs || 'Consumer Grade Utility'}</p>
                                                    <span className="text-[8px] text-gray-600 uppercase mt-2 block tracking-widest">Citizen Standard Issue</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'authenticity' && (
                                    <div className="space-y-6">
                                        <div className="bg-navy-900/50 p-6 rounded-3xl border border-navy-800">
                                            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-navy-800 pb-4">Digital Provenance Ledger</h3>
                                            <div className="space-y-6">
                                                {(item.provenanceLedger || [
                                                    { status: 'MATERIAL SOURCED', detail: 'Verification of raw components recorded.', date: 'Dec 2025', completed: true },
                                                    { status: 'CRAFTING INITIATED', detail: 'Assembly protocol started at Atelier.', date: 'Jan 2026', completed: true },
                                                    { status: 'DIGITAL TWIN MINTED', detail: 'Tokenization complete on main-net.', date: 'Feb 2026', completed: true },
                                                    { status: 'AWAITING OWNER', detail: 'Ready for secure transfer protocol.', date: 'Current', completed: false }
                                                ]).map((step, idx) => (
                                                    <div key={idx} className="flex gap-4 group">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step.completed ? 'bg-emerald-500 text-black' : 'bg-navy-800 text-gray-600 border border-white/10'}`}>
                                                                {step.completed ? '✓' : '⬡'}
                                                            </div>
                                                            {idx < 3 && <div className="w-px h-full bg-navy-800 my-1" />}
                                                        </div>
                                                        <div className="pb-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`text-[10px] font-black tracking-widest ${step.completed ? 'text-white' : 'text-gray-600'}`}>{step.status}</span>
                                                                <span className="text-[8px] text-gray-700 font-mono tracking-tighter">{step.date}</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 leading-relaxed italic">{step.detail}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar details */}
                <div className="space-y-8">
                    {/* Land Utility Card */}
                    <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🏗️</span>
                            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Land Protocol</h3>
                        </div>
                        <p className="text-gray-500 text-[10px] leading-relaxed mb-6 italic">This artifact contributes physical and aesthetic value to any land plot it is deployed within.</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-[9px] text-gray-500 uppercase font-bold">Utility Power</span>
                                <span className="text-emerald-400 font-mono font-black text-xl">+{item.utilityPower}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/5 text-center">
                                <span className="text-gray-600 text-[8px] uppercase tracking-widest">Construction Yield Class</span>
                                <span className="text-white text-[10px] font-bold block mt-1">{item.utilityPower > 40 ? 'S-TIER ARCHITECT' : item.utilityPower > 25 ? 'A-TIER BUILDER' : 'CORE COMPONENTS'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rarity & Scarcity */}
                    <div className="p-6 rounded-3xl border border-white/5 bg-navy-900/40">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-[10px] font-black uppercase tracking-widest text-center">Market Scarcity</h3>
                            {pillar === 'desire' && (
                                <span className="text-green-400 font-mono text-[10px] font-bold animate-pulse">+{item.marketAppreciation}%</span>
                            )}
                        </div>
                        <div className="space-y-6">
                            {pillar === 'ours' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                                        <span className="text-gray-500">Community Density</span>
                                        <span className="text-emerald-400 font-bold">{item.communityDensity}% Active</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${item.communityDensity}%` }} />
                                    </div>
                                </div>
                            )}

                            {pillar === 'zywh' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                                        <span className="text-gray-500">Restoration Progress</span>
                                        <span className="text-purple-400 font-bold">{item.restorationProgress}% Stored</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${item.restorationProgress}%` }} />
                                    </div>
                                </div>
                            )}

                            <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] font-bold uppercase text-gray-500">Global Supply</span>
                                    <span className="text-white font-mono text-[10px]">{item.editionSize || '1/1'} Units</span>
                                </div>
                                <div className="h-1 w-full bg-navy-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: '15%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Winners / Bidders */}
                    {(item.status === 'ALLOCATED' || !item.isLive) && (
                        <div className="p-6 rounded-3xl border border-white/5 bg-navy-900/40">
                            <h3 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Historical Record</h3>
                            <div className="space-y-3">
                                {item.allocatedNames?.slice(0, 3).map((name, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20 text-[10px]">
                                        <span className="text-gray-400 flex items-center gap-2">🏆 {name}</span>
                                        <span className="text-gold/60">Winner</span>
                                    </div>
                                ))}
                                {(!item.allocatedNames || item.allocatedNames.length === 0) && (
                                    <div className="text-center py-4 italic text-gray-600 text-[10px]">No allocation history recorded yet.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cinematic Extensions */}
                    <div className="grid grid-cols-1 gap-4">
                        {item.category === 'Film Inspired' && (
                            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold/30 transition-all">
                                🎬 Explore Film
                            </button>
                        )}
                        {(item.category === 'Film Inspired' || item.category === 'Celebrity Inspired') && (
                            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                🏛️ View Relic Context
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cultural Archive Entry */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="px-6 max-w-5xl mx-auto mt-24">
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-navy-900 via-navy-950 to-black border border-white/5 flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🏛️</span>
                            <h3 className="text-white font-serif text-2xl font-black uppercase tracking-widest">Cultural Archive Entry</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-3">Historical Context</h4>
                                <p className="text-gray-400 text-xs leading-relaxed italic">{item.historicalContext || 'This artifact represents a pivotal moment in the Silvertriverse timeline, bridging physical craftsmanship with digital provenance.'}</p>
                            </div>
                            <div>
                                <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-3">Collector Impact</h4>
                                <p className="text-gray-400 text-xs leading-relaxed italic">{item.collectorImpact || 'Highly valued for its functional utility and connection to the core metaverse narrative.'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-gold/20 p-2 flex items-center justify-center opacity-40 shrink-0">
                        <div className="w-full h-full rounded-full border border-gold/10 flex items-center justify-center text-4xl animate-pulse">⬡</div>
                    </div>
                </div>
            </motion.div>

            {/* Booklet Modal */}
            <AnimatePresence>
                {showBooklet && item.digitalBooklet && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
                        onClick={() => setShowBooklet(false)}>
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-navy-900 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full h-[80vh] flex flex-col"
                            onClick={e => e.stopPropagation()}>

                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-white font-serif text-2xl font-bold">Atelier Story Booklet</h2>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">{item.filmReference}</p>
                                </div>
                                <button onClick={() => setShowBooklet(false)} className="text-gray-500 hover:text-white">✕</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-12">
                                {item.digitalBooklet.map((page, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-b border-white/5 pb-12 last:border-0">
                                        <div className={idx % 2 === 0 ? '' : 'md:order-last'}>
                                            <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">{page.title}</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-4">{page.text || item.story}</p>
                                            {page.type === 'quote' && <p className="text-emerald-400 font-serif italic text-lg leading-relaxed">"{page.text}"</p>}
                                        </div>
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                                            <img src={page.content || item.image} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all duration-700" alt={page.title} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
