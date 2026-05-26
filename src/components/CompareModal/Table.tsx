import type { EquipmentItem, ApiStat } from '../types';
import CompareModalItemHeader from './ItemHeader';
import CompareModalWeightRow from './WeightRow';
import CompareModalStatRow from './StatRow';

interface Props {
  customSet: EquipmentItem[];
}

const statLabel = (stat: string): string => {
  switch (stat) {
    case 'Ligt': return 'Lightning';
    case 'Phy': return 'Physical';
    case 'Mag': return 'Magic';
    default: return stat;
  }
};

const formatAttackLabel = (name: string): string => statLabel(name);
const formatDefenceLabel = (name: string): string => statLabel(name);

/**
 * Collect stat names from items for a given accessor, maintaining API order.
 */
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

export default function CompareModalTable({ customSet }: Props) {
  const showDelta = customSet.length === 2;
  const colCount = customSet.length + 1 + (showDelta ? 1 : 0);

  // Determine what kinds are present
  const kinds = new Set(customSet.map(i => i.kind));
  const isAllArmor = kinds.size === 1 && kinds.has('armor');
  const isAllWeaponLike = kinds.size === 1 && (kinds.has('weapon') || kinds.has('shield'));
  // Mixed sets show only weight

  const negationStats = isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.dmgNegation : []) : [];
  const resistanceStats = isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.resistance : []) : [];
  const attackStats = isAllWeaponLike ? collectOrderedStats(customSet, i => i.kind !== 'armor' ? i.attack : []) : [];
  const defenceStats = isAllWeaponLike ? collectOrderedStats(customSet, i => i.kind !== 'armor' ? i.defence : []) : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm text-left">
        <thead>
          <tr className="border-b border-accent/20">
            <th className="p-3 text-xs font-semibold text-muted uppercase tracking-wider bg-panel/40 w-40">
              Stat
            </th>
            {customSet.map(item => (
              <CompareModalItemHeader key={item.id} item={item} />
            ))}
            {showDelta && (
              <th className="p-3 text-xs font-semibold text-muted uppercase tracking-wider bg-panel/40 text-center w-16">
                Δ
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-accent/10">
          <CompareModalWeightRow customSet={customSet} />

          {negationStats.length > 0 && (
            <>
              <tr className="bg-panel/60">
                <td colSpan={colCount} className="p-2 px-3 text-[10px] uppercase font-bold text-accent/80 tracking-wider pl-4">
                  Damage Negation (%)
                </td>
              </tr>
              {negationStats.map(stat => (
                <CompareModalStatRow
                  key={stat}
                  customSet={customSet}
                  statName={stat}
                  label={statLabel(stat)}
                />
              ))}
            </>
          )}

          {resistanceStats.length > 0 && (
            <>
              <tr className="bg-panel/60">
                <td colSpan={colCount} className="p-2 px-3 text-[10px] uppercase font-bold text-accent/80 tracking-wider pl-4">
                  Resistances & Poise
                </td>
              </tr>
              {resistanceStats.map(stat => (
                <CompareModalStatRow
                  key={stat}
                  customSet={customSet}
                  statName={stat}
                  label={stat}
                  labelClassName="font-semibold"
                  formatValue={n => n.toFixed(0)}
                />
              ))}
            </>
          )}

          {attackStats.length > 0 && (
            <>
              <tr className="bg-panel/60">
                <td colSpan={colCount} className="p-2 px-3 text-[10px] uppercase font-bold text-accent/80 tracking-wider pl-4">
                  Attack
                </td>
              </tr>
              {attackStats.map(stat => (
                <CompareModalStatRow
                  key={`atk-${stat}`}
                  customSet={customSet}
                  statName={stat}
                  label={formatAttackLabel(stat)}
                />
              ))}
            </>
          )}

          {defenceStats.length > 0 && (
            <>
              <tr className="bg-panel/60">
                <td colSpan={colCount} className="p-2 px-3 text-[10px] uppercase font-bold text-accent/80 tracking-wider pl-4">
                  Defence
                </td>
              </tr>
              {defenceStats.map(stat => (
                <CompareModalStatRow
                  key={`def-${stat}`}
                  customSet={customSet}
                  statName={stat}
                  label={formatDefenceLabel(stat)}
                />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
