import type { ArmorItem } from '../types';
import CompareModalItemHeader from './ItemHeader';
import CompareModalWeightRow from './WeightRow';
import CompareModalStatRow from './StatRow';

interface Props {
  customSet: ArmorItem[];
}

const negationStats = ['Phy', 'Strike', 'Slash', 'Pierce', 'Magic', 'Fire', 'Ligt', 'Holy'];
const resistanceStats = ['Immunity', 'Robustness', 'Focus', 'Vitality', 'Poise'];

const statLabel = (stat: string): string => {
  switch (stat) {
    case 'Ligt': return 'Lightning';
    case 'Phy': return 'Physical';
    default: return stat;
  }
};

export default function CompareModalTable({ customSet }: Props) {
  const showDelta = customSet.length === 2;
  const colCount = customSet.length + 1 + (showDelta ? 1 : 0);

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
        </tbody>
      </table>
    </div>
  );
}
