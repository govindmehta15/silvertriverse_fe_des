export interface Product {
    id: string;
    type: 'PremiumProduct' | 'DailyProduct';
    title: string;
    filmReference: string;
    price: number;
    images: string[];
    story: string;
    memoryReference?: string;
    allocationType?: 'auction' | 'direct' | 'draw';
    editionSize?: number;
    rarity?: string;
}

export interface CollectibleUnit {
    id: number | string;
    title: string;
    genre: string;
    banner: string;
    logo: string;
    phase: 'entry' | 'bidding' | 'trading' | 'exit';
    totalTokens: number;
    tokenPrice: number;
    marketCap: number;
    currentROI: string;
    description: string;
    category: 'film' | 'sports' | 'brand';
}

export const premiumMerchandise: Product[] = [
    {
        id: 'y1',
        type: 'PremiumProduct',
        title: 'Aetherion Precision Chronograph',
        filmReference: 'Aetherion: The Future Is Now',
        price: 250000,
        images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'],
        story: 'Forged from titanium recovered from the Aetherion set, this precision chronograph is identical to the one worn by Commander Nova.',
        allocationType: 'auction',
        editionSize: 50,
        rarity: 'Legendary'
    },
    {
        id: 'y2',
        type: 'PremiumProduct',
        title: 'The Silhouette Diamond Ring',
        filmReference: 'The Silhouette',
        price: 150000,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
        story: 'This ring was the key plot device in The Silhouette — harboring a secret code within the pavé setting.',
        allocationType: 'direct',
        editionSize: 100,
        rarity: 'Epic'
    },
    {
        id: 'y10',
        type: 'PremiumProduct',
        title: 'Obsidian Monolith Fragment',
        filmReference: 'Aetherion: The Future Is Now',
        price: 400000,
        images: ['https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&q=80'],
        story: 'A piece of the very structure that caused the timeline tear. The absolute pinnacle of the film\'s lore.',
        allocationType: 'auction',
        editionSize: 5,
        rarity: 'Mythic'
    }
];

export const dailyMerchandise: Product[] = [
    {
        id: 'o1',
        type: 'DailyProduct',
        title: 'Neo-Tokyo Graphic Tee',
        filmReference: 'Aetherion: The Future Is Now',
        price: 1499,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
        story: 'A tribute to the neon-drenched streets of sector 4.',
        memoryReference: 'The moment Commander Nova steps into the rain.'
    },
    {
        id: 'o2',
        type: 'DailyProduct',
        title: 'Cinematic Essential Hoodie',
        filmReference: 'The Silhouette',
        price: 1899,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'],
        story: 'An understated, incredibly comfortable hoodie inspired by the protagonist\'s low-profile attire.',
        memoryReference: 'The tense, silent pursuit through the foggy alleyways.'
    }
];

export const collectibleUnits: CollectibleUnit[] = [
    {
        id: 1,
        title: "Dragon's Ember",
        genre: 'Epic Fantasy',
        banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        logo: '🐉',
        phase: 'trading',
        totalTokens: 10000,
        tokenPrice: 2000,
        marketCap: 20000000,
        currentROI: '+12.5%',
        description: 'An epic fantasy saga following a young outcast who discovers she is the last Ember Keeper.',
        category: 'film'
    },
    {
        id: 'f3',
        title: 'Blood Titan',
        genre: 'Sci-Fi Action',
        banner: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80',
        logo: '🦾',
        phase: 'bidding',
        totalTokens: 15000,
        tokenPrice: 1200,
        marketCap: 18000000,
        currentROI: '+4.5%',
        description: 'When a rogue AI merges with the world\'s last super-soldier.',
        category: 'film'
    },
    {
        id: 'f4',
        title: 'The Silhouette',
        genre: 'Thriller',
        banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
        logo: '👤',
        phase: 'entry',
        totalTokens: 5000,
        tokenPrice: 3500,
        marketCap: 17500000,
        currentROI: 'N/A',
        description: 'A mind-bending thriller where identity is the only currency.',
        category: 'film'
    },
    {
        id: 's1',
        title: 'Premier League Finals',
        genre: 'Football',
        banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
        logo: '⚽',
        phase: 'trading',
        totalTokens: 12000,
        tokenPrice: 1200,
        marketCap: 14400000,
        currentROI: '+9.4%',
        description: 'Tokenized exposure to the official finals commemorative kit.',
        category: 'sports'
    },
    {
        id: 's2',
        title: 'Cricket World Tour',
        genre: 'Cricket',
        banner: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
        logo: '🏏',
        phase: 'bidding',
        totalTokens: 9000,
        tokenPrice: 950,
        marketCap: 8550000,
        currentROI: '+6.8%',
        description: 'Collectible units tied to the official championship bat series.',
        category: 'sports'
    },
    {
        id: 'b1',
        title: 'Maison Lumière Capsule',
        genre: 'Luxury Fashion',
        banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
        logo: '✨',
        phase: 'trading',
        totalTokens: 8500,
        tokenPrice: 2100,
        marketCap: 17850000,
        currentROI: '+10.1%',
        description: 'Collectible units tied to the Couture Capsule IV runway drop.',
        category: 'brand'
    },
    {
        id: 'b2',
        title: 'Apex Motors Hypercar',
        genre: 'Automotive',
        banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
        logo: '🚗',
        phase: 'bidding',
        totalTokens: 10000,
        tokenPrice: 3200,
        marketCap: 32000000,
        currentROI: '+8.6%',
        description: 'Tokenized founders circle for the Apex hypercar program.',
        category: 'brand'
    }
];
