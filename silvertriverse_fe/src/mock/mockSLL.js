export const mockSLL = {
    tournaments: [
        {
            id: 'sll_global_clash_2026',
            title: 'Global Cinema Clash 2026',
            status: 'active',
            type: 'Knockout',
            totalParticipants: 16,
            prizePool: 'Commemorative Silver Coin',
            description: 'The ultimate battle of cinematic masterpieces. 16 films, 1 goal.',
            image: '/images/sll_global_clash.png',
            currentRound: 'Quarter Finals'
        },
        {
            id: 'sll_best_villain',
            title: 'Iconic Villains League',
            status: 'upcoming',
            type: 'League Table',
            totalParticipants: 10,
            description: 'Who is the most menacing presence in cinema history?',
            image: '/images/sll_villains.png',
            currentRound: 'Round 1'
        }
    ],
    matches: [
        {
            id: 'm1',
            tournamentId: 'sll_global_clash_2026',
            filmA: { id: 'f1', name: 'Interstellar', poster: '/images/film_interstellar.png', votes: 4520 },
            filmB: { id: 'f2', name: 'Inception', poster: '/images/film_inception.png', votes: 4120 },
            status: 'live',
            timer: 3600, // seconds
            round: 'Quarter Finals',
            totalVotes: 8640
        },
        {
            id: 'm2',
            tournamentId: 'sll_global_clash_2026',
            filmA: { id: 'f3', name: 'KGF: Chapter 2', poster: '/images/film_kgf2.png', votes: 12000 },
            filmB: { id: 'f4', name: 'Vikram', poster: '/images/film_vikram.png', votes: 11500 },
            status: 'live',
            timer: 4800,
            round: 'Quarter Finals',
            totalVotes: 23500
        }
    ],
    userStats: {
        totalVotes: 42,
        participationPoints: 2100,
        badge: 'Gold Voter',
        streak: 5
    }
};
