import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verseCardService } from '../../services/verseCardService';
import VerseCardItem from './VerseCardItem';
import './VerseCards.css';

export default function VerseCardsPage() {
    const [activeTab, setActiveTab] = useState('drops'); // drops, collection, milestone
    const [cards, setCards] = useState([]);
    const [myCollection, setMyCollection] = useState([]);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        verseCardService.init();
        loadData();
    }, []);

    const loadData = () => {
        setCards(verseCardService.getAvailableCards());
        setMyCollection(verseCardService.getUserCollection());
        setProgress(verseCardService.getMilestoneProgress());
    };

    const handleBuy = (cardId) => {
        try {
            verseCardService.buyCommonCard(cardId);
            loadData();
            // In a real app, show toast success
        } catch (err) {
            alert(err.message);
        }
    };

    const handleApply = (cardId) => {
        try {
            verseCardService.applyForRareCard(cardId);
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 lg:pl-0">
            {/* Header section */}
            <div className="max-w-7xl mx-auto mb-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <span className="text-gold-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Pillar 9 — Verse Cards</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">Digital Archive</h1>
                        <button 
                            onClick={() => navigate('/verse-cards/marketplace')}
                            className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-gold-500 hover:text-white transition-colors border border-gold-500/20 px-4 py-2 rounded-full"
                        >
                            <span>🛒</span> Peer-to-Peer Marketplace
                        </button>
                    </div>
                    
                    {/* Progress Overview (Mini) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-black">Set Completion</span>
                            <span className="text-xl font-bold font-mono">{progress?.owned} <span className="text-gray-600">/ {progress?.total}</span></span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gold-500 uppercase font-black">Milestone Reward</span>
                            <span className="text-xl font-bold font-mono">₹1.0L</span>
                        </div>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex gap-8 mt-12 border-b border-white/5">
                    {['drops', 'collection', 'milestone'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'drops' && (
                        <motion.div 
                            key="drops"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-16"
                        >
                            {/* Daily Drop Section */}
                            <section>
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-2xl font-serif italic text-white/90">Daily Common Verse</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Starts at ₹2 • New card every 24h</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {cards.filter(c => c.tier === 'Daily').map(card => (
                                        <div key={card.id} className="flex flex-col">
                                            <VerseCardItem card={card} />
                                            <button 
                                                onClick={() => handleBuy(card.id)}
                                                className="mt-6 w-full py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-gold-500 transition-colors rounded-xl"
                                            >
                                                Purchase Card — ₹2
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Weekly Rare Section */}
                            <section>
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-2xl font-serif italic text-white/90">Weekly Rare Prestige</h2>
                                    <p className="text-[10px] text-gold-500/80 font-bold uppercase tracking-widest">Limited Supply • IPO Allocation Only</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {cards.filter(c => c.tier === 'Weekly').map(card => (
                                        <div key={card.id} className="flex flex-col">
                                            <VerseCardItem card={card} />
                                            <button 
                                                disabled={card.status === 'upcoming' || verseCardService.hasApplied(card.id)}
                                                onClick={() => handleApply(card.id)}
                                                className={`mt-6 w-full py-4 font-black uppercase text-xs tracking-widest rounded-xl transition-all ${
                                                    verseCardService.hasApplied(card.id) 
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/30 cursor-default'
                                                    : card.status === 'upcoming'
                                                      ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                                      : 'bg-gold-500 text-black hover:scale-[1.02]'
                                                }`}
                                            >
                                                {verseCardService.hasApplied(card.id) ? 'Applied for IPO' : card.status === 'upcoming' ? 'Coming Soon' : 'Apply for Allocation — ₹100'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'collection' && (
                        <motion.div 
                            key="collection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                                <h2 className="text-2xl font-serif italic text-white/90">My Digital Shelf</h2>
                                <div className="flex gap-2">
                                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-gray-400 outline-none">
                                        <option>All Films</option>
                                    </select>
                                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-gold-500 outline-none">
                                        <option>Tier: All</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                    </select>
                                </div>
                            </div>
                            
                            {myCollection.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {myCollection.map(c => (
                                        <VerseCardItem key={c.id} card={c} owned={true} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <p className="text-gray-500 font-serif italic text-xl">Your archive is currently empty.</p>
                                    <button onClick={() => setActiveTab('drops')} className="mt-4 text-xs font-black uppercase text-gold-500 hover:text-white transition-colors">Start your collection</button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'milestone' && (
                        <motion.div 
                            key="milestone"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="milestone-bar-glass rounded-[40px] p-12 text-center overflow-hidden relative">
                                {/* Ambient Background Glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />

                                <span className="text-gold-500 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Grand Collection Milestone</span>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">The Annual 417 Challenge</h1>
                                
                                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-light">
                                    Be the first to collect all 365 Daily Common Cards and 52 Weekly Rare Cards to claim the ultimate platform award.
                                </p>

                                {/* Progress Bar */}
                                <div className="relative mb-16">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-silver">Progress</span>
                                        <span className="text-2xl font-mono font-bold text-white">{progress?.owned} <span className="text-gray-600 text-sm">/ {progress?.total}</span></span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress?.percentage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gold-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                        />
                                    </div>
                                </div>

                                {/* Reward Board */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors">
                                        <span className="text-[9px] text-gold-500 font-bold uppercase tracking-widest block mb-4">Current Champion Prize</span>
                                        <p className="text-3xl font-serif italic text-white mb-2">₹1,00,000 Reward</p>
                                        <p className="text-gray-500 text-xs">Direct platform credit for land, relics, and merchandise.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors">
                                        <span className="text-[9px] text-silver font-bold uppercase tracking-widest block mb-4">Ecosystem Perks</span>
                                        <p className="text-lg font-bold text-white mb-2">Infinite VIP Access</p>
                                        <p className="text-gray-500 text-xs">Unlock exclusive character variants and production BTS content.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
