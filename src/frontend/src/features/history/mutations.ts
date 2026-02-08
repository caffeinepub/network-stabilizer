import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { ConnectivityMeasurement } from '../monitoring/types';
import { measurementToNetworkCheckResult } from './networkHistoryMapper';
import { toast } from 'sonner';

let checkIdCounter = 0;

export function useSaveMeasurement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (measurement: ConnectivityMeasurement) => {
      if (!actor) throw new Error('Actor not available');
      const result = measurementToNetworkCheckResult(measurement, checkIdCounter++);
      return actor.saveNetworkCheckResult(result);
    },
    onError: (error) => {
      console.error('Failed to save measurement:', error);
      toast.error('Failed to save measurement to history');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkHistory'] });
    },
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearNetworkHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkHistory'] });
      toast.success('Network history cleared successfully');
    },
    onError: (error) => {
      console.error('Failed to clear history:', error);
      toast.error('Failed to clear network history');
    },
  });
}
