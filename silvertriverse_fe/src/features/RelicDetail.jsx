import { useState, useEffect } from 'react';
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

/* ─── Tier colors ───────────────────────────────────────────── */
const TIER_STYLES = {
    S: { bg: 'bg-gradient-to-r from-gold/20 to-amber-500/20', border: 'border-gold/40', text: 'text-gold', glow: 'shadow-[0_0_20px_rgba(201,162,39,0.15)]' },
    A: { bg: 'bg-gradient-to-r from-purple-500/15 to-cyan-500/15', border: 'border-purple-400/30', text: 'text-purple-300', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.1)]' },
    B: { bg: 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.08)]' },
};

/* ─── Section Header ────────────────────────────────────────── */
function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">{icon}</div>
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">{title}</h3>
                {subtitle && <p className="text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

/* ─── Info Row ──────────────────────────────────────────────── */
function InfoRow({ label, value, accent = false }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
            <span className={`text-xs font-bold ${accent ? 'text-gold' : 'text-white'}`}>{value}</span>
        </div>
    );
}


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
    const [activeTab, setActiveTab] = useState('heritage');

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
    const tier = relic.utilityPower ? TIER_STYLES[relic.utilityPower.tier] || TIER_STYLES.B : null;

    /* ──────────────────────────────────────────────────────── */
    /*  TAB CONTENT SECTIONS                                   */
    /* ──────────────────────────────────────────────────────── */

    const HeritageTab = () => (
        <div className="space-y-6">
            {/* ── Description ── */}
            <div className="p-5 bg-navy-900/50 border border-gold/10 rounded-2xl">
                <SectionHeader icon="📜" title="Artifact Heritage" subtitle="Origin & provenance story" />
                <p className="text-gray-300 text-sm leading-relaxed">{relic.description}</p>
            </div>

            {/* ── Scene Relevance ── */}
            {relic.sceneRelevance && (
                <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                    <SectionHeader icon="🎬" title="Scene Relevance" subtitle={`From "${relic.film}"`} />
                    <p className="text-gray-400 text-xs leading-relaxed">{relic.sceneRelevance}</p>
                </div>
            )}

            {/* ── Actor / Film History ── */}
            {relic.actorHistory && (
                <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                    <SectionHeader icon="🎭" title="Actor & Film History" subtitle="Behind the scenes" />
                    <p className="text-gray-400 text-xs leading-relaxed">{relic.actorHistory}</p>
                </div>
            )}

            {/* ── Features ── */}
            {relic.features && relic.features.length > 0 && (
                <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                    <SectionHeader icon="✨" title="Key Features" subtitle={`${relic.features.length} verified attributes`} />
                    <div className="space-y-2">
                        {relic.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <span className="text-gold text-[9px] mt-0.5 shrink-0">◆</span>
                                <span className="text-gray-300 text-xs leading-relaxed">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const CertificationTab = () => (
        <div className="space-y-6">
            {/* ── Provenance Panel ── */}
            <div className="p-5 bg-navy-900/50 border border-gold/10 rounded-2xl">
                <SectionHeader icon="🔐" title="Certification Panel" subtitle="Provenance & authenticity chain" />
                <div className="bg-black/30 rounded-xl border border-white/5 overflow-hidden">
                    <InfoRow label="Submitted By" value={relic.submittedBy?.replace(/_/g, ' ') || '—'} />
                    <InfoRow label="Verified By" value={relic.verifiedBy || '—'} accent />
                    <InfoRow label="Rarity Grade" value={relic.rarity?.toUpperCase()} accent />
                    <InfoRow label="Editions Existing" value={relic.totalPiecesExist > 1 ? `${relic.totalPiecesExist} pieces` : 'One of a Kind'} />
                    <InfoRow label="Review Score" value={relic.reviewScore > 0 ? `★ ${relic.reviewScore} / 5.0` : 'Pending'} accent={relic.reviewScore > 0} />
                    <InfoRow label="Mandate Registrations" value={relic.mandateCount || 0} />
                    <InfoRow label="Heritage Reference" value={`#REL-${String(relic.id).padStart(4, '0')}`} />
                </div>
            </div>

            {/* ── Authenticity Badge ── */}
            <div className="p-5 bg-gradient-to-br from-gold/5 to-navy-900/50 border border-gold/15 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
                    <span className="text-3xl">🛡️</span>
                </div>
                <h4 className="text-gold font-serif text-sm font-bold uppercase tracking-wider mb-1">Authenticity Verified</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    This artifact has passed the SilverTriverse 6-step verification pipeline
                </p>
                <div className="mt-4 flex justify-center gap-1">
                    {PHASES.slice(0, 6).map((p, i) => (
                        <div key={p.key} className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] ${phaseIdx(relic.phase) >= i ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-white/5 text-gray-700 border border-white/10'}`}>
                            {phaseIdx(relic.phase) > i ? '✓' : p.icon}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Phase History ── */}
            {relic.phaseHistory && relic.phaseHistory.length > 0 && (
                <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                    <SectionHeader icon="📋" title="Phase History" subtitle="Complete lifecycle log" />
                    <div className="space-y-3">
                        {relic.phaseHistory.map((entry, i) => {
                            const p = PHASES.find(x => x.key === entry.phase);
                            return (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-[10px]">
                                        {p?.icon || '•'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{p?.label || entry.phase}</span>
                                            <span className="text-[8px] text-gray-600 shrink-0">{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed">{entry.note}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    const UtilityTab = () => (
        <div className="space-y-6">
            {relic.utilityPower ? (
                <>
                    {/* ── Power Card ── */}
                    <div className={`p-5 rounded-2xl border ${tier.border} ${tier.bg} ${tier.glow} relative overflow-hidden`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-2xl">
                                {relic.utilityPower.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-white">{relic.utilityPower.name}</h3>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                                        relic.utilityPower.tier === 'S' ? 'bg-gold/20 text-gold border-gold/40' :
                                        relic.utilityPower.tier === 'A' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                                        'bg-cyan-500/15 text-cyan-300 border-cyan-500/20'
                                    }`}>TIER {relic.utilityPower.tier}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{relic.utilityPower.description}</p>
                            </div>
                        </div>

                        {/* Stat Bonuses */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {relic.utilityPower.bonuses.map((bonus, i) => (
                                <div key={i} className="p-3 bg-black/30 rounded-xl border border-white/5 flex items-center gap-2.5">
                                    <span className="text-lg">{bonus.icon}</span>
                                    <div>
                                        <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">{bonus.stat}</p>
                                        <p className={`text-xs font-black ${tier.text}`}>{bonus.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Land Effect ── */}
                    <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                        <SectionHeader icon="🏗️" title="Land Construction Effect" subtitle="Visual & gameplay impact on your territory" />
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                            <p className="text-gray-300 text-xs leading-relaxed">{relic.utilityPower.landEffect}</p>
                        </div>
                        <div className="mt-4 p-3 bg-gold/5 rounded-xl border border-gold/10 flex items-start gap-2">
                            <span className="text-sm shrink-0">💡</span>
                            <p className="text-[9px] text-gold/80 leading-relaxed">
                                Place this relic on your Digital Shelf after winning to activate its power on your land. Higher-tier relics stack multiplicatively with land upgrades.
                            </p>
                        </div>
                    </div>

                    {/* ── How it works ── */}
                    <div className="p-5 bg-navy-900/40 border border-white/5 rounded-2xl">
                        <SectionHeader icon="⚙️" title="How Relic Utility Works" subtitle="Power integration pipeline" />
                        <div className="space-y-3">
                            {[
                                { step: '01', title: 'Win Auction', desc: 'Claim the relic through competitive bidding' },
                                { step: '02', title: 'Activate on Shelf', desc: 'Place the relic on your profile Digital Shelf' },
                                { step: '03', title: 'Bind to Land', desc: 'Select which land plot receives the utility power' },
                                { step: '04', title: 'Power Active', desc: 'Bonuses apply immediately to all structures on that plot' },
                            ].map((s, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="text-[10px] font-black text-gold/40 w-6 shrink-0 pt-0.5">{s.step}</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">{s.title}</p>
                                        <p className="text-[9px] text-gray-500 mt-0.5">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-8 text-center bg-navy-900/40 rounded-2xl border border-white/5">
                    <span className="text-3xl block mb-3 opacity-50">⚡</span>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Utility power data not yet assigned to this relic.</p>
                </div>
            )}
        </div>
    );

    /* ──────────────────────────────────────────────────────── */
    /*  AUCTION ACTION PANELS                                  */
    /* ──────────────────────────────────────────────────────── */

    const MandateMode = () => (
        <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
                <span className="text-xl">📝</span>
            </div>
            <h3 className="text-gold font-serif text-lg mb-2 uppercase italic">Auction Entry Mandate</h3>
            <p className="text-gray-400 text-[10px] leading-relaxed max-w-sm mx-auto mb-5">
                To enter the live auction room, you must register a mandate. This reserves your eligibility and blocks the base price amount temporarily.
            </p>

            <div className="p-3 bg-navy-900 border border-gold/10 rounded-xl mb-5 flex justify-between items-center text-left">
                <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest">Blocked Amount</p>
                    <p className="text-white font-serif text-lg">{formatPrice(relic.basePrice)}</p>
                </div>
                <span className="text-[9px] bg-gold/10 text-gold px-2 py-1 rounded border border-gold/20 font-black">REQUIRED</span>
            </div>

            {userMandated ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="text-lg">✔</span> Mandate Confirmed
                </div>
            ) : (
                <GoldButton
                    disabled={mandateMutation.isLoading}
                    onClick={() => mandateMutation.mutate()}
                    className="w-full justify-center group"
                >
                    {mandateMutation.isLoading ? 'Processing...' : 'CONFIRM MANDATE'}
                </GoldButton>
            )}
        </div>
    );

    const AuctionRoom = () => (
        <div className="space-y-5 relative">
            <AnimatePresence>
                {outbidAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="p-3 bg-red-600/90 backdrop-blur-md rounded-xl border border-red-400 text-center shadow-[0_0_40px_rgba(239,68,68,0.5)] z-20 mb-4"
                    >
                        <p className="text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
                            ⚠️ YOU'VE BEEN OUTBID!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`p-5 rounded-2xl border transition-all duration-500 ${outbidAlert ? 'bg-red-950/20 border-red-500/40' : 'bg-navy-900/60 border-gold/20'}`}>
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Current Highest Bid</span>
                        <motion.h2 key={relic.currentPrice}
                            initial={{ scale: 1.2, color: '#facc15' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="text-3xl md:text-4xl font-serif font-black text-white italic">
                            {formatPrice(relic.currentPrice)}
                        </motion.h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Highest Bidder</span>
                        <p className={`text-sm font-mono font-bold ${relic.bids[0]?.userId === currentUser?.id ? 'text-emerald-400' : 'text-gold'}`}>
                            {relic.bids[0]?.userId === currentUser?.id ? 'YOU (LEADING)' : `User_***${relic.bids[0]?.id?.slice(-2)}`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                    {[10000, 25000, 50000].map(amt => (
                        <button key={amt}
                            onClick={() => { setSelectedAmount(nextBid + amt); setBidInput((nextBid + amt).toString()); }}
                            className={`py-2.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${selectedAmount === nextBid + amt ? 'bg-gold text-navy-950 border-gold shadow-[0_0_15px_rgba(201,162,39,0.4)]' : 'border-gold/20 text-gold hover:bg-gold/5'}`}
                        >+{formatPrice(amt)}</button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input type="number" value={bidInput} onChange={e => setBidInput(e.target.value)}
                        placeholder={`Min ${formatPrice(nextBid)}`}
                        className="flex-1 px-3 py-3 bg-black/40 border border-gold/10 rounded-xl text-white font-mono text-sm focus:border-gold/40 focus:outline-none placeholder:text-zinc-700" />
                    <button
                        onClick={() => placeBidMutation.mutate(Number(bidInput))}
                        disabled={placeBidMutation.isLoading || !bidInput || Number(bidInput) < nextBid}
                        className="px-5 bg-gold text-navy-950 font-black rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >PLACE BID</button>
                </div>
            </div>

            {/* Bid History */}
            <div className="bg-black/20 rounded-2xl border border-navy-700/30 overflow-hidden">
                <div className="p-3 border-b border-navy-700/30 flex justify-between items-center px-4 bg-navy-800/40">
                    <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Live Flow History</span>
                    <span className="text-[8px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </span>
                </div>
                <div className="max-h-48 overflow-y-auto p-2 custom-scroll">
                    {relic.bids.map((bid, i) => (
                        <motion.div key={bid.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className={`flex justify-between items-center p-3 rounded-xl mb-1 transition-all ${i === 0 ? 'bg-gold/10 border-l-4 border-gold' : 'bg-transparent'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{bid.avatar}</span>
                                <div>
                                    <p className={`text-xs font-black leading-none ${bid.userId === currentUser?.id ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                        {bid.userId === currentUser?.id ? 'YOU' : `Collector_***${bid.id.slice(-2)}`}
                                    </p>
                                    <p className="text-[8px] text-zinc-600 mt-1 uppercase font-mono">{timeAgo(bid.time)}</p>
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
        <div className="p-6 bg-navy-950 border-2 border-gold/20 rounded-2xl text-center shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <h2 className="text-gold font-serif text-2xl mb-2 uppercase tracking-tight italic">🎉 Auction Completed</h2>
            <div className="my-6">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Final Hammer Price</span>
                <p className="text-white font-serif text-4xl font-black italic">{formatPrice(relic.currentPrice)}</p>
            </div>

            {isOwner ? (
                <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-emerald-400 text-xs font-black uppercase">YOU WON THE BID</p>
                    </div>
                    <GoldButton className="w-full justify-center" onClick={() => navigate('/profile?tab=Shelf')}>
                        CLAIM OWNERSHIP
                    </GoldButton>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-zinc-500 text-xs font-bold">Claimed by {relic.bids[0]?.name || 'a collector'}.</p>
                    </div>
                    <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl">
                        <p className="text-gold text-xs font-black uppercase tracking-widest">✔ Funds Released</p>
                    </div>
                    <button onClick={() => navigate('/relics')} className="w-full py-3 bg-navy-800 text-gray-300 font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-navy-700 transition-colors">TRY NEXT AUCTION</button>
                </div>
            )}
        </div>
    );

    const OwnershipView = () => (
        <div className="p-6 bg-gradient-to-br from-gold/20 to-navy-900 border border-gold/40 rounded-2xl relative overflow-hidden">
            <span className="text-gold text-[9px] font-black uppercase tracking-[0.5em] block mb-2">Heritage Proof</span>
            <h3 className="text-white font-serif text-2xl font-black mb-5 uppercase italic">Vault Certificate</h3>

            <div className="space-y-4 font-mono bg-black/40 p-4 rounded-xl border border-gold/20">
                <InfoRow label="Certificate ID" value={relic.certificateId || 'CERT-PENDING'} accent />
                <InfoRow label="Ownership Tier" value={relic.rarity === 'legendary' ? 'ELITE GENESIS' : 'HERITAGE'} />
                <InfoRow label="Digital Twin" value={`#${relic.id}-DT-SYNC`} />
                <InfoRow label="Hammer Price" value={formatPrice(relic.finalPrice || relic.currentPrice)} accent />
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Shipment Status</p>
                    <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">In Transit</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-gold shadow-[0_0_15px_rgba(201,162,39,0.8)]" />
                </div>
            </div>

            <button className="w-full mt-5 py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-gold transition-all">
                Download Proof
            </button>
        </div>
    );


    /* ──────────────────────────────────────────────────────── */
    /*  DETAIL TABS                                            */
    /* ──────────────────────────────────────────────────────── */

    const DETAIL_TABS = [
        { key: 'heritage', label: 'Heritage', icon: '📜' },
        { key: 'certification', label: 'Certification', icon: '🔐' },
        { key: 'utility', label: 'Land Utility', icon: '⚡' },
    ];

    return (
        <div className="min-h-screen pb-20 bg-navy-950 text-white selection:bg-gold/30">
            {/* ═══ TOP NAVBAR ═══ */}
            <div className="fixed top-0 inset-x-0 z-50 px-4 py-4 flex justify-between items-center bg-navy-950/80 backdrop-blur-md border-b border-gold/10">
                <button onClick={() => navigate('/relics')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-navy-900 shadow-xl group hover:border-gold/30 transition-all">
                    <svg className="w-5 h-5 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex flex-col items-center">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-[0.4em] font-black">Heritage Ref: #{relic.id}</p>
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
                    {/* Tags */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                        <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-gold/40 backdrop-blur-md">{relic.rarity}</span>
                        <span className="bg-white/5 text-zinc-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 truncate backdrop-blur-md">🎬 {relic.film}</span>
                        {relic.totalPiecesExist && (
                            <span className="bg-white/5 text-zinc-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                                {relic.totalPiecesExist === 1 ? '1 of 1' : `Ed. of ${relic.totalPiecesExist}`}
                            </span>
                        )}
                        {relic.utilityPower && (
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${
                                relic.utilityPower.tier === 'S' ? 'bg-gold/15 text-gold border-gold/30' :
                                relic.utilityPower.tier === 'A' ? 'bg-purple-500/15 text-purple-300 border-purple-400/30' :
                                'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                            }`}>{relic.utilityPower.icon} Tier {relic.utilityPower.tier}</span>
                        )}
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mb-3">
                        {relic.reviewScore > 0 && (
                            <span className="text-[9px] text-gray-400 flex items-center gap-1"><span className="text-gold">★</span> {relic.reviewScore}</span>
                        )}
                        {relic.mandateCount > 0 && (
                            <span className="text-[9px] text-gray-400">📝 {relic.mandateCount} mandates</span>
                        )}
                        {relic.bids && relic.bids.length > 0 && (
                            <span className="text-[9px] text-gray-400">🔨 {relic.bids.length} bids</span>
                        )}
                    </div>

                    {/* Timer for live auctions */}
                    {isLive && (
                        <div className={`p-4 rounded-2xl border transition-all duration-500 ${isUrgent ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-black/60 border-gold/20 backdrop-blur-md'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isUrgent ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
                                    🔨 AUCTION ENDING IN
                                </span>
                                <motion.span
                                    animate={isUrgent ? { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className={`font-mono text-2xl font-black ${isUrgent ? 'text-red-500' : 'text-gold'}`}
                                >{formatted}</motion.span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ AUCTION ACTION PANEL ═══ */}
            <div className="px-5 py-6 max-w-lg mx-auto">
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
                            /* Preview — show price info */
                            <div className="p-5 bg-navy-900 border border-gold/20 rounded-2xl text-center">
                                <span className="text-xs text-gold font-mono uppercase tracking-[0.2em] block mb-2">Auction Status</span>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-gold/5">
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Base Value</p>
                                        <p className="text-lg font-serif text-white">{formatPrice(relic.basePrice)}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-cyan-500/10">
                                        <p className="text-[9px] text-cyan-400 uppercase tracking-widest">Provenance</p>
                                        <p className="text-xs text-white mt-1 uppercase truncate">{relic.submittedBy?.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                <p className="text-white font-serif text-sm mb-3">Registration window will open soon.</p>
                                <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 rounded-xl uppercase text-[10px] font-black tracking-widest opacity-50">Wait for Mandate</button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ═══ DETAIL SECTION TABS ═══ */}
            <div className="px-5 max-w-lg mx-auto">
                <div className="flex gap-1 p-1 bg-navy-900/60 rounded-xl border border-white/5 mb-6">
                    {DETAIL_TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === tab.key
                                    ? 'bg-gold/15 text-gold border border-gold/20 shadow-[0_0_15px_rgba(201,162,39,0.1)]'
                                    : 'text-gray-500 hover:text-gray-400'
                            }`}>
                            <span className="text-xs">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-10"
                    >
                        {activeTab === 'heritage' && <HeritageTab />}
                        {activeTab === 'certification' && <CertificationTab />}
                        {activeTab === 'utility' && <UtilityTab />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── LIFECYCLE TRACKER ── */}
            <div className="px-5 max-w-lg mx-auto mb-10">
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(201,162,39,0.5)]" />
                        <span className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-black">Heritage Pulse Lifecycle</span>
                    </div>
                    <div className="space-y-6">
                        {PHASES.map((p, idx) => {
                            const isPast = phaseIdx(relic.phase) > idx;
                            const isCurrent = relic.phase === p.key;
                            return (
                                <div key={p.key} className="flex gap-4 items-start relative">
                                    {idx !== PHASES.length - 1 && (
                                        <div className={`absolute left-[13px] top-7 w-[1.5px] h-full ${isPast ? 'bg-gold/30' : 'bg-zinc-800'}`} />
                                    )}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${isPast ? 'bg-gold text-navy-950' : isCurrent ? 'bg-gold/20 border border-gold text-gold ring-8 ring-gold/5' : 'bg-zinc-900 text-zinc-700'}`}>
                                        <span className="text-[9px] font-bold">{isPast ? '✓' : p.icon}</span>
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isPast ? 'text-zinc-500' : isCurrent ? 'text-gold' : 'text-zinc-700'}`}>{p.label}</p>
                                        {isCurrent && <p className="text-[9px] text-zinc-500 leading-relaxed mt-1 italic uppercase tracking-wider">{p.desc}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Quick Stats Grid ── */}
            <div className="px-5 max-w-lg mx-auto mb-10 grid grid-cols-2 gap-3">
                <div className="p-4 bg-navy-900/40 border border-white/5 rounded-xl">
                    <span className="text-xl block mb-2 opacity-80">💎</span>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Authenticity</p>
                    <p className="text-[10px] text-zinc-300 font-bold leading-tight uppercase tracking-tight">Verified by {relic.verifiedBy}</p>
                </div>
                <div className="p-4 bg-navy-900/40 border border-white/5 rounded-xl">
                    <span className="text-xl block mb-2 opacity-80">⭐</span>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Rarity</p>
                    <p className="text-[10px] text-zinc-300 font-bold leading-tight uppercase tracking-tight">{relic.totalPiecesExist > 1 ? `${relic.totalPiecesExist} Pieces Exist` : 'One-of-a-kind'}</p>
                </div>
                {relic.utilityPower && (
                    <>
                        <div className="p-4 bg-navy-900/40 border border-white/5 rounded-xl">
                            <span className="text-xl block mb-2 opacity-80">{relic.utilityPower.icon}</span>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Land Power</p>
                            <p className="text-[10px] text-zinc-300 font-bold leading-tight uppercase tracking-tight">{relic.utilityPower.name}</p>
                        </div>
                        <div className="p-4 bg-navy-900/40 border border-white/5 rounded-xl">
                            <span className="text-xl block mb-2 opacity-80">🏗️</span>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1 font-black">Power Tier</p>
                            <p className={`text-[10px] font-bold leading-tight uppercase tracking-tight ${
                                relic.utilityPower.tier === 'S' ? 'text-gold' : relic.utilityPower.tier === 'A' ? 'text-purple-300' : 'text-cyan-300'
                            }`}>Tier {relic.utilityPower.tier} — {relic.utilityPower.tier === 'S' ? 'Supreme' : relic.utilityPower.tier === 'A' ? 'Advanced' : 'Standard'}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Ambient glow */}
            <div className="fixed bottom-0 inset-x-0 h-64 pointer-events-none overflow-hidden opacity-20 z-[-1]">
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
