import { useState, useEffect } from 'react';
import tiktokData from '../data/tiktok_data.json';
import DashboardStats from '../components/DashboardStats';
import TikTokActivity from '../components/TikTokActivity';
import AnimatedHeader from '../components/AnimatedHeader';
import AnimatedBackground from '../components/AnimatedBackground';

const Overview = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [processedVideos, setProcessedVideos] = useState([]);
    const [latestVideo, setLatestVideo] = useState(null);
  
    useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 1024);
      };
      window.addEventListener('resize', handleResize);
      
      setTimeout(() => setIsLoading(false), 1000);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const handleVideoProcessed = (video) => {
      setProcessedVideos(prev => [...prev, video]);
      setLatestVideo(video);
    };
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen ml-0 lg:ml-[15%]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-400/20 border-t-teal-400" />
        </div>
      );
    }
  
    return (
      <div className="min-h-screen">
        {/* Background */}
        <div className={`fixed inset-0 ${isDesktop ? 'ml-[15%]' : 'ml-0'}`}>
          <AnimatedBackground />
        </div>
  
        {/* Content */}
        <div className={`relative ${isDesktop ? 'ml-[15%]' : 'ml-0'}`}>
          <AnimatedHeader />
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-opacity-80 bg-[rgba(11,17,33,0.8)] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-teal-400/10">
              <DashboardStats 
                processedVideos={processedVideos} 
                latestVideo={latestVideo}
              />
            </div>
  
            <div className="mt-4 bg-[rgba(11,17,33,0.8)] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-teal-400/10">
              <TikTokActivity onVideoProcessed={handleVideoProcessed} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Overview;