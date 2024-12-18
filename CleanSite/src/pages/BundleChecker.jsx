import React, { useState, useEffect } from 'react';
import HolderBubbleMap from '../components/BubbleMap/HolderBubbleMap';
import cryptoData from '../data/processed_crypto_data.json';
import AnimatedBackground from '../components/AnimatedBackground';

const BundleChecker = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [hoveredHolder, setHoveredHolder] = useState(null); // Add hover state
  const [currentCoin, setCurrentCoin] = useState(null);

  // Handle window resize and desktop detection
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
  }, []);

  const handleCoinChange = (coin) => {
    console.log('Coin changed:', coin); // Add debug logging
    setCurrentCoin(coin);
  };

  return (
    <div className="min-h-screen lg:ml-[240px]">
      <AnimatedBackground />
      <div className="relative z-20 h-screen">
        <div className="h-full flex">
          {/* Main Content */}
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
                  containerWidth={window.innerWidth - 540} // 240 for navbar + 300 for sidebar
                  containerHeight={window.innerHeight}
                  hoveredHolder={hoveredHolder}
                  setHoveredHolder={setHoveredHolder}
                  onCoinChange={handleCoinChange}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-[300px] h-full border-l border-matrix-primary-30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex flex-col p-4 border border-matrix-primary-30 rounded-lg bg-black/30">
                {currentCoin ? (
                  <>
                    <div className="text-lg font-bold text-matrix-primary mb-2">
                      {currentCoin.coin_info?.name || 'Unknown'}
                    </div>
                    <div className="text-matrix-primary-80 mb-1">
                      Symbol: {currentCoin.coin_info?.symbol || 'N/A'}
                    </div>
                    <div className="text-matrix-primary-80 mb-1">
                      Market Cap: ${currentCoin.coin_info?.market_cap?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-matrix-primary-80">
                      Price: ${currentCoin.coin_info?.price_usd?.toFixed(8) || 'N/A'}
                    </div>
                  </>
                ) : (
                  <div className="text-matrix-primary">Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleChecker;