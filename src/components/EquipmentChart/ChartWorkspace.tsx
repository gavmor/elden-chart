import { useState, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { EquipmentItem } from '../types';
import type { ChartDimensions } from '../domain/ChartDimensions';

import EquipmentChartPlot from './Plot';
import EquipmentChartTooltip from './Tooltip';
import { AxisSelector } from './AxisSelector';
import { EquipmentChartLegend } from './Legend';
import type { useEquipmentChartState } from './useEquipmentChartState';

export interface ChartWorkspaceProps {
  state: ReturnType<typeof useEquipmentChartState>['state'];
  actions: ReturnType<typeof useEquipmentChartState>['actions'];
  dimensions: ChartDimensions;
  onHoveredItemChange?: (item: EquipmentItem | null) => void;
}

export function ChartWorkspace({
  state,
  actions,
  dimensions,
  onHoveredItemChange
}: ChartWorkspaceProps) {
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const lastHoveredId = useRef<string | null>(null);

  const handleMouseMove = (e: MouseEvent, item: EquipmentItem) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;

    if (x + 250 > rect.width) x -= 280;
    if (y + 200 > rect.height) y -= 220;

    setTooltipPos({ x, y });
    setHoveredItem(item);

    if (lastHoveredId.current !== item.id) {
      lastHoveredId.current = item.id;
      onHoveredItemChange?.(item);
    }
  };

  const handleLeavePlot = () => {
    setHoveredItem(null);
    if (lastHoveredId.current !== null) {
      lastHoveredId.current = null;
      onHoveredItemChange?.(null);
    }
  };

  return (
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
        <>
          {/* Y-Axis Selector placed near the top-left of the chart area */}
          <div className="absolute top-[50%] left-[2.25rem] -translate-x-1/2 -translate-y-1/2 z-10 -rotate-90 origin-center flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <AxisSelector
                ariaLabel="Y-Axis"
                value={dimensions.y}
                onChange={(val) => {
                  actions.setParam('y', val);
                }}
                statOptions={state.statOptions}
                traitCounts={state.traitCounts}
                statGroups={state.statGroups}
                rotateTooltip={true}
              />
            </div>
          </div>

          {/* X-Axis Selector placed near the bottom-center of the chart area */}
          <div className="absolute bottom-[2.25rem] left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
            <AxisSelector
              ariaLabel="X-Axis"
              value={dimensions.x}
              onChange={(val) => {
                actions.setParam('x', val);
              }}
              statOptions={state.statOptions}
              traitCounts={state.traitCounts}
              statGroups={state.statGroups}
            />
          </div>

          <EquipmentChartPlot
            filteredData={state.filteredData}
            xVar={state.resolvedXVar}
            yVar={state.resolvedYVar}
            xLabel={state.xLabel}
            yLabel={state.yLabel}
            chartProps={state.chartProps}
            colorVar={state.resolvedColorVar}
            colorMinMax={state.colorMinMax}
            onHoverItem={handleMouseMove}
            onLeavePlot={handleLeavePlot}
            customSet={state.customSet}
            onClickItem={actions.handleToggleSet}
            showPareto={state.showPareto}
            simulationContext={state.simulationContext}
          />
        </>
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

      {!state.isLoading && !state.error && (
        <EquipmentChartLegend
          activeGame={state.activeGame}
          showPareto={state.showPareto}
          onShowParetoChange={actions.setShowPareto}
          colorVar={state.resolvedColorVar}
          colorMinMax={state.colorMinMax}
          statOptions={state.statOptions}
          categories={Object.keys(state.activeCategories)}
        />
      )}
    </main>
  );
}
