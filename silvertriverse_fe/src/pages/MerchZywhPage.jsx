import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

const REACTIONS_WRONG = ['🤔', '😅', '🫠', '💭', '🧐', '😤', '🫣', '🤷', '😶‍🌫️', '🙃'];
const REACTIONS_RIGHT = ['🔥', '🎉', '✨', '💎', '⚡', '🌟', '🎯', '💥', '🚀', '🏆'];

function useAuctionTimer(targetMs) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
    const diff = Math.max(0, targetMs - now);
    const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
    return { formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, isExpired: diff <= 0 };
}

export default function MerchZywhPage() {
    const { zywhItems, zywhProgress, initZywh, guessZywhDigit, blockZywhMandate, formatPrice } = useMerchEngine();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItemId, setActiveItemId] = useState(null);
    const [currentPhase, setCurrentPhase] = useState('select'); // select | discovery | step_length | step_digits | mandate | final_digits | auction
    const [lengthGuess, setLengthGuess] = useState(null);
    const [digitGuesses, setDigitGuesses] = useState([]);
    const [currentDigitIdx, setCurrentDigitIdx] = useState(0);
    const [reaction, setReaction] = useState(null);
    const [mandateBlocking, setMandateBlocking] = useState(false);
    const [auctionBid, setAuctionBid] = useState('');

    const activeItem = zywhItems.find(z => z.id === activeItemId);
    const progress = activeItemId ? zywhProgress[activeItemId] : null;

    // Auto-start discovery if coming from detail page
    useEffect(() => {
        if (location.state?.autoStart) {
            const target = zywhItems.find(z => z.id === location.state.autoStart);
            if (target) {
                setActiveItemId(target.id);
                initZywh(target.id);
                setCurrentPhase('discovery');
            }
        }
    }, [location.state, zywhItems, initZywh]);

    const showReaction = useCallback((correct) => {
        const pool = correct ? REACTIONS_RIGHT : REACTIONS_WRONG;
        const emoji = pool[Math.floor(Math.random() * pool.length)];
        
        // Multiple emojis for more "excitement"
        const count = correct ? 3 : 1;
        setReaction(Array(count).fill(emoji).join(' '));
        setTimeout(() => setReaction(null), 1500);
    }, []);

    const startDiscovery = (item) => {
        setActiveItemId(item.id);
        initZywh(item.id);
        setCurrentPhase('discovery');
        setDigitGuesses([]);
        setCurrentDigitIdx(0);
    };

    const handleLengthGuess = (guess) => {
        setLengthGuess(guess);
        const result = guessZywhDigit(activeItemId, 0, guess);
        showReaction(result.correct);
        setTimeout(() => {
            setCurrentPhase('step_digits');
            setCurrentDigitIdx(0);
        }, 1200);
    };

    const handleDigitGuess = (guess) => {
        const result = guessZywhDigit(activeItemId, currentDigitIdx + 1, guess);
        showReaction(result.correct);

        setDigitGuesses(prev => {
            const next = [...prev];
            next[currentDigitIdx] = { guess, correct: result.correct };
            return next;
        });

        setTimeout(() => {
            // After guessing 2 digits, require mandate
            if (currentDigitIdx === 1 && !progress?.mandateBlocked) {
                setCurrentPhase('mandate');
            } else if (currentDigitIdx + 1 >= (activeItem?.totalDigits || 6)) {
                setCurrentPhase('auction');
                // Celebrate full unlock
                setReaction('🎉 🎊 ✨ 🏆 💥');
                setTimeout(() => setReaction(null), 3000);
            } else {
                setCurrentDigitIdx(prev => prev + 1);
            }
        }, 1200);
    };

    const handleMandate = async () => {
        setMandateBlocking(true);
        const result = await blockZywhMandate(activeItemId);
        setMandateBlocking(false);
        if (result.success) {
            setReaction('🔓 ✅');
            setTimeout(() => {
                setReaction(null);
                setCurrentDigitIdx(prev => prev + 1);
                setCurrentPhase('step_digits');
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Floating Reaction */}
            <AnimatePresence>
                {reaction && (
                    <motion.div initial={{ opacity: 0, scale: 0.5, y: 0 }} animate={{ opacity: 1, scale: 1.5, y: -80 }}
                        exit={{ opacity: 0, y: -160, scale: 2 }} transition={{ duration: 0.8 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] text-7xl pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        {reaction}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-navy-950/80 to-navy-950" />
                <div className="relative px-4 pt-8 pb-6 max-w-4xl mx-auto">
                    <button onClick={() => { if (currentPhase !== 'select') { setCurrentPhase('select'); setActiveItemId(null); } else navigate('/merchandise'); }}
                        className="text-gold text-[9px] font-bold uppercase tracking-[0.4em] hover:underline mb-4 block">
                        {currentPhase !== 'select' ? '← Back to Items' : '← Atelier'}
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="font-serif text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-purple-400 uppercase italic">ZYWH</h1>
                        <span className="text-[8px] font-bold text-purple-400/60 uppercase tracking-[0.3em] bg-purple-900/20 border border-purple-700/20 px-3 py-1 rounded-full">
                            Gamified Auction
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 italic max-w-md">Zillion Years Worth of Heritage. Decode the hidden price digit-by-digit to unlock exclusive auction access.</p>
                </div>
            </div>

            <div className="px-4 max-w-4xl mx-auto mt-4">
                {/* ═══ ITEM SELECTION ═══ */}
                {currentPhase === 'select' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                        <h2 className="text-white font-serif text-lg uppercase tracking-wider flex items-center gap-2">
                            🧩 Active Discovery Targets
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {zywhItems.map(item => (
                                <motion.div key={item.id} whileHover={{ y: -4 }}
                                    onClick={() => navigate(`/merchandise/detail/zywh/${item.id}`)}
                                    className="rounded-2xl border border-purple-700/20 overflow-hidden cursor-pointer group hover:border-purple-500/40 transition-all"
                                    style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(10,15,30,0.95) 100%)' }}>
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-purple-900/80 border border-purple-500/30 rounded-full text-[8px] font-bold text-purple-300 uppercase tracking-widest backdrop-blur-sm">
                                            🧩 Decode to Unlock
                                        </div>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="text-gold font-mono text-xl font-black">₹ ??,??,???</span>
                                            <p className="text-gray-400 text-[9px] mt-0.5">Price Hidden</p>
                                        </div>
                                        <div className="absolute top-3 left-3 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
                                            <span className="text-[8px] text-purple-400 font-bold block uppercase tracking-widest">Util Pwr</span>
                                            <span className="text-white font-mono font-bold text-xs">+{item.utilityPower}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <span className="text-[8px] text-gray-500 uppercase tracking-widest">{item.filmReference}</span>
                                        <h3 className="text-white font-serif text-base font-bold mt-1 mb-3">{item.title}</h3>
                                        <button className="w-full py-3 border border-purple-500/30 text-purple-300 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-purple-900/30 transition-all">
                                            COMMENCE DECODING
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══ DISCOVERY SCREEN ═══ */}
                {currentPhase === 'discovery' && activeItem && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center space-y-8">
                        <div className="relative">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-purple-500/20 relative">
                                <img src={activeItem.image} alt="" className="w-full h-full object-cover opacity-40 blur-sm" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl">🧩</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-[9px] text-purple-400 font-bold uppercase tracking-[0.5em] block mb-2 animate-pulse">Discovery Protocol</span>
                            <h2 className="font-serif text-3xl font-black text-white italic uppercase">{activeItem.title}</h2>
                            <p className="text-gray-500 text-sm italic mt-3 max-w-md mx-auto leading-relaxed">
                                This artifact's value is sealed. To qualify for the exclusive auction, you must decode the price digit by digit.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl border border-purple-700/20 bg-purple-950/10">
                            <div className="flex justify-center gap-2 mb-3">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className="w-8 h-10 rounded-lg bg-navy-800/60 border border-purple-700/20 flex items-center justify-center">
                                        <span className="text-purple-400/40 font-mono font-bold text-lg">?</span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-gold font-mono text-xl font-black">₹ ??,???,???</span>
                            <p className="text-gray-600 text-[9px] mt-1 uppercase tracking-widest">Find the price to unlock</p>
                        </div>

                        <button onClick={() => setCurrentPhase('step_length')}
                            className="w-full py-4 bg-white text-black rounded-xl text-sm uppercase font-black tracking-[0.4em] hover:bg-purple-200 transition-all shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            START DECODING
                        </button>
                    </motion.div>
                )}

                {/* ═══ STEP 1: TOTAL DIGITS ═══ */}
                {currentPhase === 'step_length' && activeItem && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center space-y-8">
                        <div className="rounded-2xl border border-purple-700/20 p-8 bg-purple-950/10">
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-[0.5em] block mb-3">STEP 1 — Decode Length</span>
                            <h3 className="font-serif text-2xl font-black text-white italic uppercase mb-2">How Many Digits?</h3>
                            <p className="text-gray-500 text-xs italic">How many digits make up the base valuation of this artifact?</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            {[4, 5, 6, 7, 8].map(n => (
                                <motion.button key={n} whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLengthGuess(n)}
                                    className={`w-16 h-16 rounded-2xl border-2 text-xl font-black font-mono transition-all ${
                                        lengthGuess === n ? 'bg-purple-500 border-purple-400 text-white scale-110' 
                                        : 'bg-navy-800/40 border-purple-700/20 text-white hover:border-purple-500/40 hover:text-purple-300'
                                    }`}>{n}</motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══ STEP 2+: INDIVIDUAL DIGITS ═══ */}
                {currentPhase === 'step_digits' && activeItem && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center space-y-8">
                        <div className="rounded-2xl border border-purple-700/20 p-8 bg-purple-950/10">
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-[0.5em] block mb-3">
                                STEP {currentDigitIdx + 2} — Digit #{currentDigitIdx + 1}
                            </span>
                            <h3 className="font-serif text-2xl font-black text-white italic uppercase mb-2">
                                {currentDigitIdx === 0 ? 'The Vanguard Digit' : `Digit #${currentDigitIdx + 1}`}
                            </h3>
                            <p className="text-gray-500 text-xs italic">Identify digit #{currentDigitIdx + 1} of the price</p>
                        </div>

                        {/* Progress display */}
                        <div className="flex justify-center gap-1.5">
                            {Array.from({ length: activeItem.totalDigits }).map((_, i) => {
                                const guessed = digitGuesses[i];
                                const isCurrent = i === currentDigitIdx;
                                return (
                                    <div key={i} className={`w-10 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg border-2 transition-all ${
                                        guessed ? (guessed.correct ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-amber-900/20 border-amber-500/30 text-amber-400')
                                        : isCurrent ? 'bg-purple-900/30 border-purple-400/50 text-purple-200 animate-pulse' 
                                        : 'bg-navy-800/30 border-navy-700/20 text-gray-600'
                                    }`}>
                                        {guessed ? guessed.guess : isCurrent ? '?' : '_'}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Number pad */}
                        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                            {(currentDigitIdx === 0 ? [1,2,3,4,5,6,7,8,9] : [0,1,2,3,4,5,6,7,8,9]).map(n => (
                                <motion.button key={n} whileTap={{ scale: 0.85 }}
                                    onClick={() => handleDigitGuess(n)}
                                    className="h-14 rounded-2xl bg-navy-800/40 border border-purple-700/20 text-white font-mono font-bold text-lg hover:border-purple-500/40 hover:bg-purple-900/20 transition-all">
                                    {n}
                                </motion.button>
                            ))}
                        </div>

                        {/* Past reactions */}
                        {progress?.reactions?.length > 0 && (
                            <div className="flex justify-center gap-2">
                                {progress.reactions.slice(-5).map((r, i) => (
                                    <span key={i} className="text-2xl opacity-60">{r}</span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ═══ MANDATE SCREEN ═══ */}
                {currentPhase === 'mandate' && activeItem && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center space-y-8">
                        <div className="rounded-2xl border border-gold/20 p-8"
                            style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(201,162,39,0.05) 100%)' }}>
                            <span className="text-[9px] font-bold text-gold uppercase tracking-[0.5em] block mb-3">PRE-QUALIFICATION</span>
                            <h2 className="font-serif text-3xl font-black text-white italic uppercase mb-3">Financial Intent</h2>
                            <p className="text-gray-400 text-sm italic max-w-md mx-auto leading-relaxed mb-6">
                                To proceed to the final decode and enter the auction, you must authorize an AutoPay mandate. 
                                This blocks {formatPrice(activeItem.mandateAmount)} to filter casual observers.
                            </p>

                            <div className="p-5 bg-navy-800/40 border border-navy-700/20 rounded-xl text-left space-y-4 mb-6">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Mandate Hold</span>
                                    <span className="text-gold">{formatPrice(activeItem.mandateAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-3 border-t border-navy-700/20">
                                    <span className="text-gray-500">Decoded So Far</span>
                                    <span className="text-purple-300 font-mono">{digitGuesses.map(d => d?.guess ?? '?').join('')}...</span>
                                </div>
                            </div>

                            <button onClick={handleMandate} disabled={mandateBlocking}
                                className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.4em] hover:bg-yellow-300 transition-all shadow-[0_0_30px_rgba(201,162,39,0.15)] disabled:opacity-50">
                                {mandateBlocking ? 'Authorizing...' : 'AUTHORIZE MANDATE'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ═══ AUCTION ROOM ═══ */}
                {currentPhase === 'auction' && activeItem && (
                    <AuctionRoom item={activeItem} digitGuesses={digitGuesses} formatPrice={formatPrice} />
                )}
            </div>
        </div>
    );
}

function AuctionRoom({ item, digitGuesses, formatPrice }) {
    const { formatted, isExpired } = useAuctionTimer(item.auctionEndsAt);
    const [bidPlaced, setBidPlaced] = useState(false);

    const decodedPrice = digitGuesses.map(d => d?.guess ?? '?').join('');

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-6">
            {/* Access badge */}
            <div className="flex justify-center">
                <span className="px-6 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-[9px] font-bold text-emerald-400 uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                    ✓ Access Granted — Exclusive Bidding Pool
                </span>
            </div>

            <div className="rounded-2xl border border-gold/30 p-8 text-center"
                style={{ background: 'linear-gradient(180deg, rgba(201,162,39,0.05) 0%, rgba(10,15,30,0.95) 100%)' }}>
                
                <h2 className="font-serif text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold italic uppercase mb-2">
                    LIVE AUCTION
                </h2>
                <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-8">{item.title}</p>

                <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-navy-700/20">
                    <div className="text-center">
                        <span className="text-[8px] text-gray-600 uppercase tracking-[0.4em] block mb-2">Decoded Base Price</span>
                        <span className="text-2xl font-mono font-black text-gray-400 line-through decoration-red-500/40">
                            ₹{Number(decodedPrice).toLocaleString('en-IN') || '??'}
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="text-[8px] text-gold uppercase tracking-[0.4em] block mb-2">Current Highest Bid</span>
                        <span className="text-2xl font-mono font-black text-gold">
                            {formatPrice(item.currentBid)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-navy-800/30 border border-navy-700/15">
                        <span className="text-emerald-400 font-mono font-bold text-lg block">{formatted}</span>
                        <span className="text-[7px] text-gray-600 uppercase tracking-widest">Time Left</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-800/30 border border-navy-700/15">
                        <span className="text-white font-mono font-bold text-lg block">{item.liveBidders}</span>
                        <span className="text-[7px] text-gray-600 uppercase tracking-widest">Elite Bidders</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-800/30 border border-navy-700/15">
                        <span className="text-white font-mono font-bold text-lg block">{item.highestBidder}</span>
                        <span className="text-[7px] text-gray-600 uppercase tracking-widest">Leading</span>
                    </div>
                </div>

                {!bidPlaced ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setBidPlaced(true)}
                        className="w-full py-4 bg-gold text-black rounded-xl text-sm uppercase font-black tracking-[0.4em] shadow-[0_0_40px_rgba(201,162,39,0.15)] hover:bg-yellow-300 transition-all">
                        OVERRIDE & BID {formatPrice(Math.floor(item.currentBid * 1.05))}
                    </motion.button>
                ) : (
                    <div className="py-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center">
                        <span className="text-emerald-400 font-bold text-sm">✓ BID PLACED — {formatPrice(Math.floor(item.currentBid * 1.05))}</span>
                        <p className="text-gray-500 text-xs mt-1">Waiting for auction to close...</p>
                    </div>
                )}

                <div className="flex justify-center items-center gap-4 mt-4 text-[9px] text-gray-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Mandate Verified
                    </span>
                    <span className="h-3 w-px bg-gray-700" />
                    <span>{item.liveBidders} Elite Bidders Online</span>
                </div>
            </div>
        </motion.div>
    );
}
