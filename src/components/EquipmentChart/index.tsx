import { useState, useRef, lazy, Suspense } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { EquipmentItem } from '../types';
import { ChartDimensions } from '../domain/ChartDimensions';
import { CategoryFilter } from '../domain/CategoryFilter';
import { BuildSet } from '../domain/BuildSet';

import EquipmentChartHeader from './Header';
import EquipmentChartSidebar from './Sidebar';
import EquipmentChartPlot from './Plot';
import EquipmentChartTooltip from './Tooltip';
import { useEquipmentChartState } from './useEquipmentChartState';

const EquipmentCompareModal = lazy(() => import('../CompareModal/EquipmentCompareModal'));

export default function EquipmentChart() {
  const chartState = useEquipmentChartState();
  const { state, actions } = chartState;

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent, item: EquipmentItem) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;

    if (x + 250 > rect.width) x -= 280;
    if (y + 200 > rect.height) y -= 220;

    setTooltipPos({ x, y });
    setHoveredItem(item);
  };

  const dimensions = new ChartDimensions(
    state.resolvedXVar, 
    state.resolvedYVar, 
    state.resolvedColorVar, 
    state.validatedParams.xLog, 
    state.validatedParams.yLog
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
      />

      <div className="flex flex-1 overflow-hidden">
        <EquipmentChartSidebar
          search={state.localSearch}
          onSearchChange={actions.handleSearchChange}
          dimensions={dimensions}
          onDimensionsChange={(newDim) => {
            actions.setParam('x', newDim.x);
            actions.setParam('y', newDim.y);
            actions.setParam('color', newDim.color);
            actions.setParam('xLog', String(newDim.xLog));
            actions.setParam('yLog', String(newDim.yLog));
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
          onBuildSetChange={(set) => actions.setCustomSet(set.toArray())}
          onCompareSet={() => actions.setIsCompareOpen(true)}
          showPareto={state.showPareto}
          onShowParetoChange={actions.setShowPareto}
          filteredData={state.filteredData}
          activeGame={state.activeGame}
          selectedHero={state.deadlockState.selectedHero}
          onHeroChange={state.deadlockState.setSelectedHero}
          enemyAttacker={state.deadlockState.enemyAttacker}
          onEnemyAttackerChange={state.deadlockState.setEnemyAttacker}
          simulationContext={state.vacuumContext}
        />

        <main className="flex-1 relative p-6 bg-bg-main flex flex-col" ref={chartRef}>
          {state.isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main/80 z-20">
              <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
              <h2 className="text-xl font-medium text-text-bright mb-2">Summoning Data...</h2>
            </div>
          ) : state.error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main z-20">
              <AlertCircle className="w-12 h-12 text-brand-danger mb-4" />
              <h2 className="text-xl font-medium text-text-bright mb-2">Connection Lost</h2>
              <p className="text-text-secondary">{state.error instanceof Error ? state.error.message : 'Failed to fetch'}</p>
            </div>
          ) : (
            <EquipmentChartPlot
              filteredData={state.filteredData}
              xVar={state.resolvedXVar}
              yVar={state.resolvedYVar}
              xLabel={state.xLabel}
              yLabel={state.yLabel}
              xLog={dimensions.xLog}
              yLog={dimensions.yLog}
              chartProps={state.chartProps}
              colorVar={state.resolvedColorVar}
              colorMinMax={state.colorMinMax}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
              customSet={state.customSet}
              onClickItem={actions.handleToggleSet}
              showPareto={state.showPareto}
              simulationContext={state.simulationContext}
              vacuumContext={state.vacuumContext}
            />
          )}

          {hoveredItem && !state.isLoading && (
            <EquipmentChartTooltip
              item={hoveredItem}
              tooltipPos={tooltipPos}
              xLabel={state.xLabel}
              yLabel={state.yLabel}
              xVar={state.resolvedXVar}
              yVar={state.resolvedYVar}
              colorVar={state.resolvedColorVar}
              colorMinMax={state.colorMinMax}
              simulationContext={state.simulationContext}
            />
          )}
        </main>
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
