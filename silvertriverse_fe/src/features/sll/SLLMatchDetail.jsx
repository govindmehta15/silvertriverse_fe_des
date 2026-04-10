import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLMatchDetail() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const data = sllService.getMatchById(matchId);
        setMatch(data);
        setHasVoted(sllService.hasVoted(matchId));
        if (data) setTimeLeft(data.timer || 0);
    }, [matchId]);

    // Live Timer Engine
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    if (!match) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white/20 font-black uppercase tracking-[0.5em] animate-pulse">Scanning Match Logs...</div>
        </div>
    );

    const handleVote = (filmId) => {
        try {
            sllService.castVote(matchId, filmId);
            setHasVoted(true);
            // Refresh data to show new percentages in a real app, 
            // but for mock we just update the UI state
        } catch (err) {
            alert(err.message);
        }
    };

    const totalVotes = match.filmA.votes + match.filmB.votes;
    const filmA_pct = totalVotes > 0 ? Math.round((match.filmA.votes / totalVotes) * 100) : 50;
    const filmB_pct = 100 - filmA_pct;
    const isLastMinute = timeLeft < 60 && timeLeft > 0;

    return (
        <div className="min-h-screen bg-[#020205] text-white relative overflow-hidden">
            {/* Cinematic Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 top-0 w-1/2 h-full opacity-20">
                    <img src={match.filmA.poster} className="w-full h-full object-cover blur-[100px] scale-150" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020205] to-transparent" />
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                    <img src={match.filmB.poster} className="w-full h-full object-cover blur-[100px] scale-150" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-l from-[#020205] to-transparent" />
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-12 lg:pl-0 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <Link to="/sll" className="group flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-white transition-all">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Stadium
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                               {match.format} • {match.round}
                            </span>
                            <span className="text-white/20 text-[10px] uppercase font-black tracking-widest">Global Broadcast Node ST_04</span>
                        </div>
                    </div>
                    
                    <div className={`px-6 py-3 rounded-2xl border transition-all duration-500 ${isLastMinute ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-navy-900/40 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-0.5">Time Remaining</p>
                                <p className={`font-mono text-xl font-black ${isLastMinute ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {Math.floor(timeLeft / 3600)}:
                                    {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:
                                    {(timeLeft % 60).toString().padStart(2, '0')}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${isLastMinute ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                ⏳
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-12 md:gap-20 mb-20">
                    {/* Film A Side */}
                    <FilmCombatant 
                        film={match.filmA} 
                        isLeft 
                        votes={match.filmA.votes}
                        pct={filmA_pct}
                        hasVoted={hasVoted}
                    />

                    {/* VS Center Spines */}
                    <div className="flex flex-col items-center gap-8 py-10">
                        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent relative">
                            <motion.div 
                                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-1/2 -translate-x-1/2 w-1 h-32 bg-emerald-500/50 blur-lg" 
                            />
                        </div>
                        <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-[#020205] shadow-[0_0_60px_rgba(255,255,255,0.03)] relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-3xl font-black italic text-white/10 z-10">VS</span>
                        </div>
                        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Film B Side */}
                    <FilmCombatant 
                        film={match.filmB} 
                        votes={match.filmB.votes}
                        pct={filmB_pct}
                        hasVoted={hasVoted}
                    />
                </div>

                {/* Economic Surge & Voting Action */}
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-red-500/20 rounded-full blur-xl opacity-50" />
                        <div className="relative h-12 bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-3xl">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${filmA_pct}%` }}
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-end pr-8"
                            >
                                <span className="text-[11px] font-black tracking-widest">{filmA_pct}%</span>
                            </motion.div>
                            <div className="absolute right-0 top-0 h-full flex items-center justify-start pl-8 text-[11px] font-black text-white/40 tracking-widest">
                                {filmB_pct}%
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!hasVoted ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center gap-8"
                            >
                                <div className="flex justify-center gap-8 w-full max-w-2xl">
                                    <VoteButton 
                                        label={match.filmA.name} 
                                        onClick={() => handleVote(match.filmA.id)} 
                                        accent="hover:bg-emerald-500"
                                    />
                                    <VoteButton 
                                        label={match.filmB.name} 
                                        onClick={() => handleVote(match.filmB.id)} 
                                        accent="hover:bg-emerald-500"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                    One Vote per Verified Citizen
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center p-12 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-4xl mb-6 block">✅</span>
                                <h3 className="text-2xl font-serif font-bold mb-2">Support Registered</h3>
                                <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">
                                    +50 Participation Points Awarded • Eco-Signal Updated
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function FilmCombatant({ film, isLeft, votes, pct, hasVoted }) {
    return (
        <div className={`flex flex-col items-center ${isLeft ? 'lg:items-end text-center lg:text-right' : 'lg:items-start text-center lg:text-left'} space-y-10 group`}>
            <motion.div 
                whileHover={{ scale: 1.05, rotateY: isLeft ? -5 : 5 }}
                className="relative w-72 h-[450px] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 hover:border-emerald-500/30"
            >
                <img src={film.poster} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Fame Boost Indicator */}
                {film.fameBoost && (
                    <div className="absolute top-6 right-6 px-3 py-1.5 bg-gold text-navy-950 text-[9px] font-black rounded-xl backdrop-blur-md animate-bounce">
                        🔥 FAME BOOSTED
                    </div>
                )}
                
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center lg:items-end">
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Global Support</span>
                    <p className="text-3xl font-black font-mono">{votes.toLocaleString()}</p>
                </div>
            </motion.div>

            <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">{film.name}</h2>
                <div className={`flex flex-wrap gap-3 ${isLeft ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}>
                    <Tag label="Director" value={film.director || 'Nolan'} />
                    <Tag label="IMDb" value={film.imdb} />
                    <Tag label="Budget" value={film.budget || '₹100Cr'} />
                    <Tag label="Momentum" value={`+${Math.round(Math.random() * 20)}%`} color="text-emerald-400" />
                </div>
            </div>
        </div>
    );
}

function Tag({ label, value, color = "text-white/60" }) {
    return (
        <div className="flex flex-col items-center lg:items-start px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-0.5">{label}</span>
            <span className={`text-[11px] font-bold font-mono ${color}`}>{value}</span>
        </div>
    );
}

function VoteButton({ label, onClick, accent }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 px-8 py-5 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 ${accent} hover:text-white hover:shadow-emerald-500/20`}
        >
            Support {label}
        </button>
    );
}
