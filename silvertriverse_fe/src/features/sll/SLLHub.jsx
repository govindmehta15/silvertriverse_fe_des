import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sllService } from '../../services/sllService';
import { useCuEngine } from '../../context/CuEngineContext';
import SLLCreateLeague from './SLLCreateLeague';
import './SLL.css';

export default function SLLHub() {
    const [matches, setMatches] = useState([]);
    const [stats, setStats] = useState(null);
    const [standings, setStandings] = useState([]);
    const [worldCup, setWorldCup] = useState(null);
    const [officialLeagues, setOfficialLeagues] = useState([]);
    const [communityLeagues, setCommunityLeagues] = useState([]);
    const [commFilter, setCommFilter] = useState('All');
    const [selectedLeagueId, setSelectedLeagueId] = useState('sll_best_villain');
    const { drops } = useCuEngine();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [hallOfFame, setHallOfFame] = useState([]);

    useEffect(() => {
        sllService.init();
        loadData();
    }, []);

    const loadData = () => {
        setMatches(sllService.getMatches());
        setStats(sllService.getUserStats());
        setStandings(sllService.getLeagueStandings(selectedLeagueId));
        setWorldCup(sllService.getWorldCup('wc_2026'));
        setOfficialLeagues(sllService.getOfficialLeagues());
        setCommunityLeagues(sllService.getCommunityLeagues());
        setHallOfFame(sllService.getHallOfFame());
    };

    useEffect(() => {
        setStandings(sllService.getLeagueStandings(selectedLeagueId));
    }, [selectedLeagueId]);

    const handleVote = (matchId, filmId) => {
        try {
            sllService.castVote(matchId, filmId);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 lg:pl-0">
            {/* Header section */}
            <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
                <div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Pillar 7 — Silver Legacy League</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">Cinema <span className="text-silver-shimmer">Stadium</span></h1>
                    <p className="text-gray-500 mt-4 max-w-lg">Where cinematic legends are forged. Support your favorite films and determine the ultimate champions.</p>
                </div>
                
                <Link to="/sll/stats" className="group">
                    <div className="bg-navy-900/40 border border-white/5 rounded-3xl p-6 flex items-center gap-8 backdrop-blur-xl hover:border-emerald-500/30 transition-all">
                        <div className="flex flex-col group/stat">
                            <span className="text-[9px] text-gray-500 uppercase font-black group-hover:text-emerald-500">Tier Status</span>
                            <span className="text-xl font-bold text-emerald-400">{stats?.badge}</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-black">Points</span>
                            <span className="text-xl font-bold font-mono">{stats?.participationPoints}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            →
                        </div>
                    </div>
                </Link>
            </header>
            
            <div className="max-w-7xl mx-auto mb-20 flex gap-4">
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-8 py-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
                >
                    + Generate New League
                </button>
                <Link 
                    to="/sll/vault"
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                >
                    <span>🏛️</span> Heritage Vault
                </Link>
            </div>

            <main className="max-w-7xl mx-auto">
                {/* HALL OF FAME - LATEST CHAMPIONS */}
                <section className="mb-32 relative">
                    <div className="absolute -left-20 top-0 text-[120px] font-black text-white/5 select-none pointer-events-none uppercase italic">Legends</div>
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-serif font-bold tracking-tight">Hall of <span className="text-emerald-500">Fame</span></h2>
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Eco-Boosts Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {hallOfFame.map((hof, idx) => (
                            <div key={hof.id} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-gold/20 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-navy-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <img src={`/images/film_${hof.filmId}.png`} className="w-full h-full object-cover" alt="" 
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=' + hof.name; }} 
                                            />
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-gold text-navy-950 text-[8px] font-black px-2 py-0.5 rounded uppercase mb-2 inline-block">Champion</span>
                                            <p className="text-emerald-400 font-mono text-lg font-bold">+{Math.round((hof.boostMultiplier - 1) * 100)}%</p>
                                            <p className="text-[7px] text-gray-500 uppercase font-bold tracking-widest">Relic Surge</p>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-1">{hof.name}</h3>
                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">{hof.tournament}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500/50 w-full" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 italic">Boosted</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <EconomicImpactPulse />

                {/* OFFICIAL CALENDAR */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold uppercase tracking-wider">Silvertriverse Official Calendar</h2>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {officialLeagues.map(league => (
                            <Link key={league.id} to={`/sll/tournament/${league.id}`} className="group bg-navy-950 border border-gold/20 rounded-[32px] overflow-hidden hover:border-gold/50 transition-all shadow-[0_0_30px_rgba(201,162,39,0.05)]">
                                <div className="relative aspect-video">
                                    <img src={league.image || '/images/sll_fallback.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-2 py-1 bg-gold text-black text-[8px] font-black uppercase rounded shadow-lg">✦ Official</span>
                                        {league.fcuPriority && (
                                            <span className="px-2 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase rounded shadow-lg">FCU Priority</span>
                                        )}
                                    </div>
                                    {league.officialPrize && (
                                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                            <p className="text-[7px] text-gold font-black uppercase tracking-widest mb-0.5">Official Prize</p>
                                            <p className="text-[10px] font-bold text-white line-clamp-1">🏆 {league.officialPrize}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-gold" style={{ color: league.brandingColor }}>{league.title}</h3>
                                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{league.type} • {league.currentRound || 'Upcoming'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="space-y-12 mb-32">
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

                <FCUPriorityBanner userRank={stats?.badge} />

                {/* COMMUNITY HUB */}
                <section className="mt-32">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-10">
                        <div>
                            <h2 className="text-2xl font-serif italic text-white/90">Community Pulse</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Found by the cinema fans</p>
                        </div>
                        <div className="flex gap-2">
                           {['All', 'Genre', 'Language', 'Actors', 'Theme'].map(f => (
                               <button 
                                key={f} 
                                onClick={() => setCommFilter(f)}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${commFilter === f ? 'bg-white text-black border-white' : 'text-white/40 border-white/5 hover:border-white/20'}`}
                               >
                                   {f}
                               </button>
                           ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {communityLeagues.filter(l => commFilter === 'All' || l.category === commFilter).map(league => (
                            <Link key={league.id} to={`/sll/tournament/${league.id}`} className="group relative bg-navy-900/30 border border-white/5 rounded-[32px] overflow-hidden hover:border-emerald-500/30 transition-all">
                                <div className="aspect-[16/10] relative overflow-hidden">
                                    <img 
                                        src={league.image || '/images/sll_fallback.png'} 
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                                        alt="" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                                </div>
                                <div className="p-6 relative z-10 -mt-8">
                                    <h4 className="font-bold text-xs mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight leading-tight">{league.title}</h4>
                                    <div className="flex justify-between items-center text-[8px] text-gray-500 font-black uppercase tracking-widest">
                                        <span>{league.type}</span>
                                        <span className="text-emerald-500/60">{league.currentRound}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* League Standings Section */}
                {standings.length > 0 && (
                    <section className="mt-32">
                        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-10">
                            <div>
                                <h2 className="text-2xl font-serif italic text-white/90">League Tables (Format C)</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    Current Selection: {selectedLeagueId === 'sll_best_villain' ? 'Iconic Villains' : '90s Era Gold'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedLeagueId('sll_best_villain')}
                                    className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${selectedLeagueId === 'sll_best_villain' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-white/40'}`}
                                >
                                    Villains
                                </button>
                                <button 
                                    onClick={() => setSelectedLeagueId('sll_90s_era')}
                                    className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${selectedLeagueId === 'sll_90s_era' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-white/40'}`}
                                >
                                    90s Era
                                </button>
                            </div>
                        </div>
                        <div className="bg-navy-900/30 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.03] border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] uppercase font-black text-white/40 tracking-[0.2em]">Pos</th>
                                        <th className="px-10 py-6 text-[10px] uppercase font-black text-white/40 tracking-[0.2em]">Film / Legend</th>
                                        <th className="px-10 py-6 text-[10px] uppercase font-black text-white/40 tracking-[0.2em] text-center">P</th>
                                        <th className="px-10 py-6 text-[10px] uppercase font-black text-white/40 tracking-[0.2em] text-center">W</th>
                                        <th className="px-10 py-6 text-[10px] uppercase font-black text-white/40 tracking-[0.2em] text-center">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((item, idx) => (
                                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group/row">
                                            <td className="px-10 py-6 font-black italic text-white/20 group-hover/row:text-emerald-500/40 transition-colors">{idx + 1}</td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative shadow-lg">
                                                        <img src={item.poster} className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-500" alt="" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-base tracking-tight block ml-1">{item.name}</span>
                                                        <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest ml-1">Vanguard Rank #{(idx+1)*5}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 font-mono text-sm text-center text-white/60">{item.played}</td>
                                            <td className="px-10 py-6 font-mono text-sm text-center text-white/60">{item.won}</td>
                                            <td className="px-10 py-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="font-black text-emerald-400 text-lg">{item.points}</span>
                                                    <span className="text-[7px] text-emerald-500/30 font-black uppercase tracking-tighter">Points</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* World Cup Section */}
                {worldCup && (
                    <section className="mt-32">
                        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-10">
                            <h2 className="text-2xl font-serif italic text-white/90">The Cinematic World Cup (Format D)</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{worldCup.name}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {worldCup.groups.map(group => (
                                <div key={group.name} className="relative group bg-navy-950/80 border border-white/5 rounded-[40px] p-10 overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">{group.name}</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {group.films.map((film, fIdx) => {
                                            const stats = group.standings?.find(s => s.film === film) || { w:0, pts:0 };
                                            return (
                                                <div key={film} className="flex justify-between items-center group/item">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-white/20 font-black italic">{fIdx + 1}</span>
                                                        <span className="text-sm font-bold tracking-tight group-hover/item:text-emerald-400 transition-colors uppercase">{film}</span>
                                                    </div>
                                                    <div className="flex gap-6 items-center">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[7px] text-gray-600 uppercase font-black">Wins</span>
                                                            <span className="font-mono text-xs">{stats.w}</span>
                                                        </div>
                                                        <div className="h-8 w-px bg-white/5" />
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[7px] text-emerald-500/50 uppercase font-black">Points</span>
                                                            <span className="font-mono text-sm font-bold text-emerald-400">{stats.pts}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Top 2 advance to Knockouts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Whitelist Rewards Section */}
                <section className="mt-32">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-serif italic text-white/90">Unlocked Priority Drops</h2>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 rounded uppercase tracking-widest">Rank Reward</span>
                        </div>
                        <Link to="/collectible-units" className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest hover:underline">View All FCU →</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {drops?.filter(d => d.requiredRank && ['Bronze Voter', 'Silver Voter', 'Gold Voter', 'Master Voter'].indexOf(stats?.badge) >= ['Bronze Voter', 'Silver Voter', 'Gold Voter', 'Master Voter'].indexOf(d.requiredRank)).slice(0, 5).map(drop => (
                            <Link key={drop.id} to={`/collectible-units/drop/${drop.id}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all">
                                <img src={drop.cardImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="" />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
                                    <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mb-1">Whitelisted</p>
                                    <h4 className="text-[10px] font-bold text-white line-clamp-1">{drop.cardName}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Tournament Bracket Link */}
                <section className="mt-32">
                    <div className="bg-gradient-to-br from-navy-900 to-black border border-white/5 rounded-[40px] p-12 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-3xl font-serif font-bold mb-4">Global Cinema Clash Brackets</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">Track the 16 masterpieces fighting for the 2026 Legacy Title. See the full bracket and upcoming knockout rounds.</p>
                        <Link 
                            to="/sll/tournament/sll_global_clash_2026"
                            className="inline-block px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-500 transition-all"
                        >
                            View Tournament Brackets
                        </Link>
                    </div>
                </section>
            </main>

            <SLLCreateLeague 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}

function EconomicImpactPulse() {
    return (
        <section className="mb-32">
            <div className="bg-gradient-to-br from-[#0A0A0F] to-black border border-white/5 rounded-[48px] p-10 md:p-16 relative overflow-hidden group">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
                
                <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 rounded-full uppercase tracking-[0.3em] mb-6">
                            Reelity Economic Pulse
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-8">
                            SLL <span className="text-emerald-500 italic">Fame Surge</span>
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">
                            When a film wins in the Stadium, its legacy ripples across the Silvertriverse. Recent champions have triggered a <strong>15% increase</strong> in related Relic auction visibility.
                        </p>
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                            <EconomicMetric label="Relic Momentum" value="+22%" />
                            <EconomicMetric label="Merch Demand" value="+18%" />
                            <EconomicMetric label="FCU Velocity" value="Extreme" color="text-emerald-400" />
                        </div>
                    </div>

                    <div className="w-full lg:w-[450px] space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6 text-center lg:text-left">Currently Boosted Assets</h3>
                        <div className="space-y-4">
                            <BoostedAsset 
                                name="KGF Sword (SLC-01)" 
                                type="Legacy Coin" 
                                surge="+12.5%" 
                                image="/images/coin_kgf.png"
                            />
                            <BoostedAsset 
                                name="Batman Legacy" 
                                type="Merchandise" 
                                surge="+9.2%" 
                                image="/images/coin_batman.png"
                            />
                            <BoostedAsset 
                                name="Kerala Heritage" 
                                type="Relic Archetype" 
                                surge="+15.0%" 
                                image="/images/coin_malayalam.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EconomicMetric({ label, value, color = "text-white" }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">{label}</p>
            <p className={`text-xl font-mono font-black ${color}`}>{value}</p>
        </div>
    );
}

function BoostedAsset({ name, type, surge, image }) {
    return (
        <div className="flex items-center justify-between p-4 bg-navy-900/40 border border-white/5 rounded-3xl group/asset hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1">
                    <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white group-hover/asset:text-emerald-400 transition-colors uppercase tracking-tight">{name}</h4>
                    <p className="text-[8px] text-gray-500 uppercase font-black">{type}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-emerald-400 font-mono text-sm font-bold">{surge}</p>
                <div className="w-8 h-1 bg-emerald-500/20 rounded-full mt-1 overflow-hidden">
                    <div className="w-2/3 h-full bg-emerald-500" />
                </div>
            </div>
        </div>
    );
}

function FCUPriorityBanner({ userRank }) {
    const isMaster = userRank === 'Master Voter';
    
    return (
        <div className={`mt-24 p-8 md:p-12 rounded-[40px] border relative overflow-hidden ${isMaster ? 'bg-gradient-to-r from-emerald-950/40 to-black border-emerald-500/30' : 'bg-navy-950 border-white/5 opacity-80'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    {isMaster ? '⚡' : '🔒'}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-serif font-bold mb-2">
                        {isMaster ? 'FCU Priority Access Unlocked' : 'FCU Early Access Locked'}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm max-w-xl">
                        {isMaster 
                            ? 'Your Master Voter status gives you 15-minute early access to the upcoming KGF Legend Drop. Prepare your mandate.' 
                            : 'Reach Master Voter rank to unlock early access windows for exclusive Collectible Unit (FCU) drops.'}
                    </p>
                </div>
                {isMaster ? (
                    <button className="px-10 py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl active:scale-95">
                        Set Priority Alert
                    </button>
                ) : (
                    <div className="px-10 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                        Earn 3,000 More Points
                    </div>
                )}
            </div>
        </div>
    );
}

function MatchCard({ match, onVote }) {
    const hasVoted = sllService.hasVoted(match.id);
    const [isReversed] = useState(() => Math.random() > 0.5);
    
    const isExpired = match.timer <= 0 || match.status === 'concluded';
    const winner = match.winner || (match.filmA.votes > match.filmB.votes ? match.filmA : match.filmB);

    const totalVotes = match.filmA.votes + match.filmB.votes;
    const filmA_pct = totalVotes > 0 ? Math.round((match.filmA.votes / totalVotes) * 100) : 50;
    const filmB_pct = totalVotes > 0 ? 100 - filmA_pct : 50;

    const films = isReversed 
        ? [{ film: match.filmB, pct: filmB_pct }, { film: match.filmA, pct: filmA_pct }]
        : [{ film: match.filmA, pct: filmA_pct }, { film: match.filmB, pct: filmB_pct }];

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-silver/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative bg-navy-950/80 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                            {match.format} • {match.round}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gold-500 font-mono text-xs">
                        {isExpired ? (
                            <span className="flex items-center gap-2 text-gold animate-pulse">
                                <span className="w-2 h-2 bg-gold rounded-full" /> Match Concluded
                            </span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {Math.floor(match.timer / 60)}:{(match.timer % 60).toString().padStart(2, '0')}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-12 mb-12 relative">
                    <FilmProfile 
                        film={films[0].film} 
                        isVoted={hasVoted || isExpired} 
                        pct={films[0].pct} 
                        onVote={() => onVote(match.id, films[0].film.id)}
                        isWinner={isExpired && films[0].film.id === winner?.id}
                    />
                    
                    <div className="flex flex-col items-center">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <div className="w-12 h-12 rounded-full border border-white/5 bg-navy-900 flex items-center justify-center text-xs font-black text-gray-500 italic">
                            VS
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    <FilmProfile 
                        film={films[1].film} 
                        isVoted={hasVoted || isExpired} 
                        pct={films[1].pct} 
                        onVote={() => onVote(match.id, films[1].film.id)}
                        isWinner={isExpired && films[1].film.id === winner?.id}
                    />
                </div>

                {hasVoted && !isExpired && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                    >
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Vote Registered — +50 Points Earned 🎉</p>
                    </motion.div>
                )}

                {isExpired && (
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-2xl text-center">
                        <p className="text-gold text-xs font-bold uppercase tracking-widest">Champion Crowned: {winner?.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilmProfile({ film, isVoted, pct, onVote, isWinner }) {
    return (
        <div className="flex-1 flex flex-col items-center text-center">
            <div className={`relative w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden mb-6 border ${isWinner ? 'border-gold shadow-[0_0_20px_rgba(201,162,39,0.3)]' : 'border-white/5'}`}>
                <img src={film.poster} alt={film.name} className={`w-full h-full object-cover ${isWinner ? 'scale-110' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {isVoted && !isWinner && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-3xl font-black text-white">{pct}%</span>
                    </div>
                )}

                {isWinner && (
                    <div className="absolute inset-0 bg-gold/20 flex flex-col items-center justify-end p-4">
                        <div className="bg-gold text-black text-[9px] font-black px-2 py-0.5 rounded-full mb-2">WINNER</div>
                        <span className="text-3xl font-black text-white">{pct}%</span>
                    </div>
                )}

                {film.fameBoost && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gold/90 text-navy-950 text-[8px] font-black rounded backdrop-blur-sm animate-bounce">
                        🔥 FAME BOOST
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
