import { Weight } from 'lucide-react';
import type { ArmorItem, StatKey, ColorKey } from './types';
import { getCategoryIcon, getItemStat, getItemColor } from './utils';

interface TooltipProps {
  item: ArmorItem;
  tooltipPos: { x: number; y: number };
  xLabel: string;
  yLabel: string;
  xVar: StatKey;
  yVar: StatKey;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
}

export default function ArmorChartTooltip({
  item,
  tooltipPos,
  xLabel,
  yLabel,
  xVar,
  yVar,
  colorVar,
  colorMinMax
}: TooltipProps) {
  const color = getItemColor(item, colorVar, colorMinMax);

  return (
    <div 
      className="absolute z-30 w-64 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden pointer-events-none transition-transform duration-75 ease-out"
      style={{
        transform: `translate(${tooltipPos.x}px, ${tooltipPos.y}px)`,
      }}
    >
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: color }} 
      />
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded bg-slate-800 flex-shrink-0 flex items-center justify-center border border-slate-700 overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            ) : (
              getCategoryIcon(item.category, { className: "w-6 h-6 text-slate-500", fill: "currentColor" })
            )}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm leading-tight mb-1">{item.name}</h4>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 w-fit">
              {getCategoryIcon(item.category, { className: "w-3 h-3", fill: "currentColor" })}
              {item.category}
            </span>
          </div>
        </div>

        <div className="space-y-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5"><Weight className="w-3.5 h-3.5" /> Weight</span>
            <span className="font-medium text-white">{item.weight.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{xLabel}</span>
            <span className="font-medium text-amber-400">{getItemStat(item, xVar).toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{yLabel}</span>
            <span className="font-medium text-amber-400">{getItemStat(item, yVar).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
