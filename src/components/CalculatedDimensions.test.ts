import { describe, it, expect } from 'vitest';
import { calculateTotalIntegratedArmor, calculateEffectiveHealth, calculateValueMetric } from './domain/math';

describe('Calculated Dimensions', () => {
	describe('calculateTotalIntegratedArmor', () => {
		it('calculates 0 when no buffs or shreds are present', () => {
			expect(calculateTotalIntegratedArmor([], [])).toBe(0);
		});
		it('calculates sequential multiplicative positive buffs correctly', () => {
			expect(calculateTotalIntegratedArmor([0.25, 0.30, 0.40], [])).toBeCloseTo(0.685);
		});
		it('calculates sequential multiplicative negative shreds correctly', () => {
			expect(calculateTotalIntegratedArmor([], [0.25, 0.10])).toBeCloseTo(-0.325); // wait A = B - N, B=0, N=0.325 => -0.325? No, B=0, N= 1-(0.75*0.9)=1-0.675=0.325. 0 - 0.325 = -0.325
		});
		it('combines positive buffs and negative shreds', () => {
			expect(calculateTotalIntegratedArmor([0.99], [0.25])).toBeCloseTo(0.74);
		});
	});

	describe('calculateEffectiveHealth', () => {
		it('calculates eHP correctly for 0% resistance', () => {
			expect(calculateEffectiveHealth(1000, 0)).toBe(1000);
		});
		it('calculates eHP correctly for 50% resistance', () => {
			expect(calculateEffectiveHealth(1000, 0.50)).toBe(2000);
		});
		it('calculates eHP correctly for 90% resistance', () => {
			expect(calculateEffectiveHealth(1000, 0.90)).toBeCloseTo(10000);
		});

		it('calculates EHP with 1-damage floor engaged at high resistance (e.g. 95% with default 15 damage)', () => {
			expect(calculateEffectiveHealth(1000, 0.95)).toBeCloseTo(15000); // 15 * (1 - 0.95) = 0.75 < 1 => clamped to 1 => 1000 * 15 / 1 = 15000
		});
		it('calculates EHP with 1-damage floor engaged at 100% resistance', () => {
			expect(calculateEffectiveHealth(1000, 1.0)).toBeCloseTo(15000); // capped at Health * Incoming Damage
			expect(calculateEffectiveHealth(1000, 1.5)).toBeCloseTo(15000);
		});
		it('calculates EHP with parameterized incoming damage', () => {
			// e.g. incomingDamage = 30
			expect(calculateEffectiveHealth(1000, 0.95, 30)).toBeCloseTo(20000); // 30 * 0.05 = 1.5 >= 1 => 1000 / 0.05 = 20000
			expect(calculateEffectiveHealth(1000, 0.98, 30)).toBeCloseTo(30000); // 30 * 0.02 = 0.6 < 1 => clamped to 1 => 1000 * 30 / 1 = 30000
		});
		it('handles negative resistance', () => {
			expect(calculateEffectiveHealth(1000, -0.25)).toBe(800);
		});
	});

	describe('calculateValueMetric', () => {
		it('calculates cost-benefit correctly', () => {
			expect(calculateValueMetric(10000, 500)).toBe(20);
		});
		it('returns Infinity when cost is 0 and stat > 0', () => {
			expect(calculateValueMetric(10000, 0)).toBe(Infinity);
		});
		it('returns 0 when stat is 0', () => {
			expect(calculateValueMetric(0, 500)).toBe(0);
		});
	});
});
