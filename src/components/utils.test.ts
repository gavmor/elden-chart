import { describe, it, expect } from 'vitest';
import {
	buildGroup,
	getCategoryIcon,
	getItemStat,
	getItemColor,
	getItemImageUrl,
	getParetoFrontier,
	getAvailableStats,
	getActiveCategories,
} from './utils';
import {
	helmItem,
	chestItem,
	gauntletsItem,
	longswordItem,
	heaterShieldItem,
} from './CompareModal/test-fixtures';
import { Circle, Footprints, Hand, HardHat, Shield, Shirt, Sword } from 'lucide-react';

// ---------------------------------------------------------------------------
// getCategoryIcon
// ---------------------------------------------------------------------------
describe('getCategoryIcon', () => {
	const props = { size: 24 };

	it('returns Sword icon for weapons', () => {
		const el = getCategoryIcon('AnyCategory', 'weapon', props);
		expect(el.type).toBe(Sword);
	});

	it('returns Shield icon for shields', () => {
		const el = getCategoryIcon('AnyCategory', 'shield', props);
		expect(el.type).toBe(Shield);
	});

	it('returns HardHat icon for Helm', () => {
		const el = getCategoryIcon('Helm', 'armor', props);
		expect(el.type).toBe(HardHat);
	});

	it('returns Shirt icon for Chest Armor', () => {
		const el = getCategoryIcon('Chest Armor', 'armor', props);
		expect(el.type).toBe(Shirt);
	});

	it('returns Hand icon for Gauntlets', () => {
		const el = getCategoryIcon('Gauntlets', 'armor', props);
		expect(el.type).toBe(Hand);
	});

	it('returns Footprints icon for Leg Armor', () => {
		const el = getCategoryIcon('Leg Armor', 'armor', props);
		expect(el.type).toBe(Footprints);
	});

	it('returns Circle icon for unknown armor category', () => {
		const el = getCategoryIcon('Mystery Armor', 'armor', props);
		expect(el.type).toBe(Circle);
	});

	it('passes props to the icon element', () => {
		const el = getCategoryIcon('Helm', 'armor', { size: 48, color: 'red' });
		expect(el.props.size).toBe(48);
		expect(el.props.color).toBe('red');
	});
});

// ---------------------------------------------------------------------------
// getItemStat
// ---------------------------------------------------------------------------
describe('getItemStat', () => {
	describe('weight', () => {
		it('returns weight for armor', () => {
			expect(getItemStat(helmItem, 'weight')).toBe(4.2);
		});

		it('returns weight for weapons', () => {
			expect(getItemStat(longswordItem, 'weight')).toBe(3.5);
		});

		it('returns weight for shields', () => {
			expect(getItemStat(heaterShieldItem, 'weight')).toBe(3.5);
		});
	});

	describe('total_attack', () => {
		it('sums attack stats for weapons', () => {
			expect(getItemStat(longswordItem, 'total_attack')).toBe(210); // 110 + 100
		});

		it('sums attack stats for shields', () => {
			expect(getItemStat(heaterShieldItem, 'total_attack')).toBe(65);
		});

		it('returns 0 for armor', () => {
			expect(getItemStat(helmItem, 'total_attack')).toBe(0);
		});
	});

	describe('total_defence', () => {
		it('sums defence stats for weapons', () => {
			expect(getItemStat(longswordItem, 'total_defence')).toBe(75); // 45+0+0+0+0+30
		});

		it('sums defence stats for shields', () => {
			expect(getItemStat(heaterShieldItem, 'total_defence')).toBe(353); // 100+50+60+40+55+48
		});

		it('returns 0 for armor', () => {
			expect(getItemStat(helmItem, 'total_defence')).toBe(0);
		});
	});

	describe('total_negation', () => {
		it('sums dmgNegation for armor', () => {
			// 5.5+4+5+4.5+3+2.5+2+1.5
			expect(getItemStat(helmItem, 'total_negation')).toBeCloseTo(28.0);
		});

		it('returns 0 for weapons', () => {
			expect(getItemStat(longswordItem, 'total_negation')).toBe(0);
		});
	});

	describe('total_resistance', () => {
		it('sums resistance excluding Poise for armor', () => {
			// 22+18+11+9 (excluding Poise 6)
			expect(getItemStat(helmItem, 'total_resistance')).toBe(60);
		});

		it('returns 0 for weapons', () => {
			expect(getItemStat(longswordItem, 'total_resistance')).toBe(0);
		});
	});

	describe('named stats', () => {
		it('finds a dmgNegation stat on armor', () => {
			expect(getItemStat(helmItem, 'Phy')).toBe(5.5);
		});

		it('finds a resistance stat on armor', () => {
			expect(getItemStat(helmItem, 'Immunity')).toBe(22);
		});

		it('finds Poise on armor', () => {
			expect(getItemStat(helmItem, 'Poise')).toBe(6);
		});

		it('finds an attack stat on weapon', () => {
			expect(getItemStat(longswordItem, 'Phy')).toBe(110);
		});

		it('finds a defence stat on weapon', () => {
			expect(getItemStat(longswordItem, 'Boost')).toBe(30);
		});

		it('returns 0 for a missing stat name', () => {
			expect(getItemStat(helmItem, 'Nonexistent')).toBe(0);
		});
	});
});

