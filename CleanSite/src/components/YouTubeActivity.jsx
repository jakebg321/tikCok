import { useState, useCallback, useEffect, useRef } from 'react';
import youtubeData from '../data/youtube_data1.json';

const SCAN_DURATION = 12000;
const HTML_SCROLL_SPEED = 100;
const STORAGE_KEY = 'youtube_scanner_state';

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

const YouTubeActivity = ({ onVideoProcessed }) => {
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
  const nextIndexRef = useRef(currentIndex);

  const saveState = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentIndex,
      displayedVideos: displayedVideos.slice(0, 4)
    }));
  }, [currentIndex, displayedVideos]);

  useEffect(() => {
    saveState();
  }, [currentIndex, displayedVideos, saveState]);

  useEffect(() => {
    console.log('Current Index:', currentIndex);
    console.log('Total Videos:', youtubeData?.videos?.length);
    console.log('Is Scanning:', scanning);
  }, [currentIndex, scanning]);

  const parseHtmlForDiscovery = useCallback((html) => {
    if (!html) return [];
    return html.split('>').map(line => line.trim() + '>').filter(line => line.length > 1);
  }, []);

  const simulateDiscovery = useCallback((video) => {
    if (!video) {
      console.log('No video provided to simulateDiscovery');
      return;
    }
    
    console.log('Starting discovery for video:', video.id);
    setScanning(true);
    setDiscoveredInfo({});
    setFoundElements(new Set());
    setDisplayedHtml([]);
    currentVideoRef.current = video;
    
    const htmlLines = parseHtmlForDiscovery(video.html_elements.view_count_element);
    console.log('Total HTML lines to process:', htmlLines.length);
    let currentLine = 0;
    
    const scanInterval = setInterval(() => {
      if (currentLine >= htmlLines.length) {
        console.log('Finished processing HTML for video:', video.id);
        clearInterval(scanInterval);
        
        const processedVideo = {
          ...video,
          stats: {
            views: video.statistics.views,
            likes: video.statistics.likes,
            shares: video.statistics.shares,
            comments: video.statistics.comments || 0
          },
          foundElements: Array.from(foundElements),
          processedAt: Date.now() // Add timestamp to ensure uniqueness
        };

        // Remove any existing instance of this video and add the new one
        setDisplayedVideos(prev => {
          const filteredVideos = prev.filter(v => v.id !== video.id);
          return [processedVideo, ...filteredVideos].slice(0, 4);
        });
        
        onVideoProcessed?.(processedVideo);

        const nextIndex = (nextIndexRef.current + 1) % youtubeData.videos.length;
        nextIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        setScanning(false);
        return;
      }

      setCurrentHtmlLine(currentLine);
      const line = htmlLines[currentLine].toLowerCase();

      setDisplayedHtml(prev => [...prev, htmlLines[currentLine]].slice(-10));

      // Progressive element discovery logic specific to YouTube
      if (line.includes('schema.org/videoobject')) {
        setFoundElements(prev => new Set([...prev, 'video_metadata']));
      }
      if (line.includes('interactioncount')) {
        setFoundElements(prev => new Set([...prev, 'view_count']));
        setDiscoveredInfo(prev => ({
          ...prev,
          views: video.statistics.views
        }));
      }
      if (line.includes('duration')) {
        setFoundElements(prev => new Set([...prev, 'duration']));
      }
      if (line.includes('author') || line.includes('channel')) {
        setFoundElements(prev => {
          const newSet = new Set([...prev]);
          newSet.add('channel_info');
          return newSet;
        });
        setDiscoveredInfo(prev => ({
          ...prev,
          author: video.author,
          statistics: video.statistics
        }));
      }

      currentLine++;
    }, HTML_SCROLL_SPEED);

    return () => clearInterval(scanInterval);
  }, [onVideoProcessed]);

  useEffect(() => {
    if (!youtubeData?.videos?.length) {
      console.log('No YouTube videos available');
      return;
    }

    const processNextVideo = () => {
      console.log('Processing next video. Current index:', currentIndex);
      const video = youtubeData.videos[currentIndex];
      console.log('Selected video:', video.id, video.desc.substring(0, 50) + '...');
      simulateDiscovery(video);
    };

    if (!scanning) {
      console.log('Not currently scanning, starting next video process');
      processNextVideo();
    } else {
      console.log('Scanning in progress, waiting...');
    }

    return () => {
      if (processTimeoutRef.current) {
        console.log('Cleaning up timeout');
        clearTimeout(processTimeoutRef.current);
      }
    };
  }, [currentIndex, scanning, simulateDiscovery]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-black mb-4">Live YouTube Activity</h3>
      
      {scanning && (
        <div className="mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-black">Scanning HTML Structure</span>
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
                    idx === displayedHtml.length - 1 ? 'bg-red-50 border-l-2 border-red-400 pl-2' : ''
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
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full animate-fade-in"
                    >
                      {element.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}
              {discoveredInfo.author && (
                <p className="text-sm text-black animate-fade-in">
                  {discoveredInfo.author.nickname}
                </p>
              )}
              {discoveredInfo.views && (
                <div className="text-xs text-black animate-fade-in">
                  {formatNumber(discoveredInfo.views)} views
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
            key={`${video.id}-${video.processedAt}`}
            className="flex items-center space-x-4 p-3 bg-white/80 backdrop-blur-sm hover:bg-[#F5F5F5]/90 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#FF0000]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-black">
                <span className="font-bold">{video.author.nickname}</span>: {video.desc}
              </p>
              <p className="text-xs text-black/60">{formatTimeAgo(video.timestamp)}</p>
              
              <div className="mt-1 flex flex-wrap gap-2">
                {video.foundElements?.map(element => (
                  <span
                    key={element}
                    className="text-xs px-2 py-1 bg-red-100/20 text-red-700 rounded-full"
                  >
                    {element.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs font-medium text-black bg-red-100/20 px-2 py-1 rounded-full">
              {formatNumber(video.stats.views)} views
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeActivity;