import { getData, setData, updateData } from '../utils/storageService';
import { mockVerseCards, userVerseCollection } from '../mock/mockVerseCards';

const COLLECTION_KEY = 'silvertriverse_user_verse_collection';
const IPO_APPLICATIONS_KEY = 'silvertriverse_verse_ipo_apps';

export const verseCardService = {
    // Initial data load into storage if empty
    init: () => {
        if (!getData(COLLECTION_KEY)) {
            setData(COLLECTION_KEY, userVerseCollection);
        }
    },

    // Get all available cards (Daily & Weekly)
    getAvailableCards: () => {
        return mockVerseCards;
    },

    // Get user's own collection (enriched with catalog details)
    getUserCollection: () => {
        const collection = getData(COLLECTION_KEY) || [];
        return collection.map(item => {
            const catalogItem = mockVerseCards.find(m => m.id === item.cardId);
            return {
                ...catalogItem, // Spread catalog details (image, title, etc)
                ...item,        // Override with user specifics (ownedCount, serialNumber)
            };
        });
    },

    // Get specific card detail from catalog
    getCardById: (id) => {
        return mockVerseCards.find(c => c.id === id);
    },

    // Purchase a Daily Common card
    buyCommonCard: (cardId, quantity = 1) => {
        const card = mockVerseCards.find(c => c.id === cardId);
        if (!card || card.tier !== 'Daily') throw new Error('Invalid card for purchase');

        return updateData(COLLECTION_KEY, (collection) => {
            const existing = collection.find(c => c.cardId === cardId);
            const totalCount = (existing?.ownedCount || 0) + quantity;

            if (totalCount > 10) throw new Error('Maximum 10 copies per daily card allowed');

            if (existing) {
                existing.ownedCount = totalCount;
            } else {
                collection.push({
                    id: `user_${cardId}`,
                    cardId: card.id,
                    title: card.title,
                    film: card.film,
                    rarity: card.rarity,
                    tier: card.tier,
                    ownedCount: quantity,
                    status: 'Active',
                    acquisitionDate: new Date().toISOString(),
                    expirationDate: `2027-12-31` // Following year Dec 31
                });
            }
            return [...collection];
        });
    },

    // Apply for Weekly Rare card (IPO Style)
    applyForRareCard: (cardId) => {
        const card = mockVerseCards.find(c => c.id === cardId);
        if (!card || card.tier !== 'Weekly') throw new Error('Invalid card for IPO');

        const apps = getData(IPO_APPLICATIONS_KEY) || [];
        if (apps.find(a => a.cardId === cardId)) throw new Error('You have already applied for this IPO');

        apps.push({ cardId, timestamp: new Date().toISOString(), amountBlocked: 100 });
        setData(IPO_APPLICATIONS_KEY, apps);
        return true;
    },

    // Check if user has applied for an IPO
    hasApplied: (cardId) => {
        const apps = getData(IPO_APPLICATIONS_KEY) || [];
        return apps.some(a => a.cardId === cardId);
    },

    // Calculate collection progress (race to 417)
    getMilestoneProgress: () => {
        const collection = getData(COLLECTION_KEY) || [];
        const uniqueCount = collection.length; // Simplified for demo
        return {
            owned: uniqueCount,
            total: 417,
            percentage: (uniqueCount / 417) * 100,
            reward: 100000
        };
    },

    // Calculate purchasing power bonus for checkout
    calculateBonusPower: (selectedCardIds) => {
        const collection = getData(COLLECTION_KEY) || [];
        const selected = collection.filter(c => selectedCardIds.includes(c.id));
        
        const faceValue = selected.reduce((acc, curr) => {
            const catalogItem = mockVerseCards.find(m => m.id === curr.cardId);
            return acc + (catalogItem?.price || 0) * (curr.ownedCount || 1);
        }, 0);

        return {
            faceValue,
            bonus: faceValue * 0.1, // 10% bonus
            totalPower: faceValue * 1.1
        };
    }
};
