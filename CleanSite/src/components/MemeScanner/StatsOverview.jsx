import React, { useState, useEffect } from 'react';
import { Share2, AlertCircle, RotateCcw, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import { statsManager } from '../../server/StatsStateManager';

const StatsOverview = ({ data }) => {
  const [stats, setStats] = useState({
    total_memes: 0,
    successful: 0,
    pages_scraped: 0,
    last_updated: new Date().toISOString()
  });

  useEffect(() => {
    
    const updateStats = () => {
      const currentStats = statsManager.getStats();
      console.log('[StatsOverview] Got new stats:', currentStats);
      
      setStats({
        total_memes: currentStats.videos,
        successful: Math.floor(currentStats.videos * 0.9), 
        pages_scraped: Math.floor(currentStats.views / 1000), 
        last_updated: new Date().toISOString()
      });
    };

    // Update immediately and then every second
    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate success rate
  const successRate = ((stats.successful / stats.total_memes) * 100).toFixed(1);
  const processingTime = ((Date.now() - new Date(stats.last_updated)) / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard 
        icon={Share2}
        title="Total Memes Found"
        value={stats.total_memes}
        subtitle={`Last updated: ${new Date(stats.last_updated).toLocaleString()}`}
      />
      <StatsCard 
        icon={AlertCircle}
        title="Success Rate"
        value={`${successRate}%`}
      />
      <StatsCard 
        icon={RotateCcw}
        title="Pages Scraped"
        value={stats.pages_scraped}
      />
      <StatsCard 
        icon={Clock}
        title="Processing Time"
        value={`${processingTime}s`}
      />
    </div>
  );
};

export default StatsOverview;