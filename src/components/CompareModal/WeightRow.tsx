import type { ArmorItem } from '../types';
import { getStatRange } from '../utils';
import CompareModalStatCell from './StatCell';

interface Props {
  customSet: ArmorItem[];
}

export default function CompareModalWeightRow({ customSet }: Props) {
  const { min, max } = getStatRange(customSet, 'weight');

  const values = customSet.map(item => item.weight);
  const bestValue = Math.min(...values);
  const delta = customSet.length === 2 ? values[1] - values[0] : null;

  return (
    <tr className="hover:bg-panel-active/40">
      <td className="p-3 font-semibold text-body bg-panel/40 pl-4">Weight</td>
      {customSet.map((item) => (
        <CompareModalStatCell
          key={`weight-${item.id}`}
          value={item.weight}
          min={min}
          max={max}
          invert
          formatValue={n => n.toFixed(1)}
          isBest={item.weight === bestValue}
        />
      ))}
      {delta !== null && (
        <td className="p-3 text-center text-xs font-mono bg-panel/40">
          <span className={
            delta > 0 ? 'text-worse' : delta < 0 ? 'text-better' : 'text-muted'
          }>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </span>
        </td>
      )}
    </tr>
  );
}
