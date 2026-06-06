import { describe, it, expect } from 'vitest';
import type { DeadlockUpgradeItem, InvestmentTracks } from '../types';
import { calculateExchangeRates } from './calculateExchangeRates';

describe('calculateExchangeRates', () => {
  const defaultTrack: InvestmentTracks = {
    weapon: [
      { goldThreshold: 800, bonus: 4, percentOnGraph: 7 },
      { goldThreshold: 1600, bonus: 8, percentOnGraph: 7 },
    ],
    vitality: [
      { goldThreshold: 800, bonus: 75, percentOnGraph: 7 },
    ],
    spirit: [
      { goldThreshold: 800, bonus: 7, percentOnGraph: 7 },
    ],
  };

  const makeMockItem = (
    id: string,
    category: string,
    cost: number,
    properties: { name: string; amount: number }[]
  ): DeadlockUpgradeItem => ({
    id,
    name: `Item ${id}`,
    image: null,
    category,
    description: '',
    weight: cost, // cost maps to weight in Deadlock items
    kind: 'deadlock_upgrade',
    properties,
  });

  it('should return default fallback exchange rates when items list is empty', () => {
    const rates = calculateExchangeRates([], defaultTrack);
    expect(rates).toEqual({
      weaponDamage: 50.0,
      vitalityHealth: 2.5,
      spiritPower: 50.0,
    });
  });

  it('should ignore non-Tier 1 items (weight !== 500) and return fallback when no Tier 1 items exist', () => {
    const items = [
      makeMockItem('1', 'weapon', 1250, [{ name: 'WeaponPower', amount: 10 }]),
      makeMockItem('2', 'vitality', 3000, [{ name: 'BonusHealth', amount: 300 }]),
    ];
    const rates = calculateExchangeRates(items, defaultTrack);
    expect(rates).toEqual({
      weaponDamage: 50.0,
      vitalityHealth: 2.5,
      spiritPower: 50.0,
    });
  });

  it('should calculate exchange rates using multivariate linear regression on Tier 1 items', () => {
    // We construct 3 Tier 1 items (each costing 500) where:
    // Item 1 (Weapon): printed WeaponPower = 6.
    //   Track bonus is 4. Total = 6 + 4 = 10 WeaponDamage.
    //   VitalityHealth = 0, SpiritPower = 0.
    //   Expected weapon rate = 500 / 10 = 50
    // Item 2 (Vitality): printed BonusHealth = 125.
    //   Track bonus is 75. Total = 125 + 75 = 200 VitalityHealth.
    //   WeaponDamage = 0, SpiritPower = 0.
    //   Expected vitality rate = 500 / 200 = 2.5
    // Item 3 (Spirit): printed SpiritPower = 3.
    //   Track bonus is 7. Total = 3 + 7 = 10 SpiritPower.
    //   WeaponDamage = 0, VitalityHealth = 0.
    //   Expected spirit rate = 500 / 10 = 50
    const items = [
      makeMockItem('1', 'weapon', 500, [{ name: 'WeaponPower', amount: 6 }]),
      makeMockItem('2', 'vitality', 500, [{ name: 'BonusHealth', amount: 125 }]),
      makeMockItem('3', 'spirit', 500, [{ name: 'SpiritPower', amount: 3 }]),
    ];

    const rates = calculateExchangeRates(items, defaultTrack);
    expect(rates.weaponDamage).toBeCloseTo(50.0, 5);
    expect(rates.vitalityHealth).toBeCloseTo(2.5, 5);
    expect(rates.spiritPower).toBeCloseTo(50.0, 5);
  });
});
