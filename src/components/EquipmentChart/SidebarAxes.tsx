import type { ColorKey, StatOption } from '../types';
import type { ChartDimensions } from '../domain/ChartDimensions';

interface SidebarAxesProps {
  dimensions: ChartDimensions;
  onDimensionsChange: (dimensions: ChartDimensions) => void;
  statOptions: StatOption[];
  traitCounts: Record<string, number>;
  statGroups: Record<string, StatOption[]>;
}

export function SidebarAxes({
  dimensions,
  onDimensionsChange,
  statOptions,
  traitCounts,
  statGroups,
}: SidebarAxesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
        <select
          aria-label="Y-Axis"
          value={statOptions.length > 0 ? dimensions.y : ''}
          onChange={(e) => onDimensionsChange(dimensions.withY(e.target.value))}
          disabled={statOptions.length === 0}
          className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
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
                      <option key={`y-${opt.id}`} value={opt.id} className="bg-bg-card text-text-primary">
                        {opt.label} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              ))
          }
        </select>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="yLog"
            checked={dimensions.yLog}
            onChange={(e) => onDimensionsChange(dimensions.withYLog(e.target.checked))}
            disabled={statOptions.length === 0}
            className="rounded border-border-main text-brand-accent focus:ring-brand-accent/30 bg-bg-card cursor-pointer"
          />
          <label htmlFor="yLog" className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            Logarithmic Scale
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
        <select
          aria-label="X-Axis"
          value={statOptions.length > 0 ? dimensions.x : ''}
          onChange={(e) => onDimensionsChange(dimensions.withX(e.target.value))}
          disabled={statOptions.length === 0}
          className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
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
                      <option key={`x-${opt.id}`} value={opt.id} className="bg-bg-card text-text-primary">
                        {opt.label} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              ))
          }
        </select>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="xLog"
            checked={dimensions.xLog}
            onChange={(e) => onDimensionsChange(dimensions.withXLog(e.target.checked))}
            disabled={statOptions.length === 0}
            className="rounded border-border-main text-brand-accent focus:ring-brand-accent/30 bg-bg-card cursor-pointer"
          />
          <label htmlFor="xLog" className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            Logarithmic Scale
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Color (Point Theme)</label>
        <select
          value={dimensions.color}
          onChange={(e) => onDimensionsChange(dimensions.withColor(e.target.value as ColorKey))}
          className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent"
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
      </div>
    </div>
  );
}
