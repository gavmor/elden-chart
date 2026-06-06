import { describe, expect, it } from 'vitest';

import {
  calculateBulletDPS,
  calculateSpiritDPS,
  calculateEffectiveResistance,
  calculateEffectiveDPS,
  calculateAmplifiedDamage,
  applyAmmoCeiling,
  calculateSustainedDPS,
  calculateCombinedHybridDPS,
  calculateHybridDPSPerSoul
} from './deadlock-dps';

describe('Deadlock DPS Calculations', () => {
  describe('Bullet DPS', () => {
    it('scales linearly for continuous-fire weapons', () => {
      // Mock continuous fire weapon: shotTime is effectively 1/fireRate, pauseTime is 0.
      const shotTime = 1;
      const pauseTime = 0;
      const fireRateMod = 0.5; // +50% fire rate
      const baseDps = 100;
      
      const dps = calculateBulletDPS(baseDps, shotTime, pauseTime, fireRateMod);
      expect(dps).toBeCloseTo(150); // 100 * 1.5
    });

    it('scales logarithmically for burst-fire weapons (Paradox)', () => {
      // Paradox: shotTime 0.38, pauseTime 0.28
      const shotTime = 0.38;
      const pauseTime = 0.28;
      const fireRateMod = 0.5; // +50%
      const baseDps = 100;

      const dps = calculateBulletDPS(baseDps, shotTime, pauseTime, fireRateMod);
      // Expected multiplier: (0.38 + 0.28) / (0.38 + 0.28 / 1.5) = 0.66 / (0.38 + 0.1866) = 0.66 / 0.5666 = 1.1647
      expect(dps).toBeCloseTo(116.47, 1); 
    });

    it('scales logarithmically for burst-fire weapons (Lash)', () => {
      const shotTime = 0.22;
      const pauseTime = 0.30;
      const fireRateMod = 0.5; 
      const baseDps = 100;

      const dps = calculateBulletDPS(baseDps, shotTime, pauseTime, fireRateMod);
      // Expected multiplier: (0.22 + 0.30) / (0.22 + 0.30 / 1.5) = 0.52 / (0.22 + 0.20) = 0.52 / 0.42 = 1.238
      expect(dps).toBeCloseTo(123.8, 1);
    });

    it('scales logarithmically for burst-fire weapons (Seven)', () => {
      const shotTime = 0.23;
      const pauseTime = 0.29;
      const fireRateMod = 0.5;
      const baseDps = 100;

      const dps = calculateBulletDPS(baseDps, shotTime, pauseTime, fireRateMod);
      // Expected multiplier: (0.23 + 0.29) / (0.23 + 0.29 / 1.5) = 0.52 / (0.23 + 0.1933) = 0.52 / 0.4233 = 1.228
      expect(dps).toBeCloseTo(122.8, 1);
    });
  });

  describe('Spirit DPS', () => {
    it('applies utility multipliers before flat Spirit Power for ranged abilities', () => {
      // Final Range = (Base Range * (1 + Item Modifier)) + (Spirit Power * Range Coefficient)
      const baseValue = 10;
      const modifier = 0.2; // +20%
      const spiritPower = 50;
      const coefficient = 0.1;
      
      const result = calculateSpiritDPS('ranged', baseValue, modifier, spiritPower, coefficient);
      expect(result).toBeCloseTo((10 * 1.2) + (50 * 0.1)); // 12 + 5 = 17
    });

    it('applies utility multipliers after flat Spirit Power for healing/duration abilities', () => {
      // Final Heal/Duration = (Base Value + (Spirit Power * Coefficient)) * (1 + Item Modifier)
      const baseValue = 10;
      const modifier = 0.2; // +20%
      const spiritPower = 50;
      const coefficient = 0.1;
      
      const result = calculateSpiritDPS('healing', baseValue, modifier, spiritPower, coefficient);
      expect(result).toBeCloseTo((10 + (50 * 0.1)) * 1.2); // (10 + 5) * 1.2 = 18
    });
  });

  describe('Effective Final DPS and Resistances', () => {
    it('calculates sequential multiplicative stacking of positive resistances and active shred', () => {
      // A = B - N
      // B = 1 - product(1 - Ri)
      // N = 1 - product(1 - Sj)
      const positiveResistances = [0.2, 0.15]; // 20% and 15%
      const activeShreds = [0.1, 0.05]; // 10% and 5%
      
      const A = calculateEffectiveResistance(positiveResistances, activeShreds);
      // B = 1 - (1-0.2)*(1-0.15) = 1 - (0.8*0.85) = 1 - 0.68 = 0.32
      // N = 1 - (1-0.1)*(1-0.05) = 1 - (0.9*0.95) = 1 - 0.855 = 0.145
      // A = 0.32 - 0.145 = 0.175
      expect(A).toBeCloseTo(0.175);
    });

    it('calculates Effective DPS by reducing raw damage by Final Active Resistance', () => {
      const rawDamage = 1000;
      const finalActiveResistance = 0.175; // 17.5% resistance
      
      const dps = calculateEffectiveDPS(rawDamage, finalActiveResistance);
      expect(dps).toBeCloseTo(825); // 1000 * (1 - 0.175)
    });
  });

  describe('Double-Mitigation Amplified Damage', () => {
    it('applies target resistance twice for Escalating Exposure', () => {
      const baseDamage = 100;
      const ampFromEE = 0.12; // 12% amplification (e.g. 2 stacks of 6%)
      const targetResistance = 0.25; // 25% resistance
      
      const damage = calculateAmplifiedDamage(baseDamage, ampFromEE, targetResistance);
      // Expected formula: ((Amp From EE) * (Res Modifier) + 1) * (Res Modifier) * (Base Damage)
      // ((0.12 * 0.75) + 1) * 0.75 * 100 = 81.75
      expect(damage).toBeCloseTo(81.75);
    });
  });

  describe('Ammo Ceiling Function', () => {
    it('rounds up partial ammunition strictly', () => {
      expect(applyAmmoCeiling(46.2)).toBe(47);
      expect(applyAmmoCeiling(46.0)).toBe(46);
      expect(applyAmmoCeiling(46.8)).toBe(47);
    });
  });
  describe('Sustained DPS and Reload Bypass', () => {
    it('calculates standard sustained DPS', () => {
      const bulletDamage = 10;
      const fireRate = 5; // 5 bullets per second
      const magazineSize = 20;
      const reloadTime = 2.0;
      
      const dps = calculateSustainedDPS(bulletDamage, fireRate, magazineSize, reloadTime);
      // Time to empty = 20 / 5 = 4s. Total time = 4 + 2 = 6s. Total damage = 200. DPS = 200 / 6 = 33.33
      expect(dps).toBeCloseTo(33.33);
    });

    it('calculates sustained DPS with Active Reload (faster reload)', () => {
      const bulletDamage = 10;
      const fireRate = 5; 
      const magazineSize = 20;
      const reloadTime = 2.0;
      const activeReloadTime = 1.0; 
      
      const dps = calculateSustainedDPS(bulletDamage, fireRate, magazineSize, reloadTime, 0, activeReloadTime);
      // Total time = 4 + 1 = 5s. Total damage = 200. DPS = 200 / 5 = 40
      expect(dps).toBeCloseTo(40);
    });

    it('treats reload bypass as a continuous magazine to sustain buffs', () => {
      const bulletDamage = 10;
      const fireRate = 5;
      const magazineSize = 20;
      const reloadTime = 2.0;
      const bypassCount = 1; // E.g., Quicksilver Reload
      
      const dps = calculateSustainedDPS(bulletDamage, fireRate, magazineSize, reloadTime, bypassCount);
      // Effective magazine = 40. Time to empty = 40 / 5 = 8s. Total time = 8 + 2 = 10s. Total damage = 400. DPS = 400 / 10 = 40
      expect(dps).toBeCloseTo(40);
    });
  });

  describe('Combined Hybrid DPS', () => {
    it('bifurcates physical bullet damage and on-hit spirit damage correctly', () => {
      const physicalDPS = 100;
      const spiritOnHitDPS = 50; 
      const targetPhysicalResist = 0.2; // 20%
      const targetSpiritResist = 0.1; // 10%
      
      const totalDPS = calculateCombinedHybridDPS(
        physicalDPS, 
        spiritOnHitDPS, 
        targetPhysicalResist, 
        targetSpiritResist
      );
      // Expected: (100 * 0.8) + (50 * 0.9) = 80 + 45 = 125
      expect(totalDPS).toBeCloseTo(125);
    });

    it('ensures spirit damage bypasses physical immunities (Metal Skin)', () => {
      const physicalDPS = 100;
      const spiritOnHitDPS = 50; 
      const targetPhysicalResist = 1.0; // 100% immune (Metal Skin)
      const targetSpiritResist = 0.0; // 0%
      
      const totalDPS = calculateCombinedHybridDPS(
        physicalDPS, 
        spiritOnHitDPS, 
        targetPhysicalResist, 
        targetSpiritResist
      );
      // Expected: (100 * 0) + (50 * 1.0) = 50
      expect(totalDPS).toBeCloseTo(50);
    });

    it('calculates Combined Hybrid DPS per Soul', () => {
      const totalDPS = 125;
      const soulCost = 3000;
      
      const dpsPerSoul = calculateHybridDPSPerSoul(totalDPS, soulCost);
      // Expected: 125 / 3000 = 0.04166
      expect(dpsPerSoul).toBeCloseTo(125 / 3000);
    });
  });
});
