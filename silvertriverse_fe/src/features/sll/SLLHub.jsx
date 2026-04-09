import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sllService } from '../../services/sllService';
import './SLL.css';

export default function SLLHub() {
    const [matches, setMatches] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedTournament, setSelectedTournament] = useState(null);

    useEffect(() => {
        sllService.init();
        loadData();
    }, []);

    const loadData = () => {
        setMatches(sllService.getMatches());
        setStats(sllService.getUserStats());
    };

    const handleVote = (matchId, filmId) => {
        try {
            sllService.castVote(matchId, filmId);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 lg:pl-0">
            {/* Header section */}
            <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Pillar 7 — Silver Legacy League</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">Cinema <span className="text-silver-shimmer">Stadium</span></h1>
                    <p className="text-gray-500 mt-4 max-w-lg">Where cinematic legends are forged. Support your favorite films and determine the ultimate champions.</p>
                </div>
                
                {/* User Stats Card */}
                <div className="bg-navy-900/50 border border-white/10 rounded-3xl p-6 flex items-center gap-8 backdrop-blur-xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 uppercase font-black">Rank</span>
                        <span className="text-xl font-bold text-emerald-400">{stats?.badge}</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 uppercase font-black">Points</span>
                        <span className="text-xl font-bold font-mono">{stats?.participationPoints}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <section className="space-y-12">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-serif italic text-white/90">Live Matchups</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 2,415 fans voting now
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {matches.map(match => (
                            <MatchCard key={match.id} match={match} onVote={handleVote} />
                        ))}
                    </div>
                </section>
                
                {/* Tournament Bracket Link */}
                <section className="mt-24">
                    <div className="bg-gradient-to-br from-navy-900 to-black border border-white/5 rounded-[40px] p-12 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-3xl font-serif font-bold mb-4">Global Cinema Clash Brackets</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Track the 16 masterpieces fighting for the 2026 Legacy Title. See the full bracket and upcoming knockout rounds.</p>
                        <button className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-500 transition-all">
                            View Tournament Brackets
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

function MatchCard({ match, onVote }) {
    const hasVoted = sllService.hasVoted(match.id);
    const filmA_pct = Math.round((match.filmA.votes / (match.filmA.votes + match.filmB.votes)) * 100);
    const filmB_pct = 100 - filmA_pct;

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-silver/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative bg-navy-950/80 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                        {match.round}
                    </span>
                    <div className="flex items-center gap-2 text-gold-500 font-mono text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {Math.floor(match.timer / 60)}:{(match.timer % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-12 mb-12 relative">
                    {/* Film A */}
                    <FilmProfile film={match.filmA} isVoted={hasVoted} pct={filmA_pct} onVote={() => onVote(match.id, match.filmA.id)} />
                    
                    {/* VS Divider */}
                    <div className="flex flex-col items-center">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <div className="w-12 h-12 rounded-full border border-white/5 bg-navy-900 flex items-center justify-center text-xs font-black text-gray-500 italic">
                            VS
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Film B */}
                    <FilmProfile film={match.filmB} isVoted={hasVoted} pct={filmB_pct} onVote={() => onVote(match.id, match.filmB.id)} />
                </div>

                {hasVoted && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                    >
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Vote Registered — +50 Points Earned 🎉</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function FilmProfile({ film, isVoted, pct, onVote }) {
    return (
        <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden mb-6 border border-white/5">
                <img src={film.poster} alt={film.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {isVoted && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-3xl font-black text-white">{pct}%</span>
                    </div>
                )}
            </div>
            <h4 className="text-sm md:text-lg font-bold text-white mb-4 line-clamp-1">{film.name}</h4>
            
            {!isVoted ? (
                <button 
                    onClick={onVote}
                    className="w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 transition-colors"
                >
                    Support
                </button>
            ) : (
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-emerald-500"
                    />
                </div>
            )}
        </div>
    );
}
