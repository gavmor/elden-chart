import { useMemo } from 'react';
import { Search, Info, X, Scale, TrendingUp } from 'lucide-react';
import type { ActiveCategories, ColorKey, EquipmentItem, StatOption, EquipmentKind } from '../types';
import { getCategoryIcon, getItemStat } from '../utils';

interface SidebarProps {
  search: string;
  onSearchChange: (val: string) => void;
  xVar: string;
  onXVarChange: (val: string) => void;
  yVar: string;
  onYVarChange: (val: string) => void;
  colorVar: ColorKey;
  onColorVarChange: (val: ColorKey) => void;
  statOptions: StatOption[];
  categoryGroups: { kind: EquipmentKind; categories: string[] }[];
  activeCategories: ActiveCategories;
  onCategoryToggle: (cat: string, checked: boolean) => void;
  onToggleGroup: (kind: EquipmentKind, selectAll: boolean) => void;
  onToggleAll: (selectAll: boolean) => void;
  customSet: EquipmentItem[];
  onRemoveFromSet: (item: EquipmentItem) => void;
  onCompareSet: () => void;
  showPareto: boolean;
  onShowParetoChange: (val: boolean) => void;
  filteredData: EquipmentItem[];
}

export default function EquipmentChartSidebar({
  search,
  onSearchChange,
  xVar,
  onXVarChange,
  yVar,
  onYVarChange,
  colorVar,
  onColorVarChange,
  statOptions,
  categoryGroups,
  activeCategories,
  onCategoryToggle,
  onToggleGroup,
  onToggleAll,
  customSet,
  onRemoveFromSet,
  onCompareSet,
  showPareto,
  onShowParetoChange,
  filteredData
}: SidebarProps) {
  // Aggregate stats of selected build set
  const totalWeight = customSet.reduce((sum, item) => sum + item.weight, 0);

  // Precompute trait counts for all available stats based on filtered items
  const traitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const opt of statOptions) {
      counts[opt.id] = filteredData.filter(item => getItemStat(item, opt.id) > 0).length;
    }
    return counts;
  }, [statOptions, filteredData]);

  // Group stat options for color dropdown
  const statGroups = statOptions.reduce<Record<string, StatOption[]>>((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  }, {});

  return (
    <aside className="w-sidebar bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-bg-card border border-border-main rounded-btn pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
          <select
            aria-label="Y-Axis"
            value={statOptions.length > 0 ? yVar : ''}
            onChange={(e) => onYVarChange(e.target.value)}
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
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
          <select
            aria-label="X-Axis"
            value={statOptions.length > 0 ? xVar : ''}
            onChange={(e) => onXVarChange(e.target.value)}
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
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Color (Point Theme)</label>
          <select
            value={colorVar}
            onChange={(e) => onColorVarChange(e.target.value as ColorKey)}
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

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Categories</label>
          <div className="flex gap-1">
            <button
              onClick={() => onToggleAll(true)}
              className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-sidebar text-text-secondary hover:text-brand-hover hover:bg-slate-700 border border-border-main transition-colors cursor-pointer"
            >
              All
            </button>
            <button
              onClick={() => onToggleAll(false)}
              className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-sidebar text-text-secondary hover:text-brand-danger hover:bg-slate-700 border border-border-main transition-colors cursor-pointer"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {categoryGroups.map(group => (
            <div key={group.kind}>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xxs uppercase tracking-wider font-semibold text-text-tertiary">
                  {group.kind === 'armor' ? 'Armor' : group.kind === 'weapon' ? 'Weapons' : 'Shields'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onToggleGroup(group.kind, true)}
                    className="text-tiny uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-bg-sidebar text-text-tertiary hover:text-brand-hover hover:bg-slate-700 border border-border-subtle transition-colors cursor-pointer"
                  >
                    All
                  </button>
                  <button
                    onClick={() => onToggleGroup(group.kind, false)}
                    className="text-tiny uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-bg-sidebar text-text-tertiary hover:text-brand-danger hover:bg-slate-700 border border-border-subtle transition-colors cursor-pointer"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.categories.map(cat => (
                  <label
                    key={cat}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer select-none ${
                      activeCategories[cat]
                        ? 'bg-brand-accent/15 text-brand-active border-brand-accent/40 hover:bg-brand-accent/25 hover:border-brand-accent/60'
                        : 'bg-bg-sidebar/40 text-text-secondary border-border-subtle hover:bg-bg-sidebar/80 hover:text-text-primary hover:border-border-main'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={activeCategories[cat] || false}
                      onChange={(e) => onCategoryToggle(cat, e.target.checked)}
                      className="sr-only"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col gap-3">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Build Set</label>
        {customSet.length === 0 ? (
          <div className="bg-bg-card/40 rounded-card p-4 border border-dashed border-border-subtle text-center text-xs text-text-tertiary leading-relaxed">
            Click points on the scatter plot to add items to your custom set.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 bg-bg-card/40 p-3 rounded-card border border-border-subtle">
              {customSet.map(item => (
                <div
                  key={`set-${item.id}`}
                  className="relative w-item-sm h-item-sm rounded-btn bg-bg-card-dark border border-border-main hover:border-brand-danger cursor-pointer flex items-center justify-center transition-all overflow-hidden group/set-item"
                  onClick={() => onRemoveFromSet(item)}
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
                <span className="font-semibold text-text-bright">{totalWeight.toFixed(1)}</span>
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

      <div className="mt-auto bg-bg-card/50 rounded-card p-4 border border-border-subtle">
        <h3 className="text-sm font-medium text-brand-accent flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Usage Tips
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Hover over items for details.<br/><br/>
          <strong>Icons</strong> represent equipment type.<br/>
          <strong>Auras</strong> represent color theme stats.
        </p>
      </div>
    </aside>
  );
}
