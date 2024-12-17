import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';

const HolderBubbleMap = ({ data }) => {
    const MAX_BUBBLES = 40;
    const ROTATION_INTERVAL = 30000;
    const [currentCoin, setCurrentCoin] = useState(null);
    const [visibleHolders, setVisibleHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);

    const processHolderData = useCallback((holders) => {
        if (!holders || !Array.isArray(holders)) {
            console.warn('Invalid holders data:', holders);
            return [];
        }

        // Log the incoming data structure
        console.log('Processing holders:', holders);

        const processedHolders = holders
            .filter(holder => holder && holder.address)
            .map((holder, index) => {
                // Calculate position using polar coordinates for better distribution
                const angle = (index / holders.length) * Math.PI * 2;
                const radius = 150; // Base radius for layout
                const centerX = 400;
                const centerY = 300;

                // Calculate bubble size based on percentage
                const percentage = parseFloat(holder.percentage) || 0;
                const bubbleRadius = Math.max(20, Math.min(50, percentage * 2));

                // Add some randomness to prevent overlapping
                const jitter = 20;
                const jitterX = (Math.random() - 0.5) * jitter;
                const jitterY = (Math.random() - 0.5) * jitter;

                return {
                    address: holder.address,
                    percentage: percentage,
                    balance: parseFloat(holder.balance) || 0,
                    x: centerX + (radius * Math.cos(angle)) + jitterX,
                    y: centerY + (radius * Math.sin(angle)) + jitterY,
                    radius: bubbleRadius
                };
            });

        // Log the processed data
        console.log('Processed holders:', processedHolders);
        return processedHolders;
    }, []);

    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        // Select initial coin
        const coin = data.coins_data[0];
        setCurrentCoin(coin);

        // Process holders
        if (coin?.holders) {
            const processed = processHolderData(coin.holders);
            setVisibleHolders(processed);
        }
    }, [data, processHolderData]);

    // Coin rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (data?.coins_data?.length) {
                const randomIndex = Math.floor(Math.random() * data.coins_data.length);
                const newCoin = data.coins_data[randomIndex];
                setCurrentCoin(newCoin);
                
                if (newCoin?.holders) {
                    const processed = processHolderData(newCoin.holders);
                    setVisibleHolders(processed);
                }
            }
        }, ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [data, processHolderData]);

    if (!currentCoin) {
        return <div className="text-matrix-primary font-mono p-8">Loading...</div>;
    }

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-4 left-4 right-4 text-matrix-primary font-mono text-sm z-10">
                <div className="flex justify-between items-center p-4 border border-matrix-primary-30 rounded-lg bg-black/50">
                    <div>
                        <div className="text-lg font-bold">{currentCoin.coin_info?.name}</div>
                        <div>Symbol: {currentCoin.coin_info?.symbol}</div>
                    </div>
                    <div className="text-right">
                        <div>Market Cap: ${currentCoin.coin_info?.market_cap?.toLocaleString()}</div>
                        <div>Price: ${currentCoin.coin_info?.price_usd?.toFixed(8)}</div>
                    </div>
                </div>
            </div>

            <BubbleVisualization 
                visibleHolders={visibleHolders}
                hoveredHolder={hoveredHolder}
                setHoveredHolder={setHoveredHolder}
                centerSymbol={currentCoin.coin_info?.symbol}
            />
        </div>
    );
};

export default HolderBubbleMap;