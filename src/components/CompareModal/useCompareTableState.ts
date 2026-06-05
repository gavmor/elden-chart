import { useMemo } from 'react';
import type { EquipmentItem, ApiStat } from '../types';

const collectOrderedStats = (items: EquipmentItem[], accessor: (item: EquipmentItem) => ApiStat[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    for (const s of accessor(item)) {
      if (!seen.has(s.name)) {
        seen.add(s.name);
        result.push(s.name);
      }
    }
  }
  return result;
};

export function useCompareTableState(customSet: EquipmentItem[]) {
  const showDelta = customSet.length === 2;
  const colCount = customSet.length + 1 + (showDelta ? 1 : 0);

  const statsGroups = useMemo(() => {
    const kinds = new Set(customSet.map(i => i.kind));
    const isAllArmor = kinds.size === 1 && kinds.has('armor');
    const isAllWeaponLike = Array.from(kinds).every(k => k === 'weapon' || k === 'shield' || k === 'ammo') && !kinds.has('armor');
    const isDeadlockContext = kinds.has('deadlock_upgrade') || kinds.has('deadlock_ability');

    return {
      negationStats: isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.dmgNegation : []) : [],
      resistanceStats: isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.resistance : []) : [],
      attackStats: isAllWeaponLike ? collectOrderedStats(customSet, i => (i.kind === 'weapon' || i.kind === 'shield' || i.kind === 'ammo') ? i.attack : []) : [],
      defenceStats: isAllWeaponLike ? collectOrderedStats(customSet, i => (i.kind === 'weapon' || i.kind === 'shield') ? i.defence : []) : [],
      deadlockStats: isDeadlockContext ? collectOrderedStats(customSet, i => (i.kind === 'deadlock_upgrade' || i.kind === 'deadlock_ability') ? i.properties : []) : [],
      calculatedStats: isDeadlockContext ? ['ehp', 'integrated_armor', 'ehp_per_soul', 'Final Bullet DPS', 'Final Spirit DPS'] : []
    };
  }, [customSet]);

  return {
    showDelta,
    colCount,
    ...statsGroups
  };
}
