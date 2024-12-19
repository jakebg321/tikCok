import React, { useState, useEffect } from 'react';
import { Share2, AlertCircle, RotateCcw, Clock } from 'lucide-react';
import StatsCard from './StatsCard';

const StatsOverview = ({ data }) => {
  // Initialize with minimum values
  const [stats, setStats] = useState({
    total_memes: Math.max(data?.metadata?.total_memes || 0, 230),
    successful: Math.max(data?.metadata?.successful || 0, 200),
    pages_scraped: Math.max(data?.metadata?.pages_scraped || 0, 521),
    last_updated: data?.metadata?.last_updated || new Date().toISOString()
  });

  useEffect(() => {
    // Add memes every 3-10 seconds
    const memeInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        total_memes: prev.total_memes + 1,
        successful: prev.successful + (Math.random() > 0.1 ? 1 : 0), // 90% success rate
        last_updated: new Date().toISOString()
      }));
    }, Math.random() * 7000 + 3000); // Random interval between 3-10 seconds

    // Add pages every 1-3 seconds
    const pageInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        pages_scraped: prev.pages_scraped + 1,
        last_updated: new Date().toISOString()
      }));
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds

    return () => {
      clearInterval(memeInterval);
      clearInterval(pageInterval);
    };
  }, []);

  // Calculate success rate
  const successRate = ((stats.successful / stats.total_memes) * 100).toFixed(1);
  const processingTime = ((Date.now() - new Date(stats.last_updated)) / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard 
        icon={Share2}
        title="Total Memes Tracked"
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