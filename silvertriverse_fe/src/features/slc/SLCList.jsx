import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockSLC } from '../../mock/mockSLC';
import './SLC.css';

export default function SLCList() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const filteredCoins = mockSLC.filter(coin => {
        if (filter === 'all') return true;
        return coin.status === filter;
    });

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-8">
            <header className="max-w-7xl mx-auto mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-serif silver-text-shimmer font-bold mb-4 tracking-tight">
                        Silver Legendary Coins
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Pillar 8: Reviving cinema's most iconic heritage collectibles in limited-edition engraved silver.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button 
                            onClick={() => navigate('/slc/marketplace')}
                            className="px-8 py-3 bg-navy-800 border border-silver/30 text-silver font-bold rounded-xl hover:bg-navy-700 hover:shadow-glow-silver transition-all flex items-center gap-2"
                        >
                            <span>🛒</span> Visit Secondary Market
                        </button>
                    </div>
                </motion.div>

                {/* Status Tabs */}
                <div className="flex justify-center mt-8 gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {['all', 'application_open', 'announced', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                filter === status 
                                ? 'bg-white text-navy-900 shadow-glow-silver' 
                                : 'bg-navy-800 text-gray-400 hover:text-white border border-navy-700'
                            }`}
                        >
                            {status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCoins.map((coin, index) => (
                        <SLCCard key={coin.id} coin={coin} index={index} onClick={() => navigate(`/slc/${coin.id}`)} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function SLCCard({ coin, index, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            onClick={onClick}
            className="metallic-card rounded-2xl p-1 overflow-hidden cursor-pointer group"
        >
            <div className="relative aspect-square bg-navy-950/50 flex items-center justify-center p-8 overflow-hidden rounded-xl">
                {/* 3D Coin Animation Simulation */}
                <motion.div 
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-4 border-gray-400/30 flex items-center justify-center shadow-2xl relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 via-white/10 to-gray-600/20 rounded-full animate-pulse" />
                    <span className="text-6xl grayscale opacity-60">🪙</span>
                </motion.div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <StatusBadge status={coin.status} />
                    <div className="bg-navy-950/80 border border-blue-500/30 px-2 py-0.5 rounded text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm">
                        <span className="animate-pulse">●</span> 3D Interactive
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button className="silver-btn">View Details</button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-white font-bold">{coin.title}</h3>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{coin.film}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Weight</span>
                        <span className="text-sm text-gray-300 font-bold">{coin.silverWeight}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-700" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Edition</span>
                        <span className="text-sm text-gray-300 font-bold">1 / {coin.editionLimit}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-700" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Utility</span>
                        <span className="text-sm text-blue-400 font-bold">+{coin.utilityPower}%</span>
                    </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-gray-800/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black">Base Price</span>
                        <span className="text-lg text-white font-serif tracking-wide">₹{coin.basePrice.toLocaleString()}</span>
                    </div>
                    {coin.status === 'application_open' && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-green-400 uppercase font-black animate-pulse">Live Applicants</span>
                            <span className="text-lg text-green-400 font-bold tracking-tighter">{coin.applicantsCount.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
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
