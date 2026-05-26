import type { ArmorItem, WeaponItem, ShieldItem } from '../types';

export const helmItem: ArmorItem = {
  id: 'helm-1',
  name: 'Tree Sentinel Helm',
  image: 'http://example.com/helm.png',
  category: 'Helm',
  description: 'Helm of the Tree Sentinel',
  weight: 4.2,
  kind: 'armor',
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
  kind: 'armor',
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
  kind: 'armor',
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

export const longswordItem: WeaponItem = {
  id: 'weapon-1',
  name: 'Longsword',
  image: null,
  category: 'Straight Sword',
  description: 'A standard straight sword',
  weight: 3.5,
  kind: 'weapon',
  attack: [
    { name: 'Phy', amount: 110 },
    { name: 'Crit', amount: 100 },
  ],
  defence: [
    { name: 'Phy', amount: 45 },
    { name: 'Mag', amount: 0 },
    { name: 'Fire', amount: 0 },
    { name: 'Ligt', amount: 0 },
    { name: 'Holy', amount: 0 },
    { name: 'Boost', amount: 30 },
  ],
  scalesWith: [
    { name: 'Str', scaling: 'D' },
    { name: 'Dex', scaling: 'D' },
  ],
  requiredAttributes: [
    { name: 'Str', amount: 10 },
    { name: 'Dex', amount: 10 },
  ],
};

export const heaterShieldItem: ShieldItem = {
  id: 'shield-1',
  name: 'Heater Shield',
  image: null,
  category: 'Small Shield',
  description: 'A standard heater shield',
  weight: 3.5,
  kind: 'shield',
  attack: [
    { name: 'Phy', amount: 65 },
  ],
  defence: [
    { name: 'Phy', amount: 100 },
    { name: 'Mag', amount: 50 },
    { name: 'Fire', amount: 60 },
    { name: 'Ligt', amount: 40 },
    { name: 'Holy', amount: 55 },
    { name: 'Boost', amount: 48 },
  ],
  scalesWith: [
    { name: 'Str', scaling: 'D' },
  ],
  requiredAttributes: [
    { name: 'Str', amount: 8 },
  ],
};

export const mockCustomSet = [helmItem, chestItem, gauntletsItem];
export const mockWeaponSet = [longswordItem];
export const mockMixedSet = [helmItem, longswordItem];
