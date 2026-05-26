import type { ArmorItem } from '../types';
import { getStatRange } from '../utils';
import CompareModalStatCell from './StatCell';

interface Props {
  customSet: ArmorItem[];
}

export default function CompareModalWeightRow({ customSet }: Props) {
  const { min, max } = getStatRange(customSet, 'weight');

  return (
    <tr className="hover:bg-slate-850/50">
      <td className="p-3 font-semibold text-slate-350 bg-slate-950/20 pl-4">Weight</td>
      {customSet.map(item => (
        <CompareModalStatCell
          key={`weight-${item.id}`}
          value={item.weight}
          min={min}
          max={max}
          invert
          formatValue={n => n.toFixed(1)}
        />
      ))}
    </tr>
  );
}
