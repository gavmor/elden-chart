import React from 'react';
import type { ArmorItem, StatKey, ColorKey } from './types';
import { getCategoryIcon, getItemStat, getItemColor } from './utils';

interface PlotProps {
  filteredData: ArmorItem[];
  xVar: StatKey;
  yVar: StatKey;
  xLabel: string;
  yLabel: string;
  chartProps: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  hoveredItemId: string | null;
  onHoverItem: (e: React.MouseEvent, item: ArmorItem) => void;
  onLeavePlot: () => void;
}

export default function ArmorChartPlot({
  filteredData,
  xVar,
  yVar,
  xLabel,
  yLabel,
  chartProps,
  colorVar,
  colorMinMax,
  hoveredItemId,
  onHoverItem,
  onLeavePlot
}: PlotProps) {
  if (filteredData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        No armor pieces match your filters.
      </div>
    );
  }

  return (
    <div className="flex-1 relative border-l border-b border-slate-700 ml-12 mb-12 mt-4 mr-4">
      {/* Y Axis Label */}
      <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {yLabel}
      </div>
      
      {/* X Axis Label */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {xLabel}
      </div>

      {chartProps && [0, 0.25, 0.5, 0.75, 1].map(tick => {
        const xVal = chartProps.xMin + tick * (chartProps.xMax - chartProps.xMin);
        const yVal = chartProps.yMin + tick * (chartProps.yMax - chartProps.yMin);
        return (
          <React.Fragment key={`ticks-${tick}`}>
            <div 
              className="absolute -bottom-6 text-[10px] text-slate-500 -translate-x-1/2" 
              style={{ left: `${tick * 100}%` }}
            >
              {xVal.toFixed(1)}
            </div>
            <div 
              className="absolute -left-10 text-[10px] text-slate-500 -translate-y-1/2 text-right w-8" 
              style={{ bottom: `${tick * 100}%` }}
            >
              {yVal.toFixed(1)}
            </div>
          </React.Fragment>
        );
      })}

      <svg 
        className="w-full h-full" 
        onMouseLeave={onLeavePlot}
      >
        {/* Grid Lines */}
        {[0.25, 0.5, 0.75].map(tick => (
          <g key={`grid-${tick}`}>
            <line x1="0" y1={`${tick * 100}%`} x2="100%" y2={`${tick * 100}%`} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1={`${tick * 100}%`} y1="0" x2={`${tick * 100}%`} y2="100%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          </g>
        ))}

        {/* Data Points */}
        {chartProps && filteredData.map(item => {
          const cx = `${((getItemStat(item, xVar) - chartProps.xMin) / (chartProps.xMax - chartProps.xMin)) * 100}%`;
          const cy = `${(1 - (getItemStat(item, yVar) - chartProps.yMin) / (chartProps.yMax - chartProps.yMin)) * 100}%`;
          
          const isHovered = hoveredItemId === item.id;
          const size = isHovered ? 48 : 28;
          const color = getItemColor(item, colorVar, colorMinMax);
          
          return (
            <svg
              key={item.id}
              x={cx}
              y={cy}
              style={{ overflow: 'visible' }}
              opacity={hoveredItemId ? (isHovered ? 1 : 0.3) : 0.85}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={(e) => onHoverItem(e, item)}
              onMouseMove={(e) => onHoverItem(e, item)}
            >
              <foreignObject
                x={-size / 2}
                y={-size / 2}
                width={size}
                height={size}
                style={{ overflow: 'visible' }}
              >
                <div 
                  className="w-full h-full flex items-center justify-center transition-all duration-200"
                  style={{
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    filter: isHovered 
                      ? `drop-shadow(0 0 10px ${color})` 
                      : `drop-shadow(0 0 3px ${color}) drop-shadow(0 1px 1px rgba(0,0,0,0.5))`
                  }}
                >
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    getCategoryIcon(item.category, {
                      className: "w-4/5 h-4/5",
                      color: color,
                      fill: color
                    })
                  )}
                </div>
              </foreignObject>
            </svg>
          );
        })}
      </svg>
    </div>
  );
}
