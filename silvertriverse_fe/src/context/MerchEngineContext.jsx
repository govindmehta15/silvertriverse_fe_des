import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { premiumMerchandise, dailyMerchandise, formatPrice } from '../data/merchandiseData';
import { useAuth } from './AuthContext';
import { useCredits } from './CreditsContext';

const MerchEngineContext = createContext();

const NAMES = ['Arjun', 'Isha', 'Vikram', 'Ananya', 'Rohan', 'Kavya', 'Siddharth', 'Meera', 'Aditya', 'Sanya', 'Varun', 'Riya', 'Rahul', 'Zara', 'Kabir', 'Myra'];
const AVATARS = ['🦁', '🌸', '⚔️', '💎', '🦅', '🎨', '🌙', '🌊', '🔥', '🍃', '☀️', '🎹', '🎬', '🚀', '♟️', '⚡'];

export function MerchEngineProvider({ children }) {
    const { user } = useAuth();
    const { balance, deductCredits, addCredits } = useCredits();
    const now = Date.now();

    // ─── CORE REGISTRY GENERATOR ─────────────────────────────────
    const merchRegistry = useMemo(() => {
        // 1. Process YOURS (Premium items with allocation logic)
        const yours = premiumMerchandise.map((item, idx) => {
            const dropTime = now - (idx * 3600000);
            const closesAt = item.closesAt || (dropTime + (48 * 3600000));
            const participants = Array.from({ length: 15 + (idx * 4) }, (_, bi) => ({
                userId: `p_${idx}_${bi}`, 
                name: NAMES[bi % NAMES.length], 
                avatar: AVATARS[bi % AVATARS.length], 
                amount: item.price, 
                time: dropTime + (bi * 60000)
            }));

            return {
                ...item,
                image: item.images?.[0] || item.image,
                isLive: closesAt > now,
                status: closesAt > now ? 'LIVE' : 'CLOSED',
                droppedAt: dropTime,
                closesAt,
                participants,
                totalUnits: item.totalUnits || (5 + (idx % 10)),
                rewardPool: item.rewardPool || Math.floor(item.price * 0.1),
                serialNumber: item.serialNumber || `SN-${item.id.toUpperCase()}-${100 + idx}`,
                utilityPower: item.utilityPower || 25,
            };
        });

        // 2. Process OURS (Daily items with chain logic)
        const ours = dailyMerchandise.slice(0, 25).map((item, idx) => {
            const basePrice = item.price;
            return {
                ...item,
                image: item.images?.[0] || item.image,
                filledSlots: 10 + Math.floor(Math.random() * 20),
                totalEditionSize: 100, // Admin defined total units
                maxRewardValue: 100,   // Admin defined max reward (Rupees)
                communityDensity: 45 + Math.floor(Math.random() * 40),
                appreciationPerBuyer: 50,
                priceHistory: [
                    basePrice * 0.92, basePrice * 0.95, basePrice * 0.94, 
                    basePrice * 0.98, basePrice * 0.97, basePrice
                ],
                chain: Array.from({ length: 12 }, (_, i) => ({
                    position: i + 1,
                    name: NAMES[i % NAMES.length],
                    currentStockPrice: item.price + (i * 100)
                }))
            };
        });

        // 3. Process ZYWH (Auctionable premium items)
        const zywh = premiumMerchandise.slice(0, 10).map((item, idx) => ({
            ...item,
            image: item.images?.[0] || item.image,
            currentBid: Math.floor(item.price * 1.1),
            auctionEndsAt: now + (idx + 1) * 3600000,
            isAuction: true,
            restorationProgress: 75 + Math.floor(Math.random() * 20),
            decodingHints: ['Geometric frequency matches Sector 4', 'Material is non-terrestrial composite']
        }));

        // 4. Process DESIRE (Elite items)
        const desire = [...premiumMerchandise, ...dailyMerchandise].slice(0, 40).map(item => ({
            ...item,
            image: item.images?.[0] || item.image,
            isElite: true,
            marketAppreciation: (15 + Math.random() * 50).toFixed(1)
        }));

        return { yours, ours, zywh, desire };
    }, [now]);

    // ─── STATE ──────────────────────────────────────────────────
    const [yoursDrops, setYoursDrops] = useState(merchRegistry.yours);
    const [oursChains, setOursChains] = useState(merchRegistry.ours);
    const [zywhItems, setZywhItems] = useState(merchRegistry.zywh);
    const [desireListings, setDesireListings] = useState(merchRegistry.desire);
    
    const [yoursParticipations, setYoursParticipations] = useState({});
    const [oursPositions, setOursPositions] = useState({});
    const [ownedMerch, setOwnedMerch] = useState([]);

    // ─── METHODS ────────────────────────────────────────────────
    const participateYours = useCallback(async (dropId) => {
        if (!user) return { success: false, error: 'Login required' };
        const drop = yoursDrops.find(d => d.id === dropId);
        if (!drop || yoursParticipations[dropId]) return { success: false, error: 'Cannot participate' };
        
        const res = await deductCredits(drop.price);
        if (!res.success) return { success: false, error: 'Insufficient funds' };
        
        setYoursParticipations(prev => ({ ...prev, [dropId]: { amount: drop.price, status: 'ACTIVE', timestamp: Date.now() } }));
        setYoursDrops(prev => prev.map(d => d.id === dropId 
            ? { ...d, participants: [...d.participants, { userId: user.id, name: user.name || 'You', avatar: '🧑', amount: d.price, time: Date.now() }] } 
            : d
        ));
        return { success: true, blocked: drop.price };
    }, [user, yoursDrops, deductCredits, yoursParticipations]);

    const runYoursAllocation = useCallback((dropId) => {
        setYoursDrops(prev => prev.map(d => {
            if (d.id !== dropId || d.status === 'ALLOCATED') return d;
            if (d.participants.length === 0) return { ...d, status: 'NO_BIDS' };

            const shuffled = [...d.participants].sort(() => Math.random() - 0.5);
            const winners = shuffled.slice(0, d.totalUnits);
            const userWon = winners.some(w => w.userId === user?.id);

            if (userWon) {
                setOwnedMerch(prev => [...prev, {
                    ...d, id: `owned_y_${Date.now()}`, source: 'YOURS', dropId: d.id, acquiredAt: Date.now(),
                }]);
                setYoursParticipations(prev => ({ ...prev, [dropId]: { ...prev[dropId], status: 'WON' } }));
            } else if (yoursParticipations[dropId]) {
                addCredits(yoursParticipations[dropId].amount);
                setYoursParticipations(prev => ({ ...prev, [dropId]: { ...prev[dropId], status: 'RELEASED' } }));
            }

            return { 
                ...d, 
                status: 'ALLOCATED', 
                allocated: winners.map(w => w.userId),
                allocatedNames: winners.map(w => w.name),
                isLive: false 
            };
        }));
    }, [user, yoursParticipations, addCredits]);

    const enterOursChain = useCallback(async (chainId) => {
        if (!user) return { success: false, error: 'Login required' };
        const chain = oursChains.find(c => c.id === chainId);
        if (!chain || oursPositions[chainId]) return { success: false, error: 'Cannot enter' };
        
        const res = await deductCredits(chain.price);
        if (!res.success) return { success: false, error: 'Payment failed' };
        
        const userPosition = chain.filledSlots + 1;
        setOursPositions(prev => ({ 
            ...prev, 
            [chainId]: { 
                position: userPosition, 
                entryPrice: chain.price,
                rewardHistory: [0] // Initialize yield tracking
            } 
        }));
        setOwnedMerch(prev => [...prev, { ...chain, id: `owned_o_${Date.now()}`, source: 'OURS', chainId: chain.id, acquiredAt: Date.now() }]);
        
        // Trigger immediate position increment
        setOursChains(prev => prev.map(c => c.id === chainId 
            ? { ...c, filledSlots: c.filledSlots + 1, price: c.price + c.appreciationPerBuyer, priceHistory: [...c.priceHistory, c.price + c.appreciationPerBuyer] }
            : c
        ));
        
        return { success: true };
    }, [user, oursChains, deductCredits, oursPositions]);

    // ─── SIMULATION PULSE (Linear Reward Dissemination) ────────
    useEffect(() => {
        if (!user) return;
        
        const interval = setInterval(() => {
            // Simulate a purchase for an OURS item
            setOursChains(prev => {
                const nextChains = prev.map(c => {
                    if (Math.random() > 0.3) return c; // 30% chance of a sale pulse
                    if (c.filledSlots >= c.totalEditionSize) return c;
                    
                    const newSlots = c.filledSlots + 1;
                    const newPrice = c.price + c.appreciationPerBuyer;
                    return { ...c, filledSlots: newSlots, price: newPrice, priceHistory: [...c.priceHistory, newPrice].slice(-20) };
                });
                
                // If the user holds a position in any of these chains, update their linear reward
                nextChains.forEach(c => {
                    const pos = oursPositions[c.id];
                    if (pos) {
                        const rewardPerUnit = c.maxRewardValue / c.totalEditionSize;
                        const unitsSinceEntry = Math.max(0, c.filledSlots - pos.position);
                        const currentEarned = unitsSinceEntry * rewardPerUnit;
                        
                        setOursPositions(curr => {
                            const p = curr[c.id];
                            if (!p) return curr;
                            return {
                                ...curr,
                                [c.id]: {
                                    ...p,
                                    rewardHistory: [...p.rewardHistory, currentEarned].slice(-20)
                                }
                            };
                        });
                    }
                });
                
                return nextChains;
            });
        }, 10000); // Pulse every 10 seconds

        return () => clearInterval(interval);
    }, [user, oursPositions]);

    const getMerchItem = useCallback((pillar, id) => {
        const pillarList = pillar === 'yours' ? yoursDrops : pillar === 'ours' ? oursChains : pillar === 'zywh' ? zywhItems : desireListings;
        return pillarList.find(item => item.id === id);
    }, [yoursDrops, oursChains, zywhItems, desireListings]);

    const formatPriceLocal = (p) => '₹' + (p?.toLocaleString() || '0');

    const value = { 
        yoursDrops, yoursParticipations, oursChains, oursPositions, zywhItems, desireListings, 
        ownedMerch, participateYours, runYoursAllocation, enterOursChain, getMerchItem, formatPrice: formatPriceLocal 
    };

    return <MerchEngineContext.Provider value={value}>{children}</MerchEngineContext.Provider>;
}

export const useMerchEngine = () => useContext(MerchEngineContext);
