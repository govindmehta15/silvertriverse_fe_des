// --- LAYER 5: STORIES ENGINE (24hr Lifecycle) ---
export const mockStories = [
    {
        id: 'st_1',
        userId: 'u1',
        userName: 'Natalie Portman',
        userAvatar: '/images/profile_avatar.png',
        image: '/images/leather_jacket.png',
        isUnseen: true,
        isBrand: false,
        timestamp: Date.now() - 3600000 * 2
    },
    {
        id: 'st_2',
        userId: 'u_brand_1',
        userName: 'Aetherion Labs',
        userAvatar: '🏢',
        image: '/images/film_scifi.png',
        isUnseen: true,
        isBrand: true, // Layer 5: Brand promotion slot
        timestamp: Date.now() - 3600000 * 5
    },
    {
        id: 'st_3',
        userId: 'u2',
        userName: 'Elias Vance',
        userAvatar: '/images/leather_jacket.png',
        image: '/images/profile_avatar.png',
        isUnseen: false,
        timestamp: Date.now() - 3600000 * 10
    }
];

// --- LAYER 7: COMMERCE INTEGRATION (Feed Models) ---
export const mockFeedItems = [
    // --- SOCIAL (60%) ---
    {
        id: 'fp_1',
        type: 'SOCIAL',
        authorId: 'u1',
        authorName: 'Natalie Portman',
        authorAvatar: '/images/profile_avatar.png',
        image: '/images/leather_jacket.png',
        caption: 'Just wrapped the final scene of Aetherion. This world is deeper than I imagined. 🎥',
        tags: [{ userId: 'u2', name: 'Elias Vance', tagType: 'friend' }],
        metrics: { likes: 1240, comments: 45, shares: 89 },
        economicSignal: 15, // Light influence
        timestamp: Date.now() - 1200000
    },
    {
        id: 'fp_social_2',
        type: 'SOCIAL',
        authorId: 'u2',
        authorName: 'Elias Vance',
        authorAvatar: '/images/leather_jacket.png',
        image: '/images/film_thriller.png',
        caption: 'Drafting the lore for the next CU drop. Sector 7 is coming online. ✍️',
        metrics: { likes: 850, comments: 12, shares: 4 },
        economicSignal: 30, // Mention of CU increases signal
        timestamp: Date.now() - 3600000
    },

    // --- COMMERCE (20%) ---
    {
        id: 'fp_comm_1',
        type: 'COMMERCE',
        subType: 'CU_DROP',
        title: 'Sovereign Heritage Drop - LIVE',
        message: 'The "Crown of Indra" CU is now accepting allocations. Only 15 units remain.',
        icon: '🛡️',
        image: '/images/film_scifi.png',
        link: '/collectible-units',
        economicSignal: 95, // High signal
        metrics: { participants: 420, totalPool: '₹1.2M' },
        timestamp: Date.now() - 2400000
    },
    {
        id: 'fp_comm_2',
        type: 'COMMERCE',
        subType: 'MERCH_AUCTION',
        title: 'ZYWH Antique Watch: Bid Pulse',
        message: 'A final bid of ₹45,000 just pushed the "Timeless Gear" to Trending status.',
        icon: '🗝️',
        link: '/merchandise/zywh',
        economicSignal: 88,
        metrics: { bids: 12, momentum: '+15%' },
        timestamp: Date.now() - 5400000
    },
    {
        id: 'fp_comm_3',
        type: 'COMMERCE',
        subType: 'YIELD_PULSE',
        title: 'OURS Chain Distribution',
        message: 'User #14 just earned ₹120 from the "Vision Goggle" chain maturity.',
        icon: '⚡',
        link: '/merchandise/ours',
        economicSignal: 75,
        timestamp: Date.now() - 7200000
    },

    // --- DISCOVERY / EVENTS (20%) ---
    {
        id: 'fp_event_1',
        type: 'DISCOVERY',
        category: 'CLUB_UPDATE',
        title: 'Sci-Fi Writers Club: New Milestone',
        message: 'The club has established a new "Lore Archive". Join 2,500 creators.',
        icon: '🎬',
        image: '/images/film_scifi.png',
        link: '/communities',
        economicSignal: 50,
        timestamp: Date.now() - 9000000
    },
    {
        id: 'fp_event_2',
        type: 'DISCOVERY',
        category: 'LAND_UPDATE',
        title: 'Metropolis Construction Scan',
        message: 'District 4 has reached 80% density. Construction speeds increased by 1.2x.',
        icon: '🗺️',
        link: '/land',
        economicSignal: 65,
        timestamp: Date.now() - 10800000
    },
    {
        id: 'fp_social_3',
        type: 'SOCIAL',
        authorId: 'u3',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        image: '/images/diamond_necklace.png',
        caption: 'The craftsmanship on the new OURS sari is breathtaking. Heritage meets future.',
        metrics: { likes: 320, comments: 8 },
        economicSignal: 25,
        timestamp: Date.now() - 12600000
    }
];

// --- LAYER 8: COLLABORATION SYSTEM ---
export const mockProjects = [
    {
        id: 'proj_1',
        title: 'Metropolis Short Film',
        description: 'Creating a 5-minute Neo-Noir teaser set in District 9.',
        roles: ['Node Architect', 'Sound Engineer', 'Script Supervisor'],
        members: 4,
        maxMembers: 7,
        status: 'RECRUITING'
    }
];
