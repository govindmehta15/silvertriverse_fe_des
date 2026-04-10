import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLUserStats() {
    const [stats, setStats] = useState(null);
    const [detailedStats, setDetailedStats] = useState(null);

    useEffect(() => {
        setStats(sllService.getUserStats());
        setDetailedStats(sllService.getUserDetailedStats());
    }, []);

    if (!stats || !detailedStats) return <div className="p-20 text-center text-white">Loading Citizen Data...</div>;

    const maxGenreCount = Math.max(...detailedStats.statsAnalytics.genrePreference.map(g => g.count));

    return (
        <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 lg:pl-0 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
            
            <header className="mb-16 relative z-10">
                <Link to="/sll" className="group flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-white transition-colors">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Hub
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2">
                             Citizen <span className="text-emerald-500 italic">Analytics</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            Silver Legacy League • Personal Performance
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 relative z-10">
                {/* Left Column: Deep Stats */}
                <div className="space-y-12">
                    {/* Primary Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <MetricCard label="Total Votes" value={stats.totalVotes} icon="🗳️" />
                        <MetricCard label="Eco-Points" value={stats.participationPoints} icon="⚡" />
                        <MetricCard label="Daily Streak" value={`${stats.streak} Days`} icon="🔥" />
                        <MetricCard label="Tier Rank" value={stats.badge} icon="🏆" color="text-emerald-400" />
                    </div>

                    {/* Preference Analytics (Genre Chart) */}
                    <div className="bg-navy-900/20 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-10">Cinematic Preferences</h3>
                        <div className="space-y-8">
                            {detailedStats.statsAnalytics.genrePreference.map((genre, idx) => (
                                <div key={genre.genre}>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold uppercase tracking-tight">{genre.genre}</span>
                                        <span className="text-[10px] font-mono text-emerald-500">{genre.count} Votes</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                                            transition={{ delay: idx * 0.1, duration: 1 }}
                                            className="h-full bg-gradient-to-r from-emerald-500/40 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Voting History Ledger */}
                    <div className="bg-navy-900/20 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-10">Voting Ledger</h3>
                        <div className="space-y-6">
                            {detailedStats.votingHistory.map((history) => (
                                <div key={history.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                                            <img src={`/images/film_${history.filmId}.png`} className="w-full h-full object-cover" alt="" 
                                                 onError={(e) => { e.target.src = 'https://via.placeholder.com/80x110?text=' + history.filmName[0]; }} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{history.filmName}</h4>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{history.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-emerald-400 font-mono text-sm font-bold">+{history.pointsEarned}</span>
                                        <p className="text-[7px] text-gray-600 uppercase font-black">Points</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Progression & Milestones */}
                <aside className="space-y-8">
                    {/* Badge Progression */}
                    <div className="bg-gradient-to-br from-emerald-950/20 to-black border border-white/5 rounded-[40px] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-8">Badge Path</h3>
                        <div className="space-y-6">
                            <BadgeStep title="Bronze" points="0" current={stats.badge !== 'Elite'} />
                            <BadgeLine active />
                            <BadgeStep title="Silver" points="1000" current={stats.badge === 'Silver Voter'} />
                            <BadgeLine active={stats.participationPoints >= 2000} />
                            <BadgeStep title="Gold" points="2000" current={stats.badge === 'Gold Voter'} />
                            <BadgeLine active={stats.participationPoints >= 5000} />
                            <BadgeStep title="Master" points="5000" current={stats.badge === 'Master Voter'} />
                        </div>
                    </div>

                    {/* Milestones Wall */}
                    <div className="bg-navy-900/20 border border-white/5 rounded-[40px] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">Legacy Milestones</h3>
                        <div className="space-y-6">
                            {detailedStats.milestones.map(m => (
                                <div key={m.id} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xl">
                                        {m.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">{m.title}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{m.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20 relative z-10 border-t border-white/5 pt-20">
                {/* CREATOR DASHBOARD */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-serif italic">Creator Dashboard</h2>
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-[8px] font-black text-purple-400 rounded-full uppercase tracking-widest">
                            Rank: {detailedStats?.creatorStats?.rank}
                        </span>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                        {detailedStats?.creatorStats?.leaguesCreated.map(league => (
                            <div key={league.id} className="bg-navy-900/40 border border-white/5 p-6 rounded-[32px] group hover:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-sm uppercase tracking-tight group-hover:text-purple-400 transition-colors">{league.title}</h4>
                                    <span className="text-emerald-400 font-mono text-[10px] font-bold">{league.trend} surges</span>
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-gray-500 font-black uppercase tracking-widest">
                                    <span>{league.participants} active voters</span>
                                    <button className="text-purple-400 hover:text-white transition-colors">Manage →</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {detailedStats?.creatorStats?.creatorBadges.map(badge => (
                            <div key={badge} className="px-4 py-2 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-300">{badge}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* REWARD VAULT */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-serif italic text-gold">Reward Vault</h2>
                        <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-[8px] font-black text-gold rounded-full uppercase tracking-widest">
                            SLC Claims Active
                        </span>
                    </div>

                    <div className="space-y-4">
                        {detailedStats?.earnedPrizes.map(prize => (
                            <div key={prize.id} className="bg-navy-900/40 border border-gold/10 p-6 rounded-[32px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[40px] pointer-events-none" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(251,191,36,0.1)] group-hover:scale-110 transition-transform">
                                            {prize.type === 'Silver Coin' ? '🪙' : '🎖️'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight mb-1">{prize.name}</h4>
                                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{prize.date} • {prize.status}</p>
                                        </div>
                                    </div>
                                    <button className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${prize.status === 'delivered' ? 'bg-gold/10 text-gold/40 border border-gold/10' : 'bg-gold text-black hover:bg-white'}`}>
                                        {prize.status === 'delivered' ? 'Owned' : 'Claim Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, color = "text-white" }) {
    return (
        <div className="bg-navy-900/20 border border-white/5 rounded-3xl p-6 backdrop-blur-xl group hover:border-white/10 transition-all">
            <span className="text-2xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest block mb-1">{label}</span>
            <p className={`text-xl font-mono font-black ${color}`}>{value}</p>
        </div>
    );
}

function BadgeStep({ title, points, current }) {
    return (
        <div className={`flex items-center gap-4 ${current ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-4 h-4 rounded-full border-2 ${current ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-white/20'}`} />
            <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest">{title} Citizen</p>
                <p className="text-[8px] text-gray-500 uppercase font-bold font-mono">{points} XP</p>
            </div>
            {current && <span className="text-[8px] text-emerald-500 font-black animate-pulse">ACTIVE</span>}
        </div>
    );
}

function BadgeLine({ active }) {
    return (
        <div className="ml-2 w-[2px] h-6 bg-white/5 relative">
            {active && <div className="absolute inset-0 bg-emerald-500/40" />}
        </div>
    );
}
