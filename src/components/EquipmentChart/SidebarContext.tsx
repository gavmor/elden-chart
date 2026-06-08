import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { EquipmentItem, StatOption, EquipmentKind, SimulationContext } from '../types';
import type { ChartDimensions } from '../domain/ChartDimensions';
import type { CategoryFilter } from '../domain/CategoryFilter';
import type { BuildSet } from '../domain/BuildSet';

export interface SidebarContextValue {
  search: string;
  onSearchChange: (val: string) => void;
  dimensions: ChartDimensions;
  onDimensionsChange: (dimensions: ChartDimensions) => void;
  statOptions: StatOption[];
  categoryGroups: { kind: EquipmentKind; categories: string[] }[];
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
  buildSet: BuildSet;
  filteredData: EquipmentItem[];
  activeGame: 'elden-ring' | 'deadlock';
  selectedHero: string | null;
  onHeroChange: (hero: string | null) => void;
  enemyAttacker: string | null;
  onEnemyAttackerChange: (hero: string | null) => void;
  hoveredItem: EquipmentItem | null;
  simulationContext?: SimulationContext;
  engagementDistance: number;
  onEngagementDistanceChange: (val: number) => void;
  traitCounts: Record<string, number>;
  statGroups: Record<string, StatOption[]>;
  debuffFilterRange: [number, number];
  onDebuffFilterRangeChange: (val: [number, number]) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ 
  children, 
  ...value 
}: SidebarContextValue & { children: ReactNode }) {
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}
