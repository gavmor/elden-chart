import type { EquipmentItem } from '../types';
import { getCategoryIcon } from '../utils';

interface Props {
  item: EquipmentItem;
}

export default function CompareModalItemHeader({ item }: Props) {
  return (
    <th className="p-3 bg-panel/30 min-w-[150px]">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded bg-panel-empty flex items-center justify-center border border-accent/20 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
          ) : (
            getCategoryIcon(item.category, item.kind, { className: "w-6 h-6 text-muted", fill: "currentColor" })
          )}
        </div>
        <span className="font-bold text-body text-xs line-clamp-1">{item.name}</span>
        <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-panel-active text-muted border border-accent/10 flex items-center gap-1 w-fit">
          {getCategoryIcon(item.category, item.kind, { className: "w-2.5 h-2.5", fill: "currentColor" })}
          {item.category.replace(' Armor', '')}
        </span>
      </div>
    </th>
  );
}
