import { ShieldAlert, Scale, X } from 'lucide-react';
import GameToggle, { type GameType } from './GameToggle';
import { getCategoryIcon } from '../display/logic';
import type { BuildSet } from '../domain/BuildSet';

interface HeaderProps {
  loading: boolean;
  itemCount: number;
  activeGame: GameType;
  onGameChange: (game: GameType) => void;
  buildSet: BuildSet;
  onBuildSetChange: (set: BuildSet) => void;
  onCompareSet: () => void;
}

export default function EquipmentChartHeader({
  loading,
  itemCount,
  activeGame,
  onGameChange,
  buildSet,
  onBuildSetChange,
  onCompareSet,
}: HeaderProps) {
  return (
    <header className="bg-bg-header border-b border-border-main p-4 flex items-center justify-between z-10 shadow-md">
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-brand-accent w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold text-text-bright tracking-wide">
            {activeGame === 'elden-ring' ? 'Elden Ring Equipment Chart' : 'Deadlock Items Chart'}
          </h1>
          <p className="text-xs text-text-secondary">Interactive equipment visualizer</p>
        </div>
      </div>

      {/* Horizontal Active Build Set Area */}
      <div className="flex-1 flex items-center justify-center px-8">
        {buildSet.size === 0 ? (
          <div className="text-xs text-text-tertiary italic">
            Click points on the scatter plot to add items to your custom set.
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-bg-card/45 border border-border-main p-1.5 pl-3 pr-2 rounded-full shadow-inner">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
              Build Set{activeGame === 'elden-ring' && buildSet.totalWeight > 0 ? ` (${buildSet.totalWeight.toFixed(1)} kg)` : ''}:
            </span>
            <div className="flex items-center gap-1.5">
              {buildSet.items.map(item => (
                <div
                  key={`header-set-${item.id}`}
                  className="relative w-7 h-7 rounded-full bg-bg-card-dark border border-border-main hover:border-brand-danger cursor-pointer flex items-center justify-center transition-all overflow-hidden group/header-item"
                  onClick={() => onBuildSetChange(buildSet.withRemoved(item))}
                  title={`${item.name} (Click to remove)`}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-[85%] h-[85%] object-contain" />
                  ) : (
                    getCategoryIcon(item.category, item.kind, { className: "w-4 h-4 text-text-tertiary", fill: "currentColor" })
                  )}
                  <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center opacity-0 group-hover/header-item:opacity-100 transition-opacity duration-150">
                    <X className="w-3 h-3 text-brand-danger" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-5 w-[1px] bg-border-main" />
            <button
              onClick={onCompareSet}
              className="py-1 px-3 rounded-full bg-brand-accent/25 hover:bg-brand-accent/35 text-brand-hover hover:text-brand-active font-semibold text-xs border border-brand-accent/30 hover:border-brand-accent/50 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Scale className="w-3.5 h-3.5" /> Compare
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <GameToggle activeGame={activeGame} onGameChange={onGameChange} />
        <div className="text-sm text-text-secondary">
          {loading ? 'Fetching library...' : `${itemCount} items plotted`}
        </div>
      </div>
    </header>
  );
}
