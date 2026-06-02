import { TrendingUp } from 'lucide-react';

interface SidebarAnalysisProps {
  showPareto: boolean;
  onShowParetoChange: (val: boolean) => void;
}

export function SidebarAnalysis({ showPareto, onShowParetoChange }: SidebarAnalysisProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Statistical Analysis</label>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={showPareto}
            onChange={(e) => onShowParetoChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              showPareto ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/50' : 'bg-bg-sidebar text-text-tertiary border border-border-main group-hover:border-border-main group-hover:text-text-secondary'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-text-primary group-hover:text-text-bright transition-colors">Pareto Frontier</span>
          <span className={`text-xxs leading-tight transition-all duration-300 ${showPareto ? 'text-brand-accent/70 max-h-8 opacity-100 mt-0.5' : 'text-text-tertiary max-h-0 opacity-0'} overflow-hidden`}>Best trade-off curve (Min X / Max Y)</span>
        </div>
      </label>
    </div>
  );
}
