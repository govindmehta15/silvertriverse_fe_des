export const mockVerseCards = [
    // DAILY COMMON CARDS (Engagement Layer)
    {
        id: 'vc_common_342', // Represents day 342
        title: 'Pushpa: The Rebellion',
        film: 'Pushpa: The Rise',
        rarity: 'Common',
        tier: 'Daily',
        price: 2,
        releaseDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        expiresIn: 5, // Days remaining in window
        description: 'A tribute to the unwavering spirit of the Seshachalam forests.',
        image: '/images/verse_pushpa_common.png',
        backImage: '/images/verse_pushpa_back.png',
        purchaseLimit: 10,
        type: 'dialogue'
    },
    {
        id: 'vc_common_343',
        title: 'Vikrams Vengeance',
        film: 'Vikram',
        rarity: 'Common',
        tier: 'Daily',
        price: 2,
        releaseDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        expiresIn: 6,
        description: 'The mask that struck fear into the hearts of the cartel.',
        image: '/images/verse_vikram_common.png',
        backImage: '/images/verse_vikram_back.png',
        purchaseLimit: 10,
        type: 'symbol'
    },
    {
        id: 'vc_common_344',
        title: 'Rocky’s Empire',
        film: 'KGF: Chapter 2',
        rarity: 'Common',
        tier: 'Daily',
        price: 2,
        releaseDate: new Date().toISOString(),
        expiresIn: 7,
        description: 'The golden hammer that built an empire from dust.',
        image: '/images/verse_kgf_common.png',
        backImage: '/images/verse_kgf_back.png',
        purchaseLimit: 10,
        type: 'artifact'
    },

    // WEEKLY RARE CARDS (Prestige Layer - IPO Style)
    {
        id: 'vc_rare_48', // Represents week 48
        title: 'The Throne of Narachi',
        film: 'KGF: Chapter 2',
        rarity: 'Rare',
        tier: 'Weekly',
        price: 100,
        releaseDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        status: 'allocation_pending', // pending, completed
        supplyLimit: 500,
        applicantsCount: 12450,
        description: 'The ultimate symbol of power in the world of KGF. Only 500 in existence.',
        image: '/images/verse_kgf_throne.png',
        backImage: '/images/verse_kgf_back_rare.png',
        utilityPower: '1%',
        type: 'concept_art'
    },
    {
        id: 'vc_rare_49',
        title: 'Midnight Chronicles Archive',
        film: 'Chronicles of Midnight',
        rarity: 'Rare',
        tier: 'Weekly',
        price: 100,
        releaseDate: new Date(Date.now() + 1 * 86400000).toISOString(),
        status: 'upcoming',
        supplyLimit: 250,
        applicantsCount: 0,
        description: 'A deep dive into the temporal mechanics of the Midnight universe.',
        image: '/images/verse_midnight_rare.png',
        backImage: '/images/verse_midnight_back.png',
        utilityPower: '1.5%',
        type: 'lore_snippet'
    }
];

export const userVerseCollection = [
    {
        id: 'vc_common_342_user',
        cardId: 'vc_common_342',
        ownedCount: 5,
        status: 'Active',
        acquisitionDate: '2026-11-20',
        expirationDate: '2027-12-31'
    },
    {
        id: 'vc_rare_48_user',
        cardId: 'vc_rare_48',
        ownedCount: 1,
        serialNumber: '#48',
        status: 'Active',
        acquisitionDate: '2026-11-05',
        expirationDate: '2027-12-31'
    }
];
