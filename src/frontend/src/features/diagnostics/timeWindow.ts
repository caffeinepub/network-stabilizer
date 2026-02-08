export type TimeWindow = '15m' | '1h' | '24h';

const TIME_WINDOWS: Record<TimeWindow, number> = {
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
};

export function filterByTimeWindow<T extends { timestamp: number }>(
  items: T[],
  window: TimeWindow
): T[] {
  const now = Date.now();
  const cutoff = now - TIME_WINDOWS[window];
  return items.filter(item => item.timestamp >= cutoff);
}
