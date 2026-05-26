import type { ArmorItem } from './types';
import { getItemStat, getStatRange } from './utils';
import CompareModalStatCell from './CompareModalStatCell';

interface Props {
  customSet: ArmorItem[];
  statName: string;
  label: string;
  labelClassName?: string;
  invert?: boolean;
  formatValue?: (n: number) => string;
}

export default function CompareModalStatRow({
  customSet,
  statName,
  label,
  labelClassName = '',
  invert = false,
  formatValue,
}: Props) {
  const { min, max } = getStatRange(customSet, statName);

  return (
    <tr className="hover:bg-slate-855/30">
      <td className={`p-3 text-slate-400 pl-6 bg-slate-950/20 ${labelClassName}`}>{label}</td>
      {customSet.map(item => (
        <CompareModalStatCell
          key={`${statName}-${item.id}`}
          value={getItemStat(item, statName)}
          min={min}
          max={max}
          invert={invert}
          formatValue={formatValue}
        />
      ))}
    </tr>
  );
}
