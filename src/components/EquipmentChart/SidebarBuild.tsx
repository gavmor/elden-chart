import { Scale, X } from 'lucide-react';
import { getCategoryIcon } from '../display/logic';
import type { BuildSet } from '../domain/BuildSet';

interface SidebarBuildProps {
  buildSet: BuildSet;
  onBuildSetChange: (set: BuildSet) => void;
  onCompareSet: () => void;
}

export function SidebarBuild({ buildSet, onBuildSetChange, onCompareSet }: SidebarBuildProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Build Set</label>
      {buildSet.size === 0 ? (
        <div className="bg-bg-card/40 rounded-card p-4 border border-dashed border-border-subtle text-center text-xs text-text-tertiary leading-relaxed">
          Click points on the scatter plot to add items to your custom set.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 bg-bg-card/40 p-3 rounded-card border border-border-subtle">
            {buildSet.items.map(item => (
              <div
                key={`set-${item.id}`}
                className="relative w-10 h-10 rounded-btn bg-bg-card-dark border border-border-main hover:border-brand-danger cursor-pointer flex items-center justify-center transition-all overflow-hidden group/set-item"
                onClick={() => onBuildSetChange(buildSet.withRemoved(item))}
                title={`${item.name} (Click to remove)`}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-[85%] h-[85%] object-contain" />
                ) : (
                  getCategoryIcon(item.category, item.kind, { className: "w-5 h-5 text-text-tertiary", fill: "currentColor" })
                )}
                <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center opacity-0 group-hover/set-item:opacity-100 transition-opacity duration-150">
                  <X className="w-4 h-4 text-brand-danger" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-bg-card/30 rounded-card p-3 border border-border-subtle space-y-1.5 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Total Weight:</span>
              <span className="font-semibold text-text-bright">{buildSet.totalWeight.toFixed(1)}</span>
            </div>
          </div>

          <button
            onClick={onCompareSet}
            className="w-full py-2 rounded-btn bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-hover hover:text-brand-active font-semibold text-xs border border-brand-accent/30 hover:border-brand-accent/50 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/20 active:scale-[0.98] cursor-pointer"
          >
            <Scale className="w-4 h-4" /> Compare Set Attributes
          </button>
        </div>
      )}
    </div>
  );
}
