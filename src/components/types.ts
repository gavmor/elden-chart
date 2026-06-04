export interface ApiStat {
  name: string;
  amount: number;
}

export type EquipmentKind = 'armor' | 'weapon' | 'shield' | 'ammo' | 'deadlock_upgrade' | 'deadlock_ability';

export interface EquipmentBase {
  id: string;
  name: string;
  image: string | null;
  category: string;
  description: string;
  weight: number;
  kind: EquipmentKind;
  isActive?: boolean;
}

export interface ScalingStat {
  name: string;
  scaling: string;
}

export interface ArmorItem extends EquipmentBase {
  kind: 'armor';
  dmgNegation: ApiStat[];
  resistance: ApiStat[];
}

export interface WeaponItem extends EquipmentBase {
  kind: 'weapon';
  attack: ApiStat[];
  defence: ApiStat[];
  scalesWith: ScalingStat[];
  requiredAttributes: ApiStat[];
}

export interface ShieldItem extends EquipmentBase {
  kind: 'shield';
  attack: ApiStat[];
  defence: ApiStat[];
  scalesWith: ScalingStat[];
  requiredAttributes: ApiStat[];
}

export interface AmmoItem extends EquipmentBase {
  kind: 'ammo';
  attack: ApiStat[];
  passive: string;
}

export interface DeadlockUpgradeItem extends EquipmentBase {
  kind: 'deadlock_upgrade';
  properties: ApiStat[];
}

export interface AbilityTier {
  tierIndex: number; // 1, 2, 3
  apCost: number; // Tiers cost 1, 2, and 5 Ability Points respectively
  description: string;
  modifiers: ApiStat[];
}

export interface DeadlockAbilityItem extends EquipmentBase {
  kind: 'deadlock_ability';
  className: string;
  heroName: string;
  isUltimate: boolean;
  startTrained: boolean;
  properties: ApiStat[]; // Baseline properties when unlocked
  upgrades: [AbilityTier, AbilityTier, AbilityTier]; // Tier upgrades
}

export type EquipmentItem =
  | ArmorItem
  | WeaponItem
  | ShieldItem
  | AmmoItem
  | DeadlockUpgradeItem
  | DeadlockAbilityItem;

export type ColorKey = string;

export interface StatOption {
  id: string;
  label: string;
  group: string;
}

export interface ActiveCategories {
  [key: string]: boolean;
}

export interface SpiritConversion {
  stat: 'ammo' | 'fireRate' | string;
  multiplier: number;
}

export interface AbilityCoefficient {
  abilityName: string;
  type: 'ranged' | 'healing' | 'duration' | 'other';
  coefficient: number;
}

export interface Hero {
  name: string;
  shotTime: number;
  pauseTime: number;
  spiritConversions: SpiritConversion[];
  abilityCoefficients: AbilityCoefficient[];
}

export interface SimulationContext {
  hero: Hero;
  customSet: EquipmentItem[];
}
