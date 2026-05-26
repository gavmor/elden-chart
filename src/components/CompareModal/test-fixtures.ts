import type { ArmorItem } from '../types';

export const helmItem: ArmorItem = {
  id: 'helm-1',
  name: 'Tree Sentinel Helm',
  image: 'http://example.com/helm.png',
  category: 'Helm',
  description: 'Helm of the Tree Sentinel',
  weight: 4.2,
  dmgNegation: [
    { name: 'Phy', amount: 5.5 },
    { name: 'Strike', amount: 4.0 },
    { name: 'Slash', amount: 5.0 },
    { name: 'Pierce', amount: 4.5 },
    { name: 'Magic', amount: 3.0 },
    { name: 'Fire', amount: 2.5 },
    { name: 'Ligt', amount: 2.0 },
    { name: 'Holy', amount: 1.5 },
  ],
  resistance: [
    { name: 'Immunity', amount: 22 },
    { name: 'Robustness', amount: 18 },
    { name: 'Focus', amount: 11 },
    { name: 'Vitality', amount: 9 },
    { name: 'Poise', amount: 6 },
  ],
};

export const chestItem: ArmorItem = {
  id: 'chest-1',
  name: 'Tree Sentinel Armor',
  image: null,
  category: 'Chest Armor',
  description: 'Chest piece of the Tree Sentinel',
  weight: 11.5,
  dmgNegation: [
    { name: 'Phy', amount: 12.0 },
    { name: 'Strike', amount: 9.5 },
    { name: 'Slash', amount: 11.0 },
    { name: 'Pierce', amount: 10.0 },
    { name: 'Magic', amount: 6.5 },
    { name: 'Fire', amount: 5.0 },
    { name: 'Ligt', amount: 4.0 },
    { name: 'Holy', amount: 3.0 },
  ],
  resistance: [
    { name: 'Immunity', amount: 35 },
    { name: 'Robustness', amount: 28 },
    { name: 'Focus', amount: 19 },
    { name: 'Vitality', amount: 14 },
    { name: 'Poise', amount: 14 },
  ],
};

export const gauntletsItem: ArmorItem = {
  id: 'gauntlets-1',
  name: 'Tree Sentinel Gauntlets',
  image: null,
  category: 'Gauntlets',
  description: 'Gauntlets of the Tree Sentinel',
  weight: 3.0,
  dmgNegation: [
    { name: 'Phy', amount: 3.0 },
    { name: 'Strike', amount: 2.5 },
    { name: 'Slash', amount: 3.5 },
    { name: 'Pierce', amount: 2.0 },
    { name: 'Magic', amount: 1.5 },
    { name: 'Fire', amount: 1.0 },
    { name: 'Ligt', amount: 0.5 },
    { name: 'Holy', amount: 0.3 },
  ],
  resistance: [
    { name: 'Immunity', amount: 12 },
    { name: 'Robustness', amount: 9 },
    { name: 'Focus', amount: 6 },
    { name: 'Vitality', amount: 5 },
    { name: 'Poise', amount: 3 },
  ],
};

export const mockCustomSet = [helmItem, chestItem, gauntletsItem];
