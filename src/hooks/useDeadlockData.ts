import { useQuery } from '@tanstack/react-query';
import {
  fetchDeadlockItemsRaw,
  transformDeadlockItems,
  fetchDeadlockAbilitiesRaw,
  transformDeadlockAbilities,
  fetchDeadlockInvestmentTracks,
} from './deadlockApi';
import { calculateExchangeRates } from '../components/domain/calculateExchangeRates';
import type { ExchangeRates } from '../components/domain/calculateExchangeRates';
import type { DeadlockUpgradeItem, InvestmentTracks } from '../components/types';
import type { Item } from 'deadlock_api_client/models';

export interface DeadlockMarketData {
  rawItems: Item[];
  investmentTracks: InvestmentTracks;
}

export interface DeadlockBaselines {
  exchangeRates: ExchangeRates;
  investmentTracks: InvestmentTracks;
}

/**
 * Selector to extract and transform raw items to Deadlock upgrades.
 */
export const selectDeadlockUpgrades = (data: DeadlockMarketData): DeadlockUpgradeItem[] => {
  return transformDeadlockItems(data.rawItems);
};

/**
 * Selector to calculate baseline exchange rates and extract investment milestones.
 */
export const selectDeadlockBaselines = (data: DeadlockMarketData): DeadlockBaselines => {
  const items = transformDeadlockItems(data.rawItems);
  const exchangeRates = calculateExchangeRates(items, data.investmentTracks);
  return {
    exchangeRates,
    investmentTracks: data.investmentTracks,
  };
};

/**
 * Fetches raw items and investment tracks from the Deadlock API.
 */
export const fetchDeadlockMarketData = async (): Promise<DeadlockMarketData> => {
  const [rawItems, investmentTracks] = await Promise.all([
    fetchDeadlockItemsRaw(),
    fetchDeadlockInvestmentTracks(),
  ]);
  return { rawItems, investmentTracks };
};

/**
 * Hook to fetch and select Deadlock upgrades.
 */
export function useDeadlockData() {
  return useQuery({
    queryKey: ['deadlockMarketData'],
    queryFn: fetchDeadlockMarketData,
    select: selectDeadlockUpgrades,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

const selectDeadlockAbilities = (data: { abilities: Item[]; heroMap?: Map<number, string> }) =>
  transformDeadlockAbilities(data.abilities, data.heroMap);

/**
 * Hook to fetch and select Deadlock abilities.
 */
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

/**
 * Hook to fetch and calculate Deadlock baseline exchange rates and investment milestones.
 */
export function useDeadlockBaselines() {
  return useQuery({
    queryKey: ['deadlockMarketData'],
    queryFn: fetchDeadlockMarketData,
    select: selectDeadlockBaselines,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
