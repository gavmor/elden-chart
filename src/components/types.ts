export const CATEGORIES = ['Helm', 'Chest Armor', 'Gauntlets', 'Leg Armor'] as const;
export type Category = typeof CATEGORIES[number];

export interface ApiStat {
  name: string;
  amount: number;
}

export interface ArmorItem {
  id: string;
  name: string;
  image: string | null;
  category: string;
  description: string;
  weight: number;
  dmgNegation: ApiStat[];
  resistance: ApiStat[];
}

export type StatKey =
  | 'weight'
  | 'total_negation'
  | 'Phy'
  | 'Strike'
  | 'Slash'
  | 'Pierce'
  | 'Magic'
  | 'Fire'
  | 'Ligt'
  | 'Holy'
  | 'total_resistance'
  | 'Immunity'
  | 'Robustness'
  | 'Focus'
  | 'Vitality'
  | 'Poise';

export type ColorKey = 'category' | StatKey;

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
  { id: 'Phy', label: 'Physical Negation', group: 'Negation' },
  { id: 'Strike', label: 'Strike Negation', group: 'Negation' },
  { id: 'Slash', label: 'Slash Negation', group: 'Negation' },
  { id: 'Pierce', label: 'Pierce Negation', group: 'Negation' },
  { id: 'Magic', label: 'Magic Negation', group: 'Negation' },
  { id: 'Fire', label: 'Fire Negation', group: 'Negation' },
  { id: 'Ligt', label: 'Lightning Negation', group: 'Negation' }, // API uses "Ligt"
  { id: 'Holy', label: 'Holy Negation', group: 'Negation' },
  { id: 'total_resistance', label: 'Total Resistance', group: 'Resistance' },
  { id: 'Immunity', label: 'Immunity', group: 'Resistance' },
  { id: 'Robustness', label: 'Robustness', group: 'Resistance' },
  { id: 'Focus', label: 'Focus', group: 'Resistance' },
  { id: 'Vitality', label: 'Vitality', group: 'Resistance' },
  { id: 'Poise', label: 'Poise', group: 'Resistance' },
];
