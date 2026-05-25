import { Search, Info, X } from 'lucide-react';
import type { StatKey, ActiveCategories, ColorKey, ArmorItem } from './types';
import { STAT_OPTIONS, CATEGORIES } from './types';
import { getCategoryIcon, getItemStat } from './utils';

interface SidebarProps {
  search: string;
  onSearchChange: (val: string) => void;
  xVar: StatKey;
  onXVarChange: (val: StatKey) => void;
  yVar: StatKey;
  onYVarChange: (val: StatKey) => void;
  colorVar: ColorKey;
  onColorVarChange: (val: ColorKey) => void;
  activeCategories: ActiveCategories;
  onCategoryToggle: (cat: string, checked: boolean) => void;
  customSet: ArmorItem[];
  onRemoveFromSet: (item: ArmorItem) => void;
}

export default function ArmorChartSidebar({
  search,
  onSearchChange,
  xVar,
  onXVarChange,
  yVar,
  onYVarChange,
  colorVar,
  onColorVarChange,
  activeCategories,
  onCategoryToggle,
  customSet,
  onRemoveFromSet
}: SidebarProps) {
  // Aggregate stats of selected build set
  const totalWeight = customSet.reduce((sum, item) => sum + item.weight, 0);
  const totalNegation = customSet.reduce((sum, item) => sum + item.dmgNegation.reduce((s, n) => s + n.amount, 0), 0);
  const totalPoise = customSet.reduce((sum, item) => sum + getItemStat(item, 'Poise'), 0);

  return (
    <aside className="w-80 bg-slate-800/50 border-r border-slate-700 p-5 flex flex-col gap-6 overflow-y-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search armor..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Y-Axis (Vertical)</label>
          <select
            value={yVar}
            onChange={(e) => onYVarChange(e.target.value as StatKey)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            {STAT_OPTIONS.map(opt => (
              <option key={`y-${opt.id}`} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">X-Axis (Horizontal)</label>
          <select
            value={xVar}
            onChange={(e) => onXVarChange(e.target.value as StatKey)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            {STAT_OPTIONS.map(opt => (
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
              <option value="category" className="bg-slate-900 text-slate-200">Category (Helm/Chest/etc.)</option>
            </optgroup>
            <optgroup label="Numerical Heatmap" className="bg-slate-950 font-semibold text-slate-400">
              {STAT_OPTIONS.map(opt => (
                <option key={`color-${opt.id}`} value={opt.id} className="bg-slate-900 text-slate-200">{opt.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</label>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
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
                  {getCategoryIcon(cat, { className: "w-4 h-4", fill: "currentColor" })}
                </div>
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Build Set</label>
        {customSet.length === 0 ? (
          <div className="bg-slate-900/40 rounded-lg p-4 border border-dashed border-slate-700/50 text-center text-xs text-slate-500 leading-relaxed">
            Click points on the scatter plot to add items to your custom set.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-lg border border-slate-700/50 overflow-hidden divide-y divide-slate-800/80">
              {customSet.map(item => (
                <div 
                  key={`set-${item.id}`} 
                  className="flex items-center justify-between gap-3 p-2 bg-slate-900/30 hover:bg-slate-800/40 group/item cursor-pointer transition-colors"
                  onClick={() => onRemoveFromSet(item)}
                  title="Click to remove from set"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-950 flex-shrink-0 flex items-center justify-center border border-slate-800 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        getCategoryIcon(item.category, { className: "w-4 h-4 text-slate-500", fill: "currentColor" })
                      )}
                    </div>
                    <span className="text-xs text-slate-300 group-hover/item:text-white truncate font-medium">{item.name}</span>
                  </div>
                  <X className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-red-400 hover:scale-110 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>

            <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span className="font-semibold text-white">{totalWeight.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Negation:</span>
                <span className="font-semibold text-amber-500">{totalNegation.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Poise:</span>
                <span className="font-semibold text-amber-500">{totalPoise}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-amber-500 flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Usage Tips
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hover over items for details.<br/><br/>
          <strong>Icons</strong> represent armor type.<br/>
          <strong>Auras</strong> represent color theme stats.
        </p>
      </div>
    </aside>
  );
}
