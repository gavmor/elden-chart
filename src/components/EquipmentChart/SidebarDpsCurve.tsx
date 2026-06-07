import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import type { EquipmentItem, SimulationContext } from '../types';
import { computeItemStat } from '../domain/math';

interface SidebarDpsCurveProps {
  hoveredItem: EquipmentItem | null;
  simulationContext?: SimulationContext;
  engagementDistance: number;
}

export function SidebarDpsCurve({ hoveredItem, simulationContext, engagementDistance }: SidebarDpsCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!hoveredItem) {
      containerRef.current.innerHTML = '<div class="text-xs text-text-secondary italic text-center py-8">Hover an item to view damage falloff curve</div>';
      return;
    }

    const curveData = [];
    for (let d = 0; d <= 50; d += 2) {
      const mockContext = { ...simulationContext, engagementDistance: d } as SimulationContext;
      curveData.push({
        distance: d,
        dps: computeItemStat(hoveredItem, 'Combined Hybrid DPS', mockContext)
      });
    }

    const currentDps = computeItemStat(hoveredItem, 'Combined Hybrid DPS', { ...simulationContext, engagementDistance } as SimulationContext);

    const pointsData = [
      { distance: engagementDistance, dps: currentDps, type: 'Current' }
    ];

    containerRef.current.innerHTML = '';
    
    const plot = Plot.plot({
      width: 278,
      height: 180,
      style: {
        background: 'transparent',
        color: 'var(--color-text-secondary)',
        fontFamily: 'inherit',
        fontSize: '10px'
      },
      marginLeft: 45,
      marginBottom: 35,
      x: {
        label: "Distance (m)",
        domain: [0, 50]
      },
      y: {
        label: "Marginal DPS",
        grid: true,
        domain: [Math.min(0, ...curveData.map(d => d.dps)), Math.max(10, ...curveData.map(d => d.dps))]
      },
      marks: [
        Plot.line(curveData, {
          x: "distance",
          y: "dps",
          stroke: "var(--color-brand-danger)",
          strokeWidth: 2,
          opacity: 0.8
        }),
        Plot.dot(pointsData, {
          x: "distance",
          y: "dps",
          fill: "var(--color-brand-danger)",
          r: 5,
          stroke: "var(--color-bg-card)",
          strokeWidth: 1.5
        }),
        Plot.text(pointsData, {
          x: "distance",
          y: "dps",
          text: "type",
          textAnchor: "start",
          dx: 8,
          fill: '#cbd5e1',
          fontSize: 10,
          fontWeight: 'bold'
        })
      ]
    });

    containerRef.current.appendChild(plot);
  }, [hoveredItem, simulationContext, engagementDistance]);

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">DPS vs Distance</label>
      <div className="bg-bg-card/40 rounded-card p-2 border border-border-subtle overflow-hidden" ref={containerRef}>
      </div>
    </div>
  );
}
