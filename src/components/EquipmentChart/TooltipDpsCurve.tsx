import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import type { EquipmentItem, SimulationContext } from '../types';
import { computeItemStat } from '../domain/math';

interface SidebarDpsCurveProps {
  hoveredItem: EquipmentItem | null;
  simulationContext?: SimulationContext;
  engagementDistance: number;
}

export function TooltipDpsCurve({ hoveredItem, simulationContext, engagementDistance }: SidebarDpsCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!hoveredItem) return;

    const curveData = [];
    for (let d = 0; d <= 50; d += 2) {
      const mockContext = { ...simulationContext, engagementDistance: d } as SimulationContext;
      curveData.push({
        distance: d,
        dps: computeItemStat(hoveredItem, 'Combined Hybrid DPS', mockContext)
      });
    }

    const minDps = Math.min(...curveData.map(d => d.dps));
    const maxDps = Math.max(...curveData.map(d => d.dps));

    // If there is no damage scaling (flat curve) or no DPS at all, don't render the plot
    if (Math.abs(maxDps - minDps) < 0.1) {
      containerRef.current.innerHTML = '';
      containerRef.current.style.display = 'none';
      return;
    } else {
      containerRef.current.style.display = 'block';
    }

    const currentDps = computeItemStat(hoveredItem, 'Combined Hybrid DPS', { ...simulationContext, engagementDistance } as SimulationContext);

    const pointsData = [
      { distance: engagementDistance, dps: currentDps, type: 'Current' }
    ];

    containerRef.current.innerHTML = '';
    
    const plot = Plot.plot({
      width: 290,
      height: 140,
      style: {
        background: 'transparent',
        color: 'var(--color-text-secondary)',
        fontFamily: 'inherit',
        fontSize: '10px'
      },
      marginLeft: 40,
      marginBottom: 30,
      x: {
        label: "Distance (m)",
        domain: [0, 50]
      },
      y: {
        label: "Marginal DPS",
        grid: true,
        domain: [Math.min(0, minDps), Math.max(10, maxDps)]
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
          r: 4,
          stroke: "var(--color-bg-card)",
          strokeWidth: 1.5
        }),
        Plot.text(pointsData, {
          x: "distance",
          y: "dps",
          text: "type",
          textAnchor: "start",
          dx: 6,
          fill: '#cbd5e1',
          fontSize: 10,
          fontWeight: 'bold'
        })
      ]
    });

    containerRef.current.appendChild(plot);
  }, [hoveredItem, simulationContext, engagementDistance]);

  return (
    <div className="mt-3" ref={containerRef}>
    </div>
  );
}
