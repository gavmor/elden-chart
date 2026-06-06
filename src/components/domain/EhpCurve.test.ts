import { describe, it, expect } from 'vitest';
import { generateEhpCurve } from './EhpCurve';

describe('EHP Curve Coordinates Generation', () => {
  it('generates a standard exponential curve without damage floor', () => {
    const curve = generateEhpCurve(1000, 0.5, 5);
    expect(curve).toHaveLength(6); // 0, 0.1, 0.2, 0.3, 0.4, 0.5
    
    // At 0% resistance, EHP = 1000
    expect(curve[0].resistance).toBe(0);
    expect(curve[0].ehp).toBe(1000);
    
    // At 50% resistance, EHP = 1000 / 0.5 = 2000
    expect(curve[5].resistance).toBe(0.5);
    expect(curve[5].ehp).toBeCloseTo(2000);
  });

  it('generates a curve respecting the 1-damage floor if incomingDamage is provided', () => {
    // baseHealth 1000, maxRes 0.9, damage 5
    // At 0.9 resistance, remaining damage is 5 * 0.1 = 0.5.
    // The floor kicks in, damage is 1.
    // EHP = (1000 / 1) * 5 = 5000.
    const curve = generateEhpCurve(1000, 0.9, 9, 5);
    
    expect(curve[9].resistance).toBe(0.9);
    expect(curve[9].ehp).toBe(5000);
    
    // Without floor, EHP at 0.9 would be 1000 / 0.1 = 10000.
    // Ensure the floor caps the EHP at 5000.
  });
});
