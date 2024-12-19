import React, { useState, useRef, useEffect } from 'react';
import { serverLocations } from '../utils/ServerLocations';
import { createServerMetrics } from '../utils/ServerMetrics';
import NetworkConnections from '../components/NetworkConnections';
import ServerLive from '../components/ServerLive';

const WorldMap = () => {
  const [mapDimensions, setMapDimensions] = useState(null);
  const [serverStatuses, setServerStatuses] = useState({});
  const [hoveredServer, setHoveredServer] = useState(null);
  const mapRef = useRef(null);

  const getPointCoordinates = (x, y) => {
    if (!mapDimensions?.width || !mapDimensions?.height) return { x: 0, y: 0 };
    
    const scaleX = mapDimensions.width / 2000;
    const scaleY = mapDimensions.height / 857;
    
    return {
      x: x * scaleX,
      y: y * scaleY
    };
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        if (rect.width && rect.height) {
          setMapDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    updateDimensions();
    const initTimer = setTimeout(updateDimensions, 100);

    window.addEventListener('resize', updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(initTimer);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateServerStatuses = () => {
      const newStatuses = {};
      Object.entries(serverLocations).forEach(([serverId, data]) => {
        const mockData = {
          session_id: serverId,
          geoip_location: {
            country: data.country,
            city: data.city
          },
          latency_ms: Math.floor(Math.random() * 300),
          status_code: Math.random() > 0.9 ? 429 : 200,
          bot_detection: {
            bot_score: Math.random(),
            anomaly_score: Math.random() * 0.5
          },
          analytics: {
            requests_per_sec: Math.floor(Math.random() * 100),
            traffic_pattern_anomaly: Math.random()
          },
          security: {
            tls_version: 'TLS 1.3',
            encryption: 'AES-256-GCM'
          }
        };
        newStatuses[serverId] = createServerMetrics(mockData);
      });
      setServerStatuses(newStatuses);
    };

    updateServerStatuses();
    const interval = setInterval(updateServerStatuses, 5000);
    return () => clearInterval(interval);
  }, []);

  const ServerPin = ({ status, isHovered, tier }) => {
    const statusColors = {
      healthy: {
        primary: 'bg-emerald-500',
        secondary: 'bg-emerald-400',
        ring: 'ring-emerald-400/30',
        glow: 'shadow-emerald-500/50'
      },
      degraded: {
        primary: 'bg-amber-500',
        secondary: 'bg-amber-400',
        ring: 'ring-amber-400/30',
        glow: 'shadow-amber-500/50'
      },
      critical: {
        primary: 'bg-red-500',
        secondary: 'bg-red-400',
        ring: 'ring-red-400/30',
        glow: 'shadow-red-500/50'
      }
    };

    const colors = statusColors[status] || statusColors.healthy;
    const isPrimary = tier === 'primary';

    return (
      <div className="relative group">
        {isPrimary && (
          <div className={`
            absolute 
            inset-0 
            ${colors.ring} 
            rounded-full 
            scale-[2.5]
            group-hover:scale-[3.5] 
            transition-transform 
            duration-500
            blur-sm
          `} />
        )}
        
        <div className={`
          relative 
          w-4 h-4 
          ${colors.primary}
          rounded-full 
          shadow-lg 
          shadow-${colors.glow}
          transform 
          transition-all 
          duration-500
          group-hover:scale-150
          ${isHovered ? 'scale-150' : 'scale-100'}
          ${isPrimary ? 'ring-2 ring-white/30' : ''}
        `}>
          <div className={`
            absolute 
            inset-0 
            ${colors.secondary}
            rounded-full 
            animate-ping 
            opacity-75
          `} />
          
          <div className={`
            absolute 
            -top-1 
            -right-1 
            w-2 
            h-2 
            ${colors.secondary}
            rounded-full 
            border 
            border-[#151923] 
            shadow-lg
            ${colors.glow}
          `} />
        </div>
      </div>
    );
  };

  const shouldRenderNodes = mapDimensions?.width > 0 && mapDimensions?.height > 0;

  return (
    <div className="fixed lg:ml-[240px] top-0 right-0 bottom-0 left-0 bg-[#151923]">
      <header className="backdrop-blur-sm border-b border-[#6aebfc]/30 p-4 mt-[40px] lg:mt-0">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-2xl font-bold text-white">AROS Status</h1>
          <p className="text-[#6aebfc]/70">Real-time server monitoring</p>
        </div>
      </header>
      
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-[1600px] bg-[#151923] rounded-lg">
          <div className="relative" ref={mapRef}>
            <img
              src="/world.svg"
              alt="World Map"
              className="w-full h-full object-contain"
              onLoad={() => {
                if (mapRef.current) {
                  const rect = mapRef.current.getBoundingClientRect();
                  setMapDimensions({ width: rect.width, height: rect.height });
                }
              }}
            />
            
            {shouldRenderNodes && (
              <>
                <NetworkConnections
                  mapDimensions={mapDimensions}
                  getPointCoordinates={getPointCoordinates}
                  hoveredServer={hoveredServer}
                  serverStatuses={serverStatuses}
                />

                {Object.entries(serverLocations).map(([serverId, data]) => {
                  const { x, y } = getPointCoordinates(data.lat, data.lng);
                  const status = serverStatuses[serverId]?.status || 'healthy';
                  const isHovered = hoveredServer === serverId;

                  return (
                    <div
                      key={serverId}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${x}px`, 
                        top: `${y}px`,
                        zIndex: isHovered ? 30 : (data.tier === 'primary' ? 25 : 20)
                      }}
                      onMouseEnter={() => setHoveredServer(serverId)}
                      onMouseLeave={() => setHoveredServer(null)}
                    >
                      <ServerPin 
                        status={status} 
                        isHovered={isHovered}
                        tier={data.tier}
                      />
                      
                      {(data.tier === 'primary' || isHovered) && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                          <div className={`
                            mt-4
                            px-3 
                            py-1 
                            rounded-full 
                            backdrop-blur-md 
                            bg-[#151923]/80 
                            border 
                            border-[#6aebfc]/20
                            text-xs 
                            font-mono 
                            text-[#6aebfc]
                            transition-all
                            duration-300
                            ${isHovered ? 'opacity-100 scale-110' : 'opacity-70'}
                          `}>
                            <span className="mr-2">•</span>
                            {data.city}
                            <span className="ml-2 text-[#6aebfc]/50">{data.country}</span>
                          </div>
                          
                          <div className={`
                            mt-1
                            px-2 
                            py-0.5 
                            rounded-full 
                            text-[10px] 
                            font-semibold
                            ${status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                              status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-red-500/20 text-red-400'}
                            transition-all
                            duration-300
                            ${isHovered ? 'opacity-100' : 'opacity-0'}
                          `}>
                            {status.toUpperCase()}
                          </div>
                        </div>
                      )}
                      
                      <div 
                        className={`
                          absolute 
                          top-16
                          left-1/2 
                          transform 
                          -translate-x-1/2 
                          w-80
                          transition-all 
                          duration-500
                          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
                        `}
                      >
                        <div className="backdrop-blur-lg bg-[#151923]/90 rounded-lg border border-[#6aebfc]/20 shadow-xl shadow-black/50">
                          <ServerLive serverData={serverStatuses[serverId]} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;