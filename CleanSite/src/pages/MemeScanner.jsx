import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useMemeScanner } from '../hooks/useMemeScanner';
import memeData from '../data/meme_data.json';
import tiktokData from '../data/tiktok_data1.json';
import youtubeData from '../data/youtube_data.json';
import AnimatedBackground from '../components/AnimatedBackground';
import StatsOverview from '../components/MemeScanner/StatsOverview';
import MemeAnalytics from '../components/MemeScanner/MemeAnalytics';

const HTMLScanner = ({ html }) => {
  const [displayedHtml, setDisplayedHtml] = useState([]);
  const [foundElements, setFoundElements] = useState(new Set());

  useEffect(() => {
    if (!html) return;

    const htmlLines = html.split('>').map(line => line.trim() + '>').filter(line => line.length > 1);
    let currentLine = 0;

    const scanInterval = setInterval(() => {
      if (currentLine >= htmlLines.length) {
        clearInterval(scanInterval);
        currentLine = 0;
        return;
      }

      setDisplayedHtml(prev => [...prev, htmlLines[currentLine]].slice(-5));
      
      const line = htmlLines[currentLine].toLowerCase();
      if (line.includes('meta')) {
        setFoundElements(prev => new Set([...prev, 'meta']));
      }
      if (line.includes('script')) {
        setFoundElements(prev => new Set([...prev, 'script']));
      }

      currentLine++;
    }, 100);

    return () => clearInterval(scanInterval);
  }, [html]);

  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg p-2">
      <div className="font-mono text-xs text-slate-600 h-32 overflow-hidden">
        <div className="h-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-all scrollbar-hide">
          {displayedHtml.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Waiting for HTML content...
            </div>
          ) : (
            displayedHtml.map((line, idx) => (
              <div 
                key={idx} 
                className={`transition-colors duration-200 leading-4 ${
                  idx === displayedHtml.length - 1 ? 'bg-slate-200/50 border-l-2 border-slate-400 pl-2' : ''
                }`}
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
      {foundElements.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from(foundElements).map(element => (
            <span
              key={element}
              className="text-xs px-2 py-1 bg-slate-200/50 text-slate-600 rounded-full"
            >
              {element}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const MemeScannerPage = () => {
  const { data, error, currentMeme, ROTATION_INTERVAL } = useMemeScanner(memeData);
  const [currentTikTokVideo, setCurrentTikTokVideo] = useState(0);
  const [currentYouTubeVideo, setCurrentYouTubeVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTikTokVideo(prev => (prev + 1) % tiktokData.videos.length);
      setCurrentYouTubeVideo(prev => (prev + 1) % youtubeData.videos.length);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen relative lg:ml-[240px]">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="p-6 bg-black/50 backdrop-blur-sm text-emerald-400 rounded-lg flex items-center gap-2">
            <Clock className="w-5 h-5 animate-spin" />
            <span>Initializing meme scanner...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative lg:ml-[240px]">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="p-6 bg-black/50 backdrop-blur-sm text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative lg:ml-[240px]">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="backdrop-blur-sm border-b border-emerald-900/30 p-6 mt-[76px] lg:mt-0">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-bold text-emerald-100">Meme Scanner</h1>
            <p className="text-emerald-300/70 mt-1">Real-time meme trend analysis</p>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <section>
              <StatsOverview data={data} />
            </section>

            <section className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-[35%] space-y-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/20 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    System Logs <span className="text-xs text-slate-600 ml-2">Live</span>
                  </h3>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                      Processing Logs
                    </h4>
                    <div className="text-slate-600 text-sm">
                      No logs available
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                      TikTok Scanner
                    </h4>
                    <HTMLScanner 
                      html={tiktokData.videos[currentTikTokVideo]?.html_elements?.full_page_html}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                      YouTube Scanner
                    </h4>
                    <HTMLScanner 
                      html={youtubeData.videos[currentYouTubeVideo]?.html_elements?.view_count_element}
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:w-[65%]">
                <MemeAnalytics 
                  currentMeme={currentMeme} 
                  rotationInterval={ROTATION_INTERVAL} 
                />
              </div>
            </section>
          </div>
        </main>

        <footer className="bg-black/50 backdrop-blur-sm border-t border-emerald-900/30 p-4">
          <div className="max-w-[1600px] mx-auto text-center text-sm text-emerald-300/70">
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MemeScannerPage;