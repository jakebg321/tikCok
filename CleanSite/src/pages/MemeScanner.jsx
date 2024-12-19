import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useMemeScanner } from '../hooks/useMemeScanner';
import memeData from '../data/meme_data.json';
import tiktokData from '../data/tiktok_data1.json';
import youtubeData from '../data/youtube_data1.json';
import logData from '../data/logs.json';
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

const LogScanner = () => {
  const [currentLog, setCurrentLog] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const newLog = logData[currentLog];
    const logEntries = [
      `[${newLog.session_id}] >>> Initializing New Session`,
      `[LOCATION] Country: ${newLog.geoip_location.country}`,
      `[LOCATION] City: ${newLog.geoip_location.city}`,
      `[NETWORK] Proxy: ${newLog.proxy_ip}`,
      `[NETWORK] Latency: ${newLog.latency_ms}ms`,
      `[ACTION] ${newLog.action}`,
      `[STATUS] Code: ${newLog.status_code}`,
      `[BOT] Detection Score: ${newLog.bot_detection.bot_score}`,
      `[BOT] Anomaly Score: ${newLog.bot_detection.anomaly_score}`,
      `[BOT] Fingerprint Spoofing: ${newLog.bot_detection.fingerprint_spoofing}`,
      `[SCRAPE] Target Hash: ${newLog.scraping.target_url_hash}`,
      `[SCRAPE] Data Size: ${newLog.scraping.data_size}`,
      `[SCRAPE] Rate Limit: ${newLog.scraping.rate_limit}`,
      `[SECURITY] TLS: ${newLog.security.tls_version}`,
      `[SECURITY] Encryption: ${newLog.security.encryption}`,
      `[SECURITY] DNS Leaks: ${newLog.security.dns_leaks_detected}`,
      `[SECURITY] SSL Bypass: ${newLog.security.ssl_certificate_mismatch_bypassed}`,
      `[AGENT] ${newLog.user_agent}`,
      `[ML] Model: v${newLog.machine_learning.model_version}`,
      `[ML] Inference: ${newLog.machine_learning.inference_time_ms}ms`,
      `[ML] Captcha Solved: ${newLog.machine_learning.captcha_solved}`,
      `[STEALTH] Headless: ${newLog.stealth.headless_mode}`,
      `[STEALTH] Canvas FP: ${newLog.stealth.canvas_fingerprint}`,
      `[STEALTH] WebRTC Protection: ${newLog.stealth.webrtc_leak_protection}`,
      `[ANALYTICS] Traffic Anomaly: ${newLog.analytics.traffic_pattern_anomaly}`,
      `[ANALYTICS] Latency Pass: ${newLog.analytics.latency_threshold_pass}`,
      `[ANALYTICS] Requests/sec: ${newLog.analytics.requests_per_sec}`,
      `----------------------------------------`
    ];

    const interval = setInterval(() => {
      if (currentLineIndex >= logEntries.length) {
        setCurrentLog(prev => (prev + 1) % logData.length);
        setCurrentLineIndex(0);
      } else {
        setDisplayedLogs(prev => {
          const newLogs = [...prev, logEntries[currentLineIndex]];
          return newLogs.slice(-9); // Keep only last 5 logs to match HTML scanner
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentLog, currentLineIndex]);

  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg p-2">
      <div className="font-mono text-xs text-slate-600 h-32 overflow-hidden">
        <div className="h-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-all scrollbar-hide">
          {displayedLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Waiting for system logs...
            </div>
          ) : (
            displayedLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`transition-colors duration-200 leading-4 ${
                  idx === displayedLogs.length - 1 ? 'bg-slate-200/50 border-l-2 border-slate-400 pl-2' : ''
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
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
    }, 1000);

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
    <div className="h-screen relative lg:ml-[240px]">
      <AnimatedBackground />
      <div className="relative z-10 h-full flex flex-col">
        <header className="backdrop-blur-sm border-b border-[#6aebfc]/30 p-0 mt-[40px] lg:mt-0 flex-none">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-bold text-white">Meme Scanner</h1>
            <p className="text-[#6aebfc]/70">Real-time meme trend analysis</p>
          </div>
        </header>

        <main className="p-1 flex-1">
          <div className="h-full max-w-[1600px] mx-auto space-y-6">
            <section className="h-[15%]">
              <StatsOverview data={data} />
            </section>

            <section className="h-[80%] flex flex-col lg:flex-row gap-6">
              <div className="lg:w-[35%] h-full">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/20 p-6 h-full">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    System Logs <span className="text-xs text-slate-600 ml-2">Live</span>
                  </h3>
                  
                  <div className="h-[calc(100%-2rem)] overflow-auto">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                        Processing Logs
                      </h4>
                      <LogScanner />
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
              </div>
              
              <div className="lg:w-[65%] h-full">
                <MemeAnalytics 
                  currentMeme={currentMeme} 
                  rotationInterval={ROTATION_INTERVAL} 
                />
              </div>
            </section>
          </div>
        </main>

        <footer className="bg-black/50 backdrop-blur-sm border-t border-[#6aebfc]/30 p-4 flex-none">
          <div className="max-w-[1600px] mx-auto text-center text-sm text-[#6aebfc]/70">
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MemeScannerPage;