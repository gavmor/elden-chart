import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { EquipmentItem, ActiveCategories } from '../types';
import { getItemStat, getAvailableStats, getActiveCategories } from '../utils';
import { ChartDimensions } from '../domain/ChartDimensions';
import { CategoryFilter } from '../domain/CategoryFilter';
import { BuildSet } from '../domain/BuildSet';
import { useEquipmentData } from '../../hooks/useEquipmentData';
import { useDeadlockData, useDeadlockAbilitiesData } from '../../hooks/useDeadlockData';
import { useValidatedParams } from '../../hooks/useValidatedParams';
import { useDeadlockTargetState } from '../../hooks/useDeadlockTargetState';
import { HERO_DICTIONARY, DEFAULT_HERO } from '../heroes';
import EquipmentChartHeader from './Header';
import EquipmentChartSidebar from './Sidebar';
import EquipmentChartPlot from './Plot';
import EquipmentChartTooltip from './Tooltip';

const EquipmentCompareModal = lazy(() => import('../CompareModal/EquipmentCompareModal'));

export default function EquipmentChart() {
  // Fetch Elden Ring equipment data
  const { data: eldenEquipment = [], isLoading: isEldenLoading, error: eldenError } = useEquipmentData();

  // Fetch Deadlock items
  const { params: validatedParams, setParam, searchParams } = useValidatedParams();
  const activeGame = validatedParams.game;
  const { x: xVar, y: yVar, color: colorVar, q: search } = validatedParams;

  const { data: deadlockUpgrades = [], isLoading: isUpgradesLoading, error: upgradesError } = useDeadlockData();
  const { data: deadlockAbilities = [], isLoading: isAbilitiesLoading, error: abilitiesError } = useDeadlockAbilitiesData();

  const deadlockEquipment = useMemo(() => {
    return [...deadlockUpgrades, ...deadlockAbilities];
  }, [deadlockUpgrades, deadlockAbilities]);

  const isDeadlockLoading = isUpgradesLoading || isAbilitiesLoading;
  const deadlockError = upgradesError || abilitiesError;

  const equipment = useMemo(() => {
    return activeGame === 'elden-ring' ? eldenEquipment : deadlockEquipment;
  }, [activeGame, eldenEquipment, deadlockEquipment]);


  const isLoading = activeGame === 'elden-ring' 
    ? (isEldenLoading && eldenEquipment.length === 0) 
    : (isDeadlockLoading && deadlockEquipment.length === 0);
  const error = activeGame === 'elden-ring' ? eldenError : deadlockError;

  // Local debounced search state to ensure responsive typing without URL lag
  const searchDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = useState(search);

  // Sync localSearch when the URL search param changes (e.g. on back/forward or initial load).
  // This is intentional: localSearch is a debounce buffer, not derived state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Deadlock Target Settings
  const deadlockState = useDeadlockTargetState();

  // Interaction State
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // Reset custom set and active categories when game mode switches to prevent invalid visual states
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomSet([]);
  }, [activeGame]);

  // Initialize active categories once data is loaded
  const categoryGroups = useMemo(() => {
    if (equipment.length === 0) return [];
    return getActiveCategories(equipment);
  }, [equipment]);

  // Set default active categories when data first loads or game changes
  useEffect(() => {
    if (categoryGroups.length === 0) return;

    // Build all-active map for every known category
    const allActive: ActiveCategories = {};
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        allActive[cat] = true;
      }
    }

    // If URL had a `cats` param, restrict to those categories
    const initialCats = validatedParams.cats;
    if (initialCats !== null) {
      const activeCatSet = new Set(initialCats);
      for (const cat of Object.keys(allActive)) {
        allActive[cat] = activeCatSet.has(cat);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveCategories(allActive);

    // Set default Y axis to first non-weight stat, unless URL already specified one
    const stats = getAvailableStats(equipment);
    const nonWeightStats = stats.filter(s => s.id !== 'weight');
    if (nonWeightStats.length > 0 && !searchParams.has('y')) {
      setParam('y', nonWeightStats[0].id);
    }
  }, [categoryGroups, equipment, searchParams, validatedParams.cats, setParam, activeGame]);

  const filteredData = useMemo(() => {
    const baseFiltered = equipment.filter(item => {
      if (customSet.some(s => s.id === item.id)) return true;
      if (!activeCategories[item.category]) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    return baseFiltered;
  }, [equipment, activeCategories, search, customSet]);

  const syncedCustomSet = useMemo(() => {
    return customSet.map(savedItem => {
      const latest = filteredData.find(d => d.id === savedItem.id);
      return latest || savedItem;
    });
  }, [customSet, filteredData]);

  const simulationContext = useMemo(() => {
    return {
      hero: deadlockState.selectedHero ? HERO_DICTIONARY[deadlockState.selectedHero] : DEFAULT_HERO,
      targetConfig: deadlockState.targetConfig,
      customSet: syncedCustomSet
    };
  }, [deadlockState.selectedHero, deadlockState.targetConfig, syncedCustomSet]);

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
    const values = filteredData.map(d => getItemStat(d, resolvedColorVar, simulationContext));
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [filteredData, resolvedColorVar, simulationContext]);

  const chartProps = useMemo(() => {
    if (filteredData.length === 0) return null;

    const xValues = filteredData.map(d => getItemStat(d, resolvedXVar, simulationContext));
    const yValues = filteredData.map(d => getItemStat(d, resolvedYVar, simulationContext));

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
  }, [filteredData, resolvedXVar, resolvedYVar, simulationContext]);

  const handleMouseMove = (e: MouseEvent, item: EquipmentItem) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;

    if (x + 250 > rect.width) x -= 280;
    if (y + 200 > rect.height) y -= 220;

    setTooltipPos({ x, y });
    setHoveredItem(item);
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



  const dimensions = new ChartDimensions(resolvedXVar, resolvedYVar, resolvedColorVar, validatedParams.xLog, validatedParams.yLog);
  const categoryFilter = new CategoryFilter(activeCategories);
  const buildSet = new BuildSet(syncedCustomSet);

  return (
    <div className="flex flex-col h-full bg-bg-main text-text-primary font-sans overflow-hidden">
      <EquipmentChartHeader
        loading={isLoading}
        itemCount={filteredData.length}
        activeGame={activeGame}
        onGameChange={(game) => setParam('game', game)}
      />

      <div className="flex flex-1 overflow-hidden">
        <EquipmentChartSidebar
          search={localSearch}
          onSearchChange={handleSearchChange}
          dimensions={dimensions}
          onDimensionsChange={(newDim) => {
            setParam('x', newDim.x);
            setParam('y', newDim.y);
            setParam('color', newDim.color);
            setParam('xLog', String(newDim.xLog));
            setParam('yLog', String(newDim.yLog));
          }}
          statOptions={statOptions}
          categoryGroups={categoryGroups}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(filter) => {
            const next = filter.getRawActive();
            setActiveCategories(next);
            const activeCatNames = filter.activeNames;
            setParam('cats', activeCatNames.length > 0 ? activeCatNames.join(',') : '');
          }}
          buildSet={buildSet}
          onBuildSetChange={(set) => setCustomSet(set.toArray())}
          onCompareSet={() => setIsCompareOpen(true)}
          showPareto={showPareto}
          onShowParetoChange={setShowPareto}
          filteredData={filteredData}
          activeGame={activeGame}
          selectedHero={deadlockState.selectedHero}
          onHeroChange={deadlockState.setSelectedHero}
          targetConfig={deadlockState.targetConfig}
          onTargetSpiritResistanceChange={deadlockState.setTargetSpiritResistance}
          onTargetBulletResistanceChange={deadlockState.setTargetBulletResistance}
          simulationContext={simulationContext}
        />

        <main className="flex-1 relative p-6 bg-bg-main flex flex-col" ref={chartRef}>
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main/80 z-20">
              <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
              <h2 className="text-xl font-medium text-text-bright mb-2">Summoning Data...</h2>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main z-20">
              <AlertCircle className="w-12 h-12 text-brand-danger mb-4" />
              <h2 className="text-xl font-medium text-text-bright mb-2">Connection Lost</h2>
              <p className="text-text-secondary">{error instanceof Error ? error.message : 'Failed to fetch'}</p>
            </div>
          ) : (
            <EquipmentChartPlot
              filteredData={filteredData}
              xVar={resolvedXVar}
              yVar={resolvedYVar}
              xLabel={xLabel}
              yLabel={yLabel}
              xLog={dimensions.xLog}
              yLog={dimensions.yLog}
              chartProps={chartProps}
              colorVar={resolvedColorVar}
              colorMinMax={colorMinMax}
              hoveredItemId={hoveredItem ? hoveredItem.id : null}
              onHoverItem={handleMouseMove}
              onLeavePlot={() => setHoveredItem(null)}
              customSet={customSet}
              onClickItem={handleToggleSet}
              showPareto={showPareto}
              simulationContext={simulationContext}
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
              simulationContext={simulationContext}
            />
          )}
        </main>
      </div>

      <Suspense fallback={null}>
        {isCompareOpen && (
          <EquipmentCompareModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            customSet={syncedCustomSet}
            simulationContext={simulationContext}
          />
        )}
      </Suspense>
    </div>
  );
}
