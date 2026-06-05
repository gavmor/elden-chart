import type { EquipmentItem, ApiStat } from '../types';
import CompareModalItemHeader from './ItemHeader';
import CompareModalWeightRow from './WeightRow';
import CompareModalStatGroup from './StatGroup';

interface Props {
  customSet: EquipmentItem[];
  simulationContext?: import('../types').SimulationContext;
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

export default function CompareModalTable({ customSet, simulationContext }: Props) {
  const showDelta = customSet.length === 2;
  const colCount = customSet.length + 1 + (showDelta ? 1 : 0);

  // Determine what kinds are present
  const kinds = new Set(customSet.map(i => i.kind));
  const isAllArmor = kinds.size === 1 && kinds.has('armor');
  const isAllWeaponLike = Array.from(kinds).every(k => k === 'weapon' || k === 'shield' || k === 'ammo') && !kinds.has('armor');
  const isAllDeadlockUpgrade = kinds.size === 1 && kinds.has('deadlock_upgrade');
  // Mixed sets show only weight

  const negationStats = isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.dmgNegation : []) : [];
  const resistanceStats = isAllArmor ? collectOrderedStats(customSet, i => i.kind === 'armor' ? i.resistance : []) : [];
  const attackStats = isAllWeaponLike ? collectOrderedStats(customSet, i => (i.kind === 'weapon' || i.kind === 'shield' || i.kind === 'ammo') ? i.attack : []) : [];
  const defenceStats = isAllWeaponLike ? collectOrderedStats(customSet, i => (i.kind === 'weapon' || i.kind === 'shield') ? i.defence : []) : [];
  const deadlockStats = isAllDeadlockUpgrade ? collectOrderedStats(customSet, i => i.kind === 'deadlock_upgrade' ? i.properties : []) : [];

  const calculatedStats = isAllDeadlockUpgrade ? ['ehp', 'integrated_armor', 'ehp_per_soul', 'Final Bullet DPS', 'Final Spirit DPS'] : [];

  const renderCalculatedLabel = (stat: string) => {
    const labels: Record<string, { name: string; formula: string }> = {
      'ehp': { name: 'Effective HP', formula: 'BaseHealth / (1 - BulletResist)' },
      'integrated_armor': { name: 'Total Integrated Armor', formula: '(1 - Π(1-Buff)) - (1 - Π(1-Shred))' },
      'ehp_per_soul': { name: 'eHP / Soul', formula: 'Marginal eHP / Cost' },
      'Final Bullet DPS': { name: 'Final Bullet DPS', formula: '(BaseDPS * FireRateMod) * (1 - EffectiveResist)' },
      'Final Spirit DPS': { name: 'Final Spirit DPS', formula: '(BaseDPS + SpiritPower * Coeff) * (1 - EffectiveResist)' }
    };
    const data = labels[stat] || { name: stat, formula: '' };
    return (
      <div className="flex flex-col">
        <span>{data.name}</span>
        {data.formula && <span className="text-[9px] text-muted-foreground/70 font-mono mt-0.5">{data.formula}</span>}
      </div>
    );
  };

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

          <CompareModalStatGroup
            title="Calculated Metrics"
            stats={calculatedStats}
            customSet={customSet}
            colCount={colCount}
            labelFormatter={renderCalculatedLabel}
            simulationContext={simulationContext}
            formatValue={n => n.toFixed(2)}
          />

          <CompareModalStatGroup
            title="Item Properties"
            stats={deadlockStats}
            customSet={customSet}
            colCount={colCount}
            labelFormatter={statLabel}
            simulationContext={simulationContext}
          />

          <CompareModalStatGroup
            title="Damage Negation (%)"
            stats={negationStats}
            customSet={customSet}
            colCount={colCount}
            labelFormatter={statLabel}
            simulationContext={simulationContext}
          />

          <CompareModalStatGroup
            title="Resistances & Poise"
            stats={resistanceStats}
            customSet={customSet}
            colCount={colCount}
            labelClassName="font-semibold"
            formatValue={n => n.toFixed(0)}
            simulationContext={simulationContext}
          />

          <CompareModalStatGroup
            title="Attack"
            stats={attackStats}
            customSet={customSet}
            colCount={colCount}
            labelFormatter={formatAttackLabel}
            simulationContext={simulationContext}
          />

          <CompareModalStatGroup
            title="Defence"
            stats={defenceStats}
            customSet={customSet}
            colCount={colCount}
            labelFormatter={formatDefenceLabel}
            simulationContext={simulationContext}
          />
        </tbody>
      </table>
    </div>
  );
}
