import React, { useState, useEffect, useRef } from 'react';
import { RiDashboardLine, RiBarChartLine, RiPieChartLine, RiTimeLine } from 'react-icons/ri';
import { statsManager } from '../server/StatsStateManager';

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

const DashboardStats = () => {
  const [stats, setStats] = useState([]);
  const statsRef = useRef(null);

  useEffect(() => {
    // Get initial stats
    if (!statsRef.current) {
      console.log('[DashboardStats] Initial stats load');
      statsRef.current = statsManager.getStats();
      const trends = statsManager.getTrends();
      
      const initialStats = [
        {
          icon: RiDashboardLine,
          title: 'Processed Videos',
          value: statsRef.current.formattedStats.videos,
          trend: 'up',
          trendValue: trends.videos
        },
        {
          icon: RiBarChartLine,
          title: 'Avg. Views',
          value: statsRef.current.formattedStats.views,
          trend: 'up',
          trendValue: trends.views
        },
        {
          icon: RiPieChartLine,
          title: 'Avg. Likes',
          value: statsRef.current.formattedStats.likes,
          trend: 'up',
          trendValue: trends.likes
        },
        {
          icon: RiTimeLine,
          title: 'Success Rate',
          value: statsRef.current.formattedStats.successRate,
          trend: 'up',
          trendValue: trends.successRate
        }
      ];

      setStats(initialStats);
    }

    const interval = setInterval(() => {
      const currentStats = statsManager.getStats();
      
      // Only update if values actually changed
      if (JSON.stringify(currentStats) !== JSON.stringify(statsRef.current)) {
        console.log('[DashboardStats] Stats changed, updating');
        statsRef.current = currentStats;
        const trends = statsManager.getTrends();
        
        setStats([
          {
            icon: RiDashboardLine,
            title: 'Processed Videos',
            value: currentStats.formattedStats.videos,
            trend: 'up',
            trendValue: trends.videos
          },
          {
            icon: RiBarChartLine,
            title: 'Avg. Views',
            value: currentStats.formattedStats.views,
            trend: 'up',
            trendValue: trends.views
          },
          {
            icon: RiPieChartLine,
            title: 'Avg. Likes',
            value: currentStats.formattedStats.likes,
            trend: 'up',
            trendValue: trends.likes
          },
          {
            icon: RiTimeLine,
            title: 'Success Rate',
            value: currentStats.formattedStats.successRate,
            trend: 'up',
            trendValue: trends.successRate
          }
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log('[DashboardStats] Rendering with stats:', stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default React.memo(DashboardStats);