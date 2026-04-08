import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useCredits } from './CreditsContext';
import { useAuth } from './AuthContext';
import {
    collectibleUnitsFilms,
    formatPrice,
    formatLargePrice,
    sportsCollectibleUnits,
    brandCollectibleUnits,
} from '../data/collectibleUnitsData';

const CuEngineContext = createContext(null);

const CATEGORIES = [
    { id: 'film', label: 'Film', icon: '🎬' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'brand', label: 'Brand', icon: '✨' },
];

// ─── UTILITY: Land System only (decided by admin) ────────────────
const LAND_UTILITY = {
    film: { id: 'land_build', name: 'Land Construction Power', icon: '🏗️', desc: 'Use this collectible card as construction material on your SilverTriverse Land plot. Contributes building power for virtual theatres, studios, and entertainment structures.', usedIn: 'Land System' },
    sports: { id: 'land_build', name: 'Land Construction Power', icon: '🏗️', desc: 'Use this collectible card as construction material on your SilverTriverse Land plot. Contributes building power for arenas, stadiums, and sports facilities.', usedIn: 'Land System' },
    brand: { id: 'land_build', name: 'Land Construction Power', icon: '🏗️', desc: 'Use this collectible card as construction material on your SilverTriverse Land plot. Contributes building power for showrooms, brand outlets, and retail spaces.', usedIn: 'Land System' },
};

// ─── Power level based on rarity (admin-decided) ─────────────────
const RARITY_POWER = {
    standard: { power: 5, label: 'Basic Power' },
    limited: { power: 12, label: 'Enhanced Power' },
    collectors: { power: 25, label: 'Superior Power' },
    masterpiece: { power: 50, label: 'Legendary Power' },
};

// ─── Names pool for mock bidders ─────────────────────────────────
const NAMES = ['Ananya S.', 'Rohan K.', 'Priya M.', 'Arjun D.', 'Meera V.', 'Vikram T.', 'Sneha P.', 'Karthik R.', 'Isha G.', 'Dev N.', 'Nisha L.', 'Aditya B.', 'Riya C.', 'Sameer J.', 'Kavya H.', 'Rahul W.', 'Pooja F.', 'Aman G.', 'Shruti B.', 'Vivek P.', 'Pallavi D.', 'Nikhil S.', 'Trisha K.', 'Saurabh M.', 'Jyoti R.', 'Harsh V.', 'Swati L.', 'Gaurav T.', 'Megha A.', 'Akash C.'];
const AVATARS = ['🧑', '👩', '🧔', '👧', '🧑‍🦱', '👨‍🦰', '👩‍🦳', '🧑‍🦲', '👨', '👩‍🦰'];

