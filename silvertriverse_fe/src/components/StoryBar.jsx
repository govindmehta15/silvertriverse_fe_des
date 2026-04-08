import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reelityService } from '../services/reelityService';
import StoryViewer from './StoryViewer';

export default function StoryBar({ stories }) {
    const { isAuthenticated, user } = useAuth();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const scrollRef = useRef(null);
    const [viewingStory, setViewingStory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCaption, setNewCaption] = useState('');

    const addStoryMutation = useMutation({
        mutationFn: (storyData) => reelityService.addStory(storyData),
        onSuccess: () => {
            queryClient.invalidateQueries(['reelityStories']);
            addToast('Story posted! Visible for 24 hours.', 'success');
            setShowAddForm(false);
            setNewCaption('');
        }
    });

    const handleAddStory = () => {
        if (!user) return;
        addStoryMutation.mutate({
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            image: user.avatar, // Simulated — use avatar as stand-in
            caption: newCaption || '✨'
        });
    };

    // Group stories by user
    const grouped = {};
    (stories || []).forEach(s => {
        if (!grouped[s.userId]) grouped[s.userId] = [];
        grouped[s.userId].push(s);
    });
    const storyUsers = Object.values(grouped);

    const hoursAgo = (ts) => {
        const h = Math.floor((Date.now() - ts) / 3600000);
        return h < 1 ? 'Just now' : `${h}h ago`;
    };

    return (
        <>
            <div className="relative">
                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 px-1 hide-scrollbar">
                    {/* Add Story Button */}
                    {isAuthenticated && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddForm(true)}
                            className="flex flex-col items-center gap-1.5 shrink-0 w-[72px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-navy-800 border-2 border-dashed border-gold/40 flex items-center justify-center hover:border-gold transition-colors">
                                <span className="text-gold text-2xl">+</span>
                            </div>
                            <span className="text-[10px] text-gray-400 truncate w-full text-center">Your Story</span>
                        </motion.button>
                    )}

                    {/* Story circles */}
                    {storyUsers.map((userStories) => {
                        const first = userStories[0];
                        const isBrand = first.isBrand;
                        const hasUnseen = userStories.some(s => s.isUnseen);
                        const isNew = (Date.now() - first.timestamp) < 3600000;

                        return (
                            <motion.button
                                key={first.userId}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewingStory(userStories)}
                                className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] relative group"
                            >
                                <div className={`relative w-16 h-16 rounded-full p-[2px] transition-all duration-500 ${
                                    isBrand 
                                    ? 'bg-gradient-to-br from-amber-400 via-gold to-yellow-600 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                                    : hasUnseen 
                                      ? 'bg-gradient-to-tr from-cyan-500 via-violet-500 to-fuchsia-500' 
                                      : 'bg-navy-800 border border-navy-700'
                                }`}>
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-navy-950 bg-navy-900 flex items-center justify-center">
                                        {typeof first.userAvatar === 'string' && first.userAvatar.length > 2 ? (
                                            <img
                                                src={first.userAvatar}
                                                alt={first.userName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl">{first.userAvatar}</span>
                                        )}
                                    </div>

                                    {/* 24h Cycle Indicator Line (Subtle) */}
                                    <svg className="absolute inset-0 -rotate-90 w-full h-full pointer-events-none">
                                        <circle 
                                            cx="32" cy="32" r="30" 
                                            fill="none" 
                                            stroke="white" 
                                            strokeWidth="1" 
                                            strokeDasharray="188.4" 
                                            strokeDashoffset={188.4 * (1 - (Date.now() - first.timestamp) / (3600000 * 24))} 
                                            className="opacity-20 translate-x-[-1px] translate-y-[-1px]"
                                        />
                                    </svg>
                                </div>
                                
                                {isBrand && (
                                    <div className="absolute -top-1 -right-1 bg-gold text-navy-950 text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Brand</div>
                                )}
                                {isNew && !isBrand && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">Live</div>
                                )}

                                <span className={`text-[9px] truncate w-full text-center font-bold tracking-tight ${isBrand ? 'text-gold' : 'text-gray-300'}`}>
                                    {first.userName.split(' ')[0]}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Add Story Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-navy-900 border border-navy-700 rounded-2xl p-6 w-full max-w-sm space-y-4"
                        >
                            <h3 className="font-serif text-xl text-gold font-bold">Add Story</h3>
                            <p className="text-gray-400 text-xs">Your story will be visible for 24 hours.</p>
                            <textarea
                                value={newCaption}
                                onChange={e => setNewCaption(e.target.value)}
                                placeholder="What's on your mind? ✨"
                                rows={3}
                                className="w-full bg-navy-800 border border-navy-600 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none resize-none"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setShowAddForm(false)} className="flex-1 py-2 rounded-lg bg-navy-800 text-gray-400 text-sm font-medium hover:bg-navy-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleAddStory} disabled={addStoryMutation.isPending} className="flex-1 py-2 rounded-lg bg-gold text-navy-950 text-sm font-bold hover:bg-gold/90 transition-colors disabled:opacity-50">
                                    {addStoryMutation.isPending ? 'Posting...' : 'Post Story'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Story Viewer */}
            <AnimatePresence>
                {viewingStory && (
                    <StoryViewer stories={viewingStory} onClose={() => setViewingStory(null)} />
                )}
            </AnimatePresence>
        </>
    );
}
