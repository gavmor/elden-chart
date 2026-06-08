import { useEffect, useRef, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import type { EquipmentItem, ColorKey } from '../types';
import { getParetoFrontier, getStatRangeClamped, getClampedItemStat } from '../domain/math';

// Refactored hooks and helpers
import { useContainerSize } from './useContainerSize';
import { usePlotStableRefs } from './usePlotStableRefs';
import { buildPlotMarks } from './plotMarks';
import { setupPlotInteractions, syncCustomSetStyles } from './plotInteractions';

interface PlotProps {
  filteredData: EquipmentItem[];
  xVar: string;
  yVar: string;
  xLabel: string;
  yLabel: string;
  chartProps: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  onHoverItem: (e: MouseEvent, item: EquipmentItem) => void;
  onLeavePlot: () => void;
  customSet: EquipmentItem[];
  onClickItem: (item: EquipmentItem) => void;
  showPareto: boolean;
  simulationContext?: import('../types').SimulationContext;
}

export default function EquipmentChartPlot({
  filteredData,
  xVar,
  yVar,
  xLabel,
  yLabel,
  chartProps,
  colorVar,
  colorMinMax,
  onHoverItem,
  onLeavePlot,
  customSet,
  onClickItem,
  showPareto,
  simulationContext
}: PlotProps) {
  const auraSize: number = 3;
  const auraStyle: 'glow' | 'outline' = 'glow';
  const containerRef = useRef<HTMLDivElement>(null);
  
  const hasData = filteredData.length > 0;
  const size = useContainerSize(containerRef, hasData);
  
  const refs = usePlotStableRefs({
    onHoverItem,
    onLeavePlot,
    onClickItem,
    customSet
  });

  const paretoItems = useMemo(() => {
    if (!showPareto) return [];
    return getParetoFrontier(filteredData, xVar, yVar, simulationContext);
  }, [filteredData, xVar, yVar, showPareto, simulationContext]);

  const paretoIds = useMemo(() => {
    return new Set(paretoItems.map(item => item.id));
  }, [paretoItems]);

  useEffect(() => {
    if (!containerRef.current || filteredData.length === 0) return;

    containerRef.current.innerHTML = '';

    const xRange = getStatRangeClamped(filteredData, xVar, simulationContext);
    const yRange = getStatRangeClamped(filteredData, yVar, simulationContext);
    const getX = (d: EquipmentItem) => getClampedItemStat(d, xVar, xRange.max, simulationContext);
    const getY = (d: EquipmentItem) => getClampedItemStat(d, yVar, yRange.max, simulationContext);

    const marks = buildPlotMarks({
      filteredData,
      paretoItems,
      showPareto,
      colorVar,
      colorMinMax,
      simulationContext,
      getX,
      getY
    });

    const xDomain = chartProps ? [chartProps.xMin, chartProps.xMax] : undefined;
    const yDomain = chartProps ? [chartProps.yMin, chartProps.yMax] : undefined;

    const plot = Plot.plot({
      width: size.width,
      height: size.height,
      style: {
        background: 'transparent',
        color: 'var(--color-text-tertiary)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      },
      marginLeft: 45,
      marginBottom: 45,
      marginRight: 15,
      marginTop: 15,
      x: {
        domain: xDomain,
        grid: true,
        label: null,
        inset: 16
      },
      y: {
        domain: yDomain,
        grid: true,
        label: null,
        inset: 16
      },
      marks: marks
    });

    containerRef.current.appendChild(plot);

    const gridLines = plot.querySelectorAll('line[stroke]');
    gridLines.forEach(line => {
      const stroke = line.getAttribute('stroke');
      if (stroke && stroke !== '#fbbf24') {
        line.setAttribute('stroke', 'var(--color-border-main)');
        line.setAttribute('stroke-dasharray', '4 4');
      }
    });

    setupPlotInteractions({
      plot,
      container: containerRef.current,
      filteredData,
      customSetRef: refs.customSetRef,
      paretoIds,
      colorVar,
      colorMinMax,
      simulationContext,
      auraSize,
      auraStyle,
      onHoverItemRef: refs.onHoverItemRef,
      onLeavePlotRef: refs.onLeavePlotRef,
      onClickItemRef: refs.onClickItemRef
    });

    return () => {
      plot.remove();
    };
  }, [
    filteredData, xVar, yVar, colorVar, colorMinMax, size, showPareto, 
    xLabel, yLabel, chartProps, auraSize, auraStyle, simulationContext,     paretoIds, paretoItems,
    // Add refs to dependency array to satisfy exhaustive-deps, though they are stable
    refs.customSetRef, refs.onClickItemRef, refs.onHoverItemRef, refs.onLeavePlotRef
  ]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    syncCustomSetStyles({
      container: containerRef.current,
      filteredData,
      customSet,
      paretoIds,
      colorVar,
      colorMinMax,
      simulationContext,
      auraSize,
      auraStyle
    });
  }, [customSet, paretoIds, colorVar, colorMinMax, simulationContext, auraSize, auraStyle, filteredData]);

  if (filteredData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-tertiary">
        No equipment matches your filters.
      </div>
    );
  }

  return (
    <div
      className="flex-1 min-w-0 min-h-0 relative border-l border-b border-border-main ml-12 mb-12 mt-4 mr-4 bg-bg-main/10 rounded-br-sm"
      ref={containerRef}
      role="img"
      aria-label={`Scatter plot showing Elden Ring equipment stats relationship between ${xLabel} and ${yLabel}. Active equipment points are plotted.`}
    />
  );
}
