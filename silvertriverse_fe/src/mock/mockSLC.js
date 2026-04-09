export const mockSLC = [
    {
        id: 'slc_1',
        title: 'The Sovereign Sword',
        film: 'KGF: Chapter 2',
        rarity: 'Masterpiece',
        type: 'Ultra-Rare Masterpiece',
        material: '50g Fine Silver',
        editionLimit: 50,
        basePrice: 24999,
        utilityPower: 4.5,
        description: 'A masterfully engraved representation of Rocky\'s legendary sword, representing the weight of an entire empire. Minted in 50g of high-purity silver with deep-etched laser precision.',
        silverWeight: '50g',
        status: 'application_open',
        startTime: Date.now() - 2 * 86400000,
        endTime: Date.now() + 1 * 86400000,
        applicantsCount: 15423,
        image: '/images/slc_kgf_sword.png', 
        details: {
            engraving: 'Dual-layer high-relief 3D etching',
            mint: 'Heritage Royal Mint',
            finish: 'Antique Silver with Mirror highlights'
        },
        storybook: [
            {
                page: 1,
                title: 'The Origin of Power',
                content: 'The sword in KGF was not just a weapon; it was a symbol of rebellion. Forged in the fires of the mines, it represented the strength of the oppressed rising against the oppressors.',
                image: '/images/slc_kgf_concept1.png',
                type: 'narrative'
            },
            {
                page: 2,
                title: 'Concept Sketches',
                content: 'Early concept designs show the evolution of the hilt, incorporating motifs of the Deccan plateau and the brutalist architecture of Narachi.',
                image: '/images/slc_kgf_concept2.png',
                type: 'sketch'
            },
            {
                page: 3,
                title: 'Construction of the Artifact',
                content: 'The physical prop used in the film weighed 12kg. Our engraving captures every scratch and battle-worn detail of the original steel.',
                image: '/images/slc_kgf_bts.png',
                type: 'bts'
            },
            {
                page: 4,
                title: 'Curator\'s Note',
                content: 'This coin is Pillar 8\'s flagship release for the 2026 Cinematic Heritage collection. It marks the first time a KGF artifact has been officially preserved in precious metal.',
                image: '/images/slc_kgf_curator.png',
                type: 'note'
            }
        ],
        utility: {
            name: 'Imperial Dominion',
            bonus: '4.5%',
            effect: 'Massively accelerates the construction of "Cinema Megaplex" structures in your land.'
        },
        biddingHistory: [
            { id: 1, user: 'Vikram_X', bidIndex: 5420, status: 'Active', timestamp: Date.now() - 3600000 },
            { id: 2, user: 'Sanjay_D', bidIndex: 3210, status: 'Active', timestamp: Date.now() - 7200000 },
            { id: 3, user: 'Meera_P', bidIndex: 12450, status: 'Active', timestamp: Date.now() - 10800000 },
            { id: 4, user: 'Rahul_S', bidIndex: 8700, status: 'Active', timestamp: Date.now() - 14400000 }
        ]
    },
    {
        id: 'slc_2',
        title: 'The Time-Turner Medallion',
        film: 'Chronicles of Midnight',
        rarity: 'Special Edition',
        type: 'Special Edition Legendary',
        material: '25g Fine Silver',
        editionLimit: 500,
        basePrice: 12999,
        utilityPower: 3.2,
        description: 'An intricate medallion representing the manipulation of time. Features rotating mechanical motifs engraved in 25g silver.',
        silverWeight: '25g',
        status: 'announced',
        startTime: Date.now() + 3 * 86400000,
        endTime: Date.now() + 6 * 86400000,
        applicantsCount: 0,
        image: '/images/slc_time_medallion.png',
        details: {
            engraving: 'Micro-textured mechanical gears',
            mint: 'Celestial Minting House',
            finish: 'Polished Silver with Blue Enamel'
        },
        storybook: [
            {
                page: 1,
                title: 'The Sands of Time',
                content: 'In the film, this medallion allowed the protagonist to revisit the same hour three times. The design is based on ancient astronomical clocks found in Jaipur.',
                type: 'narrative'
            },
            {
                page: 2,
                title: 'Symbolism',
                content: 'The blue enamel representing the "Sea of Memories" was hand-applied to the master die.',
                type: 'curator'
            }
        ],
        utility: {
            name: 'Chronos Boost',
            bonus: '3.2%',
            effect: 'Reduces the "Cool-down" period of all active land abilities by 15%.'
        },
        biddingHistory: []
    },
    {
        id: 'slc_3',
        title: 'The Hero\'s Mask',
        film: 'Shadow of the Cape',
        rarity: 'Standard',
        type: 'Standard Legendary',
        material: '10g Fine Silver',
        editionLimit: 2000,
        basePrice: 4999,
        utilityPower: 2.1,
        description: 'A commemorative 10g silver coin featuring the iconic mask of the vigilante who saved the city. The standard entry into the legendary collection.',
        silverWeight: '10g',
        status: 'completed',
        startTime: Date.now() - 10 * 86400000,
        endTime: Date.now() - 7 * 86400000,
        applicantsCount: 42000,
        image: '/images/slc_mask.png',
        details: {
            engraving: 'Matte-finish relief sculpture',
            mint: 'Urban Legends Mint',
            finish: 'Satin Silver'
        },
        storybook: [
            {
                page: 1,
                title: 'Behind the Mask',
                content: 'The mask was designed to be both terrifying and hopeful. This coin captures the subtle textures of the original carbon-fiber prop.',
                type: 'narrative'
            }
        ],
        utility: {
            name: 'Vigilante Shield',
            bonus: '2.1%',
            effect: 'Increases the security level of your land, protecting against "Resource Raids".'
        },
        biddingHistory: [
            { id: 1, user: 'Arjun_V', bidIndex: 284, status: 'Allocated', timestamp: Date.now() - 8 * 86400000 },
            { id: 2, user: 'Priya_K', bidIndex: 1542, status: 'Refunded', timestamp: Date.now() - 8 * 86400000 },
            { id: 3, user: 'Sam_T', bidIndex: 998, status: 'Refunded', timestamp: Date.now() - 8 * 86400000 }
        ],
        winner: {
            user: 'Arjun_V',
            serialNumber: 'SLC-3-H0284',
            allocationDate: new Date(Date.now() - 8 * 86400000).toLocaleDateString()
        }
    }
];
