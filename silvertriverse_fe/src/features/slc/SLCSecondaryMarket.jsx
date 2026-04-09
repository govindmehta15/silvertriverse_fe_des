import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { slcService } from '../../services/slcService';
import { useToast } from '../../context/ToastContext';
import './SLC.css';

export default function SLCSecondaryMarket() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [listings, setListings] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setListings(slcService.getMarketplaceListings());
    }, []);

    const handlePurchase = (listingId) => {
        const res = slcService.purchaseFromMarket(listingId);
        if (res.success) {
            addToast('Purchase successful! Coin added to Vault.', 'success');
            setListings(slcService.getMarketplaceListings());
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-navy-950">
            <header className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button 
                            onClick={() => navigate('/slc')}
                            className="text-silver hover:text-white text-sm font-bold flex items-center gap-2 mb-4 group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to New Drops
                        </button>
                        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
                            Heritage <span className="silver-text-shimmer">Secondary Market</span>
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Secure platform escrow for verified physical silver legendary coins.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-navy-900 border border-navy-700 px-4 py-2 rounded-xl text-center">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Escrow Protected</p>
                            <p className="text-sm font-bold text-green-400">Verified Stocks</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {listings.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed border-navy-800 rounded-3xl">
                        <p className="text-gray-500 text-lg">No listings available at the moment.</p>
                        <p className="text-gray-600 text-sm mt-2">Check back later or visit the <button onClick={() => navigate('/slc')} className="text-silver underline">New Drops</button> page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing, index) => (
                            <motion.div
                                key={listing.listingId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="metallic-card rounded-2xl p-1 group"
                            >
                                <div className="bg-navy-900 rounded-xl overflow-hidden">
                                    <div className="aspect-[4/3] relative flex items-center justify-center p-6 bg-navy-950/50">
                                        <img 
                                            src={listing.image} 
                                            alt={listing.title} 
                                            className="w-40 h-40 object-contain drop-shadow-[0_0_20px_rgba(192,192,192,0.3)] group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-navy-900/80 border border-silver/30 px-3 py-1 rounded-full backdrop-blur-md">
                                            <span className="text-[10px] text-silver font-black">#{listing.serialNumber}</span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-serif text-white font-bold">{listing.title}</h3>
                                                <p className="text-xs text-silver font-bold">{listing.film}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase font-black">Listing Price</p>
                                                <p className="text-2xl font-serif text-white tracking-wide">₹{listing.resalePrice?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                <p className="text-[9px] text-gray-500 uppercase font-black">Utility Power</p>
                                                <p className="text-lg font-bold text-blue-400">+{listing.utilityPower}%</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                <p className="text-[9px] text-gray-500 uppercase font-black">Weight</p>
                                                <p className="text-lg font-bold text-gray-300">{listing.silverWeight}</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handlePurchase(listing.listingId)}
                                            className="w-full py-4 bg-silver text-navy-950 font-black uppercase tracking-widest rounded-xl hover:shadow-glow-silver transition-all"
                                        >
                                            Purchase from Escrow
                                        </button>
                                        <p className="text-[9px] text-center text-gray-600 mt-2 uppercase">Physical delivery tracking enabled after purchase</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
