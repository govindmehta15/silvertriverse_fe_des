import { getData, setData } from '../utils/storageService';
import { mockSLC } from '../mock/mockSLC';

const OWNED_COINS_KEY = 'user_slc_inventory';
const ESCROW_LISTINGS_KEY = 'slc_escrow_listings';

export const slcService = {
    // Get user's own collection
    getOwnedCoins: () => {
        const owned = getData(OWNED_COINS_KEY) || [];
        if (owned.length === 0 && mockSLC && mockSLC.length > 0) {
            const firstCoin = mockSLC[0];
            const mockCoin = {
                ...firstCoin,
                instanceId: `slc-${firstCoin.id}-initial`,
                serialNumber: '#420',
                utilityPower: 4,
                source: 'primary',
                acquiredDate: new Date().toISOString()
            };
            setData(OWNED_COINS_KEY, [mockCoin]);
            return [mockCoin];
        }
        return owned;
    },

    // Add coin after successful IPO allocation
    addCoinToInventory: (coinId, serialNumber) => {
        const coin = mockSLC.find(c => c.id === coinId);
        if (!coin) return { success: false, error: 'Coin not found' };

        const current = getData(OWNED_COINS_KEY) || [];
        const newEntry = {
            ...coin,
            instanceId: `slc-${coinId}-${Date.now()}`,
            serialNumber,
            acquiredDate: new Date().toISOString(),
            status: 'owned'
        };

        current.push(newEntry);
        setData(OWNED_COINS_KEY, current);
        return { success: true, data: newEntry };
    },

    // List for resale (Escrow)
    listForResale: (instanceId, price) => {
        const inventory = getData(OWNED_COINS_KEY) || [];
        const coinIndex = inventory.findIndex(c => c.instanceId === instanceId);
        
        if (coinIndex === -1) return { success: false, error: 'Coin not found in inventory' };

        const coin = inventory[coinIndex];
        
        // Remove from inventory (Electronic Escrow)
        inventory.splice(coinIndex, 1);
        setData(OWNED_COINS_KEY, inventory);

        // Add to Marketplace
        const listings = getData(ESCROW_LISTINGS_KEY) || [];
        const newListing = {
            ...coin,
            listingId: `listing-${Date.now()}`,
            resalePrice: price,
            sellerId: 'current-user', // Mock user
            status: 'escrow'
        };
        listings.push(newListing);
        setData(ESCROW_LISTINGS_KEY, listings);

        return { success: true, data: newListing };
    },

    // Get secondary market listings
    getMarketplaceListings: () => {
        const listings = getData(ESCROW_LISTINGS_KEY) || [];
        if (listings.length === 0 && mockSLC && mockSLC.length >= 3) {
            const mockListings = [
                {
                    ...mockSLC[1],
                    listingId: 'listing-mock-1',
                    serialNumber: '#007',
                    resalePrice: 12500,
                    utilityPower: 3.5,
                    source: 'secondary',
                    sellerId: 'user-007'
                },
                {
                    ...mockSLC[2],
                    listingId: 'listing-mock-2',
                    serialNumber: '#999',
                    resalePrice: 8900,
                    utilityPower: 2.5,
                    source: 'secondary',
                    sellerId: 'user-999'
                }
            ];
            setData(ESCROW_LISTINGS_KEY, mockListings);
            return mockListings;
        }
        return listings;
    },

    // Purchase from secondary market
    purchaseFromMarket: (listingId) => {
        const listings = getData(ESCROW_LISTINGS_KEY) || [];
        const listingIndex = listings.findIndex(l => l.listingId === listingId);

        if (listingIndex === -1) return { success: false, error: 'Listing not found' };

        const listing = listings[listingIndex];
        
        // Remove from marketplace
        listings.splice(listingIndex, 1);
        setData(ESCROW_LISTINGS_KEY, listings);

        // Add to buyer inventory
        const inventory = getData(OWNED_COINS_KEY) || [];
        const newEntry = {
            ...listing,
            status: 'owned',
            source: 'secondary' // Important for 85% rule
        };
        delete newEntry.listingId;
        delete newEntry.resalePrice;

        inventory.push(newEntry);
        setData(OWNED_COINS_KEY, inventory);

        return { success: true, data: newEntry };
    }
};
