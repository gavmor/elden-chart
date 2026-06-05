import type { EquipmentItem } from '../types';
import { getItemStat, getStatRange } from '../domain/math';
import CompareModalStatCell from './StatCell';

interface Props {
  customSet: EquipmentItem[];
  statName: string;
  label: React.ReactNode;
  labelClassName?: string;
  invert?: boolean;
  formatValue?: (n: number) => string;
  simulationContext?: import('../types').SimulationContext;
}

export default function CompareModalStatRow({
  customSet,
  statName,
  label,
  labelClassName = '',
  invert = false,
  formatValue,
  simulationContext,
}: Props) {
  const { min, max } = getStatRange(customSet, statName, simulationContext);

  const values = customSet.map(item => getItemStat(item, statName, simulationContext));
  const bestValue = invert ? Math.min(...values) : Math.max(...values);
  const delta = customSet.length === 2 ? values[1] - values[0] : null;

  return (
    <tr className="hover:bg-panel-active/40">
      <td className={`p-3 text-muted pl-6 bg-panel/40 ${labelClassName}`}>{label}</td>
      {customSet.map((item) => (
        <CompareModalStatCell
          key={`${statName}-${item.id}`}
          value={getItemStat(item, statName, simulationContext)}
          min={min}
          max={max}
          invert={invert}
          formatValue={formatValue}
          isBest={getItemStat(item, statName, simulationContext) === bestValue}
        />
      ))}
      {delta !== null && (
        <td className="p-3 text-center text-xs font-mono bg-panel/40">
          <span className={
            delta > 0 ? 'text-better' : delta < 0 ? 'text-worse' : 'text-muted'
          }>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </span>
        </td>
      )}
    </tr>
  );
}
