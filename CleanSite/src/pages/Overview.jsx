// src/pages/Overview.jsx
import { useState, useEffect } from 'react';
import { RiDashboardLine, RiBarChartLine, RiPieChartLine, RiTimeLine } from 'react-icons/ri';

const StatCard = ({ icon: Icon, title, value, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

const ActivityCard = ({ title, items }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
      <h3 className="text-lg font-bold text-[#4A4A4A] mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 hover:bg-[#F5F5F5] rounded-lg transition-colors duration-200"
          >
            <div className="w-2 h-2 rounded-full bg-[#708090]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#4A4A4A]">{item.description}</p>
              <p className="text-xs text-[#4A4A4A]/60">{item.time}</p>
            </div>
            <span className="text-xs font-medium text-[#708090] bg-[#B0E0E6]/20 px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const stats = [
    {
      icon: RiDashboardLine,
      title: 'Total Scans',
      value: '2,847',
      trend: 'up',
      trendValue: 12.5
    },
    {
      icon: RiBarChartLine,
      title: 'Active Bundles',
      value: '186',
      trend: 'up',
      trendValue: 8.2
    },
    {
      icon: RiPieChartLine,
      title: 'Success Rate',
      value: '94.2%',
      trend: 'up',
      trendValue: 3.1
    },
    {
      icon: RiTimeLine,
      title: 'Avg. Process Time',
      value: '1.2s',
      trend: 'down',
      trendValue: 5.8
    }
  ];

  const recentActivity = {
    title: 'Recent Activity',
    items: [
      {
        description: 'New meme pattern detected',
        time: '2 minutes ago',
        category: 'Detection'
      },
      {
        description: 'Bundle optimization completed',
        time: '15 minutes ago',
        category: 'Bundle'
      },
      {
        description: 'System performance report generated',
        time: '1 hour ago',
        category: 'Report'
      },
      {
        description: 'New algorithm version deployed',
        time: '2 hours ago',
        category: 'Update'
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B0E0E6] border-t-[#708090]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#4A4A4A]">Dashboard Overview</h1>
        <div className="text-sm text-[#4A4A4A]/60">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityCard {...recentActivity} />
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-[#4A4A4A] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {['Scan New Meme', 'Analyze Bundle', 'Generate Report', 'System Status'].map((action, index) => (
              <button
                key={index}
                className="w-full p-3 text-left text-[#4A4A4A] hover:bg-[#B0E0E6]/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#708090]" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;