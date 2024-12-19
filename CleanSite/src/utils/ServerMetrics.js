// src/utils/serverMetrics.js
export const createServerMetrics = (data) => ({
  serverId: data.session_id || '',
  location: {
    city: data.geoip_location?.city || '',
    country: data.geoip_location?.country || '',
    coordinates: {
      lat: 0, // To be mapped from serverLocations
      lng: 0
    }
  },
  status: getServerStatus(data),
  lastUpdated: new Date().toISOString(),
  security: {
    tlsVersion: data.security?.tls_version || '',
    encryption: data.security?.encryption || '',
    dnsLeaksDetected: data.security?.dns_leaks_detected || false,
    sslCertificateStatus: {
      valid: !data.security?.ssl_certificate_mismatch_bypassed,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      mismatchBypassed: data.security?.ssl_certificate_mismatch_bypassed
    },
    webrtcLeakProtection: data.stealth?.webrtc_leak_protection || false,
    headlessMode: data.stealth?.headless_mode || false,
    canvasFingerprint: data.stealth?.canvas_fingerprint || ''
  },
  performance: {
    latencyMs: data.latency_ms || 0,
    requestsPerSecond: data.analytics?.requests_per_sec || 0,
    dataSize: data.scraping?.data_size || '0KB',
    rateLimit: data.scraping?.rate_limit || '0 req/min',
    inferenceTimeMs: data.machine_learning?.inference_time_ms || 0,
    trafficPatternAnomaly: data.analytics?.traffic_pattern_anomaly || 0,
    uptimePercentage: 99.9, // Example default
    loadAverage: [0.1, 0.2, 0.3] // Example defaults
  },
  botDetection: {
    botScore: data.bot_detection?.bot_score || 0,
    anomalyScore: data.bot_detection?.anomaly_score || 0,
    fingerprintSpoofing: data.bot_detection?.fingerprint_spoofing || false,
    headersInjected: data.bot_detection?.headers_injected || []
  },
  resources: {
    cpuUsage: Math.random() * 100, // Example - replace with actual metrics
    memoryUsage: Math.random() * 100,
    diskUsage: Math.random() * 100,
    networkBandwidth: {
      incoming: Math.random() * 1048576, // Example bandwidth in bytes/sec
      outgoing: Math.random() * 1048576
    }
  }
});

const getServerStatus = (data) => {
  if (data.status_code >= 500) return 'critical';
  if (data.status_code === 429) return 'degraded';
  if (data.bot_detection?.bot_score > 0.7) return 'degraded';
  if (data.analytics?.traffic_pattern_anomaly > 0.5) return 'degraded';
  return 'healthy';
};