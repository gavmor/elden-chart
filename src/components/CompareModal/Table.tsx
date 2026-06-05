import type { EquipmentItem } from '../types';
import CompareModalItemHeader from './ItemHeader';
import CompareModalWeightRow from './WeightRow';
import CompareModalStatGroup from './StatGroup';

interface Props {
  customSet: EquipmentItem[];
  simulationContext?: import('../types').SimulationContext;
}

import { useCompareTableState } from './useCompareTableState';
import { statLabel, formatAttackLabel, formatDefenceLabel, renderCalculatedLabel } from './formatLabels';

export default function CompareModalTable({ customSet, simulationContext }: Props) {
  const { 
    showDelta, 
    colCount, 
    negationStats, 
    resistanceStats, 
    attackStats, 
    defenceStats, 
    deadlockStats, 
    calculatedStats 
  } = useCompareTableState(customSet);

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
