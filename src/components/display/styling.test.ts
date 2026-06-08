import { describe, it, expect } from 'vitest';
import {
        helmItem,
        chestItem,
        } from '../CompareModal/test-fixtures';
import { getItemColor } from './styling';

// Mock getItemStat since getItemColor depends on it

describe('getItemColor', () => {
	it('returns a color derived from category name', () => {
		const color = getItemColor(helmItem, 'category', null);
		expect(color).toMatch(/^hsl\(\d+, 65%, 55%\)$/);
	});

	it('returns different hues for different categories', () => {
		const helmColor = getItemColor(helmItem, 'category', null);
		const chestColor = getItemColor(chestItem, 'category', null);
		expect(helmColor).not.toBe(chestColor);
	});

	it('returns #94a3b8 for a stat when minMax is null', () => {
		expect(getItemColor(helmItem, 'weight', null)).toBe('#94a3b8');
	});

	it('returns a heatmap HSL or RGB color for a stat with range', () => {
		const color = getItemColor(helmItem, 'weight', { min: 0, max: 20 });
		expect(color).toMatch(/^(#|rgb)/);
	});

	it('clamps the ratio between 0 and 1', () => {
		const above = getItemColor(helmItem, 'weight', { min: 0, max: 1 });
		const below = getItemColor(helmItem, 'weight', { min: 10, max: 20 });
		expect(above).toBe('#fde725'); // Viridis 1
		expect(below).toBe('#440154'); // Viridis 0
	});

	it('returns exact hex colors for Deadlock categories', () => {
		const makeDlItem = (category: string): import('../types').DeadlockUpgradeItem => ({
			id: 'dl-1',
			name: 'Test',
			image: null,
			category,
			description: '',
			weight: 0,
			kind: 'deadlock_upgrade',
			properties: []
		});

		expect(getItemColor(makeDlItem('weapon'), 'category', null)).toBe('var(--color-deadlock-weapon)');
		expect(getItemColor(makeDlItem('vitality'), 'category', null)).toBe('var(--color-deadlock-vitality)');
		expect(getItemColor(makeDlItem('spirit'), 'category', null)).toBe('var(--color-deadlock-spirit)');
		expect(getItemColor(makeDlItem('Spirit'), 'category', null)).toBe('var(--color-deadlock-spirit)');
	});
});

// ---------------------------------------------------------------------------
// getItemImageUrl
// ---------------------------------------------------------------------------
