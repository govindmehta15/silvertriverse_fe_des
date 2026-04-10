import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLMatchWidget({ match, onVoteComplete }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [isRandomized, setIsRandomized] = useState(false);
    const [films, setFilms] = useState([]);
    const [timeLeft, setTimeLeft] = useState(match.timer || 0);
    const [surge, setSurge] = useState(0);
    const [rallyActive, setRallyActive] = useState(false);

    useEffect(() => {
        setHasVoted(sllService.hasVoted(match.id));
        
        // Club Rally Check: See if user is in Film A or Film B's society
        // Note: For this demo, we assume u1 is in all societies
        if (match.filmA.societyId || match.filmB.societyId) {
            setRallyActive(true);
        }
        
        // Anti-Cheat: Randomize screen positions
        const pair = [match.filmA, match.filmB];
        if (Math.random() > 0.5) {
            setFilms([pair[1], pair[0]]);
            setIsRandomized(true);
        } else {
            setFilms(pair);
        }

        // Live Timer Logic
        const timerId = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
            // Simulate live surges
            setSurge(Math.sin(Date.now() / 1000) * 1.5);
        }, 1000);

        return () => clearInterval(timerId);
    }, [match]);

    const handleVote = (filmId) => {
        try {
            sllService.castVote(match.id, filmId);
            setHasVoted(true);
            if (onVoteComplete) onVoteComplete(match.id, filmId);
        } catch (err) {
            console.error(err);
        }
    };

    const isLastMinute = timeLeft < 60 && timeLeft > 0;
    const totalVotes = match.filmA.votes + match.filmB.votes;
    const getPct = (votes, idx) => {
        const base = Math.round((votes / totalVotes) * 100);
        // Add fake surge visual feedback
        return idx === 0 ? base + (surge > 0 ? 1 : -1) : base - (surge > 0 ? 1 : -1);
    };

    return (
        <div className={`bg-gradient-to-br transition-colors duration-500 border rounded-[32px] p-6 shadow-2xl relative overflow-hidden group ${
            isLastMinute ? 'from-red-950/40 to-black border-red-500/40' : 
            rallyActive ? 'from-emerald-950/30 to-black border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]' :
            'from-navy-900/90 to-black border-emerald-500/20'
        }`}>
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] pointer-events-none transition-colors ${
                isLastMinute ? 'bg-red-500/20' : rallyActive ? 'bg-emerald-400/20' : 'bg-emerald-500/10'
            }`} />

            {/* Rally Banner */}
            <AnimatePresence>
                {rallyActive && !isLastMinute && (
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-emerald-500/20 border-b border-white/5 -mx-6 -mt-6 mb-6 px-6 py-2 flex items-center justify-between"
                    >
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2">
                             ⚔️ Society Rally Active
                        </span>
                        <span className="text-[7px] text-white/40 uppercase font-black font-mono">1.5x Multiplier Unlocked</span>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isLastMinute ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-500'}`} />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                        {isLastMinute ? 'Surge Voting Window' : 'Live SLL Match'}
                    </span>
                </div>
                <div className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-tighter transition-colors ${
                    isLastMinute ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 relative">
                {films.map((film, idx) => (
                    <React.Fragment key={film.id}>
                        <div className="flex-1 flex flex-col items-center group/film">
                            <motion.div 
                                whileHover={!hasVoted ? { scale: 1.05 } : {}}
                                className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${
                                    hasVoted ? 'border-white/10' : 'border-white/5 group-hover/film:border-emerald-500/50 cursor-pointer'
                                }`}
                                onClick={() => !hasVoted && handleVote(film.id)}
                            >
                                <img src={film.poster} alt={film.name} className={`w-full h-full object-cover ${hasVoted ? 'opacity-40 grayscale' : 'group-hover/film:scale-110 transition-transform duration-700'}`} />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent p-3">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-tight line-clamp-1">{film.name}</p>
                                    {film.societyId && (
                                        <p className="text-[7px] text-emerald-400 font-black uppercase tracking-widest mt-0.5 opacity-60">Endorsed Club</p>
                                    )}
                                </div>

                                {hasVoted && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <motion.span 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-4xl font-black text-white italic"
                                        >
                                            {getPct(film.votes, idx)}%
                                        </motion.span>
                                    </div>
                                )}
                            </motion.div>
                            
                            {!hasVoted && (
                                <button 
                                    onClick={() => handleVote(film.id)}
                                    className={`mt-4 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                        isLastMinute ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-black hover:bg-emerald-500'
                                    }`}
                                >
                                    Rally Support
                                </button>
                            )}
                        </div>
                        
                        {idx === 0 && (
                            <div className="flex flex-col items-center z-10">
                                <span className={`text-xl font-black italic select-none transition-colors ${isLastMinute ? 'text-red-500/30' : 'text-white/20'}`}>VS</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <AnimatePresence>
                {hasVoted && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">+50 Points</span>
                        </div>
                        <Link 
                            to={`/sll/match/${match.id}`}
                            className="text-[9px] text-gray-400 uppercase font-black tracking-widest hover:text-emerald-500 transition-colors"
                        >
                            Deep Analysis →
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
