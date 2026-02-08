import { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectivityMeasurement, DerivedMetrics, StabilityStatus } from './types';
import { performConnectivityCheck } from './connectivityCheck';
import { calculateMetrics, classifyStability } from './metrics';
import { useSettings } from '../settings/settingsStorage';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useSaveMeasurement } from '../history/mutations';

const MAX_SAMPLES = 100;

export function useConnectivityMonitor() {
  const [samples, setSamples] = useState<ConnectivityMeasurement[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const settings = useSettings();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const saveMeasurement = useSaveMeasurement();

  const metrics = calculateMetrics(samples);
  const currentStatus = classifyStability(metrics, isOnline);

  const performCheck = useCallback(async (retryCount = 0) => {
    if (!isOnline || isChecking) return;

    setIsChecking(true);

    try {
      const result = await performConnectivityCheck(settings.timeout);
      
      const measurement: ConnectivityMeasurement = {
        timestamp: Date.now(),
        latency: result.latency,
        success: result.success,
        errorCategory: result.errorCategory,
        errorMessage: result.errorMessage,
      };

      setSamples(prev => {
        const updated = [...prev, measurement];
        return updated.slice(-MAX_SAMPLES);
      });

      // Persist if authenticated
      if (isAuthenticated && result.success) {
        saveMeasurement.mutate(measurement);
      }

      // Retry logic for failures
      if (!result.success && retryCount < settings.maxRetries) {
        const delay = settings.backoffBaseDelay * Math.pow(settings.backoffMultiplier, retryCount);
        retryTimeoutRef.current = setTimeout(() => {
          performCheck(retryCount + 1);
        }, delay);
      }
    } catch (error) {
      console.error('Check failed:', error);
    } finally {
      setIsChecking(false);
    }
  }, [isOnline, isChecking, settings, isAuthenticated, saveMeasurement]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Periodic checks
  useEffect(() => {
    if (!isOnline) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial check
    performCheck();

    // Set up interval
    intervalRef.current = setInterval(() => {
      performCheck();
    }, settings.interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [isOnline, settings.interval, performCheck]);

  return {
    samples,
    metrics,
    currentStatus,
    isOnline,
    isChecking,
    isAuthenticated,
  };
}
