import { getData, setData, updateData } from '../utils/storageService';
import { mockSLL } from '../mock/mockSLL';

const SLL_USER_STATS_KEY = 'silvertriverse_sll_user_stats';
const SLL_VOTES_KEY = 'silvertriverse_sll_votes';

export const sllService = {
    init: () => {
        if (!getData(SLL_USER_STATS_KEY)) {
            setData(SLL_USER_STATS_KEY, mockSLL.userStats);
        }
    },

    getTournaments: () => {
        return mockSLL.tournaments;
    },

    getMatches: () => {
        return mockSLL.matches;
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
            newStats.totalVotes += 1;
            newStats.participationPoints += 50;
            
            // Badge upgrade logic
            if (newStats.totalVotes >= 100) newStats.badge = 'Master Voter';
            else if (newStats.totalVotes >= 50) newStats.badge = 'Gold Voter';
            else if (newStats.totalVotes >= 20) newStats.badge = 'Silver Voter';
            
            return newStats;
        });

        return { success: true, pointsEarned: 50 };
    },

    hasVoted: (matchId) => {
        const votes = getData(SLL_VOTES_KEY) || {};
        return !!votes[matchId];
    }
};
