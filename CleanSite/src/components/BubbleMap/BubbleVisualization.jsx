import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const BubbleVisualization = ({ 
    visibleHolders = [], 
    hoveredHolder, 
    setHoveredHolder,
    centerSymbol 
}) => {
    // Add more detailed debug logging
    useEffect(() => {

    }, [visibleHolders]);

    // Remove or modify these checks that might be preventing rendering
    if (visibleHolders.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-matrix-primary font-mono">
                Waiting for holder data...
            </div>
        );
    }

    // Scale the constants based on the number of holders
    const CONSTANTS = {
        CENTER_X: 400,
        CENTER_Y: 300,
        HUB_RADIUS: 40,
        MAX_RADIUS: 200,
        MIN_RADIUS: 100
    };

    // Make sure we have valid holders with all required properties
    const validHolders = visibleHolders.filter(holder => 
        holder && 
        typeof holder.x === 'number' && 
        typeof holder.y === 'number' && 
        typeof holder.percentage === 'number' &&
        holder.address
    );

    // Get top 5 holders by percentage for special display
    const topHolders = [...validHolders]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

    const calculateConnectionPoints = (holder) => {
        const angle = Math.atan2(holder.y - CONSTANTS.CENTER_Y, holder.x - CONSTANTS.CENTER_X);
        const holderRadius = Math.max(30, Math.min(80, holder.percentage * 3));
        
        const startX = CONSTANTS.CENTER_X + CONSTANTS.HUB_RADIUS * Math.cos(angle);
        const startY = CONSTANTS.CENTER_Y + CONSTANTS.HUB_RADIUS * Math.sin(angle);
        const endX = holder.x - holderRadius * Math.cos(angle);
        const endY = holder.y - holderRadius * Math.sin(angle);
        
        return { startX, startY, endX, endY };
    };

    return (
        <svg 
            className="w-full h-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="line-gradient" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--matrix-primary)" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--matrix-primary)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--matrix-primary)" stopOpacity="0.1" />
                </linearGradient>

                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="blur" in2="SourceGraphic" operator="over" />
                </filter>
            </defs>

            {/* Background rings */}
            {[1, 2, 3].map((ring) => (
                <circle
                    key={`ring-${ring}`}
                    cx={CONSTANTS.CENTER_X}
                    cy={CONSTANTS.CENTER_Y}
                    r={ring * (CONSTANTS.MAX_RADIUS / 3)}
                    fill="none"
                    stroke="var(--matrix-primary)"
                    strokeWidth="1"
                    opacity="0.2"
                    filter="url(#glow)"
                />
            ))}

            {/* Pulsating radar ring */}
            <motion.circle
                cx="400"
                cy="300"
                r="40"
                className="fill-none stroke-matrix-primary"
                initial={{ r: CONSTANTS.HUB_RADIUS, opacity: 0.8 }}
                animate={{ 
                    r: [CONSTANTS.HUB_RADIUS, 280],
                    opacity: [0.8, 0],
                    strokeWidth: [2, 0.5]
                }}
                transition={{ 
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity,
                }}
            />

            {/* Draw connections for top holders */}
            {topHolders.map((holder, index) => {
                const points = calculateConnectionPoints(holder);
                const pathId = `connection-path-${index}`;
                
                return (
                    <g key={`connection-${holder.address}-${index}`}>
                        {/* Base connection line */}
                        <path
                            id={pathId}
                            d={`M ${points.startX} ${points.startY} L ${points.endX} ${points.endY}`}
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            opacity="0.3"
                            fill="none"
                            filter="url(#glow)"
                        />
                        
                        {/* Animated dot along the connection */}
                        <motion.circle
                            cx={points.startX}
                            cy={points.startY}
                            r="4"
                            fill="var(--matrix-primary)"
                            filter="url(#glow)"
                            initial={{ 
                                x: 0,
                                y: 0 
                            }}
                            animate={{
                                x: [0, points.endX - points.startX],
                                y: [0, points.endY - points.startY]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: index * 0.2
                            }}
                        />
                    </g>
                );
            })}

            {/* Debug circle to verify SVG rendering */}
            <circle
                cx="400"
                cy="300"
                r="5"
                fill="red"
                opacity="0.5"
            />

            {/* Holder Bubbles */}
            <AnimatePresence>
                {validHolders.map((holder, index) => {
                    const bubbleRadius = Math.max(20, Math.min(80, holder.percentage * 3));
                    const isTopHolder = topHolders.includes(holder);

                    return (
                        <motion.g
                            key={`bubble-${holder.address}-${index}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.03 }}
                            onMouseEnter={() => setHoveredHolder(holder.address)}
                            onMouseLeave={() => setHoveredHolder(null)}
                            style={{ transformOrigin: `${holder.x}px ${holder.y}px` }}
                        >
                            {/* Holder bubble */}
                            <circle
                                cx={holder.x}
                                cy={holder.y}
                                r={bubbleRadius}
                                fill="none"
                                stroke="var(--matrix-primary)"
                                strokeWidth={isTopHolder ? 2 : 1}
                                opacity={isTopHolder ? 0.8 : 0.3}
                                filter="url(#glow)"
                            />
                            
                            {/* Percentage text */}
                            <text
                                x={holder.x}
                                y={holder.y}
                                fill="var(--matrix-primary)"
                                fontSize="12"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="font-mono"
                                filter="url(#glow)"
                            >
                                {`${holder.percentage.toFixed(2)}%`}
                            </text>
                        </motion.g>
                    );
                })}
            </AnimatePresence>

            {/* Center Hub */}
            <g filter="url(#glow)">
                {/* Pulsating radar ring */}
                <motion.circle
                    cx={CONSTANTS.CENTER_X}
                    cy={CONSTANTS.CENTER_Y}
                    r={CONSTANTS.HUB_RADIUS}
                    className="fill-none stroke-matrix-primary"
                    initial={{ r: CONSTANTS.HUB_RADIUS, opacity: 0.8 }}
                    animate={{ 
                        r: [CONSTANTS.HUB_RADIUS, 280],
                        opacity: [0.8, 0],
                        strokeWidth: [2, 0.5]
                    }}
                    transition={{ 
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
                <motion.circle
                    cx={CONSTANTS.CENTER_X}
                    cy={CONSTANTS.CENTER_Y}
                    r={CONSTANTS.HUB_RADIUS}
                    fill="none"
                    stroke="var(--matrix-primary)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <text
                    x={CONSTANTS.CENTER_X}
                    y={CONSTANTS.CENTER_Y}
                    fill="var(--matrix-primary)"
                    fontSize="14"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono"
                >
                    {centerSymbol}
                </text>
            </g>

            {/* Hover info panel */}
            <AnimatePresence>
                {hoveredHolder && (
                    <foreignObject
                        x={10}
                        y={550}
                        width={300}
                        height={100}
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-matrix-primary font-mono text-sm bg-black/80 p-4 rounded border border-matrix-primary-30"
                        >
                            <div>Address: {hoveredHolder}</div>
                            <div>Balance: {validHolders.find(h => h.address === hoveredHolder)?.balance.toLocaleString()}</div>
                            <div>Percentage: {validHolders.find(h => h.address === hoveredHolder)?.percentage.toFixed(4)}%</div>
                        </motion.div>
                    </foreignObject>
                )}
            </AnimatePresence>
        </svg>
    );
};

BubbleVisualization.propTypes = {
    visibleHolders: PropTypes.arrayOf(PropTypes.shape({
        address: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })).isRequired,
    hoveredHolder: PropTypes.string,
    setHoveredHolder: PropTypes.func.isRequired,
    centerSymbol: PropTypes.string.isRequired
};

export default BubbleVisualization;