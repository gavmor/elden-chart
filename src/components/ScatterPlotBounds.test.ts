import { describe, it, expect } from 'vitest';
import { getStatRangeClamped, getClampedItemStat } from './utils';
import type { EquipmentItem } from './types';

describe('Scatter Plot Outlier Clamping', () => {
	const items: EquipmentItem[] = [
		{ id: '1', name: 'Normal', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 1000, properties: [], image: null }, // eHP = 1000
		{ id: '2', name: 'High', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 2000, properties: [{ name: 'BulletResist', amount: 50 }], image: null }, // eHP = 2000
		{ id: '3', name: 'Infinite', kind: 'deadlock_upgrade', category: 'vitality', description: '', weight: 3000, properties: [{ name: 'BulletResist', amount: 100 }], image: null }, // eHP = Infinity
	];

	it('getStatRangeClamped ignores Infinity when calculating max bound', () => {
		const range = getStatRangeClamped(items, 'ehp');
		// Max should be based on the highest non-Infinity value (2000)
		expect(range.max).toBe(2000);
		expect(range.min).toBe(1000);
	});

	it('getClampedItemStat maps Infinity to the 1.05x clamped max bound', () => {
		// 1.05x of 2000 is 2100
		expect(getClampedItemStat(items[2], 'ehp', 2000)).toBe(2100);
		// Normal values should remain unchanged
		expect(getClampedItemStat(items[0], 'ehp', 2000)).toBe(1000);
	});
});