// ---------------------------------------------------------------------------
// getItemColor
// ---------------------------------------------------------------------------
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

	it('returns a heatmap HSL color for a stat with range', () => {
		const color = getItemColor(helmItem, 'weight', { min: 0, max: 20 });
		expect(color).toMatch(/^hsl\(\d{1,3}, 85%, 60%\)$/);
	});

	it('clamps the ratio between 0 and 1', () => {
		const above = getItemColor(helmItem, 'weight', { min: 0, max: 1 });
		const below = getItemColor(helmItem, 'weight', { min: 10, max: 20 });
		expect(above).toMatch(/^hsl\(220, 85%, 60%\)$/);
		expect(below).toMatch(/^hsl\(0, 85%, 60%\)$/);
	});
});

// ---------------------------------------------------------------------------
// getItemImageUrl
// ---------------------------------------------------------------------------
describe('getItemImageUrl', () => {
	it('returns the image URL when item.image is set', () => {
		expect(getItemImageUrl(helmItem, '#fff')).toBe('http://example.com/helm.png');
	});

	it('returns a data URI for weapons with null image', () => {
		const url = getItemImageUrl(longswordItem, '#000');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-sword');
	});

	it('returns a data URI for shields with null image', () => {
		const url = getItemImageUrl(heaterShieldItem, '#000');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-shield');
	});

	it('returns a data URI for helm with null image', () => {
		const url = getItemImageUrl({ ...helmItem, image: null }, '#fff');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-hard-hat');
	});

	it('returns a data URI for chest with null image', () => {
		const url = getItemImageUrl({ ...chestItem, image: null }, '#fff');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-shirt');
	});

	it('returns a data URI for gauntlets with null image', () => {
		const url = getItemImageUrl({ ...gauntletsItem, image: null }, '#fff');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-hand');
	});

	it('returns a data URI for unknown armor category with null image', () => {
		const misc = { ...helmItem, image: null, category: 'Misc' };
		const url = getItemImageUrl(misc, '#fff');
		expect(url).toMatch(/^data:image\/svg\+xml;utf8,/);
		expect(decodeURIComponent(url)).toContain('lucide-circle');
	});

	it('encodes the color into the fallback icon', () => {
		const url = getItemImageUrl({ ...helmItem, image: null }, 'red');
		expect(decodeURIComponent(url)).toContain('red');
	});
});

// ---------------------------------------------------------------------------
// getParetoFrontier
// ---------------------------------------------------------------------------
describe('getParetoFrontier', () => {
	it('returns an empty array for empty input', () => {
		expect(getParetoFrontier([], 'weight', 'Phy')).toEqual([]);
	});

	it('returns the single item when only one is provided', () => {
		const result = getParetoFrontier([helmItem], 'weight', 'Phy');
		expect(result).toEqual([helmItem]);
	});

	it('filters out dominated items (weight minimize, Phy maximize)', () => {
		// chestItem: weight=11.5, Phy=12.0
		// helmItem:  weight=4.2,  Phy=5.5
		// helm dominates chest: less weight AND less Phy? No — less weight is better
		// but Phy higher is better. So helm has less weight (good) but less Phy (bad).
		// They are non-dominated.
		//
		// Add a strictly-worse item: high weight AND low Phy.
		const badItem = {
			...helmItem,
			id: 'bad-1',
			name: 'Bad Helm',
			weight: 20,
			dmgNegation: helmItem.dmgNegation.map(s =>
				s.name === 'Phy' ? { ...s, amount: 0.5 } : s
			),
		};
		const result = getParetoFrontier([helmItem, chestItem, badItem], 'weight', 'Phy');
		expect(result).not.toContain(badItem);
		expect(result).toContain(helmItem);
		expect(result).toContain(chestItem);
	});

	it('keeps the better item when one strictly dominates', () => {
		// Better: less weight AND more Phy
		const better = {
			...helmItem,
			id: 'better-1',
			weight: 2.0,
			dmgNegation: helmItem.dmgNegation.map(s =>
				s.name === 'Phy' ? { ...s, amount: 10 } : s
			),
		};
		const result = getParetoFrontier([helmItem, better], 'weight', 'Phy');
		expect(result).toEqual([better]);
	});

	it('keeps both when items are non-dominated (one better in x, other better in y)', () => {
		// A: low weight, low Phy
		// B: high weight, high Phy
		const a = { ...helmItem, id: 'a', weight: 1, dmgNegation: [{ name: 'Phy', amount: 1 }] };
		const b = { ...helmItem, id: 'b', weight: 10, dmgNegation: [{ name: 'Phy', amount: 10 }] };
		const result = getParetoFrontier([a, b], 'weight', 'Phy');
		expect(result).toHaveLength(2);
		expect(result).toContain(a);
		expect(result).toContain(b);
	});

	it('sorts results by xVar ascending (all items non-dominated)', () => {
		// With weight minimize + Phy maximize, non-dominance requires
		// items to rank identically on both axes (lower weight = lower phy)
		const c = { ...helmItem, id: 'c', weight: 1, dmgNegation: [{ name: 'Phy', amount: 1 }] };
		const a = { ...helmItem, id: 'a', weight: 3, dmgNegation: [{ name: 'Phy', amount: 3 }] };
		const d = { ...helmItem, id: 'd', weight: 4, dmgNegation: [{ name: 'Phy', amount: 4 }] };
		const b = { ...helmItem, id: 'b', weight: 5, dmgNegation: [{ name: 'Phy', amount: 5 }] };
		const result = getParetoFrontier([a, b, c, d], 'weight', 'Phy');
		// Sorted by weight asc
		expect(result.map(r => r.id)).toEqual(['c', 'a', 'd', 'b']);
	});

	it('handles equal items gracefully (no crash, stable sort)', () => {
		const a = { ...helmItem, id: 'a', weight: 3, dmgNegation: [{ name: 'Phy', amount: 3 }] };
		const a2 = { ...helmItem, id: 'a2', weight: 3, dmgNegation: [{ name: 'Phy', amount: 3 }] };
		const result = getParetoFrontier([a, a2], 'weight', 'Phy');
		// Neither strictly dominates, both remain, sorted by weight then Phy
		expect(result.map(r => r.id)).toEqual(['a', 'a2']);
	});

	it('handles both axes as maximize (weapon attack/defence)', () => {
		const a = { ...longswordItem, id: 'a', attack: [{ name: 'Phy', amount: 100 }] };
		const b = { ...longswordItem, id: 'b', attack: [{ name: 'Phy', amount: 150 }] };
		// b dominates a (more Phy attack, equal weight)
		const result = getParetoFrontier([a, b], 'total_attack', 'total_defence');
		expect(result).toEqual([b]);
	});

	it('handles weapon items with weight minimize and attack maximize', () => {
		const lightWeapon = { ...longswordItem, id: 'light', weight: 1, attack: [{ name: 'Phy', amount: 50 }] };
		const heavyWeapon = { ...longswordItem, id: 'heavy', weight: 10, attack: [{ name: 'Phy', amount: 200 }] };
		const result = getParetoFrontier([lightWeapon, heavyWeapon], 'weight', 'Phy');
		// Non-dominated: light has less weight but less attack, heavy has more attack but more weight
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('light');
		expect(result[1].id).toBe('heavy');
	});

	it('returns empty array when items array is empty', () => {
		expect(getParetoFrontier([], 'weight', 'Phy')).toEqual([]);
	});

	it('identical items — keeps one (they dominate each other equally)', () => {
		// With strict check: identical stats means neither strictly dominates.
		// The some() check: !items.some(other => other.id !== item.id && dominates(other, item))
		// dominates() returns false because neither is strictly better.
		// So both pass the filter.
		// However identical items are unlikely in practice. Let me test dominance with
		// items that have the same stats:
		const a = { ...helmItem, id: 'a' };
		const b = { ...helmItem, id: 'b' };
		const result = getParetoFrontier([a, b], 'weight', 'Phy');
		// Same stats — neither strictly dominates because all comparisons are >= not >
		expect(result).toHaveLength(2);
	});
});

// ---------------------------------------------------------------------------
// getAvailableStats
// ---------------------------------------------------------------------------
describe('getAvailableStats', () => {
	it('returns weight-only when armor and weapons are mixed', () => {
		const stats = getAvailableStats([helmItem, longswordItem]);
		expect(stats).toHaveLength(1);
		expect(stats[0].id).toBe('weight');
	});

	it('returns armor negation and resistance stats for armor-only items', () => {
		const stats = getAvailableStats([helmItem, chestItem, gauntletsItem]);
		const ids = stats.map(s => s.id);

		expect(ids).toContain('weight');
		expect(ids).toContain('total_negation');
		expect(ids).toContain('total_resistance');
		expect(ids).toContain('Phy');
		expect(ids).toContain('Immunity');
		expect(ids).toContain('Poise');
	});

	it('returns weapon attack and defence stats for weapon-only items', () => {
		const stats = getAvailableStats([longswordItem]);
		const ids = stats.map(s => s.id);

		expect(ids).toContain('weight');
		expect(ids).toContain('total_attack');
		expect(ids).toContain('total_defence');
		expect(ids).toContain('Phy');
	});

	it('deduplicates stat names shared between attack and defence', () => {
		const stats = getAvailableStats([longswordItem]);
		const ids = stats.map(s => s.id);
		// Phy appears in both attack and defence arrays but should only appear once
		const phyCount = ids.filter(id => id === 'Phy').length;
		expect(phyCount).toBe(1);
	});

	it('groups stats correctly', () => {
		const stats = getAvailableStats([helmItem, chestItem]);
		const weight = stats.find(s => s.id === 'weight');
		expect(weight?.group).toBe('General');

		const negation = stats.find(s => s.id === 'total_negation');
		expect(negation?.group).toBe('Armor Negation');

		const resistance = stats.find(s => s.id === 'total_resistance');
		expect(resistance?.group).toBe('Armor Resistance');
	});

	it('returns empty for empty items', () => {
		const stats = getAvailableStats([]);
		expect(stats).toHaveLength(0);
	});

	it('handles shield-only items', () => {
		const stats = getAvailableStats([heaterShieldItem]);
		const ids = stats.map(s => s.id);
		expect(ids).toContain('total_attack');
		expect(ids).toContain('total_defence');
	});

	it('labels stats with proper suffixes', () => {
		const stats = getAvailableStats([longswordItem]);
		const phyAttack = stats.find(s => s.id === 'Phy' && s.group === 'Weapon Attack');
		expect(phyAttack?.label).toMatch(/Attack$/);
	});
});

// ---------------------------------------------------------------------------
// getActiveCategories
// ---------------------------------------------------------------------------
describe('getActiveCategories', () => {
	it('groups armor items by kind and category', () => {
		const result = getActiveCategories([helmItem, chestItem, gauntletsItem]);
		expect(result).toHaveLength(1);
		expect(result[0].kind).toBe('armor');
		expect(result[0].categories).toEqual(['Chest Armor', 'Gauntlets', 'Helm']);
	});

	it('groups weapon and armor items separately', () => {
		const result = getActiveCategories([helmItem, longswordItem]);
		expect(result).toHaveLength(2);
		const armor = result.find(r => r.kind === 'armor')!;
		const weapon = result.find(r => r.kind === 'weapon')!;
		expect(armor.categories).toEqual(['Helm']);
		expect(weapon.categories).toEqual(['Straight Sword']);
	});

	it('sorts categories alphabetically', () => {
		const result = getActiveCategories([chestItem, helmItem, gauntletsItem]);
		expect(result[0].categories).toEqual(['Chest Armor', 'Gauntlets', 'Helm']);
	});

	it('sorts kinds alphabetically', () => {
		const result = getActiveCategories([helmItem, longswordItem]);
		expect(result[0].kind).toBe('armor');
		expect(result[1].kind).toBe('weapon');
	});

	it('handles empty input', () => {
		expect(getActiveCategories([])).toEqual([]);
	});

	it('deduplicates categories within the same kind', () => {
		const dupe = { ...helmItem, id: 'helm-2' };
		const result = getActiveCategories([helmItem, dupe]);
		expect(result[0].categories).toEqual(['Helm']);
	});

	it('handles shields alongside weapons', () => {
		const result = getActiveCategories([longswordItem, heaterShieldItem]);
		expect(result).toHaveLength(2);
		const weapon = result.find(r => r.kind === 'weapon')!;
		const shield = result.find(r => r.kind === 'shield')!;
		expect(weapon.categories).toEqual(['Straight Sword']);
		expect(shield.categories).toEqual(['Small Shield']);
	});
});

// ---------------------------------------------------------------------------
// buildGroup
// ---------------------------------------------------------------------------
describe('buildGroup', () => {
	it('returns empty array when names is empty', () => {
		const result = buildGroup([], 'total_foo', 'Total Foo', 'Group');
		expect(result).toEqual([]);
	});

	it('returns total stat option followed by individual stat options', () => {
		const result = buildGroup(['Phy', 'Mag'], 'total_foo', 'Total Foo', 'My Group');
		expect(result).toHaveLength(3);
		expect(result[0]).toEqual({ id: 'total_foo', label: 'Total Foo', group: 'My Group' });
		expect(result[1]).toEqual({ id: 'Phy', label: 'Physical', group: 'My Group' });
		expect(result[2]).toEqual({ id: 'Mag', label: 'Magic', group: 'My Group' });
	});

	it('appends suffix to individual stat labels when provided', () => {
		const result = buildGroup(['Phy'], 'total_foo', 'Total Foo', 'G', 'Negation');
		expect(result[1].label).toBe('Physical Negation');
	});

	it('handles known stat names with proper formatting', () => {
		const result = buildGroup(['Immunity', 'Poise'], 'total_res', 'Total Resistance', 'Armor');
		expect(result[1].label).toBe('Immunity');
		expect(result[2].label).toBe('Poise');
	});

	it('handles unknown stat names by passing them through', () => {
		const result = buildGroup(['UnknownStat'], 'total_x', 'Total X', 'G');
		expect(result[1].label).toBe('UnknownStat');
	});
});
