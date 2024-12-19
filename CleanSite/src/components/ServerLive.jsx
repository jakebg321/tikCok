import React from 'react';
import { Shield, Activity, Cpu, Server, AlertTriangle, Bot, Brain, Network, Lock } from 'lucide-react';

const ServerLive = ({ serverData }) => {
  if (!serverData) return null;

  const getStatusColor = (status) => ({
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    critical: 'bg-red-500',
    maintenance: 'bg-blue-500'
  }[status]);

  const formatBandwidth = (bytes) => {
    if (bytes < 1024) return `${bytes}B/s`;
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)}KB/s`;
    return `${(bytes/1048576).toFixed(1)}MB/s`;
  };

  const {
    location = { city: 'Unknown' },
    status = 'degraded',
    lastUpdated = Date.now(),
    botDetection = { 
      botScore: 0,
      anomalyScore: 0,
      fingerprintSpoofing: false,
      headersInjected: []
    },
    security = { 
      tlsVersion: 'Unknown',
      encryption: 'Unknown',
      dnsLeaksDetected: false
    },
    stealth = {
      headlessMode: false,
      canvasFingerprint: '',
      webrtcLeakProtection: false
    },
    performance = { 
      latencyMs: 0, 
      requestsPerSecond: 0, 
      trafficPatternAnomaly: 0 
    },
    resources = {
      cpuUsage: 0,
      memoryUsage: 0,
      networkBandwidth: { incoming: 0, outgoing: 0 }
    },
    machine_learning = {
      captchaSolved: false,
      modelVersion: 'Unknown',
      inferenceTimeMs: 0
    }
  } = serverData;

  return (
    <div className="p-3"> {/* Reduced from p-4 or p-5 if it was larger */}
      <div className="space-y-2"> {/* Reduced from space-y-3 or space-y-4 */}
        <div className="text-xs space-y-1.5"> {/* Reduced text size and spacing */}
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

          {/* Enhanced Security Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#151923] rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Security</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">TLS Version</span>
                  <span className="text-blue-400">{security.tlsVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Encryption</span>
                  <span className="text-green-400">{security.encryption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DNS Leaks</span>
                  <span className={security.dnsLeaksDetected ? 'text-red-400' : 'text-green-400'}>
                    {security.dnsLeaksDetected ? 'Detected' : 'Protected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bot Detection */}
            <div className="bg-[#151923] rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Bot Detection</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bot Score</span>
                  <span className={`${botDetection.botScore > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                    {(botDetection.botScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fingerprint</span>
                  <span className={`${stealth.fingerprintSpoofing ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {stealth.canvasFingerprint || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Headers Injected</span>
                  <span className="text-blue-400">{botDetection.headersInjected?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ML Stats */}
          <div className="bg-[#151923] rounded p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Machine Learning</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Model</span>
                <span className="text-purple-400">{machine_learning.modelVersion}</span>
              </div>
              <div>
                <span className="text-gray-400 block">CAPTCHA</span>
                <span className={machine_learning.captchaSolved ? 'text-green-400' : 'text-red-400'}>
                  {machine_learning.captchaSolved ? 'Solved' : 'Failed'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Inference</span>
                <span className="text-blue-400">{machine_learning.inferenceTimeMs}ms</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
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
              Traffic pattern anomaly detected ({(performance.trafficPatternAnomaly * 100).toFixed(1)}% confidence)
            </div>
          )}

          {/* Stealth Mode Indicator */}
          {stealth.headlessMode && (
            <div className="mt-2 bg-purple-500/10 text-purple-400 p-2 rounded text-xs flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              Headless browser detected with WebRTC {stealth.webrtcLeakProtection ? 'protected' : 'exposed'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerLive;