import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { verseCardService } from '../../services/verseCardService';
import './VerseCards.css';

export default function VerseCardMarketplace() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        // Simulation: Get some rare cards listed in marketplace
        const allCards = verseCardService.getAvailableCards();
        const marketplaceItems = allCards.filter(c => c.rarity === 'Rare').map(c => ({
            ...c,
            listingPrice: c.price * 1.5, // 50% premium
            seller: 'CollectorsEdge_42',
            serialNo: '#089'
        }));
        setListings(marketplaceItems);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 lg:pl-0">
            <header className="max-w-7xl mx-auto mb-12">
                <button 
                    onClick={() => navigate('/verse-cards')}
                    className="text-gold-500 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"
                >
                    ← Back to Archive
                </button>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">Verse <span className="text-gold-500">Secondary Market</span></h1>
                <p className="text-gray-500 mt-2 max-w-xl">Peer-to-peer trading hub for limited edition cinematic archival cards. Verified authenticity enabled by ST-Vault.</p>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((item, idx) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-navy-900 border border-white/5 rounded-3xl overflow-hidden group hover:border-gold-500/30 transition-all"
                        >
                            <div className="relative aspect-[4/5] bg-navy-950 flex items-center justify-center p-8 overflow-hidden">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[10px] font-mono font-bold text-gold-500">{item.serialNo}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">{item.film}</p>
                                        <h3 className="text-xl font-serif text-white">{item.title}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Floor Price</p>
                                        <p className="text-xl font-bold text-white">₹{item.listingPrice}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-8 p-3 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-xs font-black text-black">{item.seller[0]}</div>
                                    <div>
                                        <p className="text-[8px] text-gray-500 uppercase font-black">Seller</p>
                                        <p className="text-[10px] text-white font-bold">{item.seller}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1">
                                        <span className="text-[8px] text-green-400 font-bold uppercase">Verified</span>
                                        <span className="w-1 h-1 bg-green-400 rounded-full" />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-gold-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-colors">
                                    Buy from Seller
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
