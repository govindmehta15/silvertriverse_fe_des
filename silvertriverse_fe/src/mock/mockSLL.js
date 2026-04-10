export const mockSLL = {
    tournaments: [
        {
            id: 'sll_global_clash_2026',
            title: 'Global Cinema Clash 2026',
            status: 'active',
            type: 'Knockout',
            isOfficial: true,
            totalParticipants: 16,
            prizePool: 'Commemorative Silver Coin',
            description: 'The ultimate battle of cinematic masterpieces.',
            image: '/images/sll_global_clash.png',
            currentRound: 'Quarter Finals',
            officialPrize: 'KGF Sword (SLC-01)',
            fcuPriority: true,
            brandingColor: '#10B981' // Emerald
        },
        {
            id: 'sll_kerala_legacy',
            title: 'Kerala Film Legacy League',
            status: 'active',
            type: 'League Table',
            isOfficial: true,
            description: 'Malayalam films compete in a statewide cultural tournament.',
            image: '/images/sll_kerala.png',
            currentRound: 'Round 8',
            officialPrize: 'Manjummel Boys Commemorative SLC',
            brandingColor: '#FB1' // Gold/Amber
        },
        {
            id: 'sll_pan_india_wc',
            title: 'Pan-India Blockbuster Cup',
            status: 'upcoming',
            type: 'World Cup',
            isOfficial: true,
            description: 'Regional industries battle for national glory: Tamil, Telugu, Hindi, and more.',
            image: '/images/sll_pan_india.png',
            officialPrize: 'Legendary Pan-India Trophy Coin',
            fcuPriority: true,
            brandingColor: '#3B82F6' // Blue
        },
        {
            id: 'sll_global_cinema_league',
            title: 'Global Cinema League',
            status: 'upcoming',
            type: 'League Table',
            isOfficial: true,
            description: 'International cinema competes in a world tournament. Global cultural engagement.',
            image: '/images/sll_global_intl.png',
            officialPrize: 'Silver World Globe Coin',
            brandingColor: '#A855F7' // Purple
        },
        {
            id: 'sll_best_villain',
            title: 'Iconic Villains League',
            status: 'active',
            type: 'League Table',
            description: 'Who is the most menacing presence in cinema history?',
            image: '/images/sll_villains.png',
            category: 'Theme'
        },
        {
            id: 'sll_mass_scenes',
            title: 'Best Mass Scene League',
            status: 'upcoming',
            type: 'One-to-One',
            description: 'High-octane moments judged by the fans.',
            image: '/images/sll_mass_scenes.png',
            category: 'Theme'
        }
    ],
    matches: [
        {
            id: 'm1',
            tournamentId: 'sll_global_clash_2026',
            tournamentName: 'Global Cinema Clash 2026',
            format: 'Knockout',
            filmA: { id: 'f1', name: 'Interstellar', poster: '/images/film_interstellar.png', votes: 4520, imdb: 8.7, societyId: '3' },
            filmB: { id: 'f2', name: 'Inception', poster: '/images/film_inception.png', votes: 4120, imdb: 8.8, societyId: '1' },
            status: 'live',
            timer: 3600,
            round: 'Quarter Finals',
            totalVotes: 8640
        },
        {
            id: 'm2',
            tournamentId: 'sll_global_clash_2026',
            filmA: { id: 'f3', name: 'KGF: Chapter 2', poster: '/images/film_kgf2.png', votes: 12000, fameBoost: true, budget: '₹100Cr', societyId: '2' },
            filmB: { id: 'f4', name: 'Vikram', poster: '/images/film_vikram.png', votes: 11500, budget: '₹120Cr', societyId: '2' },
            status: 'live',
            timer: 45, // Flash Surge trigger
            round: 'Quarter Finals',
            totalVotes: 23500
        },
        {
            id: 'm3',
            tournamentId: 'sll_malayalam_cup',
            tournamentName: 'Silver Malayalam Cup',
            format: 'Knockout',
            filmA: { id: 'f_mal1', name: 'Manjummel Boys', poster: '/images/manjummel.png', votes: 8900 },
            filmB: { id: 'f_mal2', name: 'Aadujeevitham', poster: '/images/aadujeevitham.png', votes: 8750 },
            status: 'live',
            timer: 7200,
            round: 'Semi Finals',
            totalVotes: 17650
        },
        {
            id: 'm_one_one_1',
            tournamentId: 'one_to_one',
            tournamentName: 'Actor Face-Off',
            format: 'One-to-One',
            filmA: { id: 'f_actor1', name: 'Mohanlal', poster: '/images/actor1.png', votes: 20000 },
            filmB: { id: 'f_actor2', name: 'Mammootty', poster: '/images/actor2.png', votes: 19500 },
            status: 'live',
            timer: 172800,
            round: 'Main Event'
        }
    ],
    leagueStandings: {
        'sll_best_villain': [
            { id: 'v1', name: 'The Joker', played: 12, won: 10, points: 30, poster: '/images/joker_icon.png' },
            { id: 'v2', name: 'Thanos', played: 12, won: 9, points: 27, poster: '/images/thanos_icon.png' },
            { id: 'v3', name: 'Darth Vader', played: 12, won: 7, points: 21, poster: '/images/vader_icon.png' },
            { id: 'v4', name: 'Anton Chigurh', played: 12, won: 6, points: 18, poster: '/images/anton_icon.png' },
            { id: 'v5', name: 'Hans Landa', played: 12, won: 5, points: 15, poster: '/images/landa_icon.png' }
        ],
        'sll_90s_era': [
            { id: '90s_1', name: 'Jurassic Park', played: 8, won: 7, points: 21, poster: '/images/jurassic.png' },
            { id: '90s_2', name: 'The Matrix', played: 8, won: 6, points: 18, poster: '/images/matrix.png' },
            { id: '90s_3', name: 'Pulp Fiction', played: 8, won: 5, points: 15, poster: '/images/pulp.png' },
            { id: '90s_4', name: 'Titanic', played: 8, won: 4, points: 12, poster: '/images/titanic.png' }
        ]
    },
    worldCup: {
        id: 'wc_2026',
        name: 'The Cinematic World Cup',
        groups: [
            {
                name: 'Group A (Indian Cinema)',
                films: ['RRR', 'KGF 2', 'Pushpa', 'Jawan'],
                standings: [
                    { film: 'RRR', w: 2, d: 1, l: 0, pts: 7 },
                    { film: 'KGF 2', w: 1, d: 2, l: 0, pts: 5 },
                    { film: 'Pushpa', w: 0, d: 2, l: 1, pts: 2 },
                    { film: 'Jawan', w: 0, d: 1, l: 2, pts: 1 }
                ]
            },
            {
                name: 'Group B (Korean Cinema)',
                films: ['Parasite', 'Oldboy', 'The Wailing', 'Decision to Leave'],
                standings: [
                    { film: 'Parasite', w: 3, d: 0, l: 0, pts: 9 },
                    { film: 'Oldboy', w: 2, d: 0, l: 1, pts: 6 },
                    { film: 'The Wailing', w: 0, d: 1, l: 2, pts: 1 },
                    { film: 'Decision to Leave', w: 0, d: 1, l: 2, pts: 1 }
                ]
            },
            {
                name: 'Group C (Western Cinema)',
                films: ['Oppenheimer', 'Dune', 'The Batman', 'Barbie'],
                standings: [
                    { film: 'Dune', w: 2, d: 0, l: 0, pts: 6 },
                    { film: 'Oppenheimer', w: 1, d: 1, l: 0, pts: 4 },
                    { film: 'The Batman', w: 0, d: 1, l: 1, pts: 1 },
                    { film: 'Barbie', w: 0, d: 0, l: 2, pts: 0 }
                ]
            }
        ]
    },
    globalLeaderboard: [
        { id: 'u1', username: 'SuperVoter', points: 15400, badge: 'Master Voter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
        { id: 'u2', username: 'PlotTwist', points: 12100, badge: 'Gold Voter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
        { id: 'u3', username: 'OscarNerd', points: 9800, badge: 'Silver Voter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' }
    ],
    userStats: {
        totalVotes: 42,
        participationPoints: 2100,
        badge: 'Gold Voter',
        streak: 5
    },
    brackets: {
        'sll_global_clash_2026': {
            rounds: [
                {
                    name: 'Round of 16',
                    matches: [
                        { id: 'r16_m1', filmA: 'Interstellar', filmB: 'Inception', winner: 'Interstellar' },
                        { id: 'r16_m2', filmA: 'The Dark Knight', filmB: 'Joker', winner: 'The Dark Knight' },
                        { id: 'r16_m3', filmA: 'KGF 2', filmB: 'Pushpa', winner: 'KGF 2' },
                        { id: 'r16_m4', filmA: 'Vikram', filmB: 'Kanthara', winner: 'Vikram' },
                        { id: 'r16_m5', filmA: 'Parasite', filmB: 'Oldboy', winner: 'Parasite' },
                        { id: 'r16_m6', filmA: 'Seven Samurai', filmB: 'Ikiru', winner: 'Seven Samurai' },
                        { id: 'r16_m7', filmA: 'Pulp Fiction', filmB: 'Kill Bill', winner: 'Pulp Fiction' },
                        { id: 'r16_m8', filmA: 'The Godfather', filmB: 'Goodfellas', winner: 'The Godfather' }
                    ]
                },
                {
                    name: 'Quarter Finals',
                    matches: [
                        { id: 'qf_m1', filmA: 'Interstellar', filmB: 'The Dark Knight', winner: null },
                        { id: 'qf_m2', filmA: 'KGF 2', filmB: 'Vikram', winner: null },
                        { id: 'qf_m3', filmA: 'Parasite', filmB: 'Seven Samurai', winner: null },
                        { id: 'qf_m4', filmA: 'Pulp Fiction', filmB: 'The Godfather', winner: null }
                    ]
                },
                {
                    name: 'Semi Finals',
                    matches: [
                        { id: 'sf_m1', filmA: null, filmB: null, winner: null },
                        { id: 'sf_m2', filmA: null, filmB: null, winner: null }
                    ]
                },
                {
                    name: 'Finals',
                    matches: [
                        { id: 'f_m1', filmA: null, filmB: null, winner: null }
                    ]
                }
            ]
        },
        'sll_malayalam_cup': {
            rounds: [
                {
                    name: 'Semi Finals',
                    matches: [
                        { id: 'mal_sf1', filmA: 'Manjummel Boys', filmB: 'Aadujeevitham', winner: null },
                        { id: 'mal_sf2', filmA: 'Premalu', filmB: 'Bramayugam', winner: 'Bramayugam' }
                    ]
                },
                {
                    name: 'Finals',
                    matches: [
                        { id: 'mal_f1', filmA: null, filmB: 'Bramayugam', winner: null }
                    ]
                }
            ]
        },
        'sll_kerala_legacy': {
            rounds: [
                {
                    name: 'Quarter Finals',
                    matches: [
                        { id: 'k_qf1', filmA: 'Manjummel Boys', filmB: 'Lucifer', winner: 'Manjummel Boys' },
                        { id: 'k_qf2', filmA: 'Aadujeevitham', filmB: '2018', winner: 'Aadujeevitham' },
                        { id: 'k_qf3', filmA: 'Bramayugam', filmB: 'Premalu', winner: 'Bramayugam' },
                        { id: 'k_qf4', filmA: 'Drishyam', filmB: 'Pulimurugan', winner: 'Drishyam' }
                    ]
                },
                {
                    name: 'Semi Finals',
                    matches: [
                        { id: 'k_sf1', filmA: 'Manjummel Boys', filmB: 'Aadujeevitham', winner: null },
                        { id: 'k_sf2', filmA: 'Bramayugam', filmB: 'Drishyam', winner: null }
                    ]
                }
            ]
        },
        'sll_pan_india_wc': {
            rounds: [
                {
                    name: 'Semi Finals',
                    matches: [
                        { id: 'pi_sf1', filmA: 'RRR', filmB: 'Jawan', winner: null },
                        { id: 'pi_sf2', filmA: 'KGF 2', filmB: 'Pushpa', winner: null }
                    ]
                },
                {
                    name: 'Finals',
                    matches: [
                        { id: 'pi_f1', filmA: null, filmB: null, winner: null }
                    ]
                }
            ]
        },
        'sll_global_cinema_league': {
            rounds: [
                {
                    name: 'Main Event',
                    matches: [
                        { id: 'gcl_m1', filmA: 'Parasite', filmB: 'Oldboy', winner: null },
                        { id: 'gcl_m2', filmA: 'Another Round', filmB: 'Anatomy of a Fall', winner: null }
                    ]
                }
            ]
        }
    },
    filmArchive: [
        { id: 'f1', name: 'Interstellar', poster: '/images/film_interstellar.png', year: 2014, genre: 'Sci-Fi' },
        { id: 'f2', name: 'Inception', poster: '/images/film_inception.png', year: 2010, genre: 'Sci-Fi' },
        { id: 'f3', name: 'KGF: Chapter 2', poster: '/images/film_kgf2.png', year: 2022, genre: 'Action' },
        { id: 'f4', name: 'Vikram', poster: '/images/film_vikram.png', year: 2022, genre: 'Action' },
        { id: 'f5', name: 'RRR', poster: '/images/film_rrr.png', year: 2022, genre: 'Action' },
        { id: 'f6', name: 'Kanthara', poster: '/images/film_kanthara.png', year: 2022, genre: 'Drama' },
        { id: 'f7', name: 'Parasite', poster: '/images/film_parasite.png', year: 2019, genre: 'Thriller' },
        { id: 'f8', name: 'The Dark Knight', poster: '/images/film_dark_knight.png', year: 2008, genre: 'Action' },
        { id: 'f9', name: 'Pulp Fiction', poster: '/images/film_pulp.png', year: 1994, genre: 'Crime' },
        { id: 'f10', name: 'The Godfather', poster: '/images/film_godfather.png', year: 1972, genre: 'Crime' }
    ],
    hallOfFame: [
        { id: 'hof_1', filmId: 'f5', name: 'RRR', tournament: 'Global Action Expo 2025', date: '2025-12-20', boostMultiplier: 1.15, relicTrend: 'High' },
        { id: 'hof_2', filmId: 'f8', name: 'The Dark Knight', tournament: 'DC Legacy Clash', date: '2025-11-15', boostMultiplier: 1.12, relicTrend: 'Extreme' },
        { id: 'hof_3', filmId: 'f7', name: 'Parasite', tournament: 'K-Cinema World Cup', date: '2025-10-05', boostMultiplier: 1.10, relicTrend: 'Medium' }
    ],
    userDetailedStats: {
        votingHistory: [
            { id: 'h1', matchId: 'm1', filmId: 'f1', filmName: 'Interstellar', date: '2026-04-01', pointsEarned: 50 },
            { id: 'h2', matchId: 'm2', filmId: 'f3', filmName: 'KGF 2', date: '2026-04-02', pointsEarned: 75 }, // Society boost
            { id: 'h3', matchId: 'prev_1', filmId: 'f8', filmName: 'The Dark Knight', date: '2026-03-28', pointsEarned: 50 }
        ],
        milestones: [
            { id: 'm1', title: 'The First Support', date: '2026-03-15', icon: '🎯' },
            { id: 'm2', title: 'Bronze Citizen', date: '2026-03-25', icon: '🥉' },
            { id: 'm3', title: 'Society Loyal', date: '2026-04-02', icon: '⚔️' }
        ],
        statsAnalytics: {
            genrePreference: [
                { genre: 'Sci-Fi', count: 18 },
                { genre: 'Action', count: 12 },
                { genre: 'Thriller', count: 8 },
                { genre: 'Drama', count: 4 }
            ],
            weeklyActivity: [3, 5, 8, 12, 10, 4, 0] // M, T, W, T, F, S, S
        },
        creatorStats: {
            rank: 'Prolific Curator',
            leaguesCreated: [
                { id: 'cl_1', title: 'Greatest 70s Heist Films', participants: 420, trend: '+12%' },
                { id: 'cl_2', title: 'Top Neon-Noir Visuals', participants: 850, trend: '+25%' }
            ],
            creatorBadges: ['Early Strategist', 'Trend Setter']
        },
        earnedPrizes: [
            { id: 'pr_1', name: 'Global Clash 2025 Commemorative', type: 'Silver Coin', status: 'delivered', date: '2025-12-25' },
            { id: 'pr_2', name: 'Elite Voter Badge', type: 'Platform Badge', status: 'active', date: '2026-01-10' }
        ]
    },
    heritageCoins: [
        { 
            id: 'coin_rk_01', 
            name: 'KGF: Chapter 2 Legacy Edition', 
            winner: 'KGF: Chapter 2', 
            tournament: 'Silver Action Expo 2025', 
            date: 'Dec 2025', 
            material: '10g Pure Silver', 
            image: '/images/coin_kgf.png' 
        },
        { 
            id: 'coin_bt_01', 
            name: 'The Dark Knight Vanguard Edition', 
            winner: 'The Dark Knight', 
            tournament: 'DC Legacy Clash', 
            date: 'Nov 2025', 
            material: '10g Pure Silver', 
            image: '/images/coin_batman.png' 
        },
        { 
            id: 'coin_ps_01', 
            name: 'Parasite Global Heritage Coin', 
            winner: 'Parasite', 
            tournament: 'K-Cinema World Cup', 
            date: 'Oct 2025', 
            material: '10g Pure Silver', 
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=parasite_coin' 
        },
        { 
            id: 'coin_mb_01', 
            name: 'Manjummel Boys Commemorative', 
            winner: 'Manjummel Boys', 
            tournament: 'Kerala Legacy Cup 2026', 
            date: 'Live Now', 
            material: '10g Pure Silver', 
            image: '/images/coin_malayalam.png' 
        }
    ]
};


