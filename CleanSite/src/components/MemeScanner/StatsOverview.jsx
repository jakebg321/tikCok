// src/components/MemeScanner/StatsOverview.jsx
import React from 'react';
import { Share2, AlertCircle, RotateCcw, Clock } from 'lucide-react';
import StatsCard from './StatsCard';

const StatsOverview = ({ data }) => {
  const lastUpdated = data?.metadata?.last_updated 
    ? new Date(data.metadata.last_updated).toLocaleString()
    : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard 
        icon={Share2}
        title="Total Memes Tracked"
        value={data?.metadata?.total_memes || 0}
        subtitle={`Last updated: ${lastUpdated}`}
      />
      <StatsCard 
        icon={AlertCircle}
        title="Success Rate"
        value={`${((data?.metadata?.successful / data?.metadata?.total_memes) * 100 || 0).toFixed(1)}%`}
      />
      <StatsCard 
        icon={RotateCcw}
        title="Pages Scraped"
        value={data?.metadata?.pages_scraped || 0}
      />
      <StatsCard 
        icon={Clock}
        title="Processing Time"
        value={`${((Date.now() - new Date(data?.metadata?.last_updated || Date.now())) / 1000).toFixed(1)}s`}
      />
    </div>
  );
};

export default StatsOverview;