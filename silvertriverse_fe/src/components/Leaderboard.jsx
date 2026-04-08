import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlobalLeaderboard } from '../services/statsService';

const tabs = ['Top Fans', 'Top Collectors', 'Top Creators'];

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState('Top Fans');
    const [data, setData] = useState({
        'Top Fans': [],
        'Top Collectors': [],
        'Top Creators': []
    });

    useEffect(() => {
        // Load real stats from local storage interactions
        setData(getGlobalLeaderboard());

        // Periodically refresh to catch live mock events
        const interval = setInterval(() => {
            setData(getGlobalLeaderboard());
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card-luxury p-5 w-full max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🏆</span>
                <h2 className="font-serif text-lg text-gold font-bold">Global Leaderboard</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-navy-800/40 rounded-lg p-1 border border-navy-600/30 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-200 relative
              ${activeTab === tab ? 'text-gold' : 'text-gray-400 hover:text-gray-200'}
            `}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="leaderboardTab"
                                className="absolute inset-0 bg-gold/10 border border-gold/20 rounded-md"
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    {data[activeTab].map((itemUser, index) => (
                        <motion.div
                            key={itemUser.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                                flex items-center gap-3 p-4 rounded-xl border transition-all relative overflow-hidden group
                                ${index === 0
                                    ? 'bg-gradient-to-br from-gold/20 to-amber-950/40 border-gold/50 shadow-[0_0_20px_rgba(201,162,39,0.2)]'
                                    : 'bg-navy-900/40 border-navy-700/30'
                                }
                            `}
                        >
                            {index === 0 && (
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">
                                    <span className="text-4xl text-gold">✦</span>
                                </div>
                            )}

                            {/* Rank */}
                            <div className={`
                                w-8 text-center font-black font-mono
                                ${index === 0 ? 'text-gold text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'text-gray-500 text-sm'}
                            `}>
                                {(index + 1).toString().padStart(2, '0')}
                            </div>
 
                            {/* Avatar */}
                            <div className="relative">
                                <div className={`
                                    w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 rotate-3 group-hover:rotate-0 transition-transform
                                    ${index === 0 ? 'border-gold' : 'border-navy-600'}
                                `}>
                                    <img src={itemUser.avatar} alt={itemUser.name} className="w-full h-full object-cover" />
                                </div>
                                {index === 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-navy-900 flex items-center justify-center text-[10px]">👑</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold text-sm truncate uppercase tracking-wide ${index === 0 ? 'text-gold' : 'text-gray-200'}`}>
                                    {itemUser.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-mono text-gray-500 uppercase font-black">{activeTab === 'Top Fans' ? 'Social Power' : activeTab === 'Top Collectors' ? 'Market Stake' : 'Cultural Weight'}</span>
                                    <span className={`text-[11px] font-bold ${index === 0 ? 'text-white' : 'text-gold/70'}`}>{itemUser.score}</span>
                                </div>
                            </div>

                            {/* Rank Change Indicator */}
                            <div className="flex flex-col items-end gap-1">
                                {itemUser.rankChange > 0 && <span className="text-green-500 text-[9px] font-black uppercase">▲ UP</span>}
                                {itemUser.rankChange < 0 && <span className="text-red-500 text-[9px] font-black uppercase">▼ DOWN</span>}
                                <span className="w-10 h-1 bg-navy-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${index === 0 ? 'bg-gold' : 'bg-navy-600'}`} style={{ width: `${100 - index * 15}%` }} />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
