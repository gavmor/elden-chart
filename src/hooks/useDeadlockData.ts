import { useQuery } from '@tanstack/react-query';
import { fetchDeadlockItems } from './deadlockApi';

export function useDeadlockData() {
  return useQuery({
    queryKey: ['deadlockItems'],
    queryFn: async () => {
      return fetchDeadlockItems();
    },
  });
}
