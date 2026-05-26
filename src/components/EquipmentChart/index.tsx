import React, { useState, useMemo, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { EquipmentItem, ActiveCategories, ColorKey, EquipmentKind } from '../types';
import { getItemStat, getAvailableStats, getActiveCategories } from '../utils';
import { useEquipmentData } from '../../hooks/useEquipmentData';
import EquipmentChartHeader from './Header';
import EquipmentChartSidebar from './Sidebar';
import EquipmentChartPlot from './Plot';
import EquipmentChartTooltip from './Tooltip';
import EquipmentCompareModal from '../CompareModal/EquipmentCompareModal';

export default function EquipmentChart() {
  // Controls State
  const [xVar, setXVar] = useState<string>('weight');
  const [yVar, setYVar] = useState<string>('weight');
  const [colorVar, setColorVar] = useState<ColorKey>('category');
  const [search, setSearch] = useState<string>('');
  const [activeCategories, setActiveCategories] = useState<ActiveCategories>({});
  const [showPareto, setShowPareto] = useState<boolean>(false);

  // Set Planner State
  const [customSet, setCustomSet] = useState<EquipmentItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch all equipment data
  const { data: equipment = [], isLoading, error } = useEquipmentData();

  // Initialize active categories once data is loaded
  const categoryGroups = useMemo(() => {
    if (equipment.length === 0) return [];
    return getActiveCategories(equipment);
  }, [equipment]);

  // Set default active categories when data first loads
  const categoriesInitialized = useRef(false);
  if (categoryGroups.length > 0 && !categoriesInitialized.current) {
    categoriesInitialized.current = true;
    const allActive: ActiveCategories = {};
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        allActive[cat] = true;
      }
    }
    setActiveCategories(allActive);

    // Set default Y axis to first non-weight stat if available
    const stats = getAvailableStats(equipment);
    const nonWeightStats = stats.filter(s => s.id !== 'weight');
    if (nonWeightStats.length > 0 && yVar === 'weight') {
      setYVar(nonWeightStats[0].id);
    }
  }

  const filteredData = useMemo(() => {
    return equipment.filter(item => {
      if (!activeCategories[item.category]) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [equipment, activeCategories, search]);

  // Dynamic stat options based on filtered data
  const statOptions = useMemo(() => {
    return getAvailableStats(filteredData);
  }, [filteredData]);

  const colorMinMax = useMemo(() => {
    if (colorVar === 'category') return null;
    const values = filteredData.map(d => getItemStat(d, colorVar));
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [filteredData, colorVar]);

  const chartProps = useMemo(() => {
    if (filteredData.length === 0) return null;

    const xValues = filteredData.map(d => getItemStat(d, xVar));
    const yValues = filteredData.map(d => getItemStat(d, yVar));

    const xMinRaw = Math.min(...xValues);
    const xMaxRaw = Math.max(...xValues);
    const xRange = xMaxRaw - xMinRaw || 1;
    const xMin = Math.max(0, xMinRaw - xRange * 0.05);
    const xMax = xMaxRaw + xRange * 0.05;

    const yMinRaw = Math.min(...yValues);
    const yMaxRaw = Math.max(...yValues);
    const yRange = yMaxRaw - yMinRaw || 1;
    const yMin = Math.max(0, yMinRaw - yRange * 0.05);
    const yMax = yMaxRaw + yRange * 0.05;

    return { xMin, xMax, yMin, yMax };
  }, [filteredData, xVar, yVar]);

  const handleMouseMove = (e: React.MouseEvent, item: EquipmentItem) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;

    if (x + 250 > rect.width) x -= 280;
    if (y + 200 > rect.height) y -= 220;

    setTooltipPos({ x, y });
    setHoveredItem(item);
  };

  const handleCategoryToggle = (categoryName: string, checked: boolean) => {
    setActiveCategories(prev => ({ ...prev, [categoryName]: checked }));
  };

  const handleToggleGroup = (kind: EquipmentKind, selectAll: boolean) => {
    setActiveCategories(prev => {
      const next = { ...prev };
      const group = categoryGroups.find(g => g.kind === kind);
      if (group) {
        for (const cat of group.categories) {
          next[cat] = selectAll;
        }
      }
      return next;
    });
  };

  const handleToggleAll = (selectAll: boolean) => {
    setActiveCategories(prev => {
      const next = { ...prev };
      for (const group of categoryGroups) {
        for (const cat of group.categories) {
          next[cat] = selectAll;
        }
      }
      return next;
    });
  };

  const handleToggleSet = (item: EquipmentItem) => {
    setCustomSet(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const xLabel = statOptions.find(o => o.id === xVar)?.label || '';
  const yLabel = statOptions.find(o => o.id === yVar)?.label || '';

  // Reset axes if current selection is no longer available
  if (statOptions.length > 0 && !statOptions.some(o => o.id === xVar)) {
    setXVar('weight');
  }
  if (statOptions.length > 0 && !statOptions.some(o => o.id === yVar)) {
    setYVar(statOptions.find(o => o.id !== 'weight')?.id || 'weight');
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      <EquipmentChartHeader loading={isLoading} itemCount={filteredData.length} />

      <div className="flex flex-1 overflow-hidden">
        <EquipmentChartSidebar
          search={search}
          onSearchChange={setSearch}
          xVar={xVar}
          onXVarChange={setXVar}
          yVar={yVar}
          onYVarChange={setYVar}
          colorVar={colorVar}
          onColorVarChange={setColorVar}
          statOptions={statOptions}
          categoryGroups={categoryGroups}
          activeCategories={activeCategories}
          onCategoryToggle={handleCategoryToggle}
          onToggleGroup={handleToggleGroup}
          onToggleAll={handleToggleAll}
          customSet={customSet}
          onRemoveFromSet={handleToggleSet}
          onCompareSet={() => setIsCompareOpen(true)}
          showPareto={showPareto}
          onShowParetoChange={setShowPareto}
        />

        <main className="flex-1 relative p-6 bg-slate-900 flex flex-col" ref={chartRef}>
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Summoning Data...</h2>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Connection Lost</h2>
              <p className="text-slate-400">{(error as any).message || 'Failed to fetch'}</p>
            </div>
          ) : (
            <EquipmentChartPlot
              filteredData={filteredData}
              xVar={xVar}
              yVar={yVar}
              xLabel={xLabel}
              yLabel={yLabel}
              chartProps={chartProps}
              colorVar={colorVar}
              colorMinMax={colorMinMax}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
              customSet={customSet}
              onClickItem={handleToggleSet}
              showPareto={showPareto}
            />
          )}

          {hoveredItem && !isLoading && (
            <EquipmentChartTooltip
              item={hoveredItem}
              tooltipPos={tooltipPos}
              xLabel={xLabel}
              yLabel={yLabel}
              xVar={xVar}
              yVar={yVar}
              colorVar={colorVar}
              colorMinMax={colorMinMax}
            />
          )}
        </main>
      </div>

      <EquipmentCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        customSet={customSet}
      />
    </div>
  );
}
