import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './SLC.css';

export default function SLCStorybook({ coin, onClose }) {
    const [currentPage, setCurrentPage] = useState(0);

    const pages = coin.storybook;

    const nextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleDragEnd = (event, info) => {
        if (info.offset.x < -100) {
            nextPage();
        } else if (info.offset.x > 100) {
            prevPage();
        }
    };

    const storybookContent = (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black overflow-y-auto overflow-x-hidden pt-safe pb-safe"
        >
            {/* Ambient Background - keeps background fixed during scroll */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-black to-navy-900 opacity-60" />
                <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url(${pages[currentPage].image || '/images/slc_placeholder_bg.png'})` }}
                />
            </div>

            <div className="relative z-10 w-full min-h-screen flex flex-col items-center p-6 md:p-20">
                {/* Header */}
                <header className="w-full max-w-5xl flex justify-between items-center mb-8 shrink-0">
                    <div className="flex flex-col text-left">
                        <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">Cinematic Storybook</span>
                        <h2 className="text-white font-serif text-2xl tracking-wide">{coin.title}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none"
                    >
                        ✕
                    </button>
                </header>

                {/* Progress Bar */}
                <div className="w-full max-w-5xl h-1 bg-white/10 rounded-full mb-8 md:mb-12 overflow-hidden shrink-0">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                </div>

                {/* Page Content & Visuals */}
                <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentPage}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex-1 flex flex-col justify-center text-left cursor-grab active:cursor-grabbing"
                        >
                            <span className="text-white/40 font-serif text-6xl mb-4 italic opacity-20">0{currentPage + 1}</span>
                            <h3 className="text-3xl md:text-5xl font-serif silver-text-shimmer font-bold mb-6 leading-tight">
                                {pages[currentPage].title}
                            </h3>
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                                {pages[currentPage].content}
                            </p>
                            
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-12 h-px bg-white/20" />
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                    {pages[currentPage].type === 'bts' ? 'Behind the Scenes' : pages[currentPage].type === 'narrative' ? 'Origin Story' : 'Curator Note'}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Visual Side */}
                    <motion.div 
                        key={`img-${currentPage}`}
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                        className="flex-1 w-full aspect-[4/5] md:aspect-auto md:h-full max-h-[500px] md:max-h-none bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden group shrink-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                        <div className="absolute inset-0 border border-white/10 rounded-2xl z-20 pointer-events-none" />
                        
                        {/* Type indicator */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/5 font-serif text-6xl md:text-8xl uppercase z-0 italic">
                            {pages[currentPage].type}
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 z-20">
                            <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white mb-2">
                                i
                            </div>
                            <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-normal">
                                 Cinematic Capture — Official Archive 2026
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <footer className="w-full max-w-5xl mt-8 md:mt-12 flex justify-between shrink-0 pb-8">
                    <button 
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-opacity ${currentPage === 0 ? 'opacity-20 pointer-events-none' : 'text-white hover:text-gray-300'}`}
                    >
                        ← Prev
                    </button>
                    
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold md:hidden">
                        Swipe to Turn Page
                    </div>

                    <button 
                        onClick={nextPage}
                        disabled={currentPage === pages.length - 1}
                        className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-opacity ${currentPage === pages.length - 1 ? 'opacity-20 pointer-events-none' : 'text-white hover:text-gray-300'}`}
                    >
                        {currentPage === pages.length - 1 ? 'End' : 'Next →'}
                    </button>
                </footer>
            </div>

            {/* Desktop Key Commands hint */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-gray-700 text-[10px] uppercase tracking-widest font-black hidden md:block z-20">
                Arrows or Drag to Navigate
            </div>
        </motion.div>
    );

    return createPortal(storybookContent, document.body);
}
