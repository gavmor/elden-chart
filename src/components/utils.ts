import React from 'react';
import { HardHat, Shirt, Hand, Footprints, Sword, Shield, Circle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { EquipmentItem, StatOption, EquipmentKind } from './types';

export const getCategoryIcon = (category: string, kind: EquipmentKind, props: LucideProps) => {
  if (kind === 'weapon') return React.createElement(Sword, props);
  if (kind === 'shield') return React.createElement(Shield, props);

  // Armor categories
  switch(category) {
    case 'Helm': return React.createElement(HardHat, props);
    case 'Chest Armor': return React.createElement(Shirt, props);
    case 'Gauntlets': return React.createElement(Hand, props);
    case 'Leg Armor': return React.createElement(Footprints, props);
    default: return React.createElement(Circle, props);
  }
};

export const getItemStat = (item: EquipmentItem, statName: string): number => {
  if (statName === 'weight') return item.weight;

  if (statName === 'total_attack') {
    if (item.kind === 'armor') return 0;
    return item.attack.reduce((sum, s) => sum + s.amount, 0);
  }
  if (statName === 'total_defence') {
    if (item.kind === 'armor') return 0;
    return item.defence.reduce((sum, s) => sum + s.amount, 0);
  }
  if (statName === 'total_negation') {
    if (item.kind !== 'armor') return 0;
    return item.dmgNegation.reduce((sum, s) => sum + s.amount, 0);
  }
  if (statName === 'total_resistance') {
    if (item.kind !== 'armor') return 0;
    return item.resistance.filter(s => s.name !== 'Poise').reduce((sum, s) => sum + s.amount, 0);
  }

  // Named stats — check appropriate arrays based on item kind
  if (item.kind === 'armor') {
    const negation = item.dmgNegation.find(s => s.name === statName);
    if (negation) return negation.amount;
    const resistance = item.resistance.find(s => s.name === statName);
    if (resistance) return resistance.amount;
  } else {
    const attack = item.attack.find(s => s.name === statName);
    if (attack) return attack.amount;
    const defence = item.defence.find(s => s.name === statName);
    if (defence) return defence.amount;
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
export const getStatRange = (items: EquipmentItem[], statName: string): { min: number; max: number } => {
  const vals = items.map(item => getItemStat(item, statName));
  return { min: Math.min(...vals), max: Math.max(...vals) };
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
 * Returns the item image URL, falling back to a dynamically themed SVG data URI if null.
 */
export const getItemImageUrl = (item: EquipmentItem, color: string): string => {
  if (item.image) return item.image;

  let svgContent = '';
  if (item.kind === 'weapon') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6l2-2 11.5 11.5"/><path d="M17.5 14.5 6 3l2-2 11.5 11.5"/><path d="M9 15l2-2"/><path d="M14 10l2-2"/><path d="M20 21l-2-2-2 2"/></svg>`;
  } else if (item.kind === 'shield') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  } else if (item.category === 'Helm') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10a10 10 0 0 1 20 0v2a10 10 0 0 1-20 0v-2z"/><path d="M12 2v8"/><path d="M5 12h14"/></svg>`;
  } else if (item.category === 'Chest Armor') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 7.57V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4.57L3.62 3.46a2 2 0 0 0-2.65.65L.1 5.3a2 2 0 0 0 .67 2.64L5 11v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8l4.23-3.06a2 2 0 0 0 .67-2.64L23.03 4.1a2 2 0 0 0-2.65-.64z"/></svg>`;
  } else if (item.category === 'Gauntlets') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v8H2z"/></svg>`;
  } else if (item.category === 'Leg Armor') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V2h6v20H3zM15 22V2h6v20h-6z"/></svg>`;
  } else {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
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

  const optX = xVar === 'weight' ? 'minimize' : 'maximize';
  const optY = yVar === 'weight' ? 'minimize' : 'maximize';

  const dominates = (a: EquipmentItem, b: EquipmentItem): boolean => {
    const xA = getItemStat(a, xVar);
    const xB = getItemStat(b, xVar);
    const yA = getItemStat(a, yVar);
    const yB = getItemStat(b, yVar);

    const betterOrEqualX = optX === 'minimize' ? xA <= xB : xA >= xB;
    const betterOrEqualY = optY === 'minimize' ? yA <= yB : yA >= yB;

    const strictlyBetterX = optX === 'minimize' ? xA < xB : xA > xB;
    const strictlyBetterY = optY === 'minimize' ? yA < yB : yA > yB;

    return betterOrEqualX && betterOrEqualY && (strictlyBetterX || strictlyBetterY);
  };

  const frontier = items.filter(item => {
    return !items.some(other => other.id !== item.id && dominates(other, item));
  });

  frontier.sort((a, b) => {
    const xA = getItemStat(a, xVar);
    const xB = getItemStat(b, xVar);
    if (xA !== xB) return xA - xB;

    const yA = getItemStat(a, yVar);
    const yB = getItemStat(b, yVar);
    return yA - yB;
  });

  return frontier;
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
const collectStatNames = (items: EquipmentItem[], accessor: (item: EquipmentItem) => { name: string }[]): string[] => {
  const names = new Set<string>();
  for (const item of items) {
    for (const s of accessor(item)) {
      names.add(s.name);
    }
  }
  return [...names];
};

/**
 * Generates dynamic stat options based on which equipment kinds are present.
 * Stat names are derived from the actual item data — not hardcoded.
 * When armor and weapons/shields are mixed, only weight is offered (incompatible stat systems).
 */
export const getAvailableStats = (items: EquipmentItem[]): StatOption[] => {
  const kinds = new Set(items.map(i => i.kind));
  const stats: StatOption[] = [];

  // weight is always available
  stats.push({ id: 'weight', label: 'Weight', group: 'General' });

  const hasArmor = kinds.has('armor');
  const hasWeaponLike = kinds.has('weapon') || kinds.has('shield');

  // If both armor and weapon-like items are present, stat systems are incompatible
  if (hasArmor && hasWeaponLike) return stats;

  if (hasArmor) {
    const negationNames = collectStatNames(items, i => i.kind === 'armor' ? i.dmgNegation : []);
    const resistanceNames = collectStatNames(items, i => i.kind === 'armor' ? i.resistance : []);

    if (negationNames.length > 0) {
      stats.push({ id: 'total_negation', label: 'Total Damage Negation', group: 'Armor Negation' });
      for (const name of negationNames) {
        stats.push({ id: name, label: formatStatName(name, 'Negation'), group: 'Armor Negation' });
      }
    }
    if (resistanceNames.length > 0) {
      stats.push({ id: 'total_resistance', label: 'Total Resistance', group: 'Armor Resistance' });
      for (const name of resistanceNames) {
        stats.push({ id: name, label: formatStatName(name), group: 'Armor Resistance' });
      }
    }
  } else if (hasWeaponLike) {
    const attackNames = collectStatNames(items, i => i.kind !== 'armor' ? i.attack : []);
    const defenceNames = collectStatNames(items, i => i.kind !== 'armor' ? i.defence : []);

    if (attackNames.length > 0) {
      stats.push({ id: 'total_attack', label: 'Total Attack', group: 'Weapon Attack' });
      for (const name of attackNames) {
        stats.push({ id: name, label: formatStatName(name, 'Attack'), group: 'Weapon Attack' });
      }
    }
    if (defenceNames.length > 0) {
      stats.push({ id: 'total_defence', label: 'Total Defence', group: 'Weapon Defence' });
      for (const name of defenceNames) {
        stats.push({ id: name, label: formatStatName(name, 'Defence'), group: 'Weapon Defence' });
      }
    }
  }

  return stats;
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
