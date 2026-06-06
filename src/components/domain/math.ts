import * as R from 'remeda';
import type { EquipmentItem, EquipmentKind, StatOption, SimulationContext, InvestmentMilestone } from '../types';
import { calculateBulletDPS, calculateSpiritDPS, calculateEffectiveResistance, calculateEffectiveDPS } from '../deadlock-dps';
import { formatStatName } from '../display/logic';

const statCache = new Map<string, number>();

export const clearStatCache = () => statCache.clear();

const getMilestoneDelta = (
	item: EquipmentItem,
	category: 'weapon' | 'vitality' | 'spirit',
	context?: SimulationContext,
	getBaselineItems?: () => EquipmentItem[],
	getCombinedItems?: () => EquipmentItem[]
): number => {
	if (!context?.investmentTracks) return 0;

	const itemCategory = item.category.toLowerCase();
	if (itemCategory !== category) return 0;

	const track = context.investmentTracks[category];
	if (!track || track.length === 0) return 0;

	// Calculate baseline and projected spent souls in this category
	const baselineItems = getBaselineItems ? getBaselineItems() : [];
	const combinedItems = getCombinedItems ? getCombinedItems() : [item];

	const baselineSpent = baselineItems
		.filter(it => it.category.toLowerCase() === category)
		.reduce((acc, it) => acc + it.weight, 0);

	const projectedSpent = combinedItems
		.filter(it => it.category.toLowerCase() === category)
		.reduce((acc, it) => acc + it.weight, 0);

	const getBonus = (milestones: InvestmentMilestone[], spent: number): number => {
		let activeBonus = 0;
		const sorted = [...milestones].sort((a, b) => a.goldThreshold - b.goldThreshold);
		for (const m of sorted) {
			if (spent >= m.goldThreshold) {
				activeBonus = m.bonus;
			}
		}
		return activeBonus;
	};

	const baselineBonus = getBonus(track, baselineSpent);
	const projectedBonus = getBonus(track, projectedSpent);

	return projectedBonus - baselineBonus;
};

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
		if (!context) return 0;

		const calcBulletDps = (itemsList: EquipmentItem[]) => {
			let fireRateMod = 0;
			let weaponPowerMod = 0;
			const bulletResistShreds: number[] = [];
			for (const it of itemsList) {
				fireRateMod += (getItemStat(it, 'BonusFireRate') || getItemStat(it, 'FireRateBonus') || 0) / 100;
				weaponPowerMod += (getItemStat(it, 'WeaponPower') || getItemStat(it, 'BaseAttackDamagePercent') || getItemStat(it, 'BonusDamagePercent') || 0) / 100;
				const brs = getItemStat(it, 'BulletResistReduction') || 0;
				if (brs !== 0) bulletResistShreds.push(Math.abs(brs) / 100);
			}
			const rawBulletDps = calculateBulletDPS(100 * (1 + weaponPowerMod), context.hero.shotTime, context.hero.pauseTime, fireRateMod);
			const finalBulletRes = calculateEffectiveResistance([0], bulletResistShreds);
			return calculateEffectiveDPS(rawBulletDps, finalBulletRes);
		};

		return calcBulletDps(getCombinedItems()) - calcBulletDps(getBaselineItems());
	}

	if (statName === 'Final Spirit DPS') {
		if (!context) return 0;
		
		const calcSpiritDps = (itemsList: EquipmentItem[], targetAbility?: EquipmentItem) => {
			let spiritPower = 0;
			let spiritDamageMod = 0;
			const spiritResistShreds: number[] = [];
			for (const it of itemsList) {
				spiritPower += getItemStat(it, 'TechPower') || getItemStat(it, 'SpiritPower') || 0;
				spiritDamageMod += (getItemStat(it, 'TechDamagePercent') || getItemStat(it, 'BonusSpiritDamage') || 0) / 100;
				const srs = getItemStat(it, 'TechResistReduction') || getItemStat(it, 'SpiritResistReduction') || 0;
				if (srs !== 0) spiritResistShreds.push(Math.abs(srs) / 100);
			}

			let baseDps = 100;
			const coeff = 1.0;

			if (targetAbility && targetAbility.kind === 'deadlock_ability') {
				const pulseProp = targetAbility.properties.find(p => p.name === 'PulseDPS');
				const damageProp = targetAbility.properties.find(p => ['Damage', 'FullChargeDamage'].includes(p.name));
				
				if (pulseProp) {
					baseDps = pulseProp.amount;
				} else if (damageProp) {
					const cd = getItemStat(targetAbility, 'AbilityCooldown') || 1;
					const castDelay = getItemStat(targetAbility, 'AbilityCastDelay') || 0;
					baseDps = damageProp.amount / (cd + castDelay);
				} else {
					baseDps = 0;
				}

				// Most abilities have a specific TechPower scaling factor, often found as a duplicate property or hardcoded.
				// For the scope of this baseline, we'll assume a standard 1.0 coefficient if no explicit modifier is found.
			}

			const rawSpiritDps = calculateSpiritDPS('ranged', baseDps, spiritDamageMod, spiritPower, coeff);
			const finalSpiritRes = calculateEffectiveResistance([0], spiritResistShreds);
			return calculateEffectiveDPS(rawSpiritDps, finalSpiritRes);
		};

		if (item.kind === 'deadlock_ability') {
			return calcSpiritDps(getCombinedItems(), item);
		}

		return calcSpiritDps(getCombinedItems()) - calcSpiritDps(getBaselineItems());
	}

	if (statName === 'ehp') {
		const calcEhp = (itemsList: EquipmentItem[]) => {
			const setBonusHealth = itemsList.reduce((acc, it) => acc + (getItemStat(it, 'BonusHealth') || 0), 0);
			const baseHealth = 1000 + setBonusHealth;
			const bulletResists: number[] = [];
			for (const it of itemsList) {
				const br = getItemStat(it, 'BulletResist') || 0;
				if (br > 0) bulletResists.push(br / 100);
			}
			const finalResist = calculateEffectiveResistance(bulletResists, []);
			return calculateEffectiveHealth(baseHealth, finalResist, context?.incomingDamage);
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
				const sr = getItemStat(it, 'TechResist') || getItemStat(it, 'SpiritResist') || 0;
				if (sr > 0) spiritResists.push(sr / 100);
				
				const bs = getItemStat(it, 'BulletResistReduction') || 0;
				if (bs !== 0) bulletShreds.push(Math.abs(bs) / 100);
				const ss = getItemStat(it, 'TechResistReduction') || getItemStat(it, 'SpiritResistReduction') || 0;
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

	if (statName === 'MHpS') {
		const baseHealth = getItemStat(item, 'BonusHealth');
		const milestoneDelta = getMilestoneDelta(item, 'vitality', context, getBaselineItems, getCombinedItems);
		return calculateValueMetric(baseHealth + milestoneDelta, item.weight);
	}

	if (statName === 'MWDpS') {
		const baseWeaponPower = getItemStat(item, 'WeaponPower') + getItemStat(item, 'BaseAttackDamagePercent') + getItemStat(item, 'BonusDamagePercent');
		const milestoneDelta = getMilestoneDelta(item, 'weapon', context, getBaselineItems, getCombinedItems);
		return calculateValueMetric(baseWeaponPower + milestoneDelta, item.weight);
	}

	if (statName === 'MSPpS') {
		const baseSpiritPower = getItemStat(item, 'TechPower') + getItemStat(item, 'SpiritPower');
		const milestoneDelta = getMilestoneDelta(item, 'spirit', context, getBaselineItems, getCombinedItems);
		return calculateValueMetric(baseSpiritPower + milestoneDelta, item.weight);
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
	if (!context || !['Final Bullet DPS', 'Final Spirit DPS', 'ehp', 'integrated_armor', 'ehp_per_soul', 'MHpS', 'MWDpS', 'MSPpS'].includes(statName)) {
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
			{ id: 'MHpS', label: 'Marginal Health per Soul (MHpS)', group: 'Calculated Metrics' },
			{ id: 'MWDpS', label: 'Marginal Weapon Damage % per Soul (MWDpS)', group: 'Calculated Metrics' },
			{ id: 'MSPpS', label: 'Marginal Spirit Power per Soul (MSPpS)', group: 'Calculated Metrics' },
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

export function calculateEffectiveHealth(baseHealth: number, activeResistance: number, incomingDamage: number = 15): number {
	const actualDamage = Math.max(1, incomingDamage * (1 - activeResistance));
	return baseHealth * (incomingDamage / actualDamage);
};

export function calculateValueMetric(statValue: number, cost: number): number {
	if (statValue === 0) return 0;
	if (cost === 0) return Infinity;
	return statValue / cost;
};
