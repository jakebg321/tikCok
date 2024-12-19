export const createServerMetrics = (data) => {
  const getRandomHex = (length) => {
    return Array.from({ length }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  const getRandomHeaders = () => {
    const headers = [
      'X-Forwarded-For',
      'X-Device-ID',
      'X-Session-Key',
      'X-Client-Version',
      'X-Request-ID',
      'X-Trace-ID'
    ];
    return headers.filter(() => Math.random() > 0.5);
  };

  const getModelVersion = () => {
    const major = Math.floor(Math.random() * 4) + 1;
    const minor = Math.floor(Math.random() * 10);
    const patch = Math.floor(Math.random() * 10);
    return `v${major}.${minor}.${patch}`;
  };

  const calculateStatus = (metrics) => {
    const { botScore, latencyMs, trafficPatternAnomaly } = metrics;
    if (botScore > 0.8 || latencyMs > 500 || trafficPatternAnomaly > 0.8) return 'critical';
    if (botScore > 0.5 || latencyMs > 200 || trafficPatternAnomaly > 0.4) return 'degraded';
    return 'healthy';
  };

  const metrics = {
    location: data.geoip_location,
    lastUpdated: Date.now(),
    botDetection: {
      botScore: data.bot_detection?.bot_score || Math.random(),
      anomalyScore: data.bot_detection?.anomaly_score || Math.random() * 0.5,
      fingerprintSpoofing: Math.random() > 0.7,
      headersInjected: getRandomHeaders()
    },
    security: {
      tlsVersion: data.security?.tls_version || 'TLS 1.3',
      encryption: data.security?.encryption || 'AES-256-GCM',
      dnsLeaksDetected: Math.random() > 0.9
    },
    stealth: {
      headlessMode: Math.random() > 0.7,
      canvasFingerprint: getRandomHex(8),
      webrtcLeakProtection: Math.random() > 0.5
    },
    performance: {
      latencyMs: data.latency_ms || Math.floor(Math.random() * 500),
      requestsPerSecond: data.analytics?.requests_per_sec || Math.floor(Math.random() * 100),
      trafficPatternAnomaly: data.analytics?.traffic_pattern_anomaly || Math.random()
    },
    resources: {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      networkBandwidth: {
        incoming: Math.floor(Math.random() * 1048576), // Up to 1MB/s
        outgoing: Math.floor(Math.random() * 1048576)
      }
    },
    machine_learning: {
      captchaSolved: Math.random() > 0.3,
      modelVersion: getModelVersion(),
      inferenceTimeMs: Math.floor(Math.random() * 50)
    }
  };

  // Set the overall status based on all metrics
  metrics.status = calculateStatus({
    botScore: metrics.botDetection.botScore,
    latencyMs: metrics.performance.latencyMs,
    trafficPatternAnomaly: metrics.performance.trafficPatternAnomaly
  });

  return metrics;
};