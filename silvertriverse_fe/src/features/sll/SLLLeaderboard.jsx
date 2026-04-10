import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        setLeaderboard(sllService.getGlobalLeaderboard());
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 lg:pl-0">
            <header className="mb-16">
                <Link to="/sll" className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 inline-block hover:underline">
                    ← Back to Stadium
                </Link>
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">Voter <span className="text-silver-shimmer italic">Rankings</span></h1>
                <p className="text-gray-500 mt-4 max-w-lg uppercase text-[10px] font-black tracking-widest">The Elite Citizens of SLL</p>
            </header>

            <div className="max-w-4xl space-y-4">
                {leaderboard.map((user, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={user.id}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center justify-between p-6 bg-navy-900/40 border border-white/5 rounded-2xl backdrop-blur-xl">
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black italic text-white/20 w-8">{idx + 1}</span>
                                <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                                <div>
                                    <h3 className="font-bold text-lg">{user.username}</h3>
                                    <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                                        user.badge === 'Master Voter' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
                                    }`}>
                                        {user.badge}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-mono font-black">{user.points.toLocaleString()}</p>
                                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Points earned</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
