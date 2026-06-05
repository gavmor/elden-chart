import type { EquipmentItem } from '../types';
import CompareModalStatRow from './StatRow';

interface Props {
  title: string;
  stats: string[];
  customSet: EquipmentItem[];
  colCount: number;
  labelFormatter?: (stat: string) => React.ReactNode;
  labelClassName?: string;
  formatValue?: (n: number) => string;
  simulationContext?: import('../types').SimulationContext;
}

export default function CompareModalStatGroup({
  title,
  stats,
  customSet,
  colCount,
  labelFormatter = (s) => s,
  labelClassName,
  formatValue,
  simulationContext,
}: Props) {
  if (stats.length === 0) return null;

  return (
    <>
      <tr className="bg-panel/60">
        <td colSpan={colCount} className="p-2 px-3 text-[10px] uppercase font-bold text-accent/80 tracking-wider pl-4">
          {title}
        </td>
      </tr>
      {stats.map((stat) => (
        <CompareModalStatRow
          key={stat}
          customSet={customSet}
          statName={stat}
          label={labelFormatter(stat)}
          labelClassName={labelClassName}
          formatValue={formatValue}
          simulationContext={simulationContext}
        />
      ))}
    </>
  );
}
