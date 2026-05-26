import type { ArmorItem } from './types';
import { getCategoryIcon } from './utils';

interface Props {
  item: ArmorItem;
}

export default function CompareModalItemHeader({ item }: Props) {
  return (
    <th className="p-3 bg-slate-950/10 min-w-[150px]">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded bg-slate-950 flex items-center justify-center border border-slate-800 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
          ) : (
            getCategoryIcon(item.category, { className: "w-6 h-6 text-slate-600", fill: "currentColor" })
          )}
        </div>
        <span className="font-bold text-white text-xs line-clamp-1">{item.name}</span>
        <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-750 flex items-center gap-1 w-fit">
          {getCategoryIcon(item.category, { className: "w-2.5 h-2.5", fill: "currentColor" })}
          {item.category.replace(' Armor', '')}
        </span>
      </div>
    </th>
  );
}
