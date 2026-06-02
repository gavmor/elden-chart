import type { LucideProps } from 'lucide-react';
import { Circle, Footprints, Hand, HardHat, Shield, Shirt, Sword, Target } from 'lucide-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as R from 'remeda';
import type { EquipmentItem, EquipmentKind, StatOption } from './types';

export const getCategoryIcon = (category: string, kind: EquipmentKind, props: LucideProps) => {
	if (kind === 'weapon') return createElement(Sword, props);
	if (kind === 'shield') return createElement(Shield, props);
	if (kind === 'ammo') return createElement(Target, props);
	if (kind === 'deadlock_upgrade' || kind === 'deadlock_ability') {
		if (category === 'weapon' || category === 'signature') return createElement(Sword, props);
		if (category === 'spirit' || category === 'ultimate') return createElement(Circle, props);
		return createElement(Shield, props); // vitality maps to Shield
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

export const getItemStat = (item: EquipmentItem, statName: string): number => {
	if (statName === 'weight') return item.weight;

	if (statName === 'ehp') {
		const bonusHealth = getItemStat(item, 'BonusHealth') || 0;
		const baseHealth = 1000 + bonusHealth;
		const resistPercent = getItemStat(item, 'BulletResist') || 0;
		return calculateEffectiveHealth(baseHealth, resistPercent / 100);
	}
	if (statName === 'integrated_armor') {
		const bulletResist = getItemStat(item, 'BulletResist') || 0;
		const spiritResist = getItemStat(item, 'SpiritResist') || 0;
		const bulletShred = getItemStat(item, 'BulletResistReduction') || 0;
		const spiritShred = getItemStat(item, 'SpiritResistReduction') || 0;
		
		const buffs = [bulletResist / 100, spiritResist / 100].filter(v => v > 0);
		const shreds = [Math.abs(bulletShred) / 100, Math.abs(spiritShred) / 100].filter(v => v > 0);
		return calculateTotalIntegratedArmor(buffs, shreds);
	}
	if (statName === 'ehp_per_soul') {
		const ehp = getItemStat(item, 'ehp');
		return calculateValueMetric(ehp, item.weight);
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

	// Named stats — discriminated union requires separate lookups per kind
	if (item.kind === 'armor') {
		return R.find(item.dmgNegation, s => s.name === statName)?.amount
			?? R.find(item.resistance, s => s.name === statName)?.amount
			?? 0;
	}
	if (item.kind === 'ammo') {
		return R.find(item.attack, s => s.name === statName)?.amount ?? 0;
	}
	return R.find(item.attack, s => s.name === statName)?.amount
		?? R.find(item.defence, s => s.name === statName)?.amount
		?? 0;
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
export const getStatRange = (items: EquipmentItem[], statName: string): { min: number; max: number } => {
	const vals = items.map(item => getItemStat(item, statName));
	return { min: Math.min(...vals), max: Math.max(...vals) };
};

export const getStatRangeClamped = (items: EquipmentItem[], statName: string): { min: number; max: number } => {
	const vals = items.map(item => getItemStat(item, statName)).filter(val => val !== Infinity && val !== -Infinity);
	if (vals.length === 0) return { min: 0, max: 0 };
	return { min: Math.min(...vals), max: Math.max(...vals) };
};

export const getClampedItemStat = (item: EquipmentItem, statName: string, maxBound: number): number => {
	const val = getItemStat(item, statName);
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
	minMax: { min: number; max: number } | null
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
	const val = getItemStat(item, colorVar);
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

	const svg = renderToStaticMarkup(
		createElement(icon, { size: 24, color, strokeWidth: 2, absoluteStrokeWidth: true })
	);
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
		if (item.category === 'weapon' || item.category === 'signature') return iconToDataUri(Sword, color);
		if (item.category === 'spirit' || item.category === 'ultimate') return iconToDataUri(Circle, color);
		return iconToDataUri(Shield, color); // vitality
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
	yVar: string
): EquipmentItem[] => {
	if (items.length === 0) return [];

	const isBetter = (valA: number, valB: number, stat: string, strict = false) => {
		const minimize = stat === 'weight';
		if (minimize) return strict ? valA < valB : valA <= valB;
		return strict ? valA > valB : valA >= valB;
	};

	const dominates = (a: EquipmentItem, b: EquipmentItem): boolean => {
		const xA = getItemStat(a, xVar);
		const xB = getItemStat(b, xVar);
		const yA = getItemStat(a, yVar);
		const yB = getItemStat(b, yVar);

		return (
			isBetter(xA, xB, xVar) &&
			isBetter(yA, yB, yVar) &&
			(isBetter(xA, xB, xVar, true) || isBetter(yA, yB, yVar, true))
		);
	};

	return R.pipe(
		items,
		R.filter(item => !items.some(other => other.id !== item.id && dominates(other, item))),
		R.sortBy(
			item => getItemStat(item, xVar),
			item => getItemStat(item, yVar)
		)
	);
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
