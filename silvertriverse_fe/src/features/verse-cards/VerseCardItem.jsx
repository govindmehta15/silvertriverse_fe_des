import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './VerseCards.css';

export default function VerseCardItem({ card, owned = false }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const isRare = card.rarity === 'Rare';

    return (
        <div className="verse-card-3d group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`verse-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                
                {/* FRONT FACE */}
                <div className={`verse-card-front flex flex-col bg-navy-900 ${isRare ? 'rare-glow' : ''}`}>
                    <div className="relative h-2/3 overflow-hidden">
                        <img 
                            src={card.image || '/images/verse_card_placeholder.png'} 
                            alt={card.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-80" />
                        
                        {/* Rarity Label */}
                        <div className="absolute top-4 left-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isRare ? 'bg-gold-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                {card.rarity} {card.tier}
                            </span>
                        </div>

                        {/* Inventory Count (if owned) */}
                        {owned && (
                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                                <span className="text-[10px] text-white font-bold">x{card.ownedCount || 1}</span>
                            </div>
                        )}
                        
                        {/* Holographic Glint */}
                        {!isRare && <div className="holographic-glint" />}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                        <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">{card.film}</p>
                        <h3 className="text-white font-serif text-xl font-bold mb-2 truncate group-hover:text-gold-300 transition-colors">
                            {card.title}
                        </h3>
                        
                        <div className="mt-auto flex justify-between items-end">
                            <div>
                                <p className="text-gray-500 text-[8px] uppercase font-bold tracking-tighter mb-0.5">Price</p>
                                <p className="text-lg font-black text-white price-tag-neon">₹{card.price}</p>
                            </div>
                            
                            {card.tier === 'Daily' && (
                                <div className="flex gap-1">
                                    <div className="countdown-digit">{card.expiresIn}d</div>
                                    <div className="countdown-digit">05h</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BACK FACE (Details & Lore) */}
                <div className="verse-card-back p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                        <img src="/logo.png" alt="ST" className="w-8 h-8 opacity-40" />
                    </div>
                    
                    <span className="text-gold-500 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Official Verse Archive</span>
                    
                    <h4 className="text-white font-serif text-lg mb-2">{card.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-light mb-6">
                        {card.description}
                    </p>
                    
                    <div className="w-full h-px bg-white/5 mb-6" />
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="text-left">
                            <p className="text-gray-600 text-[8px] uppercase font-black">Type</p>
                            <p className="text-white text-[10px] font-bold uppercase">{card.type || 'Standard'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600 text-[8px] uppercase font-black">Power</p>
                            <p className="text-silver text-[10px] font-bold uppercase">{card.utilityPower || 'N/A'}</p>
                        </div>
                    </div>

                    <p className="absolute bottom-6 text-[8px] text-gray-700 font-mono tracking-widest">
                        DEC-2026-ARCHIVE-417-SET
                    </p>
                </div>
            </div>
        </div>
    );
}
