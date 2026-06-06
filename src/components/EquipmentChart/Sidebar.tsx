import { useMemo } from 'react';
import { Info } from 'lucide-react';
import type { EquipmentItem, StatOption, EquipmentKind } from '../types';
import { getItemStat } from '../domain/math';
import type { ChartDimensions } from '../domain/ChartDimensions';
import type { CategoryFilter } from '../domain/CategoryFilter';
import type { BuildSet } from '../domain/BuildSet';
import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';
import { SidebarAnalysis } from './SidebarAnalysis';
import { SidebarBuild } from './SidebarBuild';
import { SidebarEhpCurve } from './SidebarEhpCurve';

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
  enemyAttacker: string | null;
  onEnemyAttackerChange: (hero: string | null) => void;
  hoveredItem: EquipmentItem | null;
  simulationContext?: import('../types').SimulationContext;
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
  enemyAttacker,
  onEnemyAttackerChange,
  hoveredItem,
  simulationContext
}: SidebarProps) {
  // Precompute trait counts for all available stats based on filtered items
  console.time("traitCounts"); const traitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const opt of statOptions) {
      counts[opt.id] = filteredData.filter(item => getItemStat(item, opt.id, simulationContext) > 0).length;
    }
    console.timeEnd("traitCounts"); return counts;
  }, [statOptions, filteredData, simulationContext]);

  // Group stat options for color dropdown
  const statGroups = statOptions.reduce<Record<string, StatOption[]>>((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  }, {});

  return (
    <aside className="w-80 bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
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
        <SidebarEhpCurve 
          buildSet={buildSet} 
          hoveredItem={hoveredItem} 
          simulationContext={simulationContext} 
        />
      )}

      {activeGame === 'deadlock' && (
        <div className="space-y-4 pt-4 border-t border-border-main">
          <label className="block text-xs font-semibold text-brand-accent uppercase tracking-wider">Deadlock Configuration</label>
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
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Enemy Attacker (Incoming EHP Damage)</label>
            <select
              value={enemyAttacker || ''}
              onChange={(e) => onEnemyAttackerChange(e.target.value || null)}
              className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent animate-in fade-in"
              id="enemy-attacker-selector"
            >
              <option value="">Default (15 Damage)</option>
              <option value="Victor">Victor (25 Damage)</option>
              <option value="Holliday">Holliday (18 Damage)</option>
              <option value="Paradox">Paradox (12 Damage)</option>
              <option value="Lash">Lash (11 Damage)</option>
              <option value="Seven">Seven (10 Damage)</option>
              <option value="Infernus">Infernus (10 Damage)</option>
              <option value="Haze">Haze (6 Damage)</option>
            </select>
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
