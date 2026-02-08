export interface ConnectivityMeasurement {
  timestamp: number;
  latency: number | null;
  success: boolean;
  errorCategory?: string;
  errorMessage?: string;
}

export interface DerivedMetrics {
  avgLatency: number | null;
  jitter: number | null;
  successRate: number;
  recentErrorCount: number;
  lastSuccessTimestamp: number | null;
}

export type StabilityStatus = 'Stable' | 'Degraded' | 'Offline';
