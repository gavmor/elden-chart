import React, { useState } from 'react';
import { TrendingUp, HelpCircle, Minus } from 'lucide-react';

interface Props {
  activeGame: 'elden-ring' | 'deadlock';
  showPareto: boolean;
  onShowParetoChange: (val: boolean) => void;
}

export const EquipmentChartLegend: React.FC<Props> = ({
  activeGame,
  showPareto,
  onShowParetoChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="absolute top-6 right-6 bg-panel/85 backdrop-blur-md border border-accent/20 rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-panel hover:border-brand-accent/50 text-text-secondary hover:text-brand-accent transition-all duration-200 z-10 cursor-pointer active:scale-95"
        title="Show Legend & Analysis"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 bg-panel/85 backdrop-blur-md border border-accent/20 rounded-lg p-3 text-xs shadow-lg z-10 flex flex-col gap-3 min-w-[200px] transition-all duration-200">
      <div className="flex items-center justify-between border-b border-border-main/40 pb-2">
        <span className="font-semibold text-brand-accent uppercase tracking-wider text-[10px]">Chart Legend</span>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-text-tertiary hover:text-text-bright p-0.5 rounded hover:bg-bg-sidebar/50 transition-colors cursor-pointer"
          title="Minimize Legend"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <div className="space-y-2">
          {activeGame === 'deadlock' && (
            <div className="flex items-center gap-2">
              <span className="w-5 text-center text-sm">⚡</span>
              <span className="text-body text-text-secondary">Active Item / Ability</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-5 text-center text-sm relative flex items-center justify-center">
              <span>🛡️</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400 border-dashed opacity-50 scale-150"></span>
            </span>
            <span className="text-body text-text-secondary pl-1">Provides Debuff Mitigation</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border-main/50 pt-2.5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={showPareto}
              onChange={(e) => onShowParetoChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                showPareto ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/50' : 'bg-bg-sidebar text-text-tertiary border border-border-main group-hover:border-border-main group-hover:text-text-secondary'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-primary group-hover:text-text-bright transition-colors font-semibold">Pareto Frontier</span>
          </div>
        </label>
      </div>
    </div>
  );
};
