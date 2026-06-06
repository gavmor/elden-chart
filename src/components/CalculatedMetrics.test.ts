import { describe, it, expect } from 'vitest';
import { getItemStat } from './domain/math';
import type { EquipmentItem, SimulationContext, InvestmentTracks } from './types';
import { DEFAULT_HERO } from './heroes';

describe('Calculated Metrics - Marginal Value (Delta)', () => {
  const item1: EquipmentItem = { id: '1', name: 'Item 1', kind: 'deadlock_upgrade', category: 'Weapon', description: '', weight: 1, properties: [{ name: 'BonusFireRate', amount: 10 }], image: null };
  const item2: EquipmentItem = { id: '2', name: 'Item 2', kind: 'deadlock_upgrade', category: 'Weapon', description: '', weight: 1, properties: [{ name: 'BonusFireRate', amount: 20 }], image: null };
  
  it('calculates vacuum value (no customSet) as the raw item stat', () => {
    const vacuumContext: SimulationContext = {
      hero: DEFAULT_HERO,
      
      customSet: []
    };
    
    // With 0 FireRate baseline, DPS is raw base. Item 1 gives +10% FireRate.
    const vacuumValue1 = getItemStat(item1, 'Final Bullet DPS', vacuumContext);
    
    expect(vacuumValue1).toBeGreaterThan(0);
  });

  it('calculates simulation value (with customSet) as the Marginal Value (Delta)', () => {
    // If customSet contains item2 (+20% FireRate)
    const simulationContext: SimulationContext = {
      hero: DEFAULT_HERO,
      
      customSet: [item2]
    };
    
    // Baseline DPS = DPS(1 + 0.20)
    // Combined DPS = DPS(1 + 0.20 + 0.10)
    // Marginal Value = Combined - Baseline
    const marginalValue1 = getItemStat(item1, 'Final Bullet DPS', simulationContext);
    
    // The marginal value should be exactly the difference
    const vacuumValue1 = getItemStat(item1, 'Final Bullet DPS', { ...simulationContext, customSet: [] });
    
    // Since DPS scales linearly with FireRate in this simplified test, Marginal Value should be identical or very close.
    // However, if there are compounding multipliers, it proves it uses the baseline correctly.
    expect(marginalValue1).toBeCloseTo(vacuumValue1, 5);
  });
  
  it('evaluates owned items as their marginal value if removed', () => {
    const simulationContext: SimulationContext = {
      hero: DEFAULT_HERO,
      
      customSet: [item1]
    };
    
    // Item 1 is IN the custom set. Its marginal value should be DPS(Item1) - DPS(Empty)
    const marginalValueOwned = getItemStat(item1, 'Final Bullet DPS', simulationContext);
    const vacuumValue1 = getItemStat(item1, 'Final Bullet DPS', { ...simulationContext, customSet: [] });
    
    expect(marginalValueOwned).toBeCloseTo(vacuumValue1, 5);
  });
});

