import { RiDashboardLine, RiBarChartLine, RiPieChartLine, RiTimeLine } from 'react-icons/ri';

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

const DashboardStats = ({ processedVideos, latestVideo }) => {
  // Calculate stats based on processed videos
  const totalVideos = processedVideos.length + 421; // Start with 421 processed videos
  const baseAvgViews = 43300000; // 43.3M base views
  const baseAvgLikes = 23100; // 23.1K base likes
  
  const avgViews = Math.floor(
    (processedVideos.reduce((sum, video) => sum + video.stats.views, 0) / (processedVideos.length || 1)) + baseAvgViews
  );
  const avgLikes = Math.floor(
    (processedVideos.reduce((sum, video) => sum + video.stats.likes, 0) / (totalVideos || 1)) + baseAvgLikes
  );
  
  // Calculate success rate (simulated)
  const successRate = Math.min(98, 85 + (totalVideos * 2));
  
  // Calculate trends based on the latest video
  const viewsTrend = latestVideo ? 
    ((latestVideo.stats.views / avgViews) - 1) * 100 : 0;
  const likesTrend = latestVideo ?
    ((latestVideo.stats.likes / avgLikes) - 1) * 100 : 0;

  const stats = [
    {
      icon: RiDashboardLine,
      title: 'Processed Videos',
      value: totalVideos.toString(),
      trend: 'up',
      trendValue: ((totalVideos / 5) * 100).toFixed(1)
    },
    {
      icon: RiBarChartLine,
      title: 'Avg. Views',
      value: formatNumber(avgViews),
      trend: viewsTrend >= 0 ? 'up' : 'down',
      trendValue: Math.abs(viewsTrend).toFixed(1)
    },
    {
      icon: RiPieChartLine,
      title: 'Avg. Likes',
      value: formatNumber(avgLikes),
      trend: likesTrend >= 0 ? 'up' : 'down',
      trendValue: Math.abs(likesTrend).toFixed(1)
    },
    {
      icon: RiTimeLine,
      title: 'Success Rate',
      value: successRate.toFixed(1) + '%',
      trend: 'up',
      trendValue: (successRate / 100).toFixed(1)
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