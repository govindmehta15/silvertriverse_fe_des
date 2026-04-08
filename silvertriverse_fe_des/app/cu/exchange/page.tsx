'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { collectibleUnits } from '../../lib/data';

export default function CUExchange() {
  const tradingUnits = collectibleUnits.filter(u => u.phase === 'trading');
  const [selectedUnit, setSelectedUnit] = useState(tradingUnits[0]);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState(selectedUnit.tokenPrice.toString());
  const [quantity, setQuantity] = useState('1');

  // Scale order book based on selected unit price
  const scale = selectedUnit.tokenPrice / 25.2;

  // Simulated Order Book (Redis-style Matching Engine View)
  const sellOrders = [
    { price: 26.50 * scale, amount: 2, total: 53.0 * scale },
    { price: 26.00 * scale, amount: 5, total: 130.0 * scale },
    { price: 25.80 * scale, amount: 1, total: 25.8 * scale },
    { price: 25.40 * scale, amount: 10, total: 254.0 * scale },
  ].sort((a,b) => b.price - a.price);

  const buyOrders = [
    { price: 25.00 * scale, amount: 12, total: 300.0 * scale },
    { price: 24.80 * scale, amount: 4, total: 99.2 * scale },
    { price: 24.50 * scale, amount: 20, total: 490.0 * scale },
    { price: 24.00 * scale, amount: 8, total: 192.0 * scale },
  ];

  const recentTrades = [
     { time: '14:22:04', price: selectedUnit.tokenPrice, amount: 1, type: 'BUY' },
     { time: '14:21:55', price: selectedUnit.tokenPrice, amount: 3, type: 'SELL' },
     { time: '14:20:10', price: selectedUnit.tokenPrice - 10 * scale, amount: 2, type: 'SELL' },
     { time: '14:18:44', price: selectedUnit.tokenPrice + 20 * scale, amount: 1, type: 'BUY' },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col font-mono">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
         <div className="flex items-center gap-6">
            <Link href="/cu" className="text-gold text-[10px] font-black uppercase tracking-[0.5em] hover:underline transition-all font-sans">← CU CENTRAL</Link>
            
            <div className="flex flex-col">
               <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-sans mb-1">TRADING PAIR</span>
               <select 
                 value={selectedUnit.id} 
                 onChange={(e) => {
                    const unit = tradingUnits.find(u => u.id.toString() === e.target.value);
                    if (unit) {
                       setSelectedUnit(unit);
                       setPrice(unit.tokenPrice.toString());
                    }
                 }}
                 className="bg-transparent text-white font-black italic gold-text font-serif uppercase outline-none cursor-pointer border-none p-0 text-xl"
               >
                  {tradingUnits.map(u => (
                     <option key={u.id} value={u.id} className="bg-zinc-950 text-white">{u.title.toUpperCase()} / INR</option>
                  ))}
               </select>
            </div>
         </div>
         <div className="flex gap-8">
            <div className="text-right">
               <span className="block text-[8px] text-zinc-500 uppercase tracking-widest font-sans mb-1">LAST PRICE</span>
               <span className="text-xl text-emerald-400">{selectedUnit.tokenPrice} INR</span>
            </div>
            <div className="text-right">
               <span className="block text-[8px] text-zinc-500 uppercase tracking-widest font-sans mb-1">ROI</span>
               <span className="text-xl text-white">{selectedUnit.currentROI}</span>
            </div>
         </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         {/* CHART AREA (MOCK) */}
         <div className="flex-[2] border-r border-white/5 flex flex-col p-6 relative">
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">REAL-TIME MATCHING CHART</span>
               <div className="flex gap-2">
                  {['1H', '4H', '1D', '1W'].map(tSpan => (
                     <span key={tSpan} className={`px-2 py-1 text-[10px] cursor-pointer ${tSpan === '1D' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-white'}`}>{tSpan}</span>
                  ))}
               </div>
            </div>
            <div className="flex-1 border border-white/5 rounded-xl bg-zinc-900/50 relative overflow-hidden flex items-end justify-center pb-20">
               {/* Mock Candlesticks */}
               <div className="w-full flex items-end gap-1 px-4 opacity-50">
                  {Array.from({length: 40}).map((_, i) => {
                     const height = 20 + Math.random() * 60;
                     const isGreen = Math.random() > 0.5;
                     return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                           <div className={`w-[1px] h-[${height + 20}%] ${isGreen ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`} />
                           <div 
                             className={`w-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                             style={{height: `${height}%`}} 
                           />
                        </div>
                     )
                  })}
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent pointer-events-none" />
               <span className="absolute bottom-6 text-zinc-500 text-xs tracking-widest opacity-30">NO DATA STREAM CONNECTED</span>
            </div>
         </div>

         {/* ORDER BOOK */}
         <div className="flex-1 border-r border-white/5 flex flex-col text-sm">
            <div className="p-4 border-b border-white/5 font-sans text-[10px] font-black text-zinc-500 tracking-widest">
               ORDER BOOK
            </div>
            <div className="flex-1 flex flex-col p-4 bg-zinc-900/20">
               
               {/* Sells */}
               <div className="flex-1 flex flex-col justify-end">
                  <div className="grid grid-cols-3 text-[10px] text-zinc-600 mb-2 font-sans font-black tracking-widest px-2">
                     <span>PRICE (ETH)</span>
                     <span className="text-right">AMOUNT</span>
                     <span className="text-right">TOTAL</span>
                  </div>
                  {sellOrders.map((o, i) => (
                     <div key={i} className="grid grid-cols-3 text-rose-400 py-1 px-2 hover:bg-white/5 cursor-pointer relative group">
                        <div className="absolute top-0 bottom-0 right-0 bg-rose-500/10 transition-all duration-300" style={{width: `${(o.total / 300) * 100}%`}} />
                        <span className="relative z-10">{o.price.toFixed(2)}</span>
                        <span className="text-right text-white relative z-10">{o.amount}</span>
                        <span className="text-right text-zinc-500 relative z-10">{o.total.toFixed(2)}</span>
                     </div>
                  ))}
               </div>

               {/* Spread */}
               <div className="py-4 my-2 border-y border-white/5 text-center text-xl text-emerald-400 flex items-center justify-center gap-4">
                  25.20 <span className="text-[10px] text-zinc-500 font-sans tracking-widest">SPREAD 0.40</span>
               </div>

               {/* Buys */}
               <div className="flex-1 flex flex-col justify-start">
                  {buyOrders.map((o, i) => (
                     <div key={i} className="grid grid-cols-3 text-emerald-400 py-1 px-2 hover:bg-white/5 cursor-pointer relative group">
                        <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/10 transition-all duration-300" style={{width: `${(o.total / 500) * 100}%`}} />
                        <span className="relative z-10">{o.price.toFixed(2)}</span>
                        <span className="text-right text-white relative z-10">{o.amount}</span>
                        <span className="text-right text-zinc-500 relative z-10">{o.total.toFixed(2)}</span>
                     </div>
                  ))}
               </div>

            </div>
         </div>

         {/* TRADE EXECUTION PANEL */}
         <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 font-sans text-[10px] font-black text-zinc-500 tracking-widest">
               EXECUTE ORDER
            </div>
            <div className="p-6 space-y-6 flex-1">
               <div className="flex bg-black rounded-lg border border-white/10 p-1">
                  <button 
                     onClick={() => setOrderType('BUY')}
                     className={`flex-1 py-2 text-xs font-bold transition-all rounded-md ${orderType === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-white'}`}
                  >
                     BUY
                  </button>
                  <button 
                     onClick={() => setOrderType('SELL')}
                     className={`flex-1 py-2 text-xs font-bold transition-all rounded-md ${orderType === 'SELL' ? 'bg-rose-500/20 text-rose-400' : 'text-zinc-500 hover:text-white'}`}
                  >
                     SELL
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] text-zinc-500 tracking-widest font-sans">LIMIT PRICE</label>
                     <div className="bg-black border border-white/10 p-3 rounded-lg flex justify-between">
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="bg-transparent text-white outline-none w-full" />
                        <span className="text-zinc-500 text-xs">ETH</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-zinc-500 tracking-widest font-sans">QUANTITY</label>
                     <div className="bg-black border border-white/10 p-3 rounded-lg flex justify-between">
                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="bg-transparent text-white outline-none w-full" />
                        <span className="text-zinc-500 text-xs">UNITS</span>
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/5 flex justify-between text-xs">
                  <span className="text-zinc-500 font-sans tracking-widest">TOTAL VALUE</span>
                  <span className="text-white">{(parseFloat(price || '0') * parseFloat(quantity || '0')).toFixed(2)} ETH</span>
               </div>

               <button 
                  className={`w-full py-4 text-xs font-black tracking-widest rounded-lg transition-all ${orderType === 'BUY' ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-rose-500 text-black hover:bg-rose-400'}`}
               >
                  {orderType === 'BUY' ? 'SUBMIT BUY ORDER' : 'SUBMIT SELL ORDER'}
               </button>
            </div>

            {/* RECENT TRADES (Real-Time Feed Mock) */}
            <div className="h-64 border-t border-white/5 flex flex-col">
               <div className="p-4 border-b border-white/5 font-sans text-[10px] font-black text-zinc-500 tracking-widest">
                  MARKET TRADES
               </div>
               <div className="flex-1 overflow-auto p-4 space-y-2 text-xs">
                  {recentTrades.map((t, i) => (
                     <div key={i} className="flex justify-between items-center">
                        <span className="text-zinc-600">{t.time}</span>
                        <span className={t.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>{t.price.toFixed(2)}</span>
                        <span className="text-white">{t.amount}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
