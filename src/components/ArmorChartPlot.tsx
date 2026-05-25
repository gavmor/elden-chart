import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import type { ArmorItem, StatKey, ColorKey } from './types';
import { getItemStat, getItemColor, getItemImageUrl, getParetoFrontier } from './utils';

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
  customSet: ArmorItem[];
  onClickItem: (item: ArmorItem) => void;
  showPareto: boolean;
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
  onHoverItem,
  onLeavePlot,
  customSet,
  onClickItem,
  showPareto
}: PlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 400 });

  // Stable refs for callbacks — prevents plot destruction on every hover/click
  const onHoverItemRef = useRef(onHoverItem);
  const onLeavePlotRef = useRef(onLeavePlot);
  const onClickItemRef = useRef(onClickItem);
  const customSetRef = useRef(customSet);
  onHoverItemRef.current = onHoverItem;
  onLeavePlotRef.current = onLeavePlot;
  onClickItemRef.current = onClickItem;
  customSetRef.current = customSet;

  // 1. Hook ResizeObserver to measure the container size in real-time
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.max(width, 100), height: Math.max(height, 100) });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Compute Pareto optimal items using useMemo
  const paretoItems = useMemo(() => {
    if (!showPareto) return [];
    return getParetoFrontier(filteredData, xVar, yVar);
  }, [filteredData, xVar, yVar, showPareto]);

  // Create a Set of Pareto IDs for O(1) checks during element styling
  const paretoIds = useMemo(() => {
    return new Set(paretoItems.map(item => item.id));
  }, [paretoItems]);

  // 3. Render the Plot inside useEffect
  useEffect(() => {
    if (!containerRef.current || filteredData.length === 0) return;

    // Clear previous children just in case
    containerRef.current.innerHTML = '';

    // Recreate the wrappers for Y/X labels which were absolute positioned
    const yLabelEl = document.createElement('div');
    yLabelEl.className = "absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap";
    yLabelEl.innerText = yLabel;
    
    const xLabelEl = document.createElement('div');
    xLabelEl.className = "absolute -bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest";
    xLabelEl.innerText = xLabel;

    containerRef.current.appendChild(yLabelEl);
    containerRef.current.appendChild(xLabelEl);

    // Build Plot marks list
    const marks: any[] = [];

    // Layer 1: Pareto Path Glow (Thick blurred line)
    if (showPareto && paretoItems.length > 1) {
      marks.push(
        Plot.line(paretoItems, {
          x: d => getItemStat(d, xVar),
          y: d => getItemStat(d, yVar),
          stroke: '#fbbf24',
          strokeWidth: 6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: 0.15,
          render: (index, scales, values, dimensions, context, next) => {
            const path = next?.(index, scales, values, dimensions, context);
            if (path) {
              path.setAttribute('style', 'filter: blur(4px);');
            }
            return path ?? null;
          }
        })
      );

      // Layer 2: Pareto Path Core (Dashed line)
      marks.push(
        Plot.line(paretoItems, {
          x: d => getItemStat(d, xVar),
          y: d => getItemStat(d, yVar),
          stroke: '#fbbf24',
          strokeWidth: 2,
          strokeDasharray: '6 4',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        })
      );
    }

    // Layer 3: Pareto Halos (Glowing backgrounds behind optimal dots)
    if (showPareto && paretoItems.length > 0) {
      marks.push(
        Plot.dot(paretoItems, {
          x: d => getItemStat(d, xVar),
          y: d => getItemStat(d, yVar),
          r: 16,
          fill: 'rgba(251, 191, 36, 0.08)',
          stroke: '#fbbf24',
          strokeWidth: 1,
          opacity: 0.7,
          render: (index, scales, values, dimensions, context, next) => {
            const group = next?.(index, scales, values, dimensions, context);
            if (group) {
              const circles = group.querySelectorAll('circle');
              circles.forEach(circle => {
                circle.setAttribute('class', 'animate-pulse');
              });
            }
            return group ?? null;
          }
        })
      );
    }

    // Layer 4: Active Set Indicators (Dashed rings behind set items)
    const setIndices = filteredData.filter(d => customSet.some(s => s.id === d.id));
    if (setIndices.length > 0) {
      marks.push(
        Plot.dot(setIndices, {
          x: d => getItemStat(d, xVar),
          y: d => getItemStat(d, yVar),
          r: 20,
          fill: 'none',
          stroke: '#fbbf24',
          strokeWidth: 1.5,
          strokeDasharray: '3 3'
        })
      );
    }

    // Layer 5: Main Data Points (Centered image tags)
    marks.push(
      Plot.image(filteredData, {
        x: d => getItemStat(d, xVar),
        y: d => getItemStat(d, yVar),
        src: d => getItemImageUrl(d, getItemColor(d, colorVar, colorMinMax)),
        width: 28,
        height: 28,
        title: d => d.name
      })
    );

    // Calculate domain bounds
    const xDomain = chartProps ? [chartProps.xMin, chartProps.xMax] : undefined;
    const yDomain = chartProps ? [chartProps.yMin, chartProps.yMax] : undefined;

    // Create plot element
    const plot = Plot.plot({
      width: size.width,
      height: size.height,
      style: {
        background: 'transparent',
        color: '#64748b', // slate-500 ticks and texts
        fontFamily: 'system-ui, -apple-system, sans-serif'
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

    // Append to container
    containerRef.current.appendChild(plot);

    // Grid lines styling overrides
    const gridLines = plot.querySelectorAll('line[stroke]');
    gridLines.forEach(line => {
      const stroke = line.getAttribute('stroke');
      // If it's a grid line (usually light gray/default), set it to our slate-700 grid style!
      if (stroke && stroke !== '#fbbf24') {
        line.setAttribute('stroke', '#334155');
        line.setAttribute('stroke-dasharray', '4 4');
      }
    });

    // 4. Attach high-performance DOM pointer listeners
    const images = plot.querySelectorAll('image');
    images.forEach((img, i) => {
      const item = filteredData[i];
      if (!item) return;

      const itemId = item.id;
      const isInSet = customSet.some(s => s.id === itemId);
      const isOptimal = paretoIds.has(itemId);

      // Store attributes on DOM node
      img.setAttribute('data-id', itemId);
      img.setAttribute('data-index', i.toString());

      const orgX = parseFloat(img.getAttribute('x') || '0');
      const orgY = parseFloat(img.getAttribute('y') || '0');
      const orgW = 28;
      const orgH = 28;
      img.setAttribute('data-org-x', orgX.toString());
      img.setAttribute('data-org-y', orgY.toString());

      // Initial opacity based on set membership
      img.style.opacity = isInSet ? '1' : '0.85';
      img.style.cursor = 'pointer';
      
      // Initial dropshadow glow if optimal or in set!
      const initialColor = getItemColor(item, colorVar, colorMinMax);
      if (isOptimal) {
        img.style.filter = 'drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 1px #d97706)';
        img.style.opacity = '1';
      } else if (isInSet) {
        img.style.filter = 'drop-shadow(0 0 4px #fbbf24)';
        img.style.opacity = '1';
      } else {
        img.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
      }

      // Transition styles for ultra smooth scaling
      img.style.transition = 'width 0.2s ease, height 0.2s ease, x 0.2s ease, y 0.2s ease, filter 0.2s ease, opacity 0.2s ease';

      // Mouse Hover Interaction Handlers
      const handleMouseEnter = (e: MouseEvent) => {
        const hoverW = 46;
        const hoverH = 46;
        const deltaW = hoverW - orgW;
        const deltaH = hoverH - orgH;

        img.setAttribute('width', hoverW.toString());
        img.setAttribute('height', hoverH.toString());
        img.setAttribute('x', (orgX - deltaW / 2).toString());
        img.setAttribute('y', (orgY - deltaH / 2).toString());

        // Bring hovered element to front by appending it as the last child of its parent SVG group!
        const parent = img.parentNode;
        if (parent) {
          parent.appendChild(img);
        }

        // Apply powerful drop shadow glow
        img.style.filter = `drop-shadow(0 0 8px ${initialColor})`;
        img.style.opacity = '1';

        // Dim other images (read customSet from ref for latest value)
        const curSet = customSetRef.current;
        images.forEach(other => {
          if (other !== img) {
            const otherId = other.getAttribute('data-id');
            const otherInSet = curSet.some(s => s.id === otherId);
            const otherOptimal = paretoIds.has(otherId || '');
            other.style.opacity = otherInSet || otherOptimal ? '0.7' : '0.15';
          }
        });

        // Trigger React tooltip via stable ref
        onHoverItemRef.current(e as any, item);
      };

      const handleMouseMove = (e: MouseEvent) => {
        onHoverItemRef.current(e as any, item);
      };

      const handleMouseLeave = () => {
        img.setAttribute('width', orgW.toString());
        img.setAttribute('height', orgH.toString());
        img.setAttribute('x', orgX.toString());
        img.setAttribute('y', orgY.toString());

        // Restore original visual states
        if (isOptimal) {
          img.style.filter = 'drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 1px #d97706)';
          img.style.opacity = '1';
        } else if (isInSet) {
          img.style.filter = 'drop-shadow(0 0 4px #fbbf24)';
          img.style.opacity = '1';
        } else {
          img.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
          img.style.opacity = '0.85';
        }

        // Restore all other image opacities (read customSet from ref)
        const curSet = customSetRef.current;
        images.forEach(other => {
          const otherId = other.getAttribute('data-id');
          const otherInSet = curSet.some(s => s.id === otherId);
          const otherOptimal = paretoIds.has(otherId || '');
          other.style.opacity = otherInSet || otherOptimal ? '1' : '0.85';
        });

        onLeavePlotRef.current();
      };

      const handleMouseClick = () => {
        onClickItemRef.current(item);
      };

      img.addEventListener('mouseenter', handleMouseEnter);
      img.addEventListener('mousemove', handleMouseMove);
      img.addEventListener('mouseleave', handleMouseLeave);
      img.addEventListener('click', handleMouseClick);
    });

    // Cleanup
    return () => {
      plot.remove();
    };
  }, [filteredData, xVar, yVar, colorVar, colorMinMax, size, customSet, showPareto, paretoItems, paretoIds, xLabel, yLabel, chartProps]);

  if (filteredData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        No armor pieces match your filters.
      </div>
    );
  }

  return (
    <div 
      className="flex-1 relative border-l border-b border-slate-700 ml-12 mb-12 mt-4 mr-4 bg-slate-900/10 rounded-br-sm" 
      ref={containerRef}
      role="img"
      aria-label={`Scatter plot showing Elden Ring armor stats relationship between ${xLabel} and ${yLabel}. Active armor points are plotted.`}
    />
  );
}
