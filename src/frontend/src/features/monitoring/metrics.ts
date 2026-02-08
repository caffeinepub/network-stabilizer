import { ConnectivityMeasurement, DerivedMetrics, StabilityStatus } from './types';

export function calculateMetrics(samples: ConnectivityMeasurement[]): DerivedMetrics {
  if (samples.length === 0) {
    return {
      avgLatency: null,
      jitter: null,
      successRate: 0,
      recentErrorCount: 0,
      lastSuccessTimestamp: null,
    };
  }

  const successfulSamples = samples.filter(s => s.success && s.latency !== null);
  const successCount = successfulSamples.length;
  const successRate = (successCount / samples.length) * 100;

  let avgLatency: number | null = null;
  let jitter: number | null = null;

  if (successfulSamples.length > 0) {
    const latencies = successfulSamples.map(s => s.latency!);
    avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);

    if (latencies.length > 1) {
      const variance = latencies.reduce((sum, lat) => {
        return sum + Math.pow(lat - avgLatency!, 2);
      }, 0) / latencies.length;
      jitter = Math.round(Math.sqrt(variance));
    }
  }

  const recentErrorCount = samples.filter(s => !s.success).length;
  const lastSuccess = successfulSamples[successfulSamples.length - 1];
  const lastSuccessTimestamp = lastSuccess ? lastSuccess.timestamp : null;

  return {
    avgLatency,
    jitter,
    successRate,
    recentErrorCount,
    lastSuccessTimestamp,
  };
}

export function classifyStability(
  metrics: DerivedMetrics,
  isOnline: boolean
): StabilityStatus {
  if (!isOnline) {
    return 'Offline';
  }

  if (metrics.successRate === 0) {
    return 'Offline';
  }

  if (metrics.successRate < 70 || (metrics.avgLatency && metrics.avgLatency > 1000)) {
    return 'Degraded';
  }

  return 'Stable';
}
