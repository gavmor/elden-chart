import type { ColorKey } from '../types';
import { useSidebarContext } from './SidebarContext';
import { TraitExplainer } from './TraitExplainer';

export function SidebarAxes() {
  const { dimensions, onDimensionsChange, statOptions, traitCounts, statGroups } = useSidebarContext();
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="color-select" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Color (Point Theme)</label>
        <div className="flex items-center gap-2">
          <select
            id="color-select"
            value={dimensions.color}
            onChange={(e) => onDimensionsChange(dimensions.withColor(e.target.value as ColorKey))}
            className="flex-1 min-w-0 bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent"
          >
            <optgroup label="Categorical Grouping" className="bg-bg-card-dark font-semibold text-text-secondary">
              <option value="category" className="bg-bg-card text-text-primary">Category (by equipment type)</option>
            </optgroup>
            {statOptions.length === 0
              ? (
                <optgroup label="Stats" className="bg-bg-card-dark font-semibold text-text-secondary">
                  <option disabled value="" className="bg-bg-card text-text-tertiary">None</option>
                </optgroup>
              )
              : Object.entries(statGroups).map(([groupName, opts]) => (
                <optgroup key={groupName} label={groupName} className="bg-bg-card-dark font-semibold text-text-secondary">
                  {opts.map(opt => {
                    const count = traitCounts[opt.id] ?? 0;
                    return (
                      <option key={`color-${opt.id}`} value={opt.id} className="bg-bg-card text-text-primary">
                        {opt.label} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              ))
            }
          </select>
          {dimensions.color && <TraitExplainer statId={dimensions.color} />}
        </div>
      </div>
    </div>
  );
}
