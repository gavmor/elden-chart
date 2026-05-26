import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, Sliders, Sparkles } from 'lucide-react';
import type { EquipmentItem, ActiveCategories, EquipmentKind } from '../types';
import { getItemStat, getAvailableStats, getActiveCategories } from '../utils';
import { useEquipmentData } from '../../hooks/useEquipmentData';
import { useValidatedParams } from '../../hooks/useValidatedParams';
import EquipmentChartHeader from './Header';
import EquipmentChartSidebar from './Sidebar';
import EquipmentChartPlot from './Plot';
import EquipmentChartTooltip from './Tooltip';
import EquipmentCompareModal from '../CompareModal/EquipmentCompareModal';

export default function EquipmentChart() {
  const { params, setParam, searchParams } = useValidatedParams();
  const { x: xVar, y: yVar, color: colorVar, q: search } = params;

  // Local debounced search state to ensure responsive typing without URL lag
  const searchDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = useState(search);

  // Sync localSearch when the URL search param changes (e.g. on back/forward or initial load)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Clean up debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);

  const handleSearchChange = (newSearch: string) => {
    setLocalSearch(newSearch);

    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      setParam('q', newSearch);
    }, 300);
  };

  const [activeCategories, setActiveCategories] = useState<ActiveCategories>({});
  const [showPareto, setShowPareto] = useState<boolean>(false);

  // Set Planner State
  const [customSet, setCustomSet] = useState<EquipmentItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // Aura Customizer State
  const [auraSize, setAuraSize] = useState<number>(3);
  const [auraStyle, setAuraStyle] = useState<'glow' | 'outline'>('glow');
  const [isGlowOpen, setIsGlowOpen] = useState<boolean>(false);
  const glowContainerRef = useRef<HTMLDivElement>(null);

  // Click outside to close glow controls popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (glowContainerRef.current && !glowContainerRef.current.contains(event.target as Node)) {
        setIsGlowOpen(false);
      }
    }
    if (isGlowOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGlowOpen]);

  // Fetch all equipment data
  const { data: equipment = [], isLoading, error } = useEquipmentData();

  // Initialize active categories once data is loaded
  const categoryGroups = useMemo(() => {
    if (equipment.length === 0) return [];
    return getActiveCategories(equipment);
  }, [equipment]);

  // Set default active categories when data first loads
  const categoriesInitialized = useRef(false);
  useEffect(() => {
    if (categoryGroups.length === 0 || categoriesInitialized.current) return;
    categoriesInitialized.current = true;

    // Build all-active map for every known category
    const allActive: ActiveCategories = {};
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        allActive[cat] = true;
      }
    }

    // If URL had a `cats` param, restrict to those categories
    const initialCats = params.cats;
    if (initialCats !== null) {
      const activeCatSet = new Set(initialCats);
      for (const cat of Object.keys(allActive)) {
        allActive[cat] = activeCatSet.has(cat);
      }
    }

    setActiveCategories(allActive);

    // Set default Y axis to first non-weight stat, unless URL already specified one
    const stats = getAvailableStats(equipment);
    const nonWeightStats = stats.filter(s => s.id !== 'weight');
    if (nonWeightStats.length > 0 && !searchParams.has('y')) {
      setParam('y', nonWeightStats[0].id);
    }
  }, [categoryGroups, equipment, searchParams, params.cats]);

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

  // Derive resolved/active axes and color settings for the plot.
  // If the URL-specified stat is not available in statOptions (e.g. during loading or due to kind switch),
  // we fallback safely without mutating the URL.
  const resolvedXVar = (statOptions.length > 0 && statOptions.some(o => o.id === xVar)) ? xVar : 'weight';
  const resolvedYVar = (statOptions.length > 0 && statOptions.some(o => o.id === yVar))
    ? yVar
    : (statOptions.find(o => o.id !== 'weight')?.id || 'weight');
  const resolvedColorVar = (colorVar === 'category' || (statOptions.length > 0 && statOptions.some(o => o.id === colorVar)))
    ? colorVar
    : 'category';

  const xLabel = statOptions.find(o => o.id === resolvedXVar)?.label || '';
  const yLabel = statOptions.find(o => o.id === resolvedYVar)?.label || '';

  const colorMinMax = useMemo(() => {
    if (resolvedColorVar === 'category') return null;
    const values = filteredData.map(d => getItemStat(d, resolvedColorVar));
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [filteredData, resolvedColorVar]);

  const chartProps = useMemo(() => {
    if (filteredData.length === 0) return null;

    const xValues = filteredData.map(d => getItemStat(d, resolvedXVar));
    const yValues = filteredData.map(d => getItemStat(d, resolvedYVar));

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
  }, [filteredData, resolvedXVar, resolvedYVar]);

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
    setActiveCategories(prev => {
      const next = { ...prev, [categoryName]: checked };
      const activeCatNames = Object.entries(next)
        .filter(([, v]) => v)
        .map(([k]) => k);
      setParam('cats', activeCatNames.length > 0 ? activeCatNames.join(',') : null);
      return next;
    });
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
      const activeCatNames = Object.entries(next)
        .filter(([, v]) => v)
        .map(([k]) => k);
      setParam('cats', activeCatNames.length > 0 ? activeCatNames.join(',') : null);
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
      const activeCatNames = Object.entries(next)
        .filter(([, v]) => v)
        .map(([k]) => k);
      setParam('cats', activeCatNames.length > 0 ? activeCatNames.join(',') : null);
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

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      <EquipmentChartHeader loading={isLoading} itemCount={filteredData.length} />

      <div className="flex flex-1 overflow-hidden">
        <EquipmentChartSidebar
          search={localSearch}
          onSearchChange={handleSearchChange}
          xVar={resolvedXVar}
          onXVarChange={(newX) => setParam('x', newX)}
          yVar={resolvedYVar}
          onYVarChange={(newY) => setParam('y', newY)}
          colorVar={resolvedColorVar}
          onColorVarChange={(newColor) => setParam('color', newColor)}
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
              xVar={resolvedXVar}
              yVar={resolvedYVar}
              xLabel={xLabel}
              yLabel={yLabel}
              chartProps={chartProps}
              colorVar={resolvedColorVar}
              colorMinMax={colorMinMax}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
              customSet={customSet}
              onClickItem={handleToggleSet}
              showPareto={showPareto}
              auraSize={auraSize}
              auraStyle={auraStyle}
            />
          )}

          {hoveredItem && !isLoading && (
            <EquipmentChartTooltip
              item={hoveredItem}
              tooltipPos={tooltipPos}
              xLabel={xLabel}
              yLabel={yLabel}
              xVar={resolvedXVar}
              yVar={resolvedYVar}
              colorVar={resolvedColorVar}
              colorMinMax={colorMinMax}
            />
          )}

          {/* Floating Action Button (FAB) for Glow Control */}
          {!isLoading && !error && (
            <div className="absolute bottom-6 right-6 z-30" ref={glowContainerRef}>
              {isGlowOpen && (
                <div 
                  className="absolute bottom-16 right-0 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 z-40"
                  role="dialog"
                  aria-label="Adjust Aura Appearance Settings"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-sm font-semibold text-white">Aura Appearance</span>
                    </div>
                  </div>

                  {/* Axis 1: Style Selection (Glow vs Outline) */}
                  <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-400">Aura Style</span>
                    <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setAuraStyle('glow')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          auraStyle === 'glow'
                            ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                        }`}
                        aria-label="Select soft glow style"
                      >
                        Soft Glow
                      </button>
                      <button
                        onClick={() => setAuraStyle('outline')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          auraStyle === 'outline'
                            ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                        }`}
                        aria-label="Select solid outline style"
                      >
                        Solid Outline
                      </button>
                    </div>
                  </div>

                  {/* Axis 2: Size Slider */}
                  <div className="flex flex-col gap-2 py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Aura Size / Weight</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 shadow-sm">
                        {auraSize === 0 ? 'None' : auraStyle === 'outline' ? `${auraSize <= 3 ? '1px' : auraSize <= 7 ? '2px' : '3px'}` : `${auraSize}px`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                      <span>Subtle (0px)</span>
                      <span>Maximum (10px)</span>
                    </div>
                    <input
                      id="glow-intensity-slider"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={auraSize}
                      onChange={(e) => setAuraSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                      aria-label="Aura Size/Thickness Slider"
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Slide to zero to completely disable glowing auras and solid outlines for all plotted equipment icons.
                  </p>
                </div>
              )}

              <button
                id="glow-intensity-fab"
                onClick={() => setIsGlowOpen(!isGlowOpen)}
                className={`flex items-center justify-center w-12 h-12 rounded-full border shadow-lg transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  isGlowOpen 
                    ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-100 hover:scale-105 active:scale-95' 
                    : 'bg-slate-800/90 hover:bg-slate-700 text-amber-500 border-slate-700 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95'
                }`}
                aria-haspopup="dialog"
                aria-expanded={isGlowOpen}
                aria-label="Adjust Aura Settings Panel"
                title="Adjust Aura Settings"
              >
                <Sliders className={`w-5 h-5 transition-transform duration-300 ${isGlowOpen ? 'rotate-90' : 'hover:rotate-12'}`} />
              </button>
            </div>
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
