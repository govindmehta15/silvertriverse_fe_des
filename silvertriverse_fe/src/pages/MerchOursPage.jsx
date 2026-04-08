import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

export default function MerchOursPage() {
    const { oursChains, portfolioValue, formatPrice } = useMerchEngine();
    const navigate = useNavigate();

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
                        <div className="text-center p-4 rounded-2xl border border-emerald-700/20 bg-emerald-950/20">
                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest block">Portfolio Yield</span>
                            <span className="text-emerald-400 font-mono font-black text-xl block">{formatPrice(portfolioValue)}</span>
                            <span className="text-[7px] text-gray-600 uppercase tracking-widest">Dynamic Value</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chain Cards Grid */}
            <div className="px-4 max-w-4xl mx-auto mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oursChains.map((chain, idx) => (
                        <motion.div key={chain.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(`/merchandise/detail/ours/${chain.id}`)}
                            className="rounded-2xl border border-navy-700/30 overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all bg-navy-900/40">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img src={chain.image} alt={chain.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-white font-bold text-xs uppercase tracking-widest">{chain.filledSlots} Holders</span>
                                </div>
                                <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
                                    <span className="text-[8px] text-emerald-400 font-bold block">UTIL Pwr</span>
                                    <span className="text-white font-mono font-bold text-xs">+{chain.utilityPower}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">{chain.filmReference}</span>
                                <h3 className="text-white font-serif text-base font-bold mb-1 truncate">{chain.title}</h3>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                    <span className="text-gold font-mono font-bold">{formatPrice(chain.price)}</span>
                                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Open Chain</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
