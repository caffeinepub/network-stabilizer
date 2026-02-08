import { ConnectivityMeasurement } from '../monitoring/types';
import type { NetworkCheckResult } from '@/backend';
import { ResultCode, DeviceConnectivityType } from '@/backend';

export function measurementToNetworkCheckResult(
  measurement: ConnectivityMeasurement,
  checkId: number
): NetworkCheckResult {
  const resultCode = measurement.success ? ResultCode.good : ResultCode.bad;

  return {
    timestamp: BigInt(measurement.timestamp * 1_000_000), // Convert to nanoseconds
    checkId: BigInt(checkId),
    description: measurement.success ? 'Connectivity check passed' : 'Connectivity check failed',
    errorMessages: measurement.errorMessage || undefined,
    resultCode,
    pingTimeMs: measurement.latency !== null ? BigInt(measurement.latency) : undefined,
    dnsResolutionMs: undefined,
    testType: { __kind__: 'connectivityCheck', connectivityCheck: DeviceConnectivityType.wifi },
  };
}

export function networkCheckResultToMeasurement(
  result: NetworkCheckResult
): ConnectivityMeasurement {
  return {
    timestamp: Number(result.timestamp / BigInt(1_000_000)), // Convert from nanoseconds
    latency: result.pingTimeMs !== undefined ? Number(result.pingTimeMs) : null,
    success: result.resultCode === ResultCode.good,
    errorCategory: result.resultCode === ResultCode.bad ? 'Network Error' : undefined,
    errorMessage: result.errorMessages,
  };
}
