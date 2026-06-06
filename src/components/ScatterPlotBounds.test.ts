import { describe, it, expect } from 'vitest';
import { getStatRangeClamped, getClampedItemStat } from './domain/math';
import type { EquipmentItem } from './types';

describe('Scatter Plot Outlier Clamping', () => {
	const items: EquipmentItem[] = [
		{ id: '1', name: 'Normal', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 1000, properties: [{ name: 'BonusHealth', amount: 100 }], image: null }, // Marginal eHP = 100, ehp_per_soul = 0.1
		{ id: '2', name: 'High', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 2000, properties: [{ name: 'BonusHealth', amount: 400 }], image: null }, // Marginal eHP = 400, ehp_per_soul = 0.2
		{ id: '3', name: 'Infinite', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 0, properties: [{ name: 'BonusHealth', amount: 100 }], image: null }, // Marginal eHP = 100, ehp_per_soul = Infinity
	];

	it('getStatRangeClamped ignores Infinity when calculating max bound', () => {
		const range = getStatRangeClamped(items, 'ehp_per_soul');
		// Max should be based on the highest non-Infinity value (0.2)
		expect(range.max).toBeCloseTo(0.2);
		expect(range.min).toBeCloseTo(0.1);
	});

	it('getClampedItemStat maps Infinity to the 1.05x clamped max bound', () => {
		// 1.05x of 0.2 is 0.21
		expect(getClampedItemStat(items[2], 'ehp_per_soul', 0.2)).toBeCloseTo(0.21);
		// Normal values should remain unchanged
		expect(getClampedItemStat(items[0], 'ehp_per_soul', 0.2)).toBeCloseTo(0.1);
	});
});
