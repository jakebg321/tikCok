import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';
import RadarMapBackground from './radarBackground';
import { processHolderData, calculateBubbleLayout } from '../../utils/coinDisplayUtils';
import coinStateManager from '../../server/CoinStateManager';

const HolderBubbleMap = ({ data, onCoinChange }) => {
    const MAX_BUBBLES = 40;
    const BUBBLE_DELAY = 150;
    
    const [visibleHolders, setVisibleHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);
    const [activeHolderCount, setActiveHolderCount] = useState(0);
    const [currentDisplayCoin, setCurrentDisplayCoin] = useState(null);

    const processCoin = useCallback((coin) => {
        if (!coin?.holders) return [];
        
        const processedHolders = processHolderData(coin.holders, MAX_BUBBLES);
        const bubblesWithLayout = calculateBubbleLayout(processedHolders, 800, 600);
        
        return bubblesWithLayout.map(holder => ({
            ...holder,
            radius: Math.max(30, Math.min(80, holder.percentage * 3))
        }));
    }, []);

    // Subscribe to CoinStateManager updates
    useEffect(() => {
        const handleCoinUpdate = ({ currentCoin: newCoin }) => {
            if (newCoin && (!currentDisplayCoin || newCoin.coin_info?.contract_address !== currentDisplayCoin.coin_info?.contract_address)) {
                setCurrentDisplayCoin(newCoin);
                onCoinChange?.(newCoin, true);
                const holders = processCoin(newCoin);
                setVisibleHolders(holders);
                setActiveHolderCount(0);
            }
        };

        const unsubscribe = coinStateManager.subscribe(handleCoinUpdate);

        return () => unsubscribe();
    }, [currentDisplayCoin, onCoinChange, processCoin]);

    // Handle holder animation
    useEffect(() => {
        if (!visibleHolders.length) return;

        if (activeHolderCount < visibleHolders.length) {
            const timer = setTimeout(() => {
                setActiveHolderCount(prev => prev + 1);
            }, BUBBLE_DELAY);
            return () => clearTimeout(timer);
        }
    }, [activeHolderCount, visibleHolders]);

    if (!currentDisplayCoin) {
        return <div className="text-matrix-primary font-mono p-8">Loading...</div>;
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <RadarMapBackground />
            <div className="absolute inset-0">
                <BubbleVisualization 
                    visibleHolders={visibleHolders.slice(0, activeHolderCount)}
                    hoveredHolder={hoveredHolder}
                    setHoveredHolder={setHoveredHolder}
                    centerSymbol={currentDisplayCoin.coin_info?.symbol}
                />
            </div>
        </div>
    );
};

export default HolderBubbleMap;