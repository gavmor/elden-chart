import { describe, it, expect } from 'vitest';
import {
        helmItem,
        chestItem,
        gauntletsItem,
        longswordItem,
        heaterShieldItem,
} from '../CompareModal/test-fixtures';
import { Footprints, Hand, HardHat, Shield, Shirt, Sword } from 'lucide-react';
import { getCategoryIcon, getItemImageUrl } from './logic';
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

	it('returns FallbackBox icon for unknown armor category', () => {
		const el = getCategoryIcon('Mystery Armor', 'armor', props);
		expect(el.type.name).toBe('FallbackBox');
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
		expect(decodeURIComponent(url)).toContain('lucide-box');
	});

	it('encodes the color into the fallback icon', () => {
		const url = getItemImageUrl({ ...helmItem, image: null }, 'red');
		expect(decodeURIComponent(url)).toContain('red');
	});
});

// ---------------------------------------------------------------------------
// getParetoFrontier
// ---------------------------------------------------------------------------
