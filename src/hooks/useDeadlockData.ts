import { useQuery } from '@tanstack/react-query';
import { fetchDeadlockItemsRaw, transformDeadlockItems, fetchDeadlockAbilitiesRaw, transformDeadlockAbilities } from './deadlockApi';

export function useDeadlockData() {
  return useQuery({
    queryKey: ['deadlockItems'],
    queryFn: async () => {
      return fetchDeadlockItemsRaw();
    },
    select: transformDeadlockItems,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

const selectDeadlockAbilities = (data: { abilities: import('deadlock_api_client').Item[], heroMap?: Map<number, string> }) => 
  transformDeadlockAbilities(data.abilities, data.heroMap);

export function useDeadlockAbilitiesData() {
  return useQuery({
    queryKey: ['deadlockAbilities'],
    queryFn: async () => {
      return fetchDeadlockAbilitiesRaw();
    },
    select: selectDeadlockAbilities,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