// ─── Generate daily card drops ───────────────────────────────────
function generateDailyDrops(allData) {
    const drops = [];
    const now = Date.now();
    const lowPrices = [5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50];

    allData.forEach((unit, idx) => {
        const cat = unit.category || 'film';
        const landUtil = LAND_UTILITY[cat];

        if (unit.silverCoins) {
            unit.silverCoins.forEach((coin, coinIdx) => {
                const hoursOffset = (idx * 3 + coinIdx * 2) % 24;
                const dropTime = now - (hoursOffset * 3600000);
                const biddingDuration = 4 * 3600000;
                const closesAt = dropTime + biddingDuration;
                const isLive = closesAt > now;
                const cardPrice = lowPrices[(idx * 7 + coinIdx * 3) % lowPrices.length];
                const rarityPower = RARITY_POWER[coin.rarity] || RARITY_POWER.standard;

                // 30-100 cards per drop
                const totalCards = 30 + ((idx * 17 + coinIdx * 11) % 71);

                // 200-800 mock bidders for closed drops
                const bidderCount = isLive
                    ? (50 + Math.floor(Math.random() * 150)) // live: some early bidders
                    : (200 + Math.floor(Math.random() * 600)); // closed: lots of bidders

                const mockBidders = Array.from({ length: bidderCount }, (_, bi) => ({
                    userId: `user_${idx}_${coinIdx}_${bi}`,
                    name: NAMES[bi % NAMES.length],
                    avatar: AVATARS[bi % AVATARS.length],
                    amount: cardPrice,
                    time: dropTime + Math.random() * (isLive ? (now - dropTime) : biddingDuration),
                }));

                drops.push({
                    id: `drop_${cat}_${unit.id}_${coin.id}`,
                    cardId: coin.id,
                    cardName: coin.name,
                    cardImage: coin.image,
                    cardEdition: coin.edition,
                    cardPrice,
                    cardRarity: coin.rarity,
                    cardDesc: coin.desc,
                    parentId: unit.id,
                    parentTitle: unit.title,
                    parentLogo: unit.logo,
                    parentGenre: unit.genre,
                    parentBanner: unit.banner,
                    category: cat,
                    droppedAt: dropTime,
                    closesAt,
                    isLive,
                    totalCards,
                    bidders: mockBidders,
                    allocated: [],
                    allocatedNames: [],
                    status: isLive ? 'BIDDING' : 'CLOSED',
                    // Utility: Land System only
                    utility: { ...landUtil, power: rarityPower.power, powerLabel: rarityPower.label },
                });
            });
        }

        if (unit.masterpiece) {
            const mp = unit.masterpiece;
            const mpBidderCount = 500 + Math.floor(Math.random() * 500);
            drops.push({
                id: `drop_${cat}_${unit.id}_mp`,
                cardId: mp.id,
                cardName: mp.title,
                cardImage: mp.image,
                cardEdition: 1,
                cardPrice: 50,
                cardRarity: 'masterpiece',
                cardDesc: mp.description,
                parentId: unit.id,
                parentTitle: unit.title,
                parentLogo: unit.logo,
                parentGenre: unit.genre,
                parentBanner: unit.banner,
                category: cat,
                droppedAt: now - 1800000,
                closesAt: mp.endTime,
                isLive: mp.endTime > now,
                totalCards: 1,
                bidders: Array.from({ length: mpBidderCount }, (_, bi) => ({
                    userId: `user_mp_${idx}_${bi}`,
                    name: NAMES[bi % NAMES.length],
                    avatar: AVATARS[bi % AVATARS.length],
                    amount: 50,
                    time: now - 1800000 + Math.random() * 1800000,
                })),
                allocated: [],
                allocatedNames: [],
                status: mp.endTime > now ? 'BIDDING' : 'CLOSED',
                utility: { ...LAND_UTILITY[cat], power: RARITY_POWER.masterpiece.power, powerLabel: RARITY_POWER.masterpiece.label },
            });
        }
    });

    return drops;
}

