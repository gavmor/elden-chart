/* eslint-disable react-refresh/only-export-components */
import type { LucideProps } from 'lucide-react';
import { Circle, Footprints, Hand, HardHat, Shield, Shirt, Sword, Target } from 'lucide-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { EquipmentItem, EquipmentKind } from '../types';

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

export const formatStatName = (name: string, suffix?: string): string => {
	const base = STAT_NAME_LABELS[name] || name;
	return suffix ? `${base} ${suffix}` : base;
};

/**
 * Collect unique stat names from items for a given accessor function.
 */
