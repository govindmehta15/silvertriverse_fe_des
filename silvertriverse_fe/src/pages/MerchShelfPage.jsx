import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMerchEngine } from '../context/MerchEngineContext';

const SOURCE_STYLES = {
    YOURS: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/30' },
    OURS: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    ZYWH: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
    DESIRE: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30' },
};

export default function MerchShelfPage() {
    const { ownedMerch, formatPrice } = useMerchEngine();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950" />
                <div className="relative px-4 pt-10 pb-8 max-w-4xl mx-auto">
                    <button onClick={() => navigate('/merchandise')} className="text-gold text-[9px] font-bold uppercase tracking-[0.4em] hover:underline mb-4 block">← Atelier Hub</button>
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="font-serif text-5xl font-black text-white uppercase italic">DIGITAL SHELF</h1>
                            <p className="text-gray-500 text-xs mt-2 italic">Your vault of sovereign artifacts and ecosystem holdings.</p>
                        </div>
                        <div className="text-center p-3 rounded-2xl border border-navy-700/30 bg-navy-900/40">
                            <span className="text-[8px] text-gray-600 uppercase tracking-widest block">Collection Size</span>
                            <span className="text-white font-mono font-bold text-xl">{ownedMerch.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 max-w-4xl mx-auto mt-6">
                {ownedMerch.length === 0 ? (
                    <div className="py-20 text-center rounded-3xl border border-dashed border-navy-700/30">
                        <span className="text-5xl block mb-4">🌪️</span>
                        <h3 className="text-gray-400 font-serif text-xl">Your shelf is currently empty</h3>
                        <p className="text-gray-600 text-sm mt-2">Participate in YOURS drops or enter OURS chains to acquire artifacts.</p>
                        <button onClick={() => navigate('/merchandise')} className="mt-8 px-8 py-3 bg-gold text-black rounded-xl text-xs uppercase font-bold tracking-widest">
                            Go to Atelier
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownedMerch.map((item, idx) => {
                            const style = SOURCE_STYLES[item.source] || SOURCE_STYLES.YOURS;
                            return (
                                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="rounded-2xl border border-navy-700/20 overflow-hidden bg-navy-900/40 group hover:border-gold/30 transition-all">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent" />
                                        <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
                                            <span className="text-[7px] text-gray-400 font-bold block uppercase tracking-widest leading-none mb-0.5">Util Pwr</span>
                                            <span className="text-white font-mono font-bold text-xs">+{item.utilityPower || 0}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-serif text-lg font-bold mb-1 truncate">{item.title}</h3>
                                        <div className="flex justify-between items-center mt-3 mb-4">
                                            <span className="text-gray-500 text-[10px]">Acquired Value</span>
                                            <span className="text-gold font-mono font-bold">{formatPrice(item.price)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button 
                                                onClick={() => navigate(`/merchandise/detail/${item.source.toLowerCase()}/${item.dropId || item.chainId || item.listingId || item.id}`)}
                                                className="py-2 bg-navy-800 text-[8px] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-black transition-all">View</button>
                                            <button className="py-2 bg-navy-800 text-[8px] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-rose-600 transition-all">Sell</button>
                                            <button className="py-2 bg-navy-800 text-[8px] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all">Use</button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
