import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sllService } from '../../services/sllService';

export default function SLLCreateLeague({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [config, setConfig] = useState({
        title: '',
        format: 'Knockout',
        participants: [],
        duration: '1 day',
        visibility: 'Live Percentages',
        privacy: 'Public',
        publishNow: true
    });

    const filmArchive = sllService.getFilmArchive(searchQuery);

    const toggleFilm = (film) => {
        const index = config.participants.findIndex(p => p.id === film.id);
        if (index >= 0) {
            setConfig({ ...config, participants: config.participants.filter(p => p.id !== film.id) });
        } else if (config.participants.length < 64) {
            setConfig({ ...config, participants: [...config.participants, film] });
        }
    };

    const handlePublish = () => {
        sllService.createLeague(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-3xl bg-navy-950 border border-white/10 rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-3xl font-serif font-bold">Forge <span className="text-silver-shimmer italic">New League</span></h2>
                        <div className="flex items-center gap-3 mt-2">
                             <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <div key={s} className={`h-1 w-6 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                ))}
                             </div>
                             <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Step {step} of 5</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <div>
                                <label className="block text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-4">Foundation</label>
                                <input 
                                    type="text"
                                    placeholder="e.g., The Great Malayalam Thriller Cup"
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-all"
                                    value={config.title}
                                    onChange={(e) => setConfig({...config, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-6">Select Tournament Architecture</label>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { id: 'Knockout', label: 'Knockout Brackets', desc: 'Direct elimination system' },
                                        { id: 'Group + Knockout', label: 'World Cup Format', desc: 'Groups then knockouts' },
                                        { id: 'League Table', label: 'Season League', desc: 'Points based ranking' },
                                        { id: 'One-to-One', label: 'Dual Duel', desc: 'Quick 1v1 match' }
                                    ].map(format => (
                                        <button 
                                            key={format.id}
                                            onClick={() => setConfig({...config, format: format.id})}
                                            className={`p-6 rounded-[32px] border text-left transition-all relative group ${
                                                config.format === format.id ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                                            }`}
                                        >
                                            <p className="text-base font-bold">{format.label}</p>
                                            <p className="text-[10px] uppercase font-bold tracking-tight opacity-60 mt-1">{format.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div className="bg-navy-900/50 p-6 rounded-[32px] border border-white/5">
                                <p className="text-gray-400 text-sm mb-6 font-medium">Selected Participants: <span className="text-emerald-400 font-black">{config.participants.length}</span> / 64</p>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="Search Silvertriverse Archives..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder:text-white/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filmArchive.map(film => {
                                    const isSelected = config.participants.find(p => p.id === film.id);
                                    return (
                                        <button 
                                            key={film.id}
                                            onClick={() => toggleFilm(film)}
                                            className={`relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all group ${
                                                isSelected ? 'border-emerald-500' : 'border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <img src={film.poster} className={`w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all ${isSelected ? 'grayscale-0 scale-105' : ''}`} alt="" />
                                            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-white'}`}>
                                                    {isSelected ? <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> : <span className="text-white text-xl">+</span>}
                                                </div>
                                            </div>
                                            <div className="absolute inset-x-2 bottom-2 p-3 bg-black/60 backdrop-blur-md rounded-xl">
                                                <p className="text-[10px] font-bold text-white line-clamp-1 truncate">{film.name}</p>
                                                <p className="text-[8px] text-white/40 uppercase font-black">{film.genre}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                             <div>
                                <label className="block text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-6 text-center">Set Engagement Rules</label>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                                        <div>
                                            <p className="font-bold">Match Duration</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Time fans have to vote</p>
                                        </div>
                                        <select 
                                            className="bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-sm"
                                            value={config.duration}
                                            onChange={(e) => setConfig({...config, duration: e.target.value})}
                                        >
                                            {['10 minutes', '1 hour', '1 day', '7 days'].map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                                        <div>
                                            <p className="font-bold">Voting Visibility</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Should results be live or hidden</p>
                                        </div>
                                        <select 
                                            className="bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-sm"
                                            value={config.visibility}
                                            onChange={(e) => setConfig({...config, visibility: e.target.value})}
                                        >
                                            {['Live Percentages', 'Hidden Results', 'Reveal at End'].map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                                        <div>
                                            <p className="font-bold">Privacy</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Public vs Invitation only</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {['Public', 'Invite Only'].map(p => (
                                                <button 
                                                    key={p}
                                                    onClick={() => setConfig({...config, privacy: p})}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${config.privacy === p ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
                                <span className="text-4xl">🌠</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4">Almost Prime Time</h3>
                            <p className="text-gray-400 max-w-sm mb-10">Your league "<span className="text-white font-bold">{config.title}</span>" is ready to be broadcasted to the Reelity feed.</p>
                            
                            <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-left space-y-4">
                                <div className="flex justify-between text-[10px] uppercase font-black">
                                    <span className="text-gray-500">Format</span>
                                    <span>{config.format}</span>
                                </div>
                                <div className="flex justify-between text-[10px] uppercase font-black">
                                    <span className="text-gray-500">Participants</span>
                                    <span>{config.participants.length}</span>
                                </div>
                                <div className="flex justify-between text-[10px] uppercase font-black">
                                    <span className="text-gray-500">Duration</span>
                                    <span>{config.duration}</span>
                                </div>
                            </div>
                         </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-10">
                            <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-8 border border-gold/30">
                                <span className="text-4xl">🏅</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gold">League Published!</h3>
                            <p className="text-gray-400 max-w-sm mb-10">Real-time tracking is now active. Fans are joining the stadium to cast their legacy votes.</p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Fan Entry</p>
                                    <p className="text-xl font-bold font-mono">LIVE</p>
                                </div>
                                <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Status</p>
                                    <p className="text-xl font-bold font-mono text-emerald-400 tracking-widest text-[10px] mt-2">STREAMING</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                    <button 
                        onClick={() => step > 1 && setStep(step - 1)}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-4 rounded-2xl hover:bg-white/5 ${step === 1 || step === 5 ? 'opacity-0 pointer-events-none' : 'text-white/40 hover:text-white'}`}
                    >
                        ← Back
                    </button>
                    {step < 4 ? (
                        <button 
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && !config.title}
                            className="px-10 py-4 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100"
                        >
                            Propagate →
                        </button>
                    ) : step === 4 ? (
                        <button 
                            onClick={() => {
                                handlePublish();
                                setStep(5);
                            }}
                            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:from-white hover:to-white transition-all shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
                        >
                            Launch into Reelity ⚡
                        </button>
                    ) : (
                        <button 
                            onClick={onClose}
                            className="px-10 py-4 bg-white/5 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Enter Stadium
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
