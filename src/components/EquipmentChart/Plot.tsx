import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import type { EquipmentItem, ColorKey } from '../types';
import { getItemColor, getItemImageUrl, getParetoFrontier, getStatRangeClamped, getClampedItemStat } from '../utils';

interface PlotProps {
  filteredData: EquipmentItem[];
  xVar: string;
  yVar: string;
  xLabel: string;
  yLabel: string;
  xLog: boolean;
  yLog: boolean;
  chartProps: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  hoveredItemId: string | null;
  onHoverItem: (e: MouseEvent, item: EquipmentItem) => void;
  onLeavePlot: () => void;
  customSet: EquipmentItem[];
  onClickItem: (item: EquipmentItem) => void;
  showPareto: boolean;
}

export default function EquipmentChartPlot({
  filteredData,
  xVar,
  yVar,
  xLabel,
  yLabel,
  xLog,
  yLog,
  chartProps,
  colorVar,
  colorMinMax,
  onHoverItem,
  onLeavePlot,
  customSet,
  onClickItem,
  showPareto
}: PlotProps) {
  const auraSize: number = 3;
  const auraStyle: 'glow' | 'outline' = 'glow';
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 400 });

  // Stable refs for callbacks — updated synchronously before the effect reads them
  const onHoverItemRef = useRef(onHoverItem);
  const onLeavePlotRef = useRef(onLeavePlot);
  const onClickItemRef = useRef(onClickItem);
  const customSetRef = useRef(customSet);
  // useLayoutEffect keeps updates synchronous (before paint) without triggering a re-render
  React.useLayoutEffect(() => {
    onHoverItemRef.current = onHoverItem;
    onLeavePlotRef.current = onLeavePlot;
    onClickItemRef.current = onClickItem;
    customSetRef.current = customSet;
  });

  // 1. Hook ResizeObserver to measure the container size in real-time
  const hasData = filteredData.length > 0;
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.max(width, 100), height: Math.max(height, 100) });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasData]);

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

    // Compute clamped ranges to clamp any Infinity or extreme values visually to plot bounds
    const xRange = getStatRangeClamped(filteredData, xVar);
    const yRange = getStatRangeClamped(filteredData, yVar);
    const getX = (d: EquipmentItem) => getClampedItemStat(d, xVar, xRange.max);
    const getY = (d: EquipmentItem) => getClampedItemStat(d, yVar, yRange.max);

    // Recreate the wrappers for Y/X labels which were absolute positioned
    const yLabelEl = document.createElement('div');
    yLabelEl.className = "absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-label font-semibold text-text-secondary uppercase tracking-widest whitespace-nowrap";
    yLabelEl.innerText = yLabel;

    const xLabelEl = document.createElement('div');
    xLabelEl.className = "absolute -bottom-10 left-1/2 -translate-x-1/2 text-label font-semibold text-text-secondary uppercase tracking-widest";
    xLabelEl.innerText = xLabel;

    containerRef.current.appendChild(yLabelEl);
    containerRef.current.appendChild(xLabelEl);

    // Compute pixel jitter to resolve overlapping points
    const positionCounts = new Map<string, number>();
    const itemJitter = new Map<string, {dx: number, dy: number}>();

    filteredData.forEach(d => {
      const x = getX(d);
      const y = getY(d);
      const key = `${x},${y}`;
      positionCounts.set(key, (positionCounts.get(key) || 0) + 1);
    });

    const positionCurrent = new Map<string, number>();
    filteredData.forEach(d => {
      const x = getX(d);
      const y = getY(d);
      const key = `${x},${y}`;
      const total = positionCounts.get(key) || 1;
      if (total > 1) {
        const idx = positionCurrent.get(key) || 0;
        positionCurrent.set(key, idx + 1);
        
        // Spread points in a circle around the center
        const radius = 6 + Math.min(total, 10); // scale radius slightly with cluster size
        const angle = (idx / total) * Math.PI * 2;
        itemJitter.set(d.id, { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius });
      } else {
        itemJitter.set(d.id, { dx: 0, dy: 0 });
      }
    });

    const withJitter = (dataArray: EquipmentItem[], baseRender?: Plot.RenderFunction) => {
      return (index: number[], scales: Plot.ScaleFunctions, values: Plot.ChannelValues, dimensions: Plot.Dimensions, context: Plot.Context, next?: Plot.RenderFunction) => {
        const group = baseRender ? baseRender(index, scales, values, dimensions, context, next) : (next ? next(index, scales, values, dimensions, context) : null);
        if (group) {
          const elements = Array.from(group.childNodes) as SVGElement[];
          index.forEach((dataIndex, i) => {
            const d = dataArray[dataIndex];
            const jitter = itemJitter.get(d?.id);
            if (jitter && (jitter.dx !== 0 || jitter.dy !== 0) && elements[i]) {
              const el = elements[i];
              const existing = el.getAttribute('transform') || '';
              el.setAttribute('transform', `${existing} translate(${jitter.dx}, ${jitter.dy})`.trim());
            }
          });
        }
        return group ?? null;
      };
    };

    // Build Plot marks list
    const marks: Plot.Markish[] = [];

    // Layer 1: Pareto Path Glow (Thick blurred line)
    if (showPareto && paretoItems.length > 1) {
      marks.push(
        Plot.line(paretoItems, {
          x: getX,
          y: getY,
          stroke: '#fbbf24',
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

      // Layer 2: Pareto Path Core (Dashed line)
      marks.push(
        Plot.line(paretoItems, {
          x: getX,
          y: getY,
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
          x: getX,
          y: getY,
          r: 16,
          fill: 'rgba(251, 191, 36, 0.08)',
          stroke: '#fbbf24',
          strokeWidth: 1,
          opacity: 0.7,
          render: withJitter(paretoItems, (index: number[], scales: Plot.ScaleFunctions, values: Plot.ChannelValues, dimensions: Plot.Dimensions, context: Plot.Context, next?: Plot.RenderFunction) => {
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

    // Layer 4: Active Set Indicators (Dashed rings behind set items)
    const setIndices = filteredData.filter(d => customSet.some(s => s.id === d.id));
    if (setIndices.length > 0) {
      marks.push(
        Plot.dot(setIndices, {
          x: getX,
          y: getY,
          r: 20,
          fill: 'none',
          stroke: '#fbbf24',
          strokeWidth: 1.5,
          strokeDasharray: '3 3',
          render: withJitter(setIndices)
        })
      );
    }

    // Layer 4.5: Active Item Indicators (Golden rings around active items)
    const activeItems = filteredData.filter(d => d.isActive);
    if (activeItems.length > 0) {
      marks.push(
        Plot.dot(activeItems, {
          x: getX,
          y: getY,
          r: 17,
          fill: 'none',
          stroke: '#facc15',
          strokeWidth: 2,
          render: withJitter(activeItems)
        })
      );
      marks.push(
        Plot.dot(activeItems, {
          x: getX,
          y: getY,
          r: 22,
          fill: 'none',
          stroke: '#facc15',
          strokeWidth: 6,
          opacity: 0.25,
          render: withJitter(activeItems)
        })
      );
    }

    // Layer 5: Main Data Points (Centered image tags)
    marks.push(
      Plot.image(filteredData, {
        x: getX,
        y: getY,
        src: d => getItemImageUrl(d, getItemColor(d, colorVar, colorMinMax)),
        width: 28,
        height: 28,
        title: d => d.name,
        render: withJitter(filteredData)
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
        color: 'var(--color-text-tertiary)', // slate-500 ticks and texts
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
        type: xLog ? 'symlog' : 'linear',
        domain: xDomain,
        grid: true,
        label: null,
        inset: 16
      },
      y: {
        type: yLog ? 'symlog' : 'linear',
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
        line.setAttribute('stroke', 'var(--color-border-main)');
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
      const getGlowFilter = (isOpt: boolean, inSet: boolean) => {
        if (auraSize === 0) {
          return 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
        }

        const isFocalItem = isOpt || inSet;
        const color = isFocalItem ? '#fbbf24' : initialColor;

        // Adaptive performance bypass: if dataset is large, disable complex colored drop-shadow filters on non-focal items
        if (!isFocalItem && filteredData.length > 80) {
          return 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
        }

        if ((auraStyle as string) === 'outline') {
          // Crisp outline thickness (1px for size 1-3, 2px for size 4-7, 3px for size 8+)
          const t = auraSize <= 3 ? 1 : auraSize <= 7 ? 2 : 3;

          if (isOpt) {
            const baseOutline = `drop-shadow(${t}px 0 0 ${color}) drop-shadow(-${t}px 0 0 ${color}) drop-shadow(0 ${t}px 0 ${color}) drop-shadow(0 -${t}px 0 ${color})`;
            return `drop-shadow(0 0 3px #fbbf24) ${baseOutline}`;
          }
          if (inSet) {
            const baseOutline = `drop-shadow(${t}px 0 0 ${color}) drop-shadow(-${t}px 0 0 ${color}) drop-shadow(0 ${t}px 0 ${color}) drop-shadow(0 -${t}px 0 ${color})`;
            return `drop-shadow(0 0 2px #fbbf24) ${baseOutline}`;
          }
          
          // Regular background items in a small dataset: simplify from 4 chained drop shadows to a lighter dual drop shadow
          return `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 1px ${color})`;
        }

        // Otherwise, 'glow' style
        if (isOpt) {
          return `drop-shadow(0 0 ${auraSize * 2.5}px #fbbf24) drop-shadow(0 0 ${auraSize}px #d97706) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
        }
        if (inSet) {
          return `drop-shadow(0 0 ${auraSize * 2}px #fbbf24) drop-shadow(0 0 ${auraSize * 0.7}px #d97706) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
        }

        // Regular background items in a small dataset: single-pass drop-shadow is extremely lightweight
        return `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
      };

      img.style.filter = getGlowFilter(isOptimal, isInSet);
      if (isOptimal || isInSet) {
        img.style.opacity = '1';
      }

      // Transition styles for ultra smooth scaling - only transition dimensions to prevent massive layout/compositing performance storm on filter and opacity transitions
      img.style.transition = 'width 0.15s ease-out, height 0.15s ease-out, x 0.15s ease-out, y 0.15s ease-out';

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
        img.style.filter = `drop-shadow(0 0 12px ${initialColor}) drop-shadow(0 0 4px ${initialColor})`;
        img.style.opacity = '1';

        // Dim other images (read customSet from ref for latest value)
        const curSet = customSetRef.current;
        const curSetIds = new Set(curSet.map(s => s.id));
        images.forEach(other => {
          if (other !== img) {
            const otherId = other.getAttribute('data-id') || '';
            const otherInSet = curSetIds.has(otherId);
            const otherOptimal = paretoIds.has(otherId);
            other.style.opacity = otherInSet || otherOptimal ? '0.7' : '0.15';
          }
        });

        // Trigger React tooltip via stable ref
        onHoverItemRef.current(e, item);
      };

      const handleMouseMove = (e: MouseEvent) => {
        onHoverItemRef.current(e, item);
      };

      const handleMouseLeave = () => {
        img.setAttribute('width', orgW.toString());
        img.setAttribute('height', orgH.toString());
        img.setAttribute('x', orgX.toString());
        img.setAttribute('y', orgY.toString());

        // Restore original visual states
        img.style.filter = getGlowFilter(isOptimal, isInSet);
        if (isOptimal || isInSet) {
          img.style.opacity = '1';
        } else {
          img.style.opacity = '0.85';
        }

        // Restore all other image opacities (read customSet from ref)
        const curSet = customSetRef.current;
        const curSetIds = new Set(curSet.map(s => s.id));
        images.forEach(other => {
          const otherId = other.getAttribute('data-id') || '';
          const otherInSet = curSetIds.has(otherId);
          const otherOptimal = paretoIds.has(otherId);
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
  }, [filteredData, xVar, yVar, colorVar, colorMinMax, size, showPareto, xLabel, yLabel, chartProps, auraSize, auraStyle, customSet, paretoIds, paretoItems, xLog, yLog]);

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