export function CuEngineProvider({ children }) {
    const { user } = useAuth();
    const { balance, deductCredits, addCredits } = useCredits();

    const allRawUnits = useMemo(() => [
        ...(collectibleUnitsFilms || []).map(u => ({ ...u, category: 'film' })),
        ...(sportsCollectibleUnits || []).map(u => ({ ...u, category: 'sports' })),
        ...(brandCollectibleUnits || []).map(u => ({ ...u, category: 'brand' })),
    ], []);

    const [drops, setDrops] = useState(() => generateDailyDrops(allRawUnits));
    const [userBids, setUserBids] = useState({});
    const [ownedCards, setOwnedCards] = useState([]);

    const getDrop = useCallback((dropId) => drops.find(d => d.id === dropId) || null, [drops]);

    const getDrops = useCallback((category, filter = 'all') => {
        let items = drops.filter(d => d.category === category);
        if (filter === 'live') items = items.filter(d => d.isLive);
        if (filter === 'closed') items = items.filter(d => !d.isLive);
        items.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            if (a.isLive && b.isLive) return a.closesAt - b.closesAt;
            return b.closesAt - a.closesAt;
        });
        return items;
    }, [drops]);

    const placeBid = useCallback(async (dropId) => {
        if (!user) return { success: false, error: 'Login required to bid' };
        const drop = drops.find(d => d.id === dropId);
        if (!drop) return { success: false, error: 'Drop not found' };
        if (!drop.isLive) return { success: false, error: 'Bidding window closed' };
        if (userBids[dropId]) return { success: false, error: 'Already bid on this drop' };

        const cost = drop.cardPrice;
        if (balance < cost) return { success: false, error: 'Insufficient funds' };

        const res = await deductCredits(cost);
        if (!res.success) return { success: false, error: 'Fund block failed' };

        setUserBids(prev => ({ ...prev, [dropId]: { amount: cost, timestamp: Date.now(), status: 'BLOCKED' } }));
        setDrops(prev => prev.map(d =>
            d.id === dropId
                ? { ...d, bidders: [...d.bidders, { userId: user.id, name: user.name || 'You', avatar: '🧑', amount: cost, time: Date.now() }] }
                : d
        ));
        return { success: true, blocked: cost };
    }, [user, drops, userBids, balance, deductCredits]);

    const runAllocation = useCallback((dropId) => {
        setDrops(prev => prev.map(d => {
            if (d.id !== dropId || d.status === 'ALLOCATED') return d;
            if (d.bidders.length === 0) return { ...d, status: 'NO_BIDS' };

            // Random shuffle and pick winners
            const shuffled = [...d.bidders].sort(() => Math.random() - 0.5);
            const winners = shuffled.slice(0, d.totalCards);
            const losers = shuffled.slice(d.totalCards);

            const userWon = winners.some(w => w.userId === user?.id);
            const userLost = losers.some(l => l.userId === user?.id);

            if (userLost && userBids[dropId]) {
                addCredits(userBids[dropId].amount);
                setUserBids(prev => ({ ...prev, [dropId]: { ...prev[dropId], status: 'REFUNDED' } }));
            }
            if (userWon) {
                setOwnedCards(prev => [...prev, {
                    id: `owned_${Date.now()}`, dropId: d.id,
                    cardName: d.cardName, cardImage: d.cardImage, cardRarity: d.cardRarity,
                    parentTitle: d.parentTitle, parentLogo: d.parentLogo, category: d.category,
                    acquiredAt: Date.now(), acquiredPrice: d.cardPrice,
                    utility: d.utility,
                }]);
                setUserBids(prev => ({ ...prev, [dropId]: { ...prev[dropId], status: 'WON' } }));
            }

            return {
                ...d,
                status: 'ALLOCATED',
                allocated: winners.map(w => w.userId),
                allocatedNames: winners.map(w => w.name),
                losersCount: losers.length,
                isLive: false,
            };
        }));
    }, [user, userBids, addCredits]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setDrops(prev => prev.map(d => d.isLive && d.closesAt <= now ? { ...d, isLive: false, status: 'CLOSED' } : d));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStats = useCallback((category) => {
        const catDrops = drops.filter(d => d.category === category);
        return {
            totalDrops: catDrops.length,
            liveDrops: catDrops.filter(d => d.isLive).length,
            totalBids: catDrops.reduce((s, d) => s + d.bidders.length, 0),
            cardsAllocated: catDrops.filter(d => d.status === 'ALLOCATED').length,
        };
    }, [drops]);

    const value = useMemo(() => ({
        CATEGORIES, LAND_UTILITY, RARITY_POWER, formatPrice, formatLargePrice,
        drops, getDrop, getDrops, placeBid, runAllocation,
        userBids, ownedCards, getStats,
    }), [drops, getDrop, getDrops, placeBid, runAllocation, userBids, ownedCards, getStats]);

    return <CuEngineContext.Provider value={value}>{children}</CuEngineContext.Provider>;
}

export function useCuEngine() {
    const ctx = useContext(CuEngineContext);
    if (!ctx) throw new Error('useCuEngine must be used within CuEngineProvider');
    return ctx;
}
