import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import BubbleVisualization from './BubbleVisualization';
import RadarBackground from './radarBackground';
import { 
    selectRandomCoin,
    processHolderData,
    calculateBubbleLayout,
    formatNumberWithSuffix
} from '../../utils/coinDisplayUtils';

const HolderBubbleMap = ({ data, containerWidth, containerHeight }) => {
    const MAX_BUBBLES = 40;
    const ROTATION_INTERVAL = 30000; // 30 seconds
    const BUBBLE_DELAY = 750; // Delay between bubbles appearing
    
    const [currentCoin, setCurrentCoin] = useState(null);
    const [displayedCoins, setDisplayedCoins] = useState([]);
    const [visibleHolders, setVisibleHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [isAnimatingHolders, setIsAnimatingHolders] = useState(false);

    const processCoin = useCallback((coin) => {
        if (!coin?.holders) return [];
        
        const processedHolders = processHolderData(coin.holders, MAX_BUBBLES);
        const bubblesWithLayout = calculateBubbleLayout(
            processedHolders, 
            containerWidth || 800, 
            containerHeight || 600
        );
        
        return bubblesWithLayout.map(holder => {
            // Ensure each holder has valid coordinates
            if (!holder.x || !holder.y) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 150 + Math.random() * 50;
                return {
                    ...holder,
                    x: 400 + radius * Math.cos(angle),
                    y: 300 + radius * Math.sin(angle),
                    radius: Math.max(30, Math.min(80, holder.percentage * 3))
                };
            }
            return holder;
        });
    }, [containerWidth, containerHeight]);

    const updateDisplayedCoins = useCallback((coinAddress) => {
        if (!coinAddress) return;
        setDisplayedCoins(prev => {
            const updated = [...prev, coinAddress].slice(-10);
            return updated;
        });
    }, []);

    const addHoldersGradually = useCallback((holders) => {
        if (!holders?.length) return;
        
        setVisibleHolders([]);
        setIsAnimatingHolders(true);
        
        const limitedHolders = holders.slice(0, MAX_BUBBLES);
        let isActive = true;
        let currentIndex = 0;

        const addNextHolder = () => {
            if (!isActive || currentIndex >= limitedHolders.length) {
                setIsAnimatingHolders(false);
                return;
            }
            
            setVisibleHolders(prev => [...prev, limitedHolders[currentIndex]]);
            currentIndex++;
            
            if (currentIndex < limitedHolders.length) {
                const timePerHolder = Math.min(
                    BUBBLE_DELAY,
                    (ROTATION_INTERVAL - 2000) / (limitedHolders.length - currentIndex)
                );
                setTimeout(addNextHolder, timePerHolder);
            } else {
                setIsAnimatingHolders(false);
            }
        };

        addNextHolder();
        
        return () => {
            isActive = false;
            setIsAnimatingHolders(false);
        };
    }, []);

    // Initial coin setup
    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        const initialCoin = selectRandomCoin(data.coins_data, []);
        if (initialCoin) {
            setCurrentCoin(initialCoin);
            if (initialCoin.coin_info?.contract_address) {
                updateDisplayedCoins(initialCoin.coin_info.contract_address);
            }
        }
    }, [data, updateDisplayedCoins]);

    // Coin rotation with animation state check
    useEffect(() => {
        if (!data?.coins_data?.length) return;
        
        const rotationInterval = setInterval(() => {
            if (!isAnimatingHolders) {
                const nextCoin = selectRandomCoin(data.coins_data, displayedCoins);
                if (nextCoin) {
                    setCurrentCoin(nextCoin);
                    if (nextCoin.coin_info?.contract_address) {
                        updateDisplayedCoins(nextCoin.coin_info.contract_address);
                    }
                }
            }
        }, ROTATION_INTERVAL);

        return () => clearInterval(rotationInterval);
    }, [data, displayedCoins, isAnimatingHolders, updateDisplayedCoins]);

    // Process current coin's holders
    useEffect(() => {
        if (!currentCoin) return;
        
        setIsProcessing(true);
        try {
            const holders = processCoin(currentCoin);
            if (holders && holders.length > 0) {
                addHoldersGradually(holders);
            }
        } catch (error) {
            console.error('Error processing coin holders:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [currentCoin, processCoin, addHoldersGradually]);

    if (!currentCoin) {
        return (
            <div className="text-matrix-primary font-mono p-8 flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading coin data...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
            {/* Radar Background */}
            <div className="absolute inset-0 z-0">
                <RadarBackground />
            </div>
            
            {/* Coin Info Header */}
            <div className="absolute top-4 left-4 right-4 text-matrix-primary font-mono text-sm z-10 border border-matrix-primary-30 rounded-lg p-4 bg-black/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <motion.div 
                            className="text-lg font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {currentCoin.coin_info.name}
                        </motion.div>
                        <div className="text-matrix-primary-60 text-xs md:text-sm">
                            Symbol: {currentCoin.coin_info.symbol} • 
                            Rank: {currentCoin.coin_info.rank} • 
                            Price: ${currentCoin.coin_info.price_usd.toFixed(8)}
                        </div>
                    </div>
                    <div className="text-right text-xs md:text-sm">
                        <div>Market Cap: ${formatNumberWithSuffix(currentCoin.coin_info.market_cap)}</div>
                        <div>Liquidity: ${formatNumberWithSuffix(currentCoin.coin_info.liquidity_usd)}</div>
                    </div>
                </div>
            </div>
            
            {/* Main Visualization */}
            <div className="w-full h-full">
                <BubbleVisualization 
                    visibleHolders={visibleHolders}
                    hoveredHolder={hoveredHolder}
                    setHoveredHolder={setHoveredHolder}
                    centerSymbol={currentCoin.coin_info.symbol}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                />
            </div>

            {/* Processing Indicator */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 right-4 text-matrix-primary font-mono text-sm bg-black/80 p-2 rounded border border-matrix-primary-30"
                    >
                        <div className="flex items-center gap-2">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                ⟳
                            </motion.span>
                            Processing Data...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Holder Info Panel */}
            <AnimatePresence>
                {hoveredHolder && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 text-matrix-primary font-mono text-xs sm:text-sm bg-black/80 p-2 sm:p-4 rounded border border-matrix-primary-30"
                    >
                        <div>Address: {hoveredHolder}</div>
                        <div>Balance: {visibleHolders.find(h => h.address === hoveredHolder)?.balance.toLocaleString()}</div>
                        <div>Percentage: {visibleHolders.find(h => h.address === hoveredHolder)?.percentage.toFixed(4)}%</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

HolderBubbleMap.propTypes = {
    data: PropTypes.shape({
        coins_data: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number
};

export default HolderBubbleMap;