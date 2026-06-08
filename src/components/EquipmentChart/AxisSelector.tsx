import type { StatOption } from '../types';
import { TraitExplainer } from './TraitExplainer';

interface AxisSelectorProps {
  ariaLabel: string;
  value: string;
  onChange: (val: string) => void;
  statOptions: StatOption[];
  traitCounts: Record<string, number>;
  statGroups: Record<string, StatOption[]>;
  className?: string;
}

export function AxisSelector({
  ariaLabel,
  value,
  onChange,
  statOptions,
  traitCounts,
  statGroups,
  className = '',
}: AxisSelectorProps) {
  return (
    <div className={`flex items-center gap-2 bg-bg-card/90 backdrop-blur-sm border border-border-main p-2 rounded-lg shadow-lg z-10 ${className}`}>
      <select
        aria-label={ariaLabel}
        value={statOptions.length > 0 ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={statOptions.length === 0}
        className="w-64 bg-transparent text-sm focus:outline-none focus:text-brand-accent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
      >
        {statOptions.length === 0 ? (
          <optgroup label="Stats" className="bg-bg-card-dark font-semibold text-text-secondary">
            <option disabled value="" className="bg-bg-card text-text-tertiary">None</option>
          </optgroup>
        ) : (
          Object.entries(statGroups).map(([groupName, opts]) => (
            <optgroup key={groupName} label={groupName} className="bg-bg-card-dark font-semibold text-text-secondary">
              {opts.map((opt) => {
                const count = traitCounts[opt.id] ?? 0;
                return (
                  <option key={opt.id} value={opt.id} className="bg-bg-card text-text-primary">
                    {opt.label} ({count})
                  </option>
                );
              })}
            </optgroup>
          ))
        )}
      </select>
      {value && statOptions.length > 0 && <TraitExplainer statId={value} />}
    </div>
  );
}
