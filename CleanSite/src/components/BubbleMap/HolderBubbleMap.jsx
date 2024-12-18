import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';
import { 
    selectRandomCoin,
    processHolderData,
    calculateBubbleLayout
} from '../../utils/coinDisplayUtils';

const HolderBubbleMap = ({ data, onCoinChange }) => {
    const MAX_BUBBLES = 40;
    const BUBBLE_DELAY = 150; // Faster holder animation
    const DISPLAY_DURATION = 4000; // Match radar animation duration (4 seconds)
    
    const [currentCoin, setCurrentCoin] = useState(null);
    const [displayedCoins, setDisplayedCoins] = useState([]);
    const [visibleHolders, setVisibleHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);
    const [activeHolderCount, setActiveHolderCount] = useState(0);

    const processCoin = useCallback((coin) => {
        if (!coin?.holders) return [];
        
        const processedHolders = processHolderData(coin.holders, MAX_BUBBLES);
        const bubblesWithLayout = calculateBubbleLayout(processedHolders, 800, 600);
        
        return bubblesWithLayout.map(holder => ({
            ...holder,
            radius: Math.max(30, Math.min(80, holder.percentage * 3))
        }));
    }, []);

    const moveToNextCoin = useCallback(() => {
        if (!data?.coins_data?.length) return;
        
        const nextCoin = selectRandomCoin(data.coins_data, displayedCoins);
        if (nextCoin) {
            setCurrentCoin(nextCoin);
            onCoinChange?.(nextCoin, true); // Add second parameter to indicate new cycle
            setActiveHolderCount(0);
            if (nextCoin.coin_info?.contract_address) {
                setDisplayedCoins(prev => [...prev, nextCoin.coin_info.contract_address].slice(-10));
            }
            const holders = processCoin(nextCoin);
            setVisibleHolders(holders);
        }
    }, [data, displayedCoins, processCoin, onCoinChange]);

    // Initial setup
    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        const initialCoin = selectRandomCoin(data.coins_data, []);
        if (initialCoin) {
            setCurrentCoin(initialCoin);
            onCoinChange?.(initialCoin); // Notify parent
            if (initialCoin.coin_info?.contract_address) {
                setDisplayedCoins([initialCoin.coin_info.contract_address]);
            }
            const holders = processCoin(initialCoin);
            setVisibleHolders(holders);
        }
    }, [data, processCoin, onCoinChange]);

    // Handle holder animation and transition
    useEffect(() => {
        if (!visibleHolders.length) return;

        if (activeHolderCount < visibleHolders.length) {
            const timer = setTimeout(() => {
                setActiveHolderCount(prev => prev + 1);
            }, BUBBLE_DELAY);
            return () => clearTimeout(timer);
        } 
        
        // When all holders are shown, schedule next coin
        if (activeHolderCount === visibleHolders.length) {
            const timer = setTimeout(() => {
                moveToNextCoin();
            }, DISPLAY_DURATION);
            return () => clearTimeout(timer);
        }
    }, [activeHolderCount, visibleHolders, moveToNextCoin]);

    if (!currentCoin) {
        return <div className="text-matrix-primary font-mono p-8">Loading...</div>;
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <BubbleVisualization 
                visibleHolders={visibleHolders.slice(0, activeHolderCount)}
                hoveredHolder={hoveredHolder}
                setHoveredHolder={setHoveredHolder}
                centerSymbol={currentCoin.coin_info?.symbol}
            />
        </div>
    );
};

export default HolderBubbleMap;