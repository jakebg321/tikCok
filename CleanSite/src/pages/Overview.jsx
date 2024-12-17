import { useState, useEffect } from 'react';
import TikTokActivity from '../components/TikTokActivity';
import YouTubeActivity from '../components/YouTubeActivity';
import AnimatedHeader from '../components/header/AnimatedHeader';
import AnimatedBackground from '../components/AnimatedBackground';

const Overview = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [processedTikTokVideos, setProcessedTikTokVideos] = useState([]);
    const [processedYouTubeVideos, setProcessedYouTubeVideos] = useState([]);
  
    useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 1024);
      };
      window.addEventListener('resize', handleResize);
      
      setTimeout(() => setIsLoading(false), 1000);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const handleTikTokVideoProcessed = (video) => {
      setProcessedTikTokVideos(prev => [...prev, video]);
    };

    const handleYouTubeVideoProcessed = (video) => {
      setProcessedYouTubeVideos(prev => [...prev, video]);
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
        <div className={`fixed inset-0 ${isDesktop ? 'ml-[15%]' : 'ml-0'}`}>
          <AnimatedBackground />
        </div>
  
        <div className={`relative ${isDesktop ? 'ml-[15%]' : 'ml-0'}`}>
          <AnimatedHeader />
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TikTokActivity onVideoProcessed={handleTikTokVideoProcessed} />
              <YouTubeActivity onVideoProcessed={handleYouTubeVideoProcessed} />
            </div>
          </div>
        </div>
      </div>
    );
};

export default Overview;