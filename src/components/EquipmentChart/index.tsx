import { useState, lazy, Suspense } from 'react';
import type { EquipmentItem } from '../types';
import { ChartDimensions } from '../domain/ChartDimensions';
import { CategoryFilter } from '../domain/CategoryFilter';
import { BuildSet } from '../domain/BuildSet';

import EquipmentChartHeader from './Header';
import EquipmentChartSidebar from './Sidebar';
import { useEquipmentChartState } from './useEquipmentChartState';
import { ChartWorkspace } from './ChartWorkspace';
import { SidebarProvider } from './SidebarContext';

const EquipmentCompareModal = lazy(() => import('../CompareModal/EquipmentCompareModal'));

export default function EquipmentChart() {
  const chartState = useEquipmentChartState();
  const { state, actions } = chartState;

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);

  const dimensions = new ChartDimensions(
    state.resolvedXVar, 
    state.resolvedYVar, 
    state.resolvedColorVar
  );
  
  const categoryFilter = new CategoryFilter(state.activeCategories);
  const buildSet = new BuildSet(state.syncedCustomSet);

  return (
    <div className="flex flex-col h-full bg-bg-main text-text-primary font-sans overflow-hidden">
      <EquipmentChartHeader
        loading={state.isLoading}
        itemCount={state.filteredData.length}
        activeGame={state.activeGame}
        onGameChange={(game) => actions.setParam('game', game)}
        buildSet={buildSet}
        onBuildSetChange={(set) => actions.setCustomSet(set.toArray())}
        onCompareSet={() => actions.setIsCompareOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider
          search={state.localSearch}
          onSearchChange={actions.handleSearchChange}
          dimensions={dimensions}
          onDimensionsChange={(newDim) => {
            actions.setParam('x', newDim.x);
            actions.setParam('y', newDim.y);
            actions.setParam('color', newDim.color);
          }}
          statOptions={state.statOptions}
          categoryGroups={state.categoryGroups}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(filter) => {
            const next = filter.getRawActive();
            actions.setActiveCategories(next);
            const activeCatNames = filter.activeNames;
            actions.setParam('cats', activeCatNames.length > 0 ? activeCatNames.join(',') : '');
          }}
          buildSet={buildSet}
          filteredData={state.filteredData}
          activeGame={state.activeGame}
          selectedHero={state.deadlockState.selectedHero}
          onHeroChange={state.deadlockState.setSelectedHero}
          enemyAttacker={state.deadlockState.enemyAttacker}
          onEnemyAttackerChange={state.deadlockState.setEnemyAttacker}
          hoveredItem={hoveredItem}
          simulationContext={state.vacuumContext}
          engagementDistance={state.deadlockState.engagementDistance}
          onEngagementDistanceChange={state.deadlockState.setEngagementDistance}
          traitCounts={state.traitCounts}
          statGroups={state.statGroups}
          debuffFilterRange={state.debuffFilterRange}
          onDebuffFilterRangeChange={actions.setDebuffFilterRange}
        >
          <EquipmentChartSidebar />
        </SidebarProvider>

        <ChartWorkspace
          state={state}
          actions={actions}
          dimensions={dimensions}
          onHoveredItemChange={setHoveredItem}
        />
      </div>

      <Suspense fallback={null}>
        {state.isCompareOpen && (
          <EquipmentCompareModal
            isOpen={state.isCompareOpen}
            onClose={() => actions.setIsCompareOpen(false)}
            customSet={state.syncedCustomSet}
            simulationContext={state.simulationContext}
          />
        )}
      </Suspense>
    </div>
  );
}
