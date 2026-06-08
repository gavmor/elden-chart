import { useState, useMemo, useRef, useEffect } from 'react';
import type { EquipmentItem, ActiveCategories } from '../types';
import { getItemStat, getAvailableStats, getActiveCategories } from '../domain/math';
import { useEquipmentData } from '../../hooks/useEquipmentData';
import { useDeadlockData, useDeadlockAbilitiesData, useDeadlockBaselines } from '../../hooks/useDeadlockData';
import { useValidatedParams } from '../../hooks/useValidatedParams';
import { useDeadlockTargetState } from '../../hooks/useDeadlockTargetState';
import { HERO_DICTIONARY, DEFAULT_HERO } from '../heroes';

export function useEquipmentChartState() {
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

  // Sync localSearch when the URL search param changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(search);
  }, [search]);

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

  const { data: deadlockBaselines } = useDeadlockBaselines();
  const investmentTracks = deadlockBaselines?.investmentTracks;

  const incomingDamage = useMemo(() => {
    if (!deadlockState.enemyAttacker) return 15;
    return HERO_DICTIONARY[deadlockState.enemyAttacker]?.baseBulletDamage ?? 15;
  }, [deadlockState.enemyAttacker]);

  // Reset custom set when game mode switches
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

    const allActive: ActiveCategories = {};
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        allActive[cat] = true;
      }
    }

    const initialCats = validatedParams.cats;
    if (initialCats !== null) {
      const activeCatSet = new Set(initialCats);
      for (const cat of Object.keys(allActive)) {
        allActive[cat] = activeCatSet.has(cat);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveCategories(allActive);

    const stats = getAvailableStats(equipment);
    const nonWeightStats = stats.filter(s => s.id !== 'weight');
    if (nonWeightStats.length > 0 && !searchParams.has('y')) {
      setParam('y', nonWeightStats[0].id);
    }
  }, [categoryGroups, equipment, searchParams, validatedParams.cats, setParam, activeGame]);

  const vacuumContext = useMemo(() => {
    return {
      hero: deadlockState.selectedHero ? HERO_DICTIONARY[deadlockState.selectedHero] : DEFAULT_HERO,
      customSet: [],
      investmentTracks,
      incomingDamage,
      engagementDistance: deadlockState.engagementDistance
    };
  }, [deadlockState.selectedHero, investmentTracks, incomingDamage, deadlockState.engagementDistance]);

  const [debuffFilterRange, setDebuffFilterRange] = useState<[number, number]>([0, 100]);

  const filteredData = useMemo(() => {
    const baseFiltered = equipment.filter(item => {
      if (!activeCategories[item.category]) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (activeGame === 'deadlock' && (debuffFilterRange[0] > 0 || debuffFilterRange[1] < 100)) {
      return baseFiltered.filter(item => {
        const debuff = getItemStat(item, 'debuff_mitigation', vacuumContext) * 100;
        // Float precision can be an issue, add a tiny epsilon
        return debuff >= debuffFilterRange[0] - 0.001 && debuff <= debuffFilterRange[1] + 0.001;
      });
    }

    return baseFiltered;
  }, [equipment, activeCategories, search, activeGame, debuffFilterRange, vacuumContext]);

  const syncedCustomSet = useMemo(() => {
    return customSet.map(savedItem => {
      const latest = filteredData.find(d => d.id === savedItem.id);
      return latest || savedItem;
    });
  }, [customSet, filteredData]);

  const simulationContext = useMemo(() => {
    return {
      hero: deadlockState.selectedHero ? HERO_DICTIONARY[deadlockState.selectedHero] : DEFAULT_HERO,
      customSet: syncedCustomSet,
      investmentTracks,
      incomingDamage,
      engagementDistance: deadlockState.engagementDistance
    };
  }, [deadlockState.selectedHero, syncedCustomSet, investmentTracks, incomingDamage, deadlockState.engagementDistance]);

  const statOptions = useMemo(() => {
    return getAvailableStats(filteredData);
  }, [filteredData]);

  const traitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const opt of statOptions) {
      counts[opt.id] = filteredData.filter(item => getItemStat(item, opt.id, vacuumContext) > 0).length;
    }
    return counts;
  }, [statOptions, filteredData, vacuumContext]);

  const statGroups = useMemo(() => {
    return statOptions.reduce<Record<string, import('../types').StatOption[]>>((acc, opt) => {
      if (!acc[opt.group]) acc[opt.group] = [];
      acc[opt.group].push(opt);
      return acc;
    }, {});
  }, [statOptions]);

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

  return {
    state: {
      isLoading,
      error,
      localSearch,
      activeCategories,
      showPareto,
      customSet,
      syncedCustomSet,
      isCompareOpen,
      categoryGroups,
      filteredData,
      simulationContext,
      vacuumContext,
      statOptions,
      resolvedXVar,
      resolvedYVar,
      resolvedColorVar,
      xLabel,
      yLabel,
      colorMinMax,
      chartProps,
      activeGame,
      validatedParams,
      deadlockState,
      traitCounts,
      statGroups,
      debuffFilterRange
    },
    actions: {
      setParam,
      handleSearchChange,
      setActiveCategories,
      setShowPareto,
      setCustomSet,
      setIsCompareOpen,
      setDebuffFilterRange,
      handleToggleSet: (item: EquipmentItem) => {
        setCustomSet(prev => {
          const exists = prev.some(i => i.id === item.id);
          return exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
        });
      }
    }
  };
}
