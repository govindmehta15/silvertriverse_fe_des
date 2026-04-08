import React from 'react';
import { motion } from 'framer-motion';

/**
 * A ultra-slim, premium sparkline graph for visualizing stock price or reward history.
 * @param {Array<number>} data - Array of numerical values to plot.
 * @param {string} color - The stroke color for the line (hex or tailwind class).
 * @param {string} label - Optional label for the graph.
 * @param {number} height - Default height of the SVG.
 */
export default function StockGraph({ data = [], color = '#10b981', label = '', height = 40 }) {
    if (!data || data.length < 2) {
        return <div className="h-10 flex items-center justify-center text-[10px] text-gray-600 italic">Awaiting data...</div>;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2; // SVG padding
    
    // Normalize data points to fit in 100x40 coordinate space (standardized)
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = padding + (1 - (val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    const pathData = `M ${points}`;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-mono text-white">
                        {data[data.length - 1] > data[0] ? '▲' : '▼'} 
                        {Math.abs(((data[data.length - 1] - data[0]) / (data[0] || 1)) * 100).toFixed(1)}%
                    </span>
                </div>
            )}
            <div className="relative group">
                {/* Background glow path */}
                <svg viewBox={`0 0 100 ${height}`} className="w-full h-full overflow-visible">
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
                    />
                    
                    {/* Fill Area */}
                    <motion.path
                        d={`${pathData} L 100,${height} L 0,${height} Z`}
                        fill={`url(#gradient-${label.replace(/\s+/g, '-')})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />

                    <defs>
                        <linearGradient id={`gradient-${label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Latest Point Indicator */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="absolute right-0 top-0 w-1.5 h-1.5 rounded-full z-10"
                    style={{ 
                        backgroundColor: color, 
                        boxShadow: `0 0 8px ${color}`,
                        top: `${(1 - (data[data.length - 1] - min) / range) * (height - padding * 2) + padding}px`,
                        transform: 'translateY(-50%)'
                    }}
                />
            </div>
        </div>
    );
}
