export const CATEGORIES = ['Helm', 'Chest Armor', 'Gauntlets', 'Leg Armor'] as const;
export type Category = typeof CATEGORIES[number];

export interface ArmorItem {
  id: string;
  name: string;
  image: string | null;
  category: string;
  location: string;
  weight: number;
  
  total_negation: number;
  phy: number;
  strike: number;
  slash: number;
  pierce: number;
  mag: number;
  fire: number;
  lite: number;
  holy: number;

  total_resistance: number;
  immunity: number;
  robustness: number;
  focus: number;
  vitality: number;
  poise: number;
}

export type StatKey =
  | 'weight'
  | 'total_negation'
  | 'phy'
  | 'strike'
  | 'slash'
  | 'pierce'
  | 'mag'
  | 'fire'
  | 'lite'
  | 'holy'
  | 'total_resistance'
  | 'immunity'
  | 'robustness'
  | 'focus'
  | 'vitality'
  | 'poise';

export interface StatOption {
  id: StatKey;
  label: string;
  group: string;
}

export interface ActiveCategories {
  [key: string]: boolean;
}

export const STAT_OPTIONS: StatOption[] = [
  { id: 'weight', label: 'Weight', group: 'General' },
  { id: 'total_negation', label: 'Total Damage Negation', group: 'Negation' },
  { id: 'phy', label: 'Physical Negation', group: 'Negation' },
  { id: 'strike', label: 'Strike Negation', group: 'Negation' },
  { id: 'slash', label: 'Slash Negation', group: 'Negation' },
  { id: 'pierce', label: 'Pierce Negation', group: 'Negation' },
  { id: 'mag', label: 'Magic Negation', group: 'Negation' },
  { id: 'fire', label: 'Fire Negation', group: 'Negation' },
  { id: 'lite', label: 'Lightning Negation', group: 'Negation' },
  { id: 'holy', label: 'Holy Negation', group: 'Negation' },
  { id: 'total_resistance', label: 'Total Resistance', group: 'Resistance' },
  { id: 'immunity', label: 'Immunity', group: 'Resistance' },
  { id: 'robustness', label: 'Robustness', group: 'Resistance' },
  { id: 'focus', label: 'Focus', group: 'Resistance' },
  { id: 'vitality', label: 'Vitality', group: 'Resistance' },
  { id: 'poise', label: 'Poise', group: 'Resistance' },
];
