import { getData, setData, updateData } from '../utils/storageService';
import { mockSLL } from '../mock/mockSLL';
import { communityService } from './communityService';

const SLL_USER_STATS_KEY = 'silvertriverse_sll_user_stats';
const SLL_VOTES_KEY = 'silvertriverse_sll_votes';
const SLL_COMMUNITY_LEAGUES_KEY = 'silvertriverse_sll_community_leagues';

export const sllService = {
    init: () => {
        if (!getData(SLL_USER_STATS_KEY)) {
            setData(SLL_USER_STATS_KEY, mockSLL.userStats);
        }
    },

    getMatches: () => {
        return mockSLL.matches || [];
    },

    getTournaments: () => {
        const community = getData(SLL_COMMUNITY_LEAGUES_KEY) || [];
        return [...mockSLL.tournaments, ...community];
    },

    getOfficialLeagues: () => {
        return mockSLL.tournaments.filter(t => t.isOfficial);
    },

    getCommunityLeagues: () => {
        const community = getData(SLL_COMMUNITY_LEAGUES_KEY) || [];
        const mockCommunity = mockSLL.tournaments.filter(t => !t.isOfficial);
        return [...mockCommunity, ...community];
    },

    createLeague: (config) => {
        const leagues = getData(SLL_COMMUNITY_LEAGUES_KEY) || [];
        const newLeague = {
            id: `comm_${Date.now()}`,
            ...config,
            status: config.publishNow ? 'active' : 'draft',
            isOfficial: false,
            currentRound: 'Preview',
            createdAt: new Date().toISOString()
        };
        leagues.push(newLeague);
        setData(SLL_COMMUNITY_LEAGUES_KEY, leagues);
        return { success: true, data: newLeague };
    },

    getFilmArchive: (query = '') => {
        if (!query) return mockSLL.filmArchive;
        return mockSLL.filmArchive.filter(f => 
            f.name.toLowerCase().includes(query.toLowerCase()) || 
            f.genre.toLowerCase().includes(query.toLowerCase())
        );
    },

    finalizeMatch: (matchId) => {
        // Mock finalization logic
        const match = mockSLL.matches.find(m => m.id === matchId);
        if (match) {
            match.status = 'concluded';
            match.winner = match.filmA.votes > match.filmB.votes ? match.filmA : match.filmB;
        }
    },

    getUserStats: () => {
        return getData(SLL_USER_STATS_KEY) || mockSLL.userStats;
    },

    castVote: (matchId, filmId) => {
        const votes = getData(SLL_VOTES_KEY) || {};
        if (votes[matchId]) throw new Error('You have already voted in this match');

        // Logic A: Register vote
        votes[matchId] = filmId;
        setData(SLL_VOTES_KEY, votes);

        // Logic B: Award points
        updateData(SLL_USER_STATS_KEY, (stats) => {
            const newStats = { ...stats };
            
            // Society Boost Logic
            const match = mockSLL.matches.find(m => m.id === matchId);
            const film = match ? (match.filmA.id === filmId ? match.filmA : match.filmB) : null;
            const isSocietyMember = film?.societyId ? true : false; // Mocked for now, assuming true if linked for testing
            const pointBonus = isSocietyMember ? 75 : 50;

            newStats.totalVotes += 1;
            newStats.participationPoints += pointBonus;
            
            // Badge upgrade logic
            if (newStats.totalVotes >= 100) newStats.badge = 'Master Voter';
            else if (newStats.totalVotes >= 50) newStats.badge = 'Gold Voter';
            else if (newStats.totalVotes >= 20) newStats.badge = 'Silver Voter';
            
            return newStats;
        });

        return { success: true, pointsEarned: 50, societyBoost: true };
    },

    hasVoted: (matchId) => {
        const votes = getData(SLL_VOTES_KEY) || {};
        return !!votes[matchId];
    },

    getMatchById: (id) => {
        return mockSLL.matches.find(m => m.id === id);
    },

    getLeagueStandings: (leagueId) => {
        return mockSLL.leagueStandings[leagueId] || [];
    },

    getWorldCup: (wcId) => {
        return mockSLL.worldCup;
    },

    getGlobalLeaderboard: () => {
        return mockSLL.globalLeaderboard;
    },

    getBrackets: (tournamentId) => {
        return mockSLL.brackets[tournamentId] || null;
    },

    getTournamentById: (id) => {
        return mockSLL.tournaments.find(t => t.id === id) || mockSLL.tournaments[0];
    },

    getHallOfFame: () => {
        return mockSLL.hallOfFame || [];
    },

    getUserDetailedStats: () => {
        return mockSLL.userDetailedStats;
    },

    getHeritageCoins: () => {
        return mockSLL.heritageCoins || [];
    },

    finalizeTournament: (tournamentId) => {
        // Mock logic to trigger Eco-Boosts and crown a winner
        const tournament = mockSLL.tournaments.find(t => t.id === tournamentId);
        if (tournament) {
            tournament.status = 'concluded';
            // Simulated event dispatch
            console.log(`[SLL ECONOMICS] Fame Boost triggered for winner of ${tournament.title}`);
        }
        return { success: true };
    }
};
