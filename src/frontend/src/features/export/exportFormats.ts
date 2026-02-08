import { ConnectivityMeasurement } from '../monitoring/types';

export function exportToCSV(samples: ConnectivityMeasurement[]): string {
  const headers = ['Timestamp', 'Success', 'Latency (ms)', 'Error Category', 'Error Message'];
  const rows = samples.map(s => [
    new Date(s.timestamp).toISOString(),
    s.success ? 'true' : 'false',
    s.latency !== null ? s.latency.toString() : '',
    s.errorCategory || '',
    s.errorMessage || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

export function exportToJSON(samples: ConnectivityMeasurement[]): string {
  return JSON.stringify(samples, null, 2);
}
