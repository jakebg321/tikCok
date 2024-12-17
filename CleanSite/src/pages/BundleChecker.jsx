import React, { useState, useEffect } from 'react';
import HolderBubbleMap from '../components/BubbleMap/HolderBubbleMap';
import { ArrowUpRight } from 'lucide-react';
import cryptoData from '../data/processed_crypto_data.json';

const BundleChecker = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [hoveredHolder, setHoveredHolder] = useState(null); // Add hover state

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

  return (
    <div className={`min-h-screen bg-black text-white ${isDesktop ? 'ml-[240px]' : ''}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-matrix-primary-30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-matrix-primary">Bundle Analysis</h1>
            <button className="flex items-center px-3 py-1.5 rounded border border-matrix-primary-30 hover:bg-matrix-primary/10 transition-colors">
              <span>Export Data</span>
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-8rem)] border border-matrix-primary-30 rounded-lg bg-black/50">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-matrix-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-matrix-primary">Loading bundle data...</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-8rem)] border border-matrix-primary-30 rounded-lg bg-black/50 overflow-hidden">
            <HolderBubbleMap 
              data={data} 
              containerWidth={isDesktop ? window.innerWidth - 240 : window.innerWidth}
              containerHeight={window.innerHeight - 128}
              hoveredHolder={hoveredHolder}
              setHoveredHolder={setHoveredHolder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleChecker;