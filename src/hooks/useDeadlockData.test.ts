import { describe, it, expect } from 'vitest';
import { selectDeadlockBaselines, selectDeadlockUpgrades } from './useDeadlockData';
import type { Item, Upgrade } from 'deadlock_api_client/models';

describe('useDeadlockData Selectors', () => {
  const defaultTrack = {
    weapon: [
      { goldThreshold: 800, bonus: 4, percentOnGraph: 7 },
    ],
    vitality: [
      { goldThreshold: 800, bonus: 75, percentOnGraph: 7 },
    ],
    spirit: [
      { goldThreshold: 800, bonus: 7, percentOnGraph: 7 },
    ],
  };

  const makeRawUpgrade = (
    id: number,
    category: string,
    cost: number,
    properties: Record<string, { value: string }>
  ): Upgrade => ({
    activation: 'instant_cast' as Upgrade['activation'],
    class_name: `citadel_item_test_${id}`,
    id,
    is_active_item: false,
    item_slot_type: category as import('deadlock_api_client/models').ItemSlotType,
    item_tier: 1,
    name: `Item ${id}`,
    shopable: true,
    type: 'upgrade',
    cost,
    image: 'https://example.com/test.png',
    properties,
  });

  const mockMarketData = {
    rawItems: [
      makeRawUpgrade(1, 'weapon', 500, { WeaponPower: { value: '6' } }),
      makeRawUpgrade(2, 'vitality', 500, { BonusHealth: { value: '125' } }),
      makeRawUpgrade(3, 'spirit', 500, { SpiritPower: { value: '3' } }),
    ] as Item[],
    investmentTracks: defaultTrack,
  };

  it('selectDeadlockUpgrades should correctly map raw items to upgrades', () => {
    const upgrades = selectDeadlockUpgrades(mockMarketData);
    expect(upgrades).toHaveLength(3);
    expect(upgrades[0].id).toBe('1');
    expect(upgrades[0].weight).toBe(500);
  });

  it('selectDeadlockBaselines should compute exchange rates and expose investment milestones via the select transform', () => {
    const result = selectDeadlockBaselines(mockMarketData);
    expect(result.investmentTracks).toEqual(defaultTrack);
    expect(result.exchangeRates.weaponDamage).toBeCloseTo(50.0, 5);
    expect(result.exchangeRates.vitalityHealth).toBeCloseTo(2.5, 5);
    expect(result.exchangeRates.spiritPower).toBeCloseTo(50.0, 5);
  });
});
