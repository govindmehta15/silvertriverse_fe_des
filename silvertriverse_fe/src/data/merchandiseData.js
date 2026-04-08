// Mock data for the Merchandise module
// Includes 50+ high-fidelity artifacts across Yours, Ours, Zywh, and Desire pillars.

export const formatPrice = (p) => '₹' + (p?.toLocaleString() || '0');

export const premiumMerchandise = [
    // --- PREVIOUS DATA (y1 - y10) ---
    {
        id: 'y1', type: 'PremiumProduct', title: 'Aetherion Precision Chronograph', filmReference: 'Aetherion: The Future Is Now', price: 250000,
        images: ['/images/bomber_jacket.png'], story: 'Forged from titanium recovered from the Aetherion set.',
        sceneInspiration: 'The climactic timeline jump in Aetherion.',
        propRef: 'DT-CHRONO-883', screenTime: '4 min 12 sec',
        utilityPower: 75, digitalTwinId: 'DT-CHRONO-883', editionSize: 50,
        digitalBooklet: [{ type: 'text', title: 'Director Note', text: 'Time isn\'t a straight line.' }],
        heritageEra: 'Post-Silicon Frontier • 2027',
        restorationLog: 'High-fidelity mesh reconstruction from original set blueprints.',
        decodingDifficulty: 'Medium'
    },
    {
        id: 'y2', type: 'PremiumProduct', title: 'The Silhouette Diamond Ring', filmReference: 'The Silhouette', price: 150000,
        images: ['/images/diamond_ring.png'], story: 'Mysterious heirloom passed down through three generations.',
        sceneInspiration: 'The grand ballroom reveal.',
        propRef: 'DT-RING-128', screenTime: '8 min 30 sec',
        utilityPower: 60, digitalTwinId: 'DT-RING-128', editionSize: 100,
        curatorNote: 'Selected for its unparalleled silhouette and its narrative weight in the detective\'s first case.',
        historicalValuation: '₹1.5L Initial • ₹2.2L Estimated Current',
        elitePedigree: 'Origin: Silvertriverse Production Vault'
    },
    {
        id: 'y3', type: 'PremiumProduct', title: 'Star of Aetherion Necklace', filmReference: 'Aetherion: The Future Is Now', price: 80000,
        images: ['/images/diamond_necklace.png'], story: 'Exact replica of the crystal heart of the reactor.',
        sceneInspiration: 'The descent into the Core.',
        utilityPower: 45, digitalTwinId: 'DT-NECK-455', editionSize: 200
    },
    {
        id: 'y4', type: 'PremiumProduct', title: 'Quantum Field Prop Core', filmReference: 'Aetherion: The Future Is Now', price: 320000,
        images: ['/images/scifi_weapon.png'], story: 'Original prop machined from aircraft-grade aluminum.',
        sceneInspiration: 'The intense tracking shot through the reactor.',
        utilityPower: 85, digitalTwinId: 'DT-CORE-998', editionSize: 3
    },
    { id: 'y5', type: 'PremiumProduct', title: 'Enigma Box', filmReference: 'The Silhouette', price: 90000, images: ['/images/scifi_weapon.png'], story: 'A puzzle box holding the mystery.', utilityPower: 40, digitalTwinId: 'DT-ENIGMA-100', editionSize: 100 },
    { id: 'y6', type: 'PremiumProduct', title: 'Galactic Compass', filmReference: 'Aetherion: The Future Is Now', price: 120000, images: ['/images/scifi_weapon.png'], story: 'Navigated the wasteland.', utilityPower: 55, digitalTwinId: 'DT-COMP-050', editionSize: 50 },
    { id: 'y7', type: 'PremiumProduct', title: 'Noir Silk Tie', filmReference: 'The Silhouette', price: 45000, images: ['/images/bomber_jacket.png'], story: 'Worn in the final confrontation.', utilityPower: 25, digitalTwinId: 'DT-TIE-200', editionSize: 200 },
    { id: 'y8', type: 'PremiumProduct', title: 'Commander Nova Visor', filmReference: 'Aetherion: The Future Is Now', price: 210000, images: ['/images/scifi_weapon.png'], story: 'Iconic glowing visor.', utilityPower: 70, digitalTwinId: 'DT-VIS-020', editionSize: 20 },
    { id: 'y9', type: 'PremiumProduct', title: 'Vance Detective Badge', filmReference: 'The Silhouette', price: 65000, images: ['/images/scifi_weapon.png'], story: 'Heavy brass authority symbol.', utilityPower: 30, digitalTwinId: 'DT-BDG-150', editionSize: 150 },
    { id: 'y10', type: 'PremiumProduct', title: 'Obsidian Monolith Fragment', filmReference: 'Aetherion: The Future Is Now', price: 400000, images: ['/images/scifi_weapon.png'], story: 'Caused the timeline tear.', utilityPower: 90, digitalTwinId: 'DT-MON-005', editionSize: 5 },

    {
        id: 'y11', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Saraswati', title: 'Saraswati — Ivory Hamsa Saree', 
        price: 185000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'],
        weaveType: 'Kasavu Mundum Neriyathum', heritageOrigin: 'Kerala Handloom Cluster', 
        sacredSymbolism: 'The Hamsa (Swan) representing discernment and spiritual grace.', 
        divineRationale: 'Ivory and soft gold representing intellectual clarity and purity of knowledge.',
        divineConnection: 'The white base reflects the "Sattvic" nature of wisdom, while the minimal gold border mirrors the subtle illumination of the enlightened mind. The Kasavu weave, known for its breathable elegance, mimics the flowing, unburdened nature of Saraswati’s river origins.',
        sacredMotifs: 'Kuyil Kannu (Cuckoo\'s Eye), Lotus, Hamsa.',
        fabricFeel: 'Lightweight, crisp cotton and gold zari.',
        story: 'A minimal, elegant weave symbolizing the spiritual calmness of learning.',
        utilityPower: 65, digitalTwinId: 'HT-SARA-101', editionSize: 12,
        digitalBooklet: [{ type: 'text', title: 'The Archetype', text: 'Saraswati flows through the mind like a river of white light.' }]
    },
    {
        id: 'y12', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Lakshmi', title: 'Lakshmi — Royal Crimson Silks', 
        price: 210000, images: ['https://images.unsplash.com/photo-1590111002900-541a774579c1?q=80&w=2070&auto=format&fit=crop'],
        weaveType: 'Banarasi Katan Silk', heritageOrigin: 'Varanasi Master Weavers',
        sacredSymbolism: 'Elephant (Gaja) representing royal prosperity and grounded wealth.',
        divineRationale: 'Deep crimson and heavy gold zari symbolizing abundance and divine fortune.',
        divineConnection: 'Crimson is the color of life force (Prana) and auspiciousness. The heavy gold Zari work in the Banarasi style acts as a literal "shackle of wealth," representing the material abundance Lakshmi brings to the earthly realm.',
        sacredMotifs: 'Asharfi (Coin), Kalash, Lotus Ponds.',
        fabricFeel: 'Regal, heavy, shimmering silk.',
        story: 'Woven for those who build empires and foster prosperity.',
        utilityPower: 70, digitalTwinId: 'HT-LAKH-102', editionSize: 15
    },
    {
        id: 'y13', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Durga', title: 'Durga — Vermilion Protection Weave', 
        price: 195000, images: ['https://images.unsplash.com/photo-1621350130638-ef1108269588?q=80&w=2070&auto=format&fit=crop'],
        weaveType: 'Baluchari Silk', heritageOrigin: 'Bishnupur Artisans',
        sacredSymbolism: 'Trishul (Trident) - The synthesis of Desire, Action, and Knowledge.',
        divineRationale: 'Vermilion red and white representing the balance of purity and protective fierce energy.',
        divineConnection: 'The Baluchari pallu displays narrative scenes from scriptures. For Durga, this saree features the victory over Mahishasura, turning the garment into a protective talisman that shields the wearer from chaos.',
        sacredMotifs: 'Traceries of temple chariots, Trishul, Lion.',
        fabricFeel: 'Sturdy, textured silk with narrative borders.',
        story: 'A warrior goddess inspired silhouette for the protectors of the realm.',
        utilityPower: 75, digitalTwinId: 'HT-DURG-103', editionSize: 10
    },
    {
        id: 'y14', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Parvati', title: 'Parvati — Emerald Peak Drapery', 
        price: 175000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'],
        weaveType: 'Kanchipuram Silk', heritageOrigin: 'Temple Town Weavers',
        sacredSymbolism: 'Nandi - Eternal devotion, strength, and the patience of the mountains.',
        divineRationale: 'Emerald green and turmeric yellow symbolizing fertility and the strength of the Himalayas.',
        divineConnection: 'Green represents the lush slopes of the Kailash foothills where Parvati resides. The Kanchipuram weave is known for its "immortal" durability, mirroring the eternal nature of the divine feminine as the mother of the universe.',
        sacredMotifs: 'Mallinai (Jasmine bud), Rudraksha beads, Peacock.',
        fabricFeel: 'Thick, lustrous, high-tensile silk.',
        story: 'Divine feminine power woven into the fabric of the Earth.',
        utilityPower: 68, digitalTwinId: 'HT-PARV-104', editionSize: 20
    },
    { id: 'y15', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Sita', title: 'Sita — Earth Resilient Drape', price: 160000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Maheshwari Silk-Cotton', heritageOrigin: 'Maheshwar Region', sacredSymbolism: 'Earth Furrow', divineRationale: 'Earthy brown and copper symbolizing patience and deep connection to the ground.', divineConnection: 'Sita, the daughter of the Earth, is celebrated through this lightweight but resilient weave. The Chanderi-Maheshwari blend allows for agility, symbolizing her journey through trials with graceful endurance.', story: 'Resilience through patience.', utilityPower: 55, digitalTwinId: 'HT-SITA-105', editionSize: 25 },
    { id: 'y16', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Ganga', title: 'Ganga — Celestial River Silk', price: 190000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Jamdani Fine Muslin', heritageOrigin: 'Bengal Heritage Belts', sacredSymbolism: 'Flowing Current representing the descent of the heavens.', divineRationale: 'Sky blue and silver mirroring the shimmer of sacred water.', divineConnection: 'Jamdani weaving is so light it is often called "woven air." For Ganga, it represents the ethereal transition of water from the heavens (Akash Ganga) to the physical world.', story: 'The flow of forgiveness.', utilityPower: 72, digitalTwinId: 'HT-GANG-106', editionSize: 12 },
    { id: 'y17', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Meenakshi', title: 'Meenakshi — Peacock Majesty', price: 220000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Madurai Silk', heritageOrigin: 'Pandyan Regions', sacredSymbolism: 'Fish Eye (Wisdom) - The legendary gaze that feeds her children.', divineRationale: 'Peacock blue and sea green representing royal authority.', divineConnection: 'Reflecting the warrior queen of Madurai, this silk features the "Vaanam" (Sky) pattern. The rigid structure of the Madurai weave mirrors her unwavering command over the Pandyan empire.', story: 'The warrior-queen archetype.', utilityPower: 78, digitalTwinId: 'HT-MEEN-107', editionSize: 5 },
    { id: 'y18', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Draupadi', title: 'Draupadi — Fire & Justice Weave', price: 180000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Patola Double Ikat', heritageOrigin: 'Patan Master Weavers', sacredSymbolism: 'Sacred Fire (Havan) - Purity that emerges from the flame.', divineRationale: 'Fiery red and black mirroring an unyielding spirit.', divineConnection: 'Patolan weaving is incredibly complex, where the warp and weft are dyed before weaving. This represent the complexity of Draupadi’s destiny—pre-ordained and unbreakable even under the pressure of the Great War.', story: 'Demand for justice woven in silk.', utilityPower: 80, digitalTwinId: 'HT-DRAU-108', editionSize: 8 },
    { id: 'y19', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Savitri', title: 'Savitri — Persistent Threads', price: 155000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Odisha Ikat', heritageOrigin: 'Sambalpur Belt', sacredSymbolism: 'Banyan Tree (Life Force)', divineRationale: 'Forest green and terracotta representing determination over fate.', story: 'The mastery of life\'s threads.', utilityPower: 62, digitalTwinId: 'HT-SAVI-109', editionSize: 22 },
    { id: 'y20', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Ahalya', title: 'Ahalya — Stone Awakening Silk', price: 165000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Tussar Wild Silk', heritageOrigin: 'Bhagalpur Cluster', sacredSymbolism: 'Stone to Bloom', divineRationale: 'Stone grey and slate reflecting the journey from stillness to life.', story: 'The awakening of the organic spirit.', utilityPower: 60, digitalTwinId: 'HT-AHAL-110', editionSize: 18 },
    { id: 'y21', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Devayani', title: 'Devayani — Royal Lineage Purples', price: 205000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Mysore Pure Silk', heritageOrigin: 'Karnataka Silk Board', sacredSymbolism: 'Rising Sun', divineRationale: 'Royal purple and antique gold symbolizing aristocratic pride.', story: 'Dignity woven through lineage.', utilityPower: 74, digitalTwinId: 'HT-DEVA-111', editionSize: 10 },
    { id: 'y22', type: 'PremiumProduct', category: 'Goddess of India', subCategory: 'Arundhati', title: 'Arundhati — Star Fidelity Silk', price: 198000, images: ['https://images.unsplash.com/photo-1583301286816-f4f0301828c2?q=80&w=2070&auto=format&fit=crop'], weaveType: 'Yeola Paithani', heritageOrigin: 'Maharashtra Heritage', sacredSymbolism: 'The North Star', divineRationale: 'Ivory and muted purple representing timeless spiritual integrity.', story: 'Loyalty beyond the physical world.', utilityPower: 76, digitalTwinId: 'HT-ARUN-112', editionSize: 14 },

    // --- NEW: CINEMATIC RELICS & CELEBRITY ARTIFACTS (y23 - y35) ---
    {
        id: 'y23', type: 'PremiumProduct', category: 'Film Inspired', title: 'Aetherion Phase Shield', 
        price: 380000, images: ['/images/scifi_weapon.png'],
        sceneInspiration: 'The rain-soaked alleyway confrontation in Aetherion (Act 1).',
        directorNote: 'It needed to hum like a dying star and feel heavy enough to ground the protagonist.',
        propRef: 'PROP-AETH-912', screenTime: '12 min 40 sec',
        story: 'One of the five hero props used during the high-speed chase in Sector 4.',
        utilityPower: 88, digitalTwinId: 'DT-SHLD-912', editionSize: 5,
        manufacturingLog: 'Machined from aircraft-grade titanium alloy with integrated quantum-LED modules. Hand-weathered by the principal prop master over 45 days.',
        authenticityRating: '99.5% - Screen Used A-Grade'
    },
    {
        id: 'y24', type: 'PremiumProduct', category: 'Celebrity Inspired', title: 'Aurelia Gala Gown — Glass Prism', 
        price: 450000, images: ['/images/elegant_dress.png'],
        eventContext: 'The 2027 Silvertriverse Global Launch Gala.',
        personalQuote: 'I felt like light was merely passing through me, not hitting me.',
        designerName: 'Atelier Nova X Iris Van Herpen',
        story: 'Worn by the legendary Aurelia during her final public performance.',
        utilityPower: 92, digitalTwinId: 'DT-GALA-001', editionSize: 1,
        manufacturingLog: '3D printed flex-resin with embedded fiber optic strands. Requires 12 hours of calibration before each appearance to synchronize with the Silvertriverse light field.',
        eventTimeline: 'Created Dec 2026 • Premiered Jan 2027 • Final Appearance March 2027'
    },
    { id: 'y25', type: 'PremiumProduct', category: 'Film Inspired', title: 'Silhouette Crystal Decanter', price: 95000, images: ['/images/diamond_necklace.png'], sceneInspiration: 'The detective\'s office evening shots.', directorNote: 'A visual metaphor for clarity in the midst of a foggy mystery.', propRef: 'PROP-SILH-202', screenTime: '45 min', story: 'Crystal centerpiece representing the protagonist\'s sharp intuition.', utilityPower: 45, digitalTwinId: 'DT-DESC-202', editionSize: 20 },
    { id: 'y26', type: 'PremiumProduct', category: 'Celebrity Inspired', title: 'Vance Executive Fountain Pen', price: 55000, images: ['/images/bomber_jacket.png'], personalQuote: 'Every contract is a story waiting to be signed.', designerName: 'Montblanc X Silvertriverse', story: 'The signature pen seen on every boardroom table in the first season.', utilityPower: 22, digitalTwinId: 'DT-PEN-774', editionSize: 100 },
    { id: 'y27', type: 'PremiumProduct', category: 'Film Inspired', title: 'Sector 4 Memory Unit', price: 180000, images: ['/images/scifi_weapon.png'], sceneInspiration: 'The server room heist.', directorNote: 'Glowing but glitching, it represented the character\'s fractured memory.', propRef: 'PROP-AETH-005', screenTime: '2 min', story: 'Actual screen-used prop with functional internal LED pulsing.', utilityPower: 65, digitalTwinId: 'DT-MEM-005', editionSize: 10 },
    { id: 'y28', type: 'PremiumProduct', category: 'Global Style', title: 'Neoluxe Urban Trench', price: 85000, images: ['/images/leather_jacket.png'], materialResilience: 'Liquid-Repellent Nanotech', modernContext: 'Defining the post-dystopian formal silhouette.', utilityClass: 'Urban Diplomat', story: 'A wearable piece that blends cyberpunk utility with Italian tailoring.', utilityPower: 40, digitalTwinId: 'DT-URB-883', editionSize: 150 },
    { id: 'y29', type: 'PremiumProduct', category: 'Film Inspired', title: 'The Aetherion Star Map', price: 110000, images: ['/images/scifi_weapon.png'], sceneInspiration: 'The navigation deck sequence.', directorNote: 'It should look like the stars are floating on the glass.', propRef: 'PROP-AETH-772', screenTime: '10 min', story: 'Hand-etched glass plate used to set the course for the stars.', utilityPower: 58, digitalTwinId: 'DT-MAP-772', editionSize: 50 },
    { id: 'y30', type: 'PremiumProduct', category: 'Celebrity Inspired', title: 'Commander Nova Original Boots', price: 280000, images: ['/images/bomber_jacket.png'], eventContext: 'Worn throughout the entire location shoot in Iceland.', designerName: 'Timberland X Silvertriverse Archive', story: 'Heavily weathered footwear from the principal actor\'s personal costume.', utilityPower: 70, digitalTwinId: 'DT-BOOT-001', editionSize: 2 }
];

