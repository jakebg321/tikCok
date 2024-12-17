import { useState, useCallback, useEffect, useRef } from 'react';
import tiktokData from '../data/tiktok_data.json';

const SCAN_DURATION = 12000;
const HTML_SCROLL_SPEED = 100;
const STORAGE_KEY = 'tiktok_scanner_state';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
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

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading saved state:', error);
  }
  return { currentIndex: 0, displayedVideos: [] };
};

const TikTokActivity = ({ onVideoProcessed }) => {
  const savedState = loadSavedState();
  const [displayedVideos, setDisplayedVideos] = useState(savedState.displayedVideos);
  const [currentIndex, setCurrentIndex] = useState(savedState.currentIndex);
  const [scanning, setScanning] = useState(false);
  const [discoveredInfo, setDiscoveredInfo] = useState(null);
  const [currentHtmlLine, setCurrentHtmlLine] = useState(0);
  const [foundElements, setFoundElements] = useState(new Set());
  const [displayedHtml, setDisplayedHtml] = useState([]);
  
  const processTimeoutRef = useRef(null);
  const currentVideoRef = useRef(null);

  const saveState = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentIndex,
      displayedVideos
    }));
  }, [currentIndex, displayedVideos]);

  useEffect(() => {
    saveState();
  }, [currentIndex, displayedVideos, saveState]);

  const parseHtmlForDiscovery = useCallback((html) => {
    if (!html) return [];
    return html.split('>').map(line => line.trim() + '>').filter(line => line.length > 1);
  }, []);

  const simulateDiscovery = useCallback((video) => {
    if (!video) return;
    
    setScanning(true);
    setDiscoveredInfo({});
    setFoundElements(new Set());
    setDisplayedHtml([]);
    currentVideoRef.current = video;
    
    const htmlLines = parseHtmlForDiscovery(video.html_elements.full_page_html);
    let currentLine = 0;
    
    const scanInterval = setInterval(() => {
      if (currentLine >= htmlLines.length) {
        clearInterval(scanInterval);
        setScanning(false);
        onVideoProcessed?.(video);
        return;
      }

      setCurrentHtmlLine(currentLine);
      const line = htmlLines[currentLine].toLowerCase();

      // Update displayed HTML
      setDisplayedHtml(prev => [...prev, htmlLines[currentLine]].slice(-10));

      // Progressive element discovery logic
      if (line.includes('<meta')) {
        setFoundElements(prev => new Set([...prev, 'meta']));
      }
      if (line.includes('<video') || line.includes('video-')) {
        setFoundElements(prev => new Set([...prev, 'video_container']));
        setDiscoveredInfo(prev => ({
          ...prev,
          description: video.description,
          author: video.author
        }));
      }
      if (line.includes('script')) {
        setFoundElements(prev => new Set([...prev, 'script']));
      }
      if (line.includes('engagement') || line.includes('like') || line.includes('share')) {
        setFoundElements(prev => {
          const newSet = new Set([...prev]);
          newSet.add('engagement_container');
          newSet.add('like_button');
          newSet.add('share_button');
          return newSet;
        });
        setDiscoveredInfo(prev => ({
          ...prev,
          stats: video.stats
        }));
      }

      currentLine++;
    }, HTML_SCROLL_SPEED);

    return () => clearInterval(scanInterval);
  }, [onVideoProcessed]);

  useEffect(() => {
    if (!tiktokData?.videos?.length) return;

    const processNextVideo = () => {
      if (currentIndex >= tiktokData.videos.length) {
        setCurrentIndex(0);
        return;
      }

      const video = tiktokData.videos[currentIndex];
      simulateDiscovery(video);
      
      processTimeoutRef.current = setTimeout(() => {
        setDisplayedVideos(prev => [{
          ...video,
          foundElements: Array.from(foundElements)
        }, ...prev.slice(0, 4)]);
        setCurrentIndex(prev => prev + 1);
      }, SCAN_DURATION);
    };

    if (!scanning) {
      processNextVideo();
    }

    return () => {
      if (processTimeoutRef.current) clearTimeout(processTimeoutRef.current);
    };
  }, [currentIndex, scanning, simulateDiscovery, foundElements]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-[#4A4A4A] mb-4">Live TikTok Activity</h3>
      
      {scanning && (
        <div className="mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Scanning HTML Structure</span>
          </div>
          
          {/* HTML Scanner */}
          <div className="font-mono text-xs text-gray-500 h-48 overflow-y-auto bg-white p-2 rounded border border-gray-100 scrollbar-hide">
            {displayedHtml.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Waiting for HTML content...
              </div>
            ) : (
              displayedHtml.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`transition-colors duration-200 ${
                    idx === displayedHtml.length - 1 ? 'bg-blue-50 border-l-2 border-blue-400 pl-2' : ''
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>

          {/* Discovered Information */}
          {discoveredInfo && (
            <div className="mt-4 space-y-2">
              {foundElements.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(foundElements).map(element => (
                    <span
                      key={element}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full animate-fade-in"
                    >
                      {element.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}
              {discoveredInfo.description && (
                <p className="text-sm text-gray-700 animate-fade-in">
                  {discoveredInfo.description}
                </p>
              )}
              {discoveredInfo.stats && (
                <div className="text-xs text-gray-600 animate-fade-in">
                  {formatNumber(discoveredInfo.stats.views)} views • {formatNumber(discoveredInfo.stats.likes)} likes
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Activity History */}
      <div className="space-y-4">
        {displayedVideos.map((video) => (
          <div
            key={video.id}
            className="flex items-center space-x-4 p-3 bg-white/80 backdrop-blur-sm hover:bg-[#F5F5F5]/90 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#708090]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#4A4A4A]">
                <span className="font-bold">{video.author.nickname}</span>: {video.description}
              </p>
              <p className="text-xs text-[#4A4A4A]/60">{formatTimeAgo(video.create_time)}</p>
              
              <div className="mt-1 flex flex-wrap gap-2">
                {video.foundElements?.map(element => (
                  <span
                    key={element}
                    className="text-xs px-2 py-1 bg-[#B0E0E6]/20 text-[#708090] rounded-full"
                  >
                    {element.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs font-medium text-[#708090] bg-[#B0E0E6]/20 px-2 py-1 rounded-full">
              {formatNumber(video.stats.views)} views
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TikTokActivity;