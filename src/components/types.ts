export interface ApiStat {
  name: string;
  amount: number;
}

export type EquipmentKind = 'armor' | 'weapon' | 'shield';

export interface EquipmentBase {
  id: string;
  name: string;
  image: string | null;
  category: string;
  description: string;
  weight: number;
  kind: EquipmentKind;
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

export type EquipmentItem = ArmorItem | WeaponItem | ShieldItem;

export type ColorKey = string;

export interface StatOption {
  id: string;
  label: string;
  group: string;
}

export interface ActiveCategories {
  [key: string]: boolean;
}
