import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import type { EquipmentItem, SimulationContext } from '../types';
import type { BuildSet } from '../domain/BuildSet';
import { generateEhpCurve } from '../domain/EhpCurve';
import { calculateEffectiveResistance } from '../deadlock-dps';
import { getItemStat } from '../domain/math';

interface SidebarEhpCurveProps {
  buildSet: BuildSet;
  hoveredItem: EquipmentItem | null;
  simulationContext?: SimulationContext;
}

export function SidebarEhpCurve({ buildSet, hoveredItem, simulationContext }: SidebarEhpCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate current stats
    const currentBonusHealth = buildSet.items.reduce((acc, it) => acc + (getItemStat(it, 'BonusHealth') || 0), 0);
    const baseHealth = 1000 + currentBonusHealth;
    
    // Get current bullet resists
    const currentResists: number[] = [];
    for (const it of buildSet.items) {
      const br = getItemStat(it, 'BulletResist') || 0;
      if (br > 0) currentResists.push(br / 100);
    }
    const currentFinalResist = calculateEffectiveResistance(currentResists, []);
    
    // Get projected stats if hovering
    let projectedFinalResist = currentFinalResist;
    let projectedBaseHealth = baseHealth;
    if (hoveredItem && !buildSet.items.some(i => i.id === hoveredItem.id)) {
      projectedBaseHealth += (getItemStat(hoveredItem, 'BonusHealth') || 0);
      const br = getItemStat(hoveredItem, 'BulletResist') || 0;
      if (br > 0) currentResists.push(br / 100);
      projectedFinalResist = calculateEffectiveResistance(currentResists, []);
    }

    const activeBaseHealth = hoveredItem ? projectedBaseHealth : baseHealth;
    const curveData = generateEhpCurve(activeBaseHealth, 0.9, 20, simulationContext?.incomingDamage);

    // Current and projected points
    const pointsData = [];
    pointsData.push({
      resistance: currentFinalResist,
      ehp: generateEhpCurve(baseHealth, currentFinalResist, 1, simulationContext?.incomingDamage).pop()?.ehp || baseHealth,
      type: 'Current'
    });

    if (hoveredItem && !buildSet.items.some(i => i.id === hoveredItem.id)) {
      pointsData.push({
        resistance: projectedFinalResist,
        ehp: generateEhpCurve(projectedBaseHealth, projectedFinalResist, 1, simulationContext?.incomingDamage).pop()?.ehp || projectedBaseHealth,
        type: 'Projected'
      });
    }

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
        label: "Bullet Resist",
        tickFormat: d => `${Math.round(d * 100)}%`,
        domain: [0, 0.9]
      },
      y: {
        label: "Effective HP",
        grid: true
      },
      marks: [
        Plot.line(curveData, {
          x: "resistance",
          y: "ehp",
          stroke: "var(--color-brand-accent)",
          strokeWidth: 2,
          opacity: 0.5
        }),
        Plot.dot(pointsData, {
          x: "resistance",
          y: "ehp",
          fill: d => d.type === 'Current' ? '#94a3b8' : '#34d399',
          r: d => d.type === 'Current' ? 4 : 6,
          stroke: "var(--color-bg-card)",
          strokeWidth: 1.5
        }),
        Plot.text(pointsData.filter(d => d.type === 'Current'), {
          x: "resistance",
          y: "ehp",
          text: "type",
          dy: 16,
          dx: 4,
          textAnchor: "start",
          fill: '#94a3b8',
          fontSize: 10,
          fontWeight: 'bold'
        }),
        Plot.text(pointsData.filter(d => d.type === 'Projected'), {
          x: "resistance",
          y: "ehp",
          text: "type",
          dy: -16,
          dx: 4,
          textAnchor: "start",
          fill: '#34d399',
          fontSize: 10,
          fontWeight: 'bold'
        })
      ]
    });

    containerRef.current.appendChild(plot);
  }, [buildSet, hoveredItem, simulationContext]);

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Marginal EHP Gain</label>
      <div className="bg-bg-card/40 rounded-card p-2 border border-border-subtle overflow-hidden" ref={containerRef}>
      </div>
    </div>
  );
}
