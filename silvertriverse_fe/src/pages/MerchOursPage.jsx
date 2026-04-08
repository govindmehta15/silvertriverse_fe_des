import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';
import StockGraph from '../components/StockGraph';

export default function MerchOursPage() {
    const { oursChains, oursPositions, formatPrice } = useMerchEngine();
    const navigate = useNavigate();

    // Calculate total yield from all held positions
    const portfolioYield = Object.values(oursPositions || {}).reduce((sum, pos) => {
        const lastReward = pos.rewardHistory?.[pos.rewardHistory.length - 1] || 0;
        return sum + lastReward;
    }, 0);

    return (
        <div className="min-h-screen pb-20 bg-navy-950">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-navy-950/80 to-navy-950" />
                <div className="relative px-4 pt-8 pb-6 max-w-4xl mx-auto">
                    <button onClick={() => navigate('/merchandise')} className="text-gold text-[9px] font-bold uppercase tracking-[0.4em] hover:underline mb-4 block">← Atelier</button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-serif text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-emerald-400 uppercase italic">OURS</h1>
                            <p className="text-gray-500 text-xs mt-2 italic max-w-md">Our Unified Real Style. Chain-based value system. Early entry defines growth potential.</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl border border-emerald-700/20 bg-emerald-950/20 min-w-[140px]">
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">Accumulated Yield</span>
                            <span className="text-emerald-400 font-mono font-black text-xl block leading-tight">{formatPrice(portfolioYield)}</span>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[7px] text-emerald-600 uppercase tracking-widest font-bold">Real-time update</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chain Cards Grid */}
            <div className="px-4 max-w-4xl mx-auto mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oursChains.map((chain, idx) => {
                        const userPos = oursPositions?.[chain.id];
                        const currentReward = userPos?.rewardHistory?.[userPos.rewardHistory.length - 1] || 0;

                        return (
                            <motion.div key={chain.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/merchandise/detail/ours/${chain.id}`)}
                                className={`rounded-3xl border overflow-hidden cursor-pointer group transition-all duration-500 bg-navy-900/60 backdrop-blur-sm ${userPos ? 'border-emerald-500/30' : 'border-navy-700/30 hover:border-emerald-500/20'}`}>
                                
                                <div className="aspect-[16/10] relative overflow-hidden">
                                    <img src={chain.image} alt={chain.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10" />
                                    
                                    {/* Reward Overlay if owned */}
                                    {userPos && (
                                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                                            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Yield: {formatPrice(currentReward)}</span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        <span className="text-white font-bold text-[10px] uppercase tracking-widest">{chain.filledSlots} Active Nodes</span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[8px] text-gray-500 uppercase tracking-[0.2em] block mb-1">{chain.filmReference}</span>
                                            <h3 className="text-white font-serif text-base font-bold truncate pr-4">{chain.title}</h3>
                                        </div>
                                    </div>

                                    {/* Graphs Section */}
                                    <div className="space-y-4 my-4 p-3 rounded-2xl bg-black/20 border border-white/5">
                                        <StockGraph 
                                            data={chain.priceHistory} 
                                            color="#10b981" 
                                            label="Item Stock Price" 
                                            height={30} 
                                        />
                                        
                                        {userPos && (
                                            <StockGraph 
                                                data={userPos.rewardHistory} 
                                                color="#facc15" 
                                                label="Your Chain Yield" 
                                                height={30} 
                                            />
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-500 uppercase tracking-widest">Buy Price</span>
                                            <span className="text-gold font-mono font-bold">{formatPrice(chain.price)}</span>
                                        </div>
                                        {userPos ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] text-emerald-500 uppercase tracking-widest">Position {userPos.position}</span>
                                                <span className="text-[9px] text-emerald-400/60 font-bold uppercase tracking-widest italic">Holding →</span>
                                            </div>
                                        ) : (
                                            <button className="px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                Buy Entry
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
