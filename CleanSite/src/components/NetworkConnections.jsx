import React, { useState, useEffect } from 'react';
import { serverLocations } from '../utils/ServerLocations';

const NetworkConnections = ({ mapDimensions, getPointCoordinates, hoveredServer, serverStatuses }) => {
  const [connections, setConnections] = useState([]);
  const [activePackets, setActivePackets] = useState([]);

  useEffect(() => {
    // Generate enhanced connections
    const newConnections = [];
    const regions = [...new Set(Object.values(serverLocations).map(server => server.region))];
    
    // Create regional mesh networks
    regions.forEach(region => {
      const regionServers = Object.entries(serverLocations)
        .filter(([_, data]) => data.region === region);
      
      regionServers.forEach(([serverId, serverData], index) => {
        regionServers.slice(index + 1).forEach(([targetId, targetData]) => {
          newConnections.push({
            id: `${serverId}-${targetId}`,
            from: serverId,
            to: targetId,
            fromData: {
              lat: serverData.lat,
              lng: serverData.lng,
              tier: serverData.tier,
              status: serverStatuses[serverId]?.status || 'healthy'
            },
            toData: {
              lat: targetData.lat,
              lng: targetData.lng,
              tier: targetData.tier,
              status: serverStatuses[targetId]?.status || 'healthy'
            },
            region,
            type: 'regional'
          });
        });
      });
    });

    // Add inter-region backbone connections
    const primaryServers = Object.entries(serverLocations)
      .filter(([_, data]) => data.tier === 'primary');
    
    primaryServers.forEach(([serverId, serverData], index) => {
      primaryServers.slice(index + 1).forEach(([targetId, targetData]) => {
        if (serverData.region !== targetData.region) {
          newConnections.push({
            id: `${serverId}-${targetId}`,
            from: serverId,
            to: targetId,
            fromData: {
              lat: serverData.lat,
              lng: serverData.lng,
              tier: 'primary',
              status: serverStatuses[serverId]?.status || 'healthy'
            },
            toData: {
              lat: targetData.lat,
              lng: targetData.lng,
              tier: 'primary',
              status: serverStatuses[targetId]?.status || 'healthy'
            },
            type: 'backbone'
          });
        }
      });
    });

    setConnections(newConnections);
  }, [serverStatuses]);

  // Enhanced packet animation system
  useEffect(() => {
    const interval = setInterval(() => {
      const relevantConnections = connections.filter(conn => {
        if (hoveredServer) {
          return conn.from === hoveredServer || conn.to === hoveredServer;
        }
        // Show more animations on backbone connections when not hovering
        return conn.type === 'backbone' || Math.random() > 0.7;
      });

      const newPackets = relevantConnections.flatMap(conn => {
        const packets = [];
        const count = conn.type === 'backbone' ? 3 : 1;
        
        for (let i = 0; i < count; i++) {
          packets.push({
            id: `packet-${conn.id}-${Date.now()}-${i}`,
            connectionId: conn.id,
            size: conn.type === 'backbone' ? 'large' : 'small',
            delay: i * 0.2, // Stagger packet releases
            reverse: Math.random() > 0.5
          });
        }
        return packets;
      });

      setActivePackets(prev => [...prev, ...newPackets]);
      
      // Cleanup old packets
      setTimeout(() => {
        setActivePackets(prev => prev.filter(p => 
          Date.now() - parseInt(p.id.split('-')[2]) < 2000
        ));
      }, 2000);
    }, hoveredServer ? 800 : 1500);

    return () => clearInterval(interval);
  }, [connections, hoveredServer]);

  if (!mapDimensions.width || !mapDimensions.height) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
      viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Enhanced gradients with shimmer effect */}
        <linearGradient id="backboneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6aebfc" stopOpacity="0.4">
            <animate attributeName="stopOpacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#6aebfc" stopOpacity="0.8">
            <animate attributeName="stopOpacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#6aebfc" stopOpacity="0.4">
            <animate attributeName="stopOpacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <linearGradient id="regionalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6aebfc" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#6aebfc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6aebfc" stopOpacity="0.3" />
        </linearGradient>

        {/* Enhanced glow effect */}
        <filter id="packetGlow">
          <feGaussianBlur stdDeviation="2" result="blur1" />
          <feGaussianBlur stdDeviation="4" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Animated line pattern */}
        <pattern id="dataFlow" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M-5,5 L15,25 M-5,15 L15,35 M-5,-5 L15,15" 
                stroke="#6aebfc" strokeWidth="1" strokeOpacity="0.4">
            <animate attributeName="strokeOpacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>

      {connections.map(connection => {
        if (hoveredServer && 
            connection.from !== hoveredServer && 
            connection.to !== hoveredServer) {
          return null;
        }

        const fromPoint = getPointCoordinates(connection.fromData.lat, connection.fromData.lng);
        const toPoint = getPointCoordinates(connection.toData.lat, connection.toData.lng);

        // Enhanced curve calculation
        const dx = toPoint.x - fromPoint.x;
        const dy = toPoint.y - fromPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust curve based on distance and connection type
        const curveFactor = connection.type === 'backbone' 
          ? Math.min(0.3, distance / (mapDimensions.width * 1.5))
          : Math.min(0.2, distance / (mapDimensions.width * 2));
        
        const midX = (fromPoint.x + toPoint.x) / 2;
        const midY = (fromPoint.y + toPoint.y) / 2;
        const controlX = midX;
        const controlY = midY - distance * curveFactor;

        const pathString = `M ${fromPoint.x} ${fromPoint.y} Q ${controlX} ${controlY} ${toPoint.x} ${toPoint.y}`;
        
        const isHighlighted = hoveredServer && 
          (connection.from === hoveredServer || connection.to === hoveredServer);

        const isActive = connection.fromData.status === 'healthy' && 
                        connection.toData.status === 'healthy';

        return (
          <g key={connection.id}>
            {/* Base glowing connection */}
            <path
              d={pathString}
              fill="none"
              stroke={connection.type === 'backbone' ? "url(#backboneGradient)" : "url(#regionalGradient)"}
              strokeWidth={isHighlighted ? "3" : (connection.type === 'backbone' ? "2" : "1")}
              filter="url(#packetGlow)"
              className="transition-all duration-300"
              style={{
                strokeDasharray: connection.type === 'backbone' ? 'none' : '4,4'
              }}
            >
              {isActive && (
                <animate
                  attributeName="strokeOpacity"
                  values="0.6;1;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </path>
            
            {/* Animated data flow overlay */}
            <path
              d={pathString}
              fill="none"
              stroke="url(#dataFlow)"
              strokeWidth={isHighlighted ? "4" : (connection.type === 'backbone' ? "3" : "2")}
              opacity={isActive ? "0.7" : "0.2"}
              className="transition-all duration-300"
            >
              <animate
                attributeName="strokeDashoffset"
                values="0;-20"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Enhanced packet animations */}
            {activePackets
              .filter(packet => packet.connectionId === connection.id)
              .map(packet => (
                <g key={packet.id} filter="url(#packetGlow)">
                  {/* Main packet with pulse effect */}
                  <circle 
                    r={packet.size === 'large' ? "4" : "2"} 
                    fill="#6aebfc"
                  >
                    <animate
                      attributeName="r"
                      values={packet.size === 'large' ? "4;5;4" : "2;3;2"}
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                    <animateMotion
                      dur="1.5s"
                      repeatCount="1"
                      path={pathString}
                      rotate="auto"
                      begin={`${packet.delay}s`}
                    />
                  </circle>
                  
                  {/* Enhanced trailing particles */}
                  {[...Array(5)].map((_, i) => (
                    <circle
                      key={i}
                      r={packet.size === 'large' ? "2" : "1"}
                      fill="#6aebfc"
                      opacity={0.2 + (i * 0.15)}
                    >
                      <animateMotion
                        dur="1.5s"
                        repeatCount="1"
                        path={pathString}
                        rotate="auto"
                        begin={`${packet.delay + (i * 0.08)}s`}
                      />
                    </circle>
                  ))}
                </g>
              ))}
          </g>
        );
      })}
    </svg>
  );
};

export default NetworkConnections;