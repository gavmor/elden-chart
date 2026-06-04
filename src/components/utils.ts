import type { LucideProps } from 'lucide-react';
import { Circle, Footprints, Hand, HardHat, Shield, Shirt, Sword, Target } from 'lucide-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as R from 'remeda';
import type { EquipmentItem, EquipmentKind, StatOption, SimulationContext } from './types';
import { calculateBulletDPS, calculateSpiritDPS, calculateEffectiveResistance, calculateEffectiveDPS } from './deadlock-dps';

const DeadlockWeaponIcon = (props: { color?: string; size?: number | string }) => createElement('svg', {
	width: props.size || 24, height: props.size || 24, viewBox: '0 0 128 128', fill: 'none', xmlns: 'http://www.w3.org/2000/svg',
	dangerouslySetInnerHTML: { __html: `<path d="M32.0027 9C40.8042 9 48.6533 13.3022 53.7875 20.0238H53.7766C57.1324 24.4142 58.5664 26.6091 59.9993 26.6084C61.4318 26.6078 62.8632 24.4129 66.2125 20.0238C71.3467 13.3022 79.1958 9 87.9973 9C103.466 9 116 22.2789 116 38.6558C116 38.7707 115.999 38.8854 115.998 39H4.00155C4.00052 38.8854 4 38.7707 4 38.6558C4 22.2789 16.5345 9 32.0027 9Z" fill="${props.color || 'currentColor'}"/><path d="M24.5608 79C27.3761 82.0873 30.3317 85.1748 33.3264 88.303C41.7966 97.1509 50.5788 106.325 57.3782 116.742C58.8889 119.051 61.1111 119.051 62.6218 116.742C69.4174 106.328 78.1987 97.1556 86.6692 88.3073C89.6652 85.1778 92.6222 82.0889 95.4388 79H24.5608Z" fill="${props.color || 'currentColor'}"/><path d="M123 59.0055C123 59.0055 117.403 49 100.88 49H75V69H100.88C117.413 69 123 58.9945 123 58.9945V59.0055Z" fill="${props.color || 'currentColor'}"/><path d="M67 57C68.1046 57 69 57.8954 69 59C69 60.1046 68.1046 61 67 61H7C5.89543 61 5 60.1046 5 59C5 57.8954 5.89543 57 7 57H67Z" fill="${props.color || 'currentColor'}"/>` }
});

const DeadlockVitalityIcon = (props: { color?: string; size?: number | string }) => createElement('svg', {
	width: props.size || 24, height: props.size || 24, viewBox: '0 0 128 128', fill: 'none', xmlns: 'http://www.w3.org/2000/svg',
	dangerouslySetInnerHTML: { __html: `<path d="M57.7814 20.0248C55.2511 16.6262 51.9662 13.8614 48.1855 11.9483C44.4048 10.0351 40.2316 9.02587 35.9945 9C20.5247 9 8 22.2802 8 38.6586C8 68.2954 42.4102 87.6846 61.3834 116.752C62.8833 119.062 65.1167 119.062 66.6166 116.752C85.5898 87.6846 120 68.2954 120 38.6586C120 22.2364 107.475 9 92.0055 9C87.7684 9.02587 83.5952 10.0351 79.8145 11.9483C76.0338 13.8614 72.7489 16.6262 70.2186 20.0248C63.5183 28.7943 64.4817 28.7943 57.7814 20.0248Z" fill="${props.color || 'currentColor'}"/>` }
});

const DeadlockSpiritIcon = (props: { color?: string; size?: number | string }) => createElement('svg', {
	width: props.size || 24, height: props.size || 24, viewBox: '0 0 128 128', fill: 'none', xmlns: 'http://www.w3.org/2000/svg',
	dangerouslySetInnerHTML: { __html: `<path fill-rule="evenodd" clip-rule="evenodd" d="M66.2532 6.37122C65.2804 4.54292 62.7195 4.54293 61.7471 6.37122L44.1015 39.5393C43.7322 40.233 43.0786 40.7202 42.3208 40.8656L6.09636 47.8197C4.0996 48.2031 3.30824 50.6996 4.70387 52.2131L30.0227 79.6659C30.5523 80.2401 30.8021 81.0281 30.7029 81.8119L25.9605 119.278C25.6991 121.343 27.7709 122.886 29.6061 121.993L62.8996 105.792C63.5958 105.453 64.4041 105.453 65.1007 105.792L98.3941 121.993C100.229 122.886 102.301 121.343 102.039 119.278L97.2971 81.8119C97.198 81.0281 97.4478 80.2401 97.9775 79.6659L123.296 52.2131C124.692 50.6996 123.9 48.2031 121.904 47.8197L85.6794 40.8656C84.9216 40.7202 84.2676 40.233 83.8987 39.5393L66.2532 6.37122ZM61.591 25.1546C62.4149 22.8569 65.585 22.8569 66.4088 25.1546L74.0468 46.4571C74.0262 46.6577 74.0427 46.8669 74.1027 47.0765L80.7174 70.2705C81.0437 71.4137 82.4267 71.8103 83.2841 71.0064L89.8403 64.8601C90.2444 64.4812 90.4268 63.9135 90.3212 63.3625L88.2169 52.3689H105.054C107.473 52.3689 108.549 55.4865 106.667 57.0454L88.2542 72.3055C88.002 72.3447 87.7539 72.4484 87.5329 72.6233L68.8712 87.3875C67.9513 88.1151 68.0948 89.5801 69.1376 90.1057L77.1093 94.1261C77.6011 94.3739 78.1829 94.3413 78.6453 94.0398L87.1338 88.5041L91.7117 104.982C92.3741 107.366 89.7479 109.28 87.7692 107.856L65.4784 91.817C65.1775 91.6009 64.8427 91.4579 64.4968 91.3885L49.094 80.6881C48.1185 80.0104 46.79 80.6347 46.6536 81.8342L45.6334 90.8129C45.5701 91.3705 45.7949 91.9218 46.2268 92.2674L53.6701 98.2257L40.3621 107.852C38.3884 109.28 35.7592 107.376 36.4112 104.992L43.1392 80.3897C43.1792 80.3161 43.2113 80.236 43.2337 80.1503L49.1451 57.6041C49.3367 56.8737 48.7365 56.1808 48.0061 56.2894L38.1921 57.7505C37.809 57.8078 37.4899 58.0808 37.3666 58.4569L34.247 67.9728L21.4828 57.6794C19.5888 56.152 20.607 53.0327 23.0163 52.9813L48.6012 52.4376C48.6776 52.4473 48.7558 52.4511 48.835 52.4491L69.3532 51.9036C70.4695 51.8738 71.1996 50.6927 70.7491 49.6451L67.0293 40.995C66.7781 40.411 66.2149 40.0346 65.5925 40.0346H56.256L61.591 25.1546Z" fill="${props.color || 'currentColor'}"/>` }
});

export const getCategoryIcon = (category: string, kind: EquipmentKind, props: LucideProps) => {
	if (kind === 'weapon') return createElement(Sword, props);
	if (kind === 'shield') return createElement(Shield, props);
	if (kind === 'ammo') return createElement(Target, props);
	if (kind === 'deadlock_upgrade' || kind === 'deadlock_ability') {
		const overrideColor = props.color ? String(props.color) : 'currentColor';
		if (category === 'weapon' || category === 'signature') return createElement(DeadlockWeaponIcon, { color: overrideColor, size: props.size });
		if (category === 'spirit' || category === 'ultimate') return createElement(DeadlockSpiritIcon, { color: overrideColor, size: props.size });
		return createElement(DeadlockVitalityIcon, { color: overrideColor, size: props.size });
	}

	// Armor categories
	switch (category) {
		case 'Helm': return createElement(HardHat, props);
		case 'Chest Armor': return createElement(Shirt, props);
		case 'Gauntlets': return createElement(Hand, props);
		case 'Leg Armor': return createElement(Footprints, props);
		default: return createElement(Circle, props);
	}
};

const statCache = new Map<string, number>();

export const clearStatCache = () => statCache.clear();

const computeItemStat = (item: EquipmentItem, statName: string, context?: SimulationContext): number => {
	if (statName === 'weight') return item.weight;

	// Helper to get combined items (custom set + current item if not already in it)
	const getCombinedItems = () => {
		if (!context) return [item];
		const isInSet = context.customSet.some(i => i.id === item.id);
		return isInSet ? context.customSet : [...context.customSet, item];
	};

	// Helper to get baseline items (custom set WITHOUT the current item, to compute Marginal Value)
	const getBaselineItems = () => {
		if (!context) return [];
		const isInSet = context.customSet.some(i => i.id === item.id);
		return isInSet ? context.customSet.filter(i => i.id !== item.id) : context.customSet;
	};

	if (statName === 'Final Bullet DPS') {
		if (!context || item.kind !== 'deadlock_upgrade') return 0;

		const calcBulletDps = (itemsList: EquipmentItem[]) => {
			let fireRateMod = 0;
			const bulletResistShreds: number[] = [];
			for (const it of itemsList) {
				fireRateMod += (getItemStat(it, 'FireRate') || getItemStat(it, 'BonusFireRate') || 0) / 100;
				const brs = getItemStat(it, 'BulletResistReduction') || getItemStat(it, 'BulletResistShred') || 0;
				if (brs !== 0) bulletResistShreds.push(Math.abs(brs) / 100);
			}
			const rawBulletDps = calculateBulletDPS(100, context.hero.shotTime, context.hero.pauseTime, fireRateMod);
			const finalBulletRes = calculateEffectiveResistance([0], bulletResistShreds);
			return calculateEffectiveDPS(rawBulletDps, finalBulletRes);
		};

		return calcBulletDps(getCombinedItems()) - calcBulletDps(getBaselineItems());
	}

	if (statName === 'Final Spirit DPS') {
		if (!context || item.kind !== 'deadlock_upgrade') return 0;
		
		const calcSpiritDps = (itemsList: EquipmentItem[]) => {
			let spiritPower = 0;
			let spiritDamageMod = 0;
			const spiritResistShreds: number[] = [];
			for (const it of itemsList) {
				spiritPower += getItemStat(it, 'AbilityPower') || getItemStat(it, 'BonusSpiritPower') || getItemStat(it, 'SpiritPower') || 0;
				spiritDamageMod += (getItemStat(it, 'BonusSpiritDamage') || getItemStat(it, 'SpiritDamage') || 0) / 100;
				const srs = getItemStat(it, 'SpiritResistReduction') || getItemStat(it, 'SpiritResistShred') || 0;
				if (srs !== 0) spiritResistShreds.push(Math.abs(srs) / 100);
			}
			const rawSpiritDps = calculateSpiritDPS('ranged', 100, spiritDamageMod, spiritPower, 1.0);
			const finalSpiritRes = calculateEffectiveResistance([0], spiritResistShreds);
			return calculateEffectiveDPS(rawSpiritDps, finalSpiritRes);
		};

		return calcSpiritDps(getCombinedItems()) - calcSpiritDps(getBaselineItems());
	}

	if (statName === 'ehp') {
		const calcEhp = (itemsList: EquipmentItem[]) => {
			const setBonusHealth = itemsList.reduce((acc, it) => acc + (getItemStat(it, 'BonusHealth') || 0), 0);
			const baseHealth = 1000 + setBonusHealth;
			const setBulletResist = itemsList.reduce((acc, it) => acc + (getItemStat(it, 'BulletResist') || 0), 0);
			return calculateEffectiveHealth(baseHealth, setBulletResist / 100);
		};
		return calcEhp(getCombinedItems()) - calcEhp(getBaselineItems());
	}
	
	if (statName === 'integrated_armor') {
		const calcIntegratedArmor = (itemsList: EquipmentItem[]) => {
			const bulletResists: number[] = [];
			const spiritResists: number[] = [];
			const bulletShreds: number[] = [];
			const spiritShreds: number[] = [];
			
			for (const it of itemsList) {
				const br = getItemStat(it, 'BulletResist') || 0;
				if (br > 0) bulletResists.push(br / 100);
				const sr = getItemStat(it, 'SpiritResist') || 0;
				if (sr > 0) spiritResists.push(sr / 100);
				
				const bs = getItemStat(it, 'BulletResistReduction') || 0;
				if (bs !== 0) bulletShreds.push(Math.abs(bs) / 100);
				const ss = getItemStat(it, 'SpiritResistReduction') || 0;
				if (ss !== 0) spiritShreds.push(Math.abs(ss) / 100);
			}
			
			const buffs = [...bulletResists, ...spiritResists];
			const shreds = [...bulletShreds, ...spiritShreds];
			return calculateTotalIntegratedArmor(buffs, shreds);
		};
		return calcIntegratedArmor(getCombinedItems()) - calcIntegratedArmor(getBaselineItems());
	}
	
	if (statName === 'ehp_per_soul') {
		// ehp_per_soul is derived directly from the marginal ehp value
		const marginalEhp = getItemStat(item, 'ehp', context);
		return calculateValueMetric(marginalEhp, item.weight);
	}

	const getAmount = R.prop('amount');

	if (item.kind === 'deadlock_upgrade' || item.kind === 'deadlock_ability') {
		if (statName === 'total_negation') {
			return R.sumBy(item.properties, getAmount);
		}
		return R.find(item.properties, s => s.name === statName)?.amount ?? 0;
	}

	switch (statName) {
		case 'total_attack':
			return item.kind === 'armor' ? 0 : R.sumBy(item.attack, getAmount);
		case 'total_defence':
			return (item.kind === 'armor' || item.kind === 'ammo') ? 0 : R.sumBy(item.defence, getAmount);
		case 'total_negation':
			return item.kind !== 'armor' ? 0 : R.sumBy(item.dmgNegation, getAmount);
		case 'total_resistance':
			return item.kind !== 'armor' ? 0 : R.pipe(
				item.resistance,
				R.filter(s => s.name !== 'Poise'),
				R.sumBy(getAmount)
			);
	}

	return getGenericStat(item, statName);
};

export const getItemStat = (item: EquipmentItem, statName: string, context?: SimulationContext): number => {
	// Fast path: Only cache calculated metrics that use context
	if (!context || !['Final Bullet DPS', 'Final Spirit DPS', 'ehp', 'integrated_armor', 'ehp_per_soul'].includes(statName)) {
		return computeItemStat(item, statName, context);
	}

	const customSetKey = context.customSet.length > 0 ? context.customSet.map(i => i.id).sort().join(',') : 'empty';
	const cacheKey = `${item.id}:${statName}:${context.hero?.name || 'none'}:${customSetKey}`;
	
	if (statCache.has(cacheKey)) {
		return statCache.get(cacheKey)!;
	}

	const val = computeItemStat(item, statName, context);
	
	if (statCache.size > 5000) statCache.clear();
	statCache.set(cacheKey, val);
	
	return val;
};

const getGenericStat = (item: EquipmentItem, statName: string): number => {
	// Search in attack
	if ('attack' in item && item.attack) {
		const found = item.attack.find((s: { name: string, amount: number }) => s.name === statName);
		if (found) return found.amount;
	}
	// Search in defence
	if ('defence' in item && item.defence) {
		const found = item.defence.find((s: { name: string, amount: number }) => s.name === statName);
		if (found) return found.amount;
	}
	// Search in dmgNegation
	if ('dmgNegation' in item && item.dmgNegation) {
		const found = item.dmgNegation.find((s: { name: string, amount: number }) => s.name === statName);
		if (found) return found.amount;
	}
	// Search in resistance
	if ('resistance' in item && item.resistance) {
		const found = item.resistance.find((s: { name: string, amount: number }) => s.name === statName);
		if (found) return found.amount;
	}
	return 0;
};

/**
 * Row-normalized heatmap background: cool (blue) to warm (red) via HSL hue sweep.
 * invert=true means lower values get warm colors (used for weight).
 */
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
export const getStatRange = (items: EquipmentItem[], statName: string, context?: SimulationContext): { min: number; max: number } => {
	const vals = items.map(item => getItemStat(item, statName, context));
	return { min: Math.min(...vals), max: Math.max(...vals) };
};

export const getStatRangeClamped = (items: EquipmentItem[], statName: string, context?: SimulationContext): { min: number; max: number } => {
	const vals = items.map(item => getItemStat(item, statName, context)).filter(val => val !== Infinity && val !== -Infinity);
	if (vals.length === 0) return { min: 0, max: 0 };
	return { min: Math.min(...vals), max: Math.max(...vals) };
};

export const getClampedItemStat = (item: EquipmentItem, statName: string, maxBound: number, context?: SimulationContext): number => {
	const val = getItemStat(item, statName, context);
	if (val === Infinity) return maxBound * 1.05;
	if (val === -Infinity) return maxBound * -1.05;
	return val;
};

/**
 * Simple hash function to derive a consistent hue from a category name.
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

	// Heatmap gradient: Red (worse, hue 0) ➔ Orange ➔ Yellow ➔ Green ➔ Cyan ➔ Blue (better, hue 220)
	const hue = Math.round(ratio * 220);
	return `hsl(${hue}, 85%, 60%)`;
};

/**
 * Returns the item image URL, falling back to a lucide icon as an SVG data URI if null.
 */
const dataUriCache = new Map<React.ComponentType<LucideProps>, Map<string, string>>();

const iconToDataUri = (icon: React.ComponentType<LucideProps>, color: string): string => {
	let colorMap = dataUriCache.get(icon);
	if (!colorMap) {
		colorMap = new Map<string, string>();
		dataUriCache.set(icon, colorMap);
	}
	const cached = colorMap.get(color);
	if (cached !== undefined) return cached;

	const element = icon.name?.includes('Deadlock')
		? createElement(icon, { size: 24, color })
		: createElement(icon, { size: 24, color, strokeWidth: 2, absoluteStrokeWidth: true });
	
	const svg = renderToStaticMarkup(element);
	const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	colorMap.set(color, uri);
	return uri;
};

export const getItemImageUrl = (item: EquipmentItem, color: string): string => {
	if (item.image) return item.image;

	if (item.kind === 'weapon') return iconToDataUri(Sword, color);
	if (item.kind === 'shield') return iconToDataUri(Shield, color);
	if (item.kind === 'ammo') return iconToDataUri(Target, color);
	if (item.kind === 'deadlock_upgrade' || item.kind === 'deadlock_ability') {
		if (item.category === 'weapon' || item.category === 'signature') return iconToDataUri(DeadlockWeaponIcon as unknown as React.ComponentType<unknown>, color);
		if (item.category === 'spirit' || item.category === 'ultimate') return iconToDataUri(DeadlockSpiritIcon as unknown as React.ComponentType<unknown>, color);
		return iconToDataUri(DeadlockVitalityIcon as unknown as React.ComponentType<unknown>, color);
	}

	switch (item.category) {
		case 'Helm': return iconToDataUri(HardHat, color);
		case 'Chest Armor': return iconToDataUri(Shirt, color);
		case 'Gauntlets': return iconToDataUri(Hand, color);
		case 'Leg Armor': return iconToDataUri(Footprints, color);
		default: return iconToDataUri(Circle, color);
	}
};

/**
 * Calculates the Pareto frontier for a set of items based on dynamic xVar and yVar.
 * X is considered cost to minimize if xVar is 'weight', otherwise it is maximized.
 * Y is considered cost to minimize if yVar is 'weight', otherwise it is maximized.
 */
export const getParetoFrontier = (
	items: EquipmentItem[],
	xVar: string,
	yVar: string,
	context?: SimulationContext
): EquipmentItem[] => {
	if (items.length === 0) return [];

	const minX = xVar === 'weight';
	const minY = yVar === 'weight';

	const signX = minX ? 1 : -1;
	const signY = minY ? 1 : -1;

	// Pre-compute coordinates to avoid N^2 evaluate calls
	const mapped = items.map(item => ({
		item,
		x: getItemStat(item, xVar, context),
		y: getItemStat(item, yVar, context)
	}));

	mapped.sort((a, b) => {
		if (a.x !== b.x) return (a.x - b.x) * signX;
		return (a.y - b.y) * signY;
	});

	const frontier: typeof mapped = [];
	let bestYSeen = minY ? Infinity : -Infinity;
	let lastKept: typeof mapped[0] | null = null;

	for (const p of mapped) {
		const isStrictlyBetterY = minY ? p.y < bestYSeen : p.y > bestYSeen;
		const isIdenticalToLast = lastKept !== null && p.x === lastKept.x && p.y === lastKept.y;

		if (isStrictlyBetterY || isIdenticalToLast) {
			frontier.push(p);
			if (isStrictlyBetterY) {
				bestYSeen = p.y;
			}
			lastKept = p;
		}
	}

	// Plot.line requires items to be sorted consistently for drawing (e.g. by X ascending)
	frontier.sort((a, b) => {
		if (a.x !== b.x) return a.x - b.x;
		return a.y - b.y;
	});

	return frontier.map(p => p.item);
};

/**
 * Pretty-print a stat name for display.
 */
const STAT_NAME_LABELS: Record<string, string> = {
	Phy: 'Physical',
	Strike: 'Strike',
	Slash: 'Slash',
	Pierce: 'Pierce',
	Magic: 'Magic',
	Mag: 'Magic',
	Fire: 'Fire',
	Ligt: 'Lightning',
	Holy: 'Holy',
	Crit: 'Critical',
	Boost: 'Boost',
	Sorc: 'Sorcery Scaling',
	Inc: 'Incantation Scaling',
	Immunity: 'Immunity',
	Robustness: 'Robustness',
	Focus: 'Focus',
	Vitality: 'Vitality',
	Poise: 'Poise',
};

const formatStatName = (name: string, suffix?: string): string => {
	const base = STAT_NAME_LABELS[name] || name;
	return suffix ? `${base} ${suffix}` : base;
};

/**
 * Collect unique stat names from items for a given accessor function.
 */
export const collectStatNames = (
	items: EquipmentItem[],
	accessor: (item: EquipmentItem) => { name: string }[]
): string[] => {
	const names = R.flatMap(items, item => R.map(accessor(item), R.prop('name')));
	return R.unique(names);
};


export const buildGroup = (
	names: string[],
	totalId: string,
	totalLabel: string,
	group: string,
	suffix?: string
): StatOption[] => {
	if (names.length === 0) return [];
	return [
		{ id: totalId, label: totalLabel, group },
		...R.map(names, id => ({
			id, label: formatStatName(id, suffix), group
		}))
	];
};

const toTitleCase = (s: string): string =>
	s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Generates dynamic stat options based on which equipment kinds are present.
 * Stat names are derived from the actual item data — not hardcoded.
 * When armor and weapons/shields are mixed, only weight is offered (incompatible stat systems).
 */
export const getAvailableStats = (items: EquipmentItem[]): StatOption[] => {
	if (items.length === 0) return [];

	const weightKey = 'weight' satisfies keyof EquipmentItem;
	const weightStat: StatOption = { id: weightKey, label: toTitleCase(weightKey), group: 'General' };

	const hasArmor = items.some(i => i.kind === 'armor');
	const hasWeaponLike = items.some(i => i.kind === 'weapon' || i.kind === 'shield' || i.kind === 'ammo');
	const hasDeadlockUpgrade = items.some(i => i.kind === 'deadlock_upgrade' || i.kind === 'deadlock_ability');

	if (hasDeadlockUpgrade) {
		const propertiesNames = collectStatNames(items, i => (i.kind === 'deadlock_upgrade' || i.kind === 'deadlock_ability') ? i.properties : []);
		return [
			{ id: 'weight', label: 'Cost', group: 'General' },
			{ id: 'ehp', label: 'Effective HP', group: 'Calculated Metrics' },
			{ id: 'integrated_armor', label: 'Total Integrated Armor', group: 'Calculated Metrics' },
			{ id: 'ehp_per_soul', label: 'eHP / Soul', group: 'Calculated Metrics' },
			{ id: 'Final Bullet DPS', label: 'Final Bullet DPS', group: 'Calculated Metrics' },
			{ id: 'Final Spirit DPS', label: 'Final Spirit DPS', group: 'Calculated Metrics' },
			...buildGroup(propertiesNames, 'total_negation', 'Total Stats', 'Item Properties')
		];
	}

	if (hasArmor && hasWeaponLike) return [weightStat];

	if (hasArmor) {
		const negationNames = collectStatNames(items, i => i.kind === 'armor' ? i.dmgNegation : []);
		const resistanceNames = collectStatNames(items, i => i.kind === 'armor' ? i.resistance : []);

		return [
			weightStat,
			...buildGroup(negationNames, 'total_negation', 'Total Damage Negation', 'Armor Negation', 'Negation'),
			...buildGroup(resistanceNames, 'total_resistance', 'Total Resistance', 'Armor Resistance')
		];
	}

	// hasWeaponLike is true
	const attackNames = collectStatNames(items, i => (i.kind === 'weapon' || i.kind === 'shield' || i.kind === 'ammo') ? i.attack : []);
	const defenceNames = collectStatNames(items, i => (i.kind === 'weapon' || i.kind === 'shield') ? i.defence : []);

	return R.pipe(
		[
			weightStat,
			...buildGroup(attackNames, 'total_attack', 'Total Attack', 'Weapon Attack', 'Attack'),
			...buildGroup(defenceNames, 'total_defence', 'Total Defence', 'Weapon Defence', 'Defence')
		],
		R.uniqueBy(R.prop('id'))
	);
};

/**
 * Derives active categories grouped by equipment kind from data.
 */
export const getActiveCategories = (items: EquipmentItem[]): { kind: EquipmentKind; categories: string[] }[] => {
	const grouped = new Map<EquipmentKind, Set<string>>();

	for (const item of items) {
		if (!grouped.has(item.kind)) {
			grouped.set(item.kind, new Set());
		}
		grouped.get(item.kind)!.add(item.category);
	}

	return Array.from(grouped.entries())
		.map(([kind, cats]) => ({
			kind,
			categories: Array.from(cats).sort(),
		}))
		.sort((a, b) => a.kind.localeCompare(b.kind));
};

export const getHeroNameFromClassName = (className: string): string => {
	if (!className) return '';

	const lower = className.toLowerCase();

	if (lower.includes('storm') || lower.includes('gigawatt')) return 'Seven';
	if (lower.includes('synth') || lower.includes('pocket')) return 'Pocket';
	if (lower.includes('kelvin')) return 'Kelvin';
	if (lower.includes('inferno') || lower.includes('infernus')) return 'Infernus';
	if (lower.includes('ghost') || lower.includes('geist')) return 'Lady Geist';
	if (lower.includes('atlas') || lower.includes('abrams')) return 'Abrams';
	if (lower.includes('wraith')) return 'Wraith';
	if (lower.includes('forge') || lower.includes('mcginnis')) return 'McGinnis';
	if (lower.includes('chrono') || lower.includes('paradox')) return 'Paradox';
	if (lower.includes('dynamo')) return 'Dynamo';
	if (lower.includes('haze')) return 'Haze';
	if (lower.includes('astro') || lower.includes('holliday')) return 'Holliday';
	if (lower.includes('bebop')) return 'Bebop';
	if (lower.includes('nano') || lower.includes('calico')) return 'Calico';
	if (lower.includes('orion') || lower.includes('talon') || lower.includes('grey')) return 'Grey Talon';
	if (lower.includes('krill') || lower.includes('mo')) return 'Mo & Krill';
	if (lower.includes('shiv')) return 'Shiv';
	if (lower.includes('tengu') || lower.includes('ivy')) return 'Ivy';
	if (lower.includes('warden')) return 'Warden';
	if (lower.includes('yamato')) return 'Yamato';
	if (lower.includes('lash')) return 'Lash';
	if (lower.includes('viscous')) return 'Viscous';
	if (lower.includes('mirage')) return 'Mirage';
	if (lower.includes('viper') || lower.includes('vyper')) return 'Vyper';
	if (lower.includes('magician') || lower.includes('sinclair')) return 'Sinclair';
	if (lower.includes('vampirebat') || lower.includes('mina')) return 'Mina';
	if (lower.includes('drifter')) return 'Drifter';
	if (lower.includes('priest') || lower.includes('venator')) return 'Venator';
	if (lower.includes('frank') || lower.includes('victor')) return 'Victor';
	if (lower.includes('bookworm') || lower.includes('paige')) return 'Paige';
	if (lower.includes('doorman')) return 'The Doorman';
	if (lower.includes('punkgoat') || lower.includes('billy')) return 'Billy';
	if (lower.includes('necro') || lower.includes('graves')) return 'Graves';
	if (lower.includes('fencer') || lower.includes('apollo')) return 'Apollo';
	if (lower.includes('familiar') || lower.includes('rem')) return 'Rem';
	if (lower.includes('werewolf') || lower.includes('silver')) return 'Silver';
	if (lower.includes('unicorn') || lower.includes('celeste')) return 'Celeste';

	// Default split logic as final fallback
	const tokens = className.split('_');
	if (tokens.length >= 3) {
		const rawHero = tokens[2];
		return rawHero.charAt(0).toUpperCase() + rawHero.slice(1);
	}
	return '';
};

// --- Calculated Dimensions ---

export function calculateTotalIntegratedArmor(positiveBuffs: number[], negativeShreds: number[]): number {
	const B = 1 - positiveBuffs.reduce((acc, val) => acc * (1 - val), 1);
	const N = 1 - negativeShreds.reduce((acc, val) => acc * (1 - val), 1);
	return B - N;
};

export function calculateEffectiveHealth(baseHealth: number, activeResistance: number): number {
	if (activeResistance >= 1.0) return Infinity;
	return baseHealth / (1 - activeResistance);
};

export function calculateValueMetric(statValue: number, cost: number): number {
	if (statValue === 0) return 0;
	if (cost === 0) return Infinity;
	return statValue / cost;
};
