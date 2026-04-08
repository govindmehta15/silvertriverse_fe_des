import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { relicService, authService } from '../services';
import { formatPrice, timeAgo } from '../data/relicsData';
import useCountdown from '../hooks/useCountdown';
import GoldButton from '../components/GoldButton';
import { SkeletonBanner } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

/* ─── Phase config ──────────────────────────────────────────── */
const PHASES = [
    { key: 'submission', label: 'Submission', icon: '📥', desc: 'Artifact submitted by verified source' },
    { key: 'authentication', label: 'Authentication', icon: '🔐', desc: 'Verified by film industry contributors' },
    { key: 'catalogue', label: 'Catalogue', icon: '📋', desc: 'Listed in Heritage Catalogue' },
    { key: 'review', label: 'Public Review', icon: '👁️', desc: 'Community discovery window' },
    { key: 'mandate', label: 'Mandate Registry', icon: '📝', desc: 'Collectors register auction intent' },
    { key: 'bidding', label: 'Auction Bidding', icon: '🔨', desc: 'Live competitive bidding' },
    { key: 'closed', label: 'Closure', icon: '🏆', desc: 'Artifact claimed by winner' },
];

const phaseIdx = (p) => PHASES.findIndex(x => x.key === p);

export default function RelicDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    const [bidInput, setBidInput] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [outbidAlert, setOutbidAlert] = useState(false);
    const [userMandated, setUserMandated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['relic', Number(id)],
        queryFn: () => relicService.getRelicById(Number(id)),
        refetchInterval: 3000, 
    });

    const relic = response?.success ? response.data : null;

    useEffect(() => {
        authService.getCurrentUser().then(res => {
            if (res.success) {
                setCurrentUser(res.data);
                if (relic) {
                    setUserMandated(relic.mandatedUsers?.includes(res.data.id) || false);
                }
            }
        });
    }, [relic]);

    const { formatted, isUrgent, isExpired } = useCountdown(relic?.endTime ?? 0);

    const placeBidMutation = useMutation({
        mutationFn: async (amount) => {
            if (!currentUser) throw new Error('You must be logged in to bid.');
            const res = await relicService.placeBid(Number(id), currentUser.id, amount);
            if (!res.success) throw new Error(res.error);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['relic', Number(id)]);
            setBidInput('');
            setSelectedAmount(0);
            addToast('Bid placed! You are leading. ⚡', 'success');
        },
        onError: (error) => addToast(error.message, 'error')
    });

    const mandateMutation = useMutation({
        mutationFn: async () => {
            if (!currentUser) throw new Error('Please login to register.');
            return await relicService.registerMandate(Number(id), currentUser.id);
        },
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries(['relic', Number(id)]);
                setUserMandated(true);
                addToast('Mandate Registered! You are now eligible for live bidding.', 'success');
            } else {
                addToast(res.error, 'error');
            }
        }
    });

    useEffect(() => {
        if (relic && currentUser && relic.phase === 'bidding') {
            const highestBidder = relic.bids[0]?.userId;
            if (highestBidder && highestBidder !== currentUser.id && userMandated) {
                setOutbidAlert(true);
                if (window.navigator.vibrate) window.navigator.vibrate(200);
            } else {
                setOutbidAlert(false);
            }
        }
    }, [relic?.bids, currentUser, userMandated]);

    if (isLoading) return <div className="min-h-screen p-4 space-y-4"><SkeletonBanner duration={1.5} /></div>;
    if (isError || !relic) return <div className="min-h-screen flex items-center justify-center text-gray-400">Artifact not found.</div>;

    const isLive = relic.phase === 'bidding' && !isExpired;
    const isClosed = relic.phase === 'closed' || isExpired;
    const isOwner = currentUser && relic.winnerId === currentUser.id;
    const nextBid = relic.currentPrice + (relic.minimumIncrement || Math.ceil(relic.currentPrice * 0.05));

    const PreviewMode = () => (
        <div className="space-y-6">
            <div className="p-6 bg-navy-900/50 border border-gold/10 rounded-2xl">
                <h3 className="text-gold font-serif text-xl mb-4 italic">📜 Artifact Heritage</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{relic.description}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-gold/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Base Value</p>
                        <p className="text-lg font-serif text-white">{formatPrice(relic.basePrice)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-cyan-500/10">
                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest">Provenance</p>
                        <p className="text-xs text-white mt-1 uppercase truncate">{relic.submittedBy}</p>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-navy-900 border border-gold/20 rounded-2xl text-center">
                <span className="text-sm text-gold font-mono uppercase tracking-[0.2em] block mb-2">Auction Status</span>
                <p className="text-white font-serif text-lg mb-4">Registration window will open soon.</p>
                <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 rounded-xl uppercase text-xs font-black tracking-widest opacity-50">Wait for Mandate</button>
            </div>
        </div>
    );

    const MandateMode = () => (
        <div className="space-y-6">
            <div className="p-6 bg-gold/5 border border-gold/20 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                    <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-gold font-serif text-2xl mb-2 uppercase italic">Auction Entry Mandate</h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto mb-6">
                    To enter the live auction room, you must register a mandate. This reserves your eligibility and blocks the base price amount temporarily in your wallet.
                </p>
                
                <div className="p-4 bg-navy-900 border border-gold/10 rounded-xl mb-6 flex justify-between items-center text-left">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Blocked Amount</p>
                        <p className="text-white font-serif text-lg">{formatPrice(relic.basePrice)}</p>
                    </div>
                    <span className="text-[10px] bg-gold/10 text-gold px-2 py-1 rounded border border-gold/20 font-black">REQUIRED</span>
                </div>

                {userMandated ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        <span className="text-lg">✔</span> Mandate Confirmed. You are Eligible.
                    </div>
                ) : (
                    <GoldButton 
                        disabled={mandateMutation.isLoading}
                        onClick={() => mandateMutation.mutate()}
                        className="w-full justify-center group"
                    >
                        {mandateMutation.isLoading ? 'Processing...' : 'CONFIRM MANDATE REGISTRATION'}
                    </GoldButton>
                )}
            </div>
        </div>
    );

    const AuctionRoom = () => (
        <div className="space-y-6 relative">
            <AnimatePresence>
                {outbidAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="p-4 bg-red-600/90 backdrop-blur-md rounded-xl border border-red-400 text-center shadow-[0_0_40px_rgba(239,68,68,0.5)] z-20 mb-4"
                    >
                        <p className="text-white font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2">
                            ⚠️ YOU’VE BEEN OUTBID! PREPARE NEXT BID
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`p-6 rounded-3xl border transition-all duration-500 ${outbidAlert ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'bg-navy-900/60 border-gold/20 shadow-[0_0_40px_rgba(201,162,39,0.1)]'}`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Current Highest Bid</span>
                        <motion.h2 key={relic.currentPrice} 
                            initial={{ scale: 1.2, color: '#facc15' }} 
                            animate={{ scale: 1, color: '#ffffff' }} 
                            className="text-4xl md:text-5xl font-serif font-black text-white italic">
                            {formatPrice(relic.currentPrice)}
                        </motion.h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Highest Bidder</span>
                        <p className={`text-lg font-mono font-bold ${relic.bids[0]?.userId === currentUser?.id ? 'text-emerald-400' : 'text-gold'}`}>
                            {relic.bids[0]?.userId === currentUser?.id ? 'YOU (LEADING)' : `User_***${relic.bids[0]?.id?.slice(-2)}`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[10000, 25000, 50000].map(amt => (
                        <button 
                            key={amt}
                            onClick={() => {
                                setSelectedAmount(nextBid + amt);
                                setBidInput((nextBid + amt).toString());
                            }}
                            className={`py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${selectedAmount === nextBid + amt ? 'bg-gold text-navy-950 border-gold shadow-[0_0_15px_rgba(201,162,39,0.4)]' : 'border-gold/20 text-gold hover:bg-gold/5'}`}
                        >
                            +{formatPrice(amt)}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input 
                        type="number" 
                        value={bidInput}
                        onChange={e => setBidInput(e.target.value)}
                        placeholder={`Min ${formatPrice(nextBid)}`}
                        className="flex-1 px-4 py-4 bg-black/40 border border-gold/10 rounded-xl text-white font-mono focus:border-gold/40 focus:outline-none placeholder:text-zinc-700"
                    />
                    <button 
                        onClick={() => placeBidMutation.mutate(Number(bidInput))}
                        disabled={placeBidMutation.isLoading || !bidInput || Number(bidInput) < nextBid}
                        className="px-6 bg-gold text-navy-950 font-black rounded-xl uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        PLACE BID
                    </button>
                </div>
            </div>

            <div className="bg-black/20 rounded-2xl border border-navy-700/30 overflow-hidden">
                <div className="p-3 border-b border-navy-700/30 flex justify-between items-center px-4 bg-navy-800/40">
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Live Flow History</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System Connected
                    </span>
                </div>
                <div className="max-h-48 overflow-y-auto p-2 custom-scroll">
                    {relic.bids.map((bid, i) => (
                        <motion.div 
                            key={bid.id} 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex justify-between items-center p-3 rounded-xl mb-1 transition-all ${i === 0 ? 'bg-gold/10 border-l-4 border-gold' : 'bg-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{bid.avatar}</span>
                                <div>
                                    <p className={`text-xs font-black leading-none ${bid.userId === currentUser?.id ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                        {bid.userId === currentUser?.id ? 'YOU (OFFER)' : `Collector_***${bid.id.slice(-2)}`}
                                    </p>
                                    <p className="text-[9px] text-zinc-600 mt-1 uppercase font-mono">{timeAgo(bid.time)}</p>
                                </div>
                            </div>
                            <p className={`font-serif font-black ${i === 0 ? 'text-white text-lg italic' : 'text-zinc-500 text-sm'}`}>{formatPrice(bid.amount)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    const ResultView = () => (
        <div className="p-8 bg-navy-950 border-2 border-gold/20 rounded-3xl text-center shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <h2 className="text-gold font-serif text-3xl mb-2 uppercase tracking-tight italic">🎉 Auction Completed</h2>
            <div className="my-8">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Final Hammer Price</span>
                <p className="text-white font-serif text-5xl font-black italic">{formatPrice(relic.currentPrice)}</p>
            </div>
            
            {isOwner ? (
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-emerald-400 text-sm font-black uppercase">CONGRATULATIONS! YOU WON THE BID</p>
                        <p className="text-gray-500 text-[10px] mt-1 uppercase">Payment Confirmed · Funds Transitioning to Vault</p>
                    </div>
                    <GoldButton className="w-full justify-center" onClick={() => navigate('/profile?tab=Shelf')}>
                        CLAIM OWNERSHIP CEREMONIAL
                    </GoldButton>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold leading-relaxed">This relic has been claimed by {relic.bids[0]?.name || 'a private collector'}.</p>
                    </div>
                    <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
                        <p className="text-gold text-xs font-black uppercase tracking-widest">✔ Funds Released</p>
                        <p className="text-gray-500 text-[9px] mt-1 italic leading-tight uppercase">Your blocked mandate amount has been returned to your wallet assets.</p>
                    </div>
                    <button onClick={() => navigate('/relics')} className="w-full py-4 bg-navy-800 text-gray-300 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-navy-700 transition-colors">TRY NEXT AUCTION</button>
                </div>
            )}
        </div>
    );

    const OwnershipView = () => (
        <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-gold/20 to-navy-900 border border-gold/40 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 rotate-12 opacity-10 grayscale scale-150">
                    <motion.svg animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2h7c0 4.52-3.13 8.75-7 9.8L5 3.8"></path></motion.svg>
                </div>
                
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.5em] block mb-2">Heritage Proof</span>
                <h3 className="text-white font-serif text-3xl font-black mb-6 uppercase italic">Vault Certificate</h3>
                
                <div className="space-y-5 font-mono bg-black/40 p-5 rounded-2xl border border-gold/20">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Certificate ID</span>
                        <span className="text-gold text-xs font-bold">{relic.certificateId || 'CERT-PENDING'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Ownership Tier</span>
                        <span className="text-white text-xs uppercase font-black">{relic.rarity === 'legendary' ? 'ELITE GENESIS' : 'HERITAGE'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Digital Twin</span>
                        <span className="text-cyan-400 text-xs font-bold">#{relic.id}-DT-SYNC</span>
                    </div>
                    <div className="flex justify-between items-center bg-gold/5 -mx-5 -mb-5 p-4 mt-4 rounded-b-2xl border-t border-gold/10">
                        <span className="text-zinc-400 text-[9px] uppercase tracking-widest">Hammer Price</span>
                        <span className="text-white text-sm font-black italic">{formatPrice(relic.finalPrice || relic.currentPrice)}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Shipment Status</p>
                        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">In Transit</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-gold shadow-[0_0_15px_rgba(201,162,39,0.8)]" />
                    </div>
                    <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-gold text-[11px] font-black uppercase flex items-center gap-2 mb-2">
                             📦 {relic.shipmentStatus === 'processing' ? 'Processing Package' : 'Package in Shipment'}
                        </p>
                        <p className="text-gray-500 text-[9px] italic leading-relaxed uppercase tracking-wider">
                            {relic.shipmentUpdates?.[0]?.note || 'Your artifact is being secured for global transit.'}
                        </p>
                    </div>
                </div>
                
                <button className="w-full mt-6 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-gold transition-all duration-300 active:scale-95 shadow-xl">
                    Download High-Res Proof
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 bg-navy-950 text-white selection:bg-gold/30">
            {/* ═══ TOP NAVBAR ═══ */}
            <div className="fixed top-0 inset-x-0 z-50 px-4 py-4 flex justify-between items-center bg-navy-950/80 backdrop-blur-md border-b border-gold/10">
                <button onClick={() => navigate('/relics')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-navy-900 shadow-xl group hover:border-gold/30 transition-all">
                    <svg className="w-5 h-5 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex flex-col items-center">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-black">Heritage Ref: #{relic.id}</p>
                    <h1 className="text-xs font-black uppercase tracking-tighter text-gold italic">{relic.title}</h1>
                </div>
                <div className="w-10" /> 
            </div>

            {/* ═══ HERO BANNER ═══ */}
            <div className="relative pt-16">
                <div className="aspect-[4/5] md:aspect-video overflow-hidden">
                    <img src={relic.image} alt={relic.title} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-x-0 bottom-0 aspect-[4/3] bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 inset-x-0 p-6">
                    <div className="flex gap-2 mb-4">
                        <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-gold/40 backdrop-blur-md">{relic.rarity}</span>
                        <span className="bg-white/5 text-zinc-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 truncate backdrop-blur-md">{relic.film}</span>
                    </div>
                    
                    {isLive && (
                        <div className={`p-4 rounded-3xl border transition-all duration-500 ${isUrgent ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-black/60 border-gold/20 backdrop-blur-md'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isUrgent ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
                                    🔨 AUCTION ENDING IN
                                </span>
                                <motion.span 
                                    animate={isUrgent ? { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className={`font-mono text-3xl font-black ${isUrgent ? 'text-red-500' : 'text-gold'}`}
                                >
                                    {formatted}
                                </motion.span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ MAIN CORE CONTENT ═══ */}
            <div className="px-6 py-8 max-w-lg mx-auto mb-10">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={relic.phase + userMandated + isClosed}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isClosed ? (
                            isOwner ? <OwnershipView /> : <ResultView />
                        ) : (
                            relic.phase === 'mandate' ? <MandateMode /> :
                            relic.phase === 'bidding' ? (userMandated ? <AuctionRoom /> : <MandateMode />) :
                            <PreviewMode />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* ── LIFECYCLE TRACKER ── */}
                <div className="mt-12 p-8 bg-black/40 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(201,162,39,0.5)]" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black">Heritage Pulse Lifecycle</span>
                    </div>
                    <div className="space-y-8">
                        {PHASES.map((p, idx) => {
                            const isPast = phaseIdx(relic.phase) > idx;
                            const isCurrent = relic.phase === p.key;
                            return (
                                <div key={p.key} className="flex gap-5 items-start relative">
                                    {idx !== PHASES.length - 1 && (
                                        <div className={`absolute left-[13px] top-8 w-[1.5px] h-full ${isPast ? 'bg-gold/30' : 'bg-zinc-800'}`} />
                                    )}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${isPast ? 'bg-gold text-navy-950' : isCurrent ? 'bg-gold/20 border border-gold text-gold ring-8 ring-gold/5' : 'bg-zinc-900 text-zinc-700'}`}>
                                        <span className="text-[10px] font-bold">{isPast ? '✓' : p.icon}</span>
                                    </div>
                                    <div>
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${isPast ? 'text-zinc-500' : isCurrent ? 'text-gold' : 'text-zinc-700'}`}>{p.label}</p>
                                        {isCurrent && <p className="text-[10px] text-zinc-500 leading-relaxed mt-2 italic uppercase tracking-wider">{p.desc}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── TRUST & Rarity ── */}
                <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                        <span className="text-2xl block mb-3 opacity-80">💎</span>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Authenticity</p>
                        <p className="text-[11px] text-zinc-300 font-bold leading-tight uppercase tracking-tight">Verified by {relic.verifiedBy}</p>
                    </div>
                    <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                        <span className="text-2xl block mb-3 opacity-80">⭐</span>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Rarity</p>
                        <p className="text-[11px] text-zinc-300 font-bold leading-tight uppercase tracking-tight">{relic.totalPiecesExist > 1 ? `${relic.totalPiecesExist} Pieces Exist` : 'One-of-a-kind Item'}</p>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-0 inset-x-0 h-64 pointer-events-none overflow-hidden opacity-20 z-[-1]">
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
