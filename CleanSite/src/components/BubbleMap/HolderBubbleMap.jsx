import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleVisualization from './BubbleVisualization';

const HolderBubbleMap = ({ data, onCoinChange }) => {
    const MAX_BUBBLES = 40;
    const ROTATION_INTERVAL = 30000;
    const CENTER_BUFFER = 40; // minimum distance from center
    const [currentCoin, setCurrentCoin] = useState(null);
    const [visibleHolders, setVisibleHolders] = useState([]);
    const [activeHolderCount, setActiveHolderCount] = useState(0);
    const [hoveredHolder, setHoveredHolder] = useState(null);

    const processHolderData = useCallback((holders) => {
        if (!holders || !Array.isArray(holders)) {
            console.warn('Invalid holders data:', holders);
            return [];
        }

        const maxRadius = 212.5; // Reduced by 15% from original 250
        const processedHolders = [];

        const checkCollision = (newHolder, existingHolders) => {
            for (const existing of existingHolders) {
                const dx = newHolder.x - existing.x;
                const dy = newHolder.y - existing.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < (newHolder.radius + existing.radius)) {
                    return true;
                }
            }
            return false;
        };

        holders
            .filter(holder => holder && holder.address)
            .forEach((holder, index) => {
                const percentage = parseFloat(holder.percentage) || 0;
                // Reduce bubble size by 50%
                const bubbleRadius = Math.max(7, Math.min(7.5, percentage * 0.7));

                let validPosition = false;
                let attempts = 0;
                let holderData;

                while (!validPosition && attempts < 50) {
                    const angle = Math.random() * Math.PI * 2;
                    const minRadius = CENTER_BUFFER + 50;
                    const radius = minRadius + Math.random() * (maxRadius - minRadius);
                    const centerX = 400;
                    const centerY = 300;

                    holderData = {
                        address: holder.address,
                        percentage: percentage,
                        balance: parseFloat(holder.balance) || 0,
                        x: centerX + (radius * Math.cos(angle)),
                        y: centerY + (radius * Math.sin(angle)),
                        radius: bubbleRadius,
                        delay: index * 0.5
                    };

                    if (!checkCollision(holderData, processedHolders)) {
                        validPosition = true;
                    }
                    attempts++;
                }

                if (holderData) {
                    processedHolders.push(holderData);
                }
            });

        return processedHolders;
    }, []);

    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        setActiveHolderCount(0); // Reset counter when new data arrives
        const coin = data.coins_data[0];
        setCurrentCoin(coin);
        onCoinChange?.(coin); // Send coin data to parent

        if (coin?.holders) {
            const processed = processHolderData(coin.holders);
            setVisibleHolders(processed);
        }
    }, [data, processHolderData, onCoinChange]);

    // Add effect for incrementing visible holders
    useEffect(() => {
        if (activeHolderCount < visibleHolders.length) {
            const timer = setTimeout(() => {
                setActiveHolderCount(prev => prev + 1);
            }, 500); // Adjust timing as needed
            return () => clearTimeout(timer);
        }
    }, [activeHolderCount, visibleHolders]);

    // Modify coin rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (data?.coins_data?.length) {
                setActiveHolderCount(0); // Reset counter
                const randomIndex = Math.floor(Math.random() * data.coins_data.length);
                const newCoin = data.coins_data[randomIndex];
                setCurrentCoin(newCoin);
                onCoinChange?.(newCoin); // Send coin data to parent
                
                if (newCoin?.holders) {
                    const processed = processHolderData(newCoin.holders);
                    setVisibleHolders(processed);
                }
            }
        }, ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [data, processHolderData, onCoinChange]);

    if (!currentCoin) {
        return <div className="text-matrix-primary font-mono p-8">Loading...</div>;
    }

    return (
        <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
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