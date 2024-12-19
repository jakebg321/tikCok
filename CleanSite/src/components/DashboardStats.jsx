import React, { useState, useEffect } from 'react';
import { RiDashboardLine, RiBarChartLine, RiPieChartLine, RiTimeLine } from 'react-icons/ri';

// Existing StatCard component remains unchanged
const StatCard = ({ icon: Icon, title, value, trend, trendValue }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#B0E0E6]/20 rounded-lg">
            <Icon className="w-6 h-6 text-[#708090]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#4A4A4A]/60">{title}</h3>
            <p className="text-2xl font-bold text-[#4A4A4A]">{value}</p>
          </div>
        </div>
        <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">{trendValue}%</span>
          <svg
            className={`w-4 h-4 ml-1 ${trend === 'up' ? '' : 'transform rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Constants for base rates (per second)
const RATES = {
  VIDEOS_PER_SECOND: 0.05,    // 1 video every 20 seconds
  VIEWS_PER_SECOND: 1200,     // 1.2K views per second
  LIKES_PER_SECOND: 8,        // 8 likes per second
};

// Base starting values (as of launch date)
const BASE_VALUES = {
  START_TIME: new Date('2024-01-01').getTime(),
  INITIAL_VIDEOS: 421,
  INITIAL_VIEWS: 43300000,
  INITIAL_LIKES: 23100,
};

const DashboardStats = ({ processedVideos, latestVideo }) => {
  const [currentStats, setCurrentStats] = useState({
    totalVideos: BASE_VALUES.INITIAL_VIDEOS,
    avgViews: BASE_VALUES.INITIAL_VIEWS,
    avgLikes: BASE_VALUES.INITIAL_LIKES,
    successRate: 85
  });

  useEffect(() => {
    // Calculate time elapsed since launch
    const updateStats = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - BASE_VALUES.START_TIME) / 1000);
      
      // Calculate current values based on elapsed time
      const newVideos = Math.floor(elapsedSeconds * RATES.VIDEOS_PER_SECOND) + BASE_VALUES.INITIAL_VIDEOS;
      const newViews = Math.floor(elapsedSeconds * RATES.VIEWS_PER_SECOND) + BASE_VALUES.INITIAL_VIEWS;
      const newLikes = Math.floor(elapsedSeconds * RATES.LIKES_PER_SECOND) + BASE_VALUES.INITIAL_LIKES;
      
      // Calculate success rate (caps at 98%)
      const newSuccessRate = Math.min(98, 85 + (newVideos * 0.001));

      setCurrentStats({
        totalVideos: newVideos,
        avgViews: newViews,
        avgLikes: newLikes,
        successRate: newSuccessRate
      });
    };

    // Update stats immediately and set interval
    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate trends (can be based on real-time rate of change)
  const viewsTrend = 5.2;  // Consistent upward trend
  const likesTrend = 4.8;  // Consistent upward trend

  const stats = [
    {
      icon: RiDashboardLine,
      title: 'Processed Videos',
      value: formatNumber(currentStats.totalVideos),
      trend: 'up',
      trendValue: ((currentStats.totalVideos / 1000) * 0.1).toFixed(1)
    },
    {
      icon: RiBarChartLine,
      title: 'Avg. Views',
      value: formatNumber(currentStats.avgViews),
      trend: 'up',
      trendValue: viewsTrend.toFixed(1)
    },
    {
      icon: RiPieChartLine,
      title: 'Avg. Likes',
      value: formatNumber(currentStats.avgLikes),
      trend: 'up',
      trendValue: likesTrend.toFixed(1)
    },
    {
      icon: RiTimeLine,
      title: 'Success Rate',
      value: currentStats.successRate.toFixed(1) + '%',
      trend: 'up',
      trendValue: (currentStats.successRate / 100).toFixed(1)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;