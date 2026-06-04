import { useQuery } from '@tanstack/react-query';
import { fetchDeadlockItems, fetchDeadlockAbilities } from './deadlockApi';

export function useDeadlockData() {
  return useQuery({
    queryKey: ['deadlockItems'],
    queryFn: async () => {
      return fetchDeadlockItems();
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useDeadlockAbilitiesData() {
  return useQuery({
    queryKey: ['deadlockAbilities'],
    queryFn: async () => {
      return fetchDeadlockAbilities();
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