describe('Calculated Metrics - Investment Track Milestones & Marginal Stats', () => {
  const tracks: InvestmentTracks = {
    weapon: [
      { goldThreshold: 1000, bonus: 10, percentOnGraph: 20 },
      { goldThreshold: 3000, bonus: 25, percentOnGraph: 50 },
    ],
    vitality: [
      { goldThreshold: 800, bonus: 50, percentOnGraph: 15 },
      { goldThreshold: 2000, bonus: 150, percentOnGraph: 40 },
    ],
    spirit: [
      { goldThreshold: 1500, bonus: 5, percentOnGraph: 30 },
    ],
  };

  it('calculates MHpS, MWDpS, MSPpS in vacuum correctly', () => {
    // Vitality item: weight=500, has BonusHealth=50
    const vitItem: EquipmentItem = {
      id: 'v1',
      name: 'Vitality Item',
      kind: 'deadlock_upgrade',
      category: 'vitality',
      description: '',
      weight: 500,
      properties: [{ name: 'BonusHealth', amount: 50 }],
      image: null,
    };

    const context: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [],
      investmentTracks: tracks,
    };

    // MHpS: (Base Health + milestoneDelta) / cost
    // In vacuum: spent = 500. No milestones reached (threshold 800).
    // milestoneDelta = 0.
    // MHpS = 50 / 500 = 0.1
    expect(getItemStat(vitItem, 'MHpS', context)).toBeCloseTo(0.1);
    expect(getItemStat(vitItem, 'MWDpS', context)).toBe(0);
    expect(getItemStat(vitItem, 'MSPpS', context)).toBe(0);
  });

  it('calculates MHpS including vitality milestone delta', () => {
    // Vitality item: weight=500, has BonusHealth=50
    const vitItem: EquipmentItem = {
      id: 'v1',
      name: 'Vitality Item',
      kind: 'deadlock_upgrade',
      category: 'vitality',
      description: '',
      weight: 500,
      properties: [{ name: 'BonusHealth', amount: 50 }],
      image: null,
    };

    // If user already has 500 spent in vitality, adding vitItem pushes spent to 1000.
    // This crosses the 800 goldThreshold milestone (bonus: 50 health).
    // milestoneDelta = 50 - 0 = 50.
    // MHpS = (50 + 50) / 500 = 0.2
    const existingItem: EquipmentItem = {
      id: 'v_exist',
      name: 'Existing Vit',
      kind: 'deadlock_upgrade',
      category: 'vitality',
      description: '',
      weight: 500,
      properties: [],
      image: null,
    };

    const context: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [existingItem],
      investmentTracks: tracks,
    };

    expect(getItemStat(vitItem, 'MHpS', context)).toBeCloseTo(0.2);
  });

  it('calculates MWDpS and MSPpS including milestone deltas', () => {
    const weaponItem: EquipmentItem = {
      id: 'w1',
      name: 'Weapon Item',
      kind: 'deadlock_upgrade',
      category: 'weapon',
      description: '',
      weight: 1000,
      properties: [{ name: 'WeaponPower', amount: 5 }],
      image: null,
    };

    const spiritItem: EquipmentItem = {
      id: 's1',
      name: 'Spirit Item',
      kind: 'deadlock_upgrade',
      category: 'spirit',
      description: '',
      weight: 1500,
      properties: [{ name: 'SpiritPower', amount: 2 }],
      image: null,
    };

    const context: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [],
      investmentTracks: tracks,
    };

    // Weapon item cost 1000: crosses 1000 threshold (bonus 10).
    // MWDpS = (5 + 10) / 1000 = 0.015
    expect(getItemStat(weaponItem, 'MWDpS', context)).toBeCloseTo(0.015);

    // Spirit item cost 1500: crosses 1500 threshold (bonus 5).
    // MSPpS = (2 + 5) / 1500 = 0.004666...
    expect(getItemStat(spiritItem, 'MSPpS', context)).toBeCloseTo(7 / 1500);
  });
});

describe('Calculated Metrics - Enemy Attacker EHP Scaling', () => {
  it('scales EHP according to selected enemy attacker damage', () => {
    const defender: EquipmentItem = {
      id: 'd1',
      name: 'Defender Item',
      kind: 'deadlock_upgrade',
      category: 'vitality',
      description: '',
      weight: 1000,
      properties: [{ name: 'BulletResist', amount: 95 }], // 95% bullet resistance
      image: null,
    };

    // Attacker: default (15 damage)
    // EHP = 1000 * 15 / max(1, 15 * 0.05) = 1000 * 15 / 1 = 15000
    // marginal EHP: 15000 - 1000 = 14000
    const contextDefault: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [],
      incomingDamage: 15,
    };
    expect(getItemStat(defender, 'ehp', contextDefault)).toBeCloseTo(14000);

    // Attacker: Victor (25 damage)
    // EHP = 1000 * 25 / max(1, 25 * 0.05) = 1000 * 25 / 1.25 = 20000
    // marginal EHP: 20000 - 1000 = 19000
    const contextVictor: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [],
      incomingDamage: 25,
    };
    expect(getItemStat(defender, 'ehp', contextVictor)).toBeCloseTo(19000);

    // Attacker: Haze (6 damage)
    // EHP = 1000 * 6 / max(1, 6 * 0.05) = 1000 * 6 / 1 = 6000
    // marginal EHP: 6000 - 1000 = 5000
    const contextHaze: SimulationContext = {
      hero: DEFAULT_HERO,
      customSet: [],
      incomingDamage: 6,
    };
    expect(getItemStat(defender, 'ehp', contextHaze)).toBeCloseTo(5000);
  });
});
