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
  filteredData
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
