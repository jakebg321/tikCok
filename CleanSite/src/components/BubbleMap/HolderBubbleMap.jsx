import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';
import RadarMapBackground from './radarBackground';
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
    const [displayedCoins, setDisplayedCoins] = useState(() => {
        // Initialize with some previous coins if they exist in localStorage
        const savedCoins = localStorage.getItem('displayedCoins');
        return savedCoins ? JSON.parse(savedCoins) : [];
    });
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
                const newDisplayedCoins = [...displayedCoins, nextCoin.coin_info.contract_address].slice(-10);
                setDisplayedCoins(newDisplayedCoins);
                // Save to localStorage for persistence
                localStorage.setItem('displayedCoins', JSON.stringify(newDisplayedCoins));
            }
            const holders = processCoin(nextCoin);
            setVisibleHolders(holders);
        }
    }, [data, displayedCoins, processCoin, onCoinChange]);

    // Initial setup
    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        // Check if we already have displayed coins
        if (displayedCoins.length === 0) {
            const initialCoin = selectRandomCoin(data.coins_data, []);
            if (initialCoin) {
                setCurrentCoin(initialCoin);
                onCoinChange?.(initialCoin);
                if (initialCoin.coin_info?.contract_address) {
                    setDisplayedCoins([initialCoin.coin_info.contract_address]);
                    localStorage.setItem('displayedCoins', JSON.stringify([initialCoin.coin_info.contract_address]));
                }
                const holders = processCoin(initialCoin);
                setVisibleHolders(holders);
            }
        } else {
            // If we have displayed coins, start from the last one
            const lastCoinAddress = displayedCoins[displayedCoins.length - 1];
            const lastCoin = data.coins_data.find(coin => 
                coin.coin_info?.contract_address === lastCoinAddress
            );
            if (lastCoin) {
                setCurrentCoin(lastCoin);
                onCoinChange?.(lastCoin);
                const holders = processCoin(lastCoin);
                setVisibleHolders(holders);
            } else {
                // If we can't find the last coin, start fresh
                moveToNextCoin();
            }
        }
    }, [data, processCoin, onCoinChange, moveToNextCoin, displayedCoins]);

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
            <RadarMapBackground />
            <div className="absolute inset-0">
                <BubbleVisualization 
                    visibleHolders={visibleHolders.slice(0, activeHolderCount)}
                    hoveredHolder={hoveredHolder}
                    setHoveredHolder={setHoveredHolder}
                    centerSymbol={currentCoin.coin_info?.symbol}
                />
            </div>
        </div>
    );
};

export default HolderBubbleMap;