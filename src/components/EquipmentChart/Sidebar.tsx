import { useMemo } from 'react';
import { Info } from 'lucide-react';
import type { EquipmentItem, StatOption, EquipmentKind } from '../types';
import { getItemStat } from '../utils';
import type { ChartDimensions } from '../domain/ChartDimensions';
import type { CategoryFilter } from '../domain/CategoryFilter';
import type { BuildSet } from '../domain/BuildSet';
import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';
import { SidebarAnalysis } from './SidebarAnalysis';
import { SidebarBuild } from './SidebarBuild';

interface SidebarProps {
  search: string;
  onSearchChange: (val: string) => void;
  dimensions: ChartDimensions;
  onDimensionsChange: (dimensions: ChartDimensions) => void;
  statOptions: StatOption[];
  categoryGroups: { kind: EquipmentKind; categories: string[] }[];
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
  buildSet: BuildSet;
  onBuildSetChange: (set: BuildSet) => void;
  onCompareSet: () => void;
  showPareto: boolean;
  onShowParetoChange: (val: boolean) => void;
  filteredData: EquipmentItem[];
  activeGame: 'elden-ring' | 'deadlock';
  selectedHero: string | null;
  onHeroChange: (hero: string | null) => void;
  targetConfig: import('../types').TargetConfiguration;
  onTargetSpiritResistanceChange: (val: number) => void;
  onTargetBulletResistanceChange: (val: number) => void;
}

export default function EquipmentChartSidebar({
  search,
  onSearchChange,
  dimensions,
  onDimensionsChange,
  statOptions,
  categoryGroups,
  categoryFilter,
  onCategoryFilterChange,
  buildSet,
  onBuildSetChange,
  onCompareSet,
  showPareto,
  onShowParetoChange,
  filteredData,
  activeGame,
  selectedHero,
  onHeroChange,
  targetConfig,
  onTargetSpiritResistanceChange,
  onTargetBulletResistanceChange
}: SidebarProps) {
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
      <SidebarSearch search={search} onSearchChange={onSearchChange} />
      
      <SidebarAxes 
        dimensions={dimensions} 
        onDimensionsChange={onDimensionsChange} 
        statOptions={statOptions} 
        traitCounts={traitCounts} 
        statGroups={statGroups} 
      />

      <SidebarCategories 
        categoryGroups={categoryGroups} 
        categoryFilter={categoryFilter} 
        onCategoryFilterChange={onCategoryFilterChange} 
      />

      <SidebarAnalysis 
        showPareto={showPareto} 
        onShowParetoChange={onShowParetoChange} 
      />

      <SidebarBuild 
        buildSet={buildSet} 
        onBuildSetChange={onBuildSetChange} 
        onCompareSet={onCompareSet} 
      />

      {activeGame === 'deadlock' && (
        <div className="space-y-4 pt-4 border-t border-border-main">
          <label className="block text-xs font-semibold text-brand-accent uppercase tracking-wider">Deadlock DPS Configuration</label>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Hero Selection</label>
            <select
              value={selectedHero || ''}
              onChange={(e) => onHeroChange(e.target.value || null)}
              className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent"
            >
              <option value="">None / Base Stats</option>
              <option value="Paradox">Paradox</option>
              <option value="Lash">Lash</option>
              <option value="Seven">Seven</option>
              <option value="Haze">Haze</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Spirit Res: {(targetConfig.targetSpiritResistance * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="-0.5"
              max="1"
              step="0.01"
              value={targetConfig.targetSpiritResistance}
              onChange={(e) => onTargetSpiritResistanceChange(parseFloat(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Bullet Res: {(targetConfig.targetBulletResistance * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="-0.5"
              max="1"
              step="0.01"
              value={targetConfig.targetBulletResistance}
              onChange={(e) => onTargetBulletResistanceChange(parseFloat(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>
        </div>
      )}

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
