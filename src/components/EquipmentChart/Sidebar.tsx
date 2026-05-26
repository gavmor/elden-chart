import { Search, Info, X, Scale, TrendingUp } from 'lucide-react';
import type { ActiveCategories, ColorKey, EquipmentItem, StatOption, EquipmentKind } from '../types';
import { getCategoryIcon } from '../utils';

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
  onShowParetoChange
}: SidebarProps) {
  // Aggregate stats of selected build set
  const totalWeight = customSet.reduce((sum, item) => sum + item.weight, 0);

  // Group stat options for color dropdown
  const statGroups = statOptions.reduce<Record<string, StatOption[]>>((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  }, {});

  return (
    <aside className="w-80 bg-slate-800/50 border-r border-slate-700 p-5 flex flex-col gap-6 overflow-y-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
          <select
            aria-label="Y-Axis"
            value={yVar}
            onChange={(e) => onYVarChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            {statOptions.map(opt => (
              <option key={`y-${opt.id}`} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
          <select
            aria-label="X-Axis"
            value={xVar}
            onChange={(e) => onXVarChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            {statOptions.map(opt => (
              <option key={`x-${opt.id}`} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Color (Point Theme)</label>
          <select
            value={colorVar}
            onChange={(e) => onColorVarChange(e.target.value as ColorKey)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <optgroup label="Categorical Grouping" className="bg-slate-950 font-semibold text-slate-400">
              <option value="category" className="bg-slate-900 text-slate-200">Category (by equipment type)</option>
            </optgroup>
            {Object.entries(statGroups).map(([groupName, opts]) => (
              <optgroup key={groupName} label={groupName} className="bg-slate-950 font-semibold text-slate-400">
                {opts.map(opt => (
                  <option key={`color-${opt.id}`} value={opt.id} className="bg-slate-900 text-slate-200">{opt.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</label>
          <div className="flex gap-1">
            <button
              onClick={() => onToggleAll(true)}
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              All
            </button>
            <button
              onClick={() => onToggleAll(false)}
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {categoryGroups.map(group => (
            <div key={group.kind}>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  {group.kind === 'armor' ? 'Armor' : group.kind === 'weapon' ? 'Weapons' : 'Shields'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onToggleGroup(group.kind, true)}
                    className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 hover:text-amber-400 hover:bg-slate-700 border border-slate-700/50 transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={() => onToggleGroup(group.kind, false)}
                    className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-slate-700 border border-slate-700/50 transition-colors"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {group.categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={activeCategories[cat] || false}
                        onChange={(e) => onCategoryToggle(cat, e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          activeCategories[cat] ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700 group-hover:border-slate-500 group-hover:text-slate-400'
                        }`}
                      >
                        {getCategoryIcon(cat, group.kind, { className: "w-4 h-4", fill: "currentColor" })}
                      </div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistical Analysis</label>
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
                showPareto ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700 group-hover:border-slate-500 group-hover:text-slate-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Pareto Frontier</span>
            <span className={`text-[10px] leading-tight transition-all duration-300 ${showPareto ? 'text-amber-500/70 max-h-8 opacity-100 mt-0.5' : 'text-slate-600 max-h-0 opacity-0'} overflow-hidden`}>Best trade-off curve (Min X / Max Y)</span>
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Build Set</label>
        {customSet.length === 0 ? (
          <div className="bg-slate-900/40 rounded-lg p-4 border border-dashed border-slate-700/50 text-center text-xs text-slate-500 leading-relaxed">
            Click points on the scatter plot to add items to your custom set.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
              {customSet.map(item => (
                <div
                  key={`set-${item.id}`}
                  className="relative w-10 h-10 rounded bg-slate-950 border border-slate-700 hover:border-red-500 cursor-pointer flex items-center justify-center transition-all overflow-hidden group/set-item"
                  onClick={() => onRemoveFromSet(item)}
                  title={`${item.name} (Click to remove)`}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-[85%] h-[85%] object-contain" />
                  ) : (
                    getCategoryIcon(item.category, item.kind, { className: "w-5 h-5 text-slate-500", fill: "currentColor" })
                  )}
                  <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center opacity-0 group-hover/set-item:opacity-100 transition-opacity duration-150">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span className="font-semibold text-white">{totalWeight.toFixed(1)}</span>
              </div>
            </div>

            <button
              onClick={onCompareSet}
              className="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-semibold text-xs border border-amber-500/30 hover:border-amber-500/50 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/20 active:scale-[0.98]"
            >
              <Scale className="w-4 h-4" /> Compare Set Attributes
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-amber-500 flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Usage Tips
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hover over items for details.<br/><br/>
          <strong>Icons</strong> represent equipment type.<br/>
          <strong>Auras</strong> represent color theme stats.
        </p>
      </div>
    </aside>
  );
}
