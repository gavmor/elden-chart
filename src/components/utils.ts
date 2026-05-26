import React from 'react';
import { HardHat, Shirt, Hand, Footprints, Circle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ArmorItem, StatKey } from './types';

export const getCategoryIcon = (category: string, props: LucideProps) => {
  switch(category) {
    case 'Helm': return React.createElement(HardHat, props);
    case 'Chest Armor': return React.createElement(Shirt, props);
    case 'Gauntlets': return React.createElement(Hand, props);
    case 'Leg Armor': return React.createElement(Footprints, props);
    default: return React.createElement(Circle, props);
  }
};

export const getItemStat = (item: ArmorItem, statName: string): number => {
  if (statName === 'weight') return item.weight;
  if (statName === 'total_negation') {
    return item.dmgNegation.reduce((sum, s) => sum + s.amount, 0);
  }
  if (statName === 'total_resistance') {
    return item.resistance.filter(s => s.name !== 'Poise').reduce((sum, s) => sum + s.amount, 0);
  }
  
  const negation = item.dmgNegation.find(s => s.name === statName);
  if (negation) return negation.amount;
  
  const resistance = item.resistance.find(s => s.name === statName);
  if (resistance) return resistance.amount;
  
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
  const hue = 220 - ratio * 220;
  return `hsl(${hue}, 30%, 18%)`;
};

/**
 * Compute row-wide min/max for a given stat across an array of items.
 */
export const getStatRange = (items: ArmorItem[], statName: string): { min: number; max: number } => {
  const vals = items.map(item => getItemStat(item, statName));
  return { min: Math.min(...vals), max: Math.max(...vals) };
};

export const getItemColor = (
  item: ArmorItem,
  colorVar: string,
  minMax: { min: number; max: number } | null
): string => {
  if (colorVar === 'category') {
    // Specific premium colors for our 4 categories to keep them highly recognizable
    switch(item.category) {
      case 'Helm': return 'hsl(34, 97%, 64%)'; // Amber
      case 'Chest Armor': return 'hsl(262, 83%, 68%)'; // Purple
      case 'Gauntlets': return 'hsl(142, 70%, 50%)'; // Emerald
      case 'Leg Armor': return 'hsl(199, 89%, 48%)'; // Sky
      default: return 'hsl(215, 20%, 65%)'; // Slate
    }
  }
  
  // Otherwise, it's a numerical stat!
  const val = getItemStat(item, colorVar);
  if (!minMax) return '#94a3b8';
  
  const { min, max } = minMax;
  const range = max - min || 1;
  const ratio = Math.max(0, Math.min(1, (val - min) / range));
  
  // Heatmap gradient: Blue (cold/low, hue 220) ➔ Cyan ➔ Green ➔ Yellow ➔ Orange ➔ Red (hot/high, hue 0)
  // Maps ratio (0 to 1) onto hue (220 to 0)
  const hue = 220 - ratio * 220;
  return `hsl(${hue}, 85%, 60%)`;
};

/**
 * Returns the item image URL, falling back to a dynamically themed SVG data URI if null.
 */
export const getItemImageUrl = (item: ArmorItem, color: string): string => {
  if (item.image) return item.image;
  
  let svgContent = '';
  if (item.category === 'Helm') {
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
  items: ArmorItem[],
  xVar: StatKey,
  yVar: StatKey
): ArmorItem[] => {
  if (items.length === 0) return [];

  // Determine optimization direction
  const optX = xVar === 'weight' ? 'minimize' : 'maximize';
  const optY = yVar === 'weight' ? 'minimize' : 'maximize';

  // Helper to check if item A dominates item B
  const dominates = (a: ArmorItem, b: ArmorItem): boolean => {
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

  // Find all items that are NOT dominated by any other item
  const frontier = items.filter(item => {
    return !items.some(other => other.id !== item.id && dominates(other, item));
  });

  // Sort frontier points by X ascending to draw a continuous path
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
