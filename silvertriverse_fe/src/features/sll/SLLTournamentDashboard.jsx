import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';

export default function SLLTournamentDashboard() {
    const { tournamentId } = useParams();
    const [bracket, setBracket] = useState(null);
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        const tId = tournamentId || 'sll_global_clash_2026';
        setBracket(sllService.getBrackets(tId));
        setTournament(sllService.getTournamentById(tId));
    }, [tournamentId]);

    if (!bracket || !tournament) return (
        <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 lg:pl-0 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-5 bg-emerald-500" />
            <span className="text-4xl mb-6">🏜️</span>
            <h2 className="text-2xl font-serif font-bold mb-4">Bracket Not Published</h2>
            <p className="text-gray-500 max-w-sm mb-12 uppercase text-[10px] font-black tracking-widest">
                This {tournament?.type || 'league'} is currently in a selection phase or does not utilize a knockout bracket format. Check the Standings for current progress.
            </p>
            <Link to="/sll" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
                Return to Stadium
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 lg:pl-0 relative overflow-hidden">
            {/* Background Atmosphere - Dynamic Branding */}
            <div 
                className="absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-10" 
                style={{ backgroundColor: tournament?.brandingColor || '#10B981' }}
            />
            
            <header className="mb-16 relative z-10">
                <Link to="/sll" className="group flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 hover:text-white transition-colors">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Stadium
                </Link>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                                {tournament?.title?.split(' ').map((word, i) => (
                                    <span key={i} className={i % 2 === 1 ? 'text-white/40 italic' : ''}>{word} </span>
                                ))}
                            </h1>
                            {tournament?.isOfficial && (
                                <span className="px-3 py-1 bg-gold text-navy-950 text-[10px] font-black uppercase rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]">✦ Official</span>
                            )}
                        </div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            {tournament?.type} • {tournament?.status}
                        </p>
                        <p className="text-gray-400 max-w-xl italic text-sm">{tournament?.description}</p>
                    </div>

                    {/* Prize Spotlight */}
                    {tournament?.isOfficial && tournament?.officialPrize && (
                        <div className="bg-gradient-to-br from-navy-900/60 to-black border border-gold/30 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl min-w-[320px]">
                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-center gap-8">
                                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(251,191,36,0.1)] group-hover:scale-110 transition-transform">
                                    🪙
                                </div>
                                <div>
                                    <span className="text-[9px] text-gold font-black uppercase tracking-[0.4em] block mb-1">Official Prize</span>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight line-clamp-1">{tournament.officialPrize}</h3>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mt-1">Limited Commemorative Artifact</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Bracket Arena */}
            <div className="relative flex flex-row overflow-x-auto gap-8 md:gap-24 pb-20 scrollbar-hide perspective-[1000px]">
                {bracket?.rounds?.map((round, rIdx) => (
                    <div key={round.name} className="flex flex-col shrink-0 min-w-[280px]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 mb-12 px-6 flex items-center gap-3">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            {round.name}
                        </h3>
                        
                        <div className="flex flex-col justify-around flex-1 gap-12">
                            {round.matches.map((match, mIdx) => (
                                <div key={match.id} className="relative group/match">
                                    <BracketNode 
                                        match={match} 
                                        isClickable={match.id.includes('m') || !!match.filmA}
                                    />
                                    
                                    {/* SVG Connectors */}
                                    {rIdx < bracket.rounds.length - 1 && (
                                        <div className="absolute top-1/2 -right-24 w-24 h-full pointer-events-none overflow-visible hidden md:block">
                                            <svg className="w-full h-full overflow-visible" style={{ position: 'absolute', top: 0, left: 0 }}>
                                                <path 
                                                    d={`M 0,0 L 48,0 C 72,0 72,${(mIdx % 2 === 0 ? 50 : -50)} 96,${(mIdx % 2 === 0 ? 50 : -50)}`}
                                                    fill="none" 
                                                    stroke="rgba(16,185,129,0.15)" 
                                                    strokeWidth="1.5"
                                                    className="group-hover/match:stroke-emerald-500/50 transition-colors duration-500"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BracketNode({ match, isClickable }) {
    const NodeContent = (
        <div className={`w-72 bg-navy-900/20 border ${match.winner ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/5'} rounded-2xl overflow-hidden backdrop-blur-2xl transition-all duration-500 group-hover:bg-navy-900/40 group-hover:border-white/20`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <ParticipantRow name={match.filmA} isWinner={match.winner === match.filmA} />
            <div className="h-px bg-white/5 relative">
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <ParticipantRow name={match.filmB} isWinner={match.winner === match.filmB} />
        </div>
    );

    if (isClickable && match.id.startsWith('m')) {
        return (
            <Link to={`/sll/match/${match.id}`} className="block">
                {NodeContent}
            </Link>
        );
    }

    return NodeContent;
}

function ParticipantRow({ name, isWinner }) {
    return (
        <div className={`px-5 py-4 flex items-center justify-between relative z-10 ${isWinner ? 'bg-emerald-500/5' : ''}`}>
            <div className="flex items-center gap-3">
                <div className={`w-1 h-1 rounded-full ${isWinner ? 'bg-emerald-500' : 'bg-white/10'}`} />
                <span className={`text-[11px] font-bold uppercase tracking-widest ${name ? (isWinner ? 'text-emerald-400' : 'text-white/80') : 'text-white/20 italic font-medium'}`}>
                    {name || 'TBD Selection'}
                </span>
            </div>
            {isWinner && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                >
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">WINNER</span>
                    <span className="text-sm">🏆</span>
                </motion.div>
            )}
        </div>
    );
}
