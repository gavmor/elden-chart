import { describe, it, expect } from 'vitest';
import { getItemStat } from './utils';
import type { EquipmentItem, SimulationContext } from './types';
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
