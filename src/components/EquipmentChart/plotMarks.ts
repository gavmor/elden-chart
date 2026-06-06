import * as Plot from '@observablehq/plot';
import type { EquipmentItem, ColorKey, SimulationContext } from '../types';
import { getItemColor } from '../display/styling';
import { getItemImageUrl } from '../display/logic';
import { getItemStat } from '../domain/math';
import { FOCAL_COLOR } from './plotStyles';

// Helper to apply data-id to rendered SVG elements
function withDataId(dataArray: EquipmentItem[], baseRender?: Plot.RenderFunction): Plot.RenderFunction {
  return (index: number[], scales: Plot.ScaleFunctions, values: Plot.ChannelValues, dimensions: Plot.Dimensions, context: Plot.Context, next?: Plot.RenderFunction) => {
    const renderFn = baseRender || next;
    const group = renderFn ? renderFn(index, scales, values, dimensions, context, next) : null;
    
    if (group) {
      const allNodes = Array.from(group.childNodes) as SVGElement[];
      const elements = allNodes.filter(n => n.nodeName === 'image' || n.nodeName === 'circle');
      
      index.forEach((dataIndex, i) => {
        const d = dataArray[dataIndex];
        if (elements[i] && d?.id) {
          elements[i].setAttribute('data-id', d.id);
        }
      });
    }
    return group ?? null;
  };
}

export interface BuildPlotMarksParams {
  filteredData: EquipmentItem[];
  paretoItems: EquipmentItem[];
  showPareto: boolean;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  simulationContext?: SimulationContext;
  getX: (d: EquipmentItem) => number;
  getY: (d: EquipmentItem) => number;
}

export function buildPlotMarks({
  filteredData,
  paretoItems,
  showPareto,
  colorVar,
  colorMinMax,
  simulationContext,
  getX,
  getY
}: BuildPlotMarksParams): Plot.Markish[] {
  const marks: Plot.Markish[] = [];

  // Layer 1: Pareto Path Glow
  if (showPareto && paretoItems.length > 1) {
    marks.push(
      Plot.line(paretoItems, {
        x: getX,
        y: getY,
        stroke: FOCAL_COLOR,
        strokeWidth: 6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        opacity: 0.15,
        render: (index: number[], scales: Plot.ScaleFunctions, values: Plot.ChannelValues, dimensions: Plot.Dimensions, context: Plot.Context, next?: Plot.RenderFunction) => {
          const path = next?.(index, scales, values, dimensions, context);
          if (path) {
            path.setAttribute('style', 'filter: blur(4px);');
          }
          return path ?? null;
        }
      })
    );

    // Layer 2: Pareto Path Core
    marks.push(
      Plot.line(paretoItems, {
        x: getX,
        y: getY,
        stroke: FOCAL_COLOR,
        strokeWidth: 2,
        strokeDasharray: '6 4',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    );
  }

  // Layer 3: Pareto Halos
  if (showPareto && paretoItems.length > 0) {
    marks.push(
      Plot.dot(paretoItems, {
        x: getX,
        y: getY,
        r: 16,
        fill: 'rgba(251, 191, 36, 0.08)',
        stroke: FOCAL_COLOR,
        strokeWidth: 1,
        opacity: 0.7,
        render: withDataId(paretoItems, (index: number[], scales: Plot.ScaleFunctions, values: Plot.ChannelValues, dimensions: Plot.Dimensions, context: Plot.Context, next?: Plot.RenderFunction) => {
          const group = next?.(index, scales, values, dimensions, context);
          if (group) {
            const circles = group.querySelectorAll('circle');
            circles.forEach((circle: SVGCircleElement) => {
              circle.setAttribute('class', 'animate-pulse');
            });
          }
          return group ?? null;
        })
      })
    );
  }

  // Layer 4.5: Active Item Indicators
  const activeItems = filteredData.filter(d => d.isActive);
  if (activeItems.length > 0) {
    marks.push(
      Plot.dot(activeItems, {
        x: getX,
        y: getY,
        r: 17,
        fill: 'none',
        stroke: FOCAL_COLOR,
        strokeWidth: 2,
        render: withDataId(activeItems)
      })
    );
    marks.push(
      Plot.dot(activeItems, {
        x: getX,
        y: getY,
        r: 22,
        fill: 'none',
        stroke: FOCAL_COLOR,
        strokeWidth: 6,
        opacity: 0.25,
        render: withDataId(activeItems)
      })
    );
  }

  // Layer 4.6: Active Defensive Indicators (Debuff Mitigation)
  const defensiveItems = filteredData.filter(d => getItemStat(d, 'debuff_mitigation', simulationContext) > 0);
  if (defensiveItems.length > 0) {
    marks.push(
      Plot.text(defensiveItems, {
        x: getX,
        y: getY,
        text: () => '🛡️',
        dy: -14,
        dx: 14,
        fontSize: 16,
        render: withDataId(defensiveItems)
      })
    );
    marks.push(
      Plot.dot(defensiveItems, {
        x: getX,
        y: getY,
        r: 18,
        fill: 'none',
        stroke: '#34d399', // emerald-400
        strokeWidth: 2,
        strokeDasharray: '3 3',
        render: withDataId(defensiveItems)
      })
    );
  }

  // Layer 4.75: Category Hulls
  if (colorVar === 'category') {
    marks.push(
      Plot.hull(filteredData, {
        x: getX,
        y: getY,
        fill: 'category',
        fillOpacity: 0.08,
        stroke: 'category',
        strokeWidth: 1.5,
        strokeOpacity: 0.4
      })
    );
  }

  // Layer 5: Main Data Points
  const markerOpacity = filteredData.length > 80 ? 0.6 : (filteredData.length > 30 ? 0.8 : 1.0);
  
  marks.push(
    Plot.image(filteredData, {
      x: getX,
      y: getY,
      src: d => getItemImageUrl(d, getItemColor(d, colorVar, colorMinMax, simulationContext)),
      width: 28,
      height: 28,
      title: d => d.name,
      opacity: markerOpacity,
      render: withDataId(filteredData)
    })
  );

  return marks;
}
