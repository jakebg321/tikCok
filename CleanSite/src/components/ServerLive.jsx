import React from 'react';
import { Shield, Activity, Cpu, Server, AlertTriangle } from 'lucide-react';

const ServerLive = ({ serverData }) => {
  // Return early if no data
  if (!serverData) {
    return (
      <div className="bg-[#1E2633]/90 backdrop-blur-sm rounded-lg p-4 font-mono">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Loading server data...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'bg-green-500',
      degraded: 'bg-yellow-500',
      critical: 'bg-red-500',
      maintenance: 'bg-blue-500'
    };
    return colors[status];
  };

  const formatBandwidth = (bytes) => {
    if (bytes < 1024) return `${bytes}B/s`;
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)}KB/s`;
    return `${(bytes/1048576).toFixed(1)}MB/s`;
  };

  // Destructure with default values
  const {
    location = { city: 'Unknown' },
    status = 'degraded',
    lastUpdated = Date.now(),
    botDetection = { botScore: 0 },
    security = { tlsVersion: 'Unknown' },
    performance = { latencyMs: 0, requestsPerSecond: 0, trafficPatternAnomaly: 0 },
    resources = {
      cpuUsage: 0,
      memoryUsage: 0,
      networkBandwidth: { incoming: 0, outgoing: 0 }
    }
  } = serverData;

  return (
    <div className="bg-[#1E2633]/90 backdrop-blur-sm rounded-lg p-4 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-blue-400" />
          <span className="text-white font-bold">{location.city}</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        </div>
        <span className="text-xs text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#151923] rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Security</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Bot Score</span>
              <span className={`${botDetection.botScore > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                {(botDetection.botScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">TLS Version</span>
              <span className="text-blue-400">{security.tlsVersion}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-[#151923] rounded p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Performance</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Latency</span>
              <span className={`${performance.latencyMs > 200 ? 'text-yellow-400' : 'text-green-400'}`}>
                {performance.latencyMs}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Requests/sec</span>
              <span className="text-blue-400">{performance.requestsPerSecond}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="space-y-3">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">CPU Usage</span>
            <span className="text-xs text-blue-400">{resources.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="overflow-hidden h-1.5 bg-[#151923] rounded">
            <div 
              className="bg-blue-500 h-full rounded"
              style={{ width: `${resources.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Memory Usage</span>
            <span className="text-xs text-blue-400">{resources.memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="overflow-hidden h-1.5 bg-[#151923] rounded">
            <div 
              className="bg-blue-500 h-full rounded"
              style={{ width: `${resources.memoryUsage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Network: {formatBandwidth(resources.networkBandwidth.incoming)} in</span>
          <span>{formatBandwidth(resources.networkBandwidth.outgoing)} out</span>
        </div>
      </div>

      {/* Anomaly Indicators */}
      {performance.trafficPatternAnomaly > 0.3 && (
        <div className="mt-4 bg-red-500/10 text-red-400 p-2 rounded text-xs flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Traffic pattern anomaly detected
        </div>
      )}
    </div>
  );
};

export default ServerLive;