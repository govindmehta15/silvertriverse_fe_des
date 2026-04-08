import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockUsers } from '../mock/mockUsers';
import StatsCard from '../components/StatsCard';
import RoleGuard from '../components/RoleGuard';
import { getData, setData } from '../utils/storageService';
import { dispatchNotification, NotificationTypes } from '../utils/notificationDispatcher';
import { premiumMerchandise, dailyMerchandise } from '../data/merchandiseData';
import { getThemeById, DEFAULT_THEME_ID, PROFILE_THEMES, FALLBACK_PAGE_BACKGROUND, FALLBACK_COVER_BLEND } from '../data/profileThemes';
import { useMerchEngine } from '../context/MerchEngineContext';

const userProfileFallback = {
    club: 'Cinema Club 47',
    tags: 23,
    roles: ['Film Enthusiast', 'Collector']
};

const getPrestigeRank = (user) => {
    if (!user) return { name: 'Unranked', color: 'text-gray-500', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };

    const relicsPts = (user.ownedRelics?.length || 0) * 100;
    const cardsPts = (user.ownedCards?.length || 0) * 50;
    const merchPts = (user.purchasedItems?.length || 0) * 150;
    const totalScore = (user.participationScore || 0) + relicsPts + cardsPts + merchPts;

    if (totalScore >= 3000) return { name: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/40', shadow: 'shadow-glow-rare' };
    if (totalScore >= 1500) return { name: 'Gold', color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/40', shadow: 'shadow-glow-gold' };
    if (totalScore >= 500) return { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-700/50', border: 'border-gray-400/50', shadow: '' };
    return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/50', shadow: '' };
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
};

export default function ProfilePage() {
    const { user, updateRole } = useAuth();
    const { addToast } = useToast();
    const { portfolioYield } = useMerchEngine();
    const [activeTab, setActiveTab] = useState('Shelf');
    const [orders, setOrders] = useState([]);
    const [coins, setCoins] = useState([]);
    const [bellRung, setBellRung] = useState(false);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

    // Determine if we're viewing another user's profile
    // Priority: /profile/:userId route param > ?user= search param > own profile
    const { userId: routeUserId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const viewingUserId = routeUserId || searchParams.get('user') || null;

    const allUsers = useMemo(() => {
        const saved = getData('users');
        return (saved && saved.length > 0) ? saved : mockUsers;
    }, []);

    const viewedUser = useMemo(() => {
        if (!viewingUserId) return null;
        const saved = getData('users') || mockUsers;
        return saved.find(u => u.id === viewingUserId) || null;
    }, [viewingUserId]);

    const isOwnProfile = !viewingUserId || viewingUserId === user?.id;
    const profileUser = isOwnProfile ? user : viewedUser;

    const [isRefreshing, setIsRefreshing] = useState(false);
    useEffect(() => {
        setIsRefreshing(true);
        const t = setTimeout(() => setIsRefreshing(false), 50); // Minimal blink to clear state
        return () => clearTimeout(t);
    }, [viewingUserId]);

    // Theme: eligibility (sponsor = owns ≥1 plot, winner = isWinner)
    const ownershipList = getData('silvertriverse_plots_ownership') || [];
    const ownedPlotsCount = ownershipList.filter((r) => r.ownerId === profileUser?.id).length;
    const isSponsor = ownedPlotsCount >= 1;
    const canUsePremium = isSponsor || !!profileUser?.isWinner;
    const storedThemeId = getData(`silvertriverse_profile_theme_${profileUser?.id}`) || DEFAULT_THEME_ID;
    const themeForStored = getThemeById(storedThemeId);
    const effectiveThemeId = themeForStored.premium && !canUsePremium ? DEFAULT_THEME_ID : storedThemeId;
    const activeTheme = getThemeById(effectiveThemeId);

    const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
    const [, setThemeRefresh] = useState(0);
    const setProfileTheme = (themeId) => {
        if (!user?.id) return;
        setData(`silvertriverse_profile_theme_${user.id}`, themeId);
        setThemeRefresh((n) => n + 1);
        setThemeSelectorOpen(false);
    };

    const handleRingBell = () => {
        if (!user || !viewedUser || bellRung) return;
        dispatchNotification(
            viewedUser.id,
            NotificationTypes.NEW_FOLLOWER,
            `${user.name} wants to collaborate with you! 🔔`
        );
        addToast(`Collaboration request sent to ${viewedUser.name}!`, 'success');
        setBellRung(true);
    };

    useEffect(() => {
        // Reset scroll for rapid navigation
        window.scrollTo(0, 0);

        // Load specific user data
        const storedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        setOrders(storedOrders);
        const storedCoins = JSON.parse(localStorage.getItem('user_coins') || '[]');
        setCoins(storedCoins);
        setBellRung(false); // Reset bell for new profile
        setActiveTab('Shelf'); // Reset to default tab for consistency
    }, [viewingUserId]);

    const stats = [
        { label: 'Followers', value: profileUser?.followers || 0, icon: '👥' },
        { label: 'Ours Yield', value: isOwnProfile ? `₹${Math.floor(portfolioYield)}` : '₹0', icon: '📈' },
        { label: 'Relics Owned', value: profileUser?.ownedRelics?.length || 0, icon: '🏛️' },
        { label: 'Participation', value: profileUser?.participationScore || 0, icon: '⭐' },
    ];

    const displayRoles = profileUser?.role === 'creator' ? ['Creator', 'Director'] : profileUser?.role === 'professional' ? ['Professional', 'Studio Exec'] : ['Fan', 'Collector'];

    const prestige = getPrestigeRank(profileUser);

    // Derived Data
    const userPosts = useMemo(() => {
        if (!profileUser || !profileUser.id) return [];
        const groups = getData('communities_v2') || [];
        let posts = [];
        groups.forEach(g => {
            (g.posts || []).forEach(p => {
                if (p.authorId === profileUser.id) {
                    posts.push({ ...p, groupName: g.name });
                }
            });
        });
        return posts.sort((a, b) => b.timestamp - a.timestamp);
    }, [profileUser]);

    // Shelf items aggregation
    const { premiumItems, dailyItems, otherItems, totalCollectibles } = useMemo(() => {
        if (!profileUser || !profileUser.id) return { premiumItems: [], dailyItems: [], otherItems: [], totalCollectibles: 0 };
        const premium = [];
        const daily = [];
        const other = [];
        let total = 0;

        // If viewing own profile and have live orders, prioritize orders. Otherwise fallback to mock purchasedItems.
        if (isOwnProfile && orders.length > 0) {
            orders.forEach(order => {
                order.items.forEach(item => {
                    total++;
                    const fullData = premiumMerchandise.find(m => m.id === item.id) || dailyMerchandise.find(m => m.id === item.id);
                    if (item.type === 'Premium') {
                        premium.push({ ...fullData, ...item });
                    } else {
                        daily.push({ ...fullData, ...item });
                    }
                });
            });
        } else if (profileUser.purchasedItems) {
            profileUser.purchasedItems.forEach(itemId => {
                total++;
                const yMatch = premiumMerchandise.find(m => m.id === itemId);
                const oMatch = dailyMerchandise.find(m => m.id === itemId);
                if (yMatch) {
                    premium.push({ ...yMatch, type: 'Premium' });
                } else if (oMatch) {
                    daily.push({ ...oMatch, type: 'Daily' });
                }
            });
        }

        // Relics 
        const allRelics = getData('relics') || [];
        (profileUser.ownedRelics || []).forEach(rId => {
            total++;
            const relic = allRelics.find(r => r.id === rId);
            other.push({ 
                type: 'Relic', 
                id: rId,
                name: relic ? relic.title : `Relic #${rId}`, 
                image: relic ? relic.image : '/images/scifi_weapon.png',
                phase: 'closed',
                finalPrice: relic?.finalPrice
            });
        });

        // Collectible Coins (from localStorage if own profile, else mock it if available on user)
        if (isOwnProfile) {
            coins.forEach((coin) => {
                total++;
                other.push({ type: 'Collectible Coin', name: coin.name, image: coin.image });
            });
        } else if (profileUser.coins) {
            profileUser.coins.forEach((coin) => {
                total++;
                other.push({ type: 'Collectible Coin', name: coin.name, image: coin.image });
            });
        }

        // Verse Cards
        (profileUser.ownedCards || []).forEach(cId => {
            total++;
            other.push({ type: 'Verse Card', name: `Card ${cId}`, image: '/images/ancient_book.png' });
        });

        return { premiumItems: premium, dailyItems: daily, otherItems: other, totalCollectibles: total };
    }, [profileUser, orders, coins, isOwnProfile]);

    const activityHistory = useMemo(() => {
        const history = [];
        userPosts.forEach(p => {
            history.push({ id: p.id, action: `Posted in ${p.groupName}`, target: p.content.substring(0, 30) + '...', date: p.timestamp });
        });

        if (isOwnProfile) {
            orders.forEach(o => {
                history.push({ id: o.orderId, action: `Purchased Merchandise`, target: `${o.items.length} items`, date: new Date(o.date).getTime() });
            });
            coins.forEach(c => {
                history.push({ id: `coin-${c.id}-${c.date}`, action: `Acquired Collectible Coin`, target: c.name, date: c.date });
            });

            // Render placed bids globally found from localStorage
            const bids = getData('user_bids') || [];
            bids.forEach(b => {
                history.push({ id: b.id, action: `Placed Bid`, target: `${b.relicName} (₹${b.amount.toLocaleString('en-IN')})`, date: b.timestamp });
            });
        }

        return history.sort((a, b) => b.date - a.date);
    }, [userPosts, orders, coins, isOwnProfile]);

    const [coverScroll, setCoverScroll] = useState(0);
    useEffect(() => {
        const onScroll = () => setCoverScroll(Math.min(window.scrollY, 120));
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const overlayOpacity = 1 - (coverScroll / 120) * 0.4;

    if (isRefreshing || !profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-navy-950">
                <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    const pageBg = activeTheme.pageBackground || FALLBACK_PAGE_BACKGROUND;
    const coverBlend = activeTheme.coverBlend || FALLBACK_COVER_BLEND;
    const transitionPreset = activeTheme.transitionPreset || 'smooth';
    const hoverTransition = transitionPreset === 'spring'
        ? { type: 'spring', stiffness: 400, damping: 25 }
        : transitionPreset === 'subtle'
            ? { type: 'tween', duration: 0.15 }
            : { type: 'tween', duration: 0.2 };

    return (
        <div className="min-h-screen pb-4 transition-colors duration-300" style={{ background: pageBg }}>
            {/* Cover + Avatar */}
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={hoverTransition}
                    className="h-48 md:h-64 overflow-hidden"
                    style={{ background: activeTheme.cover }}
                >
                    <img src='/images/profile_cover.png' alt="Cover" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 transition-opacity duration-200" style={{ background: coverBlend }} />
                    <div
                        className="absolute inset-0 transition-opacity duration-200"
                        style={{
                            backgroundColor: activeTheme.coverOverlay,
                            opacity: overlayOpacity,
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="absolute bottom-0 left-6 translate-y-1/2"
                >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-navy-900 shadow-glow-gold relative group">
                        <img src={profileUser?.avatar || '/images/profile_avatar.png'} alt={profileUser?.name} className="w-full h-full object-cover" />

                        <RoleGuard allowedRoles={['creator', 'professional']}>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-navy-900 flex items-center justify-center shadow-lg" title="Verified status">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </RoleGuard>
                    </div>
                </motion.div>
            </div>

            {/* Profile Info */}
            <div className="px-6 mt-16">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">{profileUser?.name}</h1>
                            
                            {/* LAYER 1: MULTI-PROFILE IDENTITY SWITCHER */}
                            {isOwnProfile && (
                                <div className="flex items-center gap-2 bg-navy-900 border border-navy-700/50 rounded-full px-3 py-1 scale-90 origin-left">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-2">Identities</span>
                                    {['GEN', 'CREA', 'PRO'].map(idType => (
                                        <button 
                                            key={idType}
                                            onClick={() => updateRole(idType === 'GEN' ? 'fan' : idType === 'CREA' ? 'creator' : 'professional')}
                                            className={`w-8 h-8 rounded-full text-[8px] font-black transition-all flex items-center justify-center border ${
                                                (idType === 'GEN' && profileUser?.role === 'fan') || 
                                                (idType === 'CREA' && profileUser?.role === 'creator') || 
                                                (idType === 'PRO' && profileUser?.role === 'professional')
                                                ? 'bg-gold text-navy-950 border-gold shadow-glow-gold' 
                                                : 'text-gray-400 border-navy-700 hover:border-gray-500'
                                            }`}
                                        >
                                            {idType}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            {/* Collaboration Bell — visible when viewing another user */}
                            {!isOwnProfile && (
                                <motion.button
                                    whileHover={{ rotate: [0, -15, 15, -10, 10, 0] }}
                                    transition={{ duration: 0.6 }}
                                    onClick={handleRingBell}
                                    disabled={bellRung}
                                    className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${bellRung
                                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                        : 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20'
                                        }`}
                                >
                                    <span className="text-lg">{bellRung ? '✓' : '🔔'}</span>
                                    {bellRung ? 'Request Sent' : 'Ring for Collaboration'}
                                </motion.button>
                            )}

                            {/* Interactive Role Switcher — only for own profile or simulation purposes */}
                            {isOwnProfile && (
                                <div className="relative">
                                    <select
                                        value={profileUser?.role || 'fan'}
                                        onChange={(e) => updateRole(e.target.value)}
                                        className="appearance-none bg-navy-800 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider py-1.5 pl-3 pr-8 rounded-full outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer shadow-glow-gold"
                                    >
                                        <option value="fan">Fan level</option>
                                        <option value="creator">Creator level</option>
                                        <option value="professional">Pro level</option>
                                    </select>
                                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        {profileUser?.role === 'professional' ? 'Horizon Studios' : userProfileFallback.club}
                    </p>
                    {profileUser?.bioLink && (
                        <a href={`https://${profileUser.bioLink}`} target="_blank" rel="noopener noreferrer" className="text-teal-400 text-xs font-bold hover:underline flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            {profileUser.bioLink}
                        </a>
                    )}
                    {profileUser?.bio && (
                        <p className="text-gray-300 text-sm mt-3 max-w-xl leading-relaxed">
                            {profileUser?.bio}
                        </p>
                    )}
                    <div className="mt-5 flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={hoverTransition}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${activeTheme.badgeClass}`}
                        >
                            {profileUser?.totalPosts || 0} CONTRIBUTIONS
                        </motion.div>
                        <div className="flex-1 max-w-[200px] h-1.5 bg-navy-900 rounded-full overflow-hidden border border-navy-700/50">
                            <div className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full" style={{ width: `${profileUser?.rankProgress || 0}%` }} />
                        </div>
                        <span className="text-xs text-gold font-bold">{profileUser?.rankProgress || 0}% to next tier</span>
                    </div>
                    {/* Prestige Rank + Landholder badge */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.35 }}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${prestige.bg} ${prestige.border} ${prestige.shadow}`}
                        >
                            <span className="text-sm">🏆</span>
                            <span className={`text-sm font-bold uppercase tracking-widest ${prestige.color}`}>
                                {prestige.name} Rank
                            </span>
                        </motion.div>
                        {isSponsor && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${activeTheme.badgeClass}`}
                            >
                                🗺️ Landholder
                            </motion.span>
                        )}
                        {isOwnProfile && (
                            <button
                                type="button"
                                onClick={() => setThemeSelectorOpen(true)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${activeTheme.buttonClass}`}
                            >
                                Theme: {activeTheme.name}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Role Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-2 mt-5"
                >
                    {displayRoles.map((role) => (
                        <span
                            key={role}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 hover:opacity-90 ${activeTheme.cardClass}`}
                        >
                            {role}
                        </span>
                    ))}
                </motion.div>

                {/* Collector Identity Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, ...hoverTransition }}
                    whileHover={{ scale: 1.01 }}
                    className={`mt-8 p-6 md:p-8 rounded-xl relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between ${activeTheme.cardClass} hover:shadow-lg transition-shadow duration-200`}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex-1 space-y-2 z-10 w-full text-center md:text-left">
                        <p className="text-gold/80 text-[10px] uppercase tracking-widest font-bold">Collector Identity Card</p>
                        <h3 className="text-2xl font-serif text-white tracking-wide">ID: {profileUser?.id || 'Unknown'}</h3>
                        <p className="text-zinc-400 text-sm">Authenticated member — Collectible Units & SilverTriverse</p>
                    </div>

                    <div className="flex gap-4 md:gap-8 bg-zinc-900/80 p-5 rounded-lg border border-zinc-800 backdrop-blur-md z-10 w-full md:w-auto justify-center">
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 block">Collectibles</p>
                            <p className="font-mono text-xl text-white block">{totalCollectibles}</p>
                        </div>
                        <div className="w-px bg-zinc-800" />
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 block">Prestige Rank</p>
                            <p className={`font-mono text-xl font-bold block ${prestige.color}`}>{prestige.name}</p>
                        </div>
                        <div className="w-px bg-zinc-800" />
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 block">Participation</p>
                            <p className="font-mono text-xl text-gold block">{profileUser?.participationScore || 0}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 border-b border-navy-700 flex gap-6"
                >
                    {['Shelf', 'Posts', 'Activity History'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${activeTab === tab ? activeTheme.accentClass : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="profileTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-80" />
                            )}
                        </button>
                    ))}
                </motion.div>

                <div className="mt-6 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Shelf' && (
                            <motion.div
                                key="shelf"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative pb-32" 
                            >
                                {/* THE RADIANT CABINET */}
                                <div className="bg-[#050505] border-[12px] border-[#101010] p-1 shadow-2xl rounded-sm">
                                    <div className="flex flex-col">
                                        
                                        {/* ROW 1: PREMIUM (GOLD AMBER GLOW) */}
                                        <div className="border-b-[8px] border-[#101010] flex flex-col md:flex-row min-h-[300px]">
                                            <div className="md:w-1/4 border-r-[8px] border-[#101010] p-6 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.15)_0%,transparent_70%)] shadow-[inset_0_0_40px_rgba(201,162,39,0.1)] flex flex-col justify-center">
                                                <h3 className="text-gold font-serif text-3xl leading-tight">Premium<br/>Collection</h3>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2">Vaulted Artifacts</p>
                                            </div>
                                            <div className="flex-1 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.08)_0%,transparent_80%)]">
                                                {premiumItems.length === 0 ? (
                                                    <div className="col-span-full flex items-center justify-center opacity-30 italic text-gold/50">Locker Empty...</div>
                                                ) : (
                                                    premiumItems.map((artifact, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ y: -15, rotateZ: 2 }}
                                                            onClick={() => setSelectedArtifact(artifact)}
                                                            className="group cursor-pointer relative"
                                                        >
                                                            <div className="w-full aspect-[3/4] flex items-center justify-center p-4">
                                                                <img 
                                                                    src={artifact.images?.[0] || artifact.image} 
                                                                    alt={artifact.title}
                                                                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(201,162,39,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(201,162,39,0.6)] transition-all duration-300"
                                                                />
                                                            </div>
                                                            <div className="absolute -bottom-2 inset-x-0 h-0.5 bg-gold/40 blur-sm scale-x-75 group-hover:scale-x-100 transition-transform" />
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* ROW 2: DAILY & VIRTUAL (CYAN & MAGENTA GLOW) */}
                                        <div className="flex flex-col md:flex-row min-h-[250px]">
                                            {/* DAILY BOX (MAGENTA) */}
                                            <div className="flex-1 border-r-[8px] border-[#101010] flex flex-col bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1)_0%,transparent_70%)] shadow-[inset_0_0_30px_rgba(236,72,153,0.05)]">
                                                <div className="p-4 border-b-[4px] border-[#101010]/50 flex justify-between items-center">
                                                    <span className="text-pink-500 font-bold text-xs uppercase tracking-widest">Daily Wear</span>
                                                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,1)]" />
                                                </div>
                                                <div className="p-6 flex flex-wrap gap-6 justify-center">
                                                    {dailyItems.map((artifact, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ scale: 1.1, y: -5 }}
                                                            onClick={() => setSelectedArtifact(artifact)}
                                                            className="group cursor-pointer w-16 h-16 bg-white/5 rounded p-1 border border-pink-500/10 hover:border-pink-500/40 transition-all"
                                                        >
                                                            <img 
                                                                src={artifact.images?.[0] || artifact.image} 
                                                                className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* VIRTUAL BOX (CYAN) */}
                                            <div className="flex-1 flex flex-col bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] shadow-[inset_0_0_30px_rgba(6,182,212,0.05)]">
                                                <div className="p-4 border-b-[4px] border-[#101010]/50 flex justify-between items-center">
                                                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">Virtual Inventory</span>
                                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
                                                </div>
                                                <div className="p-6 flex flex-wrap gap-4 justify-center">
                                                    {otherItems.map((artifact, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ scale: 1.2 }}
                                                            onClick={() => setSelectedArtifact(artifact)}
                                                            className="group cursor-pointer w-12 h-12 rounded-full overflow-hidden border border-cyan-400/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                                                        >
                                                            <img src={artifact.image} className="w-full h-full object-cover" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FLOOR REFLECTION */}
                                <div className="absolute top-[calc(100%-32px)] inset-x-0 h-40 pointer-events-none perspective-1000">
                                    <div className="w-full h-full bg-gradient-to-bottom from-transparent via-navy-950/40 to-navy-950" />
                                    <div 
                                        className="absolute inset-0 origin-top overflow-hidden opacity-30 blur-sm"
                                        style={{ 
                                            transform: 'scaleY(-0.8) rotateX(20deg)', 
                                            maskImage: 'linear-gradient(to top, transparent, black 70%)',
                                            WebkitMaskImage: 'linear-gradient(to top, transparent, black 70%)'
                                        }}
                                    >
                                        <div className="bg-[#050505] border-[12px] border-[#101010] p-1">
                                            {/* Simplified reflected content for performance */}
                                            <div className="grid grid-cols-4 gap-8 p-8">
                                                {premiumItems.slice(0, 4).map((_, i) => (
                                                    <div key={i} className="aspect-[3/4] bg-gold/10 rounded" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {activeTab === 'Posts' && (
                            <motion.div
                                key="posts"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {userPosts.length === 0 ? (
                                    <p className={`text-gray-500 text-center py-12 rounded-xl border border-dashed ${activeTheme.cardClass}`}>No community posts yet.</p>
                                ) : (
                                    userPosts.map(post => (
                                        <motion.div
                                            key={post.id}
                                            whileHover={{ scale: 1.01 }}
                                            transition={hoverTransition}
                                            className={`p-4 rounded-xl border ${activeTheme.cardClass}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">{post.groupName}</span>
                                                <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{post.content}</p>
                                            <div className="mt-3 flex gap-4 text-xs text-gray-500">
                                                <span>💬 {post.comments?.length || 0} Replies</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'Activity History' && (
                            <motion.div
                                key="activity"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                whileHover={{ scale: 1.005 }}
                                transition={hoverTransition}
                                className={`rounded-xl border p-6 transition-shadow duration-200 ${activeTheme.cardClass}`}
                            >
                                {activityHistory.length === 0 ? (
                                    <p className="text-gray-500 text-center py-6">No recent activity.</p>
                                ) : (
                                    <div className="relative border-l border-navy-600 ml-3 space-y-6">
                                        {activityHistory.map((act, i) => (
                                            <div key={i} className="pl-6 relative">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold shadow-glow-gold" />
                                                <p className="text-sm text-gray-300 font-medium">{act.action}</p>
                                                <p className="text-sm text-gray-500 my-0.5">{act.target}</p>
                                                <p className="text-xs text-gray-600">{new Date(act.date).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Theme selector modal (own profile only) */}
            <AnimatePresence>
                {themeSelectorOpen && isOwnProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setThemeSelectorOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-navy-900 border border-navy-600 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
                        >
                            <h3 className="font-serif text-lg font-bold text-white mb-1">Profile theme</h3>
                            <p className="text-gray-500 text-sm mb-4">Choose a theme. Premium themes require owning a plot or winner status.</p>
                            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                                {PROFILE_THEMES.map((t) => {
                                    const disabled = t.premium && !canUsePremium;
                                    const isActive = effectiveThemeId === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            disabled={disabled}
                                            title={disabled ? 'Own a plot or win to unlock' : undefined}
                                            onClick={() => !disabled && setProfileTheme(t.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${disabled
                                                ? 'border-navy-700 bg-navy-800/50 text-gray-500 cursor-not-allowed'
                                                : isActive
                                                    ? `${activeTheme.buttonClass} border-current`
                                                    : 'border-navy-600 bg-navy-800/80 text-gray-200 hover:border-gold/30'
                                                }`}
                                        >
                                            <span className="font-medium">{t.name}</span>
                                            {t.premium && <span className="text-xs opacity-80">{disabled ? '🔒' : '✨'}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={() => setThemeSelectorOpen(false)}
                                className="mt-4 w-full py-2 rounded-lg border border-navy-600 text-gray-400 hover:text-white"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Artifact Detail Modal */}
            <AnimatePresence>
                {selectedArtifact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-xl"
                        onClick={() => setSelectedArtifact(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-navy-900 border border-gold/20 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row relative group"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedArtifact(null)}
                                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-navy-950/50 border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy-950 transition-all"
                            >
                                ✕
                            </button>

                            {/* Left: Image Canvas */}
                            <div className="md:w-1/2 p-8 bg-black/40 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.1)_0%,transparent_70%)]" />
                                <motion.img 
                                    layoutId={`artifact-img-${selectedArtifact.id}`}
                                    src={selectedArtifact.images?.[0] || selectedArtifact.image} 
                                    alt={selectedArtifact.title || selectedArtifact.name}
                                    className="w-full h-auto max-h-[400px] object-contain filter drop-shadow-[0_0_30px_rgba(201,162,39,0.3)]"
                                />
                                
                                {selectedArtifact.type === 'Premium' && (
                                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-gold/10 border border-gold/20 backdrop-blur-md">
                                        <p className="text-[9px] text-gold uppercase font-black tracking-widest mb-1">Authenticity Signature</p>
                                        <p className="text-[10px] text-white font-mono break-all">{selectedArtifact.digitalTwinId}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Intel Panel */}
                            <div className="md:w-1/2 p-8 overflow-y-auto custom-scrollbar bg-navy-900">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                            {selectedArtifact.type} Artifact
                                        </span>
                                        {selectedArtifact.editionSize && (
                                            <span className="text-[10px] text-gray-500 font-mono">Edition 1 of {selectedArtifact.editionSize}</span>
                                        )}
                                    </div>
                                    <h2 className="font-serif text-3xl text-white font-bold leading-tight">
                                        {selectedArtifact.title || selectedArtifact.name}
                                    </h2>
                                    {selectedArtifact.filmReference && (
                                        <p className="text-gold/80 text-xs font-bold mt-1">Origin: {selectedArtifact.filmReference}</p>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* The Story */}
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                            Artifact Lore
                                        </h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {selectedArtifact.story || selectedArtifact.divineConnection || "Information restricted to Meta-Authenticated users."}
                                        </p>
                                    </div>

                                    {/* Specialized Data */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedArtifact.utilityPower && (
                                            <div className="p-3 rounded-xl bg-navy-800 border border-navy-700">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Utility Power</p>
                                                <p className="text-lg font-mono text-cyan-400 font-bold">{selectedArtifact.utilityPower}%</p>
                                            </div>
                                        )}
                                        {selectedArtifact.weaveType && (
                                            <div className="p-3 rounded-xl bg-navy-800 border border-navy-700">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Weave Type</p>
                                                <p className="text-xs text-white font-bold">{selectedArtifact.weaveType}</p>
                                            </div>
                                        )}
                                        {selectedArtifact.propRef && (
                                            <div className="p-3 rounded-xl bg-navy-800 border border-navy-700">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Prop Reference</p>
                                                <p className="text-[10px] text-white font-mono">{selectedArtifact.propRef}</p>
                                            </div>
                                        )}
                                        {selectedArtifact.technicalSpecs && (
                                            <div className="p-3 rounded-xl bg-navy-800 border border-navy-700 col-span-2">
                                                <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Technical Specs</p>
                                                <p className="text-[10px] text-white">{selectedArtifact.technicalSpecs}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Insights (Director Notes / Sacred Divine) */}
                                    {(selectedArtifact.directorNote || selectedArtifact.divineRationale) && (
                                        <div className="p-4 rounded-xl bg-gold/5 border border-gold/10 border-l-4 border-l-gold">
                                            <h5 className="text-[10px] text-gold uppercase font-black mb-1">
                                                {selectedArtifact.directorNote ? "Director Insight" : "Divine Rationale"}
                                            </h5>
                                            <p className="text-xs text-gray-300 italic">
                                                "{selectedArtifact.directorNote || selectedArtifact.divineRationale}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Acquisition Data */}
                                    <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] text-gray-600 uppercase font-black">Status</p>
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Verified Vaulted</p>
                                        </div>
                                        <button className="px-6 py-2 rounded-lg bg-gold text-navy-950 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                            Claim Social Proof
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
