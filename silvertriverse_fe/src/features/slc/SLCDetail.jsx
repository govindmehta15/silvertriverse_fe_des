import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSLC } from '../../mock/mockSLC';
import SLCStorybook from './SLCStorybook';
import Coin3D from '../../components/slc/Coin3D';
import './SLC.css';

export default function SLCDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const coin = mockSLC.find(c => c.id === id);
    
    const [mandateState, setMandateState] = useState('idle'); // idle, starting, mandated
    const [showStory, setShowStory] = useState(false);
    const [timer, setTimer] = useState(3600 * 24 * 1.5); // Simulation: 1.5 days left

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!coin) return <div className="pt-20 text-center text-white">Coin not found</div>;

    const formatTime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${d}d ${h}h ${m}m ${s}s`;
    };

    const handleMandate = () => {
        setMandateState('starting');
        setTimeout(() => {
            setMandateState('mandated');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-navy-950 pt-16 pb-20 relative overflow-hidden">
            {/* Background Grain/Fog */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('/slc')}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Gallery
                    </button>
                    <div className="h-4 w-px bg-gray-700" />
                    <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Pillar 8 / Legendary Coins</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT: 3D VIEWER CONTAINER */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="metallic-card rounded-3xl p-0 aspect-square relative flex items-center justify-center overflow-hidden shadow-2xl">
                             <Coin3D textureUrl={coin.image} height="100%" />
                        </div>

                        {/* Story Preview Card */}
                        <div 
                            onClick={() => setShowStory(true)}
                            className="metallic-card rounded-2xl p-8 cursor-pointer group hover:border-white/40 transition-all border-dashed"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-serif silver-text-shimmer italic">" {coin.storybook[0].title} "</h3>
                                <span className="text-gray-400 group-hover:text-white transition-colors">Enter Story Mode →</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed italic">
                                {coin.storybook[0].content.substring(0, 150)}...
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: DETAILS & IPO WIDGET */}
                    <div className="lg:col-span-5 space-y-6">
                        <header>
                            <div className="flex gap-2 mb-3">
                                <span className="badge-legendary">{coin.rarity}</span>
                                <StatusBadge status={coin.status} />
                            </div>
                            <h1 className="text-5xl font-serif text-white font-bold mb-2 leading-tight">{coin.title}</h1>
                            <p className="text-gray-400 text-lg">{coin.description}</p>
                        </header>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <SpecCard label="Material" value={coin.material} icon="🧬" />
                            <SpecCard label="Supply" value={`${coin.editionLimit} Pieces`} icon="🎯" />
                            <SpecCard label="Utility Power" value={`+${coin.utilityPower}%`} icon="⚡" />
                            <SpecCard label="Mint" value={coin.details.mint} icon="🏛️" />
                        </div>

                        {/* IPO WIDGET */}
                        <div className="metallic-card rounded-3xl p-8 border-2 border-gray-500/20 bg-gray-950/20">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Base IPO Price</p>
                                    <h2 className="text-4xl font-serif text-white">₹{coin.basePrice.toLocaleString()}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Window Closes In</p>
                                    <p className="text-xl font-mono text-gold-300 font-bold">{formatTime(timer)}</p>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {mandateState === 'idle' ? (
                                    <motion.div 
                                        key="idle"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    >
                                        <button 
                                            onClick={handleMandate}
                                            className="w-full silver-btn py-4 text-xl"
                                        >
                                            Apply for Allocation
                                        </button>
                                        <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-tighter">
                                            UPI AutoPay Mandate will be setup. No immediate debit.
                                        </p>
                                    </motion.div>
                                ) : mandateState === 'starting' ? (
                                    <motion.div 
                                        key="loading"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-center py-6"
                                    >
                                        <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white font-bold">Securing Mandate...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6 text-center"
                                    >
                                        <span className="text-3xl mb-2 block">✅</span>
                                        <h3 className="text-white font-bold text-xl mb-1">Application Submitted</h3>
                                        <p className="text-green-400 text-sm">₹{coin.basePrice.toLocaleString()} Mandate Blocked Successfully</p>
                                        <div className="mt-4 pt-4 border-t border-green-500/20">
                                            <p className="text-[10px] text-gray-400 uppercase">Wait for Allocation on Finish</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Stat Bar */}
                            <div className="mt-8">
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-2">
                                    <span>Applicants</span>
                                    <span>2.5x Oversubscribed</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-gradient-to-r from-gray-600 to-white"
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-gray-500 text-center">
                                    {coin.applicantsCount.toLocaleString()} enthusiasts have already applied.
                                </p>
                            </div>
                        </div>

                        {/* Land Utility Connect */}
                        <div className="metallic-card rounded-2xl p-6 bg-blue-900/10 border-blue-500/20">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                                    🏘️
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{coin.utility.name}</h4>
                                    <p className="text-gray-500 text-xs">{coin.utility.effect}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bidding Board / Allocation History */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-serif text-white font-bold">Provenance & Allocation</h2>
                            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Verified Heritage Logs</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-700">
                                <p className="text-[10px] text-gray-500 uppercase font-black">Total applicants</p>
                                <p className="text-lg text-white font-mono">{coin.applicantsCount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Winner Showcase (if completed) */}
                        <div className="lg:col-span-1">
                            {coin.status === 'completed' && coin.winner ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="metallic-card rounded-2xl p-8 border-gold/40 relative overflow-hidden h-full"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-[40px] rounded-full" />
                                    <p className="text-[10px] text-gold uppercase font-black tracking-widest mb-4">Final Winner</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-navy-950 border-2 border-gold/30 flex items-center justify-center text-3xl">
                                            👤
                                        </div>
                                        <div>
                                            <h4 className="text-2xl text-white font-bold">{coin.winner.user}</h4>
                                            <p className="text-gray-500 text-xs">Allocated on {coin.winner.allocationDate}</p>
                                        </div>
                                    </div>
                                    <div className="bg-navy-950 p-4 rounded-xl border border-white/5 space-y-3">
                                        <div>
                                            <p className="text-[10px] text-gray-600 uppercase">Serial Number</p>
                                            <p className="text-lg text-white font-serif">{coin.winner.serialNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-600 uppercase">Settlement Index</p>
                                            <p className="text-sm text-gray-400 font-mono">HASH_{coin.winner.serialNumber.split('-').pop()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="metallic-card rounded-2xl p-8 border-white/10 flex flex-col items-center justify-center text-center h-full opacity-50 grayscale">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center text-2xl mb-4">
                                        🔒
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Settlement Pending</p>
                                    <p className="text-[10px] text-gray-700 mt-1 italic">Winner and Serial # allocated at end of IPO</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Bidders / Applicants */}
                        <div className="lg:col-span-2">
                            <div className="metallic-card rounded-2xl p-6 border-white/10 h-full">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-6">Live Mandate Queue</p>
                                <div className="space-y-4">
                                    {(coin.biddingHistory || []).map((bid, idx) => (
                                        <div key={bid.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-950/50 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-600 font-mono">#{bid.bidIndex}</span>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{bid.user}</p>
                                                    <p className="text-gray-500 text-[10px]">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-600 uppercase font-bold">Status</p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${
                                                        bid.status === 'Allocated' ? 'text-emerald-400' : 
                                                        bid.status === 'Refunded' ? 'text-gray-500' : 'text-blue-400'
                                                    }`}>
                                                        {bid.status}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                                                    {bid.status === 'Allocated' ? '🏆' : '💼'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {coin.biddingHistory?.length === 0 && (
                                        <p className="text-center py-12 text-gray-600 italic">No applications recorded yet for this drop.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN STORYBOOK OVERLAY */}
            <AnimatePresence>
                {showStory && (
                    <SLCStorybook 
                        coin={coin} 
                        onClose={() => setShowStory(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function SpecCard({ label, value, icon }) {
    return (
        <div className="metallic-card p-4 rounded-2xl">
            <span className="text-[10px] text-gray-500 uppercase font-black block mb-1">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-sm text-white font-bold">{value}</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    switch (status) {
        case 'application_open':
            return <span className="ipo-badge-open">Applying</span>;
        case 'announced':
            return <span className="ipo-badge-announced">Starts Soon</span>;
        case 'completed':
            return <span className="ipo-badge-closed">Allocated</span>;
        default:
            return null;
    }
}