export const dailyMerchandise = [
    // --- PREVIOUS DATA (o1 - o9) ---
    { id: 'o1', type: 'DailyProduct', title: 'Neo-Tokyo Graphic Tee', filmReference: 'Aetherion', price: 1499, images: ['/images/leather_jacket.png'], utilityPower: 5 },
    { id: 'o2', type: 'DailyProduct', title: 'Cinematic Essential Hoodie', filmReference: 'The Silhouette', price: 1899, images: ['/images/bomber_jacket.png'], utilityPower: 8 },
    { id: 'o3', type: 'DailyProduct', title: 'Everyday Tote: "The Mansion"', filmReference: 'The Silhouette', price: 899, images: ['/images/elegant_dress.png'], utilityPower: 3 },
    { id: 'o4', type: 'DailyProduct', title: 'Sector 4 Beanie', filmReference: 'Aetherion', price: 599, images: ['/images/leather_jacket.png'], utilityPower: 2 },
    { id: 'o5', type: 'DailyProduct', title: 'Rebel Alliance Mug', filmReference: 'Aetherion', price: 399, images: ['/images/elegant_dress.png'], utilityPower: 1 },
    { id: 'o6', type: 'DailyProduct', title: 'Detective Trench Pin', filmReference: 'The Silhouette', price: 299, images: ['/images/leather_jacket.png'], utilityPower: 1 },
    { id: 'o7', type: 'DailyProduct', title: 'Sector 4 Lanyard', filmReference: 'Aetherion', price: 199, images: ['/images/bomber_jacket.png'], utilityPower: 1 },
    { id: 'o8', type: 'DailyProduct', title: 'Mansion Key Keychain', filmReference: 'The Silhouette', price: 499, images: ['/images/elegant_dress.png'], utilityPower: 2 },
    { id: 'o9', type: 'DailyProduct', title: 'Nova Tech Gloves', filmReference: 'Aetherion', price: 899, images: ['/images/leather_jacket.png'], utilityPower: 4 },

    // --- NEW: DAILY ECOSYSTEM GEAR (o10 - o25) ---
    { id: 'o10', type: 'DailyProduct', title: 'Reelity Vision Goggles (Lite)', price: 4500, images: ['/images/scifi_weapon.png'], story: 'Consumer grade AR goggles for everyday feed viewing.', utilityPower: 15, technicalSpecs: '4K Micro-OLED • 90Hz • 6h Battery', ecosystemRole: 'Primary interface for the Reelity Global Feed.', batchID: 'B-RE-2027-04' },
    { id: 'o11', type: 'DailyProduct', title: 'Atelier Artisan Sketchbook', price: 1250, images: ['/images/bomber_jacket.png'], story: 'Premium paper with sketches of early set designs.', utilityPower: 5, technicalSpecs: '140 GSM Acid-Free • 200 Pages', ecosystemRole: 'Creative documentation for aspiring meta-architects.', batchID: 'B-AT-2027-11' },
    { id: 'o12', type: 'DailyProduct', title: 'Silvertriverse Member Cape', price: 6500, images: ['/images/elegant_dress.png'], story: 'Formal apparel for digital events.', utilityPower: 20, technicalSpecs: 'Smart-Fiber • Bioluminescent Trims', ecosystemRole: 'Diplomatic formalwear for Metropolis Council sessions.', batchID: 'B-MB-2027-01' },
    { id: 'o13', type: 'DailyProduct', title: 'Sector 4 Identity Tag', price: 450, images: ['/images/leather_jacket.png'], story: 'Standard issue dog-tags from the Aetherion resistance.', utilityPower: 3 },
    { id: 'o14', type: 'DailyProduct', title: 'Cinematic Lighting Umbrella', price: 2400, images: ['/images/bomber_jacket.png'], story: 'Heavily inspired by the 1940s noir aesthetic.', utilityPower: 6 },
    { id: 'o15', type: 'DailyProduct', title: 'Vance Detective Notebook', price: 950, images: ['/images/elegant_dress.png'], story: 'Every page features a unique case clue watermark.', utilityPower: 4 },
    { id: 'o16', type: 'DailyProduct', title: 'Aetherion Oxygen Scrubber (Desktop Model)', price: 3500, images: ['/images/scifi_weapon.png'], story: 'Conceptual air purifier prop replica.', utilityPower: 12 },
    { id: 'o17', type: 'DailyProduct', title: 'Global Style Runner Sneakers', price: 5800, images: ['/images/leather_jacket.png'], story: 'High-comfort foot-gear for long filming days.', utilityPower: 10 },
    { id: 'o18', type: 'DailyProduct', title: 'Sector 4 Communication Patch', price: 350, images: ['/images/bomber_jacket.png'], story: 'Iron-on patch with embedded QR for exclusive audio logs.', utilityPower: 2 },
    { id: 'o19', type: 'DailyProduct', title: 'Silhouette Mystery Candle', price: 1200, images: ['/images/elegant_dress.png'], story: 'Fragrance profile of a dusty haunted mansion.', utilityPower: 4 },
    { id: 'o20', type: 'DailyProduct', title: 'Atelier Compass Keychain', price: 650, images: ['/images/scifi_weapon.png'], story: 'Helping you navigate the Silvertriverse.', utilityPower: 3 }
];
