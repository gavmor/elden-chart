import type { ArmorItem } from './types';
import CompareModalItemHeader from './CompareModalItemHeader';
import CompareModalWeightRow from './CompareModalWeightRow';
import CompareModalStatRow from './CompareModalStatRow';

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
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm text-left">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/20 w-40">
              Stat
            </th>
            {customSet.map(item => (
              <CompareModalItemHeader key={item.id} item={item} />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          <CompareModalWeightRow customSet={customSet} />

          <tr className="bg-slate-950/40">
            <td colSpan={customSet.length + 1} className="p-2 px-3 text-[10px] uppercase font-bold text-amber-500/80 tracking-wider pl-4">
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

          <tr className="bg-slate-950/40">
            <td colSpan={customSet.length + 1} className="p-2 px-3 text-[10px] uppercase font-bold text-amber-500/80 tracking-wider pl-4">
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
