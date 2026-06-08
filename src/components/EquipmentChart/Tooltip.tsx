import { Weight } from 'lucide-react';
import type { EquipmentItem, ColorKey } from '../types';
import { getItemStat } from '../domain/math';
import { getItemColor } from '../display/styling';
import { getCategoryIcon, formatStatForDisplay } from '../display/logic';
import { TooltipDpsCurve } from './TooltipDpsCurve';

interface TooltipProps {
  item: EquipmentItem;
  tooltipPos: { x: number; y: number };
  xLabel: string;
  yLabel: string;
  xVar: string;
  yVar: string;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  simulationContext?: import('../types').SimulationContext;
}

const kindLabel: Record<string, string> = {
  armor: 'Armor',
  weapon: 'Weapon',
  shield: 'Shield',
  deadlock_upgrade: 'Upgrade',
  deadlock_ability: 'Ability',
};

export default function EquipmentChartTooltip({
  item,
  tooltipPos,
  xLabel,
  yLabel,
  xVar,
  yVar,
  colorVar,
  colorMinMax,
  simulationContext
}: TooltipProps) {
  const color = getItemColor(item, colorVar, colorMinMax, simulationContext);

  const isDeadlock = item.kind === 'deadlock_upgrade' || item.kind === 'deadlock_ability';

  return (
    <div
      className="absolute z-30 w-64 bg-bg-card border border-border-main shadow-2xl rounded-card overflow-hidden pointer-events-none transition-transform duration-75 ease-out"
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
          <div className="w-12 h-12 rounded-btn bg-bg-sidebar flex-shrink-0 flex items-center justify-center border border-border-main overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            ) : (
              getCategoryIcon(item.category, item.kind, { className: "w-6 h-6 text-text-tertiary", fill: "currentColor" })
            )}
          </div>
          <div>
            <h4 className="font-bold text-text-bright text-sm leading-tight mb-1">{item.name}</h4>
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-bg-sidebar text-text-primary border border-border-main flex items-center gap-1 w-fit">
                {getCategoryIcon(item.category, item.kind, { className: "w-3 h-3", fill: "currentColor" })}
                {item.category}
              </span>
              <span className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-accent/30 text-brand-hover border border-brand-accent/50 flex items-center gap-1 w-fit">
                {kindLabel[item.kind] || item.kind}
              </span>
              {item.kind === 'deadlock_ability' && (
                <span className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-950/40 text-blue-300 border border-blue-800/40 flex items-center gap-1 w-fit">
                  Hero: {item.heroName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-bg-sidebar/50 p-3 rounded-card border border-border-subtle">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Weight className="w-3.5 h-3.5" /> {isDeadlock ? 'Cost' : 'Weight'}
            </span>
            <span className="font-medium text-text-bright">{item.weight.toFixed(isDeadlock ? 0 : 1)}{isDeadlock ? ' Souls' : ' kg'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">{xLabel}</span>
            <span className="font-medium text-brand-hover">{formatStatForDisplay(xVar, getItemStat(item, xVar, simulationContext))}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">{yLabel}</span>
            <span className="font-medium text-brand-hover">{formatStatForDisplay(yVar, getItemStat(item, yVar, simulationContext))}</span>
          </div>
        </div>

        {simulationContext && simulationContext.engagementDistance !== undefined && (
          <TooltipDpsCurve 
            hoveredItem={item}
            simulationContext={simulationContext}
            engagementDistance={simulationContext.engagementDistance}
          />
        )}
      </div>
    </div>
  );
}
