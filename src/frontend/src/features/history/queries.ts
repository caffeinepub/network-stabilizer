import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { NetworkCheckResult } from '@/backend';

export function useGetNetworkHistory() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<NetworkCheckResult[]>({
    queryKey: ['networkHistory'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getUserNetworkHistory(principal, BigInt(100));
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}
