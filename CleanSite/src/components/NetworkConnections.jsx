import React, { useState, useEffect } from 'react';
import { serverLocations } from '../utils/ServerLocations';

const NetworkConnections = ({ mapDimensions, getPointCoordinates, hoveredServer, serverStatuses }) => {
  const [connections, setConnections] = useState([]);
  
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

  // Enhanced defs section with new animations
  const renderDefs = () => (
    <defs>
      {/* Particle effect */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feOffset dx="0" dy="0" result="offsetblur"/>
        <feFlood floodColor="#6aebfc" floodOpacity="0.5" result="glowColor"/>
        <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow"/>
        <feMerge>
          <feMergeNode in="softGlow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Enhanced data flow pattern */}
      <pattern id="dataFlowPattern" patternUnits="userSpaceOnUse" width="30" height="30">
        <rect width="30" height="30" fill="none"/>
        <path d="M0,15 L30,15" stroke="#6aebfc" strokeWidth="2" strokeDasharray="2,8">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" 
            dur="1s" repeatCount="indefinite"/>
        </path>
      </pattern>

      {/* Gradient for the main connection line */}
      <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6aebfc" stopOpacity="0.1">
          <animate attributeName="stopOpacity" values="0.1;0.3;0.1" 
            dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stopColor="#6aebfc" stopOpacity="0.3">
          <animate attributeName="stopOpacity" values="0.3;0.6;0.3" 
            dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="100%" stopColor="#6aebfc" stopOpacity="0.1">
          <animate attributeName="stopOpacity" values="0.1;0.3;0.1" 
            dur="2s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
    </defs>
  );

  const renderConnection = (connection, fromPoint, toPoint, isHighlighted) => {
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(0.2, distance / (mapDimensions.width * 2));
    const midX = (fromPoint.x + toPoint.x) / 2;
    const midY = (fromPoint.y + toPoint.y) / 2 - (distance * curvature);
    const pathString = `M${fromPoint.x},${fromPoint.y} Q${midX},${midY} ${toPoint.x},${toPoint.y}`;

    return (
      <g key={connection.id}>
        <path
          d={pathString}
          stroke="url(#lineGradient)"
          strokeWidth={isHighlighted ? 3 : 2}
          fill="none"
          filter="url(#glow)"
        />
        <path
          d={pathString}
          stroke="url(#dataFlowPattern)"
          strokeWidth={isHighlighted ? 4 : 3}
          fill="none"
          opacity={0.8}
        />
        {Array.from({ length: 3 }).map((_, i) => (
          <circle key={i} r={2} fill="#6aebfc" filter="url(#glow)">
            <animateMotion
              dur={(1 + i * 0.3) + "s"}
              repeatCount="indefinite"
              path={pathString}
            >
              <mpath href={`#${connection.id}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={(1 + i * 0.3) + "s"}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    );
  };

  if (!mapDimensions.width || !mapDimensions.height) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
      preserveAspectRatio="none"
    >
      {renderDefs()}
      {connections.map(connection => {
        if (hoveredServer && 
            connection.from !== hoveredServer && 
            connection.to !== hoveredServer) {
          return null;
        }

        const fromPoint = getPointCoordinates(connection.fromData.lat, connection.fromData.lng);
        const toPoint = getPointCoordinates(connection.toData.lat, connection.toData.lng);
        const isHighlighted = hoveredServer && 
          (connection.from === hoveredServer || connection.to === hoveredServer);

        return renderConnection(connection, fromPoint, toPoint, isHighlighted);
      })}
    </svg>
  );
};

export default NetworkConnections;