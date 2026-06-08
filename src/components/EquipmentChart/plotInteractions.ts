import type { EquipmentItem, ColorKey, SimulationContext } from '../types';
import { getItemColor } from '../display/styling';
import { getGlowFilter, FOCAL_COLOR } from './plotStyles';

export interface SetupPlotInteractionsParams {
  plot: HTMLElement | SVGSVGElement;
  container: HTMLElement;
  filteredData: EquipmentItem[];
  customSetRef: React.MutableRefObject<EquipmentItem[]>;
  paretoIds: Set<string>;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  simulationContext?: SimulationContext;
  auraSize: number;
  auraStyle: 'glow' | 'outline';
  onHoverItemRef: React.MutableRefObject<(e: MouseEvent, item: EquipmentItem) => void>;
  onLeavePlotRef: React.MutableRefObject<() => void>;
  onClickItemRef: React.MutableRefObject<(item: EquipmentItem) => void>;
}

export function setupPlotInteractions({
  plot,
  container,
  filteredData,
  customSetRef,
  paretoIds,
  colorVar,
  colorMinMax,
  simulationContext,
  auraSize,
  auraStyle,
  onHoverItemRef,
  onLeavePlotRef,
  onClickItemRef
}: SetupPlotInteractionsParams) {
  const images = plot.querySelectorAll('image');
  const voronoiPaths = plot.querySelectorAll('path[data-id]');
  
  // 1. Initial State for Images
  images.forEach((img) => {
    const itemId = img.getAttribute('data-id');
    const item = filteredData.find(d => d.id === itemId);
    if (!item || !itemId) return;

    const isInSet = customSetRef.current.some(s => s.id === itemId);
    const isOptimal = paretoIds.has(itemId);

    // Store attributes on DOM node
    img.setAttribute('data-id', itemId);

    const orgX = parseFloat(img.getAttribute('x') || '0');
    const orgY = parseFloat(img.getAttribute('y') || '0');
    img.setAttribute('data-org-x', orgX.toString());
    img.setAttribute('data-org-y', orgY.toString());

    // Initial opacity based on set membership
    img.style.opacity = isInSet ? '1' : '0.85';

    // Initial dropshadow glow
    const initialColor = getItemColor(item, colorVar, colorMinMax, simulationContext);
    const filter = getGlowFilter({
      isOptimal,
      isInSet,
      initialColor,
      auraSize,
      auraStyle,
      datasetSize: filteredData.length
    });
    img.style.filter = filter;
    if (isOptimal || isInSet) {
      img.style.opacity = '1';
    }

    // Transition styles
    img.style.transition = 'width 0.15s ease-out, height 0.15s ease-out, x 0.15s ease-out, y 0.15s ease-out';
  });

  // 2. Interaction Handlers on Voronoi Paths
  voronoiPaths.forEach((path) => {
    const itemId = path.getAttribute('data-id');
    const item = filteredData.find(d => d.id === itemId);
    if (!item || !itemId) return;

    const isOptimal = paretoIds.has(itemId);
    const initialColor = getItemColor(item, colorVar, colorMinMax, simulationContext);

    // Ensure cursor is pointer
    (path as HTMLElement).style.cursor = 'pointer';

    // Hover Interaction Handlers
    const handleMouseEnter = (e: MouseEvent) => {
      const img = plot.querySelector(`image[data-id="${itemId}"]`) as SVGImageElement | null;
      if (!img) return;

      container.setAttribute('data-hovered-id', itemId);
      
      const orgX = parseFloat(img.getAttribute('data-org-x') || '0');
      const orgY = parseFloat(img.getAttribute('data-org-y') || '0');
      const orgW = 28;
      const orgH = 28;
      const hoverW = 46;
      const hoverH = 46;
      const deltaW = hoverW - orgW;
      const deltaH = hoverH - orgH;

      img.setAttribute('width', hoverW.toString());
      img.setAttribute('height', hoverH.toString());
      img.setAttribute('x', (orgX - deltaW / 2).toString());
      img.setAttribute('y', (orgY - deltaH / 2).toString());

      // Bring to front
      const parent = img.parentNode;
      if (parent) {
        parent.appendChild(img);
      }

      // Apply hover glow
      const currentlyInSet = customSetRef.current.some(s => s.id === itemId);
      const hoverColor = (isOptimal || currentlyInSet) ? FOCAL_COLOR : initialColor;
      img.style.filter = `drop-shadow(0 0 12px ${hoverColor}) drop-shadow(0 0 4px ${hoverColor})`;
      img.style.opacity = '1';

      // Dim other images
      const curSet = customSetRef.current;
      const curSetIds = new Set(curSet.map(s => s.id));
      images.forEach(other => {
        if (other !== img) {
          const otherId = other.getAttribute('data-id') || '';
          const otherInSet = curSetIds.has(otherId);
          const otherOptimal = paretoIds.has(otherId);
          (other as SVGElement).style.opacity = otherInSet || otherOptimal ? '0.7' : '0.15';
        }
      });

      onHoverItemRef.current(e, item);
    };

    const handleMouseMove = (e: MouseEvent) => {
      onHoverItemRef.current(e, item);
    };

    const handleMouseLeave = () => {
      const img = plot.querySelector(`image[data-id="${itemId}"]`) as SVGImageElement | null;
      if (!img) return;

      container.removeAttribute('data-hovered-id');
      
      const orgX = parseFloat(img.getAttribute('data-org-x') || '0');
      const orgY = parseFloat(img.getAttribute('data-org-y') || '0');
      const orgW = 28;
      const orgH = 28;
      
      img.setAttribute('width', orgW.toString());
      img.setAttribute('height', orgH.toString());
      img.setAttribute('x', orgX.toString());
      img.setAttribute('y', orgY.toString());

      // Restore original state
      const currentlyInSet = customSetRef.current.some(s => s.id === itemId);
      img.style.filter = getGlowFilter({
        isOptimal,
        isInSet: currentlyInSet,
        initialColor,
        auraSize,
        auraStyle,
        datasetSize: filteredData.length
      });
      img.style.opacity = (isOptimal || currentlyInSet) ? '1' : '0.85';

      // Restore other images
      const curSet = customSetRef.current;
      const curSetIds = new Set(curSet.map(s => s.id));
      images.forEach(other => {
        const otherId = other.getAttribute('data-id') || '';
        const otherInSet = curSetIds.has(otherId);
        const otherOptimal = paretoIds.has(otherId);
        (other as SVGElement).style.opacity = otherInSet || otherOptimal ? '1' : '0.85';
      });

      onLeavePlotRef.current();
    };

    const handleMouseClick = () => {
      onClickItemRef.current(item);
    };

    path.addEventListener('mouseenter', handleMouseEnter as EventListener);
    path.addEventListener('mousemove', handleMouseMove as EventListener);
    path.addEventListener('mouseleave', handleMouseLeave as EventListener);
    path.addEventListener('click', handleMouseClick as EventListener);
  });
}

export interface SyncCustomSetStylesParams {
  container: HTMLElement;
  filteredData: EquipmentItem[];
  customSet: EquipmentItem[];
  paretoIds: Set<string>;
  colorVar: ColorKey;
  colorMinMax: { min: number; max: number } | null;
  simulationContext?: SimulationContext;
  auraSize: number;
  auraStyle: 'glow' | 'outline';
}

export function syncCustomSetStyles({
  container,
  filteredData,
  customSet,
  paretoIds,
  colorVar,
  colorMinMax,
  simulationContext,
  auraSize,
  auraStyle
}: SyncCustomSetStylesParams) {
  const images = container.querySelectorAll('image');
  const hoveredId = container.getAttribute('data-hovered-id');

  images.forEach((img) => {
    const itemId = img.getAttribute('data-id');
    const item = filteredData.find(d => d.id === itemId);
    if (!item || !itemId) return;

    const isInSet = customSet.some(s => s.id === itemId);
    const isOptimal = paretoIds.has(itemId);
    const initialColor = getItemColor(item, colorVar, colorMinMax, simulationContext);

    if (itemId === hoveredId) {
      const hoverColor = (isOptimal || isInSet) ? FOCAL_COLOR : initialColor;
      img.style.filter = `drop-shadow(0 0 12px ${hoverColor}) drop-shadow(0 0 4px ${hoverColor})`;
      return;
    }
    
    img.style.filter = getGlowFilter({
      isOptimal,
      isInSet,
      initialColor,
      auraSize,
      auraStyle,
      datasetSize: filteredData.length
    });
    
    if (hoveredId) {
      img.style.opacity = (isOptimal || isInSet) ? '0.7' : '0.15';
    } else {
      img.style.opacity = (isOptimal || isInSet) ? '1' : '0.85';
    }
  });
}
