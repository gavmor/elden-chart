import type { EquipmentItem, SimulationContext } from '../types';
import { getItemStat } from '../domain/math';
import { interpolateViridis } from 'd3-scale-chromatic';

export const getHeatmapBg = (value: number, min: number, max: number, invert: boolean): string => {
	const range = max - min;
	if (range === 0) return 'transparent';
	let ratio = (value - min) / range;
	if (invert) ratio = 1 - ratio;
	const hue = Math.round(ratio * 220);
	return `hsl(${hue}, 50%, 22%)`;
};

/**
 * Compute row-wide min/max for a given stat across an array of items.
 */

const hashHue = (str: string): number => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
};

export const getItemColor = (
	item: EquipmentItem,
	colorVar: string,
	minMax: { min: number; max: number } | null,
	context?: SimulationContext
): string => {
	if (colorVar === 'category') {
		if (item.kind === 'deadlock_upgrade') {
			const cat = item.category.toLowerCase();
			if (cat === 'weapon') return 'var(--color-deadlock-weapon)';
			if (cat === 'vitality') return 'var(--color-deadlock-vitality)';
			if (cat === 'spirit') return 'var(--color-deadlock-spirit)';
			if (cat === 'street brawl') return 'var(--color-deadlock-brawl)';
		}
		if (item.kind === 'deadlock_ability') {
			const cat = item.category.toLowerCase();
			if (cat === 'signature') return 'var(--color-deadlock-weapon)';
			if (cat === 'ultimate') return 'var(--color-deadlock-spirit)';
		}
		// Derive consistent hue from category name for dynamic categories
		const hue = hashHue(item.category);
		return `hsl(${hue}, 65%, 55%)`;
	}

	// Otherwise, it's a numerical stat
	const val = getItemStat(item, colorVar, context);
	if (!minMax) return '#94a3b8';

	const { min, max } = minMax;
	const range = max - min || 1;
	const ratio = Math.max(0, Math.min(1, (val - min) / range));

	// Perceptually uniform sequential scale (Viridis)
	return interpolateViridis(ratio);
};

/**
 * Returns the item image URL, falling back to a lucide icon as an SVG data URI if null.
 */
