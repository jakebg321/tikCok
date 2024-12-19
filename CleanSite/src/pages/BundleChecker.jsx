import React, { useState, useEffect } from 'react';
import HolderBubbleMap from '../components/BubbleMap/HolderBubbleMap';
import cryptoData from '../data/processed_crypto_data.json';
import AnimatedBackground from '../components/AnimatedBackground';
import coinStateManager from '../server/CoinStateManager';

const BundleChecker = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [hoveredHolder, setHoveredHolder] = useState(null);
  const [currentCoin, setCurrentCoin] = useState(null);
  const [previousCoins, setPreviousCoins] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(cryptoData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to coin state changes
    const unsubscribe = coinStateManager.subscribe(({ currentCoin: newCoin, previousCoins: newPreviousCoins }) => {
      setCurrentCoin(newCoin);
      setPreviousCoins(newPreviousCoins);
    });

    return () => unsubscribe();
  }, []);

  const handleCoinChange = (coin, isNewCycle) => {
    if (isNewCycle) {
      setCurrentCoin(coin);
    }
  };

  return (
    <div className="fixed inset-0 lg:ml-[240px] overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 z-20 flex">
        {/* Main Content Area with Header */}
        <div className="flex-1 flex flex-col">
          {/* Header Section */}
          <div className="p-8 pb-4">
            <h1 className="text-4xl font-bold text-white text-matrix-primary">Bundle Checker</h1>
            <p className="text-matrix-primary-80 text-white  mt-2">Real-time token holder analysis</p>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-2 border-matrix-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-matrix-primary">Loading bundle data...</p>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <HolderBubbleMap 
                  data={data} 
                  containerWidth={window.innerWidth - 540}
                  containerHeight={window.innerHeight}
                  hoveredHolder={hoveredHolder}
                  setHoveredHolder={setHoveredHolder}
                  onCoinChange={handleCoinChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] border-l border-matrix-primary-30 backdrop-blur-sm">
          <div className="h-full p-6 space-y-4">
            {[currentCoin, ...previousCoins].map((coin, index) => (
              coin && <div 
                key={`${coin.coin_info?.symbol}-${index}`}
                className={`flex flex-col p-4 border border-matrix-primary-30 rounded-lg bg-black/30 ${
                  index === 0 ? 'border-matrix-primary' : ''
                }`}
              >
                <div className="text-sm font-bold text-white mb-2">
                  {coin.coin_info?.name || 'Unknown'}
                </div>
                <div className="text-xs text-white mb-1">
                  Symbol: {coin.coin_info?.symbol || 'N/A'}
                </div>
                <div className="text-xs text-white mb-1">
                  Market Cap: ${coin.coin_info?.market_cap?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-xs text-white">
                  Price: ${coin.coin_info?.price_usd?.toFixed(8) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleChecker;