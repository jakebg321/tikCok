import React, { useState, useEffect } from 'react';
import HolderBubbleMap from '../components/BubbleMap/HolderBubbleMap';
import cryptoData from '../data/processed_crypto_data.json';

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
    setCurrentCoin(coin);
  };

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      <div className="flex h-screen"> {/* Changed to h-screen */}
        {/* Main Content */}
        <div className="flex-1 h-screen"> {/* Added h-screen */}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-matrix-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-matrix-primary">Loading bundle data...</p>
              </div>
            </div>
          ) : (
            <div className="h-screen"> {/* Changed to h-screen */}
              <HolderBubbleMap 
                data={data} 
                containerWidth={window.innerWidth - 300}
                containerHeight={window.innerHeight}
                hoveredHolder={hoveredHolder}
                setHoveredHolder={setHoveredHolder}
                onCoinChange={handleCoinChange}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] h-screen border-l border-matrix-primary-30 bg-black/50 backdrop-blur-sm"> {/* Changed h-full to h-screen */}
          <div className="h-full p-6"> {/* Removed flex flex-col */}
            {/* Coin Info */}
            <div className="flex justify-between items-center p-4 border border-matrix-primary-30 rounded-lg bg-black/50">
              <div>
                <div className="text-lg font-bold text-matrix-primary">{currentCoin?.coin_info?.name || 'Loading...'}</div>
                <div>Symbol: {currentCoin?.coin_info?.symbol}</div>
              </div>
              <div className="text-right">
                <div>Market Cap: ${currentCoin?.coin_info?.market_cap?.toLocaleString()}</div>
                <div>Price: ${currentCoin?.coin_info?.price_usd?.toFixed(8)}</div>
              </div>
            </div>

   
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleChecker;